<?php

declare(strict_types=1);

class AuthSessionRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function create(int $userId, string $tokenHash, DateTimeImmutable $expiresAt): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO auth_sessions (user_id, token_hash, expires_at)
             VALUES (:user_id, :token_hash, :expires_at)',
        );
        $stmt->execute([
            'user_id' => $userId,
            'token_hash' => $tokenHash,
            'expires_at' => $expiresAt->format('Y-m-d H:i:s'),
        ]);
    }

    public function findValidByTokenHash(string $tokenHash): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM auth_sessions
             WHERE token_hash = :token_hash AND expires_at > NOW()
             LIMIT 1',
        );
        $stmt->execute(['token_hash' => $tokenHash]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function deleteByTokenHash(string $tokenHash): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM auth_sessions WHERE token_hash = :token_hash');
        $stmt->execute(['token_hash' => $tokenHash]);
    }

    public function deleteExpired(): void
    {
        $this->pdo->exec('DELETE FROM auth_sessions WHERE expires_at <= NOW()');
    }
}
