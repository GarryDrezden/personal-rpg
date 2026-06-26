# Автозапуск при загрузке ПК (без терминалов)

NSSM не нужен. Используется **Планировщик задач Windows**.

## Что нужно заранее

1. **PHP** — уже в `server/runtime/php/` (у вас настроено)
2. **nginx** — скачать и распаковать (см. ниже)
3. **Сборка фронта:** `npm run build` → папка `dist/`

## Шаг 1. Скачать nginx

1. https://nginx.org/en/download.html
2. Скачайте **Stable version** → Windows zip
3. Распакуйте в:

```
E:\Работа\OSPanel\domains\personal-rpg\server\runtime\nginx\
```

Должен появиться файл:

```
server\runtime\nginx\nginx.exe
```

Внутри также будут папки `conf\`, `logs\` и т.д.

## Шаг 2. Собрать фронт

```powershell
cd E:\Работа\OSPanel\domains\personal-rpg
npm run build
```

## Шаг 3. Проверить ручной запуск

```powershell
.\scripts\start-all.ps1
```

Откройте http://127.0.0.1:8080 — должен открыться сайт (как на localhost:5173, но без npm).

Остановка:

```powershell
.\scripts\stop-all.ps1
```

## Шаг 4. Включить автозапуск

**Проще всего:** двойной клик по `install-autostart.bat` в корне проекта (запросит права администратора).

Или PowerShell **от имени администратора**:

```powershell
cd E:\Работа\OSPanel\domains\personal-rpg
.\scripts\install-autostart.ps1
```

Скрипт:
- создаёт задачу `PersonalRpgAutostart` в Планировщике (запуск через `cmd.exe` + `PersonalRPG-Autostart.bat`, задержка 30 сек после входа)
- добавляет ярлык **Personal RPG** в папку «Автозагрузка» (тихий запуск через VBS)
- пишет лог: `server\runtime\autostart-install.log`

Удалить автозапуск: `uninstall-autostart.bat` или `.\scripts\uninstall-autostart.ps1`

## Шаг 5. Перезагрузка

Перезайдите в Windows или перезагрузите ПК → откройте:

```
http://127.0.0.1:8080
```

Терминалы не нужны.

## Опционально: браузер при входе

```powershell
.\scripts\open-on-login.ps1
```

## После изменения кода UI

```powershell
npm run build
```

Перезапуск nginx не обязателен. Если API/PHP меняли — перезайдите в Windows или:

```powershell
.\scripts\stop-all.ps1
.\scripts\start-all.ps1
```

## Удалить автозапуск

Двойной клик: `uninstall-autostart.bat`

Или PowerShell:

```powershell
Unregister-ScheduledTask -TaskName "PersonalRpgAutostart" -Confirm:$false
```

## Порты

| Порт | Служба |
|------|--------|
| 8080 | Сайт (nginx) |
| 9000 | PHP-CGI (API) |

## Кириллица в пути (`E:\Работа\...`)

nginx не умеет пути с русскими буквами. Скрипт `start-all.ps1` автоматически создаёт диск **`P:`** → папка проекта. Это нормально.

## Проблемы

| Симптом | Решение |
|---------|---------|
| 8080 не открывается | `.\scripts\start-all.ps1` вручную; лог автозапуска: `server\runtime\autostart.log` |
| Автозапуск не сработал | Переустановите `install-autostart.bat`; смотрите `server\runtime\autostart-install.log` |
| Пустая страница | `npm run build` |
| API 502 | PHP-CGI не запущен — проверить `php-cgi.exe` |
| Порт занят | `.\scripts\stop-all.ps1` или закрыть другую программу на 8080 |
