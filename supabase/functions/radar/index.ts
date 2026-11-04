// Edge Function "radar": busca de empresas (Google Places), atualização de uma empresa e IA.
// Todas as chaves ficam aqui no servidor. O navegador só manda o token de login do usuário.
import { createClient } from "npm:@supabase/supabase-js@2.118.0";
import { parseAi, parsePlaceId, parseSearch, buildQuery, ValidationError } from "./validate.ts";
import { classify, passesFilters, type Source } from "./opportunity.ts";
import { getPlace, searchText, UpstreamError } from "./places.ts";
import { osmPlace, osmSearch } from "./osm.ts";
import { consume, LimitError, refund, usageToday } from "./limits.ts";
import { AiError, getProvider } from "./ai.ts";
import { buildUserPrompt, SCHEMAS, SYSTEM } from "./prompts.ts";

const DEFAULT_ORIGINS = "https://devpath-sand.vercel.app,http://localhost:8765";

function cors(origin: string): Record<string, string> {
  const allowed = (Deno.env.get("ALLOWED_ORIGINS") ?? DEFAULT_ORIGINS).split(",").map((s) => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin) || /^https:\/\/devpath-[a-z0-9-]+-kauamoreira-devs-projects\.vercel\.app$/.test(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json; charset=utf-8" } });
}

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

Deno.serve(async (req) => {
  const headers = cors(req.headers.get("origin") ?? "");
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405, headers);

  // Autenticação: o token de sessão do Supabase é validado aqui mesmo.
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Entre na sua conta para usar o Radar.", code: "unauthenticated" }, 401, headers);
  const { data: auth, error: authError } = await admin.auth.getUser(token);
  if (authError || !auth?.user) return json({ error: "Sua sessão expirou. Entre de novo.", code: "unauthenticated" }, 401, headers);
  const userId = auth.user.id;

  if (Number(req.headers.get("content-length") ?? 0) > 32_000) return json({ error: "Requisição grande demais." }, 413, headers);
  let body: Record<string, unknown>;
  try {
    body = await req.json();
    if (!body || typeof body !== "object") throw new Error();
  } catch {
    return json({ error: "Corpo da requisição inválido." }, 400, headers);
  }

  const placesKey = Deno.env.get("GOOGLE_PLACES_API_KEY") ?? "";
  // Com chave do Google, usa o Google Places (pago). Sem chave, usa o OpenStreetMap (gratuito).
  const source: Source = placesKey ? "google" : "osm";
  let consumed: "search" | "details" | "ai" | null = null;

  try {
    switch (body.action) {
      case "status": {
        return json({ placesConfigured: true, source, aiConfigured: !!getProvider(), usage: await usageToday(admin, userId) }, 200, headers);
      }

      case "search": {
        const input = parseSearch(body);
        await consume(admin, userId, "search");
        consumed = "search";
        const query = buildQuery(input);
        const { places, nextPageToken } = source === "google"
          ? await searchText(placesKey, query, input.pageToken)
          : { places: await osmSearch(input), nextPageToken: "" };
        const results = places
          .map((p) => ({ place: p, opportunity: classify(p, source), source }))
          .filter((r) => passesFilters(r.opportunity, r.place, input.site, input.phone));
        consumed = null;
        return json({ query, source, results, total: places.length, nextPageToken, usage: await usageToday(admin, userId) }, 200, headers);
      }

      case "place": {
        const id = parsePlaceId(body.placeId);
        const placeSource: Source = id.startsWith("osm-") ? "osm" : "google";
        if (placeSource === "google" && !placesKey) return json({ error: "Esse lead veio do Google e a chave do Google Places não está configurada.", code: "places_not_configured" }, 503, headers);
        await consume(admin, userId, "details");
        consumed = "details";
        const place = placeSource === "osm" ? await osmPlace(id) : await getPlace(placesKey, id);
        consumed = null;
        return json({ place, source: placeSource, opportunity: classify(place, placeSource) }, 200, headers);
      }

      case "ai": {
        const input = parseAi(body);
        const provider = getProvider();
        if (!provider) return json({ error: "A IA ainda não foi configurada: falta a chave da API.", code: "ai_not_configured" }, 503, headers);
        await consume(admin, userId, "ai");
        consumed = "ai";
        const result = await provider.json({
          system: SYSTEM,
          user: buildUserPrompt(input),
          schema: SCHEMAS[input.task] as unknown as Record<string, unknown>,
          maxTokens: 8000,
        });
        consumed = null;
        return json({ task: input.task, result }, 200, headers);
      }

      default:
        return json({ error: "Ação desconhecida." }, 400, headers);
    }
  } catch (e) {
    if (consumed) await refund(admin, userId, consumed); // a falha não conta no limite do usuário
    if (e instanceof ValidationError) return json({ error: e.message, code: "invalid_input" }, 400, headers);
    if (e instanceof LimitError) return json({ error: e.message, code: "limit_reached" }, 429, headers);
    if (e instanceof UpstreamError) return json({ error: e.message, code: e.code }, e.status, headers);
    if (e instanceof AiError) return json({ error: e.message, code: e.code }, e.status, headers);
    console.error("radar unexpected", e);
    return json({ error: "Algo deu errado do nosso lado. Tente de novo.", code: "internal" }, 500, headers);
  }
});
