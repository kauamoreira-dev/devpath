// Teste de interface do Radar com backend SIMULADO (fixture de teste, não são dados reais).
// Rode com: npx serve -l 8765 . (em outro terminal) e depois: node tests/e2e/radar.e2e.mjs
// Requer Playwright instalado.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL || "http://localhost:8765/";
const OUT = process.env.SHOTS || "";

const stub = () => {
  const FIX = {
    status: { placesConfigured: true, aiConfigured: true, usage: { search: { used: 2, limit: 25 }, details: { used: 0, limit: 60 }, ai: { used: 0, limit: 40 } } },
    results: [
      { place: { id: "FIXTURE_place_0001", name: "Empresa Fictícia A", category: "Restaurante", address: "Rua Um, 10 - Centro, Cidade Teste - PA", phone: "(93) 99111-0000", phoneIntl: "+55 93 99111-0000", website: "", mapsUrl: "https://maps.google.com/?cid=1", status: "OPERATIONAL", rating: null, ratingCount: null },
        opportunity: { score: 70, level: "alta", website: "none", websiteDomain: "", mobile: true, signals: [{ key: "no_site", label: "Site não informado no Google", points: 45 }, { key: "phone", label: "Telefone comercial público (celular)", points: 15 }, { key: "no_reviews", label: "Sem avaliações no Google", points: 10 }] } },
      { place: { id: "FIXTURE_place_0002", name: "Empresa Fictícia B", category: "Restaurante", address: "Rua Dois, 20, Cidade Teste - PA", phone: "(93) 3522-0000", phoneIntl: "", website: "javascript:alert(1)", mapsUrl: "", status: "OPERATIONAL", rating: 4.6, ratingCount: 210 },
        opportunity: { score: 30, level: "media", website: "social", websiteDomain: "instagram.com", mobile: false, signals: [{ key: "social_site", label: "O link cadastrado é rede social ou agregador (instagram.com)", points: 30 }] } },
      { place: { id: "FIXTURE_place_0003", name: "Empresa Fictícia C", category: "Restaurante", address: "Av. Três, Cidade Teste - PA", phone: "", phoneIntl: "", website: "https://exemplo-ficticio.com.br", mapsUrl: "", status: "CLOSED_PERMANENTLY", rating: 4.1, ratingCount: 50 },
        opportunity: { score: 0, level: "indisponivel", website: "own", websiteDomain: "exemplo-ficticio.com.br", mobile: false, signals: [{ key: "closed", label: "Marcado como fechado permanentemente no Google", points: 0 }] } },
    ],
  };
  const httpErr = (error, code) => ({ data: null, error: { name: "FunctionsHttpError", context: { json: async () => ({ error, code }) } } });
  window.__calls = [];
  const client = {
    auth: {
      onAuthStateChange(cb) { setTimeout(() => cb("SIGNED_IN", window.__noSession ? null : { user: { id: "user-fixture" } }), 30); return { data: { subscription: { unsubscribe() {} } } }; },
      signOut: async () => ({}),
    },
    from() {
      const q = { select: () => q, eq: () => q, maybeSingle: async () => ({ data: null, error: null }), upsert: async () => ({ error: null }) };
      return q;
    },
    functions: {
      async invoke(name, { body }) {
        window.__calls.push(body);
        await new Promise((r) => setTimeout(r, 120));
        if (body.action === "status") return { data: FIX.status, error: null };
        if (body.action === "search") {
          if (body.city === "Erro") return httpErr("O Google Places está indisponível no momento. Tente de novo em instantes.", "places_unavailable");
          return { data: { query: `${body.segment} em ${body.city} - ${body.uf}`, results: FIX.results, total: 3, nextPageToken: "", usage: FIX.status.usage }, error: null };
        }
        if (body.action === "ai" && body.task === "analyze") return { data: { task: "analyze", result: { resumo: "Resumo de teste.", fatos: ["Site não informado no Google"], hipoteses: [{ texto: "Pode usar só o Instagram", como_confirmar: "Perguntar" }], servicos: [{ oferta: "Site com agendamento online", motivo: "Teste" }], perguntas: ["Como vocês recebem pedidos hoje?"] } }, error: null };
        if (body.action === "ai" && body.task === "message") return { data: { task: "message", result: { mensagem: "Mensagem de teste gerada." } }, error: null };
        if (body.action === "ai" && body.task === "proposal") return { data: { task: "proposal", result: { titulo: "Proposta teste", descricao: "Descrição adaptada de teste.", inclui: ["Item A", "Item B"], observacoes: "Obs teste", confirmar_antes: ["Confirmar horário"] } }, error: null };
        return httpErr("Ação desconhecida.", "bad");
      },
    },
  };
  Object.defineProperty(window, "supabase", { value: { createClient: () => client }, writable: false });
};

const browser = await chromium.launch();
const errors = [];
const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
page.on("pageerror", (e) => errors.push(e.message));
await page.addInitScript(stub);
await page.goto(BASE);
await page.waitForTimeout(600);
await page.click("#tab-radar");
await page.waitForTimeout(400);
assert.match(await page.textContent("#rzUsage"), /2 de 25 buscas hoje/);

// validação no cliente
await page.fill("#rzCity", "");
await page.click("#rzGo");
assert.match(await page.textContent("#rzMsg"), /Informe a cidade/);

// erro do servidor com botão de tentar de novo
await page.fill("#rzCity", "Erro");
await page.fill("#rzSeg", "restaurantes");
await page.click("#rzGo");
await page.waitForSelector(".rz-error");
assert.ok(await page.isVisible("#rzRetry"));

// busca com resultados
await page.fill("#rzCity", "Cidade Teste");
await page.click("#rzGo");
await page.waitForSelector(".rz-card:not(.rz-skel)");
assert.equal(await page.locator(".rz-card").count(), 3);
assert.match(await page.textContent(".rz-grid"), /Site não informado/);
assert.doesNotMatch(await page.innerHTML(".rz-grid"), /javascript:alert/, "link perigoso não pode virar href");
assert.match(await page.textContent(".rz-grid"), /Fechado no Google/);
if (OUT) await page.screenshot({ path: OUT + "/radar-desktop.png", fullPage: true });

// salvar lead e evitar duplicata
const before = await page.evaluate(() => window.DevPath.state.pipeline.length);
await page.click('[data-save="FIXTURE_place_0001"]');
await page.waitForTimeout(200);
assert.equal(await page.evaluate(() => window.DevPath.state.pipeline.length), before + 1);
assert.ok(await page.isVisible("text=Ver lead · Novo"));
await page.click('[data-msg="FIXTURE_place_0001"]');
await page.waitForSelector("#leadDlg[open]");
assert.equal(await page.evaluate(() => window.DevPath.state.pipeline.length), before + 1, "não pode duplicar");
const lead = await page.evaluate(() => window.DevPath.state.pipeline.find((p) => p.placeId === "FIXTURE_place_0001"));
assert.equal(lead.source, "radar");
assert.match(lead.obs, /não mostra um site cadastrado/);

// WhatsApp só por link, com a mensagem editável
await page.fill("#ldMsg", "Olá, mensagem revisada");
const wa = await page.getAttribute("#ldWa", "href");
assert.ok(wa.startsWith("https://wa.me/5593991110000?text="), wa);
assert.match(decodeURIComponent(wa), /mensagem revisada/);

// IA: análise, mensagem e proposta
await page.click("#ldAnalyze");
await page.waitForSelector("text=Resumo de teste.");
await page.click("#ldAiMsg");
await page.waitForTimeout(300);
assert.equal(await page.inputValue("#ldMsg"), "Mensagem de teste gerada.");
await page.click("#ldPropAi");
await page.waitForSelector("#ldUseProp");
if (OUT) await page.screenshot({ path: OUT + "/lead-desktop.png" });
await page.click("#ldUseProp");
await page.waitForTimeout(300);
assert.ok(await page.isVisible("#v-propostas"));
assert.match(await page.textContent("#propDoc"), /Descrição adaptada de teste/);
assert.ok(await page.isVisible("#prDraftNote"));

// registrar envio muda a etapa
await page.evaluate((id) => window.DevPath.openLead(id), lead.id);
await page.click("#ldSent");
await page.waitForTimeout(200);
assert.equal(await page.evaluate((id) => window.DevPath.state.pipeline.find((p) => p.id === id).status, lead.id), "contato");
await page.keyboard.press("Escape");

// painel de leads: filtros
await page.click("#tab-pipeline");
await page.selectOption("#pfOrig", "radar");
assert.match(await page.textContent("#pfCount"), /^1 de/);

// celular: sem rolagem lateral no Radar nem na ficha
await page.setViewportSize({ width: 390, height: 844 });
await page.click("#tab-radar");
await page.waitForTimeout(200);
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= 390), "Radar estoura a largura no celular");
if (OUT) await page.screenshot({ path: OUT + "/radar-mobile.png", fullPage: true });
await page.evaluate((id) => window.DevPath.openLead(id), lead.id);
await page.waitForTimeout(200);
assert.ok(await page.evaluate(() => { const d = document.querySelector("#leadDlg"); return d.scrollWidth <= d.clientWidth + 1; }), "Ficha estoura a largura no celular");
if (OUT) await page.screenshot({ path: OUT + "/lead-mobile.png" });

// sem login: o Radar pede para entrar
const p2 = await browser.newPage();
await p2.addInitScript(() => { window.__noSession = true; });
await p2.addInitScript(stub);
await p2.goto(BASE);
await p2.waitForTimeout(500);
await p2.evaluate(() => document.querySelector("#auth").hidden = true);
await p2.evaluate(() => window.DevPath.show("radar"));
await p2.evaluate(() => window.DevPath.changed());
assert.match(await p2.textContent("#rzGate"), /Entre na sua conta/);
assert.ok(await p2.isDisabled("#rzGo"));

assert.deepEqual(errors, [], "erros de JavaScript na página");
await browser.close();
console.log("radar e2e: ok");
