# SHRAIBER

Сайт ліцею з публічною сторінкою, вбудованою адмінпанеллю та простим Node.js сервером без фреймворку.

## Запуск

1. Встановити залежності:
   `npm install`
2. Створити `.env` на основі [`.env.example`](/C:/Users/vgkog/PycharmProjects/SHRAIBER/.env.example)
3. Для розробки фронтенду:
   `npm run dev`
4. Для production-сервера:
   `npm run build`
   `npm start`

## Структура

- `index.html`, `styles.css`, `script.js` - публічний сайт
- `admin/index.html`, `admin/admin.css`, `admin/admin.js` - адмінпанель
- `server.js` - HTTP-сервер, API, завантаження зображень, форма заявок
- `content.json` - контент для CMS
- `contact-messages.json` - вхідні заявки із сайту, створюється автоматично
- `dist/` - production build Vite

## API

- `POST /api/login` - вхід в адмінпанель
- `GET /api/content` - отримати контент
- `POST /api/content` - зберегти контент
- `POST /api/upload` - завантажити зображення
- `POST /api/contact` - надіслати заявку із сайту
- `GET /api/inquiries` - список заявок в адмінпанелі

## Примітки

- Сервер потребує `ADMIN_PASSWORD` у середовищі.
- Адмінпанель працює через bearer-token з TTL.
- Розмір завантаження зображення обмежений до 5 MB.
- Файл `contact-messages.json` не повинен комітитись у репозиторій.
