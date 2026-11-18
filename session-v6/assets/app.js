/* Sterling 2026 — interactive internal executive presentation. No trackers, APIs or dependencies. */
(()=>{'use strict';
const D=window.SESSION_DATA;if(!D){document.body.textContent='Материалы презентации не загрузились.';return;}
const $=s=>document.querySelector(s), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nodeById=Object.fromEntries(D.executives.map(e=>[e.id,e]));
const itemById=(t,id)=>({direction:D.directions,exec:D.executives,case:D.cases,company:D.companies,change:D.improvements,growth:D.growth,decision:D.decisions})[t]?.find(x=>x.id===id);
const current={slide:0,selected:{},orgParent:null,orgSelection:'ceo',caseCategory:null,aviationView:'clients',flow:'transit',decisions:(()=>{try{return JSON.parse(localStorage.getItem('navarro-session-decisions')||'{}')}catch{return {}}})()};
const slides=D.navigation;
const slideAliases={organization:'orgmap',partners:'cases',decisions:'changes'};
const resolveSlide=id=>slideAliases[id]||id;
const bullet=list=>`<ul>${list.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
const block=(name,html)=>`<div class="section"><h4>${esc(name)}</h4>${html}</div>`;
const p=s=>`<p>${esc(s)}</p>`;
const pill=s=>`<span class="pill">${esc(s)}</span>`;
const extra=D.details||{};
const plain=(s)=>`<p>${esc(s)}</p>`;
function caseReferences(ids){if(!ids||!ids.length)return '';
 let cases=ids.map(id=>D.cases.find(c=>c.id===id)).filter(c=>c&&c.expandable!==false);
 return cases.length?block('Связанные кейсы и проблемы',`<div class="case-references">${cases.map(c=>`<button class="case-reference" data-open-case="${esc(c.id)}"><span class="ref-number">${esc(c.metric)}</span><span><b>${esc(c.title)}</b><small>${esc(c.issue)}</small></span><span aria-hidden="true">↗</span></button>`).join('')}</div>`):'';
}
const rich=D.briefings||{};
function richBrief(type,id){
 const b=rich[type]?.[id];if(!b)return '';
 const steps=b.mechanism||[];
 const rolesControl=[b.roles,b.control&&`Контроль: ${b.control}`].filter(Boolean).join(' ');
 const resultKpi=[b.outcome,b.kpi&&`Метрики: ${b.kpi}`].filter(Boolean).join(' ');
 return block('Управленческая идея',p(b.headline))+
   block('Почему это важно',p(b.why))+
   block('Механика внедрения',bullet(steps))+
   block('Маршрут / цепочка',`<div class="briefing-route">${esc(b.workflow)}</div>`)+
   block('Роли и контроль',p(rolesControl))+
   block('Результат и ключевые показатели',p(resultKpi));
}
function infrastructureBrief(){
 const b=D.infrastructureBrief,c=b.current,p=b.planned;
 return `<div class="infra-portfolio"><section class="infra-current"><div class="infra-label">Работаем сейчас</div><h2>${esc(c.title)}</h2><article class="infra-active-site"><h3>${esc(c.astana.name)}</h3><p class="infra-current-lead">${esc(c.astana.lead)}</p><p class="infra-renovation">${esc(c.astana.renovation)}</p><ul>${c.astana.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></article><article class="infra-aktobe"><h3>${esc(c.aktobe.name)}</h3><p>${esc(c.aktobe.description)}</p></article></section><section class="infra-planned"><div class="infra-label">Портфель развития</div><h2>${esc(p.title)}</h2><p class="infra-order">${esc(p.caption)}</p><ol class="infra-projects">${p.items.map((item,index)=>`<li class="infra-project"><span class="infra-rank">${String(index+1).padStart(2,'0')}</span><div class="infra-project-copy"><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p></div>${item.image?`<button type="button" class="infra-project-image" data-project-image="${index}" aria-label="Увеличить схему проекта: ${esc(item.name)}"><img src="${esc(item.image.src)}" alt="${esc(item.image.alt)}"><span aria-hidden="true">↗</span></button>`:''}</li>`).join('')}</ol></section></div>`;
}
function openProjectImage(index){
 const image=D.infrastructureBrief.planned.items[index]?.image;if(!image)return;
 let dialog=$('#project-image-dialog');
 if(!dialog){
  document.body.insertAdjacentHTML('beforeend',`<dialog id="project-image-dialog" class="project-image-dialog" aria-labelledby="project-image-title"><header><h2 id="project-image-title"></h2><a class="project-image-original" target="_blank" rel="noopener noreferrer">Оригинал ↗</a><button type="button" data-project-image-close autofocus>✕ К проектам</button></header><div class="project-image-body"><img></div></dialog>`);
  dialog=$('#project-image-dialog');
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 }
 dialog.querySelector('h2').textContent=image.caption;
 dialog.querySelector('img').src=image.src;dialog.querySelector('img').alt=image.alt;
 dialog.querySelector('a').href=image.src;
 dialog.showModal();
}

function aviationMarketsBrief(){
 const view=current.aviationView||'clients',a=D.aviationAcquisition;
 const tabs=`<nav class="aviation-brief-tabs" aria-label="Обзор авиа-ГСМ"><button type="button" data-aviation-view="clients" aria-pressed="${view==='clients'}">Привлечение клиентов</button><button type="button" data-aviation-view="markets" aria-pressed="${view==='markets'}">Ташкент и Гонконг</button></nav>`;
 const markets=`<div class="aviation-markets">${Object.values(D.aviationMarkets).map(market=>`<section class="market-card"><div class="market-card-head"><h2>${esc(market.name)}</h2><span>${esc(market.badge)}</span></div><div class="market-facts">${market.facts.map(f=>`<p><strong>${esc(f.label)}.</strong> ${esc(f.text)}</p>`).join('')}</div><div class="market-entry"><span>Первый шаг</span><p>${esc(market.firstStep)}</p></div></section>`).join('')}</div>`;
 const clients=`<div class="aviation-acquisition"><div class="acquisition-phases">${a.phases.map((phase,index)=>`<section class="acquisition-phase"><div class="acquisition-phase-head"><div><span>${esc(phase.timing)}</span><h2>${esc(phase.title)}</h2></div><b>${String(index+1).padStart(2,'0')}</b></div><ol start="${index*3+1}">${phase.items.map(item=>`<li><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></li>`).join('')}</ol></section>`).join('')}</div><div class="acquisition-priorities"><strong>Определить сейчас</strong>${a.priorities.map(text=>`<span>${esc(text)}</span>`).join('')}</div><p class="acquisition-timing">${esc(a.timingNote)}</p></div>`;
 return `<div class="aviation-brief">${tabs}${view==='markets'?markets:clients}</div>`;
}

function inspector(type,id){let i=itemById(type,id);if(!i&&type!=='flow')return `<div class="inspector-header"><span class="inspector-tag">УПРАВЛЕНЧЕСКИЙ КОНТЕКСТ</span><span class="inspector-index">N.</span></div><h2>Контекст раздела</h2><p class="sub">Процессы, ответственность, риски и предлагаемые решения.</p>`;
 let tag='',title='',sub='',inner='',e;
 if(type==='direction'&&id==='infrastructure'){
  tag=i.tag;title=i.name;sub=i.intro;inner=infrastructureBrief();
 }else if(type==='direction'&&id==='aviation'){
  tag='Авиа-ГСМ / новые рынки';title=i.name;sub=current.aviationView==='markets'?'Ташкент и Гонконг: ситуация на рынке, условия выхода и первые действия.':D.aviationAcquisition.intro;inner=aviationMarketsBrief();
 }else if(type==='direction'){
  e=extra.directions?.[id];tag=i.tag;title=i.name;sub=i.intro;
  inner=pill(i.status)+block('Как работает направление',plain(e?.process||i.scope))+
    block('Ответственный контур',plain(i.owner))+
    (e?.documents?.length?block('Документы / подтверждения',bullet(e.documents)):'')+
    caseReferences(e?.cases||[i.caseId])+
    block('Предлагаемые решения',plain(e?.solution||i.actions.join('; ')))+
    (id==='transit'?block('Критичные точки',bullet(['Пересогласование тарифов КТЖ и ставок оперирования вагонами.','Валютная разница при изменении курса между расчётом и оплатой.','Согласование графиков и риск простоя, влияющий на маржу.'])):'');
 }else if(type==='exec'){
  tag=i.super ? `Подчинение · ${nodeById[i.super].name}` : 'Руководство компании';
  title=i.name;sub=i.lead;
  inner=block('Функциональные обязанности',bullet(i.duties))+
    block('Результат работы',bullet(i.outputs||[]))+
    block('Рабочие взаимодействия',bullet(i.interfaces||[]));
 }else if(type==='case'){
  e=extra.cases?.[id];tag=i.group;title=i.title;sub=i.subtitle;
  inner=block('Ситуация',plain(e?.facts||i.issue))+
    block('Последствия',plain(i.effect))+
    block('Предлагаемое решение',plain(i.resolution))+
    (e?.lesson?block('Практический вывод',plain(e.lesson)):'')+
    block(id==='duplicate'?'Ответственные':'Ответственный',plain(i.owner))+
    (e?.documents?.length?block('Подтверждающие документы',bullet(e.documents)):'')+
    (e?.reference?`<p class="source-caption"><a href="${esc(e.reference.url)}" target="_blank" rel="noopener noreferrer">${esc(e.reference.label)}</a></p>`:'');
 }else if(type==='company'){
  e=extra.partners?.[id];tag='STERLING GROUP / ВЗАИМОДЕЙСТВИЕ';title=i.title;sub=i.subtitle;
  inner=block('Описание процесса',plain(e?.process||i.focus))+
    block('Получает от Navarro',plain(i.from))+
    block('Передаёт Navarro',plain(i.to))+
    block('Проблема / узкое место',plain(i.risk))+
    caseReferences(e?.cases||[i.caseId])+
    block('Предлагаемое решение',plain(e?.solution||'Уточнить владельца процесса и сроки обмена данными.'))+
    block('Как закрепить взаимодействие',plain('Согласовать входную заявку, состав подтверждающих данных, ответственные должности, сроки передачи и процедуру эскалации. Административная подчинённость между ТОО не создаётся.'));
 }else if(type==='change'){
  tag=i.label;title=i.name;sub=i.why;inner=pill('Инициатива')+
    richBrief('change',id)+
    caseReferences(i.caseId?[i.caseId]:[])+
    block('Предложено вынести на сессию',plain(i.decision));
 }else if(type==='growth'){
  tag=i.tag;title=i.name;sub=i.goal;inner=pill(i.state)+
    richBrief('growth',id)+
    block('Что подготовить к решению',plain(i.next));
 }else if(type==='decision'){
  tag='УПРАВЛЕНЧЕСКОЕ РЕШЕНИЕ';title=i.title;sub=i.prompt;
  const status=current.decisions[i.id]||'pending';const names={pending:'К обсуждению',agreed:'Отмечено как согласованное',review:'На доработку',hold:'Отложено'};
  const link={d2:['change','tariff-fx'],d3:['change','tariff-fx'],d4:['change','inventory-audit'],d5:['change','clm']}[id];
  const linked=link?rich[link[0]]?.[link[1]]:null;
  inner=pill(names[status])+block('Предмет решения',plain(i.prompt))+
    block('Предлагаемый ответственный',plain(i.owner))+
    (linked?block('Зачем решение необходимо',plain(linked.why)):'')+
    (linked?block('Что потребуется внедрить',bullet(linked.mechanism)):'')+
    (linked?block('Как определить исполнение',plain(linked.kpi)):'')+
    block('Результат обсуждения',plain('Назначить исполнителя, согласовать документ/полномочия, установить контрольную дату и подтверждающий результат.'));
 }else if(type==='flow'){
  let f=D.dealflows.find(x=>x.id===current.flow),stage=f?.steps[+id],x=extra.flows?.[current.flow]?.[+id];
  if(!stage)return '';tag=`${f.name} · ЭТАП ${String(+id+1).padStart(2,'0')}`;title=stage[0];sub=stage[1];
  inner=block('Описание процесса',plain(x?.process||stage[1]))+
    block('Исполнитель и взаимодействия',plain(stage[2]))+
    (x?.documents?block('Документы / подтверждение',plain(x.documents)):'')+
    (x?.risk?block('Проблема / риск',plain(x.risk)):'')+
    caseReferences(x?.cases||[])+
    block('Предлагаемое решение / контроль',plain(x?.solution||'Согласовать контрольную точку и ответственного.'));
 }
 const inlineBack=['company','change','growth','decision'].includes(type)?'<button class="inline-back" type="button" data-inline-close>← Все карточки</button>':'';
 return `<div class="inspector-lead"><div class="inspector-header"><span class="inspector-tag">${esc(tag)}</span>${inlineBack}<span class="inspector-index">N.</span></div><h2>${esc(title)}</h2><p class="sub">${esc(sub)}</p></div><div class="inspector-body">${inner}</div>`;
}
// v4.2: a compact on-slide preview, plus a cinematic no-scroll case focus.
function preview(type,id){
 const i=itemById(type,id);let title='',sub='',tag='АНАЛИТИЧЕСКАЯ ПАНЕЛЬ';
 if(type==='flow'){
  const f=D.dealflows.find(x=>x.id===current.flow);const st=f?.steps[+id];
  title=st?.[0]||'Этап сделки';sub=st?.[1]||'';tag='МАРШРУТ СДЕЛКИ';
 } else if(i){title=i.name||i.title||'Подробности';sub=i.subtitle||i.intro||i.lead||i.scope||i.goal||i.why||i.prompt||'';tag=type==='case'?'КЕЙС / ВЫВОДЫ':'АНАЛИТИЧЕСКАЯ ПАНЕЛЬ';}
 const inline=inlineDetailTypes.has(type);
 return `<div class="inspector-header"><span class="inspector-tag">${esc(tag)}</span><span class="inspector-index">N.</span></div>
 <h2>${esc(title)}</h2><p class="sub">${esc(sub)}</p>
 ${inline?`<div class="preview-guide"><strong>Выберите карточку</strong><p>Колонка плавно раскроет полный разбор без перехода на другой экран.</p><div><span>Контекст</span><span>Роли</span><span>Риски</span><span>Решение</span></div></div>`:`<button class="detail-cta" type="button" data-expand-current>Развернуть разбор <span>↗</span></button><p class="detail-hint">Полный разбор объединяет функции, ответственность, связанные кейсы и решения.</p>`}`;
}
let detailState={type:null,id:null},detailSerial=0;
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function hideZoom({instant=false}={}){
 const imageDialog=$('#project-image-dialog');if(imageDialog?.open)imageDialog.close();
 const layer=$('#detail-zoom');if(!layer||layer.hidden)return;
 const serial=++detailSerial;
 if(instant||reduced()){layer.hidden=true;document.body.classList.remove('has-detail-zoom');return;}
 const win=layer.querySelector('.detail-window');
 const a=win.animate([{opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0)'},{opacity:0,transform:'translateY(18px) scale(.97)',filter:'blur(3px)'}],{duration:240,easing:'ease-in',fill:'forwards'});
 Promise.resolve(a.finished).catch(()=>{}).then(()=>{if(detailSerial!==serial)return;a.cancel();layer.hidden=true;document.body.classList.remove('has-detail-zoom')});
}
function adaptDetailColumns(){
 const layer=$('#detail-zoom'),win=layer?.querySelector('.detail-window'),grid=layer?.querySelector('.detail-columns');
 if(!win||!grid||layer.hidden)return;
 const source=layer.querySelector('.detail-source');
 const nodes=[...source.children].map(n=>n.cloneNode(true));
 if(['infrastructure','aviation-markets'].includes(layer.dataset.focusType)){
  grid.replaceChildren(...nodes);layer.dataset.density='0';layer.classList.remove('detail-unavoidable-scroll');return;
 }
 if(layer.dataset.focusType==='exec'){
  const duties=document.createElement('div'),context=document.createElement('div');
  duties.className='detail-lane exec-duties';context.className='detail-lane exec-context';
  nodes.forEach((node,index)=>(index===0?duties:context).appendChild(node));
  grid.replaceChildren(duties,context);
  layer.dataset.density='0';layer.classList.remove('detail-unavoidable-scroll');
  return;
 }
 const width=win.clientWidth;
 const columns=width>=1060?3:width>=930&&layer.dataset.focusType!=='direction'?3:width>=720?2:1;
 // Preserve top-to-bottom reading order, balance content by approximate visual weight.
 let lanes=Array.from({length:columns},()=>document.createElement('div'));
 lanes.forEach(n=>n.className='detail-lane');
 const weights=nodes.map(n=>{let t=n.textContent||'';return t.length+115+(n.querySelectorAll('li,.case-reference').length*60)});
 const total=weights.reduce((x,y)=>x+y,0),target=total/columns;
 let lane=0,load=0;
 nodes.forEach((node,i)=>{
  if(lane<columns-1&&load>target*.62&&(load+weights[i]*.55)>target){lane++;load=0;}
  lanes[lane].appendChild(node);load+=weights[i];
 });
 grid.replaceChildren(...lanes);
 layer.dataset.density='0';layer.classList.remove('detail-unavoidable-scroll');
 const content=layer.querySelector('.detail-content');
 const contentEnd=()=>content.getBoundingClientRect().bottom-parseFloat(getComputedStyle(content).paddingBottom);
 const spilling=()=>lanes.some(l=>[...l.children].some(c=>c.getBoundingClientRect().bottom>contentEnd()+2));
 for(let i=0;i<5;i++){
  // Real bounding boxes catch overflow even when flex lanes are exactly 100% tall.
  if(!spilling())break;
  layer.dataset.density=String(i+1);
 }
 if(spilling()){
  // Small mobile / accessibility font settings: never clip critical information.
  layer.classList.add('detail-unavoidable-scroll');
 }
}
function zoomToDetail(type,id){
 const layer=$('#detail-zoom'),win=layer.querySelector('.detail-window');
 const src=$('#inspector');
 const start=src?.getBoundingClientRect();
 const temp=document.createElement('div');temp.innerHTML=inspector(type,id);
 const header=temp.querySelector('.inspector-header');
 const title=temp.querySelector('h2'),sub=temp.querySelector('.sub'),body=temp.querySelector('.inspector-body');
 const source=layer.querySelector('.detail-source');
 source.replaceChildren(...[...(body?.children||[])].map(x=>x.cloneNode(true)));
 layer.querySelector('#detail-topic').textContent=header?.querySelector('.inspector-tag')?.textContent||'ПОДРОБНОСТИ';
 layer.querySelector('#detail-title').textContent=title?.textContent||'';
 layer.querySelector('#detail-subtitle').textContent=sub?.textContent||'';
 ++detailSerial;
 layer.dataset.focusType=type==='direction'&&id==='infrastructure'?'infrastructure':type==='direction'&&id==='aviation'?'aviation-markets':type;
 layer.querySelector('.focus-mark').textContent=layer.dataset.focusType==='infrastructure'?'N. / ИНФРАСТРУКТУРНЫЕ ПРОЕКТЫ':layer.dataset.focusType==='aviation-markets'?'N. / АВИА-ГСМ · НОВЫЕ РЫНКИ':'N. / УПРАВЛЕНЧЕСКИЙ РАЗБОР';
 layer.querySelector('.detail-close span').textContent=type==='direction'?'К направлениям':'К схеме';
 layer.hidden=false;document.body.classList.add('has-detail-zoom');
 win.getAnimations().forEach(a=>a.cancel());
 // Wait for fixed positioning to be measured, then animate from the former right panel.
 adaptDetailColumns();
 if(start&&!reduced()&&win.animate){
  const end=win.getBoundingClientRect(),sx=Math.min(1.0,Math.max(.22,start.width/end.width)),sy=Math.min(1.0,Math.max(.22,start.height/end.height));
  const tx=(start.left+start.width/2)-(end.left+end.width/2),ty=(start.top+start.height/2)-(end.top+end.height/2);
  win.animate([{opacity:.64,transform:`translate(${tx}px,${ty}px) scale(${sx},${sy})`,filter:'blur(5px)'},{opacity:1,transform:'translate(0,0) scale(1)',filter:'blur(0)'}],{duration:600,easing:'cubic-bezier(.16,1,.3,1)'});
 }
}
const inlineDetailTypes=new Set(['company','change','growth','decision']);
function setDetail(type,id,{expand=true}={}){
 if(type==='case'){const item=itemById(type,id);if(!item||item.expandable===false)return;if(slides[current.slide].id==='cases'&&current.caseCategory!==item.category){current.caseCategory=item.category;render();}}
 current.selected[type]=id;detailState={type,id};
 document.querySelectorAll('[data-item]').forEach(el=>el.classList.toggle('active',el.dataset.item===`${type}:${id}`));
 if(type==='change'&&slides[current.slide].id==='cases'){zoomToDetail(type,id);return;}
 if(inlineDetailTypes.has(type)){setInlineDetail(type,id);return;}
 const box=$('#inspector');if(box){box.innerHTML=preview(type,id);box.setAttribute('aria-live','polite')}
 if(expand)zoomToDetail(type,id);
}

function setInlineDetail(type,id){
 current.selected[type]=id;detailState={type,id};
 const box=$('#inspector');if(!box){render();requestAnimationFrame(()=>setInlineDetail(type,id));return;}
 const grid=box.closest('.slide-grid'),wasFocused=grid?.classList.contains('inline-focus');
 box.getAnimations().forEach(animation=>animation.cancel());
 box.dataset.inlineType=type;box.innerHTML=inspector(type,id);box.setAttribute('aria-live','polite');
 prepareInlineLayout(box);
 grid?.classList.add('inline-focus');
 requestAnimationFrame(()=>{
  adaptInlineInspector(box);
  if(reduced()||!box.animate)return;
  box.animate([{opacity:.42,transform:`translateX(${wasFocused?30:82}px) scale(${wasFocused?0.97:0.88})`,filter:'blur(5px)'},{opacity:1,transform:'translateX(0) scale(1)',filter:'blur(0)'}],{duration:wasFocused?760:1150,easing:'cubic-bezier(.16,1,.3,1)'});
  [...box.querySelectorAll('.inline-section-flow>.section,.inline-section-stack>.section,.inspector-body>.pill,.inspector-body>.briefing-manifesto')].forEach((block,index)=>block.animate([{opacity:0,transform:'translateY(24px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:820,delay:(wasFocused?70:220)+index*48,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}));
 });
 setTimeout(()=>adaptInlineInspector(box),1180);
 setTimeout(()=>adaptInlineInspector(box),1700);
}

function prepareInlineLayout(box=$('#inspector')){
 const body=box?.querySelector('.inspector-body');if(!body)return;
 const pill=body.querySelector(':scope>.pill'),header=box.querySelector('.inspector-header'),index=header?.querySelector('.inspector-index');
 if(pill&&header)header.insertBefore(pill,index||null);
 let flow=body.querySelector(':scope>.inline-section-flow');
 const direct=[...body.children].filter(node=>node.classList.contains('section'));
 const nested=flow?[...flow.querySelectorAll(':scope>.section,:scope>.inline-section-stack>.section')]:[];
 const sections=direct.length?direct:nested;if(sections.length<2)return;
 const width=box.getBoundingClientRect().width||box.clientWidth;
 const columns=sections.length>=6&&width>=720?3:width>=510?2:1;
 box.dataset.inlineColumns=String(columns);
 if(flow&&flow.querySelectorAll(':scope>.inline-section-stack').length===columns)return;
 const oldFlow=flow;flow=document.createElement('div');flow.className='inline-section-flow';
 if(oldFlow)oldFlow.before(flow);else sections[0].before(flow);
 const scored=sections.map((section,index)=>({section,index,weight:section.textContent.trim().length+section.querySelectorAll('li').length*42})).sort((a,b)=>b.weight-a.weight);
 const stacks=Array.from({length:columns},()=>{const stack=document.createElement('div');stack.className='inline-section-stack';flow.appendChild(stack);return stack});
 const loads=Array(columns).fill(0);
 scored.forEach(item=>{const target=loads.indexOf(Math.min(...loads));stacks[target].appendChild(item.section);loads[target]+=item.weight+90});
 stacks.forEach(stack=>[...stack.children].sort((a,b)=>sections.indexOf(a)-sections.indexOf(b)).forEach(section=>stack.appendChild(section)));
 oldFlow?.remove();
}

function adaptInlineInspector(box=$('#inspector')){
 if(!box?.classList.contains('inspector-inline')||!inlineDetailTypes.has(box.dataset.inlineType)||window.innerWidth<=970)return;
 prepareInlineLayout(box);
 box.dataset.inlineDensity='0';
 const footerTop=$('.footbar')?.getBoundingClientRect().top||window.innerHeight;
 const presentation=document.body.classList.contains('presentation-mode');
 const currentLift=presentation?0:Number(box.dataset.inlineLift||0),naturalTop=box.getBoundingClientRect().top+currentLift;
 const safeTop=($('.top')?.getBoundingClientRect().bottom||0)+10;
 const lift=presentation?0:Math.max(0,Math.floor(naturalTop-safeTop));
 box.dataset.inlineLift=String(lift);box.style.setProperty('--inline-lift',`${-lift}px`);
 const available=Math.max(390,Math.floor(footerTop-(naturalTop-lift)-8));
 box.style.setProperty('--inline-height',`${available}px`);
 for(let density=1;density<=2&&box.scrollHeight>box.clientHeight+2;density++)box.dataset.inlineDensity=String(density);
}

function head(i,title,desc){i=current.slide;return `<div class="slide-heading"><div><div class="eyebrow">NAVARRO TRADE · ${esc(slides[i].short)} / ${slides.length}</div><h1 class="headline">${title}</h1><p class="head-desc">${desc}</p></div><div class="slide-no">${esc(slides[i].short)}</div></div>`;}
function shell(content,type,id){
 detailState={type,id};
 const inline=inlineDetailTypes.has(type),focused=inline&&!!current.selected[type];
 if(inline&&!focused)return `<div class="slide-grid overview-only"><div class="left-area">${content}</div></div>`;
 const panel=inline&&focused?inspector(type,id):preview(type,id);
 return `<div class="slide-grid ${focused?'inline-focus':''}"><div class="left-area">${content}</div><aside class="inspector ${inline?'inspector-inline':'inspector-preview'}" id="inspector" ${inline?`data-inline-type="${type}"`:''}>${panel}</aside></div>`;
}
function cover(){return `<div class="cover"><div class="covercopy"><div class="eyebrow">STERLING ENERGY GROUP LTD. / СТРАТЕГИЧЕСКАЯ И ОПЕРАЦИОННАЯ СЕССИЯ 2026</div><h1>От отдельных компаний<br>к <em>общей системе</em><br>ответственности.</h1><p>Бизнес-модель Navarro Trade. Реальные кейсы. Исполнение сделок. Взаимодействие предприятий. Решения руководства.</p><div class="cover-actions"><button class="primary" data-goto="directions">Начать презентацию ↗</button></div></div><div class="cover-identity"><img class="cover-logo" src="../session/assets/navarro-logo.png" alt="NAVARRO TRADE"><div class="coverstamp">СТРАТЕГИЧЕСКАЯ СЕССИЯ</div></div></div>`;}
function directions(){
 const cards=`<div class="tile-grid direction-first">${D.directions.map(d=>`<button type="button" class="tile direction-launch" data-open-direction="${esc(d.id)}"><span class="tag">${esc(d.tag)}</span><span class="big-number">${esc(d.num)}</span><h3>${esc(d.name)}</h3><span class="tile-desc">${esc(d.intro)}</span><span class="direction-foot">${d.id==='infrastructure'?'Действующие проекты · планы развития':d.id==='aviation'?'Клиенты · Ташкент · Гонконг':'Этапы · предприятия · риски · кейсы'} <b>Открыть ↗</b></span></button>`).join('')}</div>
 <div class="direction-overview"><div><span class="direction-overview-kicker">НАПРАВЛЕНИЯ РАБОТЫ</span><b>Транзит · инфраструктура · авиационное топливообеспечение</b><p>Операционные цепочки и инфраструктурный портфель Navarro Trade.</p></div><div><span class="direction-overview-kicker">ГЛАВНЫЕ РИСКИ</span><b>Тарифы · курс · простои · товарный учёт</b><p>В операционных направлениях показаны этапы и контрольные точки; в инфраструктуре — действующие проекты и планы развития.</p></div></div>`;
 return head(2,'Три направления. <span style="color:#389f91">Одна группа.</span>','Международный транзит, инфраструктура и авиа-ГСМ: цепочки исполнения, участники и контрольные точки.')+cards;
}

function orgmap(){
 return `<div class="org-image-slide"><div class="org-image-heading"><div><div class="eyebrow">NAVARRO TRADE · 01 / 6</div><h1>Организационная <span>структура</span></h1></div><b>01</b></div><figure class="org-image-frame"><img src="assets/organization-structure-november.png" alt="Организационная структура Navarro Trade"></figure></div>`;
}

function dealflow(){
 const cards=D.dealflows.map((f,j)=>`<button class="process-selector" data-explore-flow="${esc(f.id)}"><div class="process-cover-num">0${j+1}</div><div class="process-tag">${j===0?'КНР · ПОСТАВКИ · ЖЕЛЕЗНАЯ ДОРОГА':'КАЗАХСТАН · ОПТОВАЯ ТОРГОВЛЯ'}</div><h2>${esc(f.name)}</h2><p>${esc(f.lead)}</p><div class="process-selector-foot"><span>${f.steps.length} этапов</span><strong>Карта процесса ↗</strong></div></button>`).join('');
 const hints=`<div class="process-feature-grid"><div><span>01 / ЛОГИКА</span><strong>Фактическая последовательность</strong><small>Без придуманной универсальной схемы</small></div><div><span>02 / СВЯЗИ</span><strong>Точки контакта с предприятиями</strong><small>JetWay, поставщики, базы и логистические операторы</small></div><div><span>03 / РИСКИ</span><strong>Простой · тарифы · валютный курс · маржа</strong><small>Кейсы на соответствующих этапах</small></div></div>`;
 return head(4,'Бизнес-процессы <span style="color:#389f91">как они есть.</span>','Фактические маршруты исполнения: этапы, участники, документы, риски и связанные кейсы.')+
 `<div class="process-selector-grid">${cards}</div>${hints}`;
}
const caseCount=n=>`${n} ${n%10===1&&n%100!==11?'кейс':n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'кейса':'кейсов'}`;
const proposalCount=n=>`${n} ${n%10===1&&n%100!==11?'предложение':n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'предложения':'предложений'}`;
const caseCategoryItems=id=>[
 ...D.cases.filter(c=>c.category===id).map(item=>({type:'case',item})),
 ...D.improvements.filter(item=>item.category===id).map(item=>({type:'change',item}))
];
function selectCaseCategory(id){
 if(id&& !D.caseCategories.some(x=>x.id===id))return;
 current.caseCategory=id||null;current.selected.case=null;render();
 const target=id?document.querySelector(`[data-case-category="${id}"]`):document.querySelector('[data-case-category]');
 target?.focus({preventScroll:true});
}
function cases(){
 const category=D.caseCategories.find(x=>x.id===current.caseCategory);
 if(!category){
  const cards=D.caseCategories.map(group=>{
   const cases=D.cases.filter(c=>c.category===group.id).length,proposals=D.improvements.filter(c=>c.category===group.id).length;
   return `<button type="button" class="tile direction-launch case-category-launch" data-case-category="${esc(group.id)}"><span class="tag">${esc(group.tag)}</span><span class="big-number">${esc(group.num)}</span><h3>${esc(group.name)}</h3><span class="tile-desc">${esc(group.intro)}</span><span class="direction-foot"><span>${caseCount(cases)}${proposals?` · ${proposalCount(proposals)}`:''}</span><b>Открыть ↗</b></span></button>`;
  }).join('');
  return `<div class="cases-slide" data-cases-view="overview">${head(3,'Кейсы и <span style="color:#389f91">предложения</span>','Финансы, коммерция и менеджмент: проблемные ситуации и практические решения.')}<div class="tile-grid direction-first case-category-grid">${cards}</div></div>`;
 }
 const items=caseCategoryItems(category.id),columns=items.length<=2?Math.max(1,items.length):items.length===4?2:3;
 const cards=items.map(({type,item})=>{
  const isCase=type==='case',isStatic=isCase&&item.expandable===false;
  const content=`<div class="meta"><span class="card-kind ${isCase?'case-kind':'proposal-kind'}">${isCase?'КЕЙС':'ПРЕДЛОЖЕНИЕ'}</span> · ${esc(isCase?item.group:item.label)}${isStatic?'':'<span class="corner">↗</span>'}</div><b>${esc(isCase?item.title:item.name)}</b><small>${esc(isCase?item.subtitle:item.why)}</small>`;
  return isStatic?`<article class="clickcard casecard casecard-static">${content}</article>`:`<button type="button" class="clickcard casecard ${current.selected[type]===item.id?'active':''}" data-item="${type}:${esc(item.id)}">${content}</button>`;
 });
 const tabs=D.caseCategories.map(group=>`<button type="button" data-case-category="${esc(group.id)}" aria-pressed="${group.id===category.id}">${esc(group.name)}<span>${caseCategoryItems(group.id).length}</span></button>`).join('');
 return `<div class="cases-slide" data-cases-view="category">${head(3,`${esc(category.name)} <span style="color:#389f91">/ кейсы и предложения</span>`,category.intro)}<div class="case-category-toolbar"><button type="button" class="case-category-back" data-case-category="all">← Все направления</button><nav class="case-category-tabs" aria-label="Направления кейсов и предложений">${tabs}</nav></div><div class="case-grid cases-full-grid category-case-grid" style="--category-columns:${columns};--case-rows:${Math.ceil(items.length/columns)}">${cards.join('')}</div></div>`;
}

function partners(){let cards=`<div class="partner-grid">${D.companies.map(c=>`<button class="clickcard partner ${current.selected.company===c.id?'active':''}" data-item="company:${c.id}"><span class="badge">${esc(c.short)}</span><span><div class="meta">STERLING GROUP ↗</div><b>${esc(c.title)}</b><small>${esc(c.subtitle)}</small></span></button>`).join('')}</div>`;
 return head(7,'Одна группа. <span style="color:#389f91">Пять точек контакта.</span>','Входящие и исходящие данные, договорные связи и зоны ответственности предприятий.')+shell(cards,'company',current.selected.company||'dostyq');}
function changes(){const projects=D.improvements.filter(c=>c.category==='digital');if(!projects.some(c=>c.id===current.selected.change))current.selected.change=null;let cards=`<div class="changes-grid digital-project-grid">${projects.map((c,index)=>`<button class="clickcard ${current.selected.change===c.id?'active':''}" data-item="change:${c.id}"><div class="meta"><span>0${index+1}</span> · ${esc(c.label)} <span class="corner">↗</span></div><b>${esc(c.name)}</b><small>${esc(c.why)}</small></button>`).join('')}</div>`;
 return head(4,'Цифровизация <span style="color:#389f91">/ проекты</span>','ЭДО, анализ рынка, управление задачами и показателями, ИИ-оркестрация.')+shell(cards,'change',current.selected.change||projects[0]?.id);}
function growth(){const blocks=D.growth.map((item,index)=>`<article class="strategy-growth-block strategy-growth-${esc(item.id)}"><div class="strategy-growth-top"><span>0${index+1}</span><small>СТРАТЕГИЧЕСКОЕ НАПРАВЛЕНИЕ</small></div><h2>${esc(item.name)}</h2><section><h3>Описание</h3><p>${esc(item.description)}</p></section><section class="strategy-growth-result"><h3>Результат</h3><p>${esc(item.result)}</p></section></article>`).join('');
 return head(5,'Стратегическое <span style="color:#389f91">развитие</span>','Толлинг и водная транспортировка светлых нефтепродуктов.')+`<div class="strategy-growth-grid">${blocks}</div>`;}
function decision(){let items=`<div class="exportbar"><button class="primary" id="export-decisions">Экспортировать протокол ↓</button></div><div class="decisions-grid">${D.decisions.map(d=>`<div class="clickcard ${current.selected.decision===d.id?'active':''}" data-item="decision:${d.id}"><div class="meta">РЕШЕНИЕ / ${esc(d.id.toUpperCase())}</div><div class="decision-row"><strong>${esc(d.title)}</strong><span class="corner">↗</span></div><small>${esc(d.owner)}</small></div>`).join('')}</div>`;
 return head(9,'Решения, <span style="color:#389f91">которые останутся после сессии.</span>','Статусы вопросов, ответственные и реестр решений стратегической сессии.')+shell(items,'decision',current.selected.decision||'d1');}
let slideSerial=0;
function render(){
 hideZoom({instant:true});
 let s=slides[current.slide];$('#chapter').textContent=s.name;
 document.documentElement.style.setProperty('--slide-progress',current.slide+1);
 $('#count').textContent=`${String(current.slide+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
 $('#sidenav').innerHTML=slides.map((x,k)=>`<button class="navlink ${k===current.slide?'active':''}" data-goto="${x.id}" title="${esc(x.name)}"><span class="navno">${x.short}</span><span>${esc(x.name)}</span></button>`).join('');
 let body=({opening:cover,directions,orgmap,cases,changes,growth})[s.id]();
 $('#page').innerHTML=`<div class="page-inner slide-enter">${body}</div>`;
 requestAnimationFrame(()=>adaptInlineInspector());
 $('#page').scrollTop=0;$('#side').classList.remove('open');
}
async function navigate(id){
 id=resolveSlide(id);
 let k=slides.findIndex(x=>x.id===id);if(k<0)return;
 if(k===current.slide){if(id==='cases'&&current.caseCategory){selectCaseCategory(null);return;}if(location.hash!==`#/${id}`)history.replaceState(null,'',`#/${id}`);return;}
 hideZoom({instant:true});
 const serial=++slideSerial;
 const page=$('#page'),old=page.querySelector('.page-inner');
 if(old?.animate&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  try{await old.animate([{opacity:1,transform:'translateY(0)',filter:'blur(0)'},{opacity:0,transform:'translateY(-18px)',filter:'blur(5px)'}],{duration:180,easing:'ease-in',fill:'forwards'}).finished}catch{}
 }
 if(serial!==slideSerial)return;
 if(id==='cases')current.caseCategory=null;
 current.slide=k;history.replaceState(null,'',`#/${id}`);render();
}
async function switchFlow(id){
 const next=D.dealflows.find(x=>x.id===id);if(!next)return;
 current.flow=id;current.selected.flow='0';
 const area=$('#flowcards');
 document.querySelectorAll('[data-flow]').forEach(x=>x.classList.toggle('active',x.dataset.flow===id));
 const desc=$('.head-desc');if(desc)desc.textContent=next.lead;
 if(!area){render();return;}
 if(area.animate&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  try{await area.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.975)'}],{duration:140,easing:'ease-in',fill:'forwards'}).finished}catch{}
 }
 area.getAnimations().forEach(a=>a.cancel());
 area.innerHTML=next.steps.map((st,k)=>`<button class="clickcard flowcard ${k===0?'active':''}" data-no="${String(k+1).padStart(2,'0')}" data-item="flow:${k}"><div class="meta">ЭТАП ${String(k+1).padStart(2,'0')}</div><b>${esc(st[0])}</b><small>${esc(st[2])}</small></button>`).join('');
 if(area.animate&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)area.animate([{opacity:.25,transform:'scale(.97) translateY(15px)'},{opacity:1,transform:'scale(1) translateY(0)'}],{duration:490,easing:'cubic-bezier(.16,1,.3,1)'});
 setDetail('flow','0',{expand:false});
}


// Static transit overview: full stage rail at left, supplied relationship scheme at right.
function ensureProcessExplorer(){
 let node=$('#process-explorer');if(node)return node;
 document.body.insertAdjacentHTML('beforeend',`<div id="process-explorer" class="process-explorer process-static-explorer" role="dialog" aria-modal="true" aria-label="Международный транзит" hidden><div class="process-backdrop" data-process-close></div><div class="process-window"><div class="process-modal-top"><div><span>НАПРАВЛЕНИЕ / БИЗНЕС-ПРОЦЕСС · NAVARRO TRADE</span><h2 id="process-modal-title"></h2></div><button type="button" class="process-close" data-process-close>✕ Закрыть</button></div><div class="process-modal-layout"><aside class="process-step-list" id="process-steps" aria-label="Этапы процесса"></aside><div class="process-stage-view process-static-view" id="process-view"></div></div><div class="process-modal-footer"><span>NAVARRO TRADE</span><span>Этапы · схема взаимодействия</span></div></div></div>`);
 return $('#process-explorer');
}
function openProcessExplorer(flow){
 const modal=ensureProcessExplorer();const f=D.dealflows.find(x=>x.id===flow);if(!f)return;
 modal.hidden=false;document.body.classList.add('process-open');
 modal.querySelector('#process-modal-title').textContent=f.name;
 const list=modal.querySelector('#process-steps');
 list.innerHTML=f.steps.map((st,i)=>`<div class="process-step process-step-static"><span>${String(i+1).padStart(2,'0')}</span><b>${esc(st[0])}</b><small>${esc(st[2])}</small></div>`).join('');
 modal.querySelector('#process-view').innerHTML=`<figure class="process-static-scheme"><img src="assets/transit-process-scheme.png" alt="Схема взаимодействия PetroChina, Navarro Trade, Dostyk Refinery, JetWay Logistics и станции Достык"></figure>`;
}
function closeProcessExplorer(){const modal=$('#process-explorer');if(modal&&!modal.hidden){modal.classList.add('closing');setTimeout(()=>{modal.hidden=true;modal.classList.remove('closing')},260)}document.body.classList.remove('process-open')}

function notify(message){let t=$('#toast');t.textContent=message;t.style.display='block';clearTimeout(notify.timer);notify.timer=setTimeout(()=>t.style.display='none',2300);}
function exportDecisions(){let ts=new Date().toLocaleString('ru-RU');const st={pending:'К обсуждению',agreed:'Отмечено согласованным',review:'На доработку',hold:'Отложено'};let text=`# Sterling Group · Реестр решений\n\nДата экспорта: ${ts}\n\n`+D.decisions.map((d,i)=>`## ${i+1}. ${d.title}\n\n**Статус:** ${st[current.decisions[d.id]||'pending']}\n\n**Предлагаемый ответственный:** ${d.owner}\n\n**Вопрос:** ${d.prompt}\n\n**Срок / подтверждение:** __________\n`).join('\n');let blob=new Blob([text],{type:'text/markdown;charset=utf-8'});let url=URL.createObjectURL(blob);let a=document.createElement('a');a.href=url;a.download='Sterling_Decisions.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),2500);notify('Реестр решений скачан');}
document.addEventListener('click',e=>{
 const projectImage=e.target.closest('[data-project-image]');if(projectImage){openProjectImage(+projectImage.dataset.projectImage);return;}
 if(e.target.closest('[data-project-image-close]')){$('#project-image-dialog')?.close();return;}
 const aviation=e.target.closest('[data-aviation-view]');if(aviation){if(!['clients','markets'].includes(aviation.dataset.aviationView))return;current.aviationView=aviation.dataset.aviationView;zoomToDetail('direction','aviation');document.querySelector(`.detail-columns [data-aviation-view="${current.aviationView}"]`)?.focus({preventScroll:true});return;}
 const category=e.target.closest('[data-case-category]');if(category){selectCaseCategory(category.dataset.caseCategory==='all'?null:category.dataset.caseCategory);return;}
 const direction=e.target.closest('[data-open-direction]');if(direction){const id=direction.dataset.openDirection;if(id==='aviation')current.aviationView='clients';if(D.processScenes[id]&&id!=='aviation')openProcessExplorer(id);else{current.selected.direction=id;detailState={type:'direction',id};zoomToDetail('direction',id)}return;}
 if(e.target.closest('[data-process-close]')){closeProcessExplorer();return;}
 const explorer=e.target.closest('[data-explore-flow]');if(explorer){openProcessExplorer(explorer.dataset.exploreFlow);return;}
 if(e.target.closest('[data-detail-close]')){hideZoom();return;}
 if(e.target.closest('[data-inline-close]')){if(detailState.type)current.selected[detailState.type]=null;render();return;}
 if(e.target.closest('[data-expand-current]')){zoomToDetail(detailState.type,detailState.id);return;}
 const linked=e.target.closest('[data-open-case]');if(linked){const id=linked.dataset.openCase;if(!D.cases.some(c=>c.id===id&&c.expandable!==false))return;Promise.resolve(navigate('cases')).then(()=>setDetail('case',id));return;}
 const go=e.target.closest('[data-goto]');if(go){navigate(go.dataset.goto);return;}
 const flow=e.target.closest('[data-flow]');if(flow){switchFlow(flow.dataset.flow);return;}
 const item=e.target.closest('[data-item]');if(item){const [type,id]=item.dataset.item.split(':');setDetail(type,id);return;}
 if(e.target.closest('#export-decisions')){exportDecisions();return;}
 if(e.target.closest('#mobile-nav')){$('#side').classList.toggle('open');}
});
$('#prev').onclick=()=>navigate(slides[Math.max(0,current.slide-1)].id);$('#next').onclick=()=>navigate(slides[Math.min(slides.length-1,current.slide+1)].id);
const isEditable=(target)=>target?.closest?.('input,textarea,select,[contenteditable="true"]');
const isInteractive=(target)=>target?.closest?.('button,a,[role="button"]');
function setPresentationMode(on){document.body.classList.toggle('presentation-mode',on);document.body.classList.toggle('stage-mode',on);let b=$('#fullscreen');if(b){b.textContent=on?'⤡  Выйти из показа':'⛶  На весь экран';b.setAttribute('aria-pressed',on?'true':'false');}}
async function toggleFullscreen(){try{
 if(document.fullscreenElement){await document.exitFullscreen();setPresentationMode(false);return;}
 if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen();setPresentationMode(true);return;}
 }catch(err){notify('Браузер ограничил полноэкранный режим');}
 setPresentationMode(!document.body.classList.contains('presentation-mode'));
}
$('#fullscreen').addEventListener('click',toggleFullscreen);
document.addEventListener('fullscreenchange',()=>{
 setPresentationMode(!!document.fullscreenElement);
 const adapt=()=>{adaptDetailColumns();adaptInlineInspector()};
 requestAnimationFrame(adapt);setTimeout(adapt,220);setTimeout(adapt,620);
});
window.addEventListener('resize',()=>requestAnimationFrame(()=>{adaptDetailColumns();adaptInlineInspector()}));
const goNext=()=>navigate(slides[Math.min(slides.length-1,current.slide+1)].id);
const goPrev=()=>navigate(slides[Math.max(0,current.slide-1)].id);
document.addEventListener('keydown',e=>{
 if(isEditable(e.target)||e.ctrlKey||e.altKey||e.metaKey)return;
 const imageDialog=$('#project-image-dialog');if(imageDialog?.open){if(e.key==='Escape'){e.preventDefault();imageDialog.close();}return;}
 if(e.key==='f'||e.key==='F'||e.key==='F11'){if(e.key==='F11'&&!document.fullscreenEnabled)return;e.preventDefault();toggleFullscreen();return;}
 if(e.key==='Escape'){if($('#process-explorer')&&!$('#process-explorer').hidden){e.preventDefault();closeProcessExplorer();return;}if(!$('#detail-zoom').hidden){e.preventDefault();hideZoom();return;}if(slides[current.slide].id==='cases'&&current.caseCategory){e.preventDefault();selectCaseCategory(null);return;}if(!document.fullscreenElement)setPresentationMode(false);$('#side').classList.remove('open');return;}
 if($('#process-explorer')&&!$('#process-explorer').hidden)return;
 if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '||e.code==='Space'||e.key==='Enter'&&!isInteractive(e.target)){
   if((e.key===' '||e.key==='Enter')&&isInteractive(e.target))return;
   e.preventDefault();goNext();return;
 }
 if(e.key==='ArrowLeft'||e.key==='PageUp'||e.key==='Backspace'){
  e.preventDefault();goPrev();return;
 }
 if(e.key==='Home'){e.preventDefault();navigate(slides[0].id);return;}
 if(e.key==='End'){e.preventDefault();navigate(slides[slides.length-1].id);return;}
});
window.addEventListener('hashchange',()=>{let id=location.hash.replace(/^#\/?/,'');if(id&&id!==slides[current.slide].id)navigate(id)});
let init=resolveSlide(location.hash.replace(/^#\/?/,''));if(init)history.replaceState(null,'',`#/${init}`);current.slide=Math.max(0,slides.findIndex(s=>s.id===init));render();
})();
