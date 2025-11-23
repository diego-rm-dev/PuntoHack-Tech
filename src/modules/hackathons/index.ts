/**
 * @module modules/hackathons
 * @description Centralized exports for hackathons module
 */

// Types
export type {
  Hackathon,
  Criterion,
  HackathonParticipation,
  HackathonWithCriteria,
  HackathonWithStats,
  HackathonWithRelations,
  CreateHackathonInput,
  UpdateHackathonInput,
  CreateCriterionInput,
  UpdateCriterionInput,
  ListHackathonsFilters,
  HackathonsListResponse,
  ActionResult,
} from './types';

// Validations
export {
  createHackathonSchema,
  updateHackathonSchema,
  createCriterionSchema,
  updateCriterionSchema,
  listHackathonsFiltersSchema,
  registerForHackathonSchema,
} from './validations';

// Queries
export {
  createHackathon as createHackathonQuery,
  getHackathonById,
  getHackathonBySlug,
  listHackathons as listHackathonsQuery,
  updateHackathon as updateHackathonQuery,
  deleteHackathon as deleteHackathonQuery,
  createCriterion as createCriterionQuery,
  getCriteriaByHackathon,
  updateCriterion as updateCriterionQuery,
  deleteCriterion as deleteCriterionQuery,
  registerParticipant,
  unregisterParticipant,
  isParticipantRegistered,
  hackathonExists,
} from './queries';

// Actions (Server Actions)
export {
  createHackathon,
  updateHackathon,
  deleteHackathon,
  listHackathons,
  registerForHackathon,
  unregisterFromHackathon,
  addCriterion,
  updateCriterion,
  deleteCriterion,
} from './actions';
