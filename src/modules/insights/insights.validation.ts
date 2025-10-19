import { z } from 'zod';

export const queryInsightsSchema = z.object({
  type: z.enum(['IMPROVEMENT_TIP', 'BEST_TIME', 'CONSISTENCY', 'ACHIEVEMENT', 'RECOMMENDATION']).optional(),
  unread: z.string().transform(val => val === 'true').optional(),
  limit: z.string().transform(Number).default('10'),
});

export type QueryInsightsInput = z.infer<typeof queryInsightsSchema>;

