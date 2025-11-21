'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/core/auth';
import { updateUserProfile, updateUserRole } from './service';
import { captureError } from '@/core/errors';
import type { UpdateProfileInput, UpdateRoleInput } from './schemas';

/**
 * Server Actions for user/profile operations
 * These are exposed to the client and handle the request/response cycle
 */

export async function updateProfileAction(input: UpdateProfileInput) {
  try {
    const user = await requireAuth();

    const updatedProfile = await updateUserProfile(user.profile.id, input, user);

    // Invalidate cache to ensure fresh data
    revalidatePath('/dashboard');
    revalidatePath('/profile');

    return {
      success: true,
      data: updatedProfile,
    };
  } catch (error) {
    captureError(error, {
      action: 'updateProfile',
      input,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al actualizar perfil',
    };
  }
}

export async function updateRoleAction(input: UpdateRoleInput) {
  try {
    const user = await requireAuth();

    const updatedProfile = await updateUserRole(input, user);

    // Invalidate cache
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return {
      success: true,
      data: updatedProfile,
    };
  } catch (error) {
    captureError(error, {
      action: 'updateRole',
      input,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al actualizar rol',
    };
  }
}
