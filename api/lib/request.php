<?php

declare(strict_types=1);

function getRequestMethod(): string
{
    return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
}

function getApiRoute(): string
{
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $uri = preg_replace('#^/api#', '', $uri) ?? '';
    $uri = rtrim($uri, '/') ?: '/';
    return $uri;
}

function getJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function routeSegment(string $route, int $index): ?string
{
    $parts = array_values(array_filter(explode('/', trim($route, '/'))));
    return $parts[$index] ?? null;
}
