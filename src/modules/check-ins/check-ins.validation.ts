import { z } from 'zod';

export const createCheckInSchema = z.object({
  focusBlockId: z.string().uuid(),
  date: z.string().transform((str) => new Date(str)),
  completed: z.boolean(),
  photoId: z.string().uuid().optional(),
});

export const getBlockCheckInsSchema = z.object({
  limit: z.string().transform((val) => parseInt(val, 10)).optional(),
});

export type CreateCheckInInput = z.infer<typeof createCheckInSchema>;
export type GetBlockCheckInsQuery = z.infer<typeof getBlockCheckInsSchema>;

