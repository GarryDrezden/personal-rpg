<?php
/**
 * Диагностика для хостинга. Открой в браузере: /api/health.php
 * После проверки можно удалить или оставить.
 */
header('Content-Type: application/json; charset=utf-8');

$checks = [
    'phpVersion' => PHP_VERSION,
    'pdo' => extension_loaded('pdo'),
    'pdo_sqlite' => extension_loaded('pdo_sqlite'),
    'sqlite3' => extension_loaded('sqlite3'),
];

$dataDir = dirname(__DIR__) . '/data';
$checks['dataDir'] = $dataDir;
$checks['dataDirExists'] = is_dir($dataDir);
$checks['dataDirWritable'] = is_dir($dataDir) && is_writable($dataDir);

$required = ['index.php', 'bootstrap.php', 'Database.php', 'schema.sql', 'seed.json'];
$checks['apiFiles'] = [];
foreach ($required as $file) {
    $checks['apiFiles'][$file] = is_file(__DIR__ . '/' . $file);
}

$dbPath = $dataDir . '/personal-rpg.sqlite';
$checks['dbPath'] = $dbPath;
$checks['dbExists'] = is_file($dbPath);
$checks['dbWritable'] = is_file($dbPath) ? is_writable($dbPath) : $checks['dataDirWritable'];

try {
    if (!extension_loaded('pdo_sqlite')) {
        throw new RuntimeException('Расширение pdo_sqlite не включено в PHP на хостинге');
    }
    if (!$checks['dataDirWritable']) {
        throw new RuntimeException('Папка data/ недоступна для записи — выставь права 755 или 775');
    }
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->query('SELECT 1');
    $checks['sqliteConnect'] = true;
} catch (Throwable $e) {
    $checks['sqliteConnect'] = false;
    $checks['error'] = $e->getMessage();
    http_response_code(500);
}

$checks['ok'] = ($checks['pdo_sqlite'] ?? false)
    && ($checks['dataDirWritable'] ?? false)
    && ($checks['sqliteConnect'] ?? false)
    && !in_array(false, $checks['apiFiles'], true);

echo json_encode($checks, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
