<?php

/**
 * Copy to config.php on the server (not committed to Git).
 */
return [
    'database' => [
        'host' => 'localhost',
        'name' => 'vh388565_rpg',
        'user' => 'vh388565_user',
        'password' => 'CHANGE_ME',
        'charset' => 'utf8mb4',
    ],
    'auth' => [
        'cookie_name' => 'pr_session',
        'session_days' => 30,
        // HTTPS production: true (or omit — auto-detect via HTTPS / X-Forwarded-Proto).
        'secure_cookie' => true,
        'same_site' => 'Lax',
    ],
    'app' => [
        // Must match the browser Origin exactly (scheme + host). No trailing slash.
        'allowed_origin' => 'https://fit-rpg.ru',
        'debug' => false,
        // Unauthenticated SQLite routes in index.php. Keep false on production MySQL.
        'legacy_sqlite_api' => false,
    ],
];
