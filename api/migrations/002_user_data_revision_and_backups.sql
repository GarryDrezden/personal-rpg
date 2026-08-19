-- Personal RPG — revision + server snapshots (additive)
-- Run in phpMyAdmin AFTER 001_create_accounts_tables.sql
-- If a statement fails with "Duplicate column/key", that part is already applied.

ALTER TABLE user_data
  ADD COLUMN revision INT UNSIGNED NOT NULL DEFAULT 1 AFTER payload;

CREATE TABLE IF NOT EXISTS user_data_backups (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  revision INT UNSIGNED NOT NULL DEFAULT 0,
  reason VARCHAR(40) NOT NULL,
  payload JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_data_backups_user_created (user_id, created_at),
  CONSTRAINT fk_user_data_backups_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
