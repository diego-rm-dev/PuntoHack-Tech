# 🚀 Roadmap de Implementación - PuntoHack MVP

Este documento detalla el plan de implementación técnica para las fases futuras del proyecto.

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Phase 1: Hackathons Module](#phase-1-hackathons-module)
3. [Phase 2: Teams, Submissions & Evaluation](#phase-2-teams-submissions--evaluation)
4. [Phase 3: Sponsors & Challenges](#phase-3-sponsors--challenges)
5. [Consideraciones Técnicas](#consideraciones-técnicas)
6. [Estrategia de Testing](#estrategia-de-testing)
7. [Plan de Despliegue](#plan-de-despliegue)

---

## 📊 Resumen Ejecutivo

### Estado Actual (Phase 0 - 100% ✅)

```
✅ Infrastructure Core
✅ Authentication (Clerk)
✅ Database Schema (Prisma + Neon PostgreSQL)
✅ RBAC System (5 roles + UI)
✅ Admin Panel (User Management)
✅ Error Handling (Sentry)
✅ Module Pattern (users/)
✅ Client Components (5 components)
```

### Próximas Fases

| Phase | Duración | Complejidad | Prioridad | Dependencias |
|-------|----------|-------------|-----------|--------------|
| **Phase 1** | 7 días | 🟡 Media | 🔴 Alta | Phase 0 ✅ |
| **Phase 2** | 14 días | 🔴 Alta | 🟡 Media | Phase 1 |
| **Phase 3** | 7 días | 🟡 Media | 🟢 Baja | Phase 2 |

**Total Estimado**: 28 días (4 semanas)

---

## 🎪 Phase 1: Hackathons Module

### 📅 Timeline: 7 días (40-50 horas)

### 🎯 Objetivos

1. **CRUD Completo de Hackathons**
2. **Gestión de Criterios de Evaluación**
3. **Sistema de Registro de Participantes**
4. **Dashboard de Organizador**
5. **Estado del Ciclo de Vida**

---

### 📦 Estructura de Archivos

```
src/modules/hackathons/
├── queries.ts                 # 250-300 líneas
│   ├── getHackathon(slug)
│   ├── getHackathonById(id)
│   ├── listHackathons(filters?)
│   ├── getHackathonStats(id)
│   ├── getHackathonParticipants(id)
│   ├── getOrganizerHackathons(userId)
│   └── searchHackathons(query)
│
├── actions.ts                 # 300-400 líneas
│   ├── createHackathon(data)
│   ├── updateHackathon(id, data)
│   ├── deleteHackathon(id)
│   ├── publishHackathon(id)
│   ├── registerForHackathon(hackathonId)
│   ├── unregisterFromHackathon(hackathonId)
│   ├── updateHackathonStatus(id, status)
│   ├── addCriterion(hackathonId, data)
│   ├── updateCriterion(id, data)
│   └── deleteCriterion(id)
│
├── types.ts                   # 100-150 líneas
│   ├── HackathonWithRelations
│   ├── HackathonWithStats
│   ├── CreateHackathonInput
│   ├── UpdateHackathonInput
│   ├── HackathonFilters
│   └── CriterionInput
│
└── validations.ts             # 150-200 líneas
    ├── createHackathonSchema
    ├── updateHackathonSchema
    ├── criterionSchema
    └── registrationSchema

src/app/hackathons/
├── page.tsx                   # 200-250 líneas
│   # Lista pública de hackathons
│   # Filtros: status, fecha, búsqueda
│   # Grid de cards con info básica
│
├── [slug]/
│   ├── page.tsx              # 300-400 líneas
│   │   # Detalle completo del hackathon
│   │   # Tabs: Overview, Criteria, Participants, Challenges
│   │   # Botón "Register" (si aplica)
│   │
│   ├── register/
│   │   └── page.tsx          # 150-200 líneas
│   │       # Confirmación de registro
│   │       # Verificación de eligibilidad
│   │
│   └── dashboard/
│       ├── page.tsx          # 250-300 líneas
│       │   # Dashboard del organizador
│       │   # Stats: participantes, equipos, submissions
│       │   # Acciones: editar, publicar, cerrar
│       │
│       └── edit/
│           └── page.tsx      # 350-400 líneas
│               # Formulario de edición
│               # Gestión de criterios
│               # Control de estados
│
└── create/
    └── page.tsx              # 350-400 líneas
        # Formulario de creación
        # Wizard multi-step:
        # 1. Info básica
        # 2. Fechas
        # 3. Criterios
        # 4. Revisión

src/components/hackathons/
├── hackathon-card.tsx         # 100-150 líneas
│   # Card para lista
│   # Badges de status, fechas
│   # Imagen, nombre, descripción corta
│
├── hackathon-form.tsx         # 400-500 líneas
│   # Formulario reutilizable (create/edit)
│   # Validación con React Hook Form + Zod
│   # Date pickers, rich text editor
│
├── criterion-manager.tsx      # 250-300 líneas
│   # Gestión de criterios
│   # CRUD inline
│   # Drag & drop para orden
│
├── status-badge.tsx           # 50-80 líneas
│   # Badge visual por status
│   # Colores según estado
│
├── participants-list.tsx      # 150-200 líneas
│   # Lista de participantes
│   # Avatares, nombres, roles
│
└── hackathon-stats.tsx        # 200-250 líneas
    # Cards de estadísticas
    # Gráficos simples (progress bars)
```

---

### 🔧 Implementación Técnica

#### 1. Database Queries (queries.ts)

```typescript
// Ejemplo: Get Hackathon with Relations
export async function getHackathon(slug: string) {
  return await db.hackathon.findUnique({
    where: { slug },
    include: {
      criteria: true,
      participations: {
        include: {
          profile: {
            select: { id: true, name: true, avatarUrl: true, role: true }
          }
        }
      },
      teams: {
        include: {
          members: true,
          _count: { select: { members: true } }
        }
      },
      _count: {
        select: {
          participations: true,
          teams: true,
          submissions: true
        }
      }
    }
  });
}

// Ejemplo: List with Filters
export async function listHackathons(filters?: {
  status?: HackathonStatus[];
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const where = {
    ...(filters?.status && { status: { in: filters.status } }),
    ...(filters?.search && {
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    })
  };
  
  const [hackathons, total] = await Promise.all([
    db.hackathon.findMany({
      where,
      include: {
        _count: { select: { participations: true } }
      },
      orderBy: { startsAt: 'desc' },
      take: filters?.limit || 10,
      skip: filters?.offset || 0
    }),
    db.hackathon.count({ where })
  ]);
  
  return { hackathons, total };
}
```

#### 2. Server Actions (actions.ts)

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createHackathonSchema } from './validations';
import { requireRole } from '@/core/rbac';
import { captureError } from '@/core/errors';
import { db } from '@/core/db';

export async function createHackathon(formData: FormData) {
  try {
    // 1. Auth check
    const user = await getCurrentUser();
    requireRole(user, ['ORGANIZER', 'ADMIN']);
    
    // 2. Validate input
    const rawData = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      // ... más campos
    };
    
    const validated = createHackathonSchema.parse(rawData);
    
    // 3. Create in transaction
    const hackathon = await db.$transaction(async (tx) => {
      // Create hackathon
      const h = await tx.hackathon.create({
        data: {
          ...validated,
          status: 'DRAFT'
        }
      });
      
      // Create default criteria
      if (validated.criteria?.length > 0) {
        await tx.criterion.createMany({
          data: validated.criteria.map((c) => ({
            ...c,
            hackathonId: h.id
          }))
        });
      }
      
      return h;
    });
    
    // 4. Revalidate & redirect
    revalidatePath('/hackathons');
    revalidatePath(`/hackathons/${hackathon.slug}`);
    redirect(`/hackathons/${hackathon.slug}/dashboard`);
    
  } catch (error) {
    captureError(error, { context: 'createHackathon' });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create'
    };
  }
}

export async function registerForHackathon(hackathonId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    // Check if already registered
    const existing = await db.hackathonParticipation.findUnique({
      where: {
        hackathonId_profileId: {
          hackathonId,
          profileId: user.profile.id
        }
      }
    });
    
    if (existing) {
      return { success: false, error: 'Already registered' };
    }
    
    // Check hackathon status
    const hackathon = await db.hackathon.findUnique({
      where: { id: hackathonId },
      select: { status: true, registrationOpensAt: true, registrationClosesAt: true }
    });
    
    if (!hackathon || hackathon.status !== 'REGISTRATION') {
      return { success: false, error: 'Registration not open' };
    }
    
    // Create participation
    await db.hackathonParticipation.create({
      data: {
        hackathonId,
        profileId: user.profile.id
      }
    });
    
    revalidatePath(`/hackathons/${hackathonId}`);
    return { success: true };
    
  } catch (error) {
    captureError(error, { context: 'registerForHackathon', hackathonId });
    return { success: false, error: 'Registration failed' };
  }
}
```

#### 3. Validations (validations.ts)

```typescript
import { z } from 'zod';

export const criterionSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  weight: z.number().int().min(1).max(10),
  maxScore: z.number().int().min(1).max(100).default(10)
});

export const createHackathonSchema = z.object({
  name: z.string().min(5, 'Name must be at least 5 characters'),
  slug: z.string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  registrationOpensAt: z.coerce.date(),
  registrationClosesAt: z.coerce.date(),
  judgingStartsAt: z.coerce.date(),
  judgingEndsAt: z.coerce.date(),
  
  maxTeamSize: z.number().int().min(1).max(10).default(5),
  minTeamSize: z.number().int().min(1).max(10).default(1),
  
  criteria: z.array(criterionSchema).optional()
}).refine((data) => data.endsAt > data.startsAt, {
  message: 'End date must be after start date',
  path: ['endsAt']
}).refine((data) => data.registrationClosesAt <= data.startsAt, {
  message: 'Registration must close before event starts',
  path: ['registrationClosesAt']
});

export const updateHackathonSchema = createHackathonSchema.partial();
```

#### 4. UI Components

**hackathon-form.tsx** (React Hook Form + Zod):
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createHackathonSchema } from '@/modules/hackathons/validations';
import { InteractiveButton } from '@/components/client/interactive-button';

export function HackathonForm({ onSubmit, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(createHackathonSchema),
    defaultValues
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name</label>
        <input {...register('name')} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>
      
      <div>
        <label>Slug</label>
        <input {...register('slug')} />
        {errors.slug && <span>{errors.slug.message}</span>}
      </div>
      
      {/* Date pickers */}
      <div>
        <label>Start Date</label>
        <input type="datetime-local" {...register('startsAt')} />
        {errors.startsAt && <span>{errors.startsAt.message}</span>}
      </div>
      
      {/* Criteria Manager */}
      <CriterionManager />
      
      <InteractiveButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Hackathon'}
      </InteractiveButton>
    </form>
  );
}
```

---

### ✅ Checklist de Implementación

**Día 1-2: Setup & Queries**
- [ ] Crear estructura de módulo `modules/hackathons/`
- [ ] Implementar `queries.ts` (todas las funciones de lectura)
- [ ] Implementar `types.ts` (interfaces TypeScript)
- [ ] Escribir tests unitarios para queries

**Día 3-4: Actions & Validation**
- [ ] Implementar `validations.ts` (schemas Zod)
- [ ] Implementar `actions.ts` (CRUD + registro)
- [ ] Agregar RBAC checks en todas las actions
- [ ] Manejar errores con `captureError()`
- [ ] Tests para validaciones

**Día 5: UI - List & Detail**
- [ ] Crear `/hackathons/page.tsx` (lista pública)
- [ ] Crear `hackathon-card.tsx` (componente card)
- [ ] Crear `/hackathons/[slug]/page.tsx` (detalle)
- [ ] Crear `status-badge.tsx`
- [ ] Agregar filtros y búsqueda

**Día 6: UI - Create & Edit**
- [ ] Crear `/hackathons/create/page.tsx`
- [ ] Crear `hackathon-form.tsx` (con React Hook Form)
- [ ] Crear `criterion-manager.tsx`
- [ ] Implementar wizard multi-step (opcional)
- [ ] Crear página de edición

**Día 7: Dashboard & Testing**
- [ ] Crear `/hackathons/[slug]/dashboard/page.tsx`
- [ ] Crear `hackathon-stats.tsx`
- [ ] Crear `participants-list.tsx`
- [ ] Testing E2E con Playwright (opcional)
- [ ] Optimizar queries (índices, caching)

---

### 🎯 Métricas de Éxito

- ✅ ORGANIZER puede crear hackathon completo (< 5 minutos)
- ✅ Página de lista carga en < 1 segundo
- ✅ Registro funciona sin errores (100% success rate)
- ✅ Dashboard muestra stats en tiempo real
- ✅ Todos los estados del ciclo de vida funcionan
- ✅ 0 errores en Sentry durante testing

---

## 👥 Phase 2: Teams, Submissions & Evaluation

### 📅 Timeline: 14 días (70-80 horas)

### 🎯 Objetivos

1. **Sistema de Equipos con Códigos de Invitación**
2. **Submissions de Proyectos**
3. **Asignación de Jueces**
4. **Interfaz de Evaluación**
5. **Leaderboard en Tiempo Real**

---

### 📦 Estructura de Archivos

```
src/modules/teams/
├── queries.ts                 # 200-250 líneas
│   ├── getTeam(id)
│   ├── getTeamsByHackathon(hackathonId)
│   ├── getUserTeam(userId, hackathonId)
│   └── getTeamMembers(teamId)
│
├── actions.ts                 # 300-350 líneas
│   ├── createTeam(hackathonId, data)
│   ├── joinTeam(inviteCode)
│   ├── leaveTeam(teamId)
│   ├── removeTeamMember(teamId, userId)
│   └── disbandTeam(teamId)
│
├── types.ts                   # 80-100 líneas
└── validations.ts             # 100-120 líneas

src/modules/submissions/
├── queries.ts                 # 250-300 líneas
│   ├── getSubmission(id)
│   ├── getSubmissionsByHackathon(hackathonId)
│   ├── getTeamSubmission(teamId, hackathonId)
│   └── getSubmissionWithScores(id)
│
├── actions.ts                 # 350-400 líneas
│   ├── createSubmission(data)
│   ├── updateSubmission(id, data)
│   ├── deleteSubmission(id)
│   └── submitForReview(id)
│
├── types.ts                   # 100-120 líneas
└── validations.ts             # 150-180 líneas

src/modules/evaluation/
├── queries.ts                 # 300-350 líneas
│   ├── getAssignedSubmissions(judgeId, hackathonId)
│   ├── getScores(submissionId)
│   ├── getLeaderboard(hackathonId)
│   ├── getJudgeProgress(judgeId, hackathonId)
│   └── calculateFinalScores(hackathonId)
│
├── actions.ts                 # 400-450 líneas
│   ├── assignJudge(submissionId, judgeId)
│   ├── autoAssignJudges(hackathonId)
│   ├── submitScore(submissionId, criterionId, data)
│   ├── updateScore(scoreId, data)
│   └── finalizeJudging(hackathonId)
│
├── types.ts                   # 150-180 líneas
└── validations.ts             # 120-150 líneas

src/app/judge/
├── page.tsx                   # 150-200 líneas
│   # Dashboard del juez
│   # Lista de hackathons asignados
│
└── [hackathonId]/
    ├── page.tsx              # 200-250 líneas
    │   # Lista de submissions asignados
    │   # Progress bar
    │
    └── submissions/
        └── [id]/
            └── page.tsx      # 400-500 líneas
                # Detalle del submission
                # Formulario de scoring
                # Comentarios

src/components/teams/
├── team-card.tsx             # 100-120 líneas
├── team-form.tsx             # 200-250 líneas
├── invite-code-input.tsx     # 150-180 líneas
└── team-members-list.tsx     # 150-180 líneas

src/components/submissions/
├── submission-card.tsx       # 150-180 líneas
├── submission-form.tsx       # 350-400 líneas
└── submission-detail.tsx     # 250-300 líneas

src/components/evaluation/
├── score-form.tsx            # 300-350 líneas
├── leaderboard.tsx           # 250-300 líneas
├── judge-progress.tsx        # 150-180 líneas
└── criterion-score-input.tsx # 100-120 líneas
```

---

### 🔧 Implementación Técnica

#### 1. Teams - Invite Code System

```typescript
// Generate unique invite code
import { nanoid } from 'nanoid';

export async function createTeam(hackathonId: string, data: CreateTeamInput) {
  const user = await getCurrentUser();
  requireRole(user, ['PARTICIPANT']);
  
  // Check if user already in team
  const existingTeam = await getUserTeam(user.profile.id, hackathonId);
  if (existingTeam) {
    throw new Error('Already in a team for this hackathon');
  }
  
  const code = nanoid(8).toUpperCase(); // Generate 8-char code
  
  const team = await db.team.create({
    data: {
      ...data,
      hackathonId,
      code,
      members: {
        create: {
          profileId: user.profile.id // Creator is first member
        }
      }
    }
  });
  
  revalidatePath(`/hackathons/${hackathonId}`);
  return { success: true, team };
}

export async function joinTeam(inviteCode: string) {
  const user = await getCurrentUser();
  requireRole(user, ['PARTICIPANT']);
  
  // Find team by code
  const team = await db.team.findUnique({
    where: { code: inviteCode },
    include: {
      hackathon: { select: { maxTeamSize: true } },
      _count: { select: { members: true } }
    }
  });
  
  if (!team) throw new Error('Invalid invite code');
  
  // Check team capacity
  if (team._count.members >= team.hackathon.maxTeamSize) {
    throw new Error('Team is full');
  }
  
  // Add member
  await db.teamMember.create({
    data: {
      teamId: team.id,
      profileId: user.profile.id
    }
  });
  
  revalidatePath(`/hackathons/${team.hackathonId}`);
  return { success: true, team };
}
```

#### 2. Evaluation - Auto Assignment

```typescript
export async function autoAssignJudges(hackathonId: string) {
  const user = await getCurrentUser();
  requireRole(user, ['ORGANIZER', 'ADMIN']);
  
  // Get all judges for this hackathon
  const judges = await db.hackathonJudge.findMany({
    where: { hackathonId },
    select: { profileId: true }
  });
  
  if (judges.length === 0) {
    throw new Error('No judges assigned to hackathon');
  }
  
  // Get all submissions
  const submissions = await db.submission.findMany({
    where: { hackathonId },
    select: { id: true }
  });
  
  if (submissions.length === 0) {
    throw new Error('No submissions to assign');
  }
  
  // Distribute evenly (round-robin)
  const assignments: { submissionId: string; judgeId: string }[] = [];
  
  submissions.forEach((submission, index) => {
    const judgeIndex = index % judges.length;
    assignments.push({
      submissionId: submission.id,
      judgeId: judges[judgeIndex].profileId
    });
  });
  
  // Create assignments in batch
  await db.judgeSubmissionAssignment.createMany({
    data: assignments,
    skipDuplicates: true
  });
  
  revalidatePath(`/hackathons/${hackathonId}/dashboard`);
  return { success: true, count: assignments.length };
}
```

#### 3. Leaderboard Calculation

```typescript
export async function getLeaderboard(hackathonId: string) {
  // Get all submissions with scores
  const submissions = await db.submission.findMany({
    where: { hackathonId },
    include: {
      team: {
        include: {
          members: {
            include: {
              profile: { select: { name: true, avatarUrl: true } }
            }
          }
        }
      },
      scores: {
        include: {
          criterion: { select: { weight: true, maxScore: true } }
        }
      }
    }
  });
  
  // Calculate weighted scores
  const leaderboard = submissions.map((submission) => {
    const scores = submission.scores;
    
    // Group by criterion
    const criterionScores = new Map<string, number[]>();
    
    scores.forEach((score) => {
      const criterionId = score.criterionId;
      if (!criterionScores.has(criterionId)) {
        criterionScores.set(criterionId, []);
      }
      criterionScores.get(criterionId)!.push(score.value);
    });
    
    // Average scores per criterion
    let totalWeightedScore = 0;
    let totalMaxScore = 0;
    
    criterionScores.forEach((values, criterionId) => {
      const criterion = scores.find(s => s.criterionId === criterionId)!.criterion;
      const avgScore = values.reduce((sum, v) => sum + v, 0) / values.length;
      
      totalWeightedScore += avgScore * criterion.weight;
      totalMaxScore += criterion.maxScore * criterion.weight;
    });
    
    const finalScore = totalMaxScore > 0 
      ? (totalWeightedScore / totalMaxScore) * 100 
      : 0;
    
    return {
      submissionId: submission.id,
      team: submission.team,
      finalScore: Math.round(finalScore * 100) / 100, // 2 decimals
      totalJudges: new Set(scores.map(s => s.judgeId)).size
    };
  });
  
  // Sort by score
  return leaderboard.sort((a, b) => b.finalScore - a.finalScore);
}
```

---

### ✅ Checklist de Implementación

**Semana 1: Teams Module**
- [ ] Implementar queries y actions de teams
- [ ] Sistema de códigos de invitación
- [ ] Validación de capacidad de equipo
- [ ] UI para crear/unirse a equipos
- [ ] Tests

**Semana 2: Submissions Module**
- [ ] Implementar queries y actions de submissions
- [ ] Formulario de submission (múltiples campos)
- [ ] Validación de URLs (GitHub, demo)
- [ ] Vista de submission para jueces
- [ ] Tests

**Semana 3: Evaluation Module (Parte 1)**
- [ ] Asignación de jueces (manual + automática)
- [ ] Dashboard de juez
- [ ] Formulario de scoring por criterio
- [ ] Guardado de comentarios
- [ ] Tests

**Semana 4: Evaluation Module (Parte 2)**
- [ ] Cálculo de puntajes ponderados
- [ ] Leaderboard en tiempo real
- [ ] Vista pública vs. privada
- [ ] Finalización de judging
- [ ] Tests E2E completos

---

## 🏆 Phase 3: Sponsors & Challenges

### 📅 Timeline: 7 días (30-40 horas)

### 🎯 Objetivos

1. **Gestión de Organizaciones**
2. **Sistema de Sponsorships**
3. **Challenges con Premios**
4. **Shortlist de Proyectos**
5. **Dashboard de Sponsor**

---

### 📦 Estructura de Archivos

```
src/modules/sponsors/
├── queries.ts                 # 250-300 líneas
│   ├── getOrganization(id)
│   ├── listOrganizations()
│   ├── getSponsorship(id)
│   ├── getSponsorships(hackathonId)
│   ├── getChallenge(id)
│   └── getChallenges(hackathonId)
│
├── actions.ts                 # 350-400 líneas
│   ├── createOrganization(data)
│   ├── updateOrganization(id, data)
│   ├── addOrganizationMember(orgId, userId, role)
│   ├── createSponsorship(hackathonId, data)
│   ├── updateSponsorship(id, data)
│   ├── createChallenge(sponsorshipId, data)
│   ├── updateChallenge(id, data)
│   ├── shortlistSubmission(submissionId, notes)
│   └── removeFromShortlist(submissionId)
│
├── types.ts                   # 120-150 líneas
└── validations.ts             # 150-180 líneas

src/app/sponsor/
├── page.tsx                   # 200-250 líneas
│   # Dashboard del sponsor
│   # Lista de hackathons patrocinados
│
├── organization/
│   ├── page.tsx              # 150-200 líneas
│   │   # Lista de organizaciones
│   │
│   └── create/
│       └── page.tsx          # 250-300 líneas
│           # Crear organización
│
└── [hackathonId]/
    ├── challenges/
    │   ├── page.tsx          # 200-250 líneas
    │   │   # Lista de challenges
    │   │
    │   └── create/
    │       └── page.tsx      # 300-350 líneas
    │           # Crear challenge
    │
    └── shortlist/
        └── page.tsx          # 250-300 líneas
            # Proyectos favoritos
            # Notas privadas

src/components/sponsors/
├── organization-card.tsx     # 100-120 líneas
├── organization-form.tsx     # 250-300 líneas
├── sponsorship-badge.tsx     # 80-100 líneas
├── challenge-card.tsx        # 150-180 líneas
├── challenge-form.tsx        # 300-350 líneas
└── shortlist-item.tsx        # 150-180 líneas
```

---

### ✅ Checklist de Implementación

**Día 1-2: Organizations**
- [ ] Implementar queries y actions de organizations
- [ ] Sistema de roles (OWNER, MANAGER, VIEWER)
- [ ] UI para crear/gestionar organizaciones
- [ ] Tests

**Día 3-4: Sponsorships & Challenges**
- [ ] Implementar sponsorships con tiers
- [ ] Sistema de benefits (JSON)
- [ ] Crear challenges con premios
- [ ] UI para gestión de challenges
- [ ] Tests

**Día 5-6: Shortlist & Dashboard**
- [ ] Sistema de shortlist con notas
- [ ] Dashboard de sponsor con insights
- [ ] Vista de submissions por challenge
- [ ] Filtros y búsqueda
- [ ] Tests

**Día 7: Polish & Testing**
- [ ] Integración completa
- [ ] Testing E2E
- [ ] Optimizaciones de performance
- [ ] Documentación

---

## 🔧 Consideraciones Técnicas

### Performance

1. **Database Indexing**
```prisma
// Índices críticos ya definidos en schema
@@index([slug])          // Hackathons
@@index([hackathonId])   // Participations, Teams, Submissions
@@index([judgeId])       // Scores, Assignments
@@index([code])          // Teams (invite codes)
```

2. **Query Optimization**
```typescript
// Usar select para limitar campos
const profiles = await db.profile.findMany({
  select: {
    id: true,
    name: true,
    avatarUrl: true,
    // No cargar todos los campos
  }
});

// Usar parallel queries con Promise.all
const [hackathons, total] = await Promise.all([
  db.hackathon.findMany({ ... }),
  db.hackathon.count({ ... })
]);
```

3. **Caching con Next.js**
```typescript
// Usar unstable_cache para queries costosas
import { unstable_cache } from 'next/cache';

export const getLeaderboard = unstable_cache(
  async (hackathonId: string) => {
    // ... cálculo costoso
  },
  ['leaderboard'],
  { revalidate: 60 } // Cache por 1 minuto
);
```

### Security

1. **RBAC en Todas las Actions**
```typescript
// Siempre verificar rol antes de operaciones sensibles
export async function createHackathon(data) {
  const user = await getCurrentUser();
  requireRole(user, ['ORGANIZER', 'ADMIN']);
  // ...
}
```

2. **Validación de Input**
```typescript
// Usar Zod para validar TODOS los inputs
const validated = createHackathonSchema.parse(rawData);
```

3. **Protection de Recursos**
```typescript
// Verificar ownership antes de editar/eliminar
const hackathon = await db.hackathon.findUnique({
  where: { id },
  include: { /* ... */ }
});

if (!hackathon) throw new Error('Not found');

// Solo ORGANIZER que creó o ADMIN puede editar
if (hackathon.creatorId !== user.id && user.role !== 'ADMIN') {
  throw new Error('Unauthorized');
}
```

### Error Handling

```typescript
// Patrón consistente de manejo de errores
try {
  // Business logic
} catch (error) {
  // 1. Log a Sentry con contexto
  captureError(error, {
    context: 'operation_name',
    userId: user?.id,
    additionalData: { hackathonId }
  });
  
  // 2. Retornar mensaje user-friendly
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Operation failed'
  };
}
```

---

## 🧪 Estrategia de Testing

### Unit Tests (Vitest)

```typescript
// tests/modules/hackathons/queries.test.ts
import { describe, it, expect } from 'vitest';
import { getHackathon } from '@/modules/hackathons/queries';

describe('getHackathon', () => {
  it('should return hackathon with relations', async () => {
    const result = await getHackathon('test-hackathon');
    expect(result).toBeDefined();
    expect(result?.criteria).toBeInstanceOf(Array);
  });
  
  it('should return null for non-existent slug', async () => {
    const result = await getHackathon('non-existent');
    expect(result).toBeNull();
  });
});
```

### Integration Tests (Playwright)

```typescript
// e2e/hackathons.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Hackathon Creation', () => {
  test('organizer can create hackathon', async ({ page }) => {
    // 1. Login as organizer
    await page.goto('/sign-in');
    // ... login flow
    
    // 2. Navigate to create
    await page.goto('/hackathons/create');
    
    // 3. Fill form
    await page.fill('[name="name"]', 'Test Hackathon');
    await page.fill('[name="slug"]', 'test-hackathon');
    // ... más campos
    
    // 4. Submit
    await page.click('button[type="submit"]');
    
    // 5. Verify redirect
    await expect(page).toHaveURL(/\/hackathons\/test-hackathon\/dashboard/);
    
    // 6. Verify creation
    await expect(page.locator('h1')).toContainText('Test Hackathon');
  });
});
```

---

## 🚀 Plan de Despliegue

### Environment Variables

```bash
# .env.production
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

NEXT_PUBLIC_SENTRY_DSN="https://..."
SENTRY_AUTH_TOKEN="..."

NODE_ENV="production"
```

### Deployment Steps (Vercel)

1. **Database Migration**
```bash
# Ejecutar migraciones en producción
pnpm prisma migrate deploy

# Generar Prisma Client
pnpm prisma generate
```

2. **Build & Deploy**
```bash
# Local test
pnpm build
pnpm start

# Deploy to Vercel
vercel --prod
```

3. **Post-Deployment Checks**
- [ ] Verificar que todas las páginas cargan
- [ ] Probar flujo de autenticación
- [ ] Verificar conexión a base de datos
- [ ] Revisar logs de Sentry
- [ ] Probar CRUD completo de hackathons

### Monitoring

```typescript
// Setup Sentry Performance Monitoring
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% de requests
  profilesSampleRate: 0.1,
  
  integrations: [
    new Sentry.Integrations.Prisma({ client: db })
  ]
});
```

---

## 📊 Métricas de Éxito del Proyecto

### Technical Metrics

| Métrica | Target | Actual |
|---------|--------|--------|
| **Page Load (TTFB)** | < 200ms | TBD |
| **First Contentful Paint** | < 1.5s | TBD |
| **Largest Contentful Paint** | < 2.5s | TBD |
| **Database Queries** | < 100ms | TBD |
| **Error Rate (Sentry)** | < 1% | TBD |
| **Test Coverage** | > 70% | TBD |

### Feature Completeness

| Phase | Features | Status | Progress |
|-------|----------|--------|----------|
| **Phase 0** | Infrastructure + RBAC | ✅ Done | 100% |
| **Phase 1** | Hackathons Module | 🔨 In Progress | 0% |
| **Phase 2** | Teams + Evaluation | ⏳ Pending | 0% |
| **Phase 3** | Sponsors | ⏳ Pending | 0% |

---

## 🎯 Próximos Pasos Inmediatos

### Semana Actual (Phase 1 Inicio)

1. **Lunes**: Crear estructura `modules/hackathons/`
2. **Martes**: Implementar queries + types
3. **Miércoles**: Implementar validations + actions
4. **Jueves**: Construir lista pública + detalle
5. **Viernes**: Formulario de creación
6. **Sábado**: Dashboard de organizador
7. **Domingo**: Testing + bug fixes

### Preparación

- [ ] Revisar schema de Prisma para hackathons
- [ ] Definir estructura de carpetas
- [ ] Preparar componentes UI base
- [ ] Setup testing environment
- [ ] Crear branch `feature/phase-1-hackathons`

---

**Última Actualización**: 22 de noviembre, 2025  
**Autor**: Diego RM (GitHub Copilot)  
**Versión**: 1.0.0  
**Estado**: Ready to Start Phase 1 🚀
