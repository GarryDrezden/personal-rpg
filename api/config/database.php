<?php

declare(strict_types=1);

function appConfig(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $path = __DIR__ . '/config.php';
    if (!is_file($path)) {
        throw new RuntimeException(
            'Missing api/config/config.php — copy config.example.php on the server.',
        );
    }

    $config = require $path;
    if (!is_array($config)) {
        throw new RuntimeException('Invalid api/config/config.php');
    }

    return $config;
}

function mysqlPdo(): PDO
{
    static $pdo = null;
    if (!($pdo instanceof PDO)) {
        $cfg = appConfig()['database'] ?? [];
        $host = $cfg['host'] ?? 'localhost';
        $name = $cfg['name'] ?? '';
        $user = $cfg['user'] ?? '';
        $pass = $cfg['password'] ?? '';
        $charset = $cfg['charset'] ?? 'utf8mb4';

        if ($name === '' || $user === '') {
            throw new RuntimeException('Database name/user not configured');
        }

        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $host, $name, $charset);
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }

    ensureMysqlUserDataSchema($pdo);

    return $pdo;
}

/**
 * Additive 002 schema: revision column + user_data_backups.
 * Safe to call on every connect; no-ops when already applied.
 */
function ensureMysqlUserDataSchema(PDO $pdo): void
{
    static $ensured = false;
    if ($ensured) {
        return;
    }

    $hasRevision = false;
    try {
        $col = $pdo->query("SHOW COLUMNS FROM user_data LIKE 'revision'")->fetch();
        if (!$col) {
            $pdo->exec(
                'ALTER TABLE user_data ADD COLUMN revision INT UNSIGNED NOT NULL DEFAULT 1 AFTER payload',
            );
        }
        $hasRevision = true;
    } catch (Throwable) {
        try {
            $hasRevision = (bool) $pdo->query("SHOW COLUMNS FROM user_data LIKE 'revision'")->fetch();
        } catch (Throwable) {
            $hasRevision = false;
        }
    }

    $hasBackups = false;
    try {
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS user_data_backups (
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
        );
        $hasBackups = true;
    } catch (Throwable) {
        // Snapshots stay disabled until this table exists.
    }

    $ensured = $hasRevision && $hasBackups;
}
