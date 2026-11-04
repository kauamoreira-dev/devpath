// Limites de uso (custo e abuso). A contagem é atômica no banco (função radar_try_consume).
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.118.0";

export type Kind = "search" | "details" | "ai";

export class LimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LimitError";
  }
}

function envInt(name: string, fallback: number): number {
  const v = Number(Deno.env.get(name));
  return Number.isFinite(v) && v > 0 ? Math.floor(v) : fallback;
}

export function limits() {
  return {
    search: { daily: envInt("RADAR_SEARCH_DAILY", 25), monthly: envInt("RADAR_SEARCH_MONTHLY", 900) },
    details: { daily: envInt("RADAR_DETAILS_DAILY", 60), monthly: envInt("RADAR_DETAILS_MONTHLY", 900) },
    ai: { daily: envInt("RADAR_AI_DAILY", 40), monthly: envInt("RADAR_AI_MONTHLY", 1500) },
  };
}

const LABEL: Record<Kind, string> = { search: "buscas", details: "atualizações de empresa", ai: "usos da IA" };

export async function consume(admin: SupabaseClient, userId: string, kind: Kind): Promise<void> {
  const l = limits()[kind];
  const { data, error } = await admin.rpc("radar_try_consume", {
    p_user: userId, p_kind: kind, p_daily_limit: l.daily, p_monthly_limit: l.monthly,
  });
  if (error) {
    console.error("radar_try_consume", error.message);
    throw new Error("usage_check_failed");
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.allowed) {
    if ((row?.used_today ?? 0) >= l.daily) throw new LimitError(`Você chegou ao limite de ${l.daily} ${LABEL[kind]} por dia. Amanhã libera de novo.`);
    throw new LimitError(`O limite mensal de ${LABEL[kind]} da plataforma foi atingido. Ele protege contra custos inesperados e pode ser ajustado nas configurações.`);
  }
}

export async function refund(admin: SupabaseClient, userId: string, kind: Kind): Promise<void> {
  const { error } = await admin.rpc("radar_refund", { p_user: userId, p_kind: kind });
  if (error) console.error("radar_refund", error.message);
}

export async function usageToday(admin: SupabaseClient, userId: string) {
  const { data } = await admin.from("radar_usage").select("searches,details,ai_calls")
    .eq("user_id", userId).eq("day", new Date().toISOString().slice(0, 10)).maybeSingle();
  const l = limits();
  return {
    search: { used: data?.searches ?? 0, limit: l.search.daily },
    details: { used: data?.details ?? 0, limit: l.details.daily },
    ai: { used: data?.ai_calls ?? 0, limit: l.ai.daily },
  };
}
