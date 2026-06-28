<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/validation.php';
require_once __DIR__ . '/../lib/session.php';
require_once __DIR__ . '/../lib/serializers.php';
require_once __DIR__ . '/../repositories/UserRepository.php';
require_once __DIR__ . '/../repositories/UserProfileRepository.php';
require_once __DIR__ . '/../repositories/UserSettingsRepository.php';

class AuthController
{
    public function __construct(private PDO $pdo)
    {
    }

    public function register(array $body): never
    {
        $login = trim((string) ($body['login'] ?? ''));
        $password = (string) ($body['password'] ?? '');

        if ($err = validateLogin($login)) {
            jsonError($err, 400);
        }
        if ($err = validatePassword($password)) {
            jsonError($err, 400);
        }

        $users = new UserRepository($this->pdo);
        if ($users->findByLogin($login) !== null) {
            jsonError('Этот логин уже занят', 409);
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $user = $users->create($login, $hash);
        $userId = (int) $user['id'];

        $profiles = new UserProfileRepository($this->pdo);
        $settings = new UserSettingsRepository($this->pdo);
        $profile = $profiles->createDefaults($userId);
        $userSettings = $settings->createDefaults($userId);

        $token = createAuthSession($this->pdo, $userId);
        $payload = serializeAuthPayload($user, $profile, $userSettings);
        $payload['authToken'] = $token;
        jsonResponse($payload, 201);
    }

    public function login(array $body): never
    {
        $login = trim((string) ($body['login'] ?? ''));
        $password = (string) ($body['password'] ?? '');

        if ($login === '' || $password === '') {
            jsonError('Неверный логин или пароль', 401);
        }

        $users = new UserRepository($this->pdo);
        $user = $users->findByLogin($login);
        if ($user === null || !password_verify($password, $user['password_hash'])) {
            jsonError('Неверный логин или пароль', 401);
        }

        $userId = (int) $user['id'];
        $profiles = new UserProfileRepository($this->pdo);
        $settings = new UserSettingsRepository($this->pdo);

        $token = createAuthSession($this->pdo, $userId);
        $payload = serializeAuthPayload(
            $user,
            $profiles->findByUserId($userId),
            $settings->findByUserId($userId),
        );
        $payload['authToken'] = $token;
        jsonResponse($payload);
    }

    public function logout(): never
    {
        destroyCurrentSession($this->pdo);
        jsonResponse(['ok' => true]);
    }

    public function me(): never
    {
        $userId = requireAuthenticatedUserId($this->pdo);
        $users = new UserRepository($this->pdo);
        $user = $users->findById($userId);
        if ($user === null) {
            jsonError('User not found', 404);
        }

        $profiles = new UserProfileRepository($this->pdo);
        $settings = new UserSettingsRepository($this->pdo);
        jsonResponse(serializeAuthPayload(
            $user,
            $profiles->findByUserId($userId),
            $settings->findByUserId($userId),
        ));
    }
}
