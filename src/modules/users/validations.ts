/**
 * Users Module - Validation Schemas (Zod)
 * Input validation for all user-related operations
 */

import { z } from 'zod';
import { Role } from '@prisma/client';

// ============================================
// Role Validation
// ============================================

export const roleSchema = z.enum([
  Role.PARTICIPANT,
  Role.JUDGE,
  Role.ORGANIZER,
  Role.SPONSOR,
  Role.ADMIN,
]);

// Roles that can be selected during registration (no ADMIN)
export const publicRoleSchema = z.enum([
  Role.PARTICIPANT,
  Role.JUDGE,
  Role.ORGANIZER,
  Role.SPONSOR,
]);

// ============================================
// Profile Schemas
// ============================================

export const createProfileSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format').optional().nullable(),
  avatarUrl: z.string().url('Invalid URL format').optional().nullable(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().nullable(),
  techStack: z
    .array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 tech stack items')
    .optional(),
  role: publicRoleSchema,
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().nullable(),
  techStack: z
    .array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 tech stack items')
    .optional(),
});

export const updateRoleSchema = z.object({
  role: roleSchema,
});

// ============================================
// Query Filters Schemas
// ============================================

export const listProfilesFiltersSchema = z.object({
  role: roleSchema.optional(),
  search: z.string().max(100).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

// ============================================
// Type Exports (inferred from schemas)
// ============================================

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type ListProfilesFilters = z.infer<typeof listProfilesFiltersSchema>;
