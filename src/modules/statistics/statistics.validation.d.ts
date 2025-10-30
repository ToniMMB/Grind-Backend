import { z } from 'zod';
export declare const queryProgressSchema: z.ZodObject<{
    period: z.ZodDefault<z.ZodEnum<["week", "month"]>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    period: "week" | "month";
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    startDate?: string | undefined;
    endDate?: string | undefined;
    period?: "week" | "month" | undefined;
}>;
export declare const queryHeatmapSchema: z.ZodObject<{
    year: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    month: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
}, "strip", z.ZodTypeAny, {
    month?: number | undefined;
    year?: number | undefined;
}, {
    month?: string | undefined;
    year?: string | undefined;
}>;
export type QueryProgressInput = z.infer<typeof queryProgressSchema>;
export type QueryHeatmapInput = z.infer<typeof queryHeatmapSchema>;
//# sourceMappingURL=statistics.validation.d.ts.map