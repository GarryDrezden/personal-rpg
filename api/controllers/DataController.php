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

        $bundle = $dataRepo->getAllWithRevisions($userId);
        jsonResponse([
            'profile' => serializeProfile($profile),
            'settings' => serializeSettings($userSettings),
            'data' => $bundle['data'],
            'revisions' => $bundle['revisions'],
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
            'revision' => $row['revision'] ?? null,
        ]);
    }

    public function putType(string $type, array $body): never
    {
        $userId = requireAuthenticatedUserId($this->pdo);
        if (!isAllowedDataType($type)) {
            jsonError('Unknown data type', 400);
        }
        if (!array_key_exists('payload', $body)) {
            logApiEvent('invalid_payload', ['type' => $type]);
            jsonError('Invalid payload', 400);
        }

        $expected = array_key_exists('revision', $body) ? (int) $body['revision'] : null;
        $dataRepo = new UserDataRepository($this->pdo);
        $saved = $dataRepo->upsert($userId, $type, $body['payload'], $expected);
        jsonResponse([
            'type' => $saved['type'],
            'payload' => $saved['payload'],
            'updatedAt' => $saved['updatedAt'],
            'revision' => $saved['revision'],
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
        $this->pdo->beginTransaction();
        try {
            $dataRepo->upsertMany($userId, $items);
            $this->pdo->commit();
        } catch (Throwable $e) {
            $this->pdo->rollBack();
            logApiEvent('db_failure', ['op' => 'putBulk']);
            jsonError('Database unavailable', 503);
        }
        jsonResponse(['ok' => true]);
    }

    public function restore(array $body): never
    {
        $userId = requireAuthenticatedUserId($this->pdo);
        $items = $body['data'] ?? null;
        if (!is_array($items)) {
            jsonError('Invalid data object', 400);
        }

        $filtered = [];
        foreach ($items as $type => $payload) {
            if (is_string($type) && isAllowedDataType($type)) {
                $filtered[$type] = $payload;
            }
        }
        if ($filtered === []) {
            jsonError('Invalid data object', 400);
        }

        $profilePatch = is_array($body['profile'] ?? null) ? $body['profile'] : null;
        if ($profilePatch !== null && ($err = validateProfilePatch($profilePatch))) {
            jsonError($err, 400);
        }

        $dataRepo = new UserDataRepository($this->pdo);
        $profiles = new UserProfileRepository($this->pdo);
        $settings = new UserSettingsRepository($this->pdo);

        $this->pdo->beginTransaction();
        try {
            $dataRepo->snapshot($userId, 'restore');
            $dataRepo->upsertMany($userId, $filtered);
            if ($profilePatch !== null) {
                $allowed = [];
                foreach (['displayName', 'heroGender', 'startWeight', 'targetWeight', 'height'] as $key) {
                    if (array_key_exists($key, $profilePatch)) {
                        $allowed[$key] = $profilePatch[$key];
                    }
                }
                if ($allowed !== []) {
                    $profiles->patch($userId, $allowed);
                }
            }
            $backup = $filtered['customSettingsBackup'] ?? null;
            if (is_array($backup)) {
                $patch = [];
                if (isset($backup['themeId'])) {
                    $patch['themeId'] = $backup['themeId'];
                }
                if (array_key_exists('dailyCalorieLimit', $backup)) {
                    $patch['dailyCalorieLimit'] = $backup['dailyCalorieLimit'];
                }
                if (isset($backup['nutritionTrackingMode'])) {
                    $mode = $backup['nutritionTrackingMode'];
                    $patch['nutritionTrackingMode'] = $mode === 'precise' || $mode === 'detailed'
                        ? 'detailed'
                        : 'simple';
                }
                if (isset($backup['activeCompanionId'])) {
                    $patch['activeCompanionId'] = $backup['activeCompanionId'];
                }
                if ($patch !== []) {
                    $settings->patch($userId, $patch);
                }
            }
            $this->pdo->commit();
        } catch (Throwable $e) {
            $this->pdo->rollBack();
            logApiEvent('db_failure', ['op' => 'restore']);
            jsonError('Database unavailable', 503);
        }

        jsonResponse(['ok' => true]);
    }
}
