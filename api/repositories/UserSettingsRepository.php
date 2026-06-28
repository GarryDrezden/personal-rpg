<?php

declare(strict_types=1);

class UserSettingsRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function findByUserId(int $userId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM user_settings WHERE user_id = :user_id LIMIT 1');
        $stmt->execute(['user_id' => $userId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function createDefaults(int $userId): array
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO user_settings (user_id, theme_id, nutrition_tracking_mode, active_companion_id)
             VALUES (:user_id, :theme_id, :nutrition_tracking_mode, :active_companion_id)',
        );
        $stmt->execute([
            'user_id' => $userId,
            'theme_id' => 'darkFantasy',
            'nutrition_tracking_mode' => 'simple',
            'active_companion_id' => 'golden_chinchilla_cat',
        ]);
        return $this->findByUserId($userId) ?? [];
    }

    public function patch(int $userId, array $fields): array
    {
        $map = [
            'themeId' => 'theme_id',
            'nutritionTrackingMode' => 'nutrition_tracking_mode',
            'dailyCalorieLimit' => 'daily_calorie_limit',
            'activeCompanionId' => 'active_companion_id',
        ];

        $sets = [];
        $params = ['user_id' => $userId];
        foreach ($map as $jsonKey => $dbCol) {
            if (!array_key_exists($jsonKey, $fields)) {
                continue;
            }
            $sets[] = "$dbCol = :$dbCol";
            $params[$dbCol] = $fields[$jsonKey];
        }

        if (isset($fields['settingsJson'])) {
            $sets[] = 'settings_json = :settings_json';
            $params['settings_json'] = json_encode($fields['settingsJson'], JSON_UNESCAPED_UNICODE);
        }

        if ($sets === []) {
            return $this->findByUserId($userId) ?? [];
        }

        $sql = 'UPDATE user_settings SET ' . implode(', ', $sets) . ' WHERE user_id = :user_id';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return $this->findByUserId($userId) ?? [];
    }
}
