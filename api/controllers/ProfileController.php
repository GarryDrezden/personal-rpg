<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/validation.php';
require_once __DIR__ . '/../lib/session.php';
require_once __DIR__ . '/../lib/serializers.php';
require_once __DIR__ . '/../repositories/UserProfileRepository.php';

class ProfileController
{
    public function __construct(private PDO $pdo)
    {
    }

    public function patch(array $body): never
    {
        $userId = requireAuthenticatedUserId($this->pdo);
        if ($err = validateProfilePatch($body)) {
            jsonError($err, 400);
        }

        $allowed = [];
        foreach (['displayName', 'heroGender', 'startWeight', 'targetWeight', 'height'] as $key) {
            if (array_key_exists($key, $body)) {
                $allowed[$key] = $body[$key];
            }
        }

        $repo = new UserProfileRepository($this->pdo);
        $profile = $repo->patch($userId, $allowed);
        jsonResponse(serializeProfile($profile));
    }
}
