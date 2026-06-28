import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { Response } from 'express';
import { config } from '../config.js';
import { prisma, sanitizeUser, serializeProfile, serializeSettings } from '../lib/prisma.js';

const BCRYPT_ROUNDS = 12;

type UserWithRelations = {
  id: string;
  login: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  profile: {
    id: string;
    userId: string;
    displayName: string | null;
    heroGender: string | null;
    startWeight: number | null;
    targetWeight: number | null;
    height: number | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  settings: {
    id: string;
    userId: string;
    themeId: string;
    nutritionTrackingMode: string;
    dailyCalorieLimit: number | null;
    activeCompanionId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId: string) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + config.sessionMaxAgeMs);
  await prisma.authSession.create({
    data: { userId, token, expiresAt },
  });
  return { token, expiresAt };
}

export async function destroySession(token: string) {
  await prisma.authSession.deleteMany({ where: { token } });
}

export async function findValidSession(token: string) {
  const session = await prisma.authSession.findUnique({
    where: { token },
    include: {
      user: {
        include: { profile: true, settings: true },
      },
    },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.authSession.delete({ where: { id: session.id } });
    return null;
  }
  return session;
}

export function setSessionCookie(res: Response, token: string, expiresAt: Date) {
  res.cookie(config.sessionCookieName, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(config.sessionCookieName, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'lax',
    path: '/',
  });
}

export async function createUserWithDefaults(login: string, password: string) {
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      login,
      passwordHash,
      profile: { create: {} },
      settings: {
        create: {
          themeId: 'darkFantasy',
          nutritionTrackingMode: 'simple',
          activeCompanionId: 'golden_chinchilla_cat',
        },
      },
    },
    include: { profile: true, settings: true },
  });
  return user;
}

export function authPayload(user: UserWithRelations) {
  return {
    user: sanitizeUser(user),
    profile: user.profile ? serializeProfile(user.profile) : null,
    settings: user.settings ? serializeSettings(user.settings) : null,
  };
}

export async function getUserDataMap(userId: string): Promise<Record<string, unknown>> {
  const rows = await prisma.userData.findMany({ where: { userId } });
  const data: Record<string, unknown> = {};
  for (const row of rows) {
    data[row.type] = row.payload;
  }
  return data;
}

export async function upsertUserData(userId: string, type: string, payload: unknown) {
  return prisma.userData.upsert({
    where: { userId_type: { userId, type } },
    create: { userId, type, payload: payload as object },
    update: { payload: payload as object },
  });
}
