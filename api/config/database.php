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
    if ($pdo instanceof PDO) {
        return $pdo;
    }

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

    return $pdo;
}
