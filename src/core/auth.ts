import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/core/supabase/server';
import { cache } from 'react';
import type { Role } from '@prisma/client';

export interface CurrentUser {
  userId: string;
  profile: {
    id: string;
    name: string;
    email: string | null;
    role: Role;
    avatarUrl: string | null;
    bio: string | null;
    techStack: string[];
  } | null;
}

/**
 * Get profile data for a user
 * Cached per request using React cache()
 */
const getProfileData = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, avatarUrl, bio, techStack')
    .eq('userId', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as CurrentUser['profile'];
});

/**
 * Get the current authenticated user with their profile data
 * Uses React Cache for deduplication within the same request
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const profile = await getProfileData(userId);

  return {
    userId,
    profile,
  };
}

/**
 * Get or create a profile for the current Clerk user
 * Creates profile with CUID if doesn't exist
 * Invalidates cache after creation
 */
export async function getOrCreateProfile() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    throw new Error('Unauthorized');
  }

  const supabase = await createClient();

  // Try to find existing profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('userId', userId)
    .single();

  if (existingProfile) {
    return existingProfile;
  }

  // Create new profile with CUID
  const { createId } = await import('@paralleldrive/cuid2');
  
  const { data: newProfile, error: createError } = await supabase
    .from('profiles')
    .insert({
      id: createId(),
      userId,
      name: clerkUser.fullName || clerkUser.username || 'User',
      email: clerkUser.emailAddresses[0]?.emailAddress,
      avatarUrl: clerkUser.imageUrl,
      techStack: [],
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to create profile: ${createError.message}`);
  }

  return newProfile;
}

/**
 * Require authentication - throws if not authenticated
 * Returns the current user with guaranteed non-null profile
 */
export async function requireAuth(): Promise<CurrentUser & { profile: NonNullable<CurrentUser['profile']> }> {
  const user = await getCurrentUser();
  
  if (!user?.profile) {
    throw new Error('Unauthorized: Authentication required');
  }
  
  return user as CurrentUser & { profile: NonNullable<CurrentUser['profile']> };
}

/**
 * Get just the userId quickly (cached by Clerk)
 * Useful when you don't need full profile data
 */
export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId;
}
