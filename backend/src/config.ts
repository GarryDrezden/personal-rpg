import 'dotenv/config';

const required = ['DATABASE_URL', 'AUTH_SECRET', 'COOKIE_SECRET'] as const;

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`Warning: ${key} is not set`);
  }
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: process.env.DATABASE_URL ?? '',
  authSecret: process.env.AUTH_SECRET ?? 'dev-auth-secret-change-me',
  cookieSecret: process.env.COOKIE_SECRET ?? 'dev-cookie-secret-change-me',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  sessionCookieName: 'pr_session',
  sessionMaxAgeMs: 1000 * 60 * 60 * 24 * 30,
  isProduction: process.env.NODE_ENV === 'production',
};

export const USER_DATA_TYPES = [
  'dailyEntries',
  'measurements',
  'achievements',
  'coinTransactions',
  'rewards',
  'momentumHistory',
  'freedomHistory',
  'bodyAbilities',
  'journeyState',
  'artifactUnlocks',
  'defeatedBosses',
  'dailyMobs',
  'customSettingsBackup',
  'legacyImport',
  'bankDeposits',
] as const;

export type UserDataType = (typeof USER_DATA_TYPES)[number];

export function isUserDataType(value: string): value is UserDataType {
  return (USER_DATA_TYPES as readonly string[]).includes(value);
}
