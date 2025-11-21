import { z } from 'zod';

/**
 * Schema for updating user profile
 */
export const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  bio: z.string().max(500, 'La biografía no puede exceder 500 caracteres').optional(),
  techStack: z.array(z.string()).max(10, 'Máximo 10 tecnologías').optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

/**
 * Schema for user role update (admin only)
 */
export const UpdateRoleSchema = z.object({
  profileId: z.string().min(1, 'Profile ID requerido'),
  role: z.enum(['PARTICIPANT', 'JUDGE', 'ORGANIZER', 'ADMIN', 'SPONSOR']),
});

export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>;
