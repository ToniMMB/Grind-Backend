import { z } from 'zod';
export declare const createFocusBlockSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    startTime: z.ZodString;
    endTime: z.ZodString;
    daysOfWeek: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    description?: string | undefined;
    icon?: string | undefined;
    color?: string | undefined;
}, {
    name: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    description?: string | undefined;
    icon?: string | undefined;
    color?: string | undefined;
}>, {
    name: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    description?: string | undefined;
    icon?: string | undefined;
    color?: string | undefined;
}, {
    name: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    description?: string | undefined;
    icon?: string | undefined;
    color?: string | undefined;
}>;
export declare const updateFocusBlockSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
    daysOfWeek: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    icon?: string | undefined;
    color?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
    daysOfWeek?: number[] | undefined;
    isActive?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    icon?: string | undefined;
    color?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
    daysOfWeek?: number[] | undefined;
    isActive?: boolean | undefined;
}>;
export declare const queryFocusBlocksSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<["PREDEFINED", "CUSTOM", "ALL"]>>;
    active: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
}, "strip", z.ZodTypeAny, {
    type?: "PREDEFINED" | "CUSTOM" | "ALL" | undefined;
    active?: boolean | undefined;
}, {
    type?: "PREDEFINED" | "CUSTOM" | "ALL" | undefined;
    active?: string | undefined;
}>;
export type CreateFocusBlockInput = z.infer<typeof createFocusBlockSchema>;
export type UpdateFocusBlockInput = z.infer<typeof updateFocusBlockSchema>;
export type QueryFocusBlocksInput = z.infer<typeof queryFocusBlocksSchema>;
//# sourceMappingURL=focus-blocks.validation.d.ts.map