import { UpdateProfileSchema, UpdateRoleSchema, type UpdateProfileInput, type UpdateRoleInput } from './schemas';
import * as repository from './repository';
import { ValidationError, NotFoundError } from '@/core/errors';
import type { CurrentUser } from '@/core/auth';
import { assertRole } from '@/core/rbac';

/**
 * Service layer for user/profile operations
 * Contains business logic, validation, and RBAC checks
 */

export async function updateUserProfile(
  profileId: string,
  input: UpdateProfileInput,
  currentUser: CurrentUser
) {
  // Validate input
  const validated = UpdateProfileSchema.parse(input);

  // Check permissions: users can only update their own profile
  if (currentUser.profile?.id !== profileId) {
    throw new ValidationError('No puedes modificar el perfil de otro usuario');
  }

  // Verify profile exists
  const existingProfile = await repository.getProfileById(profileId);
  if (!existingProfile) {
    throw new NotFoundError('Perfil no encontrado');
  }

  // Update profile
  return repository.updateProfile(profileId, validated);
}

export async function updateUserRole(
  input: UpdateRoleInput,
  currentUser: CurrentUser
) {
  // Only ADMIN can change roles
  assertRole(currentUser, ['ADMIN']);

  // Validate input
  const validated = UpdateRoleSchema.parse(input);

  // Verify target profile exists
  const targetProfile = await repository.getProfileById(validated.profileId);
  if (!targetProfile) {
    throw new NotFoundError('Usuario no encontrado');
  }

  // Prevent admins from removing their own admin role
  if (
    targetProfile.id === currentUser.profile?.id &&
    validated.role !== 'ADMIN' &&
    currentUser.profile?.role === 'ADMIN'
  ) {
    throw new ValidationError('No puedes remover tu propio rol de administrador');
  }

  // Update role
  return repository.updateProfileRole(validated.profileId, validated.role);
}

export async function getProfile(profileId: string) {
  const profile = await repository.getProfileById(profileId);
  
  if (!profile) {
    throw new NotFoundError('Perfil no encontrado');
  }

  return profile;
}

export async function listProfilesByRole(role: string) {
  return repository.listProfiles({ role });
}
