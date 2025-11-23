/**
 * @module modules/users/actions
 * @description Server Actions for user management
 * Centralizes all user-related business logic including onboarding, profile updates, and role management.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/core/auth';
import { requireRole } from '@/core/rbac';
import { captureError } from '@/core/errors';
import type { ActionResult, ListProfilesFilters, ProfilesListResponse } from './types';
import {
  createProfileSchema,
  updateProfileSchema,
  updateRoleSchema,
  listProfilesFiltersSchema,
} from './validations';
import {
  createProfile,
  getProfileByUserId,
  updateProfile,
  updateProfileRole,
  listProfiles,
  profileExists,
} from './queries';

/**
 * Complete user onboarding process
 * Creates user profile with validated form data
 * 
 * @param formData - Form data containing name, surname, bio, role, etc.
 * @returns Action result with created profile or error
 */
export async function completeOnboarding(
  formData: FormData
): Promise<ActionResult<{ profileId: string }>> {
  try {
    // Get authenticated user
    const { userId } = await requireAuth();

    // Check if user already has a profile
    const existingProfile = await getProfileByUserId(userId);
    if (existingProfile) {
      return {
        success: false,
        error: 'Ya has completado el proceso de onboarding',
      };
    }

    // Extract and validate form data
    const rawData = {
      userId,
      name: formData.get('name') as string,
      email: formData.get('email') as string || undefined,
      bio: formData.get('bio') as string || undefined,
      role: formData.get('role') as string,
      avatarUrl: formData.get('avatarUrl') as string || undefined,
      techStack: formData.get('techStack') 
        ? JSON.parse(formData.get('techStack') as string)
        : undefined,
    };

    const validation = createProfileSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: 'Datos inválidos',
      };
    }

    // Create profile
    const profile = await createProfile(validation.data);

    // Revalidate paths
    revalidatePath('/onboarding');
    revalidatePath('/dashboard');
    revalidatePath('/profile');

    return {
      success: true,
      data: { profileId: profile.id },
    };
  } catch (error) {
    captureError(error, {
      context: 'completeOnboarding',
      extra: { formDataKeys: Array.from(formData.keys()) },
    });
    return {
      success: false,
      error: 'Error al completar el onboarding',
    };
  }
}

/**
 * Update user profile
 * Allows users to update their own profile information
 * 
 * @param profileId - ID of the profile to update
 * @param formData - Form data with fields to update
 * @returns Action result with success status
 */
export async function updateUserProfile(
  profileId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  try {
    // Get authenticated user
    const { userId } = await requireAuth();

    // Get current profile to verify ownership
    const profile = await getProfileByUserId(userId);
    if (!profile || profile.id !== profileId) {
      return {
        success: false,
        error: 'No tienes permiso para editar este perfil',
      };
    }

    // Extract and validate form data
    const rawData = {
      name: formData.get('name') as string || undefined,
      surname: formData.get('surname') as string || undefined,
      bio: formData.get('bio') as string || undefined,
      github_username: formData.get('github_username') as string || undefined,
      linkedin_url: formData.get('linkedin_url') as string || undefined,
      portfolio_url: formData.get('portfolio_url') as string || undefined,
    };

    const validation = updateProfileSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: 'Datos inválidos',
      };
    }

    // Update profile
    await updateProfile(profileId, validation.data);

    // Revalidate paths
    revalidatePath('/profile');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    captureError(error, {
      context: 'updateUserProfile',
      extra: { profileId, formDataKeys: Array.from(formData.keys()) },
    });
    return {
      success: false,
      error: 'Error al actualizar el perfil',
    };
  }
}

/**
 * Update user role (Admin only)
 * Allows admins to change user roles
 * 
 * @param profileId - ID of the profile to update
 * @param newRole - New role to assign
 * @returns Action result with success status
 */
export async function updateUserRole(
  profileId: string,
  newRole: string
): Promise<ActionResult<void>> {
  try {
    // Require admin role
    await requireRole('ADMIN');

    // Validate role
    const validation = updateRoleSchema.safeParse({ role: newRole });
    if (!validation.success) {
      return {
        success: false,
        error: 'Rol inválido',
      };
    }

    // Check if profile exists
    const exists = await profileExists(profileId);
    if (!exists) {
      return {
        success: false,
        error: 'Perfil no encontrado',
      };
    }

    // Update role
    await updateProfileRole(profileId, validation.data.role);

    // Revalidate paths
    revalidatePath('/admin/users');
    revalidatePath('/admin');

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    captureError(error, {
      context: 'updateUserRole',
      extra: { profileId, newRole },
    });
    return {
      success: false,
      error: 'Error al actualizar el rol del usuario',
    };
  }
}

/**
 * List all user profiles (Admin only)
 * Provides paginated list of users with filtering
 * 
 * @param filters - Optional filters (role, search, pagination)
 * @returns Action result with profiles list
 */
export async function listAllProfiles(
  filters?: ListProfilesFilters
): Promise<ActionResult<ProfilesListResponse>> {
  try {
    // Require admin role
    await requireRole('ADMIN');

    // Validate filters
    let validatedFilters: ListProfilesFilters = {};
    if (filters) {
      const validation = listProfilesFiltersSchema.safeParse(filters);
      if (!validation.success) {
        return {
          success: false,
          error: 'Filtros inválidos',
        };
      }
      validatedFilters = validation.data;
    }

    // Get profiles
    const result = await listProfiles(validatedFilters);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    captureError(error, {
      context: 'listAllProfiles',
      extra: { filters },
    });
    return {
      success: false,
      error: 'Error al obtener la lista de usuarios',
    };
  }
}

/**
 * Delete user profile (Admin only)
 * Soft deletes a user profile
 * 
 * @param profileId - ID of the profile to delete
 * @returns Action result with success status
 */
export async function deleteUserProfile(
  profileId: string
): Promise<ActionResult<void>> {
  try {
    // Require admin role
    await requireRole('ADMIN');

    // Check if profile exists
    const exists = await profileExists(profileId);
    if (!exists) {
      return {
        success: false,
        error: 'Perfil no encontrado',
      };
    }

    // Note: Implement soft delete in queries.ts if needed
    // For now, we'll return an error
    return {
      success: false,
      error: 'Función de eliminación no implementada aún',
    };
  } catch (error) {
    captureError(error, {
      context: 'deleteUserProfile',
      extra: { profileId },
    });
    return {
      success: false,
      error: 'Error al eliminar el perfil',
    };
  }
}
