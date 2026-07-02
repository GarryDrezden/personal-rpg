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
        // On HTTPS production: omit or set true; auto-detect also checks HTTPS / X-Forwarded-Proto.
        'secure_cookie' => false,
        'same_site' => 'Lax',
    ],
    'app' => [
        // Current production: http://fit-rpg.ru (no SSL yet). Switch to https:// after certificate.
        'allowed_origin' => 'http://fit-rpg.ru',
        'debug' => false,
    ],
];
