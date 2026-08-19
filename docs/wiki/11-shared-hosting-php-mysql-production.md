# Shared hosting: PHP + MySQL production

> Обновлено: 2026-08-02

## Почему не Node на production

Текущий хостинг — **shared hosting** (ispmanager, PHP 8.2, nginx + PHP, MySQL, FTP).

- Нет постоянного Node.js-процесса
- Deploy через GitHub Actions: `dist/` + `api/` + `.htaccess`
- Папка `backend/` — **VPS-only эксперимент**, в production **не используется**

Production backend:

```text
React (dist/)  →  /api/*  →  api/index.php  →  MySQL
```

---

## Production URL (current)

| URL | Status |
|-----|--------|
| `https://fit-rpg.ru` | Active site + HSTS |
| `http://fit-rpg.ru` | 301 → HTTPS |

### Critical: TLS must be a public CA cert

**2026-08-01 incident:** browser registration showed `Failed to fetch` while PHP API was healthy.

Root cause: **self-signed certificate** (`CN=fit-rpg.ru`, issuer = subject, chain `UntrustedRoot`).

What still worked:

- `GET /api/health.php` → `"ok": true` (PHP/MySQL/tables OK)
- `POST /api/auth/register` via `curl -k` → `201` + `Set-Cookie: pr_session=...; Secure; HttpOnly; SameSite=Lax`
- CORS for `Origin: https://fit-rpg.ru` already correct

What failed in browsers that do not trust the cert:

- `fetch('/api/auth/register')` → `TypeError: Failed to fetch`
- Cursor/automation browsers often hard-fail (`chrome-error://`)

**Fix on hosting (ispmanager):** issue a real certificate (Let’s Encrypt / panel SSL), not a self-signed one. Until then, UI may open from SW cache while API calls still fail TLS.

Check chain:

```text
# should NOT be issuer == subject self-signed
# should show Let's Encrypt (or another public CA)
```

After installing LE:

1. `https://fit-rpg.ru/api/health.php` opens in a fresh incognito window without cert warnings
2. Register from the UI works
3. `config.php`: `'allowed_origin' => 'https://fit-rpg.ru'`, `'secure_cookie' => true` (or omit for auto-detect)

---

## Чеклист после deploy

1. [ ] Deploy зелёный (GitHub Actions)
2. [ ] На FTP есть `api/`, `index.html`, `.htaccess`
3. [ ] На FTP **нет** `api/config/config.php` из Git (создаётся вручную)
4. [ ] В ispmanager создана БД (+ пользователь)
5. [ ] В phpMyAdmin выполнен SQL из `api/migrations/001_create_accounts_tables.sql`
5b. [ ] Для существующих БД: dump, затем `002_user_data_revision_and_backups.sql` (см. [`15-backup-and-recovery.md`](15-backup-and-recovery.md))
6. [ ] Создан `api/config/config.php` по шаблону
7. [ ] **Доверенный** HTTPS (не self-signed)
8. [ ] Открыть `https://fit-rpg.ru/api/health.php` — `"ok": true`
9. [ ] Регистрация на сайте работает из обычного браузера

### HTTPS cookie / CORS settings

```php
'auth' => [
  'cookie_name' => 'pr_session',
  'session_days' => 30,
  'secure_cookie' => true,
  'same_site' => 'Lax',
],
'app' => [
  'allowed_origin' => 'https://fit-rpg.ru',
  'debug' => false,
],
```

Проверка cookie после register: `Set-Cookie: pr_session=...; Path=/; Secure; HttpOnly; SameSite=Lax`.

### API smoke without browser trust

If local tooling rejects the cert, use:

```powershell
powershell -File scripts/smoke-production-api.ps1
```

(uses `curl -k`; verifies health → OPTIONS → register → me → data → logout → 401)

---

## 1. База данных в ispmanager

1. **Базы данных** → создать БД (если ещё нет)
2. Создать пользователя MySQL с доступом к этой БД
3. Запомнить: **логин**, **пароль**, **имя БД**

---

## 2. Миграция через phpMyAdmin

1. ispmanager → **phpMyAdmin**
2. Выбрать базу
3. **Сначала Export dump** (перед любой schema change)
4. Вкладка **SQL**
5. Fresh install: `001_create_accounts_tables.sql`, затем `002_user_data_revision_and_backups.sql`
6. Existing DB: только `002` (001 уже применена; не переигрывать 001)

Таблицы после 001: `users`, `user_profiles`, `user_settings`, `user_data`, `auth_sessions`.  
После 002: `user_data.revision`, `user_data_backups`.

Порядок production deploy: dump → 002 → `api/` → `dist/` → health → smoke. Rollback: см. [`15-backup-and-recovery.md`](15-backup-and-recovery.md).

---

## 3. Файл `api/config/config.php`

**Не коммитить в Git.** Создать на хостинге по `api/config/config.example.php`.

---

## 4. Проверка health

```text
https://fit-rpg.ru/api/health.php
```

Ожидается `"ok": true` (pdo_mysql, mysqlConnect, users/auth_sessions/user_data tables, api files).

---

## 5. Auth / data endpoints

| URL | Метод | Назначение |
|-----|-------|------------|
| `/api/health.php` | GET | Диагностика |
| `/api/auth/register` | POST | Регистрация |
| `/api/auth/login` | POST | Вход |
| `/api/auth/logout` | POST | Выход |
| `/api/auth/me` | GET | Текущий пользователь |
| `/api/data` | GET | Профиль + settings + user_data |
| `/api/data/:type` | PUT | Persist typed payload |
| `/api/profile` | PATCH | Profile |
| `/api/settings` | PATCH | User settings row |

Frontend uses **relative** `/api/...` + `credentials: 'include'`. Do not point `VITE_API_BASE_URL` at localhost or `http://` when UI is HTTPS.

---

## 6. Routing

### Apache `.htaccess` (also deployed)

```apache
RewriteEngine On
RewriteCond %{HTTP:Authorization} .
RewriteRule ^api/.* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteRule ^api/health\.php$ api/health.php [L]
RewriteRule ^api(/.*)?$ api/index.php [L,QSA]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

`/api/*` must **not** fall into SPA `index.html`.

### nginx (current production front)

Production answers with `Server: nginx`. Panel/nginx must already map `/api` to PHP (`api/index.php` or equivalent). If `/api/auth/me` returns HTML, fix nginx `try_files` / PHP location — not React routes.

Verified working path shape:

```text
/api/auth/register  → PHP JSON
/api/health.php     → PHP JSON
```

---

## 7. CORS / headers

Same-origin (`https://fit-rpg.ru` → `/api`) does not need CORS for normal browser calls.

If `Origin` is sent, API echoes:

- `Access-Control-Allow-Origin: https://fit-rpg.ru` (exact match to `allowed_origin`)
- `Access-Control-Allow-Credentials: true`
- methods/headers for preflight
- OPTIONS → `204`

Never use `*` with credentials.

---

## 8. Типичные ошибки

### Failed to fetch on register (HTTPS open, API “dead”)

1. Self-signed / untrusted TLS chain ← **most common after enabling HTTPS**
2. SW serving cached shell while network API fails TLS (API routes are NetworkOnly now)
3. Mixed content if UI is HTTPS but API base is `http://`

### 401 после login

- Cookie not stored (Secure on HTTP, wrong Path/domain)
- `allowed_origin` mismatch (only matters for cross-origin)

### 503 API configuration error

- Missing `api/config/config.php` / bad DB credentials

### 500 после register

- Migration not applied

---

## 9. Deploy workflow

GitHub Actions builds `deploy-bundle/`:

- `dist/` → site root
- `api/` → `api/`
- `.htaccess`

**Not deployed:** `backend/`, `src/`, `api/config/config.php`, `.env`

---

## 10. Rollback

- **Frontend:** redeploy previous `dist/`. Old SPA omits `revision` (last-write-wins) and still loads current data.
- **PHP:** redeploy previous `api/`. Leave `revision` and `user_data_backups` in place (additive).
- **DB:** restore from the phpMyAdmin dump taken before `002`. Do not drop columns in the same release.

See [`15-backup-and-recovery.md`](15-backup-and-recovery.md).

---

## 11. Node backend (`backend/`)

Оставлен для будущего VPS. **Не требуется** для shared hosting.

См. [`backend/README.md`](../../backend/README.md)
