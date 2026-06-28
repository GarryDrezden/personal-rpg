<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/session.php';
require_once __DIR__ . '/../lib/serializers.php';
require_once __DIR__ . '/../repositories/UserSettingsRepository.php';

class SettingsController
{
    public function __construct(private PDO $pdo)
    {
    }

    public function patch(array $body): never
    {
        $userId = requireAuthenticatedUserId($this->pdo);

        $allowed = [];
        foreach (['themeId', 'nutritionTrackingMode', 'dailyCalorieLimit', 'activeCompanionId'] as $key) {
            if (array_key_exists($key, $body)) {
                $allowed[$key] = $body[$key];
            }
        }

        if (isset($body['settingsJson']) && is_array($body['settingsJson'])) {
            $allowed['settingsJson'] = $body['settingsJson'];
        }

        $repo = new UserSettingsRepository($this->pdo);
        $settings = $repo->patch($userId, $allowed);
        jsonResponse(serializeSettings($settings));
    }
}
