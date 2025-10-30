"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderTasksSchema = exports.queryTasksSchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(200),
    description: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
    dueDate: zod_1.z.string().datetime().optional(),
    category: zod_1.z.string().max(50).optional(),
});
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    description: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    completed: zod_1.z.boolean().optional(),
    dueDate: zod_1.z.string().datetime().optional(),
    category: zod_1.z.string().max(50).optional(),
    order: zod_1.z.number().int().min(0).optional(),
});
exports.queryTasksSchema = zod_1.z.object({
    completed: zod_1.z.string().transform(val => val === 'true').optional(),
    category: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['createdAt', 'dueDate', 'priority', 'order']).default('createdAt'),
    order: zod_1.z.enum(['asc', 'desc']).default('asc'),
});
exports.reorderTasksSchema = zod_1.z.object({
    taskIds: zod_1.z.array(zod_1.z.string().uuid()).min(1, 'At least one task ID is required'),
});
//# sourceMappingURL=tasks.validation.js.map