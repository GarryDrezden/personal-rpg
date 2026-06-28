import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import {
  authPayload,
  clearSessionCookie,
  createSession,
  createUserWithDefaults,
  destroySession,
  getUserDataMap,
  setSessionCookie,
  upsertUserData,
  verifyPassword,
} from '../services/authService.js';
import {
  loginBodySchema,
  registerSchema,
} from '../validation/schemas.js';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' });
    return;
  }
  const { login, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { login } });
  if (existing) {
    res.status(409).json({ error: 'Этот логин уже занят' });
    return;
  }

  try {
    const user = await createUserWithDefaults(login, password);
    const { token, expiresAt } = await createSession(user.id);
    setSessionCookie(res, token, expiresAt);
    res.status(201).json(authPayload(user));
  } catch {
    res.status(500).json({ error: 'Не удалось создать аккаунт' });
  }
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' });
    return;
  }
  const { login, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { login },
    include: { profile: true, settings: true },
  });
  if (!user) {
    res.status(401).json({ error: 'Неверный логин или пароль' });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Неверный логин или пароль' });
    return;
  }

  const { token, expiresAt } = await createSession(user.id);
  setSessionCookie(res, token, expiresAt);
  res.json(authPayload(user));
});

authRouter.post('/logout', requireAuth, async (req: AuthedRequest, res) => {
  if (req.sessionToken) {
    await destroySession(req.sessionToken);
  }
  clearSessionCookie(res);
  res.json({ ok: true });
});

authRouter.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: { profile: true, settings: true },
  });
  if (!user || !user.profile || !user.settings) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(authPayload(user));
});
