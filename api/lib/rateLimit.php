<?php

declare(strict_types=1);

require_once __DIR__ . '/response.php';

function clientIpAddress(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $clean = preg_replace('/[^0-9a-fA-F:.]/', '', (string) $ip);
    return $clean !== '' ? $clean : '0.0.0.0';
}

function authThrottleDir(): string
{
    return dirname(__DIR__) . '/sessions/throttle';
}

function authThrottleFile(string $bucket): string
{
    $ip = clientIpAddress();
    return authThrottleDir() . '/' . hash('sha256', $bucket . '|' . $ip) . '.json';
}

/**
 * Lightweight IP throttle for login/register. Shared-hosting safe (files under denied sessions/).
 */
function assertAuthRateLimit(string $bucket, int $maxAttempts = 8, int $windowSeconds = 900): void
{
    $dir = authThrottleDir();
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }

    $file = authThrottleFile($bucket);
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $raw = file_get_contents($file);
        $data = is_string($raw) ? json_decode($raw, true) : null;
        if (is_array($data)) {
            foreach ($data as $t) {
                if (is_int($t) && $t > $now - $windowSeconds) {
                    $hits[] = $t;
                }
            }
        }
    }

    if (count($hits) >= $maxAttempts) {
        jsonError('Слишком много попыток. Подождите несколько минут.', 429);
    }
}

function recordAuthRateLimitFailure(string $bucket, int $windowSeconds = 900): void
{
    $dir = authThrottleDir();
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }

    $file = authThrottleFile($bucket);
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $raw = file_get_contents($file);
        $data = is_string($raw) ? json_decode($raw, true) : null;
        if (is_array($data)) {
            foreach ($data as $t) {
                if (is_int($t) && $t > $now - $windowSeconds) {
                    $hits[] = $t;
                }
            }
        }
    }
    $hits[] = $now;
    @file_put_contents($file, json_encode($hits), LOCK_EX);
}
