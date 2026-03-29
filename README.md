# SHRAIBER

Сайт лицея с публичной страницей, встроенной админкой и простым Node.js сервером без фреймворка.

## Запуск

1. Установить зависимости:
   `npm install`
2. Создать `.env` на основе [`.env.example`](C:/Users/vgkog/PycharmProjects/SHRAIBER/.env.example)
3. Для разработки фронтенда:
   `npm run dev`
4. Для production-сервера:
   `npm run build`
   `npm start`

## Структура

- `index.html`, `styles.css`, `script.js` — публичный сайт
- `admin/index.html`, `admin/admin.css`, `admin/admin.js` — админка
- `server.js` — HTTP-сервер, API, загрузка изображений, форма заявок
- `content.json` — контент для CMS
- `contact-messages.json` — входящие заявки с сайта, создается автоматически
- `dist/` — production build Vite

## API

- `POST /api/login` — вход в админку
- `GET /api/content` — получить контент
- `POST /api/content` — сохранить контент
- `POST /api/upload` — загрузить изображение
- `POST /api/contact` — отправить заявку с сайта
- `GET /api/inquiries` — список заявок в админке

## Замечания

- Сервер требует `ADMIN_PASSWORD` в окружении.
- Админка работает по bearer-token с TTL.
- Размер загрузки изображения ограничен 5 MB.
- Файл `contact-messages.json` не должен коммититься в репозиторий.
