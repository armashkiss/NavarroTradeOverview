#!/usr/bin/env python3
"""Apply NAVARRO v6.10 layout to latest local code without replacing Codex work."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
app=root/'session-v6/assets/app.js'
index=root/'session-v6/index.html'
css=root/'session-v6/assets/presentation-fit.css'
for f in (app,index,css):
    if not f.exists():raise SystemExit(f'Отсутствует файл: {f}')
s=app.read_text(encoding='utf-8')
a='if(inlineDetailTypes.has(type)){setInlineDetail(type,id);return;}'
b='if(inlineDetailTypes.has(type)){zoomToDetail(type,id);return;}'
if a in s:
    if s.count(a)!=1:raise SystemExit('Неоднозначное место включения модалки.')
    s=s.replace(a,b)
elif b not in s:raise SystemExit('Codex изменил setDetail — нужна новая адаптация патча.')
marker='/* v6.10: measured widescreen modal'
if marker not in s:
    start=s.find('function adaptDetailColumns(){')
    end=s.find('function zoomToDetail(type,id){',start)
    if start<0 or end<start or s.count('function adaptDetailColumns(){')!=1:
        raise SystemExit('Функция адаптации изменилась — патч остановлен.')
    algorithm=(root/'tools/adapt_detail_v610.js.txt').read_text(encoding='utf-8')
    s=s[:start]+algorithm+s[end:]
reset='layer._fitPageIndex=0;\n const source=layer.querySelector(\'.detail-source\');'
if reset not in s:
    find="const source=layer.querySelector('.detail-source');\n source.replaceChildren"
    if find not in s:raise SystemExit('Структура zoomToDetail изменилась.')
    s=s.replace(find,reset+"\n source.replaceChildren",1)
# Do not recreate an overflowing inline panel when revisiting a slide.
old_focus="const inline=inlineDetailTypes.has(type),focused=inline&&!!current.selected[type];"
new_focus="const inline=inlineDetailTypes.has(type),focused=false;"
if old_focus in s:s=s.replace(old_focus,new_focus,1)
elif new_focus not in s:raise SystemExit('Codex изменил shell: непредсказуемая вёрстка.')
# Animate from the clicked card even when there is no right-hand inline panel.
old_src="const src=$('#inspector');"
new_src="const src=document.querySelector(`[data-item=\"${type}:${id}\"]`)||document.querySelector(`[data-open-direction=\"${id}\"]`)||$('#inspector');"
if old_src in s:
    # Occurs only in the immersive zoom function in the current repository.
    s=s.replace(old_src,new_src,1)
elif new_src not in s:raise SystemExit('Codex изменил источник zoom-анимации.')
app.write_text(s,encoding='utf-8')
h=index.read_text(encoding='utf-8')
ref='assets/presentation-fit.css?v=6.10'
if ref not in h:
    m=re.search(r'<link rel="stylesheet" href="assets/style\.css[^\"]*">',h)
    if not m:raise SystemExit('Исходная CSS-ссылка не найдена.')
    h=h[:m.end()]+f'\n  <link rel="stylesheet" href="{ref}">'+h[m.end():]
h=re.sub(r'(src="assets/app\.js\?v=)[^\"]+',r'\g<1>6.10-fit',h)
index.write_text(h,encoding='utf-8')
print('NAVARRO v6.10: CSS подключён, карточки открывают полноэкранный разбор, JS обновлён.')
