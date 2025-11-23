/**
 * @module modules/users
 * @description Users domain module - Barrel export
 * Exports all user-related functionality
 */

// Types
export type {
  UserProfile,
  CreateProfileInput,
  UpdateProfileInput,
  UpdateRoleInput,
  ListProfilesFilters,
  ProfilesListResponse,
  ActionResult,
} from './types';

// Validations
export {
  roleSchema,
  publicRoleSchema,
  createProfileSchema,
  updateProfileSchema,
  updateRoleSchema,
  listProfilesFiltersSchema,
} from './validations';

// Queries (Data Access Layer)
export {
  createProfile,
  getProfileById,
  getProfileByUserId,
  listProfiles,
  updateProfile,
  updateProfileRole,
  deleteProfile,
  profileExists,
  countProfilesByRole,
} from './queries';

// Actions (Server Actions)
export {
  completeOnboarding,
  updateUserProfile,
  updateUserRole,
  listAllProfiles,
  deleteUserProfile,
} from './actions';
