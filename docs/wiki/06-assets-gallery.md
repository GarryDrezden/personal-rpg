# Assets Gallery

## Зачем

Галерея — единый реестр игровых ассетов с **статусами**, **темами** и **заметками**.
Cursor и ChatGPT читают manifest, чтобы понимать, что approved, что candidate, что rejected.

## Файлы

| Файл | Назначение |
|------|------------|
| [`../assets/gallery.md`](../assets/gallery.md) | Описание статусов и тем |
| [`../assets/manifest.json`](../assets/manifest.json) | Машиночитаемый реестр |
| `public/game-assets/` | Фактические PNG на сайте |
| `src/game/assetPaths.ts` | Runtime paths + cache version |

## Статусы

| Статус | Значение |
|--------|----------|
| `draft` | Черновик, не показывать в prod |
| `candidate` | Кандидат на утверждение |
| `approved` | Утверждено, используется в UI |
| `rejected` | Отклонено, не использовать |
| `archived` | Архив, сохранено для истории |

## Темы

| Theme | Использование |
|-------|---------------|
| `darkFantasy` | Основная RPG-линейка |
| `cozy` | Светлая / летняя / уютная |
| `universal` | Спутники, мобы, UI-иконки |

## Workflow

```
Generate → candidate in manifest
         → review in gallery
         → approved → copy to public/game-assets/
         → bump GAME_ASSET_VERSION
         → deploy
```

## Privacy

Не добавлять в manifest приватные фото или raw references пользователя.
Референсы в repo — только anonymized game art (`_reference/` без личных фото).

См. [`09-privacy-plan.md`](09-privacy-plan.md).
