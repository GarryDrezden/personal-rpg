# Node backend (experimental / VPS-only)

This folder contains the **Sprint 1 Node.js + Express + Prisma** prototype.

## Status

**Not used in production.**

Current production on shared hosting (ispmanager, PHP LSAPI, FTP deploy) uses:

```text
api/   → PHP + PDO + MySQL
dist/  → React frontend
```

## When to use

- Local experiments with Prisma
- Future VPS deployment if you migrate off shared hosting
- Reference implementation for API contracts

## Production setup

See [`docs/wiki/11-shared-hosting-php-mysql-production.md`](../docs/wiki/11-shared-hosting-php-mysql-production.md)
