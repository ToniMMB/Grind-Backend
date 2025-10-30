import { z } from 'zod';
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>>;
    dueDate: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    description?: string | undefined;
    dueDate?: string | undefined;
    category?: string | undefined;
}, {
    title: string;
    description?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | undefined;
    dueDate?: string | undefined;
    category?: string | undefined;
}>;
export declare const updateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>>;
    completed: z.ZodOptional<z.ZodBoolean>;
    dueDate: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    title?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | undefined;
    dueDate?: string | undefined;
    category?: string | undefined;
    completed?: boolean | undefined;
    order?: number | undefined;
}, {
    description?: string | undefined;
    title?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | undefined;
    dueDate?: string | undefined;
    category?: string | undefined;
    completed?: boolean | undefined;
    order?: number | undefined;
}>;
export declare const queryTasksSchema: z.ZodObject<{
    completed: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
    category: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<["createdAt", "dueDate", "priority", "order"]>>;
    order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    order: "asc" | "desc";
    sortBy: "createdAt" | "priority" | "dueDate" | "order";
    category?: string | undefined;
    completed?: boolean | undefined;
}, {
    category?: string | undefined;
    completed?: string | undefined;
    order?: "asc" | "desc" | undefined;
    sortBy?: "createdAt" | "priority" | "dueDate" | "order" | undefined;
}>;
export declare const reorderTasksSchema: z.ZodObject<{
    taskIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    taskIds: string[];
}, {
    taskIds: string[];
}>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type QueryTasksInput = z.infer<typeof queryTasksSchema>;
export type ReorderTasksInput = z.infer<typeof reorderTasksSchema>;
//# sourceMappingURL=tasks.validation.d.ts.map