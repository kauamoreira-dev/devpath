// Testes da fonte gratuita (OpenStreetMap): montagem da consulta e conversão dos dados. Sem rede.
import { test } from "node:test";
import assert from "node:assert/strict";
import { segmentFilters, buildOverpass, safeRegex, elementToPlace, formatPhoneBR, normalize } from "../supabase/functions/radar/osm.ts";
import { classify } from "../supabase/functions/radar/opportunity.ts";

test("segmento vira filtro de tag do OpenStreetMap", () => {
  assert.deepEqual(segmentFilters("Restaurantes")?.filters, ['["amenity"="restaurant"]']);
  assert.equal(segmentFilters("pizzarias")?.label, "Pizzaria");
  assert.equal(segmentFilters("clínicas odontológicas")?.label, "Odontologia");
  assert.equal(segmentFilters("salões de beleza")?.label, "Salão de beleza");
  assert.equal(segmentFilters("coisa inexistente"), null);
});

test("consulta Overpass para restaurantes em uma cidade", () => {
  const { query, label } = buildOverpass("around:10000,-2.438489,-54.699611", "restaurantes", "", "");
  assert.equal(label, "Restaurante");
  assert.equal(query, '[out:json][timeout:25];(nwr["amenity"="restaurant"]["name"](around:10000,-2.438489,-54.699611););out tags center 60;');
});

test("nome e segmento desconhecido viram busca pelo nome", () => {
  const { query } = buildOverpass("area:1", "", "Sabor da Terra", "");
  assert.match(query, /nwr\["name"~"Sabor da Terra",i\]\["shop"\]\(area:1\);/);
  assert.match(query, /\["amenity"\]/);
});

test("texto do usuário não consegue injetar comandos na consulta", () => {
  assert.equal(safeRegex('x"];out;node(1);("'), "x out node 1");
  const { query } = buildOverpass("area:1", "", 'a"](area:1);out;', "");
  assert.doesNotMatch(query, /\);out;/);
});

test("telefone vira formato brasileiro", () => {
  assert.equal(formatPhoneBR("+55 93 99123-4567"), "(93) 99123-4567");
  assert.equal(formatPhoneBR("+55 93 3522-1234;+55 93 3522-0000"), "(93) 3522-1234");
});

test("elemento do OSM vira empresa, com Instagram como link de rede social", () => {
  const p = elementToPlace({ type: "node", id: 123, tags: { name: "Sabor", amenity: "restaurant", "contact:instagram": "@sabor", phone: "+55 93 99123-4567", "addr:street": "Rua A", "addr:housenumber": "10" } }, "", "Santarém", "PA");
  assert.equal(p.id, "osm-n-123");
  assert.equal(p.category, "Restaurante");
  assert.equal(p.website, "https://instagram.com/sabor");
  assert.equal(p.mapsUrl, "https://www.openstreetmap.org/node/123");
  assert.equal(p.address, "Rua A, 10 - Santarém - PA");
  assert.equal(elementToPlace({ type: "node", id: 1, tags: { amenity: "restaurant" } }, "", "", ""), null, "sem nome é ignorado");
});

test("classificação com OpenStreetMap cita a fonte certa e não usa avaliações", () => {
  const p = elementToPlace({ type: "node", id: 5, tags: { name: "Sem Site", amenity: "restaurant", phone: "93 99123 4567" } }, "", "Santarém", "PA");
  const o = classify(p, "osm");
  assert.ok(o.signals.some((s) => s.label === "Site não informado no OpenStreetMap"));
  assert.ok(!o.signals.some((s) => /avalia/.test(s.label)));
  assert.equal(o.level, "alta");
  const ig = classify(elementToPlace({ type: "node", id: 6, tags: { name: "Insta", amenity: "restaurant", "contact:instagram": "x" } }, "", "", ""), "osm");
  assert.equal(ig.website, "social");
});

test("normalize tira acento", () => assert.equal(normalize("Santarém"), "santarem"));
