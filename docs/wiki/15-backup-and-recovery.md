# Backup and recovery

> User-data export/import and hosting backup. Not legal advice.

## User backup (Settings → Данные)

Export downloads a JSON file:

```json
{
  "format": "personal-rpg-backup",
  "backupFormatVersion": 1,
  "dataSchemaVersion": 1,
  "exportedAt": "2026-08-19T00:00:00.000Z",
  "data": { }
}
```

The file includes game/application data (days, measurements, settings, sidecars). It does **not** include password, session, or account id.

Restore: choose file → preview → confirm. The app first downloads the current copy (`personal-rpg-before-restore-*.json`), then replaces data in one API transaction.

## Hosting (phpMyAdmin)

Before any schema migration or risky deploy:

1. ispmanager → phpMyAdmin → Export (SQL) the database.
2. Keep the dump off the web root.
3. Run `api/migrations/00N_*.sql` in order (`api/migrations/README.md`).
4. Deploy PHP, then frontend.
5. `GET /api/health.php` → `"ok": true`. If `userDataRevision` is false, PHP will add the column on the next API request after the auto-ensure deploy (or run `002` in phpMyAdmin).
6. Smoke: `scripts/smoke-production-api.ps1` (creates a **temporary** user; delete it in phpMyAdmin if needed).

## Deploy order for this pass

1. DB dump  
2. `002_user_data_revision_and_backups.sql`  
3. Deploy `api/`  
4. Deploy `dist/`  
5. Health + smoke on a new test login, not a real account  

## Rollback

- **Frontend only:** redeploy previous `dist/`. Old SPA omits `revision` (last-write-wins) and still loads v1 data.
- **PHP only:** redeploy previous `api/`. `revision` column and `user_data_backups` can stay (additive).
- **DB:** do not drop `revision` or `user_data_backups` in the same release. Restore from the phpMyAdmin dump if a migration went wrong.

Migrations must stay additive. Destructive transforms need a dump first.

## Manual DB backup

phpMyAdmin → Export → SQL. No public `/api/tools` dump endpoint.

## Failed load

The app shows «Не удалось загрузить данные» with Retry. It does not treat a network error as an empty new account.
