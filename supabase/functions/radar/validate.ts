// Validação de entrada do Radar. Sem dependências: roda no Deno (Edge Function) e no Node (testes).

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR",
  "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export type SiteFilter = "all" | "none" | "social" | "own";
export type PhoneFilter = "all" | "with";

export interface SearchInput {
  city: string;
  uf: string;
  segment: string;
  name: string;
  terms: string;
  pageToken?: string;
  site: SiteFilter;
  phone: PhoneFilter;
}

export interface AiLead {
  name: string;
  category: string;
  city: string;
  hasPhone: boolean;
  websiteStatus: "none" | "social" | "own" | "unknown";
  websiteDomain: string;
  ratingCount: number | null;
  signals: string[];
  notes: string;
  status: string;
}

export interface AiOffer {
  nome: string;
  desc: string;
  preco: number;
  mensal: number;
  prazo: number;
}

export interface AiInput {
  task: "analyze" | "message" | "proposal";
  lead: AiLead;
  offers: AiOffer[];
  offerName: string;
  channel: "WhatsApp" | "Instagram" | "E-mail";
  sender: { nome: string; cidade: string };
}

const CONTROL = /[\u0000-\u001f\u007f]/g;

export function cleanText(value: unknown, field: string, max: number, required = false): string {
  if (value === undefined || value === null) value = "";
  if (typeof value !== "string") throw new ValidationError(`Campo inválido: ${field}.`);
  const text = value.normalize("NFC").replace(CONTROL, " ").replace(/\s+/g, " ").trim();
  if (required && !text) throw new ValidationError(`Preencha o campo ${field}.`);
  if (text.length > max) throw new ValidationError(`O campo ${field} aceita no máximo ${max} caracteres.`);
  return text;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "string" && (allowed as readonly string[]).includes(value)) return value as T;
  throw new ValidationError("Opção inválida.");
}

function num(value: unknown, min: number, max: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function parseSearch(body: Record<string, unknown>): SearchInput {
  const city = cleanText(body.city, "cidade", 60, true);
  if (city.length < 2) throw new ValidationError("Informe o nome da cidade.");
  const uf = cleanText(body.uf, "estado", 2, true).toUpperCase();
  if (!(UFS as readonly string[]).includes(uf)) throw new ValidationError("Estado inválido.");
  const segment = cleanText(body.segment, "segmento", 60);
  const name = cleanText(body.name, "nome da empresa", 80);
  const terms = cleanText(body.terms, "termos", 80);
  if (!segment && !name && !terms) throw new ValidationError("Informe um segmento, um nome de empresa ou um termo de busca.");
  let pageToken: string | undefined;
  if (body.pageToken !== undefined && body.pageToken !== null && body.pageToken !== "") {
    if (typeof body.pageToken !== "string" || body.pageToken.length > 2048 || !/^[A-Za-z0-9_\-=+/.]+$/.test(body.pageToken)) {
      throw new ValidationError("Página inválida.");
    }
    pageToken = body.pageToken;
  }
  return {
    city, uf, segment, name, terms, pageToken,
    site: oneOf(body.site, ["all", "none", "social", "own"] as const, "all"),
    phone: oneOf(body.phone, ["all", "with"] as const, "all"),
  };
}

/** Monta a frase enviada ao Google. Ex.: "restaurantes em Santarém - PA". */
export function buildQuery(input: Pick<SearchInput, "city" | "uf" | "segment" | "name" | "terms">): string {
  const what = [input.segment, input.name, input.terms].filter(Boolean).join(" ");
  return `${what} em ${input.city} - ${input.uf}`;
}

export function parsePlaceId(value: unknown): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{10,300}$/.test(value)) throw new ValidationError("Identificador de empresa inválido.");
  return value;
}

export function parseAi(body: Record<string, unknown>): AiInput {
  const task = oneOf(body.task, ["analyze", "message", "proposal"] as const, "analyze");
  const raw = (body.lead && typeof body.lead === "object" ? body.lead : {}) as Record<string, unknown>;
  const signals = Array.isArray(raw.signals) ? raw.signals.slice(0, 8).map((s, i) => cleanText(s, `sinal ${i + 1}`, 160)) : [];
  const rc = raw.ratingCount;
  const lead: AiLead = {
    name: cleanText(raw.name, "nome", 120, true),
    category: cleanText(raw.category, "categoria", 80),
    city: cleanText(raw.city, "cidade", 80),
    hasPhone: raw.hasPhone === true,
    websiteStatus: oneOf(raw.websiteStatus, ["none", "social", "own", "unknown"] as const, "unknown"),
    websiteDomain: cleanText(raw.websiteDomain, "domínio", 120),
    ratingCount: rc === null || rc === undefined || rc === "" ? null : num(rc, 0, 1_000_000),
    signals,
    notes: cleanText(raw.notes, "observações", 1200),
    status: cleanText(raw.status, "status", 30),
  };
  const offers = (Array.isArray(body.offers) ? body.offers : []).slice(0, 6).map((o, i) => {
    const r = (o && typeof o === "object" ? o : {}) as Record<string, unknown>;
    return {
      nome: cleanText(r.nome, `oferta ${i + 1}`, 80),
      desc: cleanText(r.desc, `descrição da oferta ${i + 1}`, 400),
      preco: num(r.preco, 0, 1_000_000),
      mensal: num(r.mensal, 0, 100_000),
      prazo: num(r.prazo, 0, 365),
    };
  }).filter((o) => o.nome);
  const senderRaw = (body.sender && typeof body.sender === "object" ? body.sender : {}) as Record<string, unknown>;
  return {
    task,
    lead,
    offers,
    offerName: cleanText(body.offerName, "oferta", 80),
    channel: oneOf(body.channel, ["WhatsApp", "Instagram", "E-mail"] as const, "WhatsApp"),
    sender: { nome: cleanText(senderRaw.nome, "seu nome", 80), cidade: cleanText(senderRaw.cidade, "sua cidade", 60) },
  };
}
