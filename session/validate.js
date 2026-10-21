const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const read=p=>fs.readFileSync(path.join(__dirname,p),'utf8');
for(const p of ['assets/data.js','assets/app.js'])new vm.Script(read(p),{filename:p});
const context={window:{}};vm.createContext(context);vm.runInContext(read('assets/data.js'),context);
const d=context.window.SESSION_DATA;
assert.strictEqual(d.navigation.length,9,'9 navigation screens');
assert.strictEqual(d.dealflows.length,3,'3 business scenarios');
assert.strictEqual(d.cases.length,8,'8 source-based cases');
assert.strictEqual(d.companies.length,6,'6 holding entities');
assert.strictEqual(d.executives.filter(x=>x.super==='ceo').length,6,'6 CEO direct reports');
for(const f of d.dealflows){const notes=d.details.flows[f.id];assert.strictEqual(notes.length,f.steps.length,`details ${f.id}`);for(const stage of notes){assert(stage.process.length>70,'stage process');assert(stage.solution.length>25,'stage solution');}}
for(const dir of d.directions){assert(d.details.directions[dir.id].cases,'direction case references');}
for(const c of d.cases){assert(d.details.cases[c.id].process,'case process');}
const ui=read('assets/app.js');
assert(ui.includes('requestFullscreen'),'fullscreen behavior');
assert(ui.includes("e.key==='PageDown'"),'presentation clicker');
assert(ui.includes('data-open-case'),'linked case navigation');
assert(ui.includes('branchSerial'),'organization updates without re-render');
assert(ui.includes('switchFlow'),'workflow changes without re-render');
assert(ui.includes('inspectorSerial'),'animated inspector state');
assert(ui.includes("type!=='flow'"),'flow inspector fix');
assert(read('index.html').includes('id="fullscreen"'),'fullscreen button');
assert(read('assets/style.css').includes('.org-overview-label'),'org hierarchy text layout');
assert(read('assets/app.js').includes('ПРЯМОЕ ПОДЧИНЕНИЕ CEO'),'exec hierarchy legend');
console.log(`PASS · NAVARRO Session v4.1: ${d.navigation.length} экранов, ${d.dealflows.reduce((n,f)=>n+f.steps.length,0)} этапа, ${d.cases.length} кейсов, полноэкранный режим и кликер`);
