<?php

declare(strict_types=1);

function isAccountsApiRoute(string $route): bool
{
    if (str_starts_with($route, '/auth/')) {
        return true;
    }
    if ($route === '/data' || str_starts_with($route, '/data/')) {
        return true;
    }
    if ($route === '/profile' || $route === '/settings') {
        return true;
    }
    return false;
}
