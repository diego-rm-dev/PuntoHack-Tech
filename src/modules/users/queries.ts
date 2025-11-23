/**
 * Users Module - Data Access Layer (Repository Pattern)
 * Pure database operations - no business logic here
 * 
 * Usage: Called by service layer or directly by actions for simple CRUD
 */

import { createClient } from '@/core/supabase/server';
import { db } from '@/core/db';
import type {
  UserProfile,
  CreateProfileInput,
  UpdateProfileInput,
  UpdateRoleInput,
  ListProfilesFilters,
} from './types';

// ============================================
// CREATE
// ============================================

export async function createProfile(data: CreateProfileInput): Promise<UserProfile> {
  const supabase = await createClient();
  
  // Generate CUID for profile
  const { createId } = await import('@paralleldrive/cuid2');
  const profileId = createId();

  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      id: profileId,
      userId: data.userId,
      name: data.name,
      email: data.email || null,
      avatarUrl: data.avatarUrl || null,
      bio: data.bio || null,
      techStack: data.techStack || [],
      role: data.role,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create profile: ${error.message}`);
  }

  return profile as UserProfile;
}

// ============================================
// READ
// ============================================

export async function getProfileById(profileId: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (error) {
    return null;
  }

  return data as UserProfile;
}

export async function getProfileByUserId(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('userId', userId)
    .single();

  if (error) {
    return null;
  }

  return data as UserProfile;
}

export async function listProfiles(filters?: ListProfilesFilters) {
  const supabase = await createClient();

  let query = supabase
    .from('profiles')
    .select('id, userId, name, email, role, avatarUrl, techStack, createdAt, updatedAt', {
      count: 'exact',
    });

  // Apply filters
  if (filters?.role) {
    query = query.eq('role', filters.role);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  // Apply pagination
  const limit = filters?.limit || 10;
  const offset = filters?.offset || 0;
  query = query.range(offset, offset + limit - 1);

  // Order by creation date
  query = query.order('createdAt', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to list profiles: ${error.message}`);
  }

  return {
    profiles: (data as UserProfile[]) || [],
    total: count || 0,
    limit,
    offset,
  };
}

// ============================================
// UPDATE
// ============================================

export async function updateProfile(
  profileId: string,
  data: UpdateProfileInput
): Promise<UserProfile> {
  const supabase = await createClient();

  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', profileId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return updatedProfile as UserProfile;
}

export async function updateProfileRole(
  profileId: string,
  role: UpdateRoleInput['role']
): Promise<UserProfile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .update({
      role,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', profileId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update role: ${error.message}`);
  }

  return data as UserProfile;
}

// ============================================
// DELETE
// ============================================

export async function deleteProfile(profileId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('profiles').delete().eq('id', profileId);

  if (error) {
    throw new Error(`Failed to delete profile: ${error.message}`);
  }
}

// ============================================
// UTILITY QUERIES
// ============================================

export async function profileExists(userId: string): Promise<boolean> {
  const profile = await getProfileByUserId(userId);
  return profile !== null;
}

export async function countProfilesByRole(role: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', role);

  if (error) {
    throw new Error(`Failed to count profiles: ${error.message}`);
  }

  return count || 0;
}
