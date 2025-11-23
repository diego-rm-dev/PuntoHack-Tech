/**
 * @module modules/hackathons/queries
 * @description Data access layer for hackathons
 * Pure database operations using Supabase
 */

import { createClient } from '@/core/supabase/server';
import type {
  Hackathon,
  HackathonWithRelations,
  HackathonWithStats,
  CreateHackathonInput,
  UpdateHackathonInput,
  ListHackathonsFilters,
  Criterion,
  CreateCriterionInput,
  UpdateCriterionInput,
} from './types';

// ============================================
// HACKATHON CRUD
// ============================================

export async function createHackathon(data: CreateHackathonInput): Promise<Hackathon> {
  const supabase = await createClient();

  const { createId } = await import('@paralleldrive/cuid2');
  const hackathonId = createId();

  const { data: hackathon, error } = await supabase
    .from('hackathons')
    .insert({
      id: hackathonId,
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      status: 'DRAFT',
      startsAt: data.startsAt.toISOString(),
      endsAt: data.endsAt.toISOString(),
      registrationOpensAt: data.registrationOpensAt.toISOString(),
      registrationClosesAt: data.registrationClosesAt.toISOString(),
      judgingStartsAt: data.judgingStartsAt.toISOString(),
      judgingEndsAt: data.judgingEndsAt.toISOString(),
      maxTeamSize: data.maxTeamSize || 5,
      minTeamSize: data.minTeamSize || 1,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create hackathon: ${error.message}`);
  }

  // Create criteria if provided
  if (data.criteria && data.criteria.length > 0) {
    await createManyCriteria(hackathonId, data.criteria);
  }

  return hackathon as Hackathon;
}

export async function getHackathonById(id: string): Promise<Hackathon | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('hackathons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data as Hackathon;
}

export async function getHackathonBySlug(slug: string): Promise<HackathonWithRelations | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('hackathons')
    .select(
      `
      *,
      criteria (*),
      hackathon_participations (
        id,
        profileId,
        createdAt,
        profiles:profileId (
          id,
          name,
          avatarUrl,
          role
        )
      )
    `
    )
    .eq('slug', slug)
    .single();

  if (error) {
    return null;
  }

  // Count stats
  const [participationsCount, teamsCount, submissionsCount] = await Promise.all([
    countParticipations(data.id),
    countTeams(data.id),
    countSubmissions(data.id),
  ]);

  return {
    ...data,
    participations: data.hackathon_participations.map((p: any) => ({
      profile: {
        id: p.profiles.id,
        name: p.profiles.name,
        avatarUrl: p.profiles.avatarUrl,
        role: p.profiles.role,
      },
    })),
    _count: {
      participations: participationsCount,
      teams: teamsCount,
      submissions: submissionsCount,
    },
  } as HackathonWithRelations;
}

export async function listHackathons(
  filters?: ListHackathonsFilters
): Promise<{ hackathons: HackathonWithStats[]; total: number; limit: number; offset: number }> {
  const supabase = await createClient();

  let query = supabase.from('hackathons').select('*', { count: 'exact' });

  // Apply filters
  if (filters?.status) {
    if (Array.isArray(filters.status)) {
      query = query.in('status', filters.status);
    } else {
      query = query.eq('status', filters.status);
    }
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  // Apply pagination
  const limit = filters?.limit || 10;
  const offset = filters?.offset || 0;
  query = query.range(offset, offset + limit - 1);

  // Order by start date
  query = query.order('startsAt', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to list hackathons: ${error.message}`);
  }

  // Get stats for each hackathon
  const hackathonsWithStats = await Promise.all(
    (data || []).map(async (hackathon) => {
      const [participationsCount, teamsCount, submissionsCount] = await Promise.all([
        countParticipations(hackathon.id),
        countTeams(hackathon.id),
        countSubmissions(hackathon.id),
      ]);

      return {
        ...hackathon,
        _count: {
          participations: participationsCount,
          teams: teamsCount,
          submissions: submissionsCount,
        },
      } as HackathonWithStats;
    })
  );

  return {
    hackathons: hackathonsWithStats,
    total: count || 0,
    limit,
    offset,
  };
}

export async function updateHackathon(
  id: string,
  data: UpdateHackathonInput
): Promise<Hackathon> {
  const supabase = await createClient();

  const updateData: any = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // Convert dates to ISO strings
  if (data.startsAt) updateData.startsAt = data.startsAt.toISOString();
  if (data.endsAt) updateData.endsAt = data.endsAt.toISOString();
  if (data.registrationOpensAt)
    updateData.registrationOpensAt = data.registrationOpensAt.toISOString();
  if (data.registrationClosesAt)
    updateData.registrationClosesAt = data.registrationClosesAt.toISOString();
  if (data.judgingStartsAt) updateData.judgingStartsAt = data.judgingStartsAt.toISOString();
  if (data.judgingEndsAt) updateData.judgingEndsAt = data.judgingEndsAt.toISOString();

  const { data: updated, error } = await supabase
    .from('hackathons')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update hackathon: ${error.message}`);
  }

  return updated as Hackathon;
}

export async function deleteHackathon(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('hackathons').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete hackathon: ${error.message}`);
  }
}

// ============================================
// CRITERIA CRUD
// ============================================

export async function createCriterion(
  hackathonId: string,
  data: CreateCriterionInput
): Promise<Criterion> {
  const supabase = await createClient();

  const { createId } = await import('@paralleldrive/cuid2');
  const criterionId = createId();

  const { data: criterion, error } = await supabase
    .from('criteria')
    .insert({
      id: criterionId,
      hackathonId,
      name: data.name,
      description: data.description || null,
      weight: data.weight,
      maxScore: data.maxScore || 10,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create criterion: ${error.message}`);
  }

  return criterion as Criterion;
}

async function createManyCriteria(
  hackathonId: string,
  criteria: CreateCriterionInput[]
): Promise<void> {
  const supabase = await createClient();
  const { createId } = await import('@paralleldrive/cuid2');

  const criteriaData = criteria.map((c) => ({
    id: createId(),
    hackathonId,
    name: c.name,
    description: c.description || null,
    weight: c.weight,
    maxScore: c.maxScore || 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const { error } = await supabase.from('criteria').insert(criteriaData);

  if (error) {
    throw new Error(`Failed to create criteria: ${error.message}`);
  }
}

export async function getCriteriaByHackathon(hackathonId: string): Promise<Criterion[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('criteria')
    .select('*')
    .eq('hackathonId', hackathonId)
    .order('createdAt', { ascending: true });

  if (error) {
    throw new Error(`Failed to get criteria: ${error.message}`);
  }

  return (data as Criterion[]) || [];
}

export async function updateCriterion(
  id: string,
  data: UpdateCriterionInput
): Promise<Criterion> {
  const supabase = await createClient();

  const { data: updated, error } = await supabase
    .from('criteria')
    .update({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update criterion: ${error.message}`);
  }

  return updated as Criterion;
}

export async function deleteCriterion(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('criteria').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete criterion: ${error.message}`);
  }
}

// ============================================
// PARTICIPATION
// ============================================

export async function registerParticipant(
  hackathonId: string,
  profileId: string
): Promise<void> {
  const supabase = await createClient();
  const { createId } = await import('@paralleldrive/cuid2');

  const { error } = await supabase.from('hackathon_participations').insert({
    id: createId(),
    hackathonId,
    profileId,
  });

  if (error) {
    throw new Error(`Failed to register participant: ${error.message}`);
  }
}

export async function unregisterParticipant(
  hackathonId: string,
  profileId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('hackathon_participations')
    .delete()
    .eq('hackathonId', hackathonId)
    .eq('profileId', profileId);

  if (error) {
    throw new Error(`Failed to unregister participant: ${error.message}`);
  }
}

export async function isParticipantRegistered(
  hackathonId: string,
  profileId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('hackathon_participations')
    .select('id')
    .eq('hackathonId', hackathonId)
    .eq('profileId', profileId)
    .single();

  return !error && data !== null;
}

// ============================================
// UTILITY QUERIES
// ============================================

export async function hackathonExists(slug: string): Promise<boolean> {
  const hackathon = await getHackathonBySlug(slug);
  return hackathon !== null;
}

async function countParticipations(hackathonId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('hackathon_participations')
    .select('*', { count: 'exact', head: true })
    .eq('hackathonId', hackathonId);

  if (error) return 0;
  return count || 0;
}

async function countTeams(hackathonId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('teams')
    .select('*', { count: 'exact', head: true })
    .eq('hackathonId', hackathonId);

  if (error) return 0;
  return count || 0;
}

async function countSubmissions(hackathonId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('hackathonId', hackathonId);

  if (error) return 0;
  return count || 0;
}
