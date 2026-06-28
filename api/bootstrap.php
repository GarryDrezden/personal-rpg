<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/Database.php';

function jsonResponse(mixed $data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $message, int $code = 400): void
{
    jsonResponse(['error' => $message], $code);
}

function handleApiFatal(string $message): void
{
    jsonError($message, 500);
}

set_exception_handler(static function (Throwable $e): void {
    handleApiFatal($e->getMessage());
});

function getJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function rowToDaily(array $row): array
{
    return [
        'id' => $row['id'],
        'date' => $row['date'],
        'calories' => $row['calories'] !== null ? (float) $row['calories'] : null,
        'steps' => $row['steps'] !== null ? (int) $row['steps'] : null,
        'alcohol' => $row['alcohol'],
        'morningExercise' => (bool) $row['morning_exercise'],
        'gym' => (bool) $row['gym'],
        'journal' => (bool) $row['journal'],
        'cooking' => (bool) $row['cooking'],
        'repair' => (bool) $row['repair'],
        'plants' => (bool) $row['plants'],
        'hobby' => (bool) $row['hobby'],
        'comment' => $row['comment'] ?? '',
        'customCompletions' => isset($row['custom_completions']) && $row['custom_completions']
            ? json_decode($row['custom_completions'], true) ?? []
            : [],
        'dayMode' => $row['day_mode'] ?? 'normal',
        'energyLevel' => isset($row['energy_level']) && $row['energy_level'] !== null
            ? (int) $row['energy_level']
            : null,
        'nutritionLevel' => $row['nutrition_level'] ?? null,
    ];
}

function rowToMeasurement(array $row): array
{
    return [
        'id' => $row['id'],
        'date' => $row['date'],
        'weight' => $row['weight'] !== null ? (float) $row['weight'] : null,
        'chest' => $row['chest'] !== null ? (float) $row['chest'] : null,
        'waist' => $row['waist'] !== null ? (float) $row['waist'] : null,
        'belly' => $row['belly'] !== null ? (float) $row['belly'] : null,
        'hips' => $row['hips'] !== null ? (float) $row['hips'] : null,
        'thigh' => $row['thigh'] !== null ? (float) $row['thigh'] : null,
        'biceps' => $row['biceps'] !== null ? (float) $row['biceps'] : null,
        'comment' => $row['comment'] ?? '',
    ];
}

function rowToReward(array $row): array
{
    return [
        'id' => $row['id'],
        'title' => $row['title'],
        'description' => $row['description'],
        'cost' => (int) $row['cost'],
        'category' => $row['category'],
        'purchasedAt' => $row['purchased_at'],
        'hidden' => (bool) $row['hidden'],
        'moneyGoal' => isset($row['money_goal']) && $row['money_goal'] !== null
            ? (float) $row['money_goal']
            : null,
    ];
}

function rowToBankDeposit(array $row): array
{
    return [
        'id' => $row['id'],
        'amount' => (float) $row['amount'],
        'date' => $row['date'],
        'comment' => $row['comment'] ?? '',
    ];
}

function rowToWeekly(array $row): array
{
    return [
        'id' => $row['id'],
        'weekStart' => $row['week_start'],
        'caloriesLimit' => (int) $row['calories_limit'],
        'stepsGoal' => (int) $row['steps_goal'],
        'stepsMinimum' => isset($row['steps_minimum']) && $row['steps_minimum'] !== null
            ? (int) $row['steps_minimum']
            : null,
        'stepsNormal' => isset($row['steps_normal']) && $row['steps_normal'] !== null
            ? (int) $row['steps_normal']
            : null,
        'stepsExcellent' => isset($row['steps_excellent']) && $row['steps_excellent'] !== null
            ? (int) $row['steps_excellent']
            : null,
        'gymTarget' => (int) $row['gym_target'],
        'weeklyPointsGoal' => (int) $row['weekly_points_goal'],
    ];
}

function getAppSettings(PDO $pdo): array
{
    $row = $pdo->query('SELECT * FROM app_settings WHERE id = 1')->fetch();
    if (!$row) {
        jsonError('Settings not found', 500);
    }
    $weekly = $pdo->query('SELECT * FROM weekly_settings ORDER BY week_start')->fetchAll();
    $nutrition = isset($row['nutrition_settings']) && $row['nutrition_settings']
        ? json_decode($row['nutrition_settings'], true)
        : [];
    return [
        'defaultCaloriesLimit' => (int) $row['default_calories_limit'],
        'defaultStepsGoal' => (int) $row['default_steps_goal'],
        'defaultStepsMinimum' => isset($row['default_steps_minimum']) && $row['default_steps_minimum'] !== null
            ? (int) $row['default_steps_minimum']
            : 7000,
        'defaultStepsNormal' => isset($row['default_steps_normal']) && $row['default_steps_normal'] !== null
            ? (int) $row['default_steps_normal']
            : (int) $row['default_steps_goal'],
        'defaultStepsExcellent' => isset($row['default_steps_excellent']) && $row['default_steps_excellent'] !== null
            ? (int) $row['default_steps_excellent']
            : 14000,
        'defaultGymTarget' => (int) $row['default_gym_target'],
        'defaultWeeklyPointsGoal' => (int) $row['default_weekly_points_goal'],
        'pointSettings' => json_decode($row['point_settings'], true),
        'weeklySettings' => array_map('rowToWeekly', $weekly),
        'gender' => in_array($row['gender'] ?? 'male', ['male', 'female'], true)
            ? $row['gender']
            : 'male',
        'weightGoal' => isset($row['weight_goal']) && $row['weight_goal'] !== null
            ? (float) $row['weight_goal']
            : 100.0,
        'targetWeight' => isset($row['weight_goal']) && $row['weight_goal'] !== null
            ? (float) $row['weight_goal']
            : 100.0,
        'coinSettings' => isset($row['coin_settings']) && $row['coin_settings']
            ? json_decode($row['coin_settings'], true)
            : null,
        'avatarSettings' => isset($row['avatar_settings']) && $row['avatar_settings']
            ? json_decode($row['avatar_settings'], true)
            : null,
        'themeId' => in_array($row['theme_id'] ?? 'cozy', ['cozy', 'darkFantasy'], true)
            ? $row['theme_id']
            : 'cozy',
        'habitConfig' => isset($row['habit_config']) && $row['habit_config']
            ? json_decode($row['habit_config'], true)
            : null,
        'nutritionTrackingMode' => $nutrition['nutritionTrackingMode'] ?? 'simple',
        'dailyCalorieLimit' => $nutrition['dailyCalorieLimit'] ?? null,
        'nutritionMediumOverThreshold' => $nutrition['nutritionMediumOverThreshold'] ?? 300,
        'nutritionHeavyOverThreshold' => $nutrition['nutritionHeavyOverThreshold'] ?? 700,
    ];
}
