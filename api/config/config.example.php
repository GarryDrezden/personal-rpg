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
        'secure_cookie' => true,
        'same_site' => 'Lax',
    ],
    'app' => [
        'allowed_origin' => 'https://fit-rpg.ru',
        'debug' => false,
    ],
];
