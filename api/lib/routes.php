<?php

declare(strict_types=1);

function isAccountsApiRoute(string $route): bool
{
    if (str_starts_with($route, '/auth/')) {
        return true;
    }
    if ($route === '/data' || str_starts_with($route, '/data/')) {
        return true;
    }
    if ($route === '/profile' || $route === '/settings') {
        return true;
    }
    return false;
}

/**
 * Legacy unauthenticated SQLite routes (dev-only).
 * Production with MySQL config.php is off unless app.legacy_sqlite_api = true.
 */
function isLegacySqliteApiEnabled(): bool
{
    $configPath = dirname(__DIR__) . '/config/config.php';
    if (!is_file($configPath)) {
        return true;
    }
    $cfg = require $configPath;
    if (is_array($cfg) && array_key_exists('legacy_sqlite_api', $cfg['app'] ?? [])) {
        return (bool) $cfg['app']['legacy_sqlite_api'];
    }
    return false;
}
