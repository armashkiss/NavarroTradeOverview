const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const read=p=>fs.readFileSync(path.join(__dirname,p),'utf8');
for(const path of ['assets/data.js','assets/app.js'])new (require('vm').Script)(read(path),{filename:path});
const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(read('assets/data.js'),sandbox);
const d=sandbox.window.SESSION_DATA;
assert.equal(d.navigation.length,9,'Nine navigation slides');
assert.equal(d.directions.length,3,'Three business-direction cards');
assert.equal(d.executives.filter(x=>x.super==='ceo').length,6,'Six CEO direct reports');
assert(d.executives.find(x=>x.id==='deputy').children.includes('international'),'International directorate under deputy');
assert(d.executives.find(x=>x.id==='coo').children.includes('transitops'),'Transit Operations under COO');
assert.deepEqual(Array.from(d.executives.find(x=>x.id==='commercial').children),['procurement','sales','aviasales']);
assert.equal(d.cases.length,8,'Case registry');
assert.equal(d.companies.length,6,'Holding links');
assert(d.dealflows.every(x=>x.steps.length>=7),'Detailed deal routes');
const ids=new Set(d.executives.map(x=>x.id));assert.equal(ids.size,d.executives.length,'Unique org IDs');
for(const x of d.executives){if(x.super)assert(ids.has(x.super),'Parent '+x.super);for(const y of x.children)assert(ids.has(y),'Child '+y)}
let required=['org-ceo','org-execs','data-item','inspector','localStorage','exportDecisions','keydown'];const js=read('assets/app.js');for(const k of required)assert(js.includes(k),'Missing functionality '+k);
const h=read('index.html');assert(h.includes('assets/app.js')&&h.includes('assets/data.js'));
console.log('OK: 9 slides, interactive cards, org hierarchy, 3 flows, 8 cases, decisions export.');
