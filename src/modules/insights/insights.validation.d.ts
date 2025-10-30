import { z } from 'zod';
export declare const queryInsightsSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<["IMPROVEMENT_TIP", "BEST_TIME", "CONSISTENCY", "ACHIEVEMENT", "RECOMMENDATION"]>>;
    unread: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
    limit: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    type?: "IMPROVEMENT_TIP" | "BEST_TIME" | "CONSISTENCY" | "ACHIEVEMENT" | "RECOMMENDATION" | undefined;
    unread?: boolean | undefined;
}, {
    type?: "IMPROVEMENT_TIP" | "BEST_TIME" | "CONSISTENCY" | "ACHIEVEMENT" | "RECOMMENDATION" | undefined;
    limit?: string | undefined;
    unread?: string | undefined;
}>;
export type QueryInsightsInput = z.infer<typeof queryInsightsSchema>;
//# sourceMappingURL=insights.validation.d.ts.map