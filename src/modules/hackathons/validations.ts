/**
 * @module modules/hackathons/validations
 * @description Zod validation schemas for hackathons module
 */

import { z } from 'zod';
import { HackathonStatus } from '@prisma/client';

// ============================================
// CRITERION SCHEMAS
// ============================================

export const createCriterionSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  weight: z.number().int().min(1, 'El peso debe ser al menos 1').max(10, 'El peso máximo es 10'),
  maxScore: z.number().int().min(1).max(100).default(10),
});

export const updateCriterionSchema = createCriterionSchema.partial();

// ============================================
// HACKATHON SCHEMAS
// ============================================

export const createHackathonSchema = z
  .object({
    name: z.string().min(5, 'El nombre debe tener al menos 5 caracteres'),
    slug: z
      .string()
      .min(3, 'El slug debe tener al menos 3 caracteres')
      .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
    description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres').optional(),

    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    registrationOpensAt: z.coerce.date(),
    registrationClosesAt: z.coerce.date(),
    judgingStartsAt: z.coerce.date(),
    judgingEndsAt: z.coerce.date(),

    maxTeamSize: z.number().int().min(1).max(10).default(5),
    minTeamSize: z.number().int().min(1).max(10).default(1),

    criteria: z.array(createCriterionSchema).optional(),
  })
  .refine((data) => data.endsAt > data.startsAt, {
    message: 'La fecha de fin debe ser posterior a la fecha de inicio',
    path: ['endsAt'],
  })
  .refine((data) => data.registrationClosesAt <= data.startsAt, {
    message: 'El registro debe cerrar antes o cuando inicie el evento',
    path: ['registrationClosesAt'],
  })
  .refine((data) => data.registrationOpensAt < data.registrationClosesAt, {
    message: 'El inicio de registro debe ser anterior al cierre',
    path: ['registrationOpensAt'],
  })
  .refine((data) => data.judgingStartsAt >= data.startsAt, {
    message: 'La evaluación debe iniciar después del inicio del evento',
    path: ['judgingStartsAt'],
  })
  .refine((data) => data.judgingEndsAt > data.judgingStartsAt, {
    message: 'La evaluación debe tener una fecha de fin posterior a su inicio',
    path: ['judgingEndsAt'],
  })
  .refine((data) => data.minTeamSize <= data.maxTeamSize, {
    message: 'El tamaño mínimo del equipo no puede ser mayor al máximo',
    path: ['minTeamSize'],
  });

export const updateHackathonSchema = z
  .object({
    name: z.string().min(5).optional(),
    slug: z
      .string()
      .min(3)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    description: z.string().min(50).optional(),

    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
    registrationOpensAt: z.coerce.date().optional(),
    registrationClosesAt: z.coerce.date().optional(),
    judgingStartsAt: z.coerce.date().optional(),
    judgingEndsAt: z.coerce.date().optional(),

    maxTeamSize: z.number().int().min(1).max(10).optional(),
    minTeamSize: z.number().int().min(1).max(10).optional(),

    status: z.nativeEnum(HackathonStatus).optional(),
  })
  .partial();

// ============================================
// FILTER SCHEMAS
// ============================================

export const listHackathonsFiltersSchema = z.object({
  status: z
    .union([z.nativeEnum(HackathonStatus), z.array(z.nativeEnum(HackathonStatus))])
    .optional(),
  search: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});

// ============================================
// REGISTRATION SCHEMA
// ============================================

export const registerForHackathonSchema = z.object({
  hackathonId: z.string().cuid(),
});
