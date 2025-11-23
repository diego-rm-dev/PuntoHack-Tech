'use server';

import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/core/supabase/server';
import { captureError } from '@/core/errors';

export async function completeOnboardingAction(formData: FormData) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    // Extract form data
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const techStackRaw = formData.get('techStack') as string;
    const email = formData.get('email') as string;
    const avatarUrl = formData.get('avatarUrl') as string;
    const role = formData.get('role') as string;

    // Parse tech stack
    const techStack = techStackRaw
      ? techStackRaw
          .split(',')
          .map((tech) => tech.trim())
          .filter((tech) => tech.length > 0)
      : [];

    // Validate
    if (!name || name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    // Validate role
    const validRoles = ['PARTICIPANT', 'JUDGE', 'ORGANIZER', 'SPONSOR'];
    if (!role || !validRoles.includes(role)) {
      throw new Error('Invalid role selected');
    }

    const supabase = await createClient();

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('userId', user.id)
      .single();

    if (existingProfile) {
      // Profile exists, just redirect
      redirect('/dashboard');
    }

    // Create profile with CUID
    const { createId } = await import('@paralleldrive/cuid2');

    const { error: createError } = await supabase.from('profiles').insert({
      id: createId(),
      userId: user.id,
      name,
      email,
      avatarUrl: avatarUrl || null,
      bio: bio || null,
      techStack,
      role, // Use selected role instead of hardcoded 'PARTICIPANT'
      updatedAt: new Date().toISOString(),
    });

    if (createError) {
      throw new Error(`Failed to create profile: ${createError.message}`);
    }

    // Success - redirect to dashboard
    redirect('/dashboard');
  } catch (error) {
    captureError(error, { action: 'completeOnboarding' });
    
    // If it's a redirect, re-throw it
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    
    throw error;
  }
}
