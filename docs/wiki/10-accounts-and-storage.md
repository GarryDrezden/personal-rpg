# Accounts & Storage (Sprint 1)

> Обновлено: 2026-06-06

## Production backend

**Shared hosting:** PHP API в `api/` + MySQL + cookie sessions.

**Не production:** Node `backend/` (VPS-only).

Пошаговая настройка хостинга: [`11-shared-hosting-php-mysql-production.md`](11-shared-hosting-php-mysql-production.md)

---

## Обзор

---

## Регистрация и вход

| Маршрут | Метод | Описание |
|---------|-------|----------|
| `/api/auth/register` | POST | `{ login, password }` → user + profile + settings + cookie |
| `/api/auth/login` | POST | `{ login, password }` → user + profile + settings + cookie |
| `/api/auth/logout` | POST | Очищает сессию и cookie |
| `/api/auth/me` | GET | Текущий пользователь или 401 |

### Валидация

- **Login:** 3–40 символов, `[a-zA-Z0-9_\-.@]`
- **Password:** 6–128 символов
- **Profile weights:** положительные; `targetWeight < startWeight` при обоих заданных

### Пароль

- Хранится только `passwordHash` (bcrypt, 12 rounds)
- Hash **не** возвращается на frontend
- Пароли не логируются

### Сессия

- HttpOnly cookie `pr_session` с токеном сессии
- Токен хранится в таблице `AuthSession`
- Frontend: `fetch(..., { credentials: 'include' })`

---

## Таблицы MySQL

### `User`

`id`, `login` (unique), `passwordHash`, `createdAt`, `updatedAt`

### `UserProfile`

`displayName`, `heroGender`, `startWeight`, `targetWeight`, `height` — nullable до onboarding (Sprint 2)

### `UserSettings`

| Поле | Default |
|------|---------|
| `themeId` | `darkFantasy` |
| `nutritionTrackingMode` | `simple` |
| `activeCompanionId` | `golden_chinchilla_cat` |
| `dailyCalorieLimit` | null |

### `UserData`

Гибридное JSON-хранилище: unique `(userId, type)`.

Типы:

```
dailyEntries, measurements, achievements, coinTransactions, rewards,
momentumHistory, freedomHistory, bodyAbilities, journeyState,
artifactUnlocks, defeatedBosses, dailyMobs, customSettingsBackup,
legacyImport, bankDeposits
```

Полные игровые `AppSettings` сохраняются в `customSettingsBackup`.

### `AuthSession`

`token`, `userId`, `expiresAt` (30 дней)

---

## Data API

| Маршрут | Описание |
|---------|----------|
| `GET /api/data` | profile + settings + все `user_data` |
| `GET /api/data/:type` | один тип |
| `PUT /api/data/:type` | `{ payload }` — только для текущего userId |
| `PATCH /api/profile` | displayName, heroGender, weights, height |
| `PATCH /api/settings` | themeId, nutritionTrackingMode, dailyCalorieLimit, activeCompanionId |

---

## Frontend

| Файл | Роль |
|------|------|
| `src/api/httpClient.ts` | fetch + credentials |
| `src/api/authApi.ts` | auth endpoints |
| `src/api/dataApi.ts` | data endpoints |
| `src/auth/AuthProvider.tsx` | user/profile/settings, login/logout |
| `src/auth/ProtectedRoute.tsx` | защита игровых роутов |
| `src/pages/LoginPage.tsx` | вход |
| `src/pages/RegisterPage.tsx` | регистрация |
| `src/storage/storageClient.ts` | remote vs legacy repository |
| `src/storage/remoteStorageClient.ts` | DataRepository → MySQL |
| `src/storage/legacyStorageClient.ts` | импорт localStorage |
| `src/components/auth/LegacyImportBanner.tsx` | UI импорта |

### Защищённые роуты

Все игровые страницы (`/`, `/today`, `/week`, `/settings`, …) — только после входа.

Открытые: `/login`, `/register`.

---

## Импорт legacy данных

### A — SQLite (PHP)

```bash
cd backend
npm run import:legacy -- --login YOUR_LOGIN
# опционально: --sqlite ../data/personal-rpg.sqlite
```

Переносит: daily entries, measurements, rewards, bank deposits, app settings.

### B — localStorage (браузер)

После входа баннер «Найдены данные на этом устройстве» → **Перенести**.

Ключи: achievements, coins, momentum, freedom/body sidecars, theme, companion.

Флаг: `personal-rpg-legacy-migrated` (старые данные не удаляются).

---

## Environment variables

### Backend (`backend/.env`)

```env
DATABASE_URL="mysql://user:password@localhost:3306/personal_rpg"
AUTH_SECRET="change_me"
COOKIE_SECRET="change_me"
CLIENT_ORIGIN="http://localhost:5173"
PORT=3001
NODE_ENV="development"
```

### Frontend (`.env`)

```env
VITE_API_BASE_URL=""
```

Пустое значение = same-origin через Vite proxy `/api` → `:3001`.

---

## Локальный запуск

### 1. MySQL

```sql
CREATE DATABASE personal_rpg CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'personal_rpg'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL ON personal_rpg.* TO 'personal_rpg'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend

```bash
cp backend/.env.example backend/.env
# отредактировать DATABASE_URL и secrets
cd backend
npm install
npm run db:generate
npm run db:migrate   # или db:push для dev
npm run dev
```

### 3. Frontend

```bash
npm install
npm run dev
```

Открыть `http://localhost:5173` → регистрация → игра.

---

## Autosave

- Debounce ~800ms для частых изменений (`dailyEntries`, …)
- Индикатор: «Сохраняем…» / «Сохранено» / «Ошибка сохранения»
- Sidecar-данные (achievements, coins, momentum) пока синхронизируются через localStorage + TODO для полного remote sync

---

## Production: где хранить `.env` и что писать

**Правило:** реальные пароли и секреты **никогда не в Git**. В репозитории только `backend/.env.example` и `.env.example`.

На сервере создаёшь файл **`backend/.env`** вручную (SSH/FTP) или задаёшь те же переменные в панели хостинга.

### Пример для БД `vh388565_rpg` (shared hosting)

В панели хостинга (MySQL) обычно есть:

- имя БД: `vh388565_rpg`
- пользователь: `vh388565_rpg` или `vh388565_user` (смотри в панели)
- пароль: тот, что задал при создании пользователя
- хост: почти всегда `localhost`

Файл **`backend/.env`** на сервере:

```env
DATABASE_URL="mysql://vh388565_user:ТВОЙ_ПАРОЛЬ@localhost:3306/vh388565_rpg"
AUTH_SECRET="a1b2c3d4e5f6...64_символа_hex"
COOKIE_SECRET="f6e5d4c3b2a1...другая_строка"
CLIENT_ORIGIN="https://твой-домен.ru"
PORT=3001
NODE_ENV="production"
```

Если в пароле есть `@`, `#`, `%` — закодируй их для URL (`@` → `%40`).

Секреты сгенерировать на своём ПК:

```bash
openssl rand -hex 32
```

(два раза — для `AUTH_SECRET` и `COOKIE_SECRET`)

---

### Вариант A — VPS + systemd (рекомендуется для Node)

Node backend **не работает** на обычном shared FTP-хостинге как PHP. Нужен VPS (Timeweb Cloud, Selectel, Hetzner и т.д.) или PaaS.

**1. Залить код на VPS** (git clone или rsync), **без** `.env`.

**2. На VPS создать файл** `/var/www/personal-rpg/backend/.env` с содержимым выше.

**3. Установить и собрать:**

```bash
cd /var/www/personal-rpg/backend
npm ci
npm run db:generate
npm run db:migrate deploy   # production-миграции (см. ниже)
npm run build
```

**4. Создать systemd-сервис** `/etc/systemd/system/personal-rpg-api.service`:

```ini
[Unit]
Description=Personal RPG API
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/personal-rpg/backend
# Можно не дублировать env, если всё уже в backend/.env — dotenv подхватит при старте
EnvironmentFile=/var/www/personal-rpg/backend/.env
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

**5. Запустить:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable personal-rpg-api
sudo systemctl start personal-rpg-api
sudo systemctl status personal-rpg-api
```

**6. Nginx** проксирует API (фрагмент):

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Cookie $http_cookie;
}
```

Frontend (`dist/`) — статика на том же домене; тогда `VITE_API_BASE_URL=""` при сборке (same-origin).

---

### Вариант B — Docker Compose

Файл **`docker-compose.yml`** (в корне проекта, можно добавить позже):

```yaml
services:
  api:
    build: ./backend
    ports:
      - "3001:3001"
    env_file:
      - ./backend/.env
    depends_on:
      - db
  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: vh388565_rpg
      MYSQL_USER: rpg
      MYSQL_PASSWORD: secret
      MYSQL_ROOT_PASSWORD: rootsecret
    volumes:
      - mysql_data:/var/lib/mysql
volumes:
  mysql_data:
```

Секреты — только в **`backend/.env`** или в `.env` рядом с compose (тоже в `.gitignore`).

Запуск:

```bash
docker compose up -d
docker compose exec api npm run db:migrate deploy
```

---

### Вариант C — только shared hosting (FTP, без VPS)

Сейчас CI деплоит **static + PHP**. MySQL `vh388565_rpg` на хостинге **уже можно использовать**, но Node API туда **напрямую не поставить** (нет долгоживущего Node-процесса).

Варианты:

1. **VPS для API** + MySQL на shared (если панель разрешает remote MySQL) — редко на дешёвых тарифах.
2. **VPS целиком** — и сайт, и API, и MySQL на одном VPS.
3. **PaaS** (Railway, Render) — env vars в веб-панели сервиса, без файла `.env`.

Пока Node не на production — игра с auth работает **локально** (`npm run dev` + `npm run dev:server`).

---

## Миграции БД

### Первый раз (dev / локально)

```bash
cd backend
copy .env.example .env    # Windows
# отредактировать DATABASE_URL под vh388565_rpg или local DB
npm install
npm run db:generate
npm run db:migrate
```

Prisma создаст таблицы в `vh388565_rpg`.

### Production (на сервере, после деплоя кода)

```bash
cd backend
npm run db:migrate deploy
```

`deploy` — только применяет уже существующие миграции из `prisma/migrations/`, без интерактива.

### Если миграции ещё не нужны — быстрый dev

```bash
npm run db:push
```

---

## Production note

Текущий FTP deploy отдаёт PHP + static frontend. Node backend для production — отдельный VPS/PaaS + `backend/.env` на сервере (см. выше).
