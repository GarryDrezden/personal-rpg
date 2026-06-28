<?php

declare(strict_types=1);

require_once __DIR__ . '/../repositories/AuthSessionRepository.php';

function authConfig(): array
{
    if (!is_file(__DIR__ . '/../config/config.php')) {
        return [];
    }
    require_once __DIR__ . '/../config/database.php';
    return appConfig()['auth'] ?? [];
}

function cookieName(): string
{
    return authConfig()['cookie_name'] ?? 'pr_session';
}

function isSecureConnection(): bool
{
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        return true;
    }
    if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
        return true;
    }
    if (isset($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] === 'on') {
        return true;
    }
    if (is_file(__DIR__ . '/../config/config.php')) {
        $cfg = authConfig();
        if (!empty($cfg['secure_cookie'])) {
            return true;
        }
    }
    return false;
}

function sessionDays(): int
{
    return (int) (authConfig()['session_days'] ?? 30);
}

function createSessionToken(): string
{
    return bin2hex(random_bytes(32));
}

function hashSessionToken(string $token): string
{
    return hash('sha256', $token);
}

function readSessionTokenFromCookie(): ?string
{
    $name = cookieName();
    if (!isset($_COOKIE[$name]) || !is_string($_COOKIE[$name])) {
        return null;
    }
    $token = trim($_COOKIE[$name]);
    return $token !== '' ? $token : null;
}

function readBearerToken(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!is_string($header) || $header === '') {
        return null;
    }
    if (preg_match('/^Bearer\s+(\S+)$/i', $header, $matches) !== 1) {
        return null;
    }
    return $matches[1];
}

function readSessionToken(): ?string
{
    return readSessionTokenFromCookie() ?? readBearerToken();
}

/**
 * Set auth cookie (MySQL-backed token). Works reliably on LSAPI / shared hosting.
 */
function setSessionCookie(string $token, DateTimeImmutable $expiresAt): void
{
    $name = cookieName();
    $secure = isSecureConnection();
    $sameSite = authConfig()['same_site'] ?? 'Lax';

    setcookie($name, $token, [
        'expires' => $expiresAt->getTimestamp(),
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => $sameSite,
    ]);
}

function clearSessionCookie(): void
{
    $name = cookieName();
    $secure = isSecureConnection();
    $sameSite = authConfig()['same_site'] ?? 'Lax';

    setcookie($name, '', [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => $sameSite,
    ]);
}

function createAuthSession(PDO $pdo, int $userId): string
{
    $repo = new AuthSessionRepository($pdo);
    $repo->deleteExpired();

    $token = createSessionToken();
    $expiresAt = new DateTimeImmutable('+' . sessionDays() . ' days');
    $repo->create($userId, hashSessionToken($token), $expiresAt);
    setSessionCookie($token, $expiresAt);

    return $token;
}

function destroyCurrentSession(PDO $pdo): void
{
    $token = readSessionToken();
    if ($token !== null) {
        $repo = new AuthSessionRepository($pdo);
        $repo->deleteByTokenHash(hashSessionToken($token));
    }
    clearSessionCookie();
}

function resolveAuthenticatedUserId(PDO $pdo): ?int
{
    $token = readSessionToken();
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
    $token = readSessionToken();
    $info = [
        'cookieName' => cookieName(),
        'cookieInRequest' => readSessionTokenFromCookie() !== null,
        'bearerInRequest' => readBearerToken() !== null,
        'secureConnection' => isSecureConnection(),
        'authMode' => 'mysql_token',
    ];

    if ($token === null) {
        $info['sessionValid'] = false;
        return $info;
    }

    $repo = new AuthSessionRepository($pdo);
    $session = $repo->findValidByTokenHash(hashSessionToken($token));
    $info['sessionValid'] = $session !== null;
    $info['userId'] = $session ? (int) $session['user_id'] : null;

    return $info;
}

/**
 * No-op kept for index.php compatibility.
 */
function authSessionStart(): void
{
}
