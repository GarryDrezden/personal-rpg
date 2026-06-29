<?php
/**
 * Диагностика для хостинга. Открой: /api/health.php
 */
header('Content-Type: application/json; charset=utf-8');

$checks = [
    'phpVersion' => PHP_VERSION,
    'pdo' => extension_loaded('pdo'),
    'pdo_mysql' => extension_loaded('pdo_mysql'),
];

$configPath = __DIR__ . '/config/config.php';
$checks['mysqlConfigExists'] = is_file($configPath);

if ($checks['mysqlConfigExists']) {
    try {
        require_once __DIR__ . '/config/database.php';
        $pdo = mysqlPdo();
        $pdo->query('SELECT 1');
        $checks['mysqlConnect'] = true;
        $tables = $pdo->query("SHOW TABLES LIKE 'users'")->fetch();
        $checks['usersTable'] = (bool) $tables;
        $authTable = $pdo->query("SHOW TABLES LIKE 'auth_sessions'")->fetch();
        $checks['authSessionsTable'] = (bool) $authTable;
        $dataTable = $pdo->query("SHOW TABLES LIKE 'user_data'")->fetch();
        $checks['userDataTable'] = (bool) $dataTable;
    } catch (Throwable $e) {
        $checks['mysqlConnect'] = false;
        $checks['mysqlError'] = $e->getMessage();
    }
}

$required = ['index.php', 'bootstrap.php', 'router-accounts.php', 'migrations/001_create_accounts_tables.sql'];
$checks['apiFiles'] = [];
foreach ($required as $file) {
    $checks['apiFiles'][$file] = is_file(__DIR__ . '/' . $file);
}

$sessionsDir = __DIR__ . '/sessions';
$checks['sessionsDirExists'] = is_dir($sessionsDir);
$checks['sessionsDirWritable'] = $checks['sessionsDirExists'] && is_writable($sessionsDir);

if ($checks['mysqlConnect'] ?? false) {
    try {
        if (!isset($checks['authSessionsTable'])) {
            $authTable = $pdo->query("SHOW TABLES LIKE 'auth_sessions'")->fetch();
            $checks['authSessionsTable'] = (bool) $authTable;
        }
        if (!isset($checks['userDataTable'])) {
            $dataTable = $pdo->query("SHOW TABLES LIKE 'user_data'")->fetch();
            $checks['userDataTable'] = (bool) $dataTable;
        }
    } catch (Throwable) {
        $checks['authSessionsTable'] = false;
        $checks['userDataTable'] = false;
    }
}

$checks['ok'] = ($checks['pdo_mysql'] ?? false)
    && ($checks['mysqlConfigExists'] ?? false)
    && ($checks['mysqlConnect'] ?? false)
    && ($checks['usersTable'] ?? false)
    && ($checks['authSessionsTable'] ?? false)
    && ($checks['userDataTable'] ?? false)
    && !in_array(false, $checks['apiFiles'], true);

if (!$checks['ok']) {
    http_response_code(500);
}

echo json_encode($checks, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
