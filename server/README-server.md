# Настройка nginx + PHP (автозапуск)

## Что скачать в `server/runtime/`

1. **nginx** — https://nginx.org/en/download.html (Windows zip)
   - Распаковать в `server/runtime/nginx/`

2. **PHP** — https://windows.php.net/download/ (VS16 x64 Thread Safe zip)
   - Распаковать в `server/runtime/php/`
   - Скопировать `php.ini-production` → `php.ini`
   - В `php.ini` раскомментировать: `extension=pdo_sqlite`, `extension=sqlite3`

3. **NSSM** — https://nssm.cc/download
   - Распаковать `nssm.exe` в `server/runtime/nssm/`

## Порты

- Сайт: `http://127.0.0.1:8080`
- PHP-CGI: `127.0.0.1:9000`

## Установка служб

Запустите PowerShell **от администратора**:

```powershell
cd E:\Работа\OSPanel\domains\personal-rpg
.\scripts\install-services.ps1
```

## Сборка фронта

```powershell
npm run build
```

## Опционально: открыть браузер при входе

```powershell
.\scripts\open-on-login.ps1
```

## Доступ с телефона в LAN

В `server/nginx.conf` замените `listen 8080` на `listen 8080` и `server_name localhost` — nginx по умолчанию слушает все интерфейсы. Откройте `http://<IP-ПК>:8080`.
