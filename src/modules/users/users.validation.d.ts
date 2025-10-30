import { z } from 'zod';
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    dailyGoalMinutes: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    avatar?: string | undefined;
    dailyGoalMinutes?: number | undefined;
}, {
    name?: string | undefined;
    avatar?: string | undefined;
    dailyGoalMinutes?: number | undefined;
}>;
export declare const updateSettingsSchema: z.ZodObject<{
    pushEnabled: z.ZodOptional<z.ZodBoolean>;
    hapticEnabled: z.ZodOptional<z.ZodBoolean>;
    soundEnabled: z.ZodOptional<z.ZodBoolean>;
    darkMode: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    pushEnabled?: boolean | undefined;
    hapticEnabled?: boolean | undefined;
    soundEnabled?: boolean | undefined;
    darkMode?: boolean | undefined;
}, {
    pushEnabled?: boolean | undefined;
    hapticEnabled?: boolean | undefined;
    soundEnabled?: boolean | undefined;
    darkMode?: boolean | undefined;
}>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
//# sourceMappingURL=users.validation.d.ts.map