<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/validation.php';

class UserDataRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function getAllByUserId(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT type, payload FROM user_data WHERE user_id = :user_id');
        $stmt->execute(['user_id' => $userId]);
        $data = [];
        foreach ($stmt->fetchAll() as $row) {
            $decoded = json_decode($row['payload'], true);
            $data[$row['type']] = $decoded;
        }
        return $data;
    }

    public function getByType(int $userId, string $type): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT type, payload, updated_at FROM user_data WHERE user_id = :user_id AND type = :type LIMIT 1',
        );
        $stmt->execute(['user_id' => $userId, 'type' => $type]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        return [
            'type' => $row['type'],
            'payload' => json_decode($row['payload'], true),
            'updatedAt' => isoTimestamp($row['updated_at'] ?? null) ?? '',
        ];
    }

    public function upsert(int $userId, string $type, mixed $payload): array
    {
        $json = json_encode($payload, JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            jsonError('Invalid payload JSON', 400);
        }

        $stmt = $this->pdo->prepare(
            'INSERT INTO user_data (user_id, type, payload)
             VALUES (:user_id, :type, :payload)
             ON DUPLICATE KEY UPDATE payload = VALUES(payload), updated_at = CURRENT_TIMESTAMP',
        );
        $stmt->execute([
            'user_id' => $userId,
            'type' => $type,
            'payload' => $json,
        ]);

        $result = $this->getByType($userId, $type);
        return $result ?? ['type' => $type, 'payload' => $payload, 'updatedAt' => date('c')];
    }

    public function upsertMany(int $userId, array $items): void
    {
        foreach ($items as $type => $payload) {
            if (!is_string($type) || !isAllowedDataType($type)) {
                continue;
            }
            $this->upsert($userId, $type, $payload);
        }
    }
}
