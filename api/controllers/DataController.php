<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/validation.php';
require_once __DIR__ . '/../lib/session.php';
require_once __DIR__ . '/../lib/serializers.php';
require_once __DIR__ . '/../repositories/UserProfileRepository.php';
require_once __DIR__ . '/../repositories/UserSettingsRepository.php';
require_once __DIR__ . '/../repositories/UserDataRepository.php';

class DataController
{
    public function __construct(private PDO $pdo)
    {
    }

    public function getAll(): never
    {
        $userId = requireAuthenticatedUserId($this->pdo);
        $profiles = new UserProfileRepository($this->pdo);
        $settings = new UserSettingsRepository($this->pdo);
        $dataRepo = new UserDataRepository($this->pdo);

        $profile = $profiles->findByUserId($userId);
        $userSettings = $settings->findByUserId($userId);
        if ($profile === null || $userSettings === null) {
            jsonError('Profile or settings not found', 404);
        }

        jsonResponse([
            'profile' => serializeProfile($profile),
            'settings' => serializeSettings($userSettings),
            'data' => $dataRepo->getAllByUserId($userId),
        ]);
    }

    public function getType(string $type): never
    {
        $userId = requireAuthenticatedUserId($this->pdo);
        if (!isAllowedDataType($type)) {
            jsonError('Unknown data type', 400);
        }

        $dataRepo = new UserDataRepository($this->pdo);
        $row = $dataRepo->getByType($userId, $type);
        jsonResponse([
            'type' => $type,
            'payload' => $row['payload'] ?? null,
        ]);
    }

    public function putType(string $type, array $body): never
    {
        $userId = requireAuthenticatedUserId($this->pdo);
        if (!isAllowedDataType($type)) {
            jsonError('Unknown data type', 400);
        }
        if (!array_key_exists('payload', $body)) {
            jsonError('Invalid payload', 400);
        }

        $dataRepo = new UserDataRepository($this->pdo);
        $saved = $dataRepo->upsert($userId, $type, $body['payload']);
        jsonResponse([
            'type' => $saved['type'],
            'payload' => $saved['payload'],
            'updatedAt' => $saved['updatedAt'],
        ]);
    }

    public function putBulk(array $body): never
    {
        $userId = requireAuthenticatedUserId($this->pdo);
        $items = $body['data'] ?? null;
        if (!is_array($items)) {
            jsonError('Invalid data object', 400);
        }

        $dataRepo = new UserDataRepository($this->pdo);
        $dataRepo->upsertMany($userId, $items);
        jsonResponse(['ok' => true]);
    }
}
