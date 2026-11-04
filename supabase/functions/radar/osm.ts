// Fonte gratuita: OpenStreetMap (Nominatim para achar a cidade, Overpass para listar as empresas).
// Dados sob licença ODbL: podem ser guardados, desde que a atribuição apareça.
// Políticas de uso: identificar o app no User-Agent e não fazer requisições em massa.
import type { PlaceLite } from "./opportunity.ts";
import { UpstreamError } from "./places.ts";

const UA = "DevPath/1.0 (+https://devpath-sand.vercel.app)";
// Servidores públicos do Overpass, em ordem de preferência. O principal (overpass-api.de) recusa
// pedidos vindos do datacenter do Supabase (406), então fica por último.
const OVERPASS_SERVERS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];
const RADIUS_M = 10_000; // raio a partir do centro da cidade (área urbana)

export const UF_NAME: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará", DF: "Distrito Federal",
  ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais",
  PA: "Pará", PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
};

// Segmento digitado → filtros de tags do OpenStreetMap.
const SEGMENTS: Array<[RegExp, string[], string]> = [
  [/pizza/, ['["amenity"~"^(restaurant|fast_food)$"]["cuisine"~"pizza",i]'], "Pizzaria"],
  [/hamburg|burger/, ['["amenity"~"^(restaurant|fast_food)$"]["cuisine"~"burger",i]'], "Hamburgueria"],
  [/restaurant/, ['["amenity"="restaurant"]'], "Restaurante"],
  [/lanchonete|lanche|fast ?food/, ['["amenity"="fast_food"]'], "Lanchonete"],
  [/padaria|panifica/, ['["shop"="bakery"]'], "Padaria"],
  [/cafe|cafeteria/, ['["amenity"="cafe"]'], "Cafeteria"],
  [/sorvet|acai/, ['["amenity"="ice_cream"]', '["shop"="ice_cream"]'], "Sorveteria"],
  [/\bbar(es)?\b|boteco|choperia/, ['["amenity"~"^(bar|pub)$"]'], "Bar"],
  [/barbear/, ['["shop"="hairdresser"]'], "Barbearia ou cabeleireiro"],
  [/salao|saloes|cabelei|beleza|estetic|manicure/, ['["shop"~"^(hairdresser|beauty)$"]'], "Salão de beleza"],
  [/odonto|dentist/, ['["amenity"="dentist"]', '["healthcare"="dentist"]'], "Odontologia"],
  [/clinica|medic|consultorio|saude/, ['["amenity"~"^(clinic|doctors)$"]', '["healthcare"~"^(clinic|doctor)$"]'], "Clínica"],
  [/academia|fitness|crossfit|musculacao/, ['["leisure"="fitness_centre"]'], "Academia"],
  [/pet ?shop|petshop|pet/, ['["shop"="pet"]'], "Pet shop"],
  [/veterin/, ['["amenity"="veterinary"]'], "Veterinária"],
  [/oficina|mecanic|auto ?center/, ['["shop"~"^(car_repair|tyres)$"]'], "Oficina"],
  [/roupa|moda|boutique|confec/, ['["shop"~"^(clothes|boutique|fashion)$"]'], "Loja de roupas"],
  [/calcad|sapat/, ['["shop"="shoes"]'], "Loja de calçados"],
  [/imobili/, ['["office"="estate_agent"]', '["shop"="estate_agent"]'], "Imobiliária"],
  [/contab/, ['["office"="accountant"]'], "Contabilidade"],
  [/advoca|advogad/, ['["office"="lawyer"]'], "Advocacia"],
  [/tatu/, ['["shop"="tattoo"]'], "Estúdio de tatuagem"],
  [/auto ?escola/, ['["amenity"="driving_school"]'], "Autoescola"],
  [/idioma|ingles|escola de lingua/, ['["amenity"="language_school"]'], "Escola de idiomas"],
  [/farmac|drogaria/, ['["amenity"="pharmacy"]'], "Farmácia"],
  [/hotel|pousada|hostel/, ['["tourism"~"^(hotel|guest_house|hostel|motel)$"]'], "Hospedagem"],
  [/mercad|supermerc|mercearia/, ['["shop"~"^(supermarket|convenience|greengrocer)$"]'], "Mercado"],
  [/otica/, ['["shop"="optician"]'], "Ótica"],
  [/floricult|flores/, ['["shop"="florist"]'], "Floricultura"],
  [/papelar|grafica/, ['["shop"~"^(stationery|copyshop)$"]', '["craft"="printer"]'], "Papelaria ou gráfica"],
];

const KIND_LABEL: Record<string, string> = {
  restaurant: "Restaurante", fast_food: "Lanchonete", cafe: "Cafeteria", bar: "Bar", pub: "Bar", ice_cream: "Sorveteria",
  bakery: "Padaria", hairdresser: "Cabeleireiro", beauty: "Salão de beleza", dentist: "Odontologia", clinic: "Clínica",
  doctors: "Consultório", fitness_centre: "Academia", pet: "Pet shop", veterinary: "Veterinária", car_repair: "Oficina",
  clothes: "Loja de roupas", estate_agent: "Imobiliária", accountant: "Contabilidade", lawyer: "Advocacia", tattoo: "Tatuagem",
  driving_school: "Autoescola", language_school: "Escola de idiomas", pharmacy: "Farmácia", hotel: "Hotel", guest_house: "Pousada",
  supermarket: "Supermercado", convenience: "Conveniência", optician: "Ótica", florist: "Floricultura", shoes: "Calçados",
};

export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

/** Deixa só letras, números e espaço: o texto vira um regex seguro dentro da consulta Overpass. */
export function safeRegex(s: string): string {
  return s.replace(/[^\p{L}\p{N} ]+/gu, " ").replace(/\s+/g, " ").trim().slice(0, 60);
}

export function segmentFilters(segment: string): { filters: string[]; label: string } | null {
  const n = normalize(segment);
  if (!n) return null;
  for (const [re, filters, label] of SEGMENTS) if (re.test(n)) return { filters, label };
  return null;
}

const NAMED_KEYS = ["shop", "amenity", "office", "craft", "healthcare", "leisure", "tourism"];

/** Monta a consulta Overpass. Segmento conhecido vira filtro de tag; nome/termos viram busca no nome. */
export function buildOverpass(areaClause: string, segment: string, name: string, terms: string, limit = 60): { query: string; label: string } {
  const seg = segmentFilters(segment);
  const nameText = safeRegex([name, seg ? "" : segment, seg || name ? "" : terms].filter(Boolean).join(" "));
  const nameFilter = nameText ? `["name"~"${nameText}",i]` : "";
  let parts: string[];
  if (seg) parts = seg.filters.map((f) => `nwr${f}${nameFilter}["name"](${areaClause});`);
  else if (nameFilter) parts = NAMED_KEYS.map((k) => `nwr${nameFilter}["${k}"](${areaClause});`);
  else parts = [];
  const query = `[out:json][timeout:25];(${parts.join("")});out tags center ${limit};`;
  return { query, label: seg ? seg.label : "" };
}

export function formatPhoneBR(raw: string): string {
  const first = String(raw || "").split(/[;,/]/)[0];
  let d = first.replace(/\D/g, "");
  if (d.startsWith("55") && d.length >= 12) d = d.slice(2);
  d = d.replace(/^0+/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return first.trim();
}

type OsmEl = { type: string; id: number; tags?: Record<string, string> };

function socialUrl(v: string, base: string): string {
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return base + v.replace(/^@/, "").replace(/^\/+/, "");
}

export function elementToPlace(el: OsmEl, fallbackLabel: string, city: string, uf: string): PlaceLite | null {
  const t = el.tags ?? {};
  if (!t.name) return null;
  const kind = t.shop ?? t.amenity ?? t.office ?? t.healthcare ?? t.leisure ?? t.tourism ?? t.craft ?? "";
  const website = t.website || t["contact:website"] || t.url ||
    socialUrl(t["contact:instagram"] || t.instagram || "", "https://instagram.com/") ||
    socialUrl(t["contact:facebook"] || t.facebook || "", "https://facebook.com/");
  const phone = t.phone || t["contact:phone"] || t["contact:mobile"] || t.mobile || t["contact:whatsapp"] || "";
  const street = [t["addr:street"], t["addr:housenumber"]].filter(Boolean).join(", ");
  const address = [street, t["addr:suburb"], t["addr:city"] || city, uf].filter(Boolean).join(" - ");
  return {
    id: `osm-${el.type[0]}-${el.id}`,
    name: t.name,
    category: KIND_LABEL[kind] || fallbackLabel || "",
    address,
    phone: phone ? formatPhoneBR(phone) : "",
    phoneIntl: "",
    website: /^https?:\/\//i.test(website) ? website : website ? "https://" + website : "",
    mapsUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
    status: t["disused:shop"] || t["disused:amenity"] ? "CLOSED_PERMANENTLY" : "",
    rating: null,
    ratingCount: null,
  };
}

async function getJson(url: string, init: RequestInit, what: string, timeoutMs = 30_000): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, headers: { "User-Agent": UA, "Accept": "application/json", ...(init.headers ?? {}) }, signal: AbortSignal.timeout(timeoutMs) });
  } catch {
    throw new UpstreamError(504, "osm_timeout", `O ${what} demorou para responder. Tente de novo em instantes.`);
  }
  if (res.status === 429) throw new UpstreamError(429, "osm_busy", "O servidor gratuito do OpenStreetMap está ocupado. Espere um minuto e tente de novo.");
  if (!res.ok) {
    console.error("osm error", what, res.status, (await res.text().catch(() => "")).slice(0, 300));
    throw new UpstreamError(502, "osm_unavailable", `O ${what} está indisponível no momento. Tente de novo em instantes.`);
  }
  return await res.json();
}

/** Roda a consulta no primeiro servidor Overpass que responder. */
async function overpass(query: string): Promise<{ elements?: OsmEl[] }> {
  let last: unknown = null;
  for (const server of OVERPASS_SERVERS) {
    try {
      return await getJson(`${server}?${new URLSearchParams({ data: query })}`, {}, "OpenStreetMap", 25_000) as { elements?: OsmEl[] };
    } catch (e) {
      last = e;
      console.error("overpass falhou em", server);
    }
  }
  throw last ?? new UpstreamError(502, "osm_unavailable", "O OpenStreetMap está indisponível no momento. Tente de novo em instantes.");
}

const areaCache = new Map<string, string>();

/** Acha a cidade e devolve a cláusula de raio (centro da cidade) para o Overpass. */
export async function cityArea(city: string, uf: string): Promise<string> {
  const key = normalize(city) + "|" + uf;
  const hit = areaCache.get(key);
  if (hit) return hit;
  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
    city, state: UF_NAME[uf] ?? uf, country: "Brasil", format: "jsonv2", limit: "3",
  })}`;
  const list = await getJson(url, {}, "serviço de mapas") as Array<{ osm_type: string; osm_id: number; lat: string; lon: string; addresstype?: string }>;
  if (!Array.isArray(list) || !list.length) throw new UpstreamError(404, "city_not_found", `Não encontrei a cidade ${city} - ${uf}. Confira o nome.`);
  const best = list.find((x) => x.addresstype === "city" || x.addresstype === "town") ?? list[0];
  const lat = Number(best.lat), lon = Number(best.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new UpstreamError(404, "city_not_found", `Não encontrei a cidade ${city} - ${uf}. Confira o nome.`);
  const clause = `around:${RADIUS_M},${lat},${lon}`;
  areaCache.set(key, clause);
  return clause;
}

export async function osmSearch(input: { city: string; uf: string; segment: string; name: string; terms: string }): Promise<PlaceLite[]> {
  const area = await cityArea(input.city, input.uf);
  const { query, label } = buildOverpass(area, input.segment, input.name, input.terms);
  if (!query.includes("nwr")) return [];
  const data = await overpass(query);
  const seen = new Set<string>();
  const out: PlaceLite[] = [];
  for (const el of data.elements ?? []) {
    const p = elementToPlace(el, label, input.city, input.uf);
    if (!p) continue;
    const k = normalize(p.name) + "|" + p.phone.replace(/\D/g, "");
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export async function osmPlace(id: string): Promise<PlaceLite> {
  const m = /^osm-([nwr])-(\d{1,15})$/.exec(id);
  if (!m) throw new UpstreamError(400, "bad_id", "Identificador de empresa inválido.");
  const type = { n: "node", w: "way", r: "relation" }[m[1] as "n" | "w" | "r"];
  const data = await overpass(`[out:json][timeout:15];${type}(${m[2]});out tags center;`);
  const el = data.elements?.[0];
  const p = el ? elementToPlace(el, "", "", "") : null;
  if (!p) throw new UpstreamError(404, "place_not_found", "Essa empresa não existe mais no OpenStreetMap.");
  return p;
}
