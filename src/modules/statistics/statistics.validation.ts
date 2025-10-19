import { z } from 'zod';

export const queryProgressSchema = z.object({
  period: z.enum(['week', 'month']).default('month'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const queryHeatmapSchema = z.object({
  year: z.string().transform(Number).optional(),
  month: z.string().transform(val => {
    const num = Number(val);
    if (num < 1 || num > 12) throw new Error('Month must be between 1 and 12');
    return num;
  }).optional(),
});

export type QueryProgressInput = z.infer<typeof queryProgressSchema>;
export type QueryHeatmapInput = z.infer<typeof queryHeatmapSchema>;

