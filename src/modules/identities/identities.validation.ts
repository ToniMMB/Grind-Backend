import { z } from 'zod';

export const updateIdentityProgressSchema = z.object({
  type: z.string().min(1),
  category: z.string().min(1),
  name: z.string().min(1),
  increment: z.boolean().default(true),
});

export type UpdateIdentityProgressInput = z.infer<typeof updateIdentityProgressSchema>;

