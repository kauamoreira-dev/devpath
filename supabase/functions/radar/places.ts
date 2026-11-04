// Cliente da Google Places API (New). Só pede os campos que a interface mostra (field mask),
// para não pagar por dados que não usamos.
import type { PlaceLite } from "./opportunity.ts";

export class UpstreamError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
    this.name = "UpstreamError";
  }
}

const FIELDS = [
  "id", "displayName", "formattedAddress", "nationalPhoneNumber", "internationalPhoneNumber",
  "websiteUri", "googleMapsUri", "primaryTypeDisplayName", "businessStatus", "rating", "userRatingCount",
];

type RawPlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  primaryTypeDisplayName?: { text?: string };
  businessStatus?: string;
  rating?: number;
  userRatingCount?: number;
};

export function toLite(p: RawPlace): PlaceLite {
  return {
    id: p.id ?? "",
    name: p.displayName?.text ?? "",
    category: p.primaryTypeDisplayName?.text ?? "",
    address: p.formattedAddress ?? "",
    phone: p.nationalPhoneNumber ?? "",
    phoneIntl: p.internationalPhoneNumber ?? "",
    website: p.websiteUri ?? "",
    mapsUrl: p.googleMapsUri ?? "",
    status: p.businessStatus ?? "",
    rating: typeof p.rating === "number" ? p.rating : null,
    ratingCount: typeof p.userRatingCount === "number" ? p.userRatingCount : null,
  };
}

async function call(url: string, init: RequestInit): Promise<Record<string, unknown>> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, signal: AbortSignal.timeout(12_000) });
  } catch (_e) {
    throw new UpstreamError(504, "places_timeout", "O Google não respondeu a tempo. Tente de novo.");
  }
  const body = await res.json().catch(() => ({})) as Record<string, unknown>;
  if (res.ok) return body;
  const status = (body.error as { status?: string } | undefined)?.status ?? "";
  console.error("places error", res.status, status, JSON.stringify(body).slice(0, 500));
  if (res.status === 400) throw new UpstreamError(400, "places_bad_request", "O Google recusou a busca. Ajuste os termos e tente de novo.");
  if (res.status === 401 || res.status === 403) {
    throw new UpstreamError(503, "places_not_authorized", "A chave do Google Places foi recusada. Confira se a Places API (New) está ativada e se a chave tem permissão.");
  }
  if (res.status === 429) throw new UpstreamError(429, "places_quota", "A cota do Google Places acabou por agora. Tente mais tarde.");
  throw new UpstreamError(502, "places_unavailable", "O Google Places está indisponível no momento. Tente de novo em instantes.");
}

export async function searchText(apiKey: string, textQuery: string, pageToken?: string): Promise<{ places: PlaceLite[]; nextPageToken: string }> {
  const body: Record<string, unknown> = { textQuery, languageCode: "pt-BR", regionCode: "BR", pageSize: 20 };
  if (pageToken) body.pageToken = pageToken;
  const data = await call("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELDS.map((f) => "places." + f).join(",") + ",nextPageToken",
    },
    body: JSON.stringify(body),
  });
  const places = Array.isArray(data.places) ? (data.places as RawPlace[]).map(toLite).filter((p) => p.id && p.name) : [];
  return { places, nextPageToken: typeof data.nextPageToken === "string" ? data.nextPageToken : "" };
}

export async function getPlace(apiKey: string, id: string): Promise<PlaceLite> {
  const data = await call(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}?languageCode=pt-BR&regionCode=BR`, {
    method: "GET",
    headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": FIELDS.join(",") },
  });
  const p = toLite(data as RawPlace);
  if (!p.id) throw new UpstreamError(404, "place_not_found", "Empresa não encontrada no Google.");
  return p;
}
