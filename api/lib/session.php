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

function isSecureConnection(): bool
{
    $cfg = authConfig();
    if (!empty($cfg['secure_cookie'])) {
        return true;
    }
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        return true;
    }
    if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
        return true;
    }
    if (isset($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] === 'on') {
        return true;
    }
    return false;
}

function createSessionToken(): string
{
    return bin2hex(random_bytes(32));
}

function hashSessionToken(string $token): string
{
    return hash('sha256', $token);
}

/**
 * Set session cookie via explicit Set-Cookie header (reliable on shared hosting / LSAPI).
 */
function setSessionCookie(string $token, DateTimeImmutable $expiresAt): void
{
    $name = cookieName();
    $maxAge = max(1, sessionDays() * 86400);
    $secure = isSecureConnection();
    $sameSite = authConfig()['same_site'] ?? 'Lax';

    $parts = [
        $name . '=' . rawurlencode($token),
        'Path=/',
        'Max-Age=' . $maxAge,
        'Expires=' . gmdate('D, d M Y H:i:s', $expiresAt->getTimestamp()) . ' GMT',
        'HttpOnly',
        'SameSite=' . $sameSite,
    ];
    if ($secure) {
        $parts[] = 'Secure';
    }

    header('Set-Cookie: ' . implode('; ', $parts), false);
}

function clearSessionCookie(): void
{
    $name = cookieName();
    $secure = isSecureConnection();
    $sameSite = authConfig()['same_site'] ?? 'Lax';

    $parts = [
        $name . '=',
        'Path=/',
        'Max-Age=0',
        'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'HttpOnly',
        'SameSite=' . $sameSite,
    ];
    if ($secure) {
        $parts[] = 'Secure';
    }

    header('Set-Cookie: ' . implode('; ', $parts), false);
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

function authDebugInfo(PDO $pdo): array
{
    $token = readSessionTokenFromCookie();
    $info = [
        'cookiePresent' => $token !== null,
        'cookieName' => cookieName(),
        'secureConnection' => isSecureConnection(),
    ];
    if ($token === null) {
        $info['sessionValid'] = false;
        return $info;
    }
    $hash = hashSessionToken($token);
    $repo = new AuthSessionRepository($pdo);
    $session = $repo->findValidByTokenHash($hash);
    $info['sessionValid'] = $session !== null;
    $info['userId'] = $session ? (int) $session['user_id'] : null;
    return $info;
}
