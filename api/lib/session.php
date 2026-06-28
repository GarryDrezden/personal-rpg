<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

function authConfig(): array
{
    if (!is_file(__DIR__ . '/../config/config.php')) {
        return [];
    }
    return appConfig()['auth'] ?? [];
}

function cookieName(): string
{
    if (is_file(__DIR__ . '/../config/config.php')) {
        return authConfig()['cookie_name'] ?? 'pr_session';
    }
    return 'pr_session';
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
    if (is_file(__DIR__ . '/../config/config.php')) {
        return (int) (authConfig()['session_days'] ?? 30);
    }
    return 30;
}

/**
 * Start PHP native session (reliable on shared hosting / LSAPI).
 * Must run before any response headers.
 */
function sessionSavePath(): string
{
    $candidates = [
        __DIR__ . '/../sessions',
        rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . '/fit-rpg-sessions',
    ];

    foreach ($candidates as $path) {
        if (!is_dir($path)) {
            @mkdir($path, 0755, true);
        }
        if (is_dir($path) && is_writable($path)) {
            return $path;
        }
    }

    return $candidates[0];
}

function authSessionStart(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $name = cookieName();
    $lifetime = sessionDays() * 86400;
    $secure = isSecureConnection();
    $sameSite = 'Lax';
    if (is_file(__DIR__ . '/../config/config.php')) {
        $sameSite = authConfig()['same_site'] ?? 'Lax';
    }

    session_save_path(sessionSavePath());
    session_name($name);
    session_set_cookie_params([
        'lifetime' => $lifetime,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => $sameSite,
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_start();
}

function createAuthSession(PDO $pdo, int $userId): void
{
    authSessionStart();
    session_regenerate_id(true);
    $_SESSION['user_id'] = $userId;
    $_SESSION['auth_at'] = time();
}

function destroyCurrentSession(PDO $pdo): void
{
    authSessionStart();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires' => time() - 42000,
            'path' => $params['path'] ?: '/',
            'domain' => $params['domain'] ?? '',
            'secure' => (bool) ($params['secure'] ?? false),
            'httponly' => (bool) ($params['httponly'] ?? true),
            'samesite' => $params['samesite'] ?? 'Lax',
        ]);
    }
    session_destroy();
}

function resolveAuthenticatedUserId(PDO $pdo): ?int
{
    authSessionStart();
    if (!isset($_SESSION['user_id'])) {
        return null;
    }
    $userId = (int) $_SESSION['user_id'];
    return $userId > 0 ? $userId : null;
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
    authSessionStart();
    return [
        'sessionActive' => session_status() === PHP_SESSION_ACTIVE,
        'sessionName' => session_name(),
        'sessionIdPresent' => session_id() !== '',
        'cookieName' => cookieName(),
        'cookieInRequest' => isset($_COOKIE[cookieName()]),
        'userId' => $_SESSION['user_id'] ?? null,
        'secureConnection' => isSecureConnection(),
        'sessionSavePath' => session_save_path(),
        'sessionSavePathWritable' => is_writable(session_save_path()),
    ];
}
