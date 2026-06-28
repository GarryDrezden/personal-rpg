import { Router } from 'express';
import { isUserDataType } from '../config.js';
import { prisma, serializeProfile, serializeSettings } from '../lib/prisma.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { getUserDataMap, upsertUserData } from '../services/authService.js';
import {
  dataPutSchema,
  profilePatchSchema,
  settingsPatchSchema,
} from '../validation/schemas.js';

export const dataRouter = Router();

dataRouter.use(requireAuth);

dataRouter.get('/', async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const [profile, settings, data] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.userSettings.findUnique({ where: { userId } }),
    getUserDataMap(userId),
  ]);
  if (!profile || !settings) {
    res.status(404).json({ error: 'Profile or settings not found' });
    return;
  }
  res.json({
    profile: serializeProfile(profile),
    settings: serializeSettings(settings),
    data,
  });
});

dataRouter.get('/:type', async (req: AuthedRequest, res) => {
  const type = String(req.params.type);
  if (!isUserDataType(type)) {
    res.status(400).json({ error: 'Unknown data type' });
    return;
  }
  const row = await prisma.userData.findUnique({
    where: { userId_type: { userId: req.userId!, type } },
  });
  res.json({ type, payload: row?.payload ?? null });
});

dataRouter.put('/:type', async (req: AuthedRequest, res) => {
  const type = String(req.params.type);
  if (!isUserDataType(type)) {
    res.status(400).json({ error: 'Unknown data type' });
    return;
  }
  const parsed = dataPutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }
  const row = await upsertUserData(req.userId!, type, parsed.data.payload);
  res.json({ type, payload: row.payload, updatedAt: row.updatedAt.toISOString() });
});

export const profileRouter = Router();
profileRouter.use(requireAuth);

profileRouter.patch('/', async (req: AuthedRequest, res) => {
  const parsed = profilePatchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' });
    return;
  }
  const profile = await prisma.userProfile.update({
    where: { userId: req.userId! },
    data: parsed.data,
  });
  res.json(serializeProfile(profile));
});

export const settingsRouter = Router();
settingsRouter.use(requireAuth);

settingsRouter.patch('/', async (req: AuthedRequest, res) => {
  const parsed = settingsPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' });
    return;
  }
  const settings = await prisma.userSettings.update({
    where: { userId: req.userId! },
    data: parsed.data,
  });
  res.json(serializeSettings(settings));
});
