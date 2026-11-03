(function(){
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const brl=v=>"R$ "+Math.round(v||0).toLocaleString("pt-BR");
const page=document.getElementById("page");
const slug=(location.pathname.split("/s/")[1]||new URLSearchParams(location.search).get("u")||"").replace(/\/+$/,"").toLowerCase();
function fail(msg){page.innerHTML=`<p class="state">${msg}</p><p class="state" style="padding:0"><a class="btn ghost" href="/">Ir para o DevPath</a></p>`}
const CFG=window.DEVPATH_CONFIG||{};
if(!slug){fail("Endereço incompleto.");return}
if(!window.supabase||!CFG.supabaseUrl){fail("Não foi possível carregar esta página agora. Tente de novo em instantes.");return}
const sb=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:false}});
sb.from("devpath_public").select("data").eq("slug",slug).eq("published",true).maybeSingle().then(({data,error})=>{
  if(error){fail("Não foi possível carregar esta página agora. Tente de novo em instantes.");return}
  if(!data){fail("Esta página não existe ou não está publicada.");return}
  render(data.data||{});
});
function wa(d,txt){return d.whats?`https://wa.me/${d.whats}?text=${encodeURIComponent(txt)}`:""}
function render(d){
  document.title=(d.nome||"Serviços")+(d.cidade?" · "+d.cidade:"");
  const hello=`Oi, ${d.nome||""}! Vi sua página e queria conversar sobre um projeto.`;
  const offers=(d.offers||[]).map(o=>{const inc=String(o.inclui||"").split(/\n/).map(s=>s.trim()).filter(Boolean);
    return `<article class="card"><h2 style="text-transform:none;letter-spacing:.01em;font-size:1.25rem">${esc(o.nome)}</h2><p class="muted">${esc(o.desc)}</p>
    ${inc.length?`<ul>${inc.map(i=>`<li>${esc(i)}</li>`).join("")}</ul>`:""}
    ${o.preco?`<div class="price"><small>a partir de</small><br>${brl(o.preco)}</div>`:""}
    <div class="row">${o.prazo?`<span class="chip">${o.prazo} dias úteis</span>`:""}${o.mensal?`<span class="chip acc">manutenção ${brl(o.mensal)}/mês</span>`:""}</div>
    ${d.whats?`<div><a class="btn wa" href="${esc(wa(d,`Oi, ${d.nome}! Vi sua página e tenho interesse em: ${o.nome}.`))}" target="_blank" rel="noopener">Quero esse</a></div>`:""}</article>`}).join("");
  const c=d.case||{};const hasCase=c.prob||c.sol||c.res;
  const ig=d.insta?(/^https?:/i.test(d.insta)?d.insta:"https://instagram.com/"+d.insta.replace(/^@/,"")):"";
  page.innerHTML=`
  <header class="hero">
    <p class="label">// ${esc(d.cidade||"desenvolvedor")}</p>
    <h1>${esc(d.nome||"")}</h1>
    <p class="lead-txt">${esc(d.headline||"Sites, agendamento online e automações para o seu negócio ganhar tempo.")}</p>
    <div class="links">${d.whats?`<a class="btn wa big" href="${esc(wa(d,hello))}" target="_blank" rel="noopener">Falar no WhatsApp</a>`:""}${ig?`<a class="btn ghost big" href="${esc(ig)}" target="_blank" rel="noopener">Instagram</a>`:""}</div>
  </header>
  ${offers?`<section><h2 style="margin-bottom:14px">O que eu faço</h2><div class="svc">${offers}</div></section>`:""}
  ${hasCase?`<section><h2 style="margin-bottom:14px">Um trabalho real</h2><div class="case">
    ${c.prob?`<div class="card"><span class="label">O problema</span><p>${esc(c.prob)}</p></div>`:""}
    ${c.sol?`<div class="card"><span class="label">O que eu fiz</span><p>${esc(c.sol)}</p></div>`:""}
    ${c.res?`<div class="card"><span class="label" style="color:var(--good)">O resultado</span><p>${esc(c.res)}</p></div>`:""}</div></section>`:""}
  <footer class="foot"><span>${esc(d.nome||"")}${d.cidade?" · "+esc(d.cidade):""}</span><span>Página feita com <a href="/">DevPath</a></span></footer>`;
}
})();
