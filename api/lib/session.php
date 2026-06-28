<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../repositories/AuthSessionRepository.php';

function authConfig(): array
{
    return appConfig()['auth'] ?? [];
}

function cookieName(): string
{
    return authConfig()['cookie_name'] ?? 'pr_session';
}

function createSessionToken(): string
{
    return bin2hex(random_bytes(32));
}

function hashSessionToken(string $token): string
{
    return hash('sha256', $token);
}

function setSessionCookie(string $token, DateTimeImmutable $expiresAt): void
{
    $cfg = authConfig();
    $secure = !empty($cfg['secure_cookie']);
    $sameSite = $cfg['same_site'] ?? 'Lax';

    setcookie(cookieName(), $token, [
        'expires' => $expiresAt->getTimestamp(),
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => $sameSite,
    ]);
}

function clearSessionCookie(): void
{
    $cfg = authConfig();
    setcookie(cookieName(), '', [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => !empty($cfg['secure_cookie']),
        'httponly' => true,
        'samesite' => $cfg['same_site'] ?? 'Lax',
    ]);
}

function readSessionTokenFromCookie(): ?string
{
    $name = cookieName();
    return isset($_COOKIE[$name]) && is_string($_COOKIE[$name]) && $_COOKIE[$name] !== ''
        ? $_COOKIE[$name]
        : null;
}

function sessionDays(): int
{
    return (int) (authConfig()['session_days'] ?? 30);
}

function createAuthSession(PDO $pdo, int $userId): string
{
    $repo = new AuthSessionRepository($pdo);
    $repo->deleteExpired();

    $token = createSessionToken();
    $expiresAt = (new DateTimeImmutable('+' . sessionDays() . ' days'));
    $repo->create($userId, hashSessionToken($token), $expiresAt);
    setSessionCookie($token, $expiresAt);

    return $token;
}

function destroyCurrentSession(PDO $pdo): void
{
    $token = readSessionTokenFromCookie();
    if ($token !== null) {
        $repo = new AuthSessionRepository($pdo);
        $repo->deleteByTokenHash(hashSessionToken($token));
    }
    clearSessionCookie();
}

function resolveAuthenticatedUserId(PDO $pdo): ?int
{
    $token = readSessionTokenFromCookie();
    if ($token === null) {
        return null;
    }

    $repo = new AuthSessionRepository($pdo);
    $session = $repo->findValidByTokenHash(hashSessionToken($token));
    if ($session === null) {
        return null;
    }

    return (int) $session['user_id'];
}

function requireAuthenticatedUserId(PDO $pdo): int
{
    $userId = resolveAuthenticatedUserId($pdo);
    if ($userId === null) {
        jsonError('Unauthorized', 401);
    }
    return $userId;
}
