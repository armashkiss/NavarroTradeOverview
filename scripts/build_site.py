#!/usr/bin/env python3
"""Regenerate web data from NAVARRO TRADE Obsidian vault.
Usage: python scripts/build_site.py --vault /path/to/NAVARRO_TRADE_Obsidian_Vault
Original staff photos and source docs are excluded from the share build by default.
"""
import argparse,json,re,html,unicodedata
from pathlib import Path
import mistune

ap=argparse.ArgumentParser()
ap.add_argument('--vault',required=True)
ap.add_argument('--output',default=None)
a=ap.parse_args()
vault=Path(a.vault).resolve();out=Path(a.output).resolve() if a.output else Path(__file__).parent.parent
if not vault.is_dir():raise SystemExit(f'Vault not found: {vault}')
notes=[f for f in vault.rglob('*.md') if not f.relative_to(vault).parts[0].startswith('09_')]
notes.sort(key=lambda x:str(x.relative_to(vault)))
canvases=sorted((vault/'01_Канвасы').glob('*.canvas'))
md=mistune.create_markdown(plugins=['table','strikethrough','task_lists'],escape=True)

def basename(p):return p.stem
note_idx={str(p.with_suffix('').relative_to(vault)):f'd{i:03d}' for i,p in enumerate(notes)}
canvas_idx={str(p.with_suffix('').relative_to(vault)):f'c{i+1:02d}' for i,p in enumerate(canvases)}
base_idx={}
for p,i in [(p,note_idx[str(p.with_suffix('').relative_to(vault))]) for p in notes]:base_idx.setdefault(basename(p),i)
for p,i in [(p,canvas_idx[str(p.with_suffix('').relative_to(vault))]) for p in canvases]:base_idx.setdefault(basename(p),i)

def target(path):
 path=path.strip().replace('\\','/')
 if path.endswith('.md') or path.endswith('.canvas'):path=path.rsplit('.',1)[0]
 found=note_idx.get(path) or canvas_idx.get(path) or base_idx.get(path.rsplit('/',1)[-1])
 if not found:return None
 return ('canvas' if found.startswith('c') else 'doc')+'/'+found

def replace_wiki(raw):
 def sub(m):
  inner=m.group(1); ref,_,alias=inner.partition('|'); dest=target(ref)
  name=alias.strip() if alias else ref.rsplit('/',1)[-1]
  # avoid nested markdown issues in labels
  name=name.replace('[','').replace(']','')
  return f'[{name}](#/{dest})' if dest else name
 return re.sub(r'\[\[([^\]]+)\]\]',sub,raw)

def short(raw):
 raw=re.sub(r'\[\[([^\]|]+)\|([^\]]+)\]\]',r'\2',raw)
 raw=re.sub(r'\[\[([^\]]+)\]\]',r'\1',raw)
 raw=re.sub(r'[#*_`>|]+',' ',raw)
 return re.sub(r'\s+',' ',raw).strip()[:18000]

def text_html(raw):
 return md(replace_wiki(raw))

records=[]
for p in notes:
 name=p.stem
 rp=p.relative_to(vault)
 raw=p.read_text('utf8')
 title_match=re.search(r'^#\s+(.+)',raw,re.M)
 title=title_match.group(1).strip() if title_match else name
 part=rp.parts[0] if len(rp.parts)>1 else '00_Главная'
 sec=rp.parts[1] if len(rp.parts)>2 else ''
 records.append({'id':note_idx[str(p.with_suffix('').relative_to(vault))],
                 'title':title,'name':name,'path':str(rp),'section':part,'subsection':sec,
                 'html':text_html(raw),'search':short(raw)})

colors={'1':'rose','2':'green','3':'gold','4':'violet','5':'blue','6':'cyan'}
cs=[]
for p in canvases:
 data=json.loads(p.read_text('utf8'))
 nodes=[]
 for n in data['nodes']:
  nodes.append({'id':n['id'],'x':n['x'],'y':n['y'],'w':n['width'],'h':n['height'],
               'tone':colors.get(str(n.get('color','5')),'blue'),
               'html':text_html(n.get('text','')),
               'text':short(n.get('text','')),
               'links':[target(m) for m in re.findall(r'\[\[([^\]|]+)',n.get('text','')) if target(m)]})
 edges=[{'id':e.get('id',''),'from':e['fromNode'],'to':e['toNode'],
         'fs':e.get('fromSide','right'),'ts':e.get('toSide','left'),
         'label':e.get('label',''),'arrow':e.get('toEnd','')=='arrow',
         'tone':colors.get(str(e.get('color','5')),'blue')} for e in data['edges']]
 cid=canvas_idx[str(p.with_suffix('').relative_to(vault))]
 nice=p.stem.split(' ',1)[1] if ' ' in p.stem else p.stem
 cs.append({'id':cid,'title':nice,'name':p.stem,'nodes':nodes,'edges':edges})

# exclude source docs/photos & personal identities - publish role-only by default
result={'version':'1.0 · 15.10.2026','notes':records,'canvases':cs,
        'summary':{'staff':19,'filled':16,'vacant':3,'canvasCount':len(cs),'docCount':len(records)},
        'siteNotice':'Проектная организационная модель TO-BE, не утверждена. Сведения о договорах, тарифах и полномочиях требуют согласования.'}
(out/'site-data.js').write_text('window.NAVARRO_DATA = '+json.dumps(result,ensure_ascii=False,separators=(',',':'))+';\n','utf8')
print(f'Built {len(records)} documents, {len(cs)} canvases, {(out/"site-data.js").stat().st_size/1024:.1f} KiB')
