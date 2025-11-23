/**
 * Users Module - Types & Interfaces
 * Domain models and type definitions for user management
 */

import type { Role } from '@prisma/client';

// ============================================
// Domain Models
// ============================================

export interface UserProfile {
  id: string;
  userId: string; // Clerk user ID
  name: string;
  email: string | null;
  avatarUrl: string | null;
  bio: string | null;
  techStack: string[];
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithProfile {
  userId: string;
  email: string | null;
  profile: UserProfile;
}

// ============================================
// Input Types (DTOs)
// ============================================

export interface CreateProfileInput {
  userId: string;
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  techStack?: string[];
  role: Role;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string | null;
  techStack?: string[];
}

export interface UpdateRoleInput {
  role: Role;
}

// ============================================
// Query Filters
// ============================================

export interface ListProfilesFilters {
  role?: Role;
  search?: string;
  limit?: number;
  offset?: number;
}

// ============================================
// Response Types
// ============================================

export interface ProfilesListResponse {
  profiles: UserProfile[];
  total: number;
  limit: number;
  offset: number;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
