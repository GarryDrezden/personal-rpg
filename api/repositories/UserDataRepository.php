<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/validation.php';

class UserDataRepository
{
    private const BACKUP_RETENTION = 10;

    public function __construct(private PDO $pdo)
    {
    }

    public function getAllByUserId(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT type, payload FROM user_data WHERE user_id = :user_id');
        $stmt->execute(['user_id' => $userId]);
        $data = [];
        foreach ($stmt->fetchAll() as $row) {
            $data[$row['type']] = json_decode($row['payload'], true);
        }
        return $data;
    }

    public function getAllWithRevisions(int $userId): array
    {
        try {
            $stmt = $this->pdo->prepare(
                'SELECT type, payload, revision FROM user_data WHERE user_id = :user_id',
            );
            $stmt->execute(['user_id' => $userId]);
            $data = [];
            $revisions = [];
            foreach ($stmt->fetchAll() as $row) {
                $data[$row['type']] = json_decode($row['payload'], true);
                $revisions[$row['type']] = (int) ($row['revision'] ?? 1);
            }
            return ['data' => $data, 'revisions' => $revisions];
        } catch (Throwable) {
            $data = $this->getAllByUserId($userId);
            return ['data' => $data, 'revisions' => []];
        }
    }

    public function getByType(int $userId, string $type): ?array
    {
        try {
            $stmt = $this->pdo->prepare(
                'SELECT type, payload, revision, updated_at FROM user_data WHERE user_id = :user_id AND type = :type LIMIT 1',
            );
            $stmt->execute(['user_id' => $userId, 'type' => $type]);
        } catch (Throwable) {
            $stmt = $this->pdo->prepare(
                'SELECT type, payload, updated_at FROM user_data WHERE user_id = :user_id AND type = :type LIMIT 1',
            );
            $stmt->execute(['user_id' => $userId, 'type' => $type]);
        }
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        return [
            'type' => $row['type'],
            'payload' => json_decode($row['payload'], true),
            'revision' => (int) ($row['revision'] ?? 1),
            'updatedAt' => isoTimestamp($row['updated_at'] ?? null) ?? '',
        ];
    }

    public function upsert(int $userId, string $type, mixed $payload, ?int $expectedRevision = null): array
    {
        $json = json_encode($payload, JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            logApiEvent('invalid_payload', ['type' => $type]);
            jsonError('Invalid payload JSON', 400);
        }

        $current = $this->getByType($userId, $type);
        if ($expectedRevision !== null && $current !== null) {
            $actual = (int) $current['revision'];
            if ($actual !== $expectedRevision) {
                logApiEvent('data_conflict', [
                    'type' => $type,
                    'expected' => $expectedRevision,
                    'actual' => $actual,
                ]);
                jsonError('Data conflict', 409, ['currentRevision' => $actual]);
            }
        }

        $stmt = $this->pdo->prepare(
            'INSERT INTO user_data (user_id, type, payload, revision)
             VALUES (:user_id, :type, :payload, 1)
             ON DUPLICATE KEY UPDATE payload = VALUES(payload), revision = revision + 1, updated_at = CURRENT_TIMESTAMP',
        );
        $stmt->execute([
            'user_id' => $userId,
            'type' => $type,
            'payload' => $json,
        ]);

        $result = $this->getByType($userId, $type);
        return $result ?? [
            'type' => $type,
            'payload' => $payload,
            'revision' => 1,
            'updatedAt' => date('c'),
        ];
    }

    public function upsertMany(int $userId, array $items): void
    {
        foreach ($items as $type => $payload) {
            if (!is_string($type) || !isAllowedDataType($type)) {
                continue;
            }
            $this->upsert($userId, $type, $payload, null);
        }
    }

    public function snapshot(int $userId, string $reason): void
    {
        if (!$this->backupsTableExists()) {
            return;
        }
        $data = $this->getAllByUserId($userId);
        $json = json_encode($data, JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            return;
        }
        $stmt = $this->pdo->prepare(
            'INSERT INTO user_data_backups (user_id, revision, reason, payload)
             VALUES (:user_id, :revision, :reason, :payload)',
        );
        $stmt->execute([
            'user_id' => $userId,
            'revision' => time(),
            'reason' => substr($reason, 0, 40),
            'payload' => $json,
        ]);
        $this->pruneBackups($userId);
    }

    private function pruneBackups(int $userId): void
    {
        $stmt = $this->pdo->prepare(
            'SELECT id FROM user_data_backups WHERE user_id = :user_id ORDER BY created_at DESC, id DESC',
        );
        $stmt->execute(['user_id' => $userId]);
        $ids = array_map(static fn ($row) => (int) $row['id'], $stmt->fetchAll());
        $drop = array_slice($ids, self::BACKUP_RETENTION);
        if ($drop === []) {
            return;
        }
        $placeholders = implode(',', array_fill(0, count($drop), '?'));
        $del = $this->pdo->prepare("DELETE FROM user_data_backups WHERE id IN ($placeholders)");
        $del->execute($drop);
    }

    private function backupsTableExists(): bool
    {
        try {
            $this->pdo->query('SELECT 1 FROM user_data_backups LIMIT 1');
            return true;
        } catch (Throwable) {
            return false;
        }
    }
}
