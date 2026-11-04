(function(){
const ROADMAP=[
 {n:1,t:"Oferta clara",when:"até 17/11",why:"\"Faço de tudo\" não vende: o dono do negócio não sabe o que pedir. Escolha 2 ofertas com nome e preço. Você continua fazendo de tudo, mas entra pela porta de uma oferta.",tasks:[
  ["f1a","Escolher 2 ofertas: (1) site ou agendamento online para negócio local, (2) automação com IA (atendimento no WhatsApp, planilhas, relatórios)"],
  ["f1b","Tabela de preços: projeto de R$ 800 a 2.000 e manutenção de R$ 200 a 500/mês"],
  ["f1c","Escrever 1 case real do seu trabalho atual: problema, o que você fez, resultado"],
  ["f1d","Portfólio com as 2 ofertas no topo, o case e um botão de WhatsApp"],
  ["f1e","WhatsApp Business com catálogo das ofertas e mensagem de saudação"]]},
 {n:2,t:"Máquina de abordagem",when:"até 15/12",why:"Cliente é consequência de volume. 10 mensagens bem feitas por dia útil dão cerca de 200 por mês. Isso costuma render de 2 a 4 conversas sérias por semana.",tasks:[
  ["f2a","Montar uma lista de 100 empresas do seu nicho (Google Maps + Instagram) na aba Clientes e vagas"],
  ["f2b","Fazer 10 abordagens por dia útil durante 4 semanas seguidas"],
  ["f2c","Avisar 30 conhecidos que você está pegando projetos (mensagem direta + status)"],
  ["f2d","Conversar com o seu gestor atual sobre mais horas ou projetos extras pagos"],
  ["f2e","Fechar o 1º cliente, mesmo barato, e pedir um depoimento em vídeo ou print"]]},
 {n:3,t:"R$ 3.000 por mês",when:"até 03/03/2027",why:"Conta: salário fixo + 2 projetos de R$ 800 + 1 ou 2 manutenções mensais. É possível em 4 meses se a abordagem não parar.",tasks:[
  ["f3a","Fechar 2 projetos por mês"],
  ["f3b","Todo projeto entregue sai com uma proposta de manutenção mensal"],
  ["f3c","Enviar a proposta em até 24h depois da conversa, sempre no mesmo modelo"],
  ["f3d","Abrir MEI para emitir nota fiscal"],
  ["f3e","Bater um mês com renda ≥ R$ 3.000"]]},
 {n:4,t:"Recorrência",when:"abr–mai/2027",why:"Projetos avulsos oscilam. Mensalidade é o que deixa a renda previsível e libera você para cobrar mais.",tasks:[
  ["f4a","Ter 4 clientes pagando mensalidade"],
  ["f4b","Subir o preço 20% para clientes novos"],
  ["f4c","Ter 3 depoimentos no portfólio"],
  ["f4d","Pedir indicação a todo cliente satisfeito"],
  ["f4e","Guardar uma reserva de 1 mês de despesas"]]},
 {n:5,t:"R$ 5.000 por mês",when:"até 03/07/2027",why:"O salto vem de ticket maior e indicação, não de mais horas. Um sistema interno com IA para uma empresa vale R$ 3k ou mais.",tasks:[
  ["f5a","Ter 6+ clientes recorrentes, ou uma vaga PJ/CLT de R$ 4k ou mais somada aos freelas"],
  ["f5b","Criar um pacote de maior valor: sistema interno sob medida com IA (R$ 3.000+)"],
  ["f5c","Reaproveitar código e templates para entregar em metade do tempo"],
  ["f5d","Decidir com números: sair do emprego atual ou negociar aumento"],
  ["f5e","Bater um mês com renda ≥ R$ 5.000"]]}
];
const SCRIPTS=[
 ["Primeiro contato","WhatsApp ou direct","Oi, [nome], tudo bem? Sou o Kauã, desenvolvedor aqui de [cidade]. Vi que [algo específico que você notou: os agendamentos são feitos pelo direct / o site não abre bem no celular / o pedido é anotado à mão]. Eu resolvo isso com [solução em uma frase], o que costuma poupar umas [X] horas por semana. Posso te mandar um exemplo de 2 minutos de como ficaria para a [empresa]?"],
 ["Follow-up","3 dias depois, sem resposta","Oi, [nome]! Passando só para saber se você viu minha mensagem sobre [problema]. Se não for prioridade agora, tudo bem, é só me falar que eu não insisto."],
 ["Quando perguntam o preço","Nunca responda só com um número","Depende do que vocês precisam. Algo como [solução] costuma ficar entre R$ [X] e R$ [Y]. Para te passar o valor certo, me conta em 10 minutos como funciona hoje o [processo]? Pode ser por ligação ou áudio."],
 ["Para a sua rede","Status do WhatsApp e mensagem a conhecidos","Pessoal, estou pegando projetos para empresas: sites, agendamento online, automação de planilhas e atendimento com IA no WhatsApp. Se você tem um negócio, ou conhece alguém que perde tempo com tarefa repetitiva, me chama."],
 ["Pedido de indicação","Depois de uma entrega que deu certo","Oi, [nome]! Que bom que [resultado] está funcionando. Você conhece outro dono de negócio que sofre com [problema]? Se indicar e fechar, você ganha [1 mês de manutenção grátis]."],
 ["Recrutador","LinkedIn, para vagas PJ ou CLT","Oi, [nome]! Vi a vaga de [cargo] na [empresa]. Hoje trabalho resolvendo [tipo de problema] e uso IA para entregar rápido. Separei um projeto parecido com o que vocês fazem: [link]. Faz sentido conversarmos?"]
];
const SOURCES=[
 ["Google Maps","Busque \"[nicho] [sua cidade]\". Priorize quem não tem site, tem site quebrado ou responde avaliações com atraso."],
 ["Instagram","Negócios locais que agendam pelo direct, mandam cardápio em foto ou dizem \"chama no WhatsApp\" sem catálogo."],
 ["Sua rede","30 conhecidos avisados valem mais que 100 desconhecidos. Família, ex-colegas, quem tem negócio."],
 ["Seu trabalho","Fornecedores e parceiros da empresa já confiam em quem trabalha lá. Pergunte também ao seu gestor que outros problemas você pode resolver."],
 ["Plataformas","Workana e 99Freelas para pegar volume e depoimentos no começo. LinkedIn para vagas PJ júnior."],
 ["Grupos locais","Associação comercial, grupos de empresários no WhatsApp, feiras do bairro."]
];
const STAGES=[["prospect","Novo"],["contato","Contatado"],["respondeu","Respondeu"],["proposta","Proposta enviada"],["negocia","Negociação"],["fechado","Ganho"],["perdido","Perdido"]];
const STAGE_NAME=Object.fromEntries(STAGES);
const COLS=[["todo","A fazer"],["doing","Fazendo"],["done","Feito"]];
const OFFERS0=()=>[
 {id:"o1",nome:"Site com agendamento online",desc:"Site rápido e bonito para o seu negócio, com agendamento online ligado ao WhatsApp, para o cliente marcar sozinho a qualquer hora.",inclui:"Site de até 5 seções, feito para celular\nAgendamento online com confirmação no WhatsApp\nDomínio e hospedagem configurados\nTreinamento de 30 minutos",prazo:15,preco:1200,mensal:200},
 {id:"o2",nome:"Automação com IA",desc:"Automatizo uma tarefa repetitiva do seu negócio usando IA: atendimento no WhatsApp, planilhas ou relatórios.",inclui:"Diagnóstico de como funciona hoje\nAutomação configurada e testada\nManual simples de uso\n30 dias de ajustes",prazo:10,preco:1500,mensal:300}];
const PROFILE0=()=>({nome:"",cidade:"",whats:"",insta:"",headline:"",slug:"",caseProb:"",caseSol:"",caseRes:"",published:false});
const DEFAULT=()=>({v:5,lastBackup:"",propDraft:null,profile:PROFILE0(),offers:OFFERS0(),proposals:[],roadmap:{},today:{date:"",items:["","",""],done:[false,false,false]},week:[],pipeline:[],study:[],income:[],outreach:{},goal:{min:3000,max:5000,studyH:10,fixed:0,outreachDay:10,d3:"2027-03-03",d5:"2027-07-03"}});

let S=DEFAULT(); let sb=null, session=null, localMode=false; let saving=false, dirty=false, saveT=null;
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad=n=>String(n).padStart(2,"0");
const iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const today=()=>iso(new Date());
const brl=v=>"R$ "+Math.round(v||0).toLocaleString("pt-BR");
const uid=()=>Math.random().toString(36).slice(2,10);
const fmtD=s=>{if(!s)return"";const[y,m,d]=s.split("-");return d+"/"+m};
function toast(t){const el=$("toast");el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2200)}
function sync(state,txt){$("syncDot").className="dot "+state;$("syncTxt").textContent=txt}

/* ---------- persistence ---------- */
function merge(d){const b=DEFAULT();for(const k in b){if(d&&d[k]!==undefined)b[k]=d[k]}b.goal=Object.assign(DEFAULT().goal,b.goal||{});b.profile=Object.assign(PROFILE0(),b.profile||{});if(!Array.isArray(b.offers))b.offers=OFFERS0();return b}
function save(){dirty=true;clearTimeout(saveT);saveT=setTimeout(flush,700)}
// Os dados ficam só neste navegador. A conta serve apenas para liberar o Radar (busca no servidor).
function flush(){
  dirty=false;
  try{localStorage.setItem("devpath",JSON.stringify(S));sync("ok","Salvo neste navegador")}
  catch(e){sync("err","Não foi possível salvar neste navegador")}
}
function changed(){save();render()}

/* ---------- derived ---------- */
function levelInfo(){let cur=ROADMAP.length,done=0,all=0;for(const L of ROADMAP){const d=L.tasks.filter(t=>S.roadmap[t[0]]).length;done+=d;all+=L.tasks.length;if(d<L.tasks.length&&cur===ROADMAP.length&&!levelInfo.f){}}
  let current=null;for(const L of ROADMAP){if(L.tasks.some(t=>!S.roadmap[t[0]])){current=L;break}}
  return{current,done,all}}
function monthKey(s){return s.slice(0,7)}
function incomeMonth(k){return (+S.goal.fixed||0)+S.income.filter(i=>monthKey(i.date)===k).reduce((a,i)=>a+(+i.valor||0),0)}
function daysTo(s){return Math.ceil((new Date(s+"T12:00:00")-new Date())/864e5)}
function outWeek(){const ws=weekStart();let n=0;for(const k in S.outreach)if(k>=ws)n+=S.outreach[k];return n}
function weekStart(){const d=new Date();const day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);return iso(d)}
function studyByDay(){const m={};for(const s of S.study){m[s.date]=(m[s.date]||0)+(+s.min||0)}return m}
function streak(){const m=studyByDay();let n=0;const d=new Date();if(!m[iso(d)])d.setDate(d.getDate()-1);while(m[iso(d)]){n++;d.setDate(d.getDate()-1)}return n}

/* ---------- render ---------- */
const hooks=[];
function render(){renderBackup();hooks.forEach(f=>{try{f()}catch(e){console.error(e)}});renderKpis();renderToday();renderNext();renderQueue();renderFups();renderFunnel();renderProps();renderRoad();renderAbord();renderWeek();renderPipe();renderStudy();renderMoney()}
function renderAbord(){
  const t=today(),n=S.outreach[t]||0,g=S.goal.outreachDay;
  $("oDate").textContent=new Date().toLocaleDateString("pt-BR",{weekday:"short",day:"numeric",month:"short"});
  $("oCount").textContent=n;$("oGoalTxt").textContent="de "+g+(n>=g?" · meta batida":"");
  $("oBar").style.width=Math.min(100,n/g*100)+"%";$("oBar").style.background=n>=g?"var(--good)":"var(--accent)";
  if(document.activeElement!==$("oGoal"))$("oGoal").value=g;
  const ow=outWeek(),conv=S.pipeline.filter(p=>["proposta","negocia","fechado"].includes(p.status)).length;
  $("oWeek").textContent="Esta semana: "+ow+" de "+g*5+". Viraram proposta ou mais, no total: "+conv+".";
  if(!$("scripts").dataset.built){
    $("scripts").innerHTML=SCRIPTS.map((s,i)=>`<div class="card" style="background:var(--sunk);border:0"><div><h3>${esc(s[0])}</h3><span class="note">${esc(s[1])}</span></div><div class="script-text" id="sc${i}">${esc(s[2])}</div><div><button class="btn ghost small" data-copy="sc${i}">Copiar</button></div></div>`).join("");
    $("sources").innerHTML=SOURCES.map(s=>`<div class="item"><span class="chip acc" style="min-width:110px;justify-content:center">${esc(s[0])}</span><span class="txt">${esc(s[1])}</span></div>`).join("");
    $("scripts").querySelectorAll("[data-copy]").forEach(b=>b.onclick=()=>copyFrom($(b.dataset.copy)));
    $("scripts").dataset.built=1}
}
function copyFrom(el){const v=el.value!==undefined?el.value:el.textContent;if(el.value===undefined){el.select=()=>{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r)};el.focus=()=>{}}const ok=()=>toast("Copiado");try{navigator.clipboard.writeText(v).then(ok,()=>{el.focus();el.select();toast("Selecionado: use Ctrl+C")})}catch(e){el.focus();el.select();toast("Selecionado: use Ctrl+C")}}
function bumpOut(d){const t=today();S.outreach[t]=Math.max(0,(S.outreach[t]||0)+d);if(!S.outreach[t])delete S.outreach[t];changed()}
function renderKpis(){
  const k=monthKey(today()),inc=incomeMonth(k),g=S.goal;
  $("kIncome").textContent=brl(inc);
  $("kIncomeBar").style.width=Math.min(100,inc/g.max*100)+"%";
  $("kIncomeBar").style.background=inc>=g.min?"var(--good)":"var(--accent)";
  $("kIncomeMark").style.left=Math.min(100,g.min/g.max*100)+"%";
  const dl=inc>=g.min?g.d5:g.d3,dd=daysTo(dl);
  if(!(+g.fixed)&&!S.income.length){$("kIncomeSub").innerHTML='Preencha seu salário fixo em <button class="warn-link" id="goMoney">Dinheiro</button> para a conta ficar certa.';$("goMoney").onclick=()=>show("grana");return renderKpisRest(g)}
  $("kIncomeSub").textContent=inc>=g.max?"Meta de "+brl(g.max)+" batida. Hora de subir a meta.":(inc>=g.min?"Faltam "+brl(g.max-inc)+" para "+brl(g.max):"Faltam "+brl(g.min-inc)+" para "+brl(g.min))+" · prazo "+fmtD(dl)+" ("+(dd>=0?dd+" dias":"vencido")+")";
  renderKpisRest(g);
}
function renderKpisRest(g){
  const li=levelInfo(),L=li.current;
  if(L){const d=L.tasks.filter(t=>S.roadmap[t[0]]).length;$("kLevel").textContent=L.n+" · "+L.t;$("kLevel").style.fontSize="1.25rem";$("kLevelBar").style.width=d/L.tasks.length*100+"%";$("kLevelSub").textContent=d+" de "+L.tasks.length+" tarefas deste nível";$("lvChip").textContent="Nível "+L.n+" · "+li.done*100+" XP"}
  else{$("kLevel").textContent="Completo";$("kLevelBar").style.width="100%";$("kLevelSub").textContent="Todos os níveis concluídos";$("lvChip").textContent="Nível máximo · "+li.done*100+" XP"}
  const oc=S.outreach[today()]||0,og=S.goal.outreachDay;
  $("kOut").textContent=oc+" de "+og;
  $("kOutBar").style.width=Math.min(100,oc/og*100)+"%";$("kOutBar").style.background=oc>=og?"var(--good)":"var(--accent)";
  $("kOutSub").textContent="Na semana: "+outWeek()+" · meta "+og*5;
  const open=S.pipeline.filter(p=>!["fechado","perdido"].includes(p.status));
  $("kPipe").textContent=brl(open.reduce((a,p)=>a+(+p.valor||0),0));
  $("kPipeSub").textContent=open.length+(open.length===1?" oportunidade aberta":" oportunidades abertas");
}
function renderToday(){
  const t=today();$("todayDate").textContent=new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"short"});
  if(S.today.date!==t&&S.today.items.every(x=>!x)){S.today.date=t}
  const ph=["Ex.: estudar 1h de testes com Jest","Ex.: mandar proposta para a clínica","Ex.: postar o projeto no LinkedIn"];
  const box=$("todayList");
  if(!box.dataset.built){box.innerHTML=[0,1,2].map(i=>`<div class="item"><input type="checkbox" id="td${i}" aria-label="Concluída"><input type="text" id="tt${i}" class="txt" placeholder="${ph[i]}" style="flex:1"></div>`).join("");box.dataset.built=1;
    [0,1,2].forEach(i=>{$("td"+i).addEventListener("change",e=>{S.today.done[i]=e.target.checked;S.today.date=today();changed()});
      $("tt"+i).addEventListener("input",e=>{S.today.items[i]=e.target.value;S.today.date=today();save()});
      $("tt"+i).addEventListener("blur",()=>render())})}
  [0,1,2].forEach(i=>{const inp=$("tt"+i);if(document.activeElement!==inp)inp.value=S.today.items[i]||"";$("td"+i).checked=!!S.today.done[i];inp.style.textDecoration=S.today.done[i]?"line-through":"";inp.style.color=S.today.done[i]?"var(--muted)":""});
  const n=S.today.done.filter(Boolean).length;
  $("todayNext").textContent=S.today.date&&S.today.date!==t?"Estas prioridades são de "+fmtD(S.today.date)+".":n===3?"Dia ganho. Descanse sem culpa.":n+" de 3 feitas";
}
function renderNext(){
  const L=levelInfo().current;
  if(!L){$("nextRoad").innerHTML=`<p class="empty">Roadmap completo. Revise suas metas na aba Dinheiro.</p>`;return}
  const nt=L.tasks.find(x=>!S.roadmap[x[0]]);
  $("nextRoad").innerHTML=`<p class="label">Nível ${L.n} · ${esc(L.t)}</p><div class="item" style="border:0"><input type="checkbox" id="nr-${nt[0]}" aria-label="Marcar como feita"><label class="txt" for="nr-${nt[0]}" style="font-weight:600">${esc(nt[1])}</label></div><p class="note">${esc(L.why)}</p>`;
  $("nr-"+nt[0]).addEventListener("change",()=>{S.roadmap[nt[0]]=true;toast("+100 XP");changed()});
}
function renderRoad(){
  const li=levelInfo();$("xpTotal").textContent=li.done*100+" XP · "+li.done+"/"+li.all;$("roadBar").style.width=li.done/li.all*100+"%";
  const open={};document.querySelectorAll("#levels details").forEach(d=>open[d.dataset.n]=d.open);
  $("levels").innerHTML=ROADMAP.map(L=>{const d=L.tasks.filter(t=>S.roadmap[t[0]]).length,full=d===L.tasks.length,cur=li.current&&li.current.n===L.n;
    const isOpen=open[L.n]!==undefined?open[L.n]:cur;
    return `<details class="level ${full?"complete":""} ${cur?"current":""}" data-n="${L.n}" ${isOpen?"open":""}><summary><span class="lvnum">${full?"✓":L.n}</span><span><h3>${esc(L.t)}</h3><span class="note">${esc(L.when)} · ${d} de ${L.tasks.length} · ${L.tasks.length*100} XP</span></span><span class="chip ${full?"good":cur?"acc":""}">${full?"Concluído":cur?"Agora":"Depois"}</span></summary>
    <div class="body"><p class="why">${esc(L.why)}</p><div class="list">${L.tasks.map(t=>`<div class="item ${S.roadmap[t[0]]?"done":""}"><input type="checkbox" id="rm-${t[0]}" data-k="${t[0]}" ${S.roadmap[t[0]]?"checked":""}><label class="txt" for="rm-${t[0]}">${esc(t[1])}</label></div>`).join("")}</div></div></details>`}).join("");
  $("levels").querySelectorAll("input[data-k]").forEach(c=>c.addEventListener("change",e=>{const k=e.target.dataset.k;if(e.target.checked){S.roadmap[k]=true;toast("+100 XP")}else delete S.roadmap[k];changed()}));
}
function renderWeek(){
  $("kanban").innerHTML=COLS.map(([k,n],ci)=>{const items=S.week.filter(w=>w.col===k);
    return `<div class="col" data-col="${k}"><div class="row" style="justify-content:space-between"><h3>${n}</h3><span class="chip ${k==="doing"&&items.length>3?"bad":""}">${items.length}${k==="doing"?" / 3":""}</span></div>
    ${items.map(w=>`<div class="ticket" draggable="true" data-id="${w.id}"><span class="txt">${esc(w.text)}</span><span class="moves">${ci>0?`<button data-mv="-1" data-id="${w.id}" aria-label="Mover para a esquerda">←</button>`:""}${ci<2?`<button data-mv="1" data-id="${w.id}" aria-label="Mover para a direita">→</button>`:""}<button class="icon-btn" data-del="${w.id}" aria-label="Remover">×</button></span></div>`).join("")||`<p class="empty">${k==="todo"?"Adicione as tarefas da semana acima.":k==="doing"?"Arraste algo para cá quando começar.":"O que você terminar aparece aqui."}</p>`}</div>`}).join("");
  const K=$("kanban");
  K.querySelectorAll("[data-mv]").forEach(b=>b.onclick=()=>{const w=S.week.find(x=>x.id===b.dataset.id);const i=COLS.findIndex(c=>c[0]===w.col);w.col=COLS[i+ +b.dataset.mv][0];changed()});
  K.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{S.week=S.week.filter(x=>x.id!==b.dataset.del);changed()});
  K.querySelectorAll(".ticket").forEach(t=>t.addEventListener("dragstart",e=>e.dataTransfer.setData("text/plain",t.dataset.id)));
  K.querySelectorAll(".col").forEach(c=>{c.addEventListener("dragover",e=>{e.preventDefault();c.classList.add("over")});c.addEventListener("dragleave",()=>c.classList.remove("over"));
    c.addEventListener("drop",e=>{e.preventDefault();const w=S.week.find(x=>x.id===e.dataTransfer.getData("text/plain"));if(w){w.col=c.dataset.col;changed()}})});
}
function renderPipe(){
  const t=today();
  $("stages").innerHTML=STAGES.map(([k,n])=>{const it=S.pipeline.filter(p=>p.status===k);return `<div class="stage"><span class="label">${n}</span><b class="num">${it.length}</b><span class="note num">${brl(it.reduce((a,p)=>a+(+p.valor||0),0))}</span></div>`}).join("");
  const order=Object.fromEntries(STAGES.map((s,i)=>[s[0],i]));
  const fq=($("pfQ")?$("pfQ").value:"").trim().toLowerCase(),fs=$("pfSt")?$("pfSt").value:"",fo=$("pfOrig")?$("pfOrig").value:"";
  if($("pfSt")&&!$("pfSt").dataset.built){$("pfSt").innerHTML='<option value="">Todas as etapas</option>'+STAGES.map(([k,n])=>`<option value="${k}">${n}</option>`).join("");$("pfSt").dataset.built=1}
  const rows=[...S.pipeline].filter(p=>(!fs||p.status===fs)&&(!fo||(fo==="radar"?p.source==="radar":p.source!=="radar"))&&(!fq||[p.nome,p.nicho,p.obs,p.notes,p.address].join(" ").toLowerCase().includes(fq))).sort((a,b)=>order[a.status]-order[b.status]||((a.data||"9")>(b.data||"9")?1:-1));
  $("pfCount").textContent=rows.length+" de "+S.pipeline.length;
  $("pipeBody").innerHTML=rows.length?rows.map(p=>`<tr><td><button class="link-btn" data-open="${p.id}">${esc(p.nome)}</button>${p.source==="radar"?' <span class="chip acc" title="Encontrado pelo Radar">Radar</span>':""}${p.dnc?' <span class="chip bad">Não contatar</span>':""}${p.nicho?` <span class="muted">· ${esc(p.nicho)}</span>`:""}<div class="mini-links">${p.whats?`<a href="https://wa.me/${PH(p.whats)}" target="_blank" rel="noopener">WhatsApp</a>`:""}${p.insta?`<a href="${esc(igUrl(p.insta))}" target="_blank" rel="noopener">Instagram</a>`:""}</div></td><td>${esc(p.tipo)}</td><td class="r num">${p.valor?brl(p.valor):"—"}</td>
   <td><select data-st="${p.id}" aria-label="Etapa">${STAGES.map(([k,n])=>`<option value="${k}" ${p.status===k?"selected":""}>${n}</option>`).join("")}</select></td>
   <td><input type="text" data-ac="${p.id}" value="${esc(p.acao)}" aria-label="Próxima ação" style="width:100%;min-width:160px"></td>
   <td><input type="date" data-dt="${p.id}" value="${esc(p.data)}" aria-label="Data" class="${p.data&&p.data<t&&!["fechado","perdido"].includes(p.status)?"late":""}"></td>
   <td class="row" style="flex-wrap:nowrap"><button class="btn ghost small" data-open="${p.id}">Abrir</button><button class="icon-btn" data-pdel="${p.id}" aria-label="Remover">×</button></td></tr>`).join(""):`<tr><td colspan="7" class="empty">${S.pipeline.length?"Nenhum lead com esses filtros.":"Ainda vazio. Use o Radar para encontrar empresas, ou adicione nomes acima."}</td></tr>`;
  const B=$("pipeBody");
  B.querySelectorAll("[data-st]").forEach(s=>s.onchange=()=>{const p=S.pipeline.find(x=>x.id===s.dataset.st);p.status=s.value;if(s.value==="proposta")p.proposed=true;if(["respondeu","negocia","proposta","fechado"].includes(s.value)&&!p.replied)p.replied=today();logEv(p,"status",STAGE_NAME[s.value]);
    if(s.value==="fechado"&&p.valor&&!S.income.some(i=>i.pid===p.id)){S.income.push({id:uid(),pid:p.id,date:today(),desc:p.nome+" ("+p.tipo+")",valor:+p.valor});toast("Fechado! "+brl(p.valor)+" entrou em Dinheiro")}
    changed()});
  B.querySelectorAll("[data-ac]").forEach(i=>i.onchange=()=>{S.pipeline.find(x=>x.id===i.dataset.ac).acao=i.value;changed()});
  B.querySelectorAll("[data-dt]").forEach(i=>i.onchange=()=>{S.pipeline.find(x=>x.id===i.dataset.dt).data=i.value;changed()});
  B.querySelectorAll("[data-pdel]").forEach(b=>b.onclick=()=>{S.pipeline=S.pipeline.filter(x=>x.id!==b.dataset.pdel);changed()});
  B.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>window.DevPath.openLead&&window.DevPath.openLead(b.dataset.open));
}
function renderStudy(){
  const m=studyByDay(),t=today();const d=new Date();const day=(d.getDay()+6)%7;d.setDate(d.getDate()-day-77);
  let h="";for(let i=0;i<84;i++){const k=iso(d);const v=m[k]||0;const l=v===0?0:v<30?1:v<60?2:v<120?3:4;h+=`<span data-l="${l}" class="${k===t?"today":""}" title="${fmtD(k)}: ${v} min"${k>t?' style="opacity:.25"':""}></span>`;d.setDate(d.getDate()+1)}
  $("heat").innerHTML=h;
  const tot=S.study.reduce((a,s)=>a+(+s.min||0),0);$("studyTotal").textContent=(Math.round(tot/6)/10).toLocaleString("pt-BR")+"h no total";
  if(document.activeElement!==$("studyGoal"))$("studyGoal").value=S.goal.studyH;
  const list=[...S.study].sort((a,b)=>a.date<b.date?1:-1).slice(0,30);
  $("studyList").innerHTML=list.length?list.map(s=>`<div class="item"><span class="chip num">${fmtD(s.date)}</span><span class="txt">${esc(s.topic)}</span><span class="num muted">${s.min} min</span><button class="icon-btn" data-sdel="${s.id}" aria-label="Remover">×</button></div>`).join(""):`<p class="empty">Nenhuma sessão ainda. Use o Bloco de foco na aba Hoje ou registre ao lado.</p>`;
  $("studyList").querySelectorAll("[data-sdel]").forEach(b=>b.onclick=()=>{S.study=S.study.filter(x=>x.id!==b.dataset.sdel);changed()});
}
function renderMoney(){
  const g=S.goal;if(document.activeElement!==$("gFixed"))$("gFixed").value=g.fixed;if(document.activeElement!==$("gMin"))$("gMin").value=g.min;if(document.activeElement!==$("gMax"))$("gMax").value=g.max;
  const months=[];const d=new Date();d.setDate(1);for(let i=5;i>=0;i--){const x=new Date(d.getFullYear(),d.getMonth()-i,1);months.push([iso(x).slice(0,7),x.toLocaleDateString("pt-BR",{month:"short"}).replace(".","")])}
  const vals=months.map(m=>incomeMonth(m[0]));const top=Math.max(g.max*1.1,...vals)||1;
  const W=520,H=220,L=56,R=10,T=12,B=26,cw=(W-L-R)/6,y=v=>T+(H-T-B)*(1-v/top);
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Renda por mês nos últimos 6 meses">`;
  const ticks=[0,g.min,g.max];ticks.forEach(v=>{s+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-dasharray="${v?"4 4":""}"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end">${v>=1000?(v/1000).toLocaleString("pt-BR")+"k":v}</text>`});
  vals.forEach((v,i)=>{const x=L+i*cw+cw*.2,w=cw*.6,last=i===5;const c=v>=g.min?"var(--good)":"var(--accent)";
    s+=`<rect x="${x}" y="${y(v)}" width="${w}" height="${Math.max(0,y(0)-y(v))}" rx="4" fill="${c}" opacity="${last?1:.55}"><title>${months[i][1]}: ${brl(v)}</title></rect><text x="${x+w/2}" y="${H-8}" text-anchor="middle">${months[i][1]}</text>`;
    if(v>0)s+=`<text x="${x+w/2}" y="${y(v)-5}" text-anchor="middle" style="fill:var(--fg)">${(v/1000).toLocaleString("pt-BR",{maximumFractionDigits:1})}k</text>`});
  $("chart").innerHTML=s+"</svg>";
  const rows=[...S.income].sort((a,b)=>a.date<b.date?1:-1);
  $("incBody").innerHTML=rows.length?rows.map(i=>`<tr><td class="num">${fmtD(i.date)}/${i.date.slice(2,4)}</td><td>${esc(i.desc)}</td><td class="r num">${brl(i.valor)}</td><td><button class="icon-btn" data-idel="${i.id}" aria-label="Remover">×</button></td></tr>`).join(""):`<tr><td colspan="4" class="empty">Nenhuma entrada ainda. Registre o que já recebeu este mês, mesmo que seja pouco.</td></tr>`;
  $("incBody").querySelectorAll("[data-idel]").forEach(b=>b.onclick=()=>{S.income=S.income.filter(x=>x.id!==b.dataset.idel);changed()});
}

/* ---------- leads, follow-ups, funil ---------- */
function PH(s){let d=String(s||"").replace(/\D/g,"").replace(/^0+/,"");if(!d)return"";if(!(d.startsWith("55")&&d.length>=12))d="55"+d;return d}
function igUrl(s){s=String(s||"").trim();if(!s)return"";if(/^https?:/i.test(s))return s;return"https://instagram.com/"+s.replace(/^@/,"")}
function addDays(n){const d=new Date();d.setDate(d.getDate()+n);return iso(d)}
function me(){return{nome:S.profile.nome.trim()||"[seu nome]",cidade:S.profile.cidade.trim()||"[cidade]"}}
function lcFirst(s){s=String(s||"").trim().replace(/[.!]+$/,"");return s.charAt(0).toLowerCase()+s.slice(1)}
function newLead(o){return{id:uid(),nome:String(o.nome||"").trim(),nicho:String(o.nicho||"").trim(),whats:String(o.whats||"").trim(),insta:String(o.insta||"").trim(),obs:String(o.obs||"").trim(),tipo:o.tipo||"Freela",valor:o.valor||0,status:"prospect",acao:o.acao||"Primeiro contato",data:o.data||today(),touches:[]}}
function demoOf(p){const u=String(p&&p.demoUrl||"").trim();return /^https?:\/\/[^\s]+$/i.test(u)?u:""}
function firstMsg(p){const m=me(),demo=demoOf(p);
  if(demo)return`Oi, ${p.nome}, tudo bem? Sou o ${m.nome}, desenvolvedor aqui de ${m.cidade}. Montei uma prévia de como poderia ficar o site de vocês: ${demo} É só uma ideia, sem compromisso. Faz sentido conversarmos 10 minutos sobre ela? Se não fizer sentido, é só me avisar.`;
  if(p.obs)return`Oi, ${p.nome}, tudo bem? Sou o ${m.nome}, desenvolvedor aqui de ${m.cidade}. Vi que ${lcFirst(p.obs)}. Eu resolvo esse tipo de coisa para negócios como ${p.nicho?"o seu ("+p.nicho+")":"o seu"}, e isso costuma poupar um bom tempo na semana. Posso te mandar um exemplo rápido de como ficaria para vocês?`;
  return`Oi, ${p.nome}, tudo bem? Sou o ${m.nome}, desenvolvedor aqui de ${m.cidade}. Ajudo negócios como o seu a ganhar tempo com site, agendamento online e automação no WhatsApp. Posso te fazer uma pergunta rápida sobre como vocês atendem hoje?`}
function fuMsg(p){const n=(p.touches||[]).filter(t=>t.k==="fu").length;
  if(p.status==="proposta")return`Oi, ${p.nome}! Conseguiu dar uma olhada na proposta que te mandei? Se tiver qualquer dúvida ou quiser ajustar algo, me fala que eu adapto.`;
  if(p.status==="negocia"||p.status==="respondeu")return`Oi, ${p.nome}! Conseguimos marcar aquela conversa rápida? Pode ser por ligação ou áudio, no horário que for melhor para você.`;
  if(n===0&&demoOf(p))return`Oi, ${p.nome}! Conseguiu ver a prévia do site que montei para vocês? ${demoOf(p)} Se quiser mudar algo, eu ajusto. Se não for prioridade agora, tudo bem, é só me falar que eu não insisto.`;
  if(n===0)return`Oi, ${p.nome}! Passando só para saber se você viu minha última mensagem. Se não for prioridade agora, tudo bem, é só me falar que eu não insisto.`;
  return`Oi, ${p.nome}! Última mensagem por aqui: se quiser, te mando um exemplo pronto de como ficaria para vocês, sem compromisso. Se não fizer sentido agora, sem problema!`}
function waLink(p,msg){return p.whats?`https://wa.me/${PH(p.whats)}?text=${encodeURIComponent(msg)}`:""}
function logEv(p,t,txt){p.log=p.log||[];p.log.push({d:today(),t,txt:String(txt||"").slice(0,300)});if(p.log.length>60)p.log=p.log.slice(-60)}
function touch(p,k){p.touches=p.touches||[];p.touches.push({d:today(),k});logEv(p,k==="first"?"contato":"followup",k==="first"?"Primeiro contato":"Follow-up");
  if(k==="first"){if(p.status==="prospect")p.status="contato";p.msgKind=p.obs?"personalizada":"genérica";p.withDemo=!!demoOf(p);p.acao="Follow-up";p.data=addDays(3);S.outreach[today()]=(S.outreach[today()]||0)+1;
    const n=S.outreach[today()];if(n===S.goal.outreachDay)setTimeout(()=>toast("Meta do dia batida!"),400)}
  else{const n=p.touches.filter(t=>t.k==="fu").length;p.data=addDays(n>=2?7:4);if(p.status==="contato")p.acao=n>=2?"Sem resposta: decidir se encerra":"Follow-up "+(n+1)}
  changed()}
function copyText(t,msg){try{navigator.clipboard.writeText(t).then(()=>toast(msg||"Mensagem copiada"),()=>toast("Não deu para copiar automaticamente"))}catch(e){toast("Não deu para copiar automaticamente")}}
const byId=id=>S.pipeline.find(x=>x.id===id);
function renderQueue(){
  const t=today(),done=S.outreach[t]||0,left=Math.max(0,S.goal.outreachDay-done);
  const all=S.pipeline.filter(p=>p.status==="prospect"&&!p.dnc),list=all.slice(0,Math.min(10,Math.max(3,left)));
  $("qCount").textContent=left?left+" para bater a meta":"meta batida";
  if(!all.length){$("queue").innerHTML=`<div class="empty">Sua lista está vazia. Em <button class="warn-link" data-goto2="pipeline">Clientes e vagas</button>, adicione empresas (dá para colar várias de uma vez) e elas aparecem aqui.</div>`}
  else $("queue").innerHTML=list.map(p=>`<div class="lead"><div class="lead-h"><b>${esc(p.nome)}</b>${p.nicho?`<span class="chip">${esc(p.nicho)}</span>`:""}${demoOf(p)?`<span class="chip good">com prévia</span>`:p.obs?"":`<span class="chip bad" title="Sem observação nem prévia, a mensagem fica genérica">genérica</span>`}</div>${p.obs?`<p class="note">${esc(p.obs)}</p>`:""}
    <div class="acts">${p.whats?`<a class="btn wa small" href="${esc(waLink(p,firstMsg(p)))}" target="_blank" rel="noopener" data-first="${p.id}">WhatsApp</a>`:`<button class="btn small" data-cpmsg="${p.id}">Copiar mensagem</button>`}${p.insta?`<a class="btn ghost small" href="${esc(igUrl(p.insta))}" target="_blank" rel="noopener" data-igcopy="${p.id}">Instagram</a>`:""}${p.whats?"":`<button class="btn ghost small" data-sent="${p.id}">Já mandei</button>`}<button class="icon-btn" data-skip="${p.id}" title="Mandar para o fim da fila" aria-label="Pular">↷</button></div></div>`).join("")+(all.length>list.length?`<p class="note">E mais ${all.length-list.length} na lista.</p>`:"");
  const Q=$("queue");
  Q.querySelectorAll("[data-goto2]").forEach(b=>b.onclick=()=>show(b.dataset.goto2));
  Q.querySelectorAll("[data-first]").forEach(a=>a.addEventListener("click",()=>{const p=byId(a.dataset.first);setTimeout(()=>{touch(p,"first");toast("Abordagem registrada. Follow-up em "+fmtD(p.data))},50)}));
  Q.querySelectorAll("[data-cpmsg]").forEach(b=>b.onclick=()=>copyText(firstMsg(byId(b.dataset.cpmsg)),"Mensagem copiada. Depois de enviar, toque em Já mandei"));
  Q.querySelectorAll("[data-igcopy]").forEach(a=>a.addEventListener("click",()=>copyText(firstMsg(byId(a.dataset.igcopy)),"Mensagem copiada: cole no direct")));
  Q.querySelectorAll("[data-sent]").forEach(b=>b.onclick=()=>{const p=byId(b.dataset.sent);touch(p,"first");toast("Abordagem registrada. Follow-up em "+fmtD(p.data))});
  Q.querySelectorAll("[data-skip]").forEach(b=>b.onclick=()=>{const p=byId(b.dataset.skip);S.pipeline=S.pipeline.filter(x=>x!==p);S.pipeline.push(p);changed()});
}
function renderFups(){
  const t=today(),list=S.pipeline.filter(p=>["contato","respondeu","proposta","negocia"].includes(p.status)&&p.data&&p.data<=t&&!p.dnc).sort((a,b)=>a.data>b.data?1:-1);
  $("fuCount").textContent=list.length?list.length+(list.length===1?" para hoje":" para hoje"):"em dia";
  $("fuCount").className="chip "+(list.some(p=>p.data<t)?"bad":list.length?"xp":"good");
  $("fups").innerHTML=list.length?list.map(p=>{const late=p.data<t,n=(p.touches||[]).filter(x=>x.k==="fu").length,msg=fuMsg(p);
    return`<div class="lead"><div class="lead-h"><b>${esc(p.nome)}</b><span class="chip ${late?"bad":"xp"}">${late?"Atrasado "+fmtD(p.data):"Hoje"}</span><span class="note">${esc(p.acao||"")}${n?" · "+n+" follow-up"+(n>1?"s":""):""}</span></div>
    <div class="acts">${p.whats?`<a class="btn wa small" href="${esc(waLink(p,msg))}" target="_blank" rel="noopener" data-fu="${p.id}">WhatsApp</a>`:`<button class="btn small" data-fucp="${p.id}">Copiar mensagem</button><button class="btn ghost small" data-fudone="${p.id}">Já mandei</button>`}<button class="btn ghost small" data-rep="${p.id}">Respondeu</button><button class="btn ghost small" data-snooze="${p.id}">Adiar 3 dias</button><button class="btn ghost small" data-lost="${p.id}">Encerrar</button></div></div>`}).join(""):`<p class="empty">Nenhum follow-up para hoje. Quem você abordar entra aqui 3 dias depois, se não responder.</p>`;
  const F=$("fups");
  F.querySelectorAll("[data-fu]").forEach(a=>a.addEventListener("click",()=>{const p=byId(a.dataset.fu);setTimeout(()=>{touch(p,"fu");toast("Follow-up registrado")},50)}));
  F.querySelectorAll("[data-fucp]").forEach(b=>b.onclick=()=>copyText(fuMsg(byId(b.dataset.fucp))));
  F.querySelectorAll("[data-fudone]").forEach(b=>b.onclick=()=>{touch(byId(b.dataset.fudone),"fu");toast("Follow-up registrado")});
  F.querySelectorAll("[data-rep]").forEach(b=>b.onclick=()=>{const p=byId(b.dataset.rep);p.replied=p.replied||today();if(p.status==="contato")p.status="respondeu";logEv(p,"status","Respondeu");p.acao=p.status==="proposta"?"Fechar: tirar dúvidas da proposta":"Marcar conversa e mandar proposta";p.data=addDays(1);changed();toast("Boa! Próximo passo: proposta")});
  F.querySelectorAll("[data-snooze]").forEach(b=>b.onclick=()=>{byId(b.dataset.snooze).data=addDays(3);changed();toast("Adiado 3 dias")});
  F.querySelectorAll("[data-lost]").forEach(b=>b.onclick=()=>{byId(b.dataset.lost).status="perdido";changed();toast("Encerrado. Bola pra frente")});
}
const pct=(a,b)=>b?Math.round(a/b*100)+"%":"—";
function funnelOf(arr){const touched=arr.filter(p=>(p.touches&&p.touches.length)||p.status!=="prospect");
  const rep=touched.filter(p=>p.replied||["respondeu","negocia","proposta","fechado"].includes(p.status));
  const prop=touched.filter(p=>p.proposed||["proposta","fechado"].includes(p.status));
  const won=touched.filter(p=>p.status==="fechado");return{touched,rep,prop,won}}
function renderFunnel(){
  const f=funnelOf(S.pipeline),T=f.touched.length;
  const steps=[["Abordados",T],["Responderam",f.rep.length],["Propostas",f.prop.length],["Fechados",f.won.length]];
  $("funnel").innerHTML=steps.map(([n,v],i)=>`<div class="fstep"><div class="row" style="justify-content:space-between"><span class="label">${n}</span><span class="num">${v}${i?` · ${pct(v,T)}`:""}</span></div><div class="bar"><i style="width:${T?Math.max(v?2:0,v/T*100):0}%;${i===3?"background:var(--good);box-shadow:0 0 12px var(--good)":""}"></i></div></div>`).join("");
  $("funnelSub").textContent=S.pipeline.filter(p=>p.status==="prospect").length+" na fila para abordar";
  const groups={};for(const p of f.touched){const k=p.nicho||"Sem nicho";(groups[k]=groups[k]||[]).push(p)}
  const rows=Object.entries(groups).map(([k,a])=>[k,funnelOf(a)]).sort((a,b)=>b[1].touched.length-a[1].touched.length);
  $("byNicho").innerHTML=rows.length?rows.map(([k,g])=>`<tr><td>${esc(k)}</td><td class="r num">${g.touched.length}</td><td class="r num">${g.rep.length} <span class="muted">(${pct(g.rep.length,g.touched.length)})</span></td><td class="r num">${g.prop.length}</td><td class="r num">${g.won.length}</td></tr>`).join(""):`<tr><td colspan="5" class="empty">Aparece quando você começar a abordar.</td></tr>`;
  const kinds=["personalizada","genérica"].map(k=>[k,funnelOf(f.touched.filter(p=>(p.msgKind||"genérica")===k))]);
  const demos=[["Com prévia do site",funnelOf(f.touched.filter(p=>p.withDemo))],["Sem prévia",funnelOf(f.touched.filter(p=>!p.withDemo))]];
  const row=(name,g)=>`<tr><td>${name}</td><td class="r num">${g.touched.length}</td><td class="r num">${g.rep.length} <span class="muted">(${pct(g.rep.length,g.touched.length)})</span></td></tr>`;
  $("byKind").innerHTML=kinds.map(([k,g])=>row(k==="personalizada"?"Personalizada (com observação)":"Genérica",g)).join("")+demos.map(([n,g])=>row(n,g)).join("");
  let tip;
  if(T<10)tip=`Com 10 abordagens ou mais o funil começa a mostrar o que funciona. Até agora: ${T}.`;
  else{const best=rows.filter(([k,g])=>g.touched.length>=5).sort((a,b)=>b[1].rep.length/b[1].touched.length-a[1].rep.length/a[1].touched.length)[0];
    const [kp,kg]=kinds.map(x=>x[1]);tip=best?`Melhor nicho até agora: ${best[0]}, com ${pct(best[1].rep.length,best[1].touched.length)} de resposta. Concentre a próxima lista nele.`:"Abordar pelo menos 5 empresas do mesmo nicho mostra qual responde melhor.";
    const [dc,ds]=demos.map(x=>x[1]);
    if(dc.touched.length>=5&&ds.touched.length>=5)tip+=` Com prévia do site: ${pct(dc.rep.length,dc.touched.length)} de resposta, contra ${pct(ds.rep.length,ds.touched.length)} sem prévia.`;
    else if(dc.touched.length<5)tip+=` Mande prévia para pelo menos 5 empresas para comparar com quem recebeu só mensagem.`;
    if(kp.touched.length>=5&&kg.touched.length>=5)tip+=` Mensagens personalizadas: ${pct(kp.rep.length,kp.touched.length)} de resposta, contra ${pct(kg.rep.length,kg.touched.length)} das genéricas.`}
  $("funnelTip").textContent=tip;
}

/* ---------- propostas, ofertas, perfil ---------- */
let offSig="",offS=null;
function renderOffers(force){const sig=S.offers.map(o=>o.id).join(",");if(!force&&sig===offSig&&offS===S&&$("offers").dataset.built)return;offSig=sig;offS=S;$("offers").dataset.built=1;
  $("offers").innerHTML=S.offers.map((o,i)=>`<div class="offer" data-oid="${o.id}"><div class="row" style="justify-content:space-between"><span class="label">Oferta ${i+1}</span><button class="icon-btn" data-odel="${o.id}" aria-label="Remover oferta">×</button></div>
   <input type="text" data-of="nome" value="${esc(o.nome)}" placeholder="Nome da oferta" aria-label="Nome da oferta">
   <textarea data-of="desc" rows="2" placeholder="O que é, em uma frase para o cliente" aria-label="Descrição">${esc(o.desc)}</textarea>
   <textarea data-of="inclui" rows="3" placeholder="O que inclui (um item por linha)" aria-label="O que inclui">${esc(o.inclui)}</textarea>
   <div class="pform" style="grid-template-columns:repeat(3,minmax(0,1fr))"><label class="note fl">Preço R$<input type="number" data-of="preco" value="${o.preco||""}" min="0" step="50"></label><label class="note fl">Mensal R$<input type="number" data-of="mensal" value="${o.mensal||""}" min="0" step="10"></label><label class="note fl">Prazo (dias)<input type="number" data-of="prazo" value="${o.prazo||""}" min="1"></label></div></div>`).join("")||`<p class="empty">Nenhuma oferta. Crie pelo menos uma.</p>`;
  $("offers").querySelectorAll("[data-of]").forEach(el=>el.addEventListener("input",()=>{const o=S.offers.find(x=>x.id===el.closest("[data-oid]").dataset.oid);const k=el.dataset.of;o[k]=["preco","mensal","prazo"].includes(k)?(+el.value||0):el.value;save();fillOfferSelect();renderDoc()}));
  $("offers").querySelectorAll("[data-odel]").forEach(b=>b.onclick=()=>{S.offers=S.offers.filter(o=>o.id!==b.dataset.odel);changed()});
}
function fillOfferSelect(){const sel=$("prOff"),cur=sel.value;sel.innerHTML=S.offers.map(o=>`<option value="${o.id}">${esc(o.nome||"Oferta sem nome")}${o.preco?" · "+brl(o.preco):""}</option>`).join("");if(S.offers.some(o=>o.id===cur))sel.value=cur}
const PF={pfNome:"nome",pfCidade:"cidade",pfWhats:"whats",pfInsta:"insta",pfHeadline:"headline",pfSlug:"slug",pfProb:"caseProb",pfSol:"caseSol",pfRes:"caseRes"};
function renderProps(){
  renderOffers();fillOfferSelect();
  $("cliList").innerHTML=S.pipeline.filter(p=>!["fechado","perdido"].includes(p.status)).map(p=>`<option value="${esc(p.nome)}"></option>`).join("");
  if($("prVal").value===""&&curOffer())$("prVal").value=curOffer().preco||"";
  for(const id in PF){const el=$(id);if(document.activeElement!==el)el.value=S.profile[PF[id]]||""}
  pubLink();renderDoc();
}
function curOffer(){return S.offers.find(o=>o.id===$("prOff").value)||S.offers[0]}
function propNum(){return new Date().getFullYear()+"-"+String(S.proposals.length+1).padStart(3,"0")}
function renderDoc(){
  const o=curOffer(),pr=S.profile,cli=$("prCli").value.trim(),val=+$("prVal").value||(o&&o.preco)||0,dias=+$("prDias").value||7;
  const cliLead=cli?S.pipeline.find(x=>x.nome.toLowerCase()===cli.toLowerCase()):null,demoLink=cliLead?demoOf(cliLead):"";
  if(!o){$("propDoc").innerHTML=`<p>Crie uma oferta para gerar a proposta.</p>`;return}
  const until=new Date();until.setDate(until.getDate()+dias);
  const dr=S.propDraft&&S.propDraft.offerId===o.id&&S.propDraft.cli===cli?S.propDraft:null;
  $("prDraftNote").hidden=!dr;
  const lines=dr?dr.inclui:String(o.inclui||"").split(/\n/).map(s=>s.trim()).filter(Boolean);
  $("propDoc").innerHTML=`<div class="pd-head"><div><div class="pd-name">${esc(pr.nome||"Seu nome")}</div><div class="pd-sub">Desenvolvedor${pr.cidade?" · "+esc(pr.cidade):""}</div></div><div class="pd-meta">Proposta nº ${propNum()}<br>${new Date().toLocaleDateString("pt-BR",{day:"numeric",month:"long",year:"numeric"})}</div></div>
   <p class="pd-for">Para: <b>${esc(cli||"Nome do cliente")}</b></p><h1 class="pd-title">${esc(o.nome)}</h1>
   <h3>O que vou fazer</h3><p>${esc(dr?dr.descricao:o.desc)}</p>
   ${lines.length?`<h3>O que está incluso</h3><ul>${lines.map(l=>`<li>${esc(l)}</li>`).join("")}</ul>`:""}
   <div class="pd-grid"><div><span>Prazo</span><b>${o.prazo||"—"} dias úteis</b><small>a partir da aprovação</small></div><div><span>Investimento</span><b>${brl(val)}</b><small>${esc($("prPag").value)}</small></div>${o.mensal?`<div><span>Manutenção (opcional)</span><b>${brl(o.mensal)}/mês</b><small>hospedagem, suporte e pequenas melhorias</small></div>`:""}</div>
   ${$("prExtra").value.trim()?`<h3>Observações</h3><p>${esc($("prExtra").value.trim()).replace(/\n/g,"<br>")}</p>`:""}
   ${demoLink?`<h3>Prévia do site</h3><p>Veja como pode ficar: <a href="${esc(demoLink)}">${esc(demoLink)}</a></p>`:""}
   <h3>Próximo passo</h3><p>Para aprovar, é só responder "aprovado" no WhatsApp. Começo em até 2 dias úteis depois da aprovação.</p>
   <p class="pd-valid">Proposta válida até ${until.toLocaleDateString("pt-BR")}.</p>
   <div class="pd-foot">${esc(pr.nome||"Seu nome")}${pr.whats?" · WhatsApp "+esc(pr.whats):""}${pr.insta?" · "+esc(pr.insta):""}</div>`;
}
["prCli","prVal","prDias","prPag","prExtra"].forEach(id=>$(id).addEventListener("input",renderDoc));
$("prOff").addEventListener("change",()=>{const o=curOffer();$("prVal").value=o&&o.preco||"";renderDoc()});
$("offAdd").onclick=()=>{S.offers.push({id:uid(),nome:"",desc:"",inclui:"",prazo:7,preco:0,mensal:0});changed()};
$("prPrint").onclick=()=>{renderDoc();$("printArea").innerHTML='<div class="propdoc">'+$("propDoc").innerHTML+'</div>';const t=document.title;document.title="Proposta "+($("prCli").value.trim()||"")+" - "+(curOffer()?curOffer().nome:"");window.print();setTimeout(()=>document.title=t,500)};
$("prSent").onclick=()=>{const cli=$("prCli").value.trim(),o=curOffer();if(!cli){toast("Escolha ou digite o cliente");$("prCli").focus();return}if(!o){toast("Crie uma oferta antes");return}
  const val=+$("prVal").value||o.preco||0;let p=S.pipeline.find(x=>x.nome.toLowerCase()===cli.toLowerCase());
  if(!p){p=newLead({nome:cli});p.touches=[{d:today(),k:"first"}];S.pipeline.push(p)}
  p.status="proposta";p.proposed=true;p.replied=p.replied||today();p.valor=val;p.acao="Follow-up da proposta";p.data=addDays(2);
  S.proposals.push({id:uid(),num:propNum(),cli,pid:p.id,offer:o.nome,valor:val,date:today()});logEv(p,"proposta","Proposta "+o.nome+" · "+brl(val));if(S.propDraft&&S.propDraft.leadId===p.id)S.propDraft=null;changed();toast("Proposta registrada. Follow-up em "+fmtD(p.data))};
for(const id in PF)$(id).addEventListener("input",e=>{let v=e.target.value;if(id==="pfSlug"){v=v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9-]+/g,"-").replace(/^-+/,"").slice(0,40);if(v!==e.target.value)e.target.value=v}S.profile[PF[id]]=v;save();renderDoc()});
function pubLink(){const ok=S.profile.published&&S.profile.slug;const url=location.origin+"/s/"+S.profile.slug;$("pfLink").hidden=!ok;$("pfCopy").hidden=!ok;if(ok){$("pfLink").href=url;$("pfLink").textContent=url.replace(/^https?:\/\//,"")}}
$("pfCopy").onclick=()=>copyText(location.origin+"/s/"+S.profile.slug,"Link copiado");
$("pfPublish").onclick=async()=>{const pr=S.profile;$("pfMsg").textContent="";
  if(!sb||!session){$("pfMsg").textContent="Entre na sua conta para publicar a página.";return}
  if(!pr.nome.trim()||!pr.whats.trim()){$("pfMsg").textContent="Preencha pelo menos nome e WhatsApp.";return}
  const slug=(pr.slug||"").replace(/-+$/,"");if(!/^[a-z0-9-]{3,40}$/.test(slug)){$("pfMsg").textContent="Escolha um endereço com 3 a 40 letras, números ou hífen.";$("pfSlug").focus();return}
  const data={nome:pr.nome.trim(),cidade:pr.cidade.trim(),whats:PH(pr.whats),insta:pr.insta.trim(),headline:pr.headline.trim(),case:{prob:pr.caseProb.trim(),sol:pr.caseSol.trim(),res:pr.caseRes.trim()},
    offers:S.offers.filter(o=>o.nome.trim()).map(o=>({nome:o.nome,desc:o.desc,inclui:o.inclui,prazo:o.prazo,preco:o.preco,mensal:o.mensal}))};
  $("pfPublish").disabled=true;$("pfMsg").textContent="Publicando…";
  const {error}=await sb.from("devpath_public").upsert({slug,user_id:session.user.id,data,published:true,updated_at:new Date().toISOString()},{onConflict:"user_id"});
  $("pfPublish").disabled=false;
  if(error){$("pfMsg").textContent=error.code==="23505"?"Esse endereço já é de outra pessoa. Escolha outro.":"Não foi possível publicar: "+error.message;return}
  pr.slug=slug;pr.published=true;changed();$("pfMsg").textContent="Página no ar. Sempre que mudar algo, publique de novo.";};

/* ---------- backup (os dados ficam só neste navegador) ---------- */
$("bkExport").onclick=()=>{
  const blob=new Blob([JSON.stringify({app:"devpath",versao:S.v,exportadoEm:new Date().toISOString(),dados:S},null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="devpath-backup-"+today()+".json";document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);S.lastBackup=today();save();renderBackup();toast("Backup baixado. Guarde o arquivo em lugar seguro.")};
$("bkImport").onchange=async e=>{
  const f=e.target.files&&e.target.files[0];e.target.value="";if(!f)return;
  try{
    const obj=JSON.parse(await f.text());const d=obj&&obj.app==="devpath"?obj.dados:obj;
    if(!d||typeof d!=="object"||!Array.isArray(d.pipeline))throw new Error();
    if(!$("bkImport").dataset.armed){$("bkImport").dataset.armed=1;$("bkMsg").textContent="Importar vai substituir os dados deste navegador. Escolha o arquivo de novo para confirmar.";return}
    delete $("bkImport").dataset.armed;S=merge(d);changed();$("bkMsg").textContent="Backup importado.";toast("Backup importado")
  }catch(err){$("bkMsg").textContent="Esse arquivo não é um backup válido do DevPath."}};
function renderBackup(){const d=S.lastBackup;$("bkLast").textContent=d?"Último backup: "+fmtD(d)+"/"+d.slice(0,4):"Você ainda não fez backup.";$("bkLast").className="note"+(!d||daysTo(d)<-14?" warn-txt":"")}

/* ---------- app instalável ---------- */
let installEvt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installEvt=e;$("installBtn").hidden=false});
$("installBtn").onclick=async()=>{if(!installEvt)return;installEvt.prompt();await installEvt.userChoice.catch(()=>{});installEvt=null;$("installBtn").hidden=true};
if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("/sw.js").catch(()=>{});

/* ---------- events ---------- */
function show(v){document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.v===v));document.querySelectorAll(".view").forEach(s=>s.hidden=s.id!=="v-"+v);try{localStorage.setItem("painel5k-tab",v)}catch(e){}}
document.querySelectorAll("nav.tabs button").forEach(b=>b.onclick=()=>show(b.dataset.v));
document.querySelectorAll("[data-goto]").forEach(b=>b.onclick=()=>show(b.dataset.goto));
try{const tv=localStorage.getItem("painel5k-tab");if(tv&&$("v-"+tv))show(tv)}catch(e){}
$("todayReset").onclick=()=>{S.today={date:today(),items:["","",""],done:[false,false,false]};changed()};
$("weekForm").onsubmit=e=>{e.preventDefault();const v=$("weekInput").value.trim();if(!v)return;S.week.push({id:uid(),text:v,col:"todo"});$("weekInput").value="";changed()};
$("clearDone").onclick=()=>{const n=S.week.filter(w=>w.col==="done").length;S.week=S.week.filter(w=>w.col!=="done");changed();toast(n+" arquivado"+(n===1?"":"s"))};
$("pData").value=today();$("sDate").value=today();$("iDate").value=today();
$("pipeForm").onsubmit=e=>{e.preventDefault();S.pipeline.push(newLead({nome:$("pNome").value,nicho:$("pNicho").value,whats:$("pWhats").value,insta:$("pInsta").value,obs:$("pObs").value,tipo:$("pTipo").value,valor:+$("pValor").value||0,acao:$("pAcao").value.trim()||"Primeiro contato",data:$("pData").value}));["pNome","pNicho","pWhats","pInsta","pObs","pValor","pAcao"].forEach(i=>$(i).value="");changed();toast("Adicionado à fila")};
$("bulkGo").onclick=()=>{const lines=$("bulkTxt").value.split(/\n/).map(l=>l.trim()).filter(Boolean);let n=0;
  for(const l of lines){const f=l.split(/;|\t/).map(x=>x.trim());if(!f[0])continue;S.pipeline.push(newLead({nome:f[0],nicho:f[1],whats:f[2],insta:f[3],obs:f.slice(4).join("; ")}));n++}
  if(!n){toast("Nada para importar");return}$("bulkTxt").value="";changed();toast(n+(n===1?" empresa importada":" empresas importadas"))};
$("studyForm").onsubmit=e=>{e.preventDefault();S.study.push({id:uid(),date:$("sDate").value||today(),topic:$("sTopic").value.trim(),min:+$("sMin").value||0});$("sTopic").value="";changed();toast("Estudo registrado")};
$("studyGoal").onchange=e=>{S.goal.studyH=Math.max(1,+e.target.value||10);changed()};
$("gFixed").onchange=e=>{S.goal.fixed=Math.max(0,+e.target.value||0);changed()};
$("oPlus").onclick=()=>{bumpOut(1);const n=S.outreach[today()];if(n===S.goal.outreachDay)toast("Meta do dia batida!")};
$("kOutPlus").onclick=()=>$("oPlus").onclick();
$("oMinus").onclick=()=>bumpOut(-1);
$("oGoal").onchange=e=>{S.goal.outreachDay=Math.max(1,+e.target.value||10);changed()};
$("aiCopy").onclick=()=>copyFrom($("aiOut"));
$("aiSent").onclick=()=>{const nome=$("aiNome").value.trim();if(!nome){toast("Preencha o nome antes");return}
  const f=new Date();f.setDate(f.getDate()+3);
  const p=newLead({nome,nicho:$("aiTipo").value,obs:$("aiObs").value});S.pipeline.push(p);touch(p,"first");toast("Registrado. Follow-up em "+fmtD(iso(f)));["aiNome","aiTipo","aiObs"].forEach(i=>$(i).value="");$("aiOut").value=""};
$("aiForm").onsubmit=e=>{e.preventDefault();
  const nome=$("aiNome").value.trim(),tipo=$("aiTipo").value.trim(),canal=$("aiCanal").value;
  let obs=$("aiObs").value.trim().replace(/[.!]+$/,"");obs=obs.charAt(0).toLowerCase()+obs.slice(1);
  const oi=canal==="E-mail"?"Olá, "+nome+", tudo bem?":"Oi, "+nome+", tudo bem?";
  const msg=oi+" Sou o "+me().nome+", desenvolvedor aqui de "+me().cidade+". Vi que "+obs+". Eu resolvo esse tipo de coisa para negócios como "+(tipo?"o seu ("+tipo+")":"o seu")+", com [solução em uma frase], e isso costuma poupar um bom tempo na semana. Posso te mandar um exemplo rápido de como ficaria para "+nome+"?";
  $("aiOut").value=msg;$("aiNote").textContent="Revise, troque o que está entre colchetes e envie com o seu jeito de falar."};
$("gMin").onchange=e=>{S.goal.min=Math.max(0,+e.target.value||0);if(S.goal.max<S.goal.min)S.goal.max=S.goal.min;changed()};
$("gMax").onchange=e=>{S.goal.max=Math.max(S.goal.min,+e.target.value||0);changed()};
$("incForm").onsubmit=e=>{e.preventDefault();S.income.push({id:uid(),date:$("iDate").value||today(),desc:$("iDesc").value.trim(),valor:+$("iVal").value||0});$("iDesc").value="";$("iVal").value="";changed();toast("Entrada registrada")};

/* timer */
let tMin=25,tLeft=25*60,tInt=null,tStart=0;
function tShow(){$("timerTxt").textContent=pad(Math.floor(tLeft/60))+":"+pad(tLeft%60)}
function tSel(m){if(tInt)return;tMin=m;tLeft=m*60;tShow();["t25","t50","t90"].forEach(i=>$(i).style.borderColor=+$(i).dataset.min===m?"var(--accent)":"")}
["t25","t50","t90"].forEach(i=>$(i).onclick=()=>tSel(+$(i).dataset.min));tSel(25);
function tLog(min){if(min<1)return;S.study.push({id:uid(),date:today(),topic:$("focusTopic").value.trim()||"Bloco de foco",min:Math.round(min)});changed()}
$("timerGo").onclick=()=>{
  if(tInt){clearInterval(tInt);tInt=null;const used=(tMin*60-tLeft)/60;tLog(used);$("timerGo").textContent="Começar";tLeft=tMin*60;tShow();if(used>=1)toast(Math.round(used)+" min registrados");return}
  tStart=Date.now();const end=tStart+tLeft*1000;$("timerGo").textContent="Parar e registrar";
  tInt=setInterval(()=>{tLeft=Math.max(0,Math.round((end-Date.now())/1000));tShow();if(tLeft===0){clearInterval(tInt);tInt=null;tLog(tMin);$("timerGo").textContent="Começar";tLeft=tMin*60;tShow();toast("Bloco concluído: "+tMin+" min registrados");document.title="✔ Bloco concluído";setTimeout(()=>document.title="DevPath",4000)}},500)};

/* ---------- API usada pelo módulo Radar (radar.js) ---------- */
window.DevPath={
  get state(){return S},get sb(){return sb},get session(){return session},
  changed,save,toast,show,esc,demoOf,brl,fmtD,today,addDays,uid,iso,PH,igUrl,newLead,touch,logEv,firstMsg,fuMsg,waLink,copyText,me,
  STAGES,STAGE_NAME,onRender:f=>hooks.push(f),openLead:null,
  renderDoc:()=>renderDoc(),
};
$("pfQ").addEventListener("input",()=>renderPipe());$("pfSt").addEventListener("change",()=>renderPipe());$("pfOrig").addEventListener("change",()=>renderPipe());
$("prDraftClear").onclick=()=>{S.propDraft=null;changed()};

/* ---------- boot ---------- */
render();
const CFG=window.DEVPATH_CONFIG||{};
function loadLocal(){try{const raw=localStorage.getItem("devpath");if(raw){S=merge(JSON.parse(raw));render()}}catch(e){}}
function authUI(){
  $("auth").hidden=!sb||!!session||localMode;
  $("acct").hidden=!sb||(!session&&!localMode);
  $("acct").textContent=session?"Sair":"Entrar";
  sync("ok","Salvo neste navegador");
}
// Migração única: se ainda existir uma cópia na nuvem, traz para o navegador e apaga do banco.
function sizeOf(d){return d?(d.pipeline||[]).length+(d.study||[]).length+(d.income||[]).length+(d.week||[]).length+Object.keys(d.roadmap||{}).length:0}
async function loadRemote(){
  let local=null;try{local=JSON.parse(localStorage.getItem("devpath")||"null")}catch(e){}
  const {data,error}=await sb.from("devpath_state").select("data").eq("user_id",session.user.id).maybeSingle();
  if(error||!data||!data.data){loadLocal();render();return}
  // Fica com a cópia que tem mais conteúdo, para não perder nada.
  const fromCloud=sizeOf(data.data)>sizeOf(local);
  S=merge(fromCloud?data.data:local);
  try{localStorage.setItem("devpath",JSON.stringify(S))}catch(e){sync("err","Não foi possível salvar neste navegador");render();return}
  const del=await sb.from("devpath_state").delete().eq("user_id",session.user.id);
  render();
  if(del.error){sync("err","Copiado para o navegador, mas a cópia na nuvem não foi apagada");return}
  sync("ok","Salvo neste navegador");
  toast("Seus dados agora ficam só neste navegador. A cópia na nuvem foi apagada.");
}
if(CFG.supabaseUrl&&CFG.supabaseAnonKey&&window.supabase){
  sb=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey);
  sb.auth.onAuthStateChange((ev,s)=>{const before=session&&session.user.id;session=s;if(s)localMode=false;authUI();if(s&&s.user.id!==before)setTimeout(loadRemote,0)});
}else{loadLocal();sync("","Salvo neste navegador")}
authUI();
let signup=false;
$("aToggle").onclick=()=>{signup=!signup;$("aTitle").textContent=signup?"Criar conta":"Entrar";$("aGo").textContent=signup?"Criar conta":"Entrar";$("aToggle").textContent=signup?"Já tenho conta":"Criar conta";$("aPass").autocomplete=signup?"new-password":"current-password";$("aMsg").textContent=""};
$("aLocal").onclick=()=>{localMode=true;loadLocal();authUI()};
$("acct").onclick=async()=>{if(session){await sb.auth.signOut();toast("Você saiu. Seus dados continuam neste navegador.")}else{localMode=false;authUI()}};
const ERR={"Invalid login credentials":"E-mail ou senha incorretos.","Email not confirmed":"Confirme seu e-mail primeiro: abra o link que enviamos.","User already registered":"Esse e-mail já tem conta. Use Entrar."};
$("authForm").onsubmit=async e=>{e.preventDefault();$("aGo").disabled=true;$("aMsg").textContent=signup?"Criando conta…":"Entrando…";
  const email=$("aEmail").value.trim(),password=$("aPass").value;
  const r=signup?await sb.auth.signUp({email,password,options:{emailRedirectTo:location.origin}}):await sb.auth.signInWithPassword({email,password});
  $("aGo").disabled=false;
  if(r.error){$("aMsg").textContent=ERR[r.error.message]||r.error.message;return}
  if(signup&&!r.data.session){$("aMsg").textContent="Conta criada. Abra o link que enviamos para "+email+" e depois entre."}
  else $("aMsg").textContent="";
};
})();
