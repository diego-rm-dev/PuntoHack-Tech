'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/core/auth';
import { hasRole } from '@/core/rbac';
import { createClient } from '@/core/supabase/server';
import { captureError } from '@/core/errors';

export async function updateUserRoleAction(profileId: string, newRole: string) {
  try {
    const currentUser = await getCurrentUser();

    // Only ADMIN or ORGANIZER can change roles
    if (!hasRole(currentUser, ['ADMIN', 'ORGANIZER'])) {
      return {
        success: false,
        error: 'Unauthorized: Only admins and organizers can change user roles',
      };
    }

    // ORGANIZER cannot create ADMIN users (only ADMIN can)
    if (newRole === 'ADMIN' && !hasRole(currentUser, ['ADMIN'])) {
      return {
        success: false,
        error: 'Only admins can assign the ADMIN role',
      };
    }

    // Validate role
    const validRoles = ['PARTICIPANT', 'JUDGE', 'ORGANIZER', 'SPONSOR', 'ADMIN'];
    if (!validRoles.includes(newRole)) {
      return {
        success: false,
        error: 'Invalid role',
      };
    }

    const supabase = await createClient();

    // Update role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        role: newRole,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', profileId);

    if (updateError) {
      throw new Error(`Failed to update role: ${updateError.message}`);
    }

    // Revalidate pages that might show role-based content
    revalidatePath('/admin/users');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: { role: newRole },
    };
  } catch (error) {
    captureError(error, {
      action: 'updateUserRole',
      profileId,
      newRole,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
