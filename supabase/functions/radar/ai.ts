// Camada de IA desacoplada. O resto do código só conhece a interface AiProvider;
// trocar de provedor é implementar outra classe e escolher por AI_PROVIDER.
import Anthropic from "npm:@anthropic-ai/sdk@1.4.0";

export class AiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
    this.name = "AiError";
  }
}

export interface AiProvider {
  json(opts: { system: string; user: string; schema: Record<string, unknown>; maxTokens: number }): Promise<unknown>;
}

// Modelos que aceitam o fallback automático do servidor quando um pedido é recusado.
const FALLBACK_MODELS = new Set(["claude-opus-5-5", "claude-opus-5", "claude-fable-5-1", "claude-sonnet-5-5"]);

class AnthropicProvider implements AiProvider {
  private client: Anthropic;
  constructor(apiKey: string, private model: string, private effort: "low" | "medium" | "high") {
    this.client = new Anthropic({ apiKey, maxRetries: 2, timeout: 60_000 });
  }

  async json({ system, user, schema, maxTokens }: { system: string; user: string; schema: Record<string, unknown>; maxTokens: number }) {
    let res;
    try {
      res = await this.client.beta.messages.create({
        model: this.model,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
        output_config: { effort: this.effort, format: { type: "json_schema", schema } },
        ...(FALLBACK_MODELS.has(this.model) ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
      });
    } catch (e) {
      if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
        throw new AiError(503, "ai_not_authorized", "A chave da IA foi recusada. Confira a ANTHROPIC_API_KEY.");
      }
      if (e instanceof Anthropic.RateLimitError) throw new AiError(429, "ai_rate_limited", "A IA está com muitas requisições agora. Tente em um minuto.");
      if (e instanceof Anthropic.BadRequestError) {
        console.error("ai bad request", e.message);
        throw new AiError(502, "ai_bad_request", "A IA recusou o pedido. Tente de novo; se continuar, revise as configurações do modelo.");
      }
      if (e instanceof Anthropic.APIError) {
        console.error("ai api error", e.status, e.message);
        throw new AiError(502, "ai_unavailable", "A IA está indisponível no momento. Tente de novo em instantes.");
      }
      console.error("ai connection error", e);
      throw new AiError(504, "ai_unavailable", "Não foi possível falar com a IA agora. Tente de novo.");
    }
    if (res.stop_reason === "refusal") throw new AiError(422, "ai_refused", "A IA não quis gerar esse conteúdo. Ajuste as anotações e tente de novo.");
    if (res.stop_reason === "max_tokens") throw new AiError(502, "ai_truncated", "A resposta da IA veio incompleta. Tente de novo.");
    const text = res.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
    try {
      return JSON.parse(text);
    } catch {
      throw new AiError(502, "ai_bad_output", "A IA devolveu uma resposta em formato inesperado. Tente de novo.");
    }
  }
}

export function getProvider(): AiProvider | null {
  const provider = (Deno.env.get("AI_PROVIDER") ?? "anthropic").toLowerCase();
  if (provider === "anthropic") {
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    if (!key) return null;
    const effort = (Deno.env.get("AI_EFFORT") ?? "low") as "low" | "medium" | "high";
    return new AnthropicProvider(key, Deno.env.get("AI_MODEL") ?? "claude-opus-5-5", ["low", "medium", "high"].includes(effort) ? effort : "low");
  }
  console.error("AI_PROVIDER não suportado:", provider);
  return null;
}
