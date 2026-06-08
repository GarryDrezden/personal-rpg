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
if (preg_match('#^/daily/(\d{4}-\d{2}-\d{2})$#', $uri, $m) && ($method === 'PUT' || $method === 'DELETE')) {
    $date = $m[1];
    if ($method === 'DELETE') {
        $pdo->prepare('DELETE FROM daily_entries WHERE date = :date')->execute(['date' => $date]);
        jsonResponse(['ok' => true, 'date' => $date]);
    }
    $body = getJsonBody();
    $body['date'] = $date;
    $db->insertDaily($body);
    $stmt = $pdo->prepare('SELECT * FROM daily_entries WHERE date = :date');
    $stmt->execute(['date' => $date]);
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
        'INSERT INTO rewards (id, title, description, cost, category, purchased_at, hidden, money_goal)
         VALUES (:id, :title, :description, :cost, :category, NULL, :hidden, :money_goal)'
    )->execute([
        'id' => $id,
        'title' => $body['title'],
        'description' => $body['description'] ?? '',
        'cost' => (int) $body['cost'],
        'category' => $body['category'] ?? 'Своё',
        'hidden' => !empty($body['hidden']) ? 1 : 0,
        'money_goal' => isset($body['moneyGoal']) ? (float) $body['moneyGoal'] : null,
    ]);
    $stmt = $pdo->prepare('SELECT * FROM rewards WHERE id = :id');
    $stmt->execute(['id' => $id]);
    jsonResponse(rowToReward($stmt->fetch()), 201);
}

// PUT /rewards/{id}
if (preg_match('#^/rewards/([^/]+)$#', $uri, $m) && $method === 'PUT') {
    $body = getJsonBody();
    $pdo->prepare(
        'UPDATE rewards SET
           title = COALESCE(:title, title),
           description = COALESCE(:description, description),
           cost = COALESCE(:cost, cost),
           category = COALESCE(:category, category),
           money_goal = :money_goal
         WHERE id = :id'
    )->execute([
        'id' => $m[1],
        'title' => $body['title'] ?? null,
        'description' => array_key_exists('description', $body) ? $body['description'] : null,
        'cost' => isset($body['cost']) ? (int) $body['cost'] : null,
        'category' => $body['category'] ?? null,
        'money_goal' => array_key_exists('moneyGoal', $body) ? $body['moneyGoal'] : null,
    ]);
    $stmt = $pdo->prepare('SELECT * FROM rewards WHERE id = :id');
    $stmt->execute(['id' => $m[1]]);
    $row = $stmt->fetch();
    if (!$row) {
        jsonError('Reward not found', 404);
    }
    jsonResponse(rowToReward($row));
}

// DELETE /rewards/{id}
if (preg_match('#^/rewards/([^/]+)$#', $uri, $m) && $method === 'DELETE') {
    $pdo->prepare('DELETE FROM rewards WHERE id = :id')->execute(['id' => $m[1]]);
    jsonResponse(['ok' => true]);
}

// GET /bank
if ($uri === '/bank' && $method === 'GET') {
    $rows = $pdo->query('SELECT * FROM bank_deposits ORDER BY date DESC, id DESC')->fetchAll();
    jsonResponse(array_map('rowToBankDeposit', $rows));
}

// POST /bank
if ($uri === '/bank' && $method === 'POST') {
    $body = getJsonBody();
    if (!isset($body['amount']) || (float) $body['amount'] <= 0) {
        jsonError('amount required');
    }
    $id = $db->uuid();
    $pdo->prepare(
        'INSERT INTO bank_deposits (id, amount, date, comment)
         VALUES (:id, :amount, :date, :comment)'
    )->execute([
        'id' => $id,
        'amount' => (float) $body['amount'],
        'date' => $body['date'] ?? date('Y-m-d'),
        'comment' => $body['comment'] ?? '',
    ]);
    $stmt = $pdo->prepare('SELECT * FROM bank_deposits WHERE id = :id');
    $stmt->execute(['id' => $id]);
    jsonResponse(rowToBankDeposit($stmt->fetch()), 201);
}

// DELETE /bank/{id}
if (preg_match('#^/bank/([^/]+)$#', $uri, $m) && $method === 'DELETE') {
    $pdo->prepare('DELETE FROM bank_deposits WHERE id = :id')->execute(['id' => $m[1]]);
    jsonResponse(['ok' => true]);
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
           point_settings = :ps,
           coin_settings = :cs,
           gender = :gender,
           weight_goal = :weight_goal
         WHERE id = 1'
    )->execute([
        'dcl' => $body['defaultCaloriesLimit'],
        'dsg' => $body['defaultStepsGoal'],
        'dgt' => $body['defaultGymTarget'],
        'dwpg' => $body['defaultWeeklyPointsGoal'],
        'ps' => json_encode($body['pointSettings']),
        'cs' => json_encode($body['coinSettings'] ?? []),
        'gender' => in_array($body['gender'] ?? 'male', ['male', 'female'], true)
            ? $body['gender']
            : 'male',
        'weight_goal' => isset($body['weightGoal']) ? (float) $body['weightGoal'] : 100.0,
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
    $deposits = $pdo->query('SELECT * FROM bank_deposits ORDER BY date DESC, id DESC')->fetchAll();
    jsonResponse([
        'dailyEntries' => array_map('rowToDaily', $daily),
        'measurements' => array_map('rowToMeasurement', $measurements),
        'rewards' => array_map('rowToReward', $rewards),
        'bankDeposits' => array_map('rowToBankDeposit', $deposits),
        'settings' => getAppSettings($pdo),
    ]);
}

jsonError('Not found', 404);
