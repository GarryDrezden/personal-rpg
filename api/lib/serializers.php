<?php

declare(strict_types=1);

function serializeUser(array $row): array
{
    return [
        'id' => (string) $row['id'],
        'login' => $row['login'],
        'createdAt' => isoTimestamp($row['created_at'] ?? null) ?? '',
        'updatedAt' => isoTimestamp($row['updated_at'] ?? null) ?? '',
    ];
}

function serializeProfile(array $row): array
{
    return [
        'id' => (string) $row['id'],
        'userId' => (string) $row['user_id'],
        'displayName' => $row['display_name'],
        'heroGender' => $row['hero_gender'],
        'startWeight' => $row['start_weight'] !== null ? (float) $row['start_weight'] : null,
        'targetWeight' => $row['target_weight'] !== null ? (float) $row['target_weight'] : null,
        'height' => $row['height'] !== null ? (float) $row['height'] : null,
        'createdAt' => isoTimestamp($row['created_at'] ?? null) ?? '',
        'updatedAt' => isoTimestamp($row['updated_at'] ?? null) ?? '',
    ];
}

function serializeSettings(array $row): array
{
    return [
        'id' => (string) $row['id'],
        'userId' => (string) $row['user_id'],
        'themeId' => $row['theme_id'],
        'nutritionTrackingMode' => $row['nutrition_tracking_mode'],
        'dailyCalorieLimit' => $row['daily_calorie_limit'] !== null
            ? (int) $row['daily_calorie_limit']
            : null,
        'activeCompanionId' => $row['active_companion_id'],
        'createdAt' => isoTimestamp($row['created_at'] ?? null) ?? '',
        'updatedAt' => isoTimestamp($row['updated_at'] ?? null) ?? '',
    ];
}

function serializeAuthPayload(array $user, ?array $profile, ?array $settings): array
{
    return [
        'user' => serializeUser($user),
        'profile' => $profile ? serializeProfile($profile) : null,
        'settings' => $settings ? serializeSettings($settings) : null,
    ];
}
