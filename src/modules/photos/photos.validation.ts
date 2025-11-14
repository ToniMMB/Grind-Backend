import { z } from 'zod';

export const uploadPhotoSchema = z.object({
  url: z.string().url(),
  blockType: z.enum(['do', 'dont']),
  blockName: z.string().min(1),
});

export const getPhotosSchema = z.object({
  blockType: z.enum(['do', 'dont']).optional(),
  fromDate: z.string().transform((str) => new Date(str)).optional(),
  toDate: z.string().transform((str) => new Date(str)).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).optional(),
});

export type UploadPhotoInput = z.infer<typeof uploadPhotoSchema>;
export type GetPhotosQuery = z.infer<typeof getPhotosSchema>;

