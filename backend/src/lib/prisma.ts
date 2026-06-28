import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function sanitizeUser(user: {
  id: string;
  login: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  const { passwordHash: _, ...safe } = user;
  return {
    ...safe,
    createdAt: safe.createdAt.toISOString(),
    updatedAt: safe.updatedAt.toISOString(),
  };
}

export function serializeProfile(profile: {
  id: string;
  userId: string;
  displayName: string | null;
  heroGender: string | null;
  startWeight: number | null;
  targetWeight: number | null;
  height: number | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...profile,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export function serializeSettings(settings: {
  id: string;
  userId: string;
  themeId: string;
  nutritionTrackingMode: string;
  dailyCalorieLimit: number | null;
  activeCompanionId: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...settings,
    createdAt: settings.createdAt.toISOString(),
    updatedAt: settings.updatedAt.toISOString(),
  };
}
