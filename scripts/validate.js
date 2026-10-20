const fs = require('fs'),vm = require('vm');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/../assets/data.js','utf8'),sandbox);
const d=sandbox.window.NAVARRO;
const assert=(v,m)=>{if(!v)throw Error(m)};
assert(d.staff.length===19,'19 штатных позиций');
assert(d.staff.filter(x=>x[2]).length===3,'3 вакансии');
assert(d.roles.length===19,'19 должностных профилей');
assert(d.processes.length===3,'3 сценария');
assert(d.processes.find(x=>x.id==='transit').steps.length>=10,'Подробный транзит');
assert(d.departments.find(x=>x.id==='it').parent==='executive','ИТ напрямую гендиректору');
assert(d.departments.find(x=>x.id==='logistics').parent==='deputy','Логистика заму');
assert(d.departments.find(x=>x.id==='quality').name==='Отдел учёта и качества','Учёт и качество');
assert(d.departments.find(x=>x.id==='procurement').parent==='commercial','Закупки в коммерческом департаменте');
assert(d.departments.find(x=>x.id==='transit').units===0,'Отдел транзита без утвержденных ставок');
assert(d.processes.find(x=>x.id==='into-wing'),'Заправка в крыло');
assert(d.raci.length>5 && d.docs.length>=10,'RACI / документы');

// Official legal names supplied by the project team. Internal identifiers remain stable.
const expectedNames = {
  dostyk: 'Dostyq Refinery',
  mercury: 'Mercury Energy',
  ion: 'Ion Energy'
};
for (const [id,name] of Object.entries(expectedNames)) {
  const company = d.companies.find(x => x.id === id);
  assert(company && company.name === name, 'Официальное название: ' + name);
}
for (const f of ['assets/data.js','assets/app.js','README.md','docs/CHANGELOG_FROM_V1.md']) {
  const content=fs.readFileSync(__dirname+'/../'+f,'utf8');
  assert(!/(Достык|Меркури|\bION\b|Dostyk Refinery)/.test(content), 'Устаревшее название предприятия в '+f);
}
console.log('NAVARRO TRADE v2: проверка структуры, штатного состава и сценариев пройдена.');
