import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  dailyGoalMinutes: z.number().min(1).max(1440).optional(),
});

export const updateSettingsSchema = z.object({
  pushEnabled: z.boolean().optional(),
  hapticEnabled: z.boolean().optional(),
  soundEnabled: z.boolean().optional(),
  darkMode: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

