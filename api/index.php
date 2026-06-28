<?php

require_once __DIR__ . '/lib/request.php';
require_once __DIR__ . '/lib/routes.php';

$method = getRequestMethod();
$uri = getApiRoute();

if (isAccountsApiRoute($uri)) {
    require_once __DIR__ . '/lib/session.php';
    authSessionStart();
}

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/router-accounts.php';

if (isAccountsApiRoute($uri)) {
    dispatchAccountsApi($method, $uri);
    exit;
}

$db = new Database();
$pdo = $db->getPdo();

$method = getRequestMethod();
$uri = getApiRoute();

// GET /daily?from=&to=