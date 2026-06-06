<?php

require_once __DIR__ . '/bootstrap.php';

$db = new Database();
$pdo = $db->getPdo();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = preg_replace('#^/api#', '', $uri);
$uri = rtrim($uri, '/') ?: '/';

// GET /daily?from=&to=
if ($uri === '/daily' && $method === 'GET') {
    $from = $_GET['from'] ?? '2000-01-01';
    $to = $_GET['to'] ?? '2099-12-31';
    $stmt = $pdo->prepare('SELECT * FROM daily_entries WHERE date >= :from AND date <= :to ORDER BY date');
    $stmt->execute(['from' => $from, 'to' => $to]);
    jsonResponse(array_map('rowToDaily', $stmt->fetchAll()));
}

// PUT /daily/{date}
if (preg_match('#^/daily/(\d{4}-\d{2}-\d{2})$#', $uri, $m) && $method === 'PUT') {
    $body = getJsonBody();
    $body['date'] = $m[1];
    $db->insertDaily($body);
    $stmt = $pdo->prepare('SELECT * FROM daily_entries WHERE date = :date');
    $stmt->execute(['date' => $m[1]]);
    jsonResponse(rowToDaily($stmt->fetch()));
}

// GET /measurements
if ($uri === '/measurements' && $method === 'GET') {
    $rows = $pdo->query('SELECT * FROM measurements ORDER BY date')->fetchAll();
    jsonResponse(array_map('rowToMeasurement', $rows));
}

// POST /measurements
if ($uri === '/measurements' && $method === 'POST') {
    $body = getJsonBody();
    $id = $db->uuid();
    $pdo->prepare(
        'INSERT INTO measurements (id, date, weight, chest, waist, belly, hips, thigh, biceps, comment)
         VALUES (:id, :date, :weight, :chest, :waist, :belly, :hips, :thigh, :biceps, :comment)'
    )->execute([
        'id' => $id,
        'date' => $body['date'],
        'weight' => $body['weight'] ?? null,
        'chest' => $body['chest'] ?? null,
        'waist' => $body['waist'] ?? null,
        'belly' => $body['belly'] ?? null,
        'hips' => $body['hips'] ?? null,
        'thigh' => $body['thigh'] ?? null,
        'biceps' => $body['biceps'] ?? null,
        'comment' => $body['comment'] ?? '',
    ]);
    $stmt = $pdo->prepare('SELECT * FROM measurements WHERE id = :id');
    $stmt->execute(['id' => $id]);
    jsonResponse(rowToMeasurement($stmt->fetch()), 201);
}

// DELETE /measurements/{id}
if (preg_match('#^/measurements/([^/]+)$#', $uri, $m) && $method === 'DELETE') {
    $pdo->prepare('DELETE FROM measurements WHERE id = :id')->execute(['id' => $m[1]]);
    jsonResponse(['ok' => true]);
}

// GET /rewards
if ($uri === '/rewards' && $method === 'GET') {
    $rows = $pdo->query('SELECT * FROM rewards ORDER BY cost')->fetchAll();
    jsonResponse(array_map('rowToReward', $rows));
}

// POST /rewards
if ($uri === '/rewards' && $method === 'POST') {
    $body = getJsonBody();
    $id = $db->uuid();
    $pdo->prepare(
        'INSERT INTO rewards (id, title, description, cost, category, purchased_at, hidden)
         VALUES (:id, :title, :description, :cost, :category, NULL, :hidden)'
    )->execute([
        'id' => $id,
        'title' => $body['title'],
        'description' => $body['description'] ?? '',
        'cost' => (int) $body['cost'],
        'category' => $body['category'] ?? 'Своё',
        'hidden' => !empty($body['hidden']) ? 1 : 0,
    ]);
    $stmt = $pdo->prepare('SELECT * FROM rewards WHERE id = :id');
    $stmt->execute(['id' => $id]);
    jsonResponse(rowToReward($stmt->fetch()), 201);
}

// POST /rewards/{id}/purchase
if (preg_match('#^/rewards/([^/]+)/purchase$#', $uri, $m) && $method === 'POST') {
    $pdo->prepare('UPDATE rewards SET purchased_at = :at WHERE id = :id AND purchased_at IS NULL')
        ->execute(['at' => date('c'), 'id' => $m[1]]);
    $stmt = $pdo->prepare('SELECT * FROM rewards WHERE id = :id');
    $stmt->execute(['id' => $m[1]]);
    jsonResponse(rowToReward($stmt->fetch()));
}

// GET /settings
if ($uri === '/settings' && $method === 'GET') {
    jsonResponse(getAppSettings($pdo));
}

// PUT /settings
if ($uri === '/settings' && $method === 'PUT') {
    $body = getJsonBody();
    $pdo->prepare(
        'UPDATE app_settings SET
           default_calories_limit = :dcl,
           default_steps_goal = :dsg,
           default_gym_target = :dgt,
           default_weekly_points_goal = :dwpg,
           point_settings = :ps
         WHERE id = 1'
    )->execute([
        'dcl' => $body['defaultCaloriesLimit'],
        'dsg' => $body['defaultStepsGoal'],
        'dgt' => $body['defaultGymTarget'],
        'dwpg' => $body['defaultWeeklyPointsGoal'],
        'ps' => json_encode($body['pointSettings']),
    ]);

    $pdo->exec('DELETE FROM weekly_settings');
    foreach ($body['weeklySettings'] ?? [] as $w) {
        $pdo->prepare(
            'INSERT INTO weekly_settings (id, week_start, calories_limit, steps_goal, gym_target, weekly_points_goal)
             VALUES (:id, :ws, :cl, :sg, :gt, :wpg)'
        )->execute([
            'id' => $w['id'] ?? $db->uuid(),
            'ws' => $w['weekStart'],
            'cl' => $w['caloriesLimit'],
            'sg' => $w['stepsGoal'],
            'gt' => $w['gymTarget'],
            'wpg' => $w['weeklyPointsGoal'],
        ]);
    }
    jsonResponse(getAppSettings($pdo));
}

// GET /backup
if ($uri === '/backup' && $method === 'GET') {
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="personal-rpg-backup.sqlite"');
    readfile($db->getDbPath());
    exit;
}

// GET / — full app data
if ($uri === '/' && $method === 'GET') {
    $daily = $pdo->query('SELECT * FROM daily_entries ORDER BY date')->fetchAll();
    $measurements = $pdo->query('SELECT * FROM measurements ORDER BY date')->fetchAll();
    $rewards = $pdo->query('SELECT * FROM rewards ORDER BY cost')->fetchAll();
    jsonResponse([
        'dailyEntries' => array_map('rowToDaily', $daily),
        'measurements' => array_map('rowToMeasurement', $measurements),
        'rewards' => array_map('rowToReward', $rewards),
        'settings' => getAppSettings($pdo),
    ]);
}

jsonError('Not found', 404);
