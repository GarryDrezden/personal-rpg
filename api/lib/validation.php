<?php

declare(strict_types=1);

function validateLogin(string $login): ?string
{
    $login = trim($login);
    if (strlen($login) < 3) {
        return 'Логин: минимум 3 символа';
    }
    if (strlen($login) > 40) {
        return 'Логин: максимум 40 символов';
    }
    if (!preg_match('/^[a-zA-Z0-9_\-.@]+$/', $login)) {
        return 'Логин может содержать буквы, цифры, _, -, ., @';
    }
    return null;
}

function validatePassword(string $password): ?string
{
    if (strlen($password) < 6) {
        return 'Пароль: минимум 6 символов';
    }
    if (strlen($password) > 128) {
        return 'Пароль: максимум 128 символов';
    }
    return null;
}

function validateProfilePatch(array $body): ?string
{
    if (
        isset($body['startWeight'], $body['targetWeight'])
        && $body['startWeight'] !== null
        && $body['targetWeight'] !== null
        && (float) $body['targetWeight'] >= (float) $body['startWeight']
    ) {
        return 'Целевой вес должен быть меньше стартового для режима похудения';
    }
    return null;
}

function isAllowedDataType(string $type): bool
{
    static $types = [
        'dailyEntries',
        'measurements',
        'achievements',
        'coinTransactions',
        'rewards',
        'momentumHistory',
        'freedomHistory',
        'bodyAbilities',
        'journeyState',
        'artifactUnlocks',
        'defeatedBosses',
        'dailyMobs',
        'customSettingsBackup',
        'legacyImport',
        'bankDeposits',
    ];
    return in_array($type, $types, true);
}
