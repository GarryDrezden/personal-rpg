# MySQL migrations

Run in phpMyAdmin, in order, against the production database.

| File | When |
|------|------|
| `001_create_accounts_tables.sql` | Fresh install |
| `002_user_data_revision_and_backups.sql` | Existing + fresh (after 001) |

Rules:

- Additive first. Do not drop columns in the same release as a frontend that still reads them.
- `002` may error on `Duplicate column name 'revision'` if it was already applied — that is safe to ignore.
- PHP also applies 002 on connect if `revision` / `user_data_backups` are missing (`ensureMysqlUserDataSchema`). phpMyAdmin is still the documented production path.
- Before any migration: phpMyAdmin export (SQL dump) of the database.
- After migration: deploy PHP, then frontend, then `GET /api/health.php`.

Repeat-safe where practical: `CREATE TABLE IF NOT EXISTS`. `ALTER TABLE ... ADD COLUMN` is one-shot.
