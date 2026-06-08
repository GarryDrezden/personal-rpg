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

Без PowerShell вручную: двойной клик `PersonalRPG.bat` (запуск) или `PersonalRPG-Stop.bat` (остановка).

## Установщик для распространения (флешка / другой ПК)

1. На машине разработчика: PHP + nginx в `server/runtime/`, затем `.\scripts\build-release.ps1`
2. Соберите `installer/personal-rpg.iss` в [Inno Setup](https://jrsoftware.org/isinfo.php)
3. Получите `release/PersonalRPG-Setup.exe` — его можно записать на флешку

Установщик:
- выбор папки (как у обычных Windows-программ)
- вшитые PHP, nginx и готовый фронт (`dist/`)
- опции: ярлык на рабоплеске, автозапуск при входе, открыть сайт
- **Node.js на целевом ПК не нужен**

Подробнее: [installer/README.md](installer/README.md)

### Требования на целевом ПК

- Windows 10+
- Свободные порты **8080** (сайт) и **9000** (PHP-CGI)
- Для автозапуска через Планировщик — установка **от имени администратора**

### Персонаж прогресса

В **Настройки** можно выбрать пол персонажа (мужской / женский). Картинки стадий: `public/images/weight/male/` и `female/`.

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
