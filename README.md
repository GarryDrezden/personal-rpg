# Личная RPG

Локальный трекер прогресса в стиле личной RPG: очки, уровни, привычки, замеры и награды.

## Стек

- **Frontend:** React + TypeScript + Vite + Tailwind
- **Backend:** PHP 8 + SQLite (`data/personal-rpg.sqlite`)
- **Сервер:** nginx + PHP-CGI (автозапуск через Планировщик задач Windows)

## Быстрый старт (разработка)

```powershell
cd E:\Работа\OSPanel\domains\personal-rpg
npm install
npm run build

# Терминал 1 — API (нужен PHP)
.\scripts\dev-api.ps1

# Терминал 2 — фронт с hot reload
npm run dev
```

Откройте http://localhost:5173 (прокси `/api` → `:8080`).

## Продакшен (автозапуск с ПК, без терминалов)

1. PHP в `server/runtime/php/`
2. Скачайте **nginx** → `server/runtime/nginx/` — см. [server/AUTOSTART.md](server/AUTOSTART.md)
3. `npm run build`
4. Проверка: `.\scripts\start-all.ps1` → http://127.0.0.1:8080
5. PowerShell **от администратора**: `.\scripts\install-autostart.ps1`

Опционально: `.\scripts\open-on-login.ps1` — открыть браузер при входе.

## Экраны

| Путь | Описание |
|------|----------|
| `/` | Dashboard — очки, уровень, серии, RPG-карточки |
| `/today` | Ежедневный ввод |
| `/week` | Недельная сводка и бонусы |
| `/measurements` | Замеры и графики |
| `/rewards` | Магазин наград |
| `/settings` | Цели, баллы, бэкап БД |

## Бэкап

- Настройки → «Скачать .sqlite»
- Или скопировать `data/personal-rpg.sqlite`
