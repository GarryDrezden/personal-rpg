# Сборка установщика Personal RPG

## Требования на машине разработчика

- Node.js + `npm install` (только для сборки фронта)
- Portable PHP в `server/runtime/php/` (php-cgi.exe)
- Portable nginx в `server/runtime/nginx/` (nginx.exe)
- [Inno Setup 6](https://jrsoftware.org/isinfo.php)

## Шаги

```powershell
cd E:\Работа\OSPanel\domains\personal-rpg
npm install
.\scripts\build-release.ps1
```

Откройте `installer/personal-rpg.iss` в Inno Setup → **Compile**.

Готовый файл: `release/PersonalRPG-Setup.exe`

## Распространение

- Запишите `PersonalRPG-Setup.exe` на флешку
- На целевом ПК: запуск установщика → выбор папки → установка
- Node.js на целевом ПК **не нужен**

## Порты

| Порт | Служба |
|------|--------|
| 8080 | Сайт |
| 9000 | PHP-CGI |
