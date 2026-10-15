# NAVARRO TRADE — сайт для GitHub Pages

Это **статическая веб-версия** рабочего Obsidian Vault по организационной модели NAVARRO TRADE (Sterling Group): интерактивные графы, 60 документов, поиск, мобильная версия и прямые ссылки на разделы. Без серверов и баз данных.

## Запуск локально

В каталоге сайта:

```bash
python3 -m http.server 8080
```

Откройте http://localhost:8080. `index.html` также может запускаться прямо в браузере, так как контент встроен в `site-data.js`.

## Публикация на GitHub Pages

**Внимание:** GitHub Pages предоставляет общедоступный сайт. Даже если исходный репозиторий приватный, доступ к опубликованной странице не следует считать ограниченным. Публикуйте материалы только с разрешения руководства; при необходимости ограниченного доступа выберите хостинг с аутентификацией.

1. Создайте GitHub-репозиторий, например `navarro-operating-model`.
2. Загрузите файлы **из этой папки** в корень репозитория (важно: `index.html` лежит в корне).
3. Откройте Settings → Pages → Build and deployment → Deploy from a branch, выберите `main` и `/ (root)` → Save.
4. Дождитесь публикации. Ссылка для проектного репозитория имеет вид: `https://USERNAME.github.io/navarro-operating-model/`.
5. Можно делиться прямыми ссылками на конкретные страницы и схемы — используются hash-маршруты `#/canvas/c01`, `#/doc/dxxx`, которые совместимы с GitHub Pages.

**Команды загрузки:**

```bash
git init
git add .
git commit -m "NAVARRO TRADE: publish operating model"
git branch -M main
git remote add origin https://github.com/USERNAME/navarro-operating-model.git
git push -u origin main
```

`USERNAME` замените на свой GitHub-логин. Если репозиторий уже существует, вместо `git init` и `git remote add` используйте его локальный clone.

## Обновление из Obsidian

После правок в Obsidian перегенерируйте содержимое сайта:

```bash
python3 scripts/build_site.py --vault "/путь/к/NAVARRO_TRADE_Obsidian_Vault"
git add site-data.js
git commit -m "Update organization model"
git push
```

Скрипт публикует Markdown-заметки и Canvas-схемы, **но исключает папку `09_Исходники` с фотографиями штатного расписания и ФИО сотрудников**. Папка `.obsidian` также не публикуется. Другие Markdown-материалы **содержат проектные функции, процессы, штатное число и бизнес-связи**, поэтому перед публикацией проверьте согласование/коммерческую тайну.

## Структура

- `index.html` — оболочка сайта.
- `assets/app.js` — навигация, масштабирование схем, поиск, связи.
- `assets/style.css` — адаптивный дизайн.
- `site-data.js` — сгенерированное содержимое Vault.
- `scripts/build_site.py` — конвертер Obsidian Markdown и Canvas.
- `.nojekyll` — GitHub Pages без обработки Jekyll.

Схемы отражают предложенную **TO-BE** модель, а не уже утверждённые локальные акты. Отделы с нулём выделенных ставок не означают фактическое наличие руководителей. Управляющий ИТ-проектами указан в прямом подчинении генеральному директору.
