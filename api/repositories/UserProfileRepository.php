<?php

declare(strict_types=1);

class UserProfileRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function findByUserId(int $userId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM user_profiles WHERE user_id = :user_id LIMIT 1');
        $stmt->execute(['user_id' => $userId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function createDefaults(int $userId): array
    {
        $stmt = $this->pdo->prepare('INSERT INTO user_profiles (user_id) VALUES (:user_id)');
        $stmt->execute(['user_id' => $userId]);
        return $this->findByUserId($userId) ?? [];
    }

    public function patch(int $userId, array $fields): array
    {
        $map = [
            'displayName' => 'display_name',
            'heroGender' => 'hero_gender',
            'startWeight' => 'start_weight',
            'targetWeight' => 'target_weight',
            'height' => 'height',
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

        if ($sets === []) {
            return $this->findByUserId($userId) ?? [];
        }

        $sql = 'UPDATE user_profiles SET ' . implode(', ', $sets) . ' WHERE user_id = :user_id';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return $this->findByUserId($userId) ?? [];
    }
}
