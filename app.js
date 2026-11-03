(function(){
const ROADMAP=[
 {n:1,t:"Oferta clara",when:"até 17/11",why:"\"Faço de tudo\" não vende: o dono do negócio não sabe o que pedir. Escolha 2 ofertas com nome e preço. Você continua fazendo de tudo, mas entra pela porta de uma oferta.",tasks:[
  ["f1a","Escolher 2 ofertas: (1) site ou agendamento online para negócio local, (2) automação com IA (atendimento no WhatsApp, planilhas, relatórios)"],
  ["f1b","Tabela de preços: projeto de R$ 800 a 2.000 e manutenção de R$ 200 a 500/mês"],
  ["f1c","Escrever 1 case real do seu trabalho na Urbano Norte: problema, o que você fez, resultado"],
  ["f1d","Portfólio com as 2 ofertas no topo, o case e um botão de WhatsApp"],
  ["f1e","WhatsApp Business com catálogo das ofertas e mensagem de saudação"]]},
 {n:2,t:"Máquina de abordagem",when:"até 15/12",why:"Cliente é consequência de volume. 10 mensagens bem feitas por dia útil dão cerca de 200 por mês. Isso costuma render de 2 a 4 conversas sérias por semana.",tasks:[
  ["f2a","Montar uma lista de 100 empresas do seu nicho (Google Maps + Instagram) na aba Clientes e vagas"],
  ["f2b","Fazer 10 abordagens por dia útil durante 4 semanas seguidas"],
  ["f2c","Avisar 30 conhecidos que você está pegando projetos (mensagem direta + status)"],
  ["f2d","Conversar com o gestor na Urbano Norte sobre mais horas ou projetos extras pagos"],
  ["f2e","Fechar o 1º cliente, mesmo barato, e pedir um depoimento em vídeo ou print"]]},
 {n:3,t:"R$ 3.000 por mês",when:"até 03/03/2027",why:"Conta: R$ 1.000 fixos + 2 projetos de R$ 800 + 1 ou 2 manutenções. É possível em 4 meses se a abordagem não parar.",tasks:[
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
  ["f5d","Decidir com números: sair da Urbano Norte ou negociar aumento"],
  ["f5e","Bater um mês com renda ≥ R$ 5.000"]]}
];
const SCRIPTS=[
 ["Primeiro contato","WhatsApp ou direct","Oi, [nome], tudo bem? Sou o Kauã, desenvolvedor aqui de [cidade]. Vi que [algo específico que você notou: os agendamentos são feitos pelo direct / o site não abre bem no celular / o pedido é anotado à mão]. Eu resolvo isso com [solução em uma frase], o que costuma poupar umas [X] horas por semana. Posso te mandar um exemplo de 2 minutos de como ficaria para a [empresa]?"],
 ["Follow-up","3 dias depois, sem resposta","Oi, [nome]! Passando só para saber se você viu minha mensagem sobre [problema]. Se não for prioridade agora, tudo bem, é só me falar que eu não insisto."],
 ["Quando perguntam o preço","Nunca responda só com um número","Depende do que vocês precisam. Algo como [solução] costuma ficar entre R$ [X] e R$ [Y]. Para te passar o valor certo, me conta em 10 minutos como funciona hoje o [processo]? Pode ser por ligação ou áudio."],
 ["Para a sua rede","Status do WhatsApp e mensagem a conhecidos","Pessoal, estou pegando projetos para empresas: sites, agendamento online, automação de planilhas e atendimento com IA no WhatsApp. Se você tem um negócio, ou conhece alguém que perde tempo com tarefa repetitiva, me chama."],
 ["Pedido de indicação","Depois de uma entrega que deu certo","Oi, [nome]! Que bom que [resultado] está funcionando. Você conhece outro dono de negócio que sofre com [problema]? Se indicar e fechar, você ganha [1 mês de manutenção grátis]."],
 ["Recrutador","LinkedIn, para vagas PJ ou CLT","Oi, [nome]! Vi a vaga de [cargo] na [empresa]. Hoje trabalho na Urbano Norte resolvendo [tipo de problema] e uso IA para entregar rápido. Separei um projeto parecido com o que vocês fazem: [link]. Faz sentido conversarmos?"]
];
const SOURCES=[
 ["Google Maps","Busque \"[nicho] [sua cidade]\". Priorize quem não tem site, tem site quebrado ou responde avaliações com atraso."],
 ["Instagram","Negócios locais que agendam pelo direct, mandam cardápio em foto ou dizem \"chama no WhatsApp\" sem catálogo."],
 ["Sua rede","30 conhecidos avisados valem mais que 100 desconhecidos. Família, ex-colegas, quem tem negócio."],
 ["Urbano Norte","Fornecedores e parceiros da empresa já confiam em quem trabalha lá. Pergunte também ao seu gestor que outros problemas você pode resolver."],
 ["Plataformas","Workana e 99Freelas para pegar volume e depoimentos no começo. LinkedIn para vagas PJ júnior."],
 ["Grupos locais","Associação comercial, grupos de empresários no WhatsApp, feiras do bairro."]
];
const STAGES=[["prospect","Prospectar"],["contato","Contatado"],["proposta","Proposta enviada"],["negocia","Negociando"],["fechado","Fechado"],["perdido","Perdido"]];
const COLS=[["todo","A fazer"],["doing","Fazendo"],["done","Feito"]];
const DEFAULT=()=>({v:2,roadmap:{},today:{date:"",items:["","",""],done:[false,false,false]},week:[],pipeline:[],study:[],income:[],outreach:{},goal:{min:3000,max:5000,studyH:10,fixed:1000,outreachDay:10,d3:"2027-03-03",d5:"2027-07-03"}});

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
function merge(d){const b=DEFAULT();for(const k in b){if(d&&d[k]!==undefined)b[k]=d[k]}b.goal=Object.assign(DEFAULT().goal,b.goal||{});return b}
function save(){dirty=true;clearTimeout(saveT);saveT=setTimeout(flush,700)}
async function flush(){
  try{localStorage.setItem("devpath",JSON.stringify(S))}catch(e){}
  if(!sb||!session){dirty=false;sync("","Salvo neste navegador");return}
  if(saving||!dirty)return;
  saving=true;dirty=false;sync("busy","Salvando…");
  const {error}=await sb.from("devpath_state").upsert({user_id:session.user.id,data:S,updated_at:new Date().toISOString()});
  saving=false;
  if(error){dirty=true;sync("err","Erro ao salvar. Tentando de novo…");setTimeout(flush,4000);return}
  sync("ok","Salvo na nuvem");
  if(dirty)flush();
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
function render(){renderKpis();renderToday();renderNext();renderRoad();renderAbord();renderWeek();renderPipe();renderStudy();renderMoney()}
function renderAbord(){
  const t=today(),n=S.outreach[t]||0,g=S.goal.outreachDay;
  $("oDate").textContent=new Date().toLocaleDateString("pt-BR",{weekday:"short",day:"numeric",month:"short"});
  $("oCount").textContent=n;$("oGoalTxt").textContent="de "+g+(n>=g?" · meta batida":"");
  $("oBar").style.width=Math.min(100,n/g*100)+"%";$("oBar").style.background=n>=g?"var(--good)":"var(--accent)";
  if(document.activeElement!==$("oGoal"))$("oGoal").value=g;
  const ow=outWeek(),conv=S.pipeline.filter(p=>["proposta","negocia","fechado"].includes(p.status)).length;
  $("oWeek").textContent="Esta semana: "+ow+" de "+g*5+". Viraram proposta ou mais, no total: "+conv+".";
  if(!$("scripts").dataset.built){
    $("scripts").innerHTML=SCRIPTS.map((s,i)=>`<div class="card" style="background:var(--sunk);border:0"><div><h3>${esc(s[0])}</h3><span class="note">${esc(s[1])}</span></div><textarea id="sc${i}" rows="6" readonly>${esc(s[2])}</textarea><div><button class="btn ghost small" data-copy="sc${i}">Copiar</button></div></div>`).join("");
    $("sources").innerHTML=SOURCES.map(s=>`<div class="item"><span class="chip acc" style="min-width:110px;justify-content:center">${esc(s[0])}</span><span class="txt">${esc(s[1])}</span></div>`).join("");
    $("scripts").querySelectorAll("[data-copy]").forEach(b=>b.onclick=()=>copyFrom($(b.dataset.copy)));
    $("scripts").dataset.built=1}
}
function copyFrom(el){const v=el.value;const ok=()=>toast("Copiado");try{navigator.clipboard.writeText(v).then(ok,()=>{el.focus();el.select();toast("Selecionado: use Ctrl+C")})}catch(e){el.focus();el.select();toast("Selecionado: use Ctrl+C")}}
function bumpOut(d){const t=today();S.outreach[t]=Math.max(0,(S.outreach[t]||0)+d);if(!S.outreach[t])delete S.outreach[t];changed()}
function renderKpis(){
  const k=monthKey(today()),inc=incomeMonth(k),g=S.goal;
  $("kIncome").textContent=brl(inc);
  $("kIncomeBar").style.width=Math.min(100,inc/g.max*100)+"%";
  $("kIncomeBar").style.background=inc>=g.min?"var(--good)":"var(--accent)";
  $("kIncomeMark").style.left=Math.min(100,g.min/g.max*100)+"%";
  const dl=inc>=g.min?g.d5:g.d3,dd=daysTo(dl);
  $("kIncomeSub").textContent=inc>=g.max?"Meta de "+brl(g.max)+" batida. Hora de subir a meta.":(inc>=g.min?"Faltam "+brl(g.max-inc)+" para "+brl(g.max):"Faltam "+brl(g.min-inc)+" para "+brl(g.min))+" · prazo "+fmtD(dl)+" ("+(dd>=0?dd+" dias":"vencido")+")";
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
  const t=today();const open=S.pipeline.filter(p=>!["fechado","perdido"].includes(p.status)).sort((a,b)=>(a.data||"9")>(b.data||"9")?1:-1).slice(0,5);
  $("nextActions").innerHTML=open.length?open.map(p=>`<div class="item"><div class="txt"><b>${esc(p.nome)}</b> <span class="muted">· ${esc(p.acao||"definir próxima ação")}</span></div><span class="chip ${p.data&&p.data<t?"bad":p.data===t?"xp":""}">${p.data?(p.data<t?"Atrasado "+fmtD(p.data):p.data===t?"Hoje":fmtD(p.data)):"Sem data"}</span></div>`).join(""):`<p class="empty">Nenhuma oportunidade aberta. Na aba Clientes e vagas, adicione 3 pessoas ou empresas para abordar esta semana.</p>`;
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
  const rows=[...S.pipeline].sort((a,b)=>order[a.status]-order[b.status]||((a.data||"9")>(b.data||"9")?1:-1));
  $("pipeBody").innerHTML=rows.length?rows.map(p=>`<tr><td><b>${esc(p.nome)}</b></td><td>${esc(p.tipo)}</td><td class="r num">${p.valor?brl(p.valor):"—"}</td>
   <td><select data-st="${p.id}" aria-label="Etapa">${STAGES.map(([k,n])=>`<option value="${k}" ${p.status===k?"selected":""}>${n}</option>`).join("")}</select></td>
   <td><input type="text" data-ac="${p.id}" value="${esc(p.acao)}" aria-label="Próxima ação" style="width:100%;min-width:160px"></td>
   <td><input type="date" data-dt="${p.id}" value="${esc(p.data)}" aria-label="Data" class="${p.data&&p.data<t&&!["fechado","perdido"].includes(p.status)?"late":""}"></td>
   <td><button class="icon-btn" data-pdel="${p.id}" aria-label="Remover">×</button></td></tr>`).join(""):`<tr><td colspan="7" class="empty">Ainda vazio. Comece com 3 nomes: um comércio do seu bairro, um conhecido que tem negócio e uma vaga júnior que te interessa.</td></tr>`;
  const B=$("pipeBody");
  B.querySelectorAll("[data-st]").forEach(s=>s.onchange=()=>{const p=S.pipeline.find(x=>x.id===s.dataset.st);p.status=s.value;
    if(s.value==="fechado"&&p.valor&&!S.income.some(i=>i.pid===p.id)){S.income.push({id:uid(),pid:p.id,date:today(),desc:p.nome+" ("+p.tipo+")",valor:+p.valor});toast("Fechado! "+brl(p.valor)+" entrou em Dinheiro")}
    changed()});
  B.querySelectorAll("[data-ac]").forEach(i=>i.onchange=()=>{S.pipeline.find(x=>x.id===i.dataset.ac).acao=i.value;changed()});
  B.querySelectorAll("[data-dt]").forEach(i=>i.onchange=()=>{S.pipeline.find(x=>x.id===i.dataset.dt).data=i.value;changed()});
  B.querySelectorAll("[data-pdel]").forEach(b=>b.onclick=()=>{S.pipeline=S.pipeline.filter(x=>x.id!==b.dataset.pdel);changed()});
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

/* ---------- events ---------- */
function show(v){document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.v===v));document.querySelectorAll(".view").forEach(s=>s.hidden=s.id!=="v-"+v);try{localStorage.setItem("painel5k-tab",v)}catch(e){}}
document.querySelectorAll("nav.tabs button").forEach(b=>b.onclick=()=>show(b.dataset.v));
document.querySelectorAll("[data-goto]").forEach(b=>b.onclick=()=>show(b.dataset.goto));
try{const tv=localStorage.getItem("painel5k-tab");if(tv&&$("v-"+tv))show(tv)}catch(e){}
$("todayReset").onclick=()=>{S.today={date:today(),items:["","",""],done:[false,false,false]};changed()};
$("weekForm").onsubmit=e=>{e.preventDefault();const v=$("weekInput").value.trim();if(!v)return;S.week.push({id:uid(),text:v,col:"todo"});$("weekInput").value="";changed()};
$("clearDone").onclick=()=>{const n=S.week.filter(w=>w.col==="done").length;S.week=S.week.filter(w=>w.col!=="done");changed();toast(n+" arquivado"+(n===1?"":"s"))};
$("pData").value=today();$("sDate").value=today();$("iDate").value=today();
$("pipeForm").onsubmit=e=>{e.preventDefault();S.pipeline.push({id:uid(),nome:$("pNome").value.trim(),tipo:$("pTipo").value,valor:+$("pValor").value||0,status:"prospect",acao:$("pAcao").value.trim(),data:$("pData").value});["pNome","pValor","pAcao"].forEach(i=>$(i).value="");changed()};
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
  S.pipeline.push({id:uid(),nome,tipo:"Freela",valor:0,status:"contato",acao:"Follow-up ("+($("aiTipo").value.trim()||"contato")+")",data:iso(f)});
  bumpOut(1);toast("Registrado. Follow-up em "+fmtD(iso(f)));["aiNome","aiTipo","aiObs"].forEach(i=>$(i).value="");$("aiOut").value=""};
$("aiForm").onsubmit=e=>{e.preventDefault();
  const nome=$("aiNome").value.trim(),tipo=$("aiTipo").value.trim(),canal=$("aiCanal").value;
  let obs=$("aiObs").value.trim().replace(/[.!]+$/,"");obs=obs.charAt(0).toLowerCase()+obs.slice(1);
  const oi=canal==="E-mail"?"Olá, "+nome+", tudo bem?":"Oi, "+nome+", tudo bem?";
  const msg=oi+" Sou o Kauã, desenvolvedor aqui de [cidade]. Vi que "+obs+". Eu resolvo esse tipo de coisa para negócios como "+(tipo?"o seu ("+tipo+")":"o seu")+", com [solução em uma frase], e isso costuma poupar um bom tempo na semana. Posso te mandar um exemplo rápido de como ficaria para "+nome+"?";
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

/* ---------- boot ---------- */
render();
const CFG=window.DEVPATH_CONFIG||{};
function loadLocal(){try{const raw=localStorage.getItem("devpath");if(raw){S=merge(JSON.parse(raw));render()}}catch(e){}}
function authUI(){
  $("auth").hidden=!sb||!!session||localMode;
  $("acct").hidden=!sb||(!session&&!localMode);
  $("acct").textContent=session?"Sair":"Entrar";
  if(!session&&sb)sync("","Salvo neste navegador");
}
async function loadRemote(){
  sync("busy","Carregando…");
  const {data,error}=await sb.from("devpath_state").select("data").eq("user_id",session.user.id).maybeSingle();
  if(error){sync("err","Não foi possível carregar seus dados");return}
  if(data&&data.data){S=merge(data.data);render();sync("ok","Salvo na nuvem")}
  else{loadLocal();dirty=true;flush()}
}
if(CFG.supabaseUrl&&CFG.supabaseAnonKey&&window.supabase){
  sb=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey);
  sb.auth.onAuthStateChange((ev,s)=>{const before=session&&session.user.id;session=s;if(s)localMode=false;authUI();if(s&&s.user.id!==before)setTimeout(loadRemote,0)});
}else{loadLocal();sync("","Salvo neste navegador")}
authUI();
let signup=false;
$("aToggle").onclick=()=>{signup=!signup;$("aTitle").textContent=signup?"Criar conta":"Entrar";$("aGo").textContent=signup?"Criar conta":"Entrar";$("aToggle").textContent=signup?"Já tenho conta":"Criar conta";$("aPass").autocomplete=signup?"new-password":"current-password";$("aMsg").textContent=""};
$("aLocal").onclick=()=>{localMode=true;loadLocal();authUI()};
$("acct").onclick=async()=>{if(session){await sb.auth.signOut();S=DEFAULT();render();toast("Você saiu")}else{localMode=false;authUI()}};
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
