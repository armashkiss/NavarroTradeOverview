/* NAVARRO TRADE · static documentation hub — no backend, analytics or trackers */
(() => {
'use strict';
const DB=window.NAVARRO_DATA;
if(!DB){ document.getElementById('main').textContent='Не удалось загрузить данные сайта.'; return; }
const DOCS=DB.notes, MAPS=DB.canvases;
const noteById=Object.fromEntries(DOCS.map(d=>[d.id,d]));
const mapById=Object.fromEntries(MAPS.map(m=>[m.id,m]));
const sections=[
 {id:'02_Оргструктура',name:'Организация и отделы',icon:'structure'},
 {id:'03_Должности',name:'Должности и функции',icon:'team'},
 {id:'04_Холдинг',name:'Предприятия холдинга',icon:'building'},
 {id:'05_Процессы',name:'Бизнес-процессы',icon:'flow'},
 {id:'06_Стратегическая_сессия',name:'Стратегическая сессия',icon:'calendar'},
 {id:'07_Шаблоны',name:'Шаблоны документов',icon:'document'}
];
const icons={home:'<path d="m3 11 9-7 9 7v9H3zM9 20v-6h6v6"/>',structure:'<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 8v4M5 17v-5h14v5"/>',building:'<path d="M4 21V5l8-3 8 3v16H4zM4 10h16M10 21v-6h4v6M7 7h.01M17 7h.01"/>',flow:'<rect x="2" y="3" width="7" height="5" rx="1"/><rect x="15" y="3" width="7" height="5" rx="1"/><rect x="9" y="16" width="7" height="5" rx="1"/><path d="M9 5h6M18 8v4h-5v4M5 8v4h8"/>',team:'<circle cx="9" cy="7" r="3"/><path d="M2 21v-4a7 7 0 0 1 14 0v4M17 4a3 3 0 0 1 0 6M18 14a6 6 0 0 1 4 6"/>',document:'<path d="M5 2h9l5 5v15H5zM14 2v5h5M8 11h8M8 15h8M8 19h5"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/>'};
const icon=(name)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.document}</svg>`;
const ehtml=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const main=document.querySelector('#main');const nav=document.querySelector('#sidebar-nav');
const route=()=>{const h=decodeURI(location.hash||'#/');let parts=h.replace(/^#\/?/,'').split('/').filter(Boolean);return {type:parts[0]||'home',id:parts[1]||''}};
const getTitle=(r)=>r.type==='canvas'?(mapById[r.id]?.title||'Схема'):r.type==='doc'?(noteById[r.id]?.title||'Документ'):r.type==='section'?(sections.find(s=>s.id===r.id)?.name||'Материалы'):'Обзор модели';
const rel=(d)=>`#/doc/${d.id}`;
const mapurl=(m)=>`#/canvas/${m.id}`;
const findDoc=(name)=>DOCS.find(d=>d.name===name||d.title===name);
const abbreviate=(s,n=90)=>s.length>n?s.slice(0,n-1)+'…':s;
let foldersOpen=Object.fromEntries(sections.map(s=>[s.id,false]));
let scrollRestore=false;
function buildMenu(r){
 let html=`<div class="menu-group"><div class="menu-label">НАВИГАЦИЯ</div><a href="#/" class="menu-item ${r.type==='home'?'selected':''}">${icon('home')}<span>Обзор модели</span></a></div>`;
 html+=`<div class="menu-group"><div class="menu-label">ИНТЕРАКТИВНЫЕ СХЕМЫ</div>${MAPS.map((m,i)=>`<a class="menu-item ${r.type==='canvas'&&r.id===m.id?'selected':''}" href="${mapurl(m)}">${icon(['structure','building','flow','flow','flow','structure'][i])}<span>${ehtml(m.title)}</span></a>`).join('')}</div>`;
 html+='<div class="menu-group"><div class="menu-label">БАЗА ЗНАНИЙ</div>';
 for(const s of sections){
  const items=DOCS.filter(d=>d.section===s.id);
  const expanded=foldersOpen[s.id]||(r.type==='doc'&&items.some(d=>d.id===r.id));
  html+=`<button class="sidebar-fold" data-folder="${s.id}" aria-expanded="${expanded}"><span>${icon(s.icon)} ${ehtml(s.name)}</span><svg class="fold-icon" viewBox="0 0 24 24"><path d="m5 9 7 7 7-7"/></svg></button><div class="sidebar-docs" ${!expanded?'hidden':''}>${items.map(d=>`<a class="menu-item ${r.type==='doc'&&r.id===d.id?'selected':''}" href="${rel(d)}" title="${ehtml(d.title)}">${ehtml(abbreviate(d.name,29))}</a>`).join('')}<a class="menu-item" href="#/section/${encodeURIComponent(s.id)}"><strong>Все материалы →</strong></a></div>`;
 }
 html+='</div>';nav.innerHTML=html;
 nav.querySelectorAll('[data-folder]').forEach(b=>b.addEventListener('click',()=>{let s=b.dataset.folder; foldersOpen[s]=b.getAttribute('aria-expanded')!=='true';buildMenu(route())}));
}
function setLoc(r){document.querySelector('#top-location').innerHTML=`<span>NAVARRO TRADE</span><span class="breadcrumb-divider">/</span><strong>${ehtml(getTitle(r))}</strong>`;}
function renderHome(){
 const highlights=[{id:'c01',img:'assets/org-preview.png',tag:'01 / ORGANIZATION',title:'Организационная структура',desc:'Подчинённость 19 штатных единиц, департаменты, отделы и управленческие контуры.'},
 {id:'c02',img:'assets/holding-preview.png',tag:'02 / HOLDING LINKS',title:'Взаимодействие предприятий',desc:'Navarro Trade, Sterling Energy, JetWayLogistics, нефтебазы, терминал и ION.'},
 {id:'c04',img:'assets/deal-preview.png',tag:'03 / DEAL EXECUTION',title:'Сквозной процесс сделки',desc:'От поиска поставщика и расчёта экономики до перевозки, перевалки и оплаты.'}];
 // Canvases sorted by filenames: c01 org, c02 holding, c03 route deal, c04 scenarios
 highlights[2].id='c03';
 const flow=['Инициирование','Закупка / продажа','Расчёт сделки','Согласования','Договор','Ж/д логистика','Перевалка / отпуск','Расчёты','Закрытие и KPI'];
 const companies=[['Sterling Energy','Управление группой','S'],['JetWayLogistics','Железнодорожные перевозки','J'],['Достык Рефайнери','Приграничная перевалка','Д'],['Меркури','Нефтебаза','М'],['Алматинский терминал','Терминал / авиа ГСМ*','A'],['ION','Цифровые интеграции*','I']];
 const companyDoc=(n)=>DOCS.find(d=>d.section==='04_Холдинг'&&d.name===n);
 main.innerHTML=`<div class="overview">
 <section class="hero"><div class="hero-content"><div class="eyebrow">STERLING GROUP · OPERATING MODEL</div><h1>Коммерция. Логистика.<br/>Единая ответственность.</h1><p>Проект целевой структуры Navarro Trade: руководители и отделы, связи с предприятиями холдинга, сквозные процессы нефтетрейдинга и зоны принятия решений.</p><div class="hero-actions"><a class="primary-link" href="#/canvas/c01">Исследовать оргструктуру <span>↗</span></a><a class="ghost-link" href="#/canvas/c03">Маршрут сделки →</a></div></div><div class="hero-stamp"><b>N.</b><span>TRADE<br/>ORGANIZATION</span></div></section>
 <section class="stats"><div class="stat-card"><div><strong>19</strong><span>Штатных единиц</span></div><div class="stat-icon">◫</div></div><div class="stat-card"><div><strong>03</strong><span>Вакантные позиции</span></div><div class="stat-icon">◌</div></div><div class="stat-card"><div><strong>${MAPS.length.toString().padStart(2,'0')}</strong><span>Интерактивные схемы</span></div><div class="stat-icon">⌘</div></div><div class="stat-card"><div><strong>${DOCS.length}</strong><span>Рабочих документов</span></div><div class="stat-icon">≡</div></div></section>
 <div class="section-heading"><div><h2>Ключевые схемы</h2><p>Откройте схему, масштабируйте и переходите к обязанностям подразделений.</p></div><a href="#/canvas/c06">Все связи ↗</a></div><section class="feature-grid">${highlights.map(h=>`<a class="feature-card" href="#/canvas/${h.id}"><div class="feature-cover"><img src="${h.img}" alt="Превью: ${ehtml(h.title)}" loading="lazy"/><div class="cover-overlay"></div><span class="cover-tag">${h.tag}</span></div><div class="feature-body"><h3>${ehtml(h.title)}</h3><p>${ehtml(h.desc)}</p><span class="card-cta">Открыть интерактивную схему</span></div></a>`).join('')}</section>
 <section class="process-strip"><div class="section-heading"><div><h2>Цикл коммерческой сделки</h2><p>От коммерческой потребности до подтверждённого финансового результата.</p></div><a href="#/canvas/c03">Подробнее →</a></div><div class="flow-list">${flow.map((f,i)=>`<a class="flow-step" title="Открыть маршрут сделки" href="#/canvas/c03"><span class="flow-no">${String(i+1).padStart(2,'0')}</span><strong>${ehtml(f)}</strong></a>`).join('')}</div></section>
 <section class="companies"><div class="section-heading"><div><h2>Контур взаимодействия</h2><p>Каждое предприятие — самостоятельная бизнес-единица; линии показывают рабочее взаимодействие, не подчинённость.</p></div><a href="#/canvas/c02">Карта холдинга →</a></div><div class="company-grid">${companies.map(([name,description,symbol])=>{let d=companyDoc(name);return `<a class="company-link" href="${d?rel(d):'#/canvas/c02'}"><div class="company-icon">${symbol}</div><div><strong>${ehtml(name)}</strong><small>${ehtml(description)}</small></div></a>`}).join('')}</div></section>
 <div class="important-note"><span style="font-size:20px">◇</span><div><b>Статус документа: проект TO-BE.</b> Структура, функциональные регламенты и линии взаимодействия подлежат согласованию руководителями Sterling. Формальные «отделы» не означают появления новых штатных единиц. *Профиль ION и авиационного терминала требует подтверждения.</div></div>
 </div>`;
}
function renderSection(sid){let s=sections.find(x=>x.id===sid);if(!s){main.textContent='Раздел не найден';return;}let ds=DOCS.filter(d=>d.section===sid);
 main.innerHTML=`<div class="docs-page"><div class="directory-head"><span class="overline">БАЗА ЗНАНИЙ / NAVARRO TRADE</span><h1>${ehtml(s.name)}</h1><p style="color:#8494a4;font-size:11px">${ds.length} документов · проектная редакция</p></div><div class="directory-grid">${ds.map(d=>`<a class="directory-item" href="${rel(d)}"><small>ДОКУМЕНТ · ${ehtml(d.subsection||'МОДЕЛЬ')}</small><strong>${ehtml(d.title)}</strong><span>Читать →</span></a>`).join('')}</div></div>`;
}
function renderDoc(id){const d=noteById[id];if(!d){main.innerHTML='<div class="docs-page">Документ не найден.</div>';return;}let same=DOCS.filter(x=>x.section===d.section&&x.id!==id).slice(0,9);let category=sections.find(s=>s.id===d.section);
 main.innerHTML=`<div class="docs-page"><div class="docs-heading"><div class="overline">БАЗА ЗНАНИЙ / ${ehtml(category?.name||'ОБЩЕЕ')}</div><h1>${ehtml(d.title)}</h1><p>Проектная редакция · октябрь 2026 · <a href="#/section/${encodeURIComponent(d.section)}" style="color:#507e98">Все документы раздела ↗</a></p></div><div class="doc-layout"><article class="article">${d.html}</article><aside class="doc-rail"><h3>По теме</h3>${same.map(x=>`<a href="${rel(x)}">${ehtml(abbreviate(x.title,48))}</a>`).join('')}<p class="muted-small">Материалы подготовлены для согласования на стратегической сессии. Не являются утверждёнными внутренними нормативными актами.</p></aside></div></div>`;
}
function mapColors(t){return {blue:'#6385b0',green:'#5b9b80',gold:'#b8a06c',violet:'#9a82c6',rose:'#bd7778',cyan:'#559dac'}[t]||'#6385b0'}
let graphCleanup=null;
function renderCanvas(cid){
 const m=mapById[cid];if(!m){main.innerHTML='<div class="canvas-page">Схема не найдена.</div>';return;}
 main.innerHTML=`<div class="canvas-page"><div class="canvas-header"><div><div class="overline">NAVARRO TRADE / ИНТЕРАКТИВНЫЕ СХЕМЫ</div><h1>${ehtml(m.title)}</h1><p>Масштабируйте колесом мыши, перетаскивайте поле. Нажмите на карточку, чтобы прочитать подробности.</p></div><div class="canvas-links">${MAPS.map(x=>`<a class="mini-link ${m.id===x.id?'selected':''}" href="${mapurl(x)}">${ehtml(x.name.split(' ')[0])} · ${ehtml(abbreviate(x.title,20))}</a>`).join('')}</div></div><div class="canvas-layout"><div class="graph-shell"><div class="map-floating-top"><span class="tool-label">ИНТЕРАКТИВНАЯ КАРТА · ${m.nodes.length} УЗЛОВ</span><button class="focus-button" data-focus="fit">Вся схема</button><button class="focus-button" data-focus="leader">Руководство</button><button class="focus-button" data-focus="commercial">Коммерция</button><button class="focus-button" data-focus="finance">Финансы</button></div><div class="graph-viewport" id="graph-viewport"><div class="graph-stage" id="graph-stage"><svg class="graph-lines" id="graph-lines" aria-hidden="true"></svg></div></div><div class="canvas-controls"><button id="zoom-out" title="Уменьшить">−</button><span class="zoom-label" id="zoom-label">—</span><button id="zoom-in" title="Увеличить">+</button><button id="zoom-fit" title="Уместить схему">⊡</button></div></div><aside class="inspector"><div class="inspector-head"><span class="tiny-dot"></span>ПАСПОРТ УЗЛА</div><div class="inspector-content" id="inspector-content"><p class="empty"><b>Выберите элемент схемы.</b><br/>Откройте карточку подразделения, должности или компании, чтобы увидеть её функции и перейти к полному документу.</p><p class="hint">Сплошные линии — административная подчинённость или последовательность этапов. Пунктир — функциональное взаимодействие (по подписи линии).</p></div></aside></div></div>`;
 const vp=document.getElementById('graph-viewport'),stage=document.getElementById('graph-stage'),svg=document.getElementById('graph-lines'),insp=document.getElementById('inspector-content'),zoomLabel=document.getElementById('zoom-label');
 let pad=115, minX=Math.min(...m.nodes.map(n=>n.x)),minY=Math.min(...m.nodes.map(n=>n.y));let maxX=Math.max(...m.nodes.map(n=>n.x+n.w)),maxY=Math.max(...m.nodes.map(n=>n.y+n.h));
 const totalW=maxX-minX+2*pad,totalH=maxY-minY+2*pad;
 stage.style.width=totalW+'px';stage.style.height=totalH+'px';svg.setAttribute('width',totalW);svg.setAttribute('height',totalH);svg.setAttribute('viewBox',`0 0 ${totalW} ${totalH}`);
 const pos={};m.nodes.forEach(n=>{pos[n.id]={...n,x:n.x-minX+pad,y:n.y-minY+pad};});
 const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');svg.appendChild(defs);
 for(let tone of ['blue','green','gold','violet','rose','cyan']){
  const mk=document.createElementNS('http://www.w3.org/2000/svg','marker');mk.setAttribute('id',`arrow-${tone}`);mk.setAttribute('markerWidth','10');mk.setAttribute('markerHeight','10');mk.setAttribute('refX','8');mk.setAttribute('refY','5');mk.setAttribute('orient','auto');mk.setAttribute('markerUnits','userSpaceOnUse');
  const pp=document.createElementNS('http://www.w3.org/2000/svg','path');pp.setAttribute('d','M1 1 L9 5 L1 9 z');pp.setAttribute('fill',mapColors(tone));mk.appendChild(pp);defs.appendChild(mk);
 }
 function attach(n,side){const x=n.x,y=n.y;return side==='top'?[x+n.w/2,y]:side==='bottom'?[x+n.w/2,y+n.h]:side==='left'?[x,y+n.h/2]:[x+n.w,y+n.h/2];}
 const connected={};
 m.edges.forEach(e=>{
  const n1=pos[e.from],n2=pos[e.to];if(!n1||!n2)return;
  const [x1,y1]=attach(n1,e.fs),[x2,y2]=attach(n2,e.ts);
  const dx=x2-x1,dy=y2-y1,offset=Math.max(55,Math.min(225,Math.hypot(dx,dy)*.27));
  const h1=(e.fs==='left'?-1:e.fs==='right'?1:0),v1=(e.fs==='top'?-1:e.fs==='bottom'?1:0),h2=(e.ts==='left'?-1:e.ts==='right'?1:0),v2=(e.ts==='top'?-1:e.ts==='bottom'?1:0);
  const d=`M${x1},${y1} C${x1+h1*offset},${y1+v1*offset} ${x2+h2*offset},${y2+v2*offset} ${x2},${y2}`;
  const el=document.createElementNS('http://www.w3.org/2000/svg','path');el.setAttribute('d',d);el.setAttribute('class',`edge-graph edge-${e.tone} ${e.arrow?'':'functional'}`);if(e.arrow)el.setAttribute('marker-end',`url(#arrow-${e.tone})`);svg.appendChild(el);
  (connected[e.from]??=[]).push(el);(connected[e.to]??=[]).push(el);
  // labels only at close zoom; avoid flood in overview
  if(e.label){const label=document.createElementNS('http://www.w3.org/2000/svg','text');label.setAttribute('class','edge-label');label.setAttribute('x',(x1+x2)/2);label.setAttribute('y',(y1+y2)/2-12);label.textContent=e.label;svg.appendChild(label);}
 });
 let selected=null;
 m.nodes.forEach(n=>{
  const v=pos[n.id],el=document.createElement('div');el.className=`canvas-node tone-${n.tone}`;el.style.cssText=`left:${v.x}px;top:${v.y}px;width:${n.w}px;height:${n.h}px;`;el.innerHTML=n.html;el.dataset.node=n.id;stage.appendChild(el);
  el.addEventListener('click',ev=>{if(ev.target.closest('a'))return;selected=n.id;stage.querySelectorAll('.canvas-node.active').forEach(e=>e.classList.remove('active'));el.classList.add('active');svg.querySelectorAll('.edge-graph.highlight').forEach(e=>e.classList.remove('highlight'));(connected[n.id]||[]).forEach(e=>e.classList.add('highlight'));insp.innerHTML=`${n.html}<div class="node-metadata">Узел организационной карты · ${ehtml(m.title)}<br/>Ссылки в тексте открывают соответствующий документ.</div>`;});
 });
 let scale=1,tx=0,ty=0;
 const clamp=(z)=>Math.min(2.3,Math.max(.075,z));
 function setTransform(){stage.style.transform=`translate(${tx}px,${ty}px) scale(${scale})`;zoomLabel.textContent=`${Math.round(scale*100)}%`;}
 function fit(){let w=vp.clientWidth,h=vp.clientHeight;scale=clamp(Math.min((w-65)/totalW,(h-50)/totalH));tx=(w-totalW*scale)/2;ty=(h-totalH*scale)/2;setTransform();}
 function center(n,desired=.70){if(!n)return fit();scale=clamp(desired);tx=vp.clientWidth/2-(n.x+n.w/2)*scale;ty=vp.clientHeight/2-(n.y+n.h/2)*scale;setTransform();}
 function zoom(mult,px=vp.clientWidth/2,py=vp.clientHeight/2){let next=clamp(scale*mult),ratio=next/scale;tx=px-(px-tx)*ratio;ty=py-(py-ty)*ratio;scale=next;setTransform();}
 vp.addEventListener('wheel',ev=>{ev.preventDefault();const r=vp.getBoundingClientRect();zoom(ev.deltaY>0?.82:1.22,ev.clientX-r.left,ev.clientY-r.top)},{passive:false});
 let dragging=false,dragId=null,lx=0,ly=0;
 vp.addEventListener('pointerdown',ev=>{if(ev.target.closest('a')||ev.target.closest('.canvas-node'))return;dragging=true;dragId=ev.pointerId;lx=ev.clientX;ly=ev.clientY;vp.classList.add('grabbing');vp.setPointerCapture(dragId)});
 vp.addEventListener('pointermove',ev=>{if(!dragging)return;tx+=ev.clientX-lx;ty+=ev.clientY-ly;lx=ev.clientX;ly=ev.clientY;setTransform()});
 const endDrag=()=>{dragging=false;vp.classList.remove('grabbing')};vp.addEventListener('pointerup',endDrag);vp.addEventListener('pointercancel',endDrag);
 document.querySelector('#zoom-out').onclick=()=>zoom(.77);document.querySelector('#zoom-in').onclick=()=>zoom(1.3);document.querySelector('#zoom-fit').onclick=fit;
 const choices={leader:['генеральный директор','руководство'],commercial:['коммерческий департамент','коммерческ'],finance:['финансовая дирекция','финансовый директор']};
 document.querySelectorAll('[data-focus]').forEach(b=>b.onclick=()=>{let k=b.dataset.focus;if(k==='fit')return fit();let matches=choices[k];let candidates=m.nodes.filter(n=>matches.some(term=>n.text.toLowerCase().includes(term)));let chosen=candidates.find(n=>n.text.toLowerCase().includes(matches[0]))||candidates[0];center(chosen?pos[chosen.id]:null)});
 requestAnimationFrame(fit);graphCleanup=()=>{};
}
function navigate(){const r=route();buildMenu(r);setLoc(r);if(r.type==='home')renderHome();else if(r.type==='canvas')renderCanvas(r.id);else if(r.type==='doc')renderDoc(r.id);else if(r.type==='section')renderSection(r.id);else renderHome();document.querySelector('#sidebar').classList.remove('open');document.querySelector('#mobile-backdrop').hidden=true;if(!scrollRestore)window.scrollTo({top:0});}
window.addEventListener('hashchange',navigate);navigate();
// Search
const overlay=document.getElementById('search-overlay'),searchInput=document.getElementById('search-input'),results=document.getElementById('search-results');
document.getElementById('docs-counter').textContent=DOCS.length;
function showSearch(){overlay.hidden=false;searchInput.value='';fillSearch('');setTimeout(()=>searchInput.focus(),20)}
function closeSearch(){overlay.hidden=true}
function fillSearch(q){q=q.trim().toLowerCase();let items=q?DOCS.map(d=>({...d,score:(d.title.toLowerCase().includes(q)?100:0)+(d.name.toLowerCase().includes(q)?60:0)+(d.search.toLowerCase().includes(q)?10:0)})).filter(d=>d.score>0).sort((a,b)=>b.score-a.score).slice(0,28):DOCS.filter(d=>['Целевая организационная модель','Сквозная сделка','Единая матрица взаимодействий ТОО','Финансовая дирекция','Штат 19 единиц'].includes(d.name));
 results.innerHTML=items.length?items.map(d=>`<a class="search-result" href="${rel(d)}"><small>${ehtml(d.section.replace(/^\d+_/,'').replaceAll('_',' ').toUpperCase())}</small><strong>${ehtml(d.title)}</strong><p>${ehtml(abbreviate(d.search,140))}</p></a>`).join(''):'<div style="padding:28px;color:#8090a2;font-size:11px">Ничего не найдено. Попробуйте «транзит», «закупки» или «логистика».</div>';
 results.querySelectorAll('a').forEach(a=>a.onclick=closeSearch);
}
document.getElementById('open-search').onclick=showSearch;searchInput.addEventListener('input',()=>fillSearch(searchInput.value));
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();showSearch()}if(e.key==='Escape')closeSearch();if(e.key==='Enter'&&!overlay.hidden){let a=results.querySelector('a');if(a){closeSearch();location.hash=a.getAttribute('href')}}});overlay.addEventListener('click',ev=>{if(ev.target===overlay)closeSearch()});
let toastTimeout;
function toast(t){let el=document.querySelector('#toast');el.textContent=t;el.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('visible'),2800)}
document.getElementById('copy-link').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);toast('Ссылка на текущий раздел скопирована')}catch(e){toast('Скопируйте адрес из строки браузера')}};
document.getElementById('mobile-menu').onclick=()=>{document.getElementById('sidebar').classList.add('open');document.getElementById('mobile-backdrop').hidden=false};document.getElementById('mobile-backdrop').onclick=()=>{document.getElementById('sidebar').classList.remove('open');document.getElementById('mobile-backdrop').hidden=true};
})();
