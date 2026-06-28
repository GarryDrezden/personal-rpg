<?php

declare(strict_types=1);

require_once __DIR__ . '/lib/routes.php';

/**
 * Dispatch auth/data/profile/settings routes (MySQL production API).
 */
function dispatchAccountsApi(string $method, string $route): bool
{
    if (!isAccountsApiRoute($route)) {
        return false;
    }

    require_once __DIR__ . '/config/database.php';
    require_once __DIR__ . '/lib/request.php';
    require_once __DIR__ . '/lib/response.php';
    require_once __DIR__ . '/lib/session.php';
    require_once __DIR__ . '/controllers/AuthController.php';
    require_once __DIR__ . '/controllers/DataController.php';
    require_once __DIR__ . '/controllers/ProfileController.php';
    require_once __DIR__ . '/controllers/SettingsController.php';

    try {
        $pdo = mysqlPdo();
    } catch (Throwable $e) {
        $debug = false;
        try {
            $cfg = appConfig();
            $debug = !empty($cfg['app']['debug']);
        } catch (Throwable) {
        }
        jsonError($debug ? $e->getMessage() : 'API configuration error', 503);
    }

    $body = getJsonBody();

    if ($route === '/auth/register' && $method === 'POST') {
        (new AuthController($pdo))->register($body);
    }
    if ($route === '/auth/login' && $method === 'POST') {
        (new AuthController($pdo))->login($body);
    }
    if ($route === '/auth/logout' && $method === 'POST') {
        (new AuthController($pdo))->logout();
    }
    if ($route === '/auth/me' && $method === 'GET') {
        (new AuthController($pdo))->me();
    }
    if ($route === '/auth/debug' && $method === 'GET') {
        $cfg = appConfig();
        if (empty($cfg['app']['debug'])) {
            jsonError('Not found', 404);
        }
        jsonResponse(authDebugInfo($pdo));
    }

    $data = new DataController($pdo);

    if ($route === '/data' && $method === 'GET') {
        $data->getAll();
    }
    if ($route === '/data' && $method === 'PUT') {
        $data->putBulk($body);
    }
    if (preg_match('#^/data/([a-zA-Z0-9_]+)$#', $route, $m)) {
        $type = $m[1];
        if ($method === 'GET') {
            $data->getType($type);
        }
        if ($method === 'PUT') {
            $data->putType($type, $body);
        }
    }

    if ($route === '/profile' && $method === 'PATCH') {
        (new ProfileController($pdo))->patch($body);
    }

    if ($route === '/settings' && $method === 'PATCH') {
        (new SettingsController($pdo))->patch($body);
    }

    jsonError('Not found', 404);
}
