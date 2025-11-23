/**
 * @module modules/hackathons/types
 * @description TypeScript types for hackathons module
 */

import type { HackathonStatus } from '@prisma/client';

// ============================================
// CORE TYPES
// ============================================

export interface Hackathon {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: HackathonStatus;
  startsAt: Date;
  endsAt: Date;
  registrationOpensAt: Date;
  registrationClosesAt: Date;
  judgingStartsAt: Date;
  judgingEndsAt: Date;
  maxTeamSize: number;
  minTeamSize: number;
  maxTeams?: number | null;
  imageUrl?: string | null;
  prizes?: string | null;
  rules?: string | null;
  organizerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Criterion {
  id: string;
  hackathonId: string;
  name: string;
  description: string | null;
  weight: number;
  maxScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HackathonParticipation {
  id: string;
  hackathonId: string;
  profileId: string;
  createdAt: Date;
}

export interface ParticipantProfile {
  id: string;
  name: string;
  email: string | null;
  role: string;
  avatarUrl: string | null;
  createdAt: Date;
}

// ============================================
// EXTENDED TYPES (WITH RELATIONS)
// ============================================

export interface HackathonWithCriteria extends Hackathon {
  criteria: Criterion[];
}

export interface HackathonWithStats extends Hackathon {
  _count: {
    participations: number;
    teams: number;
    submissions: number;
  };
}

export interface HackathonWithRelations extends Hackathon {
  criteria: Criterion[];
  participations: Array<{
    profile: {
      id: string;
      name: string;
      avatarUrl: string | null;
      role: string;
    };
  }>;
  _count: {
    participations: number;
    teams: number;
    submissions: number;
  };
  imageUrl?: string | null;
  maxTeams?: number | null;
  prizes?: string | null;
  rules?: string | null;
  organizerId?: string | null;
}

// ============================================
// INPUT TYPES
// ============================================

export interface CreateHackathonInput {
  name: string;
  slug: string;
  description?: string;
  startsAt: Date;
  endsAt: Date;
  registrationOpensAt: Date;
  registrationClosesAt: Date;
  judgingStartsAt: Date;
  judgingEndsAt: Date;
  maxTeamSize?: number;
  minTeamSize?: number;
  criteria?: CreateCriterionInput[];
}

export interface UpdateHackathonInput {
  name?: string;
  slug?: string;
  description?: string;
  startsAt?: Date;
  endsAt?: Date;
  registrationOpensAt?: Date;
  registrationClosesAt?: Date;
  judgingStartsAt?: Date;
  judgingEndsAt?: Date;
  maxTeamSize?: number;
  minTeamSize?: number;
  status?: HackathonStatus;
}

export interface CreateCriterionInput {
  name: string;
  description?: string;
  weight: number;
  maxScore?: number;
}

export interface UpdateCriterionInput {
  name?: string;
  description?: string;
  weight?: number;
  maxScore?: number;
}

// ============================================
// FILTER TYPES
// ============================================

export interface ListHackathonsFilters {
  status?: HackathonStatus | HackathonStatus[];
  search?: string;
  limit?: number;
  offset?: number;
}

export interface HackathonsListResponse {
  hackathons: HackathonWithStats[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================
// ACTION RESULT TYPES
// ============================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
