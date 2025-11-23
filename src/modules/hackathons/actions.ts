/**
 * @module modules/hackathons/actions
 * @description Server Actions for hackathon management
 */

'use server';

import { revalidatePath } from 'next/cache';
import { HackathonStatus } from '@prisma/client';
import { requireAuth } from '@/core/auth';
import { requireRole } from '@/core/rbac';
import { captureError } from '@/core/errors';
import type { 
  ActionResult, 
  ListHackathonsFilters, 
  HackathonsListResponse,
  UpdateHackathonInput,
} from './types';
import {
  createHackathonSchema,
  updateHackathonSchema,
  listHackathonsFiltersSchema,
  createCriterionSchema,
  updateCriterionSchema,
} from './validations';
import {
  createHackathon as createHackathonQuery,
  updateHackathon as updateHackathonQuery,
  deleteHackathon as deleteHackathonQuery,
  listHackathons as listHackathonsQuery,
  registerParticipant,
  unregisterParticipant,
  isParticipantRegistered,
  hackathonExists,
  createCriterion as createCriterionQuery,
  updateCriterion as updateCriterionQuery,
  deleteCriterion as deleteCriterionQuery,
  getHackathonById,
  getCriteriaByHackathon,
  getParticipantsByHackathonId,
} from './queries';
import { getProfileByUserId as getUserProfile } from '@/modules/users/queries';

/**
 * Create a new hackathon (ORGANIZER + ADMIN only)
 */
export async function createHackathon(
  formData: FormData
): Promise<ActionResult<{ slug: string }>> {
  try {
    // Require organizer or admin role
    await requireRole(['ORGANIZER', 'ADMIN']);

    // Extract and validate form data
    const rawData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string || undefined,
      startsAt: new Date(formData.get('startsAt') as string),
      endsAt: new Date(formData.get('endsAt') as string),
      registrationOpensAt: new Date(formData.get('registrationOpensAt') as string),
      registrationClosesAt: new Date(formData.get('registrationClosesAt') as string),
      judgingStartsAt: new Date(formData.get('judgingStartsAt') as string),
      judgingEndsAt: new Date(formData.get('judgingEndsAt') as string),
      maxTeamSize: formData.get('maxTeamSize')
        ? parseInt(formData.get('maxTeamSize') as string)
        : 5,
      minTeamSize: formData.get('minTeamSize')
        ? parseInt(formData.get('minTeamSize') as string)
        : 1,
      criteria: formData.get('criteria')
        ? JSON.parse(formData.get('criteria') as string)
        : undefined,
    };

    const validation = createHackathonSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || 'Datos inválidos',
      };
    }

    // Check if slug already exists
    const exists = await hackathonExists(validation.data.slug);
    if (exists) {
      return {
        success: false,
        error: 'Ya existe un hackathon con este slug',
      };
    }

    // Create hackathon
    const hackathon = await createHackathonQuery(validation.data);

    // Revalidate paths
    revalidatePath('/hackathons');
    revalidatePath(`/hackathons/${hackathon.slug}`);

    return {
      success: true,
      data: { slug: hackathon.slug },
    };
  } catch (error) {
    captureError(error, {
      context: 'createHackathon',
      extra: { formDataKeys: Array.from(formData.keys()) },
    });
    return {
      success: false,
      error: 'Error al crear el hackathon',
    };
  }
}

/**
 * Update existing hackathon (ORGANIZER + ADMIN only)
 */
export async function updateHackathon(
  id: string,
  formData: FormData
): Promise<ActionResult<void>> {
  try {
    // Require organizer or admin role
    await requireRole(['ORGANIZER', 'ADMIN']);

    // Extract and validate form data
    const rawData: Partial<UpdateHackathonInput> = {};

    if (formData.has('name')) rawData.name = formData.get('name') as string;
    if (formData.has('slug')) rawData.slug = formData.get('slug') as string;
    if (formData.has('description')) rawData.description = formData.get('description') as string;
    if (formData.has('startsAt')) rawData.startsAt = new Date(formData.get('startsAt') as string);
    if (formData.has('endsAt')) rawData.endsAt = new Date(formData.get('endsAt') as string);
    if (formData.has('registrationOpensAt'))
      rawData.registrationOpensAt = new Date(formData.get('registrationOpensAt') as string);
    if (formData.has('registrationClosesAt'))
      rawData.registrationClosesAt = new Date(formData.get('registrationClosesAt') as string);
    if (formData.has('judgingStartsAt'))
      rawData.judgingStartsAt = new Date(formData.get('judgingStartsAt') as string);
    if (formData.has('judgingEndsAt'))
      rawData.judgingEndsAt = new Date(formData.get('judgingEndsAt') as string);
    if (formData.has('maxTeamSize'))
      rawData.maxTeamSize = parseInt(formData.get('maxTeamSize') as string);
    if (formData.has('minTeamSize'))
      rawData.minTeamSize = parseInt(formData.get('minTeamSize') as string);
    if (formData.has('status')) rawData.status = formData.get('status') as HackathonStatus;

    const validation = updateHackathonSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || 'Datos inválidos',
      };
    }

    // Check if hackathon exists
    const hackathon = await getHackathonById(id);
    if (!hackathon) {
      return {
        success: false,
        error: 'Hackathon no encontrado',
      };
    }

    // Update hackathon
    await updateHackathonQuery(id, validation.data);

    // Revalidate paths
    revalidatePath('/hackathons');
    revalidatePath(`/hackathons/${hackathon.slug}`);
    revalidatePath(`/hackathons/${hackathon.slug}/dashboard`);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    captureError(error, {
      context: 'updateHackathon',
      extra: { hackathonId: id, formDataKeys: Array.from(formData.keys()) },
    });
    return {
      success: false,
      error: 'Error al actualizar el hackathon',
    };
  }
}

/**
 * Delete hackathon (ADMIN only)
 */
export async function deleteHackathon(id: string): Promise<ActionResult<void>> {
  try {
    // Require admin role
    await requireRole('ADMIN');

    // Check if hackathon exists
    const hackathon = await getHackathonById(id);
    if (!hackathon) {
      return {
        success: false,
        error: 'Hackathon no encontrado',
      };
    }

    // Delete hackathon
    await deleteHackathonQuery(id);

    // Revalidate paths
    revalidatePath('/hackathons');
    revalidatePath(`/hackathons/${hackathon.slug}`);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    captureError(error, {
      context: 'deleteHackathon',
      extra: { hackathonId: id },
    });
    return {
      success: false,
      error: 'Error al eliminar el hackathon',
    };
  }
}

/**
 * List all hackathons with filters
 */
export async function listHackathons(
  filters?: ListHackathonsFilters
): Promise<ActionResult<HackathonsListResponse>> {
  try {
    // Validate filters
    let validatedFilters: ListHackathonsFilters = {};
    if (filters) {
      const validation = listHackathonsFiltersSchema.safeParse(filters);
      if (!validation.success) {
        return {
          success: false,
          error: 'Filtros inválidos',
        };
      }
      validatedFilters = validation.data;
    }

    // Get hackathons
    const result = await listHackathonsQuery(validatedFilters);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    captureError(error, {
      context: 'listHackathons',
      extra: { filters },
    });
    return {
      success: false,
      error: 'Error al obtener la lista de hackathons',
    };
  }
}

/**
 * Register for hackathon (PARTICIPANT role)
 */
export async function registerForHackathon(hackathonId: string): Promise<ActionResult<void>> {
  try {
    // Get authenticated user
    const { userId } = await requireAuth();

    // Get user profile
    const profile = await getUserProfile(userId);
    if (!profile) {
      return {
        success: false,
        error: 'Perfil no encontrado',
      };
    }

    // Check if already registered
    const isRegistered = await isParticipantRegistered(hackathonId, profile.id);
    if (isRegistered) {
      return {
        success: false,
        error: 'Ya estás registrado en este hackathon',
      };
    }

    // Check hackathon status
    const hackathon = await getHackathonById(hackathonId);
    if (!hackathon) {
      return {
        success: false,
        error: 'Hackathon no encontrado',
      };
    }

    if (hackathon.status !== 'REGISTRATION') {
      return {
        success: false,
        error: 'El registro no está abierto para este hackathon',
      };
    }

    // Register participant
    await registerParticipant(hackathonId, profile.id);

    // Revalidate paths
    revalidatePath(`/hackathons/${hackathon.slug}`);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    captureError(error, {
      context: 'registerForHackathon',
      extra: { hackathonId },
    });
    return {
      success: false,
      error: 'Error al registrarse en el hackathon',
    };
  }
}

/**
 * Unregister from hackathon
 */
export async function unregisterFromHackathon(hackathonId: string): Promise<ActionResult<void>> {
  try {
    // Get authenticated user
    const { userId } = await requireAuth();

    // Get user profile
    const profile = await getUserProfile(userId);
    if (!profile) {
      return {
        success: false,
        error: 'Perfil no encontrado',
      };
    }

    // Check if registered
    const isRegistered = await isParticipantRegistered(hackathonId, profile.id);
    if (!isRegistered) {
      return {
        success: false,
        error: 'No estás registrado en este hackathon',
      };
    }

    // Unregister participant
    await unregisterParticipant(hackathonId, profile.id);

    // Revalidate paths
    const hackathon = await getHackathonById(hackathonId);
    if (hackathon) {
      revalidatePath(`/hackathons/${hackathon.slug}`);
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    captureError(error, {
      context: 'unregisterFromHackathon',
      extra: { hackathonId },
    });
    return {
      success: false,
      error: 'Error al cancelar el registro',
    };
  }
}

/**
 * Add criterion to hackathon (ORGANIZER + ADMIN only)
 */
export async function addCriterion(
  hackathonId: string,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    // Require organizer or admin role
    await requireRole(['ORGANIZER', 'ADMIN']);

    // Extract and validate form data
    const rawData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      weight: parseInt(formData.get('weight') as string),
      maxScore: formData.get('maxScore')
        ? parseInt(formData.get('maxScore') as string)
        : 10,
    };

    const validation = createCriterionSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || 'Datos inválidos',
      };
    }

    // Create criterion
    const criterion = await createCriterionQuery(hackathonId, validation.data);

    // Revalidate paths
    const hackathon = await getHackathonById(hackathonId);
    if (hackathon) {
      revalidatePath(`/hackathons/${hackathon.slug}`);
      revalidatePath(`/hackathons/${hackathon.slug}/dashboard`);
    }

    return {
      success: true,
      data: { id: criterion.id },
    };
  } catch (error) {
    captureError(error, {
      context: 'addCriterion',
      extra: { hackathonId, formDataKeys: Array.from(formData.keys()) },
    });
    return {
      success: false,
      error: 'Error al agregar criterio',
    };
  }
}

/**
 * Update criterion (ORGANIZER + ADMIN only)
 */
export async function updateCriterion(
  id: string,
  formData: FormData
): Promise<ActionResult<void>> {
  try {
    // Require organizer or admin role
    await requireRole(['ORGANIZER', 'ADMIN']);

    // Extract and validate form data
    const rawData: Record<string, string | number> = {};

    if (formData.has('name')) rawData.name = formData.get('name') as string;
    if (formData.has('description')) rawData.description = formData.get('description') as string;
    if (formData.has('weight')) rawData.weight = parseInt(formData.get('weight') as string);
    if (formData.has('maxScore')) rawData.maxScore = parseInt(formData.get('maxScore') as string);

    const validation = updateCriterionSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || 'Datos inválidos',
      };
    }

    // Update criterion
    await updateCriterionQuery(id, validation.data);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    captureError(error, {
      context: 'updateCriterion',
      extra: { criterionId: id, formDataKeys: Array.from(formData.keys()) },
    });
    return {
      success: false,
      error: 'Error al actualizar criterio',
    };
  }
}

/**
 * Delete criterion (ORGANIZER + ADMIN only)
 */
export async function deleteCriterion(id: string): Promise<ActionResult<void>> {
  try {
    // Require organizer or admin role
    await requireRole(['ORGANIZER', 'ADMIN']);

    // Delete criterion
    await deleteCriterionQuery(id);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    captureError(error, {
      context: 'deleteCriterion',
      extra: { criterionId: id },
    });
    return {
      success: false,
      error: 'Error al eliminar criterio',
    };
  }
}

/**
 * Get criteria by hackathon ID
 */
export async function getCriteriaByHackathonId(
  hackathonId: string
) {
  try {
    const criteria = await getCriteriaByHackathon(hackathonId);

    return {
      success: true,
      data: criteria,
    };
  } catch (error) {
    captureError(error, {
      context: 'getCriteriaByHackathonId',
      extra: { hackathonId },
    });
    return {
      success: false,
      error: 'Error al obtener criterios',
    };
  }
}

/**
 * Get participants by hackathon ID
 */
export async function getParticipantsByHackathonIdAction(
  hackathonId: string
) {
  try {
    const participants = await getParticipantsByHackathonId(hackathonId);

    return {
      success: true,
      data: participants,
    };
  } catch (error) {
    captureError(error, {
      context: 'getParticipantsByHackathonId',
      extra: { hackathonId },
    });
    return {
      success: false,
      error: 'Error al obtener participantes',
    };
  }
}

/**
 * Update hackathon status (ORGANIZER + ADMIN only)
 */
export async function updateHackathonStatus(
  id: string,
  status: HackathonStatus
): Promise<ActionResult<void>> {
  try {
    // Get user with profile (required for permission check)
    const user = await requireAuth();

    // Get hackathon
    const hackathon = await getHackathonById(id);
    if (!hackathon) {
      return {
        success: false,
        error: 'Hackathon no encontrado',
      };
    }

    // Check permissions - user must be admin
    // Note: organizerId is not part of Hackathon type in queries
    // This would need to be checked against profile ownership or admin role
    if (user.profile.role !== 'ADMIN') {
      return {
        success: false,
        error: 'No tienes permisos para modificar este hackathon',
      };
    }

    // Update status
    await updateHackathonQuery(id, { status });

    revalidatePath(`/hackathons/${hackathon.slug}`);
    revalidatePath(`/hackathons/${hackathon.slug}/dashboard`);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    captureError(error, {
      context: 'updateHackathonStatus',
      extra: { hackathonId: id, status },
    });
    return {
      success: false,
      error: 'Error al actualizar estado',
    };
  }
}

// ============================================
// SIMPLIFIED ACTIONS FOR CLIENT COMPONENTS
// ============================================

/**
 * Create criterion with object input (for client components)
 */
export async function createCriterion(
  hackathonId: string,
  data: { name: string; description?: string; weight: number; maxScore?: number }
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole(['ORGANIZER', 'ADMIN']);

    const validation = createCriterionSchema.safeParse({
      name: data.name,
      description: data.description || undefined,
      weight: data.weight,
      maxScore: data.maxScore || 10,
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || 'Datos inválidos',
      };
    }

    const criterion = await createCriterionQuery(hackathonId, validation.data);

    const hackathon = await getHackathonById(hackathonId);
    if (hackathon) {
      revalidatePath(`/hackathons/${hackathon.slug}`);
      revalidatePath(`/hackathons/${hackathon.slug}/dashboard`);
    }

    return {
      success: true,
      data: { id: criterion.id },
    };
  } catch (error) {
    captureError(error, {
      context: 'createCriterion',
      extra: { hackathonId, data },
    });
    return {
      success: false,
      error: 'Error al crear criterio',
    };
  }
}

/**
 * Update criterion with object input (for client components)
 */
export async function updateCriterionSimple(
  id: string,
  data: { name?: string; description?: string; weight?: number; maxScore?: number }
): Promise<ActionResult<void>> {
  try {
    await requireRole(['ORGANIZER', 'ADMIN']);

    const validation = updateCriterionSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || 'Datos inválidos',
      };
    }

    await updateCriterionQuery(id, validation.data);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    captureError(error, {
      context: 'updateCriterionSimple',
      extra: { criterionId: id, data },
    });
    return {
      success: false,
      error: 'Error al actualizar criterio',
    };
  }
}

/**
 * Update hackathon with object input (for client components)
 */
export async function updateHackathonSimple(
  id: string,
  data: Partial<UpdateHackathonInput>
): Promise<ActionResult<void>> {
  try {
    await requireRole(['ORGANIZER', 'ADMIN']);

    const validation = updateHackathonSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || 'Datos inválidos',
      };
    }

    await updateHackathonQuery(id, validation.data);

    const hackathon = await getHackathonById(id);
    if (hackathon) {
      revalidatePath(`/hackathons/${hackathon.slug}`);
      revalidatePath(`/hackathons/${hackathon.slug}/dashboard`);
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    captureError(error, {
      context: 'updateHackathonSimple',
      extra: { hackathonId: id, data },
    });
    return {
      success: false,
      error: 'Error al actualizar hackathon',
    };
  }
}
