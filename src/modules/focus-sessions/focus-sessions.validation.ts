import { z } from 'zod';

export const startSessionSchema = z.object({
  focusBlockId: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required').max(100),
  plannedDuration: z.number().min(1, 'Duration must be at least 1 minute').max(1440),
});

export const querySessionsSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'PAUSED']).optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type QuerySessionsInput = z.infer<typeof querySessionsSchema>;

