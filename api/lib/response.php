<?php

declare(strict_types=1);

function jsonResponse(mixed $data, int $code = 200): never
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $message, int $code = 400, array $extra = []): never
{
    jsonResponse(['error' => $message] + $extra, $code);
}

function logApiEvent(string $event, array $context = []): void
{
    unset($context['password'], $context['token'], $context['payload'], $context['body']);
    error_log('[personal-rpg] ' . $event . ' ' . json_encode($context, JSON_UNESCAPED_UNICODE));
}

function isoTimestamp(?string $value): ?string
{
    if ($value === null || $value === '') {
        return null;
    }
    return (new DateTimeImmutable($value))->format('c');
}
