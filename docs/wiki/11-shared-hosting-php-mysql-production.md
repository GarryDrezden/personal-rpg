# Shared hosting: PHP + MySQL production

> Обновлено: 2026-06-06

## Почему не Node на production

Текущий хостинг — **shared hosting** (ispmanager, PHP 8.2 LSAPI, MySQL, FTP).

- Нет постоянного Node.js-процесса
- Deploy через GitHub Actions: `dist/` + `api/` + `.htaccess`
- Папка `backend/` — **VPS-only эксперимент**, в production **не используется**

Production backend:

```text
React (dist/)  →  /api/*  →  api/index.php  →  MySQL
```

---

## Чеклист после deploy

1. [ ] Deploy зелёный (GitHub Actions)
2. [ ] На FTP есть `api/`, `index.html`, `.htaccess`
3. [ ] На FTP **нет** `api/config/config.php` из Git (создаётся вручную)
4. [ ] В ispmanager создана БД `vh388565_rpg` (+ пользователь)
5. [ ] В phpMyAdmin выполнен SQL из `api/migrations/001_create_accounts_tables.sql`
6. [ ] Создан `api/config/config.php` по шаблону
7. [ ] Открыть `https://fit-rpg.ru/api/health.php` — `"ok": true`
8. [ ] Регистрация на сайте работает

---

## 1. База данных в ispmanager

1. **Базы данных** → создать БД (если ещё нет):
   - Имя: `vh388565_rpg`
2. Создать пользователя MySQL с доступом к этой БД
3. Запомнить: **логин**, **пароль**, **имя БД**

---

## 2. Миграция через phpMyAdmin

1. ispmanager → **phpMyAdmin**
2. Выбрать базу `vh388565_rpg`
3. Вкладка **SQL**
4. Скопировать содержимое файла:

   `api/migrations/001_create_accounts_tables.sql`

5. **Выполнить**

Должны появиться таблицы: `users`, `user_profiles`, `user_settings`, `user_data`, `auth_sessions`.

---

## 3. Файл `api/config/config.php`

**Не коммитить в Git.** Создать на хостинге через File Manager или FTP.

Скопировать из `api/config/config.example.php` и подставить реальные данные:

```php
<?php

return [
    'database' => [
        'host' => 'localhost',
        'name' => 'vh388565_rpg',
        'user' => 'vh388565_user',
        'password' => 'REAL_PASSWORD_FROM_PANEL',
        'charset' => 'utf8mb4',
    ],
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
];
```

Путь на сервере: `api/config/config.php` (рядом с `config.example.php`).

---

## 4. Проверка health

Открыть в браузере:

```text
https://fit-rpg.ru/api/health.php
```

Ожидаемый результат:

```json
{
  "ok": true,
  "mysqlConfigExists": true,
  "mysqlConnect": true,
  "usersTable": true
}
```

---

## 5. Auth endpoints

| URL | Метод | Назначение |
|-----|-------|------------|
| `/api/auth/register` | POST | Регистрация |
| `/api/auth/login` | POST | Вход |
| `/api/auth/logout` | POST | Выход |
| `/api/auth/me` | GET | Текущий пользователь |

Cookie: `pr_session` (httpOnly, Secure на HTTPS).

---

## 6. Routing (.htaccess)

Корневой `.htaccess`:

```apache
RewriteEngine On
RewriteRule ^api(/.*)?$ api/index.php [L,QSA]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

Если `/api/auth/me` отдаёт HTML вместо JSON — API уходит в React. Проверь `.htaccess` на FTP.

---

## 7. Типичные ошибки

### 401 на всех страницах после login

- Cookie не ставится → проверь HTTPS и `secure_cookie => true`
- Неверный домен в `allowed_origin`

### 503 API configuration error

- Нет файла `api/config/config.php`
- Ошибка в DATABASE_URL / credentials

### 500 после register

- Не выполнена SQL migration
- Нет таблицы `users`

### CORS

На одном домене CORS не нужен. Frontend использует `/api` + `credentials: 'include'`.

### Белый экран

- Ошибка в frontend build — смотри консоль браузера
- PHP fatal — временно `'debug' => true` в config (только для диагностики, потом выключить)

---

## 8. Deploy workflow

GitHub Actions собирает `deploy-bundle/`:

- `dist/` → корень сайта
- `api/` → `api/`
- `.htaccess`

**Не деплоится:** `backend/`, `src/`, `api/config/config.php`, `.env`

После push в `main` — workflow вручную или auto (если настроен push trigger).

---

## 9. Импорт данных

**Основной путь:** баннер localStorage после входа → PUT `/api/data/:type`.

SQLite import — опционально, не нужен если данных на prod не было.

---

## 10. Node backend (`backend/`)

Оставлен для будущего VPS. **Не требуется** для текущего shared hosting.

См. [`backend/README.md`](../../backend/README.md)
