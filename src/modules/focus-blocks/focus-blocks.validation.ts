import { z } from 'zod';

// Validar formato HH:mm
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createFocusBlockSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  startTime: z.string().regex(timeRegex, 'Invalid time format. Use HH:mm'),
  endTime: z.string().regex(timeRegex, 'Invalid time format. Use HH:mm'),
  daysOfWeek: z.array(z.number().min(0).max(6)).min(1, 'At least one day must be selected'),
}).refine((data) => {
  // Validar que endTime sea después de startTime
  const [startHour, startMin] = data.startTime.split(':').map(Number);
  const [endHour, endMin] = data.endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return endMinutes > startMinutes;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const updateFocusBlockSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  startTime: z.string().regex(timeRegex, 'Invalid time format. Use HH:mm').optional(),
  endTime: z.string().regex(timeRegex, 'Invalid time format. Use HH:mm').optional(),
  daysOfWeek: z.array(z.number().min(0).max(6)).min(1).optional(),
  isActive: z.boolean().optional(),
});

export const queryFocusBlocksSchema = z.object({
  type: z.enum(['PREDEFINED', 'CUSTOM', 'ALL']).optional(),
  active: z.string().transform(val => val === 'true').optional(),
});

export type CreateFocusBlockInput = z.infer<typeof createFocusBlockSchema>;
export type UpdateFocusBlockInput = z.infer<typeof updateFocusBlockSchema>;
export type QueryFocusBlocksInput = z.infer<typeof queryFocusBlocksSchema>;

