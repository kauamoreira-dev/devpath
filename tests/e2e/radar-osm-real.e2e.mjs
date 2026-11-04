// Fluxo completo com dados REAIS do OpenStreetMap (resposta gravada em tests/fixtures) passando pelo
// código de produção (elementToPlace + classify) e pela interface: busca, salvar lead, rascunho de proposta.
// O servidor é simulado só no transporte; os dados e a lógica são os reais. Rode com o site servido em :8765.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { elementToPlace } from "../../supabase/functions/radar/osm.ts";
import { classify } from "../../supabase/functions/radar/opportunity.ts";
const { chromium } = createRequire(import.meta.url)("playwright");

const BASE = process.env.BASE_URL || "http://localhost:8765/";
const OUT = process.env.SHOTS || "";
const raw = JSON.parse(readFileSync(new URL("../fixtures/osm-santarem-restaurantes.json", import.meta.url)));
const results = raw.elements.map((el) => elementToPlace(el, "Restaurante", "Santarém", "PA")).filter(Boolean)
  .map((place) => ({ place, opportunity: classify(place, "osm"), source: "osm" }));
assert.equal(results.length, 4);
assert.equal(results[0].place.phone, "(93) 99186-4540");
assert.equal(results[0].opportunity.website, "social");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.addInitScript((data) => {
  const client = {
    auth: { onAuthStateChange(cb) { setTimeout(() => cb("SIGNED_IN", { user: { id: "u" } }), 30); return { data: { subscription: { unsubscribe() {} } } }; }, signOut: async () => ({}) },
    from() { const q = { select: () => q, eq: () => q, maybeSingle: async () => ({ data: null, error: null }), upsert: async () => ({ error: null }) }; return q; },
    functions: { async invoke(_n, { body }) {
      if (body.action === "status") return { data: { placesConfigured: true, source: "osm", aiConfigured: false, usage: { search: { used: 0, limit: 25 }, details: { used: 0, limit: 60 }, ai: { used: 0, limit: 40 } } }, error: null };
      if (body.action === "search") return { data: { query: `${body.segment} em ${body.city} - ${body.uf}`, source: "osm", results: data, total: data.length, nextPageToken: "", usage: { search: { used: 1, limit: 25 } } }, error: null };
      return { data: null, error: { name: "FunctionsHttpError", context: { json: async () => ({ error: "não esperado", code: "x" }) } } };
    } },
  };
  Object.defineProperty(window, "supabase", { value: { createClient: () => client }, writable: false });
}, results);
await page.goto(BASE);
await page.waitForTimeout(600);
await page.click("#tab-radar");
await page.fill("#rzCity", "Santarém");
await page.selectOption("#rzUf", "PA");
await page.fill("#rzSeg", "restaurantes");
await page.click("#rzGo");
await page.waitForSelector(".rz-card:not(.rz-skel)");
assert.equal(await page.locator(".rz-card").count(), 4);
const grid = await page.textContent(".rz-grid");
assert.match(grid, /Churrascaria Boi Gordo/);
assert.match(grid, /Aky Lanche/);
assert.match(await page.textContent("#rzSummary"), /fonte: OpenStreetMap/);
assert.match(await page.textContent("#rzAttribTxt"), /OpenStreetMap/);
assert.doesNotMatch(grid, /Avaliações/, "OSM não tem avaliações");
assert.ok(await page.locator('.rz-card:has-text("Aky Lanche") a:has-text("Procurar contato no Google")').count() === 1);
if (OUT) await page.screenshot({ path: OUT + "/real-radar.png", fullPage: true });

// salvar o lead real
await page.click('[data-save="osm-n-11384216431"]');
await page.waitForTimeout(150);
const lead = await page.evaluate(() => window.DevPath.state.pipeline.find((p) => p.placeId === "osm-n-11384216431"));
assert.equal(lead.nome, "Churrascaria Boi Gordo");
assert.equal(lead.whats, "(93) 99186-4540");
assert.equal(lead.dataSource, "osm");
assert.equal(lead.obs, "", "falta de site no mapa aberto não vira argumento de venda");

// ficha + WhatsApp com o número real + rascunho gratuito de proposta
await page.evaluate((id) => window.DevPath.openLead(id), lead.id);
await page.waitForSelector("#leadDlg[open]");
assert.ok((await page.getAttribute("#ldWa", "href")).startsWith("https://wa.me/5593991864540?text="));
assert.equal(await page.locator("#ldAiMsg").count(), 0, "sem chave de IA não mostra botão de IA");
await page.click("#ldPropAi");
await page.waitForSelector("#ldUseProp");
assert.match(await page.textContent("#ldProp"), /Site com agendamento online para Churrascaria Boi Gordo/);
assert.match(await page.textContent("#ldProp"), /Rascunho automático \(sem IA\)/);
if (OUT) await page.screenshot({ path: OUT + "/real-lead.png" });
await page.click("#ldUseProp");
await page.waitForTimeout(300);
assert.match(await page.textContent("#propDoc"), /Churrascaria Boi Gordo/);
assert.match(await page.textContent("#propDoc"), /Site com agendamento online/);
if (OUT) await page.screenshot({ path: OUT + "/real-proposta.png" });

assert.deepEqual(errors, []);
await browser.close();
console.log("radar com dados reais do OSM: ok");
