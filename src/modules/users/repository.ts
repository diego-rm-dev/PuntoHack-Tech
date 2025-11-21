import { createClient } from '@/lib/supabase/server';
import type { UpdateProfileInput, UpdateRoleInput } from './schemas';

/**
 * Repository pattern for Profile operations
 * Pure database access functions - no business logic here
 */

export async function updateProfile(
  profileId: string,
  data: UpdateProfileInput
) {
  const supabase = await createClient();

  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update({
      name: data.name,
      bio: data.bio,
      techStack: data.techStack,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', profileId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return updatedProfile;
}

export async function getProfileById(profileId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function getProfileByUserId(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('userId', userId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function updateProfileRole(
  profileId: string,
  role: UpdateRoleInput['role']
) {
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

  return data;
}

export async function listProfiles(filters?: {
  role?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from('profiles')
    .select('id, userId, name, email, role, avatarUrl, techStack, createdAt');

  if (filters?.role) {
    query = query.eq('role', filters.role);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list profiles: ${error.message}`);
  }

  return data;
}
