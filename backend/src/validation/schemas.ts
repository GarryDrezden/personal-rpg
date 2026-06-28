import { z } from 'zod';

export const loginSchema = z
  .string()
  .trim()
  .min(3, 'Логин: минимум 3 символа')
  .max(40, 'Логин: максимум 40 символов')
  .regex(
    /^[a-zA-Z0-9_\-.@]+$/,
    'Логин может содержать буквы, цифры, _, -, ., @',
  );

export const passwordSchema = z
  .string()
  .min(6, 'Пароль: минимум 6 символов')
  .max(128, 'Пароль: максимум 128 символов');

export const registerSchema = z.object({
  login: loginSchema,
  password: passwordSchema,
});

export const loginBodySchema = z.object({
  login: loginSchema,
  password: passwordSchema,
});

export const profilePatchSchema = z
  .object({
    displayName: z.string().trim().max(80).nullable().optional(),
    heroGender: z.enum(['male', 'female', 'neutral']).nullable().optional(),
    startWeight: z.number().positive().nullable().optional(),
    targetWeight: z.number().positive().nullable().optional(),
    height: z.number().positive().nullable().optional(),
  })
  .refine(
    (data) => {
      if (
        data.startWeight != null &&
        data.targetWeight != null &&
        data.targetWeight >= data.startWeight
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Целевой вес должен быть меньше стартового для режима похудения',
      path: ['targetWeight'],
    },
  );

export const settingsPatchSchema = z.object({
  themeId: z.string().trim().max(32).optional(),
  nutritionTrackingMode: z.enum(['simple', 'detailed']).optional(),
  dailyCalorieLimit: z.number().int().positive().nullable().optional(),
  activeCompanionId: z.string().trim().max(64).optional(),
});

export const dataPutSchema = z.object({
  payload: z.unknown(),
});
