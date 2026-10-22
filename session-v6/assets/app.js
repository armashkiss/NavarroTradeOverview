/* Sterling 2026 — interactive internal executive presentation. No trackers, APIs or dependencies. */
(()=>{'use strict';
const D=window.SESSION_DATA;if(!D){document.body.textContent='Материалы презентации не загрузились.';return;}
const $=s=>document.querySelector(s), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nodeById=Object.fromEntries(D.executives.map(e=>[e.id,e]));
const itemById=(t,id)=>({direction:D.directions,exec:D.executives,case:D.cases,company:D.companies,change:D.improvements,growth:D.growth,decision:D.decisions})[t]?.find(x=>x.id===id);
const current={slide:0,selected:{},orgParent:null,orgSelection:'ceo',flow:'transit',decisions:(()=>{try{return JSON.parse(localStorage.getItem('navarro-session-decisions')||'{}')}catch{return {}}})()};
const slides=D.navigation;
const bullet=list=>`<ul>${list.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
const block=(name,html)=>`<div class="section"><h4>${esc(name)}</h4>${html}</div>`;
const p=s=>`<p>${esc(s)}</p>`;
const pill=s=>`<span class="pill">${esc(s)}</span>`;
const extra=D.details||{};
const plain=(s)=>`<p>${esc(s)}</p>`;
function caseReferences(ids){if(!ids||!ids.length)return '';
 let cases=ids.map(id=>D.cases.find(c=>c.id===id)).filter(Boolean);
 return cases.length?block('Связанные кейсы и проблемы',`<div class="case-references">${cases.map(c=>`<button class="case-reference" data-open-case="${esc(c.id)}"><span class="ref-number">${esc(c.metric)}</span><span><b>${esc(c.title)}</b><small>${esc(c.issue)}</small></span><span aria-hidden="true">↗</span></button>`).join('')}</div>`):'';
}
function factsFlag(label){return `<span class="data-flag">${esc(label)}</span>`}
const rich=D.briefings||{};
function richBrief(type,id){
 const b=rich[type]?.[id];if(!b)return '';
 const steps=b.mechanism||[];
 return `<div class="briefing-manifesto"><div class="manifesto-label">УПРАВЛЕНЧЕСКАЯ ИДЕЯ</div><strong>${esc(b.headline)}</strong></div>`+
   block('Почему это важно',p(b.why))+
   block('Механика внедрения',bullet(steps))+
   block('Маршрут / цепочка',`<div class="briefing-route">${esc(b.workflow)}</div>`)+
   block('Разделение ролей',p(b.roles))+
   block('Условия и контроль',p(b.control))+
   block('Как измерить эффект',p(b.kpi))+
   block('Ожидаемый результат',p(b.outcome))+
   `<p class="source-caption">${esc(b.source)}</p>`;
}
function inspector(type,id){let i=itemById(type,id);if(!i&&type!=='flow')return `<div class="inspector-header"><span class="inspector-tag">INSIGHT PANEL</span><span class="inspector-index">N.</span></div><h2>Выберите карточку</h2><p class="sub">Кликните на этап, отдел, компанию или кейс. Здесь появятся описание процесса, проблема и предлагаемое решение, если они есть в материалах.</p><div class="empty-hint">НАВИГАЦИЯ<br>← → / Space / PageDown · следующий экран<br>F · полный экран · Esc · выход</div>`;
 let tag='',title='',sub='',inner='',e;
 if(type==='direction'){
  e=extra.directions?.[id];tag=i.tag;title=i.name;sub=i.intro;
  inner=pill(i.status)+block('Как работает направление',plain(e?.process||i.scope))+
    block('Ответственный контур',plain(i.owner))+
    (e?.documents?.length?block('Документы / подтверждения',bullet(e.documents)):'')+
    caseReferences(e?.cases||[i.caseId])+
    block('Предлагаемые решения',plain(e?.solution||i.actions.join('; ')))+
    (id==='transit'?block('Критичные точки',bullet(['Пересогласование тарифов КТЖ и ставок оперирования вагонами.','Валютная разница при изменении курса между расчётом и оплатой.','Согласование графиков и риск простоя, влияющий на маржу.'])):'');
 }else if(type==='exec'){
  tag=i.en;title=i.name;sub=i.lead;inner=pill(i.abbr)+
    (i.super?block('Административное подчинение',plain(nodeById[i.super].name)):'')+
    block('Функции и зона ответственности',bullet(i.duties))+
    (i.children.length?block('Подразделения',bullet(i.children.map(cid=>nodeById[cid].name))):'')+
    ((id==='coo'||id==='pcqa')?caseReferences(['measurement','ops']):'')+
    ((id==='legal')?caseReferences(['legal']):'')+
    ((id==='cfo'||id==='fpa')?caseReferences(['receivable']):'');
 }else if(type==='case'){
  e=extra.cases?.[id];tag=i.group;title=i.title;sub=i.subtitle;
  inner=factsFlag('По материалам подразделений · проверить на сессии')+
    block('Описание процесса',plain(e?.process||i.subtitle))+
    block('Что произошло',plain(e?.facts||i.issue))+
    block('Основная проблема',plain(e?.cause||i.issue))+
    block('Последствия',plain(i.effect))+
    (e?.lesson?block('Урок для группы',plain(e.lesson)):'')+
    block('Предлагаемое решение',plain(i.resolution+(e?.next?` ${e.next}`:'')))+
    block('Предлагаемый ответственный',plain(i.owner))+
    block('Контрольная точка для руководства',plain('Проверить фактические документы, позиции участников и критерий закрытия корректирующего действия; установить владельца и срок.'))+
    `<p class="source-caption">ИСТОЧНИК: ${esc(i.source)}. Факты и выводы требуют проверки обеими сторонами.</p>`;
 }else if(type==='company'){
  e=extra.partners?.[id];tag='STERLING / OPERATING LINKS';title=i.title;sub=i.subtitle;
  inner=block('Описание процесса',plain(e?.process||i.focus))+
    block('Получает от Navarro',plain(i.from))+
    block('Передаёт Navarro',plain(i.to))+
    block('Проблема / узкое место',plain(i.risk))+
    caseReferences(e?.cases||[i.caseId])+
    block('Предлагаемое решение',plain(e?.solution||'Уточнить владельца процесса и сроки обмена данными.'))+
    block('Как закрепить взаимодействие',plain('Согласовать входную заявку, состав подтверждающих данных, ответственные должности, сроки передачи и процедуру эскалации. Административная подчинённость между ТОО не создаётся.'));
 }else if(type==='change'){
  tag=i.label;title=i.name;sub=i.why;inner=pill('Инициатива — не утверждена')+
    richBrief('change',id)+
    caseReferences(i.caseId?[i.caseId]:[])+
    block('Предложено вынести на сессию',plain(i.decision));
 }else if(type==='growth'){
  tag=i.tag;title=i.name;sub=i.goal;inner=pill(i.state)+
    richBrief('growth',id)+
    block('Что подготовить к решению',plain(i.next));
 }else if(type==='decision'){
  tag='EXECUTIVE DECISION';title=i.title;sub=i.prompt;
  const status=current.decisions[i.id]||'pending';const names={pending:'К обсуждению',agreed:'Отмечено как согласованное',review:'На доработку',hold:'Отложено'};
  const link={d1:['change','coo-owner'],d2:['change','tariff-fx'],d3:['change','tariff-fx'],d4:['change','inventory-audit'],d5:['change','clm'],d7:['growth','tolling'],d8:['growth','mobile-fuel'],d9:['growth','ion-franchise']}[id];
  const linked=link?rich[link[0]]?.[link[1]]:null;
  inner=pill(names[status])+block('Предмет решения',plain(i.prompt))+
    block('Предлагаемый ответственный',plain(i.owner))+
    (linked?block('Зачем решение необходимо',plain(linked.why)):'')+
    (linked?block('Что потребуется внедрить',bullet(linked.mechanism)):'')+
    (linked?block('Как определить исполнение',plain(linked.kpi)):'')+
    block('Результат обсуждения',plain('Назначить исполнителя, согласовать документ/полномочия, установить контрольную дату и подтверждающий результат.'))+
    `<p class="source-caption">Отметка сохраняется локально и не заменяет подписанный протокол.</p>`;
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
 return `<div class="inspector-lead"><div class="inspector-header"><span class="inspector-tag">${esc(tag)}</span><span class="inspector-index">N.</span></div><h2>${esc(title)}</h2><p class="sub">${esc(sub)}</p></div><div class="inspector-body">${inner}</div>`;
}
// v4.2: a compact on-slide preview, plus a cinematic no-scroll case focus.
function preview(type,id){
 const i=itemById(type,id);let title='',sub='',tag='INSIGHT PANEL';
 if(type==='flow'){
  const f=D.dealflows.find(x=>x.id===current.flow);const st=f?.steps[+id];
  title=st?.[0]||'Этап сделки';sub=st?.[1]||'';tag='МАРШРУТ СДЕЛКИ';
 } else if(i){title=i.name||i.title||'Подробности';sub=i.subtitle||i.intro||i.lead||i.scope||i.goal||i.why||i.prompt||'';tag=type==='case'?'КЕЙС / ВЫВОДЫ':'INSIGHT PANEL';}
 return `<div class="inspector-header"><span class="inspector-tag">${esc(tag)}</span><span class="inspector-index">N.</span></div>
 <h2>${esc(title)}</h2><p class="sub">${esc(sub)}</p>
 <button class="detail-cta" type="button" data-expand-current>Развернуть разбор <span>↗</span></button>
 <p class="detail-hint">Нажмите на карточку слева — описание, кейс, последствия и решение откроются крупно на экране без прокрутки.</p>`;
}
let detailState={type:null,id:null},detailSerial=0;
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function hideZoom({instant=false}={}){
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
 layer.dataset.focusType=type;
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
 current.selected[type]=id;detailState={type,id};
 document.querySelectorAll('[data-item]').forEach(el=>el.classList.toggle('active',el.dataset.item===`${type}:${id}`));
 if(inlineDetailTypes.has(type)){setInlineDetail(type,id);return;}
 const box=$('#inspector');if(box){box.innerHTML=preview(type,id);box.setAttribute('aria-live','polite')}
 if(expand)zoomToDetail(type,id);
}

function setInlineDetail(type,id){
 current.selected[type]=id;detailState={type,id};
 const box=$('#inspector');if(!box)return;
 const grid=box.closest('.slide-grid'),wasFocused=grid?.classList.contains('inline-focus');
 box.getAnimations().forEach(animation=>animation.cancel());
 box.dataset.inlineType=type;box.innerHTML=inspector(type,id);box.setAttribute('aria-live','polite');
 grid?.classList.add('inline-focus');
 requestAnimationFrame(()=>{
  adaptInlineInspector(box);
  if(reduced()||!box.animate)return;
  box.animate([{opacity:.42,transform:`translateX(${wasFocused?30:82}px) scale(${wasFocused?0.97:0.88})`,filter:'blur(5px)'},{opacity:1,transform:'translateX(0) scale(1)',filter:'blur(0)'}],{duration:wasFocused?760:1150,easing:'cubic-bezier(.16,1,.3,1)'});
  [...box.querySelectorAll('.inspector-body>.section,.inspector-body>.pill,.inspector-body>.data-flag,.inspector-body>.briefing-manifesto,.inspector-body>.source-caption')].forEach((block,index)=>block.animate([{opacity:0,transform:'translateY(28px) scale(.95)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:760,delay:(wasFocused?80:250)+index*70,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}));
 });
 setTimeout(()=>adaptInlineInspector(box),1180);
}

function adaptInlineInspector(box=$('#inspector')){
 if(!box?.classList.contains('inspector-inline')||!inlineDetailTypes.has(box.dataset.inlineType)||window.innerWidth<=970)return;
 box.dataset.inlineDensity='0';
 const footerTop=$('.footbar')?.getBoundingClientRect().top||window.innerHeight;
 const available=Math.max(390,Math.floor(footerTop-box.getBoundingClientRect().top-8));
 box.style.setProperty('--inline-height',`${available}px`);
 for(let density=1;density<=2&&box.scrollHeight>box.clientHeight+2;density++)box.dataset.inlineDensity=String(density);
}

function head(i,title,desc){i=current.slide;return `<div class="slide-heading"><div><div class="eyebrow">NAVARRO TRADE · ${esc(slides[i].short)} / ${slides.length}</div><h1 class="headline">${title}</h1><p class="head-desc">${desc}</p></div><div class="slide-no">${esc(slides[i].short)}</div></div>`;}
function shell(content,type,id){
 detailState={type,id};
 const inline=inlineDetailTypes.has(type),focused=inline&&!!current.selected[type];
 return `<div class="slide-grid ${focused?'inline-focus':''}"><div class="left-area">${content}</div><aside class="inspector ${inline?'inspector-inline':'inspector-preview'}" id="inspector" ${inline?`data-inline-type="${type}"`:''}>${inline?inspector(type,id):preview(type,id)}</aside></div>`;
}
function cover(){return `<div class="cover"><div class="covercopy"><div class="eyebrow">STERLING GROUP / STRATEGIC & OPERATIONAL SESSION 2026</div><h1>От отдельных компаний<br>к <em>общей системе</em><br>ответственности.</h1><p>Бизнес-модель Navarro Trade. Реальные кейсы. Исполнение сделок. Взаимодействие предприятий. Решения руководства.</p><div class="cover-actions"><button class="primary" data-goto="directions">Начать презентацию ↗</button><button class="secondary" data-goto="organization">Executive-структура →</button></div></div><div class="coverstamp">NAVARRO TRADE<br>WORKING EXECUTIVE MODEL<br>22 OCTOBER 2026</div></div><div class="quickstats"><div class="stat"><strong>03</strong><span>ключевых направления</span></div><div class="stat"><strong>10</strong><span>рабочих кейсов</span></div><div class="stat"><strong>05</strong><span>партнёрских контуров</span></div><div class="stat"><strong>09</strong><span>вопросов для решений</span></div></div><div class="business-note">Рабочая презентация по материалам подразделений. Факты и суммы требуют подтверждения; предложения не являются утверждёнными решениями Sterling.</div>`;}
function directions(){
 const cards=`<div class="tile-grid direction-first">${D.directions.map(d=>`<button type="button" class="tile direction-launch" data-open-direction="${esc(d.id)}"><span class="tag">${esc(d.tag)}</span><span class="big-number">${esc(d.num)}</span><h3>${esc(d.name)}</h3><span class="tile-desc">${esc(d.intro)}</span><span class="direction-foot">${d.id==='aviation'?'Модель, клиенты и инициативы':'Этапы · предприятия · риски · кейсы'} <b>Открыть ↗</b></span></button>`).join('')}</div>
 <div class="direction-overview"><div><span class="direction-overview-kicker">РЕАЛЬНАЯ ЦЕПОЧКА</span><b>Покупатель → подтверждённый объём → исполнение → документы</b><p>Международный транзит и оптовка отражены по фактическому описанию Navarro. Коммерческие и операционные предложения показаны отдельно.</p></div><div><span class="direction-overview-kicker">ГЛАВНЫЕ РИСКИ</span><b>Тарифы · курс · простои · товарный учёт</b><p>Выберите направление: откроется большая карта взаимодействия с этапами слева и решениями справа.</p></div></div>`;
 return head(1,'Три направления. <span style="color:#389f91">Одна группа.</span>','Бизнес-процесс теперь открывается прямо из направления — отдельного слайда с маршрутами больше нет.')+cards;
}

function orgmap(){
 const N=id=>nodeById[id];
 const box=id=>`<div class="map-leaf">${esc(N(id).name)}</div>`;
 const pillar=(label,manager,sections)=>`<div class="orgmap-pillar"><div class="orgmap-exec"><small>${esc(label)}</small><b>${esc(N(manager).name)}</b></div><div class="orgmap-stem"></div><div class="orgmap-sections">${sections.map(s=>{let n=N(s);return `<div class="orgmap-section"><strong>${esc(n.name)}</strong>${n.children.length?`<div class="orgmap-lowers">${n.children.map(cid=>box(cid)).join('')}</div>`:''}</div>`}).join('')}</div></div>`;
 return head(2,'Структура <span style="color:#389f91">одним взглядом.</span>','Проектная модель TO-BE · схема подчинённости без функциональных описаний')+
 `<div class="orgmap"><div class="orgmap-root">NAVARRO TRADE <strong>Генеральный директор</strong></div><div class="orgmap-main">${pillar('DCEO','deputy',['commercial','international'])}${pillar('COO','coo',['logistics','transitops','pcqa','afo'])}${pillar('CFO','cfo',['accounting','fpa'])}</div><div class="orgmap-support">${['legal','advisor','digital'].map(id=>`<div class="orgmap-direct">${esc(N(id).name)}<span>Прямое подчинение CEO</span></div>`).join('')}</div><div class="orgmap-note">Оргструктура TO-BE · новые подразделения и должности требуют официального утверждения</div></div>`;
}

function orgcard(n,cls=''){
 return `<button class="clickcard orgchild ${cls} ${current.orgSelection===n.id?'active':''}" data-org="${esc(n.id)}" aria-label="Открыть ${esc(n.name)}"><div class="meta">${esc(n.abbr)} · ${n.children.length?'ПОДРАЗДЕЛЕНИЕ':'ФУНКЦИЯ'}</div><b>${esc(n.name)}</b><small>${n.children.length?'Нажмите, чтобы приблизить и раскрыть отделы ↗':esc(n.lead||n.en)}</small><span class="org-card-chevron">↗</span></button>`;
}
function orgAncestors(id){const out=[];let n=nodeById[id];while(n&&n.id!=='ceo'){out.unshift(n);n=nodeById[n.super]}return out;}
function orgdetail(){
 const id=current.orgParent;
 if(!id)return `<div class="org-detail org-focus-entry" aria-live="polite"><div class="orgsubtop"><b>Выберите направление</b><span>ПРЯМОЕ ПОДЧИНЕНИЕ CEO</span></div><p class="org-empty">Нажмите на карточку руководителя. Ниже раскроются его подразделения, а справа — обязанности.</p></div>`;
 const n=nodeById[id];const child=n?.children||[];
 const chain=orgAncestors(id);
 return `<div class="org-detail org-focus-entry" aria-live="polite"><div class="org-crumbs"><button data-org="ceo">CEO</button>${chain.map(c=>`<span>›</span><button data-org="${esc(c.id)}" class="${id===c.id?'current':''}">${esc(c.abbr)}</button>`).join('')}</div><div class="orgsubtop"><div><span class="org-focus-kicker">ФОКУС ПОДРАЗДЕЛЕНИЯ</span><b>${esc(n.name)}</b><span class="org-focus-sub">${esc(n.lead)}</span></div><button class="orgback" data-orgback="1">← Назад</button></div>${child.length?`<div class="orgchildren">${child.map((c,k)=>orgcard(nodeById[c],`orgstep-${k}`)).join('')}</div>`:`<div class="org-leaf-note"><span class="org-leaf-icon">✓</span><p>Это направление не имеет нижестоящих подразделений в проектной структуре. Подробные обязанности и взаимодействия отображаются справа.</p></div>`}</div>`;
}
function org(){
 let execs=nodeById.ceo.children.map(id=>nodeById[id]);
 let chart=`<div class="orgstage ${current.orgParent?'has-focus':''}" id="orgstage"><div class="orgintro"><span class="accent-label">ОРГАНИЗАЦИОННАЯ МОДЕЛЬ · TO-BE</span><span class="thin">Выберите карточку, чтобы раскрыть подразделения</span></div><button class="org-ceo ${current.orgSelection==='ceo'?'active':''}" data-org="ceo"><span>CHIEF EXECUTIVE OFFICER</span><b>Генеральный директор</b></button><div class="orgbar"></div><div class="org-overview-label">НЕПОСРЕДСТВЕННО ПОДЧИНЯЮТСЯ ГЕНЕРАЛЬНОМУ ДИРЕКТОРУ</div><div class="org-execs ${current.orgParent?'branch-selected':''}">${execs.map(e=>`<button class="orgexec ${current.orgParent===e.id?'active':''}" data-org="${esc(e.id)}"><b>${esc(e.name)}</b><small>${esc(e.abbr)}</small></button>`).join('')}</div><div id="orgbranch">${orgdetail()}</div></div><div class="smallnote" style="margin-top:11px">Выбранное направление раскрывается без перезагрузки слайда. Организационная модель является проектной; новые ставки и полномочия требуют утверждения.</div>`;
 return head(3,'Executive-структура <span style="color:#389f91">по уровням.</span>','Нажмите на руководителя, затем на подразделение. Функции и задачи появятся справа.')+shell(chart,'exec',current.orgSelection||'ceo');
}
let branchSerial=0;
async function orgClick(id){
 const n=nodeById[id];if(!n)return;
 current.orgSelection=id;
 const stage=$('#orgstage');const branch=$('#orgbranch');
 if(!stage||!branch){render();return;}
 let focus=id;
 if(id==='ceo')focus=null;
 else if(n.children.length)focus=id;
 else if(n.super==='ceo')focus=id;
 else focus=current.orgParent;
 current.orgParent=focus;
 document.querySelectorAll('.orgexec').forEach(el=>el.classList.toggle('active',el.dataset.org===focus||focus&&orgAncestors(focus).some(x=>x.id===el.dataset.org)));
 document.querySelectorAll('.org-ceo').forEach(el=>el.classList.toggle('active',id==='ceo'));
 document.querySelectorAll('.orgchild').forEach(el=>el.classList.toggle('active',el.dataset.org===id));
 stage.classList.toggle('has-focus',!!focus);
 const serial=++branchSerial;
 const oldHeight=branch.getBoundingClientRect().height;
 if(branch.animate&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  try{await branch.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:.15,transform:'translateY(8px) scale(.965)'}],{duration:145,easing:'ease-in',fill:'forwards'}).finished}catch{}
 }
 if(serial!==branchSerial)return;
 branch.getAnimations().forEach(a=>a.cancel());
 branch.innerHTML=orgdetail();
 const newHeight=branch.scrollHeight;
 if(branch.animate&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  branch.animate([{height:`${oldHeight}px`},{height:`${newHeight}px`}],{duration:475,easing:'cubic-bezier(.2,.8,.18,1)'});
  branch.animate([{opacity:.18,transform:'translateY(17px) scale(.94)',filter:'blur(3px)'},{opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0)'}],{duration:620,easing:'cubic-bezier(.16,1,.3,1)'});
 }
 await setDetail('exec',id,{expand:false});
}

function dealflow(){
 const cards=D.dealflows.map((f,j)=>`<button class="process-selector" data-explore-flow="${esc(f.id)}"><div class="process-cover-num">0${j+1}</div><div class="process-tag">${j===0?'PETROCHINA · КВОТЫ · Ж/Д':'KAZAKHSTAN · ОПТОВАЯ ТОРГОВЛЯ'}</div><h2>${esc(f.name)}</h2><p>${esc(f.lead)}</p><div class="process-selector-foot"><span>${f.steps.length} этапов</span><strong>Открыть интерактивную схему ↗</strong></div></button>`).join('');
 const hints=`<div class="process-feature-grid"><div><span>01 / ЛОГИКА</span><strong>Фактическая последовательность</strong><small>Без придуманной универсальной схемы</small></div><div><span>02 / СВЯЗИ</span><strong>Точки контакта с предприятиями</strong><small>JetWay, PetroChina, базы и оператор НПЗ</small></div><div><span>03 / РИСКИ</span><strong>Простой · тарифы · FX · маржа</strong><small>Кейсы на соответствующих этапах</small></div></div>`;
 return head(4,'Бизнес-процессы <span style="color:#389f91">как они есть.</span>','Выберите маршрут. В модальном экране слева — этапы, справа — схема взаимодействий и связанные кейсы.')+
 `<div class="process-selector-grid">${cards}</div>${hints}<div class="business-note">Заправку в крыло не показываем как утверждённый пошаговый процесс до согласования фактической технологии и полномочий.</div>`;
}
function cases(){let sorted=D.cases;let cards=`<div class="case-grid cases-full-grid">${sorted.map(c=>`<button class="clickcard casecard ${current.selected.case===c.id?'active':''}" data-item="case:${c.id}"><div class="meta">${esc(c.group)} <span class="corner">↗</span></div><span class="case-metric">${esc(c.metric)}</span><b>${esc(c.title)}</b><small>${esc(c.subtitle)}</small></button>`).join('')}</div>`;
 return head(5,'Проблемы становятся <span style="color:#389f91">решениями.</span>','Нажмите на карточку: кейс сразу откроется в полноэкранном разборе.')+cards;}
function partners(){let cards=`<div class="partner-grid">${D.companies.map(c=>`<button class="clickcard partner ${current.selected.company===c.id?'active':''}" data-item="company:${c.id}"><span class="badge">${esc(c.short)}</span><span><div class="meta">STERLING GROUP ↗</div><b>${esc(c.title)}</b><small>${esc(c.subtitle)}</small></span></button>`).join('')}</div><div class="nudge">Линия взаимодействия ≠ административная подчинённость. Ответственность другого ТОО определяется договором и регламентом.</div>`;
 return head(7,'Одна группа. <span style="color:#389f91">Пять точек контакта.</span>','Навигация по предприятиям и по тому, что они должны получать и передавать друг другу.')+shell(cards,'company',current.selected.company||'dostyq');}
function changes(){let cards=`<div class="cards-2">${D.improvements.map(c=>`<button class="clickcard ${current.selected.change===c.id?'active':''}" data-item="change:${c.id}" style="min-height:145px"><div class="meta">${esc(c.label)} <span class="corner">↗</span></div><b>${esc(c.name)}</b><small>${esc(c.why)}</small></button>`).join('')}</div>`;
 return head(7,'От замечания <span style="color:#389f91">к управленческому действию.</span>','Шесть инициатив для обсуждения: проблема, предложение, владелец и необходимое решение.')+shell(cards,'change',current.selected.change||'clm');}
function growth(){let cards=`<div class="growth-grid">${D.growth.map(c=>`<button class="clickcard growth ${current.selected.growth===c.id?'active':''}" data-item="growth:${c.id}"><div class="meta">${esc(c.tag)} <span class="corner">↗</span></div><b>${esc(c.name)}</b><small>${esc(c.goal)}</small><div class="smallnote" style="margin-top:13px">${esc(c.state)}</div></button>`).join('')}</div><div class="business-note">Инициативы из презентационных материалов Navarro, не утверждённые бизнес-планы. CAPEX, разрешения, спрос и финансирование требуют проверки.</div>`;
 return head(7,'Новые рынки. <span style="color:#389f91">Новая инфраструктура.</span>','Инициативы развития авиационного топливообеспечения и международной торговой модели.')+shell(cards,'growth',current.selected.growth||'almaty');}
function decision(){let approved=D.decisions.filter(d=>current.decisions[d.id]==='agreed').length;let items=`<div class="exportbar"><span class="status-chip">${approved} из ${D.decisions.length} отмечено как согласованные</span><button class="primary" id="export-decisions">Экспортировать рабочий протокол ↓</button></div><div class="cards-2">${D.decisions.map(d=>`<div class="clickcard ${current.selected.decision===d.id?'active':''}" data-item="decision:${d.id}"><div class="meta">РЕШЕНИЕ / ${esc(d.id.toUpperCase())}</div><div class="decision-row"><strong>${esc(d.title)}</strong><span class="corner">↗</span></div><small>${esc(d.owner)}</small><div class="decision-controls">${[['pending','К обсуждению'],['agreed','Согласовано'],['review','Доработать'],['hold','Отложить']].map(([v,l])=>`<button data-decision="${d.id}" data-status="${v}" class="${(current.decisions[d.id]||'pending')===v?'selected':''}">${l}</button>`).join('')}</div></div>`).join('')}</div><div class="nudge">Изменения сохраняются только в браузере. Нажатие «Согласовано» не заменяет официальный протокол и утверждение руководства.</div>`;
 return head(9,'Решения, <span style="color:#389f91">которые останутся после сессии.</span>','Отмечайте статус вопросов прямо во время обсуждения и экспортируйте рабочий реестр.')+shell(items,'decision',current.selected.decision||'d1');}
let slideSerial=0;
function render(){
 hideZoom({instant:true});
 let s=slides[current.slide];$('#chapter').textContent=s.name;
 document.documentElement.style.setProperty('--slide-progress',current.slide+1);
 $('#count').textContent=`${String(current.slide+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
 $('#sidenav').innerHTML=slides.map((x,k)=>`<button class="navlink ${k===current.slide?'active':''}" data-goto="${x.id}" title="${esc(x.name)}"><span class="navno">${x.short}</span><span>${esc(x.name)}</span></button>`).join('');
 let body=({opening:cover,directions,orgmap,organization:org,cases,partners,changes,growth,decisions:decision})[s.id]();
 $('#page').innerHTML=`<div class="page-inner slide-enter">${body}</div>`;
 requestAnimationFrame(()=>adaptInlineInspector());
 $('#page').scrollTop=0;$('#side').classList.remove('open');
}
async function navigate(id){
 let k=slides.findIndex(x=>x.id===id);if(k<0||k===current.slide)return;
 hideZoom({instant:true});
 const serial=++slideSerial;
 const page=$('#page'),old=page.querySelector('.page-inner');
 if(old?.animate&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  try{await old.animate([{opacity:1,transform:'translateY(0)',filter:'blur(0)'},{opacity:0,transform:'translateY(-18px)',filter:'blur(5px)'}],{duration:180,easing:'ease-in',fill:'forwards'}).finished}catch{}
 }
 if(serial!==slideSerial)return;
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


// Interactive process explorer: stage rail at left, true operational relationships at right.
let processState={flow:null,index:0},processFocus=null;
function ensureProcessExplorer(){
 let node=$('#process-explorer');if(node)return node;
 document.body.insertAdjacentHTML('beforeend',`<div id="process-explorer" class="process-explorer" role="dialog" aria-modal="true" aria-label="Карта бизнес-процесса" hidden><div class="process-backdrop" data-process-close></div><div class="process-window"><div class="process-modal-top"><div><span>НАПРАВЛЕНИЕ / БИЗНЕС-ПРОЦЕСС · NAVARRO TRADE</span><h2 id="process-modal-title"></h2></div><button type="button" class="process-close" data-process-close>✕ Закрыть</button></div><div class="process-modal-tabs" id="process-modal-tabs"></div><div class="process-modal-layout"><nav class="process-step-list" id="process-steps" aria-label="Этапы процесса"></nav><div class="process-stage-view" id="process-view" aria-live="polite"></div></div><div class="process-modal-footer"><span>AS-IS по материалам Navarro · риски и TO-BE обозначены отдельно</span><span>Esc — закрыть · Клик по этапу — сменить схему</span></div></div></div>`);
 return $('#process-explorer');
}
function openProcessExplorer(flow,index=0){
 const modal=ensureProcessExplorer();const f=D.dealflows.find(x=>x.id===flow);if(!f)return;
 processState={flow,index:Math.max(0,Math.min(index,f.steps.length-1))};
 modal.hidden=false;document.body.classList.add('process-open');
 modal.querySelector('#process-modal-title').textContent=f.name;
 modal.querySelector('#process-modal-tabs').innerHTML=D.dealflows.map(x=>`<button data-process-flow="${esc(x.id)}" class="${x.id===flow?'active':''}">${esc(x.name)}</button>`).join('');
 const list=modal.querySelector('#process-steps');
 list.innerHTML=f.steps.map((st,i)=>`<button type="button" class="process-step ${i===processState.index?'active':''}" data-process-step="${i}"><span>${String(i+1).padStart(2,'0')}</span><b>${esc(st[0])}</b><small>${esc(st[2])}</small></button>`).join('');
 processSelectStage(processState.index,true);
}
function closeProcessExplorer(){const modal=$('#process-explorer');if(modal&&!modal.hidden){modal.classList.add('closing');setTimeout(()=>{modal.hidden=true;modal.classList.remove('closing')},260)}document.body.classList.remove('process-open')}
function processSelectStage(index,instant=false){
 const f=D.dealflows.find(x=>x.id===processState.flow),steps=D.processScenes[processState.flow];if(!f||!steps[index])return;
 processState.index=index;
 let s=steps[index],prev=steps[index-1],next=steps[index+1],view=$('#process-view');if(!view)return;
 document.querySelectorAll('.process-step').forEach((el,i)=>el.classList.toggle('active',i===index));
 const active=$(`.process-step[data-process-step="${index}"]`);active?.scrollIntoView({block:'nearest',behavior:'smooth'});
 const toc=(s.partners||[]).slice(0,4).map((name,k)=>`<div class="process-partner" style="--n:${k}"><span>↔</span><b>${esc(name)}</b></div>`).join('')||'<div class="process-partner"><span>↔</span><b>Внутри Navarro Trade</b></div>';
 const rec=(s.cases||[]).map(id=>D.cases.find(c=>c.id===id)).filter(Boolean).map(c=>`<div class="process-related-case"><span>${esc(c.group)}</span><strong>${esc(c.title)}</strong><p>${esc(c.issue)}</p><div><b>Предложение:</b> ${esc(c.resolution)}</div></div>`).join('');
 view.innerHTML=`<div class="process-view-kicker">ЭТАП ${String(index+1).padStart(2,'0')} / ${String(steps.length).padStart(2,'0')} ${s.mark?`<span>${esc(s.mark)}</span>`:''}</div><h2>${esc(s.title)}</h2>
 <div class="process-scheme"><div class="process-neighbor ${prev?'':'muted'}"><small>ПРЕДЫДУЩИЙ</small><b>${esc(prev?.title||'Начало процесса')}</b></div><div class="process-arrow">→</div><div class="process-core"><small>ТЕКУЩАЯ ОПЕРАЦИЯ</small><strong>${esc(s.title)}</strong><p>${esc(s.owner)}</p></div><div class="process-arrow">→</div><div class="process-neighbor ${next?'':'muted'}"><small>СЛЕДУЮЩИЙ</small><b>${esc(next?.title||'Завершение процесса')}</b></div></div>
 <div class="process-touch-title">ТОЧКИ СОПРИКОСНОВЕНИЯ <span>ЛИНИИ ВЗАИМОДЕЙСТВИЯ · НЕ ПОДЧИНЕНИЕ</span></div><div class="process-touchpoints"><div class="process-source">NAVARRO<br>TRADE</div><div class="process-touch-line"></div><div class="process-partners">${toc}</div></div>
 <div class="process-explain"><div class="process-fact"><small>ЧТО ПРОИСХОДИТ</small><p>${esc(s.action)}</p>${s.doc?`<small>ДОКУМЕНТ / ПОДТВЕРЖДЕНИЕ</small><p>${esc(s.doc)}</p>`:''}</div><div class="process-risk"><small>РИСКИ И ВЛИЯНИЕ НА МАРЖУ</small>${s.risks.length?`<ul>${s.risks.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>`:'<p>Дополнительный специфический риск не обозначен.</p>'}${s.solution?`<small>ПРЕДЛАГАЕМОЕ РЕШЕНИЕ</small><p>${esc(s.solution)}</p>`:''}</div></div>
 ${rec?`<div class="process-related"><div class="process-related-heading">СВЯЗАННЫЕ ПРАКТИЧЕСКИЕ КЕЙСЫ</div>${rec}</div>`:''}
 ${s.note?`<div class="process-note">${esc(s.note)}</div>`:''}
 <div class="process-view-controls"><button data-process-move="-1" ${index===0?'disabled':''}>← Предыдущий этап</button><span>${index+1} из ${steps.length}</span><button data-process-move="1" ${index===steps.length-1?'disabled':''}>Следующий этап →</button></div>`;
 view.classList.remove('process-animate');void view.offsetWidth;view.classList.add('process-animate');view.scrollTop=0;
}

function notify(message){let t=$('#toast');t.textContent=message;t.style.display='block';clearTimeout(notify.timer);notify.timer=setTimeout(()=>t.style.display='none',2300);}
function exportDecisions(){let ts=new Date().toLocaleString('ru-RU');const st={pending:'К обсуждению',agreed:'Отмечено согласованным',review:'На доработку',hold:'Отложено'};let text=`# Sterling Group · Рабочий реестр решений\n\nДата экспорта: ${ts}\n\n> Не является утверждённым протоколом. Требует проверки участниками, подписи и назначения сроков.\n\n`+D.decisions.map((d,i)=>`## ${i+1}. ${d.title}\n\n**Статус:** ${st[current.decisions[d.id]||'pending']}\n\n**Предлагаемый ответственный:** ${d.owner}\n\n**Вопрос:** ${d.prompt}\n\n**Срок / подтверждение:** __________\n`).join('\n');let blob=new Blob([text],{type:'text/markdown;charset=utf-8'});let url=URL.createObjectURL(blob);let a=document.createElement('a');a.href=url;a.download='Sterling_Working_Decisions.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),2500);notify('Рабочий реестр скачан');}
document.addEventListener('click',e=>{const direction=e.target.closest('[data-open-direction]');if(direction){const id=direction.dataset.openDirection;if(id==='transit'||id==='domestic'){openProcessExplorer(id,0)}else{current.selected.direction='aviation';detailState={type:'direction',id:'aviation'};zoomToDetail('direction','aviation')}return;}if(e.target.closest('[data-process-close]')){closeProcessExplorer();return;}let ex=e.target.closest('[data-explore-flow]');if(ex){openProcessExplorer(ex.dataset.exploreFlow,+ex.dataset.processIndex||0);return;}let ps=e.target.closest('[data-process-step]');if(ps){processSelectStage(+ps.dataset.processStep);return;}let pf=e.target.closest('[data-process-flow]');if(pf){openProcessExplorer(pf.dataset.processFlow);return;}let pm=e.target.closest('[data-process-move]');if(pm){processSelectStage(processState.index + +pm.dataset.processMove);return;}if(e.target.closest('[data-detail-close]')){hideZoom();return;}if(e.target.closest('[data-expand-current]')){zoomToDetail(detailState.type,detailState.id);return;}let linked=e.target.closest('[data-open-case]');if(linked){current.selected.case=linked.dataset.openCase;const dest=linked.dataset.openCase;Promise.resolve(navigate('cases')).then(()=>setDetail('case',dest));return;}let el=e.target.closest('[data-goto]');if(el){navigate(el.dataset.goto);return;}let org=e.target.closest('[data-org]');if(org){orgClick(org.dataset.org);return;}if(e.target.closest('[data-orgback]')){let n=nodeById[current.orgParent];let parent=n?.super||'ceo';orgClick(parent);return;}let flow=e.target.closest('[data-flow]');if(flow){switchFlow(flow.dataset.flow);return;}let button=e.target.closest('[data-decision]');if(button){current.decisions[button.dataset.decision]=button.dataset.status;try{localStorage.setItem('navarro-session-decisions',JSON.stringify(current.decisions))}catch{}current.selected.decision=button.dataset.decision;document.querySelectorAll(`[data-decision="${button.dataset.decision}"]`).forEach(x=>x.classList.toggle('selected',x.dataset.status===button.dataset.status));let cnt=$('.status-chip');if(cnt)cnt.textContent=`${D.decisions.filter(d=>current.decisions[d.id]==='agreed').length} из ${D.decisions.length} отмечено как согласованные`;setDetail('decision',button.dataset.decision);return;}let item=e.target.closest('[data-item]');if(item){let [t,id]=item.dataset.item.split(':');setDetail(t,id);return;}if(e.target.closest('#export-decisions')){exportDecisions();return;}if(e.target.closest('#mobile-nav')){$('#side').classList.toggle('open');return;}});
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
document.addEventListener('fullscreenchange',()=>{setPresentationMode(!!document.fullscreenElement);requestAnimationFrame(adaptDetailColumns)});
window.addEventListener('resize',()=>requestAnimationFrame(adaptDetailColumns));
const goNext=()=>navigate(slides[Math.min(slides.length-1,current.slide+1)].id);
const goPrev=()=>navigate(slides[Math.max(0,current.slide-1)].id);
document.addEventListener('keydown',e=>{
 if(isEditable(e.target)||e.ctrlKey||e.altKey||e.metaKey)return;
 if(e.key==='f'||e.key==='F'||e.key==='F11'){if(e.key==='F11'&&!document.fullscreenEnabled)return;e.preventDefault();toggleFullscreen();return;}
 if(e.key==='Escape'){if($('#process-explorer')&&!$('#process-explorer').hidden){e.preventDefault();closeProcessExplorer();return;}if(!$('#detail-zoom').hidden){e.preventDefault();hideZoom();return;}if(!document.fullscreenElement)setPresentationMode(false);$('#side').classList.remove('open');return;}
 if($('#process-explorer')&&!$('#process-explorer').hidden){if(e.key==='ArrowDown'||e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '||e.code==='Space'){e.preventDefault();processSelectStage(Math.min(processState.index+1,D.processScenes[processState.flow].length-1));return;}if(e.key==='ArrowUp'||e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();processSelectStage(Math.max(processState.index-1,0));return;}return;}
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
let init=location.hash.replace(/^#\/?/,'');current.slide=Math.max(0,slides.findIndex(s=>s.id===init));render();
})();
