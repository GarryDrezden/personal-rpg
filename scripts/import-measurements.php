<?php

require __DIR__ . '/../api/bootstrap.php';

$db = new Database();
$pdo = $db->getPdo();
$rows = json_decode(
    file_get_contents(__DIR__ . '/../api/import-measurements-history.json'),
    true,
);

$stmt = $pdo->prepare(
    'INSERT OR REPLACE INTO measurements
     (id, date, weight, chest, waist, belly, hips, thigh, biceps, comment)
     VALUES (
       COALESCE((SELECT id FROM measurements WHERE date = :date), :new_id),
       :date, :weight, :chest, :waist, NULL, :hips, :thigh, :biceps, :comment
     )',
);

$count = 0;
foreach ($rows as $m) {
    $stmt->execute([
        'new_id' => $db->uuid(),
        'date' => $m['date'],
        'weight' => $m['weight'],
        'chest' => $m['chest'],
        'waist' => $m['waist'],
        'hips' => $m['hips'],
        'thigh' => $m['thigh'],
        'biceps' => $m['biceps'],
        'comment' => 'Импорт из таблицы',
    ]);
    $count++;
}

echo "Imported {$count} measurements.\n";
