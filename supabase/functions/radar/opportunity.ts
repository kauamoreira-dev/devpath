// Classificação de oportunidade. Usa só fatos verificáveis vindos da fonte (Google Places).
// Nunca conclui que a empresa "não tem site": diz apenas o que a fonte informou.

export interface PlaceLite {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  phoneIntl: string;
  website: string;
  mapsUrl: string;
  status: string; // OPERATIONAL | CLOSED_TEMPORARILY | CLOSED_PERMANENTLY | ""
  rating: number | null;
  ratingCount: number | null;
}

export type Level = "alta" | "media" | "baixa" | "indisponivel";

export interface Signal {
  key: string;
  label: string;
  points: number;
}

export interface Opportunity {
  score: number;
  level: Level;
  website: "none" | "social" | "own";
  websiteDomain: string;
  mobile: boolean;
  signals: Signal[];
}

/** Domínios que não são um site próprio da empresa (redes sociais, agregadores, links curtos do Google). */
export const NOT_OWN_SITE = [
  "instagram.com", "facebook.com", "fb.com", "fb.me", "m.facebook.com", "linktr.ee", "linkr.bio", "beacons.ai", "bio.link",
  "wa.me", "whatsapp.com", "api.whatsapp.com", "tiktok.com", "youtube.com", "twitter.com", "x.com",
  "ifood.com.br", "goomer.app", "anota.ai", "sites.google.com", "business.site", "g.page", "goo.gl", "maps.app.goo.gl",
  "linkedin.com", "kwai.com", "pinterest.com",
];

export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

export function websiteKind(url: string): "none" | "social" | "own" {
  if (!url) return "none";
  const host = domainOf(url);
  if (!host) return "none";
  return NOT_OWN_SITE.some((d) => host === d || host.endsWith("." + d)) ? "social" : "own";
}

/** Celular brasileiro: DDD + 9 dígitos começando com 9 (após remover +55). */
export function isMobileBR(phone: string): boolean {
  let d = (phone || "").replace(/\D/g, "");
  if (d.startsWith("55") && d.length >= 12) d = d.slice(2);
  d = d.replace(/^0+/, "");
  return d.length === 11 && d[2] === "9";
}

export const LEVEL_LABEL: Record<Level, string> = {
  alta: "Oportunidade alta",
  media: "Oportunidade média",
  baixa: "Oportunidade baixa",
  indisponivel: "Fechado",
};

export type Source = "google" | "osm";
export const SOURCE_NAME: Record<Source, string> = { google: "Google", osm: "OpenStreetMap" };

export function classify(p: PlaceLite, source: Source = "google"): Opportunity {
  const src = SOURCE_NAME[source];
  const signals: Signal[] = [];
  const website = websiteKind(p.website);
  const websiteDomain = domainOf(p.website);
  const phone = p.phoneIntl || p.phone;
  const mobile = isMobileBR(phone);

  if (p.status === "CLOSED_PERMANENTLY" || p.status === "CLOSED_TEMPORARILY") {
    signals.push({
      key: "closed",
      label: p.status === "CLOSED_PERMANENTLY" ? `Marcado como fechado permanentemente no ${src}` : `Marcado como fechado temporariamente no ${src}`,
      points: 0,
    });
    return { score: 0, level: "indisponivel", website, websiteDomain, mobile, signals };
  }

  if (website === "none") signals.push({ key: "no_site", label: `Site não informado no ${src}`, points: 45 });
  else if (website === "social") signals.push({ key: "social_site", label: `O link cadastrado é rede social ou agregador (${websiteDomain})`, points: 30 });
  else signals.push({ key: "own_site", label: `Site cadastrado: ${websiteDomain}`, points: 0 });

  if (phone) signals.push({ key: "phone", label: mobile ? "Telefone comercial público (celular)" : "Telefone comercial público", points: 15 });
  else signals.push({ key: "no_phone", label: `Telefone não informado no ${src}`, points: 0 });

  // Avaliações só existem no Google; no OpenStreetMap esse sinal não se aplica.
  if (source === "google") {
    if (p.ratingCount === null || p.ratingCount === 0) signals.push({ key: "no_reviews", label: "Sem avaliações no Google", points: 10 });
    else if (p.ratingCount < 15) signals.push({ key: "few_reviews", label: `Poucas avaliações no Google (${p.ratingCount})`, points: 10 });
  }

  const score = signals.reduce((a, s) => a + s.points, 0);
  const level: Level = score >= 55 ? "alta" : score >= 30 ? "media" : "baixa";
  return { score, level, website, websiteDomain, mobile, signals };
}

export function passesFilters(o: Opportunity, p: PlaceLite, site: string, phone: string): boolean {
  if (site !== "all" && o.website !== site) return false;
  if (phone === "with" && !(p.phone || p.phoneIntl)) return false;
  return true;
}
