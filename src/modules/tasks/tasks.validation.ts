import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
  category: z.string().max(50).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().optional(),
  category: z.string().max(50).optional(),
  order: z.number().int().min(0).optional(),
});

export const queryTasksSchema = z.object({
  completed: z.string().transform(val => val === 'true').optional(),
  category: z.string().optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'order']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export const reorderTasksSchema = z.object({
  taskIds: z.array(z.string().uuid()).min(1, 'At least one task ID is required'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type QueryTasksInput = z.infer<typeof queryTasksSchema>;
export type ReorderTasksInput = z.infer<typeof reorderTasksSchema>;

