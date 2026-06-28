<?php

declare(strict_types=1);

function jsonResponse(mixed $data, int $code = 200): never
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $message, int $code = 400): never
{
    jsonResponse(['error' => $message], $code);
}

function isoTimestamp(?string $value): ?string
{
    if ($value === null || $value === '') {
        return null;
    }
    return (new DateTimeImmutable($value))->format('c');
}
