// Radar de Clientes: busca de empresas reais (Google Places via Edge Function), oportunidades,
// salvamento de leads no funil existente, IA e contato manual pelo WhatsApp.
(function () {
  const D = window.DevPath;
  if (!D) return;
  const $ = (id) => document.getElementById(id);
  const esc = D.esc;
  const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
  const LEVEL = {
    alta: ["Oportunidade alta", "opp-alta"],
    media: ["Oportunidade média", "opp-media"],
    baixa: ["Oportunidade baixa", "opp-baixa"],
    indisponivel: ["Fechado no Google", "opp-off"],
  };
  const CACHE_DAYS = 30;
  const PREFS = "devpath-radar";

  let results = [];
  let nextToken = "";
  let lastInput = null;
  let busy = false;
  let status = null; // {placesConfigured, aiConfigured, usage}
  let statusFor = "";
  let openId = null;

  /* ---------- chamada ao backend ---------- */
  async function call(action, payload) {
    const sb = D.sb;
    if (!sb || !D.session) throw Object.assign(new Error("Entre na sua conta para usar o Radar."), { code: "unauthenticated" });
    const { data, error } = await sb.functions.invoke("radar", { body: { action, ...payload } });
    if (error) {
      let msg = "Não foi possível falar com o servidor. Verifique sua conexão e tente de novo.";
      let code = "network";
      try {
        const ctx = error.context;
        if (ctx && typeof ctx.json === "function") {
          const b = await ctx.json();
          if (b && b.error) { msg = b.error; code = b.code || "error"; }
        }
      } catch (_) { /* resposta sem JSON */ }
      throw Object.assign(new Error(msg), { code });
    }
    return data;
  }

  /* ---------- utilidades ---------- */
  function websiteKind(url) {
    if (!url) return "none";
    let host = "";
    try { host = new URL(url).hostname.replace(/^www\./, "").toLowerCase(); } catch (_) { return "none"; }
    const social = ["instagram.com", "facebook.com", "fb.com", "fb.me", "linktr.ee", "linkr.bio", "beacons.ai", "bio.link", "wa.me", "whatsapp.com", "tiktok.com", "youtube.com", "twitter.com", "x.com", "ifood.com.br", "goomer.app", "anota.ai", "sites.google.com", "business.site", "g.page", "goo.gl", "linkedin.com", "kwai.com", "pinterest.com"];
    return social.some((d) => host === d || host.endsWith("." + d)) ? "social" : "own";
  }
  // Só links http(s): bloqueia "javascript:" e afins vindos de dados externos.
  const safeUrl = (url) => { try { const u = new URL(url); return u.protocol === "https:" || u.protocol === "http:" ? u.href : ""; } catch (_) { return ""; } };
  const domainOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (_) { return ""; } };
  const digits = (s) => String(s || "").replace(/\D/g, "");
  const daysSince = (d) => d ? Math.floor((Date.now() - new Date(d + "T12:00:00").getTime()) / 864e5) : 9999;
  const cityOf = (addr) => { const parts = String(addr || "").split(",").map((s) => s.trim()); return parts.length >= 2 ? parts.slice(-2).join(", ") : addr || ""; };

  function findLead(place) {
    const S = D.state;
    return S.pipeline.find((p) => p.placeId && p.placeId === place.id) ||
      S.pipeline.find((p) => !p.placeId && p.nome.trim().toLowerCase() === place.name.trim().toLowerCase() && digits(p.whats) && digits(p.whats).slice(-8) === digits(place.phone).slice(-8)) || null;
  }

  function autoObs(op) {
    if (op.website === "none") return "o perfil de vocês no Google não mostra um site cadastrado";
    if (op.website === "social") return `o link do perfil de vocês no Google leva para ${op.websiteDomain}`;
    return "";
  }

  function saveLead(r) {
    const existing = findLead(r.place);
    if (existing) return existing;
    const pl = r.place, op = r.opportunity;
    const p = D.newLead({ nome: pl.name, nicho: pl.category, whats: pl.phone, obs: autoObs(op) });
    Object.assign(p, {
      source: "radar",
      placeId: pl.id,
      address: pl.address,
      place: { name: pl.name, category: pl.category, address: pl.address, phone: pl.phone, website: pl.website, mapsUrl: pl.mapsUrl, rating: pl.rating, ratingCount: pl.ratingCount, status: pl.status, cachedAt: D.today() },
      opp: { score: op.score, level: op.level, website: op.website, websiteDomain: op.websiteDomain, mobile: op.mobile, signals: op.signals.map((s) => s.label) },
    });
    D.logEv(p, "origem", "Encontrado pelo Radar");
    D.state.pipeline.push(p);
    D.changed();
    return p;
  }

  /* ---------- formulário e pré-requisitos ---------- */
  $("rzUf").innerHTML = UFS.map((u) => `<option value="${u}">${u}</option>`).join("");
  try {
    const pr = JSON.parse(localStorage.getItem(PREFS) || "{}");
    $("rzCity").value = pr.city || "";
    $("rzUf").value = pr.uf || "PA";
    $("rzSeg").value = pr.segment || "";
  } catch (_) { $("rzUf").value = "PA"; }

  function gate() {
    const g = $("rzGate");
    let html = "";
    if (!D.sb) html = `<p><b>O Radar precisa da conta na nuvem.</b> Configure o Supabase em <span class="mono">config.js</span> para usar a busca.</p>`;
    else if (!D.session) html = `<p><b>Entre na sua conta para usar o Radar.</b> A busca roda no servidor e conta no seu limite diário.</p><button class="btn small" type="button" id="rzLogin">Entrar</button>`;
    else if (status && !status.placesConfigured) html = `<p><b>A busca ainda não está configurada.</b> Falta adicionar a chave do Google Places no Supabase. O passo a passo está em <span class="mono">docs/RADAR.md</span>.</p>`;
    g.innerHTML = html;
    g.hidden = !html;
    const blocked = !D.sb || !D.session || (status && !status.placesConfigured);
    $("rzGo").disabled = !!blocked || busy;
    const login = $("rzLogin");
    if (login) login.onclick = () => { const a = $("acct"); if (a && !a.hidden) a.click(); else D.toast("Use o botão Entrar no topo da página"); };
  }

  async function loadStatus(force) {
    if (!D.session) { status = null; return; }
    const uidNow = D.session.user.id;
    if (!force && statusFor === uidNow) return;
    statusFor = uidNow;
    try {
      status = await call("status", {});
      usageChip();
    } catch (e) {
      statusFor = "";
      $("rzUsage").textContent = "Uso indisponível";
    }
    gate();
    if (openId) renderLead();
  }

  function usageChip() {
    if (!status || !status.usage) return;
    const u = status.usage.search;
    $("rzUsage").textContent = `${u.used} de ${u.limit} buscas hoje`;
    $("rzUsage").className = "chip " + (u.used >= u.limit ? "bad" : u.used >= u.limit * 0.8 ? "xp" : "");
  }

  /* ---------- resultados ---------- */
  function skeleton(n) {
    return Array.from({ length: n }, () => `<div class="rz-card rz-skel" aria-hidden="true"><div class="sk sk-t"></div><div class="sk sk-s"></div><div class="sk sk-l"></div><div class="sk sk-l"></div><div class="sk sk-b"></div></div>`).join("");
  }

  function sorted() {
    const mode = $("rzSort").value;
    const arr = [...results];
    if (mode === "name") arr.sort((a, b) => a.place.name.localeCompare(b.place.name, "pt-BR"));
    else if (mode === "reviews") arr.sort((a, b) => (a.place.ratingCount ?? 0) - (b.place.ratingCount ?? 0));
    else arr.sort((a, b) => b.opportunity.score - a.opportunity.score);
    return arr;
  }

  function card(r) {
    const pl = r.place, op = r.opportunity, [label, cls] = LEVEL[op.level] || LEVEL.baixa;
    const lead = findLead(pl);
    const site = safeUrl(pl.website)
      ? `<a href="${esc(safeUrl(pl.website))}" target="_blank" rel="noopener nofollow">${esc(op.websiteDomain || domainOf(pl.website))}</a>${op.website === "social" ? ' <span class="tag">rede social</span>' : ""}`
      : '<span class="muted">Site não informado</span>';
    const phone = pl.phone ? `<span class="mono">${esc(pl.phone)}</span>${op.mobile ? ' <span class="tag">celular</span>' : ""}` : '<span class="muted">Não informado</span>';
    const reviews = pl.ratingCount ? `${(pl.rating ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} · ${pl.ratingCount} ${pl.ratingCount === 1 ? "avaliação" : "avaliações"}` : '<span class="muted">Nenhuma</span>';
    return `<article class="rz-card ${op.level === "indisponivel" ? "is-off" : ""}">
      <div class="rz-head">
        <div class="rz-title"><h3>${esc(pl.name)}</h3><p class="note">${esc([pl.category, pl.address].filter(Boolean).join(" · "))}</p></div>
        <span class="opp ${cls}">${label}</span>
      </div>
      <dl class="rz-facts">
        <div><dt>Telefone</dt><dd>${phone}</dd></div>
        <div><dt>Site</dt><dd>${site}</dd></div>
        <div><dt>Avaliações</dt><dd>${reviews}</dd></div>
      </dl>
      <details class="rz-why"><summary>Por que essa classificação</summary>
        <ul>${op.signals.map((s) => `<li><span>${esc(s.label)}</span><b>${s.points ? "+" + s.points : "·"}</b></li>`).join("")}</ul>
        <p class="note">Pontuação ${op.score}. Alta a partir de 55 pontos, média a partir de 30. Só usamos dados do Google, que podem estar desatualizados.</p>
      </details>
      <div class="rz-actions">
        ${lead
          ? `<button class="btn small ghost" data-open="${lead.id}">Ver lead · ${esc(D.STAGE_NAME[lead.status] || lead.status)}</button>`
          : `<button class="btn small ${op.level === "indisponivel" ? "ghost" : ""}" data-save="${esc(pl.id)}">Salvar lead</button>`}
        <button class="btn small ghost" data-msg="${esc(pl.id)}">Mensagem</button>
        ${safeUrl(pl.mapsUrl) ? `<a class="btn small ghost" href="${esc(safeUrl(pl.mapsUrl))}" target="_blank" rel="noopener">Ver no Maps</a>` : ""}
      </div>
    </article>`;
  }

  function renderResults() {
    const box = $("rzResults");
    if (busy) return;
    if (!lastInput) { box.innerHTML = ""; $("rzBar").hidden = true; return; }
    const list = sorted();
    $("rzBar").hidden = !results.length;
    if (!list.length) {
      box.innerHTML = `<div class="rz-empty"><h3>Nenhuma empresa com esses filtros</h3><p class="note">Tente um segmento mais amplo, outro termo ou mude os filtros de site e contato.</p></div>`;
    } else {
      box.innerHTML = list.map(card).join("");
    }
    $("rzMore").hidden = !nextToken;
    box.querySelectorAll("[data-save]").forEach((b) => b.onclick = () => {
      const r = results.find((x) => x.place.id === b.dataset.save);
      if (!r) return;
      const p = saveLead(r);
      D.toast("Lead salvo. Ele já aparece na fila de abordagem.");
      renderResults();
      return p;
    });
    box.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => openLead(b.dataset.open));
    box.querySelectorAll("[data-msg]").forEach((b) => b.onclick = () => {
      const r = results.find((x) => x.place.id === b.dataset.msg);
      if (!r) return;
      const p = saveLead(r);
      openLead(p.id, "msg");
    });
  }

  function showError(e, retry) {
    const canRetry = retry && !["invalid_input", "limit_reached", "places_not_configured", "unauthenticated"].includes(e.code);
    $("rzResults").innerHTML = `<div class="rz-empty rz-error" role="alert"><h3>Não deu para buscar agora</h3><p>${esc(e.message)}</p>${canRetry ? '<button class="btn small" id="rzRetry">Tentar de novo</button>' : ""}</div>`;
    if (canRetry) $("rzRetry").onclick = retry;
  }

  async function search(input, append) {
    if (busy) return;
    busy = true;
    $("rzGo").disabled = true;
    $("rzMore").disabled = true;
    $("rzResults").setAttribute("aria-busy", "true");
    $("rzMsg").textContent = "";
    if (append) $("rzResults").insertAdjacentHTML("beforeend", skeleton(3));
    else { $("rzResults").innerHTML = skeleton(6); $("rzBar").hidden = true; $("rzMore").hidden = true; }
    try {
      const data = await call("search", append ? { ...input, pageToken: nextToken } : input);
      const seen = new Set(append ? results.map((r) => r.place.id) : []);
      const fresh = data.results.filter((r) => !seen.has(r.place.id));
      results = append ? results.concat(fresh) : fresh;
      nextToken = data.nextPageToken || "";
      lastInput = input;
      if (status) { status.usage = data.usage; usageChip(); }
      const hidden = data.total - data.results.length;
      $("rzSummary").textContent = `${results.length} ${results.length === 1 ? "empresa" : "empresas"} para “${data.query}”${hidden > 0 ? ` · ${hidden} ${hidden === 1 ? "ocultada" : "ocultadas"} pelos filtros nesta página` : ""}`;
      busy = false;
      renderResults();
    } catch (e) {
      busy = false;
      if (append) { $("rzResults").querySelectorAll(".rz-skel").forEach((n) => n.remove()); D.toast(e.message); }
      else showError(e, () => search(input, false));
      if (e.code === "limit_reached" || e.code === "places_not_configured") loadStatus(true);
    } finally {
      busy = false;
      $("rzResults").setAttribute("aria-busy", "false");
      $("rzMore").disabled = false;
      gate();
    }
  }

  $("rzForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = {
      city: $("rzCity").value.trim(), uf: $("rzUf").value, segment: $("rzSeg").value.trim(),
      name: $("rzName").value.trim(), terms: $("rzTerms").value.trim(), site: $("rzSite").value, phone: $("rzPhone").value,
    };
    if (input.city.length < 2) { $("rzMsg").textContent = "Informe a cidade."; $("rzCity").focus(); return; }
    if (!input.segment && !input.name && !input.terms) { $("rzMsg").textContent = "Informe um segmento, o nome de uma empresa ou um termo de busca."; $("rzSeg").focus(); return; }
    try { localStorage.setItem(PREFS, JSON.stringify({ city: input.city, uf: input.uf, segment: input.segment })); } catch (_) { /* opcional */ }
    nextToken = "";
    search(input, false);
  });
  $("rzMore").onclick = () => { if (lastInput && nextToken) search(lastInput, true); };
  $("rzSort").onchange = renderResults;

  /* ---------- ficha do lead ---------- */
  const dlg = $("leadDlg");
  const leadById = (id) => D.state.pipeline.find((p) => p.id === id);
  let delArmed = false;

  function aiLeadPayload(p) {
    const website = p.opp ? p.opp.website : (p.place && p.place.website ? websiteKind(p.place.website) : "unknown");
    return {
      name: p.nome, category: p.nicho || (p.place && p.place.category) || "", city: cityOf(p.address || (p.place && p.place.address)),
      hasPhone: !!p.whats, websiteStatus: website, websiteDomain: p.opp ? p.opp.websiteDomain : (p.place ? domainOf(p.place.website) : ""),
      ratingCount: p.place && p.place.ratingCount != null ? p.place.ratingCount : null,
      signals: p.opp ? p.opp.signals : [], notes: [p.obs, p.notes].filter(Boolean).join(". ").slice(0, 1200), status: D.STAGE_NAME[p.status] || "",
    };
  }

  function aiPayload(p, task) {
    const S = D.state;
    return {
      task, lead: aiLeadPayload(p),
      offers: S.offers.filter((o) => o.nome).map((o) => ({ nome: o.nome, desc: o.desc, preco: o.preco, mensal: o.mensal, prazo: o.prazo })),
      offerName: ($("ldOffer") && $("ldOffer").selectedOptions[0] ? $("ldOffer").selectedOptions[0].textContent : ""),
      channel: $("ldCanal") ? $("ldCanal").value : "WhatsApp",
      sender: { nome: S.profile.nome || "", cidade: S.profile.cidade || "" },
    };
  }

  const aiReady = () => !!(status && status.aiConfigured);

  function analysisHtml(a) {
    if (!a) return '<p class="note">A IA lê só os dados acima e suas anotações, separa fatos de hipóteses e sugere qual oferta faz sentido.</p>';
    const d = a.data;
    const li = (arr) => (arr || []).map((x) => `<li>${esc(x)}</li>`).join("");
    return `<p>${esc(d.resumo)}</p>
      ${d.fatos && d.fatos.length ? `<h4>Fatos</h4><ul>${li(d.fatos)}</ul>` : ""}
      ${d.hipoteses && d.hipoteses.length ? `<h4>Hipóteses a confirmar</h4><ul>${d.hipoteses.map((h) => `<li>${esc(h.texto)}<br><span class="note">Como confirmar: ${esc(h.como_confirmar)}</span></li>`).join("")}</ul>` : ""}
      ${d.servicos && d.servicos.length ? `<h4>Serviços que fazem sentido</h4><ul>${d.servicos.map((s) => `<li><b>${esc(s.oferta)}</b>: ${esc(s.motivo)}</li>`).join("")}</ul>` : ""}
      ${d.perguntas && d.perguntas.length ? `<h4>Perguntas para a conversa</h4><ul>${li(d.perguntas)}</ul>` : ""}
      <p class="note">Gerado em ${D.fmtD(a.at)}. Revise antes de usar.</p>`;
  }

  function proposalHtml(pr) {
    if (!pr) return '<p class="note">A IA adapta uma das suas ofertas a essa empresa, sem inventar preço, e lista o que você precisa confirmar antes de enviar.</p>';
    const d = pr.data;
    return `<p><b>${esc(d.titulo)}</b></p><p>${esc(d.descricao)}</p>
      ${d.inclui && d.inclui.length ? `<h4>Inclui</h4><ul>${d.inclui.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${d.observacoes ? `<p class="note">${esc(d.observacoes)}</p>` : ""}
      ${d.confirmar_antes && d.confirmar_antes.length ? `<h4>Confirme antes de enviar</h4><ul>${d.confirmar_antes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      <button class="btn small" id="ldUseProp">Usar na proposta</button>`;
  }

  function defaultMsg(p) { return p.draftMsg || (p.status === "prospect" ? D.firstMsg(p) : D.fuMsg(p)); }

  function renderLead(focus) {
    const p = leadById(openId);
    if (!p) { dlg.close(); return; }
    const S = D.state;
    const pl = p.place || {};
    const age = daysSince(pl.cachedAt);
    const stale = p.placeId && age > CACHE_DAYS;
    const site = safeUrl(pl.website || "");
    const props = S.proposals.filter((x) => x.pid === p.id || x.cli === p.nome);
    const hist = [...(p.log || [])].reverse();
    const aiOff = aiReady() ? "" : 'disabled title="A IA ainda não foi configurada"';
    $("leadBody").innerHTML = `
      <header class="dlg-head">
        <div style="min-width:0"><p class="label">${p.source === "radar" ? "Lead do Radar" : "Lead"}</p><h2 id="ldTitle">${esc(p.nome)}</h2>
          <p class="note">${esc([p.nicho, p.address].filter(Boolean).join(" · "))}</p></div>
        <button class="icon-btn dlg-x" data-close aria-label="Fechar">×</button>
      </header>
      <div class="dlg-grid">
        <section class="dlg-main">
          <div class="ld-status">
            <label class="fl" for="ldStatus"><span class="label">Etapa</span><select id="ldStatus">${D.STAGES.map(([k, n]) => `<option value="${k}" ${p.status === k ? "selected" : ""}>${n}</option>`).join("")}</select></label>
            <label class="fl" for="ldNext"><span class="label">Próxima ação</span><input type="date" id="ldNext" value="${esc(p.data || "")}"></label>
            ${p.dnc ? '<span class="chip bad">Pediu para não ser contatado</span>' : ""}
          </div>
          <div class="ld-block">
            <h3>Contato</h3>
            <dl class="rz-facts">
              <div><dt>Telefone</dt><dd>${p.whats ? `<span class="mono">${esc(p.whats)}</span>` : '<span class="muted">Não informado</span>'}</dd></div>
              <div><dt>Site</dt><dd>${site ? `<a href="${esc(site)}" target="_blank" rel="noopener nofollow">${esc(domainOf(site))}</a>` : p.placeId ? '<span class="muted">Site não informado</span>' : '<span class="muted">Sem dados</span>'}</dd></div>
              ${safeUrl(pl.mapsUrl) ? `<div><dt>Google</dt><dd><a href="${esc(safeUrl(pl.mapsUrl))}" target="_blank" rel="noopener">Ver no Maps</a></dd></div>` : ""}
              ${p.insta ? `<div><dt>Instagram</dt><dd><a href="${esc(safeUrl(D.igUrl(p.insta)))}" target="_blank" rel="noopener">${esc(p.insta)}</a></dd></div>` : ""}
            </dl>
            ${p.placeId ? `<p class="note ${stale ? "warn-txt" : ""}">${stale ? `Os dados do Google têm ${age} dias. Atualize antes de usar.` : `Dados do Google de ${D.fmtD(pl.cachedAt)}.`} <button class="warn-link" id="ldRefresh">Atualizar dados</button></p>` : ""}
            ${p.opp && p.opp.signals && p.opp.signals.length ? `<ul class="ld-signals">${p.opp.signals.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
          </div>
          <div class="ld-block">
            <div class="row" style="justify-content:space-between"><h3>Mensagem</h3><span class="note">${p.status === "prospect" ? "Primeiro contato" : "Retorno"}</span></div>
            <div class="row">
              <select id="ldCanal" aria-label="Canal"><option>WhatsApp</option><option>Instagram</option><option>E-mail</option></select>
              <select id="ldOffer" aria-label="Oferta">${S.offers.filter((o) => o.nome).map((o) => `<option value="${o.id}">${esc(o.nome)}</option>`).join("")}</select>
              <button class="btn small ghost" id="ldAiMsg" ${aiOff}>Escrever com IA</button>
              <button class="btn small ghost" id="ldTpl">Usar modelo</button>
            </div>
            <textarea id="ldMsg" rows="6" aria-label="Mensagem">${esc(defaultMsg(p))}</textarea>
            <div class="row">
              ${p.whats && !p.dnc ? '<a class="btn wa small" id="ldWa" target="_blank" rel="noopener">Abrir no WhatsApp</a>' : ""}
              <button class="btn ghost small" id="ldCopy">Copiar</button>
              <button class="btn small" id="ldSent" ${p.dnc ? "disabled" : ""}>Registrar envio</button>
            </div>
            <p class="note" id="ldMsgNote">${p.dnc ? "Essa empresa pediu para não ser contatada." : p.whats ? "O WhatsApp só abre quando você clica, com a mensagem para você revisar. Nada é enviado sozinho. O número é o telefone comercial do Google e pode não ter WhatsApp." : "Sem telefone: copie a mensagem e envie pelo canal que tiver."}</p>
          </div>
          <div class="ld-block">
            <h3>Anotações</h3>
            <textarea id="ldNotes" rows="3" placeholder="O que você sabe da empresa, o que conversaram, próximos passos">${esc(p.notes || "")}</textarea>
          </div>
        </section>
        <aside class="dlg-side">
          <div class="ld-block">
            <div class="row" style="justify-content:space-between"><h3>Análise com IA</h3><button class="btn small ghost" id="ldAnalyze" ${aiOff}>${p.ai && p.ai.analyze ? "Gerar de novo" : "Analisar"}</button></div>
            <div id="ldAnalysis" class="ld-ai">${analysisHtml(p.ai && p.ai.analyze)}</div>
          </div>
          <div class="ld-block">
            <div class="row" style="justify-content:space-between"><h3>Rascunho de proposta</h3><button class="btn small ghost" id="ldPropAi" ${aiOff}>Gerar com IA</button></div>
            <div id="ldProp" class="ld-ai">${proposalHtml(p.ai && p.ai.proposal)}</div>
          </div>
          ${aiReady() ? "" : '<p class="note">A IA ainda não foi configurada. O resto da ficha funciona normalmente.</p>'}
          <div class="ld-block">
            <h3>Propostas</h3>
            ${props.length ? `<ul class="ld-list">${props.map((x) => `<li><span>${esc(x.offer)} · ${D.brl(x.valor)}</span><span class="note">${D.fmtD(x.date)}</span></li>`).join("")}</ul>` : '<p class="note">Nenhuma proposta enviada ainda.</p>'}
          </div>
          <div class="ld-block">
            <h3>Histórico</h3>
            ${hist.length ? `<ol class="ld-hist">${hist.slice(0, 20).map((h) => `<li><span class="mono note">${D.fmtD(h.d)}</span> ${esc(h.txt)}</li>`).join("")}</ol>` : '<p class="note">Sem eventos ainda.</p>'}
          </div>
          <div class="row">
            ${p.dnc ? "" : '<button class="btn ghost small" id="ldDnc">Pediu para não ser contatado</button>'}
            <button class="btn ghost small danger" id="ldDel">${delArmed ? "Clique de novo para excluir" : "Excluir lead"}</button>
          </div>
        </aside>
      </div>`;

    const msg = $("ldMsg");
    const syncWa = () => { const a = $("ldWa"); if (a) a.href = D.waLink(p, msg.value); };
    syncWa();
    msg.addEventListener("input", () => { p.draftMsg = msg.value; syncWa(); D.save(); });
    $("ldTpl").onclick = () => { p.draftMsg = ""; msg.value = p.status === "prospect" ? D.firstMsg(p) : D.fuMsg(p); syncWa(); D.save(); };
    $("ldCopy").onclick = () => D.copyText(msg.value, "Mensagem copiada");
    $("ldSent").onclick = () => {
      D.touch(p, p.status === "prospect" ? "first" : "fu");
      p.draftMsg = "";
      D.toast("Envio registrado. Próximo retorno em " + D.fmtD(p.data));
      renderLead();
    };
    $("ldStatus").onchange = (e) => {
      p.status = e.target.value;
      if (p.status === "proposta") p.proposed = true;
      if (["respondeu", "negocia", "proposta", "fechado"].includes(p.status) && !p.replied) p.replied = D.today();
      D.logEv(p, "status", D.STAGE_NAME[p.status]);
      D.changed();
      renderLead();
    };
    $("ldNext").onchange = (e) => { p.data = e.target.value; D.changed(); };
    $("ldNotes").addEventListener("input", (e) => { p.notes = e.target.value; D.save(); });
    $("leadBody").querySelector("[data-close]").onclick = () => dlg.close();
    if ($("ldRefresh")) $("ldRefresh").onclick = refreshPlace;
    if ($("ldDnc")) $("ldDnc").onclick = () => {
      p.dnc = true; p.status = "perdido"; D.logEv(p, "status", "Pediu para não ser contatado"); D.changed(); D.toast("Marcado. Ele sai da fila e dos follow-ups."); renderLead();
    };
    $("ldDel").onclick = () => {
      if (!delArmed) { delArmed = true; renderLead(); return; }
      D.state.pipeline = D.state.pipeline.filter((x) => x.id !== p.id);
      delArmed = false; dlg.close(); D.changed(); D.toast("Lead excluído");
    };
    $("ldAnalyze").onclick = () => runAi(p, "analyze", $("ldAnalyze"), "ldAnalysis");
    $("ldPropAi").onclick = () => runAi(p, "proposal", $("ldPropAi"), "ldProp");
    $("ldAiMsg").onclick = () => runAi(p, "message", $("ldAiMsg"));
    if ($("ldUseProp")) $("ldUseProp").onclick = () => useProposal(p);
    if (focus === "msg") setTimeout(() => msg.focus(), 50);
  }

  async function runAi(p, task, btn, targetId) {
    const old = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Gerando…";
    if (targetId) $(targetId).innerHTML = '<div class="sk sk-l"></div><div class="sk sk-l"></div><div class="sk sk-s"></div>';
    try {
      const data = await call("ai", aiPayload(p, task));
      if (task === "message") {
        p.draftMsg = data.result.mensagem;
        D.logEv(p, "ia", "Mensagem gerada com IA");
      } else {
        p.ai = p.ai || {};
        p.ai[task] = { at: D.today(), data: data.result, offerId: $("ldOffer") ? $("ldOffer").value : "" };
        D.logEv(p, "ia", task === "analyze" ? "Análise gerada com IA" : "Rascunho de proposta gerado com IA");
      }
      D.save();
      renderLead();
      if (status && status.usage) status.usage.ai.used++;
    } catch (e) {
      btn.disabled = false;
      btn.textContent = old;
      if (targetId) $(targetId).innerHTML = `<p class="note warn-txt" role="alert">${esc(e.message)}</p>`;
      else D.toast(e.message);
      if (e.code === "ai_not_configured") loadStatus(true);
    }
  }

  function useProposal(p) {
    const pr = p.ai && p.ai.proposal;
    if (!pr) return;
    const offerId = pr.offerId || (D.state.offers[0] && D.state.offers[0].id);
    D.state.propDraft = { leadId: p.id, cli: p.nome, offerId, descricao: pr.data.descricao, inclui: pr.data.inclui || [] };
    dlg.close();
    D.show("propostas");
    $("prCli").value = p.nome;
    $("prOff").value = offerId;
    $("prOff").dispatchEvent(new Event("change"));
    $("prExtra").value = pr.data.observacoes || "";
    D.changed();
    D.renderDoc();
    D.toast("Rascunho aplicado. Revise e baixe o PDF.");
  }

  async function refreshPlace() {
    const p = leadById(openId);
    if (!p || !p.placeId) return;
    const b = $("ldRefresh");
    b.disabled = true;
    b.textContent = "Atualizando…";
    try {
      const data = await call("place", { placeId: p.placeId });
      const pl = data.place, op = data.opportunity;
      const oldPhone = p.place && p.place.phone;
      if (!p.whats || p.whats === oldPhone) p.whats = pl.phone;
      p.address = pl.address;
      p.place = { name: pl.name, category: pl.category, address: pl.address, phone: pl.phone, website: pl.website, mapsUrl: pl.mapsUrl, rating: pl.rating, ratingCount: pl.ratingCount, status: pl.status, cachedAt: D.today() };
      p.opp = { score: op.score, level: op.level, website: op.website, websiteDomain: op.websiteDomain, mobile: op.mobile, signals: op.signals.map((s) => s.label) };
      D.logEv(p, "dados", "Dados do Google atualizados");
      D.changed();
      D.toast("Dados atualizados");
      renderLead();
    } catch (e) {
      D.toast(e.message);
      b.disabled = false;
      b.textContent = "Atualizar dados";
    }
  }

  function openLead(id, focus) {
    openId = id;
    delArmed = false;
    renderLead(focus);
    if (!dlg.open) dlg.showModal();
    loadStatus(false);
  }
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { openId = null; delArmed = false; });
  D.openLead = openLead;

  /* ---------- integração com o ciclo de render do app ---------- */
  D.onRender(() => {
    gate();
    if (D.session) loadStatus(false);
    if (!busy && lastInput) renderResults();
  });
  // Ao abrir a aba, confere login e configuração do servidor.
  $("tab-radar").addEventListener("click", () => { gate(); loadStatus(false); });
  gate();
})();
