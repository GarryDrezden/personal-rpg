<?php

declare(strict_types=1);

class UserRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function findByLogin(string $login): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE login = :login LIMIT 1');
        $stmt->execute(['login' => $login]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(string $login, string $passwordHash): array
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO users (login, password_hash) VALUES (:login, :password_hash)',
        );
        $stmt->execute([
            'login' => $login,
            'password_hash' => $passwordHash,
        ]);
        $id = (int) $this->pdo->lastInsertId();
        return $this->findById($id) ?? [];
    }
}
