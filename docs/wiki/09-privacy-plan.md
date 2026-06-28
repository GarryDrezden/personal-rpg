# Privacy Plan

## Current state

Репозиторий **может быть публичным**. Вся вики в `docs/` считается **публичной**.
GitHub Actions secrets (FTP) хранятся только в GitHub Settings, не в repo.

## Do not store in public docs / repo

Нельзя хранить:

- пароли, токены, API-ключи;
- SSH-ключи;
- реальные `.env` (только `.env.example` без секретов);
- приватные адреса серверов с credentials;
- личные фото пользователя;
- исходные фото тела/лица для генерации;
- приватные медицинские данные;
- raw private image references;
- FTP/hosting passwords в markdown.

## Allowed in public docs

Можно хранить:

- roadmap, architecture, game systems;
- general brandbook и stylized game art prompts;
- prompts без private details;
- approved public game assets (stylized 3D characters);
- anonymized asset descriptions;
- manifest entries без private photos;
- generic hosting notes (PHP 8.2, MySQL, без credentials);
- `.env.example` без реальных secrets;
- bcrypt password hashes в БД (не в repo).

## Future plan

1. Перевести репозиторий или документацию в **private**
2. Расширить закрытую часть wiki (raw refs, personal notes)
3. Приватные фото и raw references — **отдельно** от public repo

## Local private folders

Локально можно использовать:

```
private-assets/     ← raw photos, PSD, personal refs
docs/private/       ← closed notes
```

Обе папки в `.gitignore`. **Никогда не коммитить.**

## GitHub secrets

FTP и другие credentials — только **Repository secrets** в GitHub Settings.
Не дублировать в wiki, issues, commits.

## Asset generation privacy

- Референсы для AI — локально в `private-assets/`
- В repo — только результат генерации (stylized game art) или `_reference/` без личных фото
- `manifest.json` — notes без PII

## Medical disclaimer

Приложение не является медицинским продуктом. Wiki не содержит диагнозов, анализов, персональных health records.

## Checklist before commit

- [ ] Нет `.env` с реальными значениями
- [ ] Нет личных фото в `docs/` или `public/`
- [ ] Нет паролей/hosting credentials в markdown
- [ ] `private-assets/` и `docs/private/` не в staging
