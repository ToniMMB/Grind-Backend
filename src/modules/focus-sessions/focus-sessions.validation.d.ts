import { z } from 'zod';
export declare const startSessionSchema: z.ZodObject<{
    focusBlockId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    plannedDuration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    plannedDuration: number;
    focusBlockId?: string | undefined;
}, {
    name: string;
    plannedDuration: number;
    focusBlockId?: string | undefined;
}>;
export declare const querySessionsSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "COMPLETED", "CANCELLED", "PAUSED"]>>;
    limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    offset: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
}, "strip", z.ZodTypeAny, {
    status?: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PAUSED" | undefined;
    limit?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    offset?: number | undefined;
}, {
    status?: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PAUSED" | undefined;
    limit?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    offset?: string | undefined;
}>;
export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type QuerySessionsInput = z.infer<typeof querySessionsSchema>;
//# sourceMappingURL=focus-sessions.validation.d.ts.map