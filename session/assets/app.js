/* Sterling 2026 — interactive internal executive presentation. No trackers, APIs or dependencies. */
(()=>{'use strict';
const D=window.SESSION_DATA;if(!D){document.body.textContent='Материалы презентации не загрузились.';return;}
const $=s=>document.querySelector(s), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nodeById=Object.fromEntries(D.executives.map(e=>[e.id,e]));
const itemById=(t,id)=>({direction:D.directions,exec:D.executives,case:D.cases,company:D.companies,change:D.improvements,growth:D.growth,decision:D.decisions})[t]?.find(x=>x.id===id);
const current={slide:0,selected:{},orgParent:null,orgSelection:'ceo',flow:'wholesale',decisions:(()=>{try{return JSON.parse(localStorage.getItem('navarro-session-decisions')||'{}')}catch{return {}}})()};
const slides=D.navigation;
const bullet=list=>`<ul>${list.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
const block=(name,html)=>{const label=name.toLowerCase();const tone=/решени|ответствен|владел|контрол|что нужно/.test(label)?'action':/проблем|риск|последств|произошло|узкое/.test(label)?'risk':/документ|подтвержден/.test(label)?'evidence':'context';return `<div class="section section-${tone}"><h4>${esc(name)}</h4>${html}</div>`};
const p=s=>`<p>${esc(s)}</p>`;
const pill=s=>`<span class="pill">${esc(s)}</span>`;
const extra=D.details||{};
const plain=(s)=>`<p>${esc(s)}</p>`;
function caseReferences(ids){if(!ids||!ids.length)return '';
 let cases=ids.map(id=>D.cases.find(c=>c.id===id)).filter(Boolean);
 return cases.length?block('Связанные кейсы и проблемы',`<div class="case-references">${cases.map(c=>`<button class="case-reference" data-open-case="${esc(c.id)}"><span class="ref-number">${esc(c.metric)}</span><span><b>${esc(c.title)}</b><small>${esc(c.issue)}</small></span><span aria-hidden="true">↗</span></button>`).join('')}</div>`):'';
}
function factsFlag(label){return `<span class="data-flag">${esc(label)}</span>`}
function inspector(type,id){let i=itemById(type,id);if(!i&&type!=='flow')return `<div class="inspector-header"><span class="inspector-tag">INSIGHT PANEL</span><span class="inspector-index">N.</span></div><h2>Выберите карточку</h2><p class="sub">Кликните на этап, отдел, компанию или кейс. Здесь появятся описание процесса, проблема и предлагаемое решение, если они есть в материалах.</p><div class="empty-hint">НАВИГАЦИЯ<br>← → / Space / PageDown · следующий экран<br>F · полный экран · Esc · выход</div>`;
 let tag='',title='',sub='',inner='',e;
 if(type==='direction'){
  e=extra.directions?.[id];tag=i.tag;title=i.name;sub=i.intro;
  inner=pill(i.status)+block('Как работает направление',plain(e?.process||i.scope))+
    block('Ответственный контур',plain(i.owner))+
    (e?.documents?.length?block('Документы / подтверждения',bullet(e.documents)):'')+
    caseReferences(e?.cases||[i.caseId])+
    block('Предлагаемые решения',plain(e?.solution||i.actions.join('; ')));
 }else if(type==='exec'){
  tag=i.en;title=i.name;sub=i.lead;inner=pill(i.abbr)+
    (i.super?block('Административное подчинение',plain(nodeById[i.super].name)):'')+
    block('Функции и зона ответственности',bullet(i.duties))+
    (i.children.length?block('Подразделения',bullet(i.children.map(cid=>nodeById[cid].name))):'')+
    ((id==='coo'||id==='pcqa')?caseReferences(['measure','base']):'')+
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
    `<p class="source-caption">ИСТОЧНИК: ${esc(i.source)}. Факты и выводы требуют проверки обеими сторонами.</p>`;
 }else if(type==='company'){
  e=extra.partners?.[id];tag='STERLING / OPERATING LINKS';title=i.title;sub=i.subtitle;
  inner=block('Описание процесса',plain(e?.process||i.focus))+
    block('Получает от Navarro',plain(i.from))+
    block('Передаёт Navarro',plain(i.to))+
    block('Проблема / узкое место',plain(i.risk))+
    caseReferences(e?.cases||[i.caseId])+
    block('Предлагаемое решение',plain(e?.solution||'Уточнить владельца процесса и сроки обмена данными.'));
 }else if(type==='change'){
  tag=i.label;title=i.name;sub=i.why;inner=pill('Инициатива — не утверждена')+
    block('Какой процесс меняем',plain(i.why))+
    caseReferences(i.caseId?[i.caseId]:[])+
    block('Предлагаемое решение',plain(i.how))+
    block('Владелец',plain(i.owner))+
    block('Что нужно решить руководству',plain(i.decision));
 }else if(type==='growth'){
  tag=i.tag;title=i.name;sub=i.goal;inner=pill(i.state)+
    block('Описание инициативы',plain(i.goal))+
    block('Что необходимо сделать',plain(i.next))+
    block('Условия запуска',plain('Подтверждение спроса и экономической модели, доступа к инфраструктуре, правовых требований и источников финансирования.'))+
    `<p class="source-caption">Проект развития из материалов Navarro, не действующее подтверждённое направление.</p>`;
 }else if(type==='decision'){
  tag='EXECUTIVE DECISION';title=i.title;sub=i.prompt;
  const status=current.decisions[i.id]||'pending';const names={pending:'К обсуждению',agreed:'Отмечено как согласованное',review:'На доработку',hold:'Отложено'};
  inner=pill(names[status])+block('Предмет решения',plain(i.prompt))+
    block('Предлагаемый ответственный',plain(i.owner))+
    block('Результат обсуждения',plain('Назначить исполнителя, согласовать регламент / полномочия, указать срок и способ проверки результата.'))+
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
// v4.3: a compact on-slide preview, plus an accessible executive insight dialog.
function preview(type,id){
 const i=itemById(type,id);let title='',sub='',tag='INSIGHT PANEL';
 if(type==='flow'){
  const f=D.dealflows.find(x=>x.id===current.flow);const st=f?.steps[+id];
  title=st?.[0]||'Этап сделки';sub=st?.[1]||'';tag='МАРШРУТ СДЕЛКИ';
 } else if(i){title=i.name||i.title||'Подробности';sub=i.subtitle||i.intro||i.lead||i.scope||i.goal||i.why||i.prompt||'';tag=type==='case'?'КЕЙС / ВЫВОДЫ':'INSIGHT PANEL';}
 return `<div class="inspector-header"><span class="inspector-tag">${esc(tag)}</span><span class="inspector-index">N.</span></div>
 <h2>${esc(title)}</h2><p class="sub">${esc(sub)}</p>
 <button class="detail-cta" type="button" data-expand-current>Развернуть разбор <span>↗</span></button>
 <p class="detail-hint">Выберите карточку слева, затем нажмите «Развернуть разбор», чтобы открыть материал крупно.</p>`;
}
let detailState={type:null,id:null},detailSerial=0,detailLastFocus=null;
const modalDetailTypes=new Set(['direction','flow','case']);
const expandableInlineTypes=new Set(['company','change','growth','decision']);
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function finishZoomClose(layer,{restoreFocus=true}={}){
 layer.hidden=true;layer.setAttribute('aria-hidden','true');document.body.classList.remove('has-detail-zoom');
 const shell=$('.shell');if(shell)shell.inert=false;
 let restoreTarget=detailLastFocus;
 if(!restoreTarget?.isConnected||restoreTarget.closest?.('#detail-zoom')||restoreTarget.offsetParent===null){
  const key=`${detailState.type}:${detailState.id}`;
  restoreTarget=[...document.querySelectorAll('[data-item]')].find(el=>el.dataset.item===key);
 }
 if(restoreFocus&&restoreTarget?.isConnected)restoreTarget.focus({preventScroll:true});
 detailLastFocus=null;
}
function hideZoom({instant=false}={}){
 const layer=$('#detail-zoom');if(!layer||layer.hidden)return;
 const serial=++detailSerial;
 if(instant||reduced()){finishZoomClose(layer,{restoreFocus:!instant});return;}
 const win=layer.querySelector('.detail-window');
 const a=win.animate([{opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0)'},{opacity:0,transform:'translateY(18px) scale(.97)',filter:'blur(3px)'}],{duration:240,easing:'ease-in',fill:'forwards'});
 Promise.resolve(a.finished).catch(()=>{}).then(()=>{if(detailSerial!==serial)return;a.cancel();finishZoomClose(layer)});
}
function adaptDetailColumns(){
 const layer=$('#detail-zoom'),win=layer?.querySelector('.detail-window'),grid=layer?.querySelector('.detail-columns');
 if(!win||!grid||layer.hidden)return;
 const source=layer.querySelector('.detail-source');
 const width=layer.querySelector('.detail-content')?.clientWidth||win.clientWidth;
 const columns=width>=1060?3:width>=930&&layer.dataset.focusType!=='direction'?3:width>=720?2:1;
 let lanes=[...grid.children];
 if(layer.dataset.columns!==String(columns)||lanes.length!==columns){
  const nodes=[...source.children].map(n=>n.cloneNode(true));
  // Preserve top-to-bottom reading order, balance content by approximate visual weight.
  lanes=Array.from({length:columns},()=>document.createElement('div'));
  lanes.forEach(n=>n.className='detail-lane');
  const weights=nodes.map(n=>{let t=n.textContent||'';return t.length+115+(n.querySelectorAll('li,.case-reference').length*60)});
  const total=weights.reduce((x,y)=>x+y,0),target=total/columns;
  let lane=0,load=0;
  nodes.forEach((node,i)=>{
   if(lane<columns-1&&load>target*.62&&(load+weights[i]*.55)>target){lane++;load=0;}
   lanes[lane].appendChild(node);load+=weights[i];
  });
  grid.replaceChildren(...lanes);layer.dataset.columns=String(columns);
 }
 layer.dataset.density='0';layer.classList.remove('detail-unavoidable-scroll');
 const content=layer.querySelector('.detail-content');
 const contentEnd=()=>content.getBoundingClientRect().bottom-parseFloat(getComputedStyle(content).paddingBottom);
 const spilling=()=>lanes.some(l=>[...l.children].some(c=>c.getBoundingClientRect().bottom>contentEnd()+2));
 for(let i=0;i<1;i++){
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
 delete layer.dataset.columns;
 layer.querySelector('#detail-topic').textContent=header?.querySelector('.inspector-tag')?.textContent||'ПОДРОБНОСТИ';
 layer.querySelector('#detail-title').textContent=title?.textContent||'';
 layer.querySelector('#detail-subtitle').textContent=sub?.textContent||'';
 const metric=layer.querySelector('#detail-metric'),item=itemById(type,id);
 metric.textContent=type==='case'&&item?.metric?item.metric:'';metric.hidden=!metric.textContent;
 const contextLabels={case:'КЕЙС',flow:'ЭТАП',exec:'СТРУКТУРА',direction:'НАПРАВЛЕНИЕ',company:'КОНТУР',change:'ИНИЦИАТИВА',growth:'РОСТ',decision:'РЕШЕНИЕ'};
 layer.querySelector('#detail-context-mark').textContent=contextLabels[type]||'INSIGHT';
 ++detailSerial;
 layer.dataset.focusType=type;
 if(layer.hidden)detailLastFocus=document.activeElement;
 layer.hidden=false;layer.setAttribute('aria-hidden','false');document.body.classList.add('has-detail-zoom');
 const shell=$('.shell');if(shell)shell.inert=true;
 win.getAnimations().forEach(a=>a.cancel());
 // Wait for fixed positioning to be measured, then animate from the former right panel.
 adaptDetailColumns();
 const content=layer.querySelector('.detail-content');if(content)content.scrollTop=0;
 const canMorph=start&&window.innerWidth>620&&start.bottom>0&&start.top<window.innerHeight&&start.right>0&&start.left<window.innerWidth;
 if(canMorph&&!reduced()&&win.animate){
  const end=win.getBoundingClientRect(),sx=Math.min(1.0,Math.max(.22,start.width/end.width)),sy=Math.min(1.0,Math.max(.22,start.height/end.height));
  const tx=(start.left+start.width/2)-(end.left+end.width/2),ty=(start.top+start.height/2)-(end.top+end.height/2);
  win.animate([{opacity:.64,transform:`translate(${tx}px,${ty}px) scale(${sx},${sy})`,filter:'blur(5px)'},{opacity:1,transform:'translate(0,0) scale(1)',filter:'blur(0)'}],{duration:600,easing:'cubic-bezier(.16,1,.3,1)'});
 }else if(!reduced()&&win.animate){
  win.animate([{opacity:0,transform:'translateY(12px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:300,easing:'cubic-bezier(.16,1,.3,1)'});
 }
 requestAnimationFrame(()=>layer.querySelector('.detail-close')?.focus({preventScroll:true}));
}
function setDetail(type,id,{expand=false}={}){
 current.selected[type]=id;detailState={type,id};
 document.querySelectorAll('[data-item]').forEach(el=>el.classList.toggle('active',el.dataset.item===`${type}:${id}`));
 if(!modalDetailTypes.has(type)){setInlineDetail(type,id);return;}
 const box=$('#inspector');if(box){box.innerHTML=preview(type,id);box.setAttribute('aria-live','polite')}
 if(expand)zoomToDetail(type,id);
}
function setInlineDetail(type,id){
 current.selected[type]=id;detailState={type,id};
 const box=$('#inspector');if(!box)return;
 const grid=box.closest('.slide-grid'),expand=expandableInlineTypes.has(type);
 const wasFocused=grid?.classList.contains('inline-focus');
 box.getAnimations().forEach(a=>a.cancel());
 box.dataset.inlineType=type;box.innerHTML=inspector(type,id);box.setAttribute('aria-live','polite');
 grid?.classList.toggle('inline-focus',expand);
 requestAnimationFrame(()=>{
  adaptInlineInspector(box);
  if(!expand||reduced()||!box.animate)return;
  box.animate([{opacity:.5,transform:`translateX(${wasFocused?28:76}px) scale(${wasFocused ? 0.97 : 0.9})`,filter:'blur(4px)'},{opacity:1,transform:'translateX(0) scale(1)',filter:'blur(0)'}],{duration:wasFocused?720:1050,easing:'cubic-bezier(.16,1,.3,1)'});
  [...box.querySelectorAll('.inspector-body>.section,.inspector-body>.pill,.inspector-body>.data-flag,.inspector-body>.source-caption')].forEach((block,index)=>block.animate([{opacity:0,transform:'translateY(24px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:720,delay:(wasFocused?70:230)+index*75,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}));
 });
 setTimeout(()=>adaptInlineInspector(box),1100);
}

function adaptInlineInspector(box=$('#inspector')){
 if(!box?.classList.contains('inspector-inline')||!expandableInlineTypes.has(box.dataset.inlineType)||window.innerWidth<=970)return;
 box.dataset.inlineDensity='0';
 const footerTop=$('.footbar')?.getBoundingClientRect().top||window.innerHeight;
 const available=Math.max(360,Math.floor(footerTop-box.getBoundingClientRect().top-10));
 box.style.setProperty('--inline-height',`${available}px`);
 for(let density=1;density<=2&&box.scrollHeight>box.clientHeight+2;density++)box.dataset.inlineDensity=String(density);
}

function head(i,title,desc){return `<div class="slide-heading"><div><div class="eyebrow">NAVARRO TRADE · ${esc(slides[i].short)} / 08</div><h1 class="headline">${title}</h1><p class="head-desc">${desc}</p></div><div class="slide-no">${esc(slides[i].short)}</div></div>`;}
function shell(content,type,id,{inline=!modalDetailTypes.has(type)}={}){detailState={type,id};return `<div class="slide-grid"><div class="left-area">${content}</div><aside class="inspector ${inline?'inspector-inline':'inspector-preview'}" id="inspector" ${inline?`data-inline-type="${type}"`:''}>${inline?inspector(type,id):preview(type,id)}</aside></div>`;}
function cover(){return `<div class="cover"><img class="cover-logo" src="assets/navarro-logo.png" alt="NAVARRO TRADE"><div class="covercopy"><div class="eyebrow">STERLING GROUP / STRATEGIC & OPERATIONAL SESSION 2026</div><h1>От отдельных компаний<br>к <em>общей системе</em><br>ответственности.</h1><p>Бизнес-модель Navarro Trade. Реальные кейсы. Исполнение сделок. Взаимодействие предприятий. Решения руководства.</p><div class="cover-actions"><button class="primary" data-goto="directions">Начать презентацию ↗</button><button class="secondary" data-goto="organization">Executive-структура →</button></div></div><div class="coverstamp">NAVARRO TRADE<br>WORKING EXECUTIVE MODEL<br>21 OCTOBER 2026</div></div><div class="quickstats"><div class="stat"><strong>03</strong><span>ключевых направления</span></div><div class="stat"><strong>08</strong><span>рабочих кейсов</span></div><div class="stat"><strong>06</strong><span>партнёрских контуров</span></div><div class="stat"><strong>06</strong><span>вопросов для решений</span></div></div><div class="business-note">Рабочая презентация по материалам подразделений. Факты и суммы требуют подтверждения; предложения не являются утверждёнными решениями Sterling.</div>`;}
function directions(){let cards=`<div class="tile-grid">${D.directions.map(d=>`<button class="tile ${current.selected.direction===d.id?'active':''}" data-item="direction:${d.id}"><span class="tag">${esc(d.tag)}</span><span class="big-number">${esc(d.num)}</span><h3>${esc(d.name)}</h3><span class="tile-desc">${esc(d.intro)}</span><span class="arrow">↗</span></button>`).join('')}</div><div class="business-note">Выберите направление — справа откроется модель работы, связанный кейс и необходимые изменения.</div>`;
 return head(1,'Три направления. <span style="color:#389f91">Одна коммерческая цепочка.</span>','Выберите направление: справа откроются процесс, документы, кейсы и решения из материалов.')+shell(cards,'direction',current.selected.direction||'wholesale');}
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
 return head(2,'Executive-структура <span style="color:#389f91">по уровням.</span>','Нажмите на руководителя, затем на подразделение. Функции и задачи появятся справа.')+shell(chart,'exec',current.orgSelection||'ceo',{inline:true});
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
 setInlineDetail('exec',id);
}

function dealflow(){let tabs=D.dealflows.map(f=>`<button class="switch-btn ${current.flow===f.id?'active':''}" data-flow="${f.id}">${esc(f.name)}</button>`).join('');let f=D.dealflows.find(x=>x.id===current.flow);let cards=`<div class="flow-switch">${tabs}</div><div class="flowcards" id="flowcards">${f.steps.map((s,k)=>`<button class="clickcard flowcard ${current.selected.flow===String(k)?'active':''}" data-no="${String(k+1).padStart(2,'0')}" data-item="flow:${k}"><div class="meta">ЭТАП ${String(k+1).padStart(2,'0')}</div><b>${esc(s[0])}</b><small>${esc(s[2])}</small></button>`).join('')}</div><div class="business-note">Оплата возможна до отгрузки или после неё — по договору. Физическая перевалка относится к полномочиям оператора базы.</div>`;
 return head(3,'Каждая сделка — <span style="color:#389f91">свой маршрут.</span>',esc(f.lead))+shell(cards,'flow',current.selected.flow||'0');}
function cases(){let sorted=D.cases;let cards=`<div class="case-grid">${sorted.map(c=>`<button class="clickcard casecard ${current.selected.case===c.id?'active':''}" data-item="case:${c.id}"><div class="meta">${esc(c.group)} <span class="corner">↗</span></div><span class="case-metric">${esc(c.metric)}</span><b>${esc(c.title)}</b><small>${esc(c.subtitle)}</small></button>`).join('')}</div>`;
 return head(4,'Проблемы становятся <span style="color:#389f91">решениями.</span>','Реальные ситуации из материалов Navarro: процесс, подтверждаемые факты, последствия и решения.')+shell(cards,'case',current.selected.case||'measure');}
function partners(){let cards=`<div class="partner-grid">${D.companies.map(c=>`<button class="clickcard partner ${current.selected.company===c.id?'active':''}" data-item="company:${c.id}"><span class="badge">${esc(c.short)}</span><span><div class="meta">STERLING GROUP ↗</div><b>${esc(c.title)}</b><small>${esc(c.subtitle)}</small></span></button>`).join('')}</div><div class="nudge">Линия взаимодействия ≠ административная подчинённость. Ответственность другого ТОО определяется договором и регламентом.</div>`;
 return head(5,'Одна группа. <span style="color:#389f91">Шесть точек контакта.</span>','Навигация по предприятиям и по тому, что они должны получать и передавать друг другу.')+shell(cards,'company',current.selected.company||'dostyq');}
function changes(){let cards=`<div class="cards-2">${D.improvements.map(c=>`<button class="clickcard ${current.selected.change===c.id?'active':''}" data-item="change:${c.id}" style="min-height:145px"><div class="meta">${esc(c.label)} <span class="corner">↗</span></div><b>${esc(c.name)}</b><small>${esc(c.why)}</small></button>`).join('')}</div>`;
 return head(6,'От замечания <span style="color:#389f91">к управленческому действию.</span>','Шесть инициатив для обсуждения: проблема, предложение, владелец и необходимое решение.')+shell(cards,'change',current.selected.change||'clm');}
function growth(){let cards=`<div class="growth-grid">${D.growth.map(c=>`<button class="clickcard growth ${current.selected.growth===c.id?'active':''}" data-item="growth:${c.id}"><div class="meta">${esc(c.tag)} <span class="corner">↗</span></div><b>${esc(c.name)}</b><small>${esc(c.goal)}</small><div class="smallnote" style="margin-top:13px">${esc(c.state)}</div></button>`).join('')}</div><div class="business-note">Инициативы из презентационных материалов Navarro, не утверждённые бизнес-планы. CAPEX, разрешения, спрос и финансирование требуют проверки.</div>`;
 return head(7,'Новые рынки. <span style="color:#389f91">Новая инфраструктура.</span>','Инициативы развития авиационного топливообеспечения и международной торговой модели.')+shell(cards,'growth',current.selected.growth||'almaty');}
function decision(){let approved=D.decisions.filter(d=>current.decisions[d.id]==='agreed').length;let items=`<div class="exportbar"><span class="status-chip">${approved} из ${D.decisions.length} отмечено как согласованные</span><button class="primary" id="export-decisions">Экспортировать рабочий протокол ↓</button></div><div class="cards-2">${D.decisions.map(d=>`<div class="clickcard ${current.selected.decision===d.id?'active':''}" data-item="decision:${d.id}"><div class="meta">РЕШЕНИЕ / ${esc(d.id.toUpperCase())}</div><div class="decision-row"><strong>${esc(d.title)}</strong><span class="corner">↗</span></div><small>${esc(d.owner)}</small><div class="decision-controls">${[['pending','К обсуждению'],['agreed','Согласовано'],['review','Доработать'],['hold','Отложить']].map(([v,l])=>`<button data-decision="${d.id}" data-status="${v}" class="${(current.decisions[d.id]||'pending')===v?'selected':''}">${l}</button>`).join('')}</div></div>`).join('')}</div><div class="nudge">Изменения сохраняются только в браузере. Нажатие «Согласовано» не заменяет официальный протокол и утверждение руководства.</div>`;
 return head(8,'Решения, <span style="color:#389f91">которые останутся после сессии.</span>','Отмечайте статус вопросов прямо во время обсуждения и экспортируйте рабочий реестр.')+shell(items,'decision',current.selected.decision||'d1');}
let slideSerial=0;
function render(){
 hideZoom({instant:true});
 let s=slides[current.slide];$('#chapter').textContent=s.name;
 document.documentElement.style.setProperty('--slide-progress',current.slide+1);
 $('#count').textContent=`${String(current.slide+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
 $('#sidenav').innerHTML=slides.map((x,k)=>`<button class="navlink ${k===current.slide?'active':''}" data-goto="${x.id}" title="${esc(x.name)}" ${k===current.slide?'aria-current="page"':''}><span class="navno">${x.short}</span><span>${esc(x.name)}</span></button>`).join('');
 let body=({opening:cover,directions,organization:org,dealflow,cases,partners,changes,growth,decisions:decision})[s.id]();
 $('#page').innerHTML=`<div class="page-inner slide-enter">${body}</div>`;
 $('#page').scrollTop=0;$('#side').classList.remove('open');$('#mobile-nav')?.setAttribute('aria-expanded','false');
 requestAnimationFrame(()=>adaptInlineInspector());
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

function notify(message){let t=$('#toast');t.textContent=message;t.style.display='block';clearTimeout(notify.timer);notify.timer=setTimeout(()=>t.style.display='none',2300);}
function exportDecisions(){let ts=new Date().toLocaleString('ru-RU');const st={pending:'К обсуждению',agreed:'Отмечено согласованным',review:'На доработку',hold:'Отложено'};let text=`# Sterling Group · Рабочий реестр решений\n\nДата экспорта: ${ts}\n\n> Не является утверждённым протоколом. Требует проверки участниками, подписи и назначения сроков.\n\n`+D.decisions.map((d,i)=>`## ${i+1}. ${d.title}\n\n**Статус:** ${st[current.decisions[d.id]||'pending']}\n\n**Предлагаемый ответственный:** ${d.owner}\n\n**Вопрос:** ${d.prompt}\n\n**Срок / подтверждение:** __________\n`).join('\n');let blob=new Blob([text],{type:'text/markdown;charset=utf-8'});let url=URL.createObjectURL(blob);let a=document.createElement('a');a.href=url;a.download='Sterling_Working_Decisions.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),2500);notify('Рабочий реестр скачан');}
document.addEventListener('click',e=>{if(e.target.closest('[data-detail-close]')){hideZoom();return;}if(e.target.closest('[data-expand-current]')){zoomToDetail(detailState.type,detailState.id);return;}let linked=e.target.closest('[data-open-case]');if(linked){current.selected.case=linked.dataset.openCase;const dest=linked.dataset.openCase;Promise.resolve(navigate('cases')).then(()=>{const opener=[...document.querySelectorAll('[data-item]')].find(el=>el.dataset.item===`case:${dest}`);opener?.focus({preventScroll:true});setDetail('case',dest)});return;}let el=e.target.closest('[data-goto]');if(el){navigate(el.dataset.goto);return;}let org=e.target.closest('[data-org]');if(org){orgClick(org.dataset.org);return;}if(e.target.closest('[data-orgback]')){let n=nodeById[current.orgParent];let parent=n?.super||'ceo';orgClick(parent);return;}let flow=e.target.closest('[data-flow]');if(flow){switchFlow(flow.dataset.flow);return;}let button=e.target.closest('[data-decision]');if(button){current.decisions[button.dataset.decision]=button.dataset.status;try{localStorage.setItem('navarro-session-decisions',JSON.stringify(current.decisions))}catch{}current.selected.decision=button.dataset.decision;document.querySelectorAll(`[data-decision="${button.dataset.decision}"]`).forEach(x=>x.classList.toggle('selected',x.dataset.status===button.dataset.status));let cnt=$('.status-chip');if(cnt)cnt.textContent=`${D.decisions.filter(d=>current.decisions[d.id]==='agreed').length} из ${D.decisions.length} отмечено как согласованные`;setDetail('decision',button.dataset.decision);return;}let item=e.target.closest('[data-item]');if(item){let [t,id]=item.dataset.item.split(':');setDetail(t,id);return;}if(e.target.closest('#export-decisions')){exportDecisions();return;}if(e.target.closest('#mobile-nav')){const open=$('#side').classList.toggle('open');$('#mobile-nav').setAttribute('aria-expanded',open?'true':'false');return;}});
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
window.addEventListener('resize',()=>requestAnimationFrame(()=>{adaptDetailColumns();adaptInlineInspector()}));
const goNext=()=>navigate(slides[Math.min(slides.length-1,current.slide+1)].id);
const goPrev=()=>navigate(slides[Math.max(0,current.slide-1)].id);
document.addEventListener('keydown',e=>{
 const detailLayer=$('#detail-zoom');
 if(detailLayer&&!detailLayer.hidden){
  if(e.key==='Escape'){e.preventDefault();hideZoom();return;}
  if(e.key==='Tab'){
   const focusable=[...detailLayer.querySelectorAll('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')].filter(el=>el.offsetParent!==null);
   if(!focusable.length){e.preventDefault();detailLayer.querySelector('.detail-window')?.focus();return;}
   const first=focusable[0],last=focusable[focusable.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
  return;
 }
 if(isEditable(e.target)||e.ctrlKey||e.altKey||e.metaKey)return;
 if(e.key==='f'||e.key==='F'||e.key==='F11'){if(e.key==='F11'&&!document.fullscreenEnabled)return;e.preventDefault();toggleFullscreen();return;}
 if(e.key==='Escape'){if(!document.fullscreenElement)setPresentationMode(false);$('#side').classList.remove('open');$('#mobile-nav')?.setAttribute('aria-expanded','false');return;}
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
