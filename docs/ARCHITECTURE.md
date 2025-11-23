# 📐 Arquitectura PuntoHack MVP

## 📋 Índice

1. [Visión General](#visión-general)
2. [Arquitectura Actual (Phase 0 - Completada)](#arquitectura-actual-phase-0---completada)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Diagrama de Arquitectura Actual](#diagrama-de-arquitectura-actual)
5. [Módulos y Estructura](#módulos-y-estructura)
6. [Sistema RBAC](#sistema-rbac)
7. [Flujo de Datos](#flujo-de-datos)
8. [Arquitectura Futura (Phases 1-3)](#arquitectura-futura-phases-1-3)
9. [Roadmap de Evolución](#roadmap-de-evolución)

---

## 🎯 Visión General

**PuntoHack MVP** es una plataforma de gestión de hackathons construida con Next.js 16, diseñada con arquitectura modular y escalable. La aplicación permite a organizadores crear hackathons, a participantes formar equipos y enviar proyectos, a jueces evaluar, y a sponsors ofrecer desafíos.

### Estado Actual
- **Phase 0**: ✅ **100% Completada** (Infraestructura Core)
- **RBAC**: ✅ **100% Implementado** (5 roles con UI de gestión)
- **Next.js**: v16.0.3 con React Compiler habilitado
- **Base de Datos**: PostgreSQL (Neon) con Prisma ORM + Supabase Client

---

## 🏗️ Arquitectura Actual (Phase 0 - Completada)

### Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  React 19.2  │  │  Tailwind 4  │  │  Lucide Icons + Radix UI │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────┬───────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS 16 APP ROUTER                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Server Components (RSC) + Client Components                │   │
│  │  • Server: Data Fetching, Auth Checks, DB Queries           │   │
│  │  • Client: Interactivity, Forms, Real-time Updates          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Middleware (middleware.ts)                                 │   │
│  │  • Clerk Auth Middleware                                     │   │
│  │  • Public/Protected Routes                                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          CAPA DE NEGOCIO                             │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐    │
│  │  Core Layer          │  │  Modules Layer                   │    │
│  │  • rbac.ts (RBAC)    │  │  • users/                        │    │
│  │  • errors.ts (Sentry)│  │    - queries.ts                  │    │
│  │  • db.ts (Prisma)    │  │    - actions.ts                  │    │
│  │  • supabase.ts       │  │    - types.ts                    │    │
│  └──────────────────────┘  └──────────────────────────────────┘    │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVICIOS EXTERNOS                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Clerk Auth  │  │  PostgreSQL  │  │  Sentry Monitoring       │  │
│  │  (Authn)     │  │  (Neon)      │  │  (Error Tracking)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│  ┌──────────────┐                                                    │
│  │  Supabase    │  ← Real-time Client + Alternative DB Access       │
│  │  (Client)    │                                                    │
│  └──────────────┘                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Diagrama de Componentes

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root Layout (ClerkProvider)
│   ├── page.tsx                 # Landing Page
│   ├── onboarding/              # ✅ Onboarding con Role Selection
│   │   ├── page.tsx             # Server Component (Form)
│   │   └── actions.ts           # Server Actions (createProfile)
│   ├── dashboard/               # ✅ User Dashboard
│   │   └── page.tsx             # Role-based Redirect
│   ├── admin/                   # ✅ Admin Panel (ADMIN + ORGANIZER)
│   │   ├── page.tsx             # Admin Dashboard
│   │   └── users/               # ✅ User Management
│   │       ├── page.tsx         # User Table + Stats
│   │       ├── user-role-manager.tsx  # Role Dropdown (Client)
│   │       └── actions.ts       # updateUserRoleAction
│   ├── judge/                   # Judge Dashboard (Pending Phase 2)
│   ├── sponsor/                 # Sponsor Dashboard (Pending Phase 3)
│   ├── sign-in/[[...sign-in]]/  # Clerk Sign In
│   └── sign-up/[[...sign-up]]/  # Clerk Sign Up
│
├── core/                        # ✅ Core Infrastructure
│   ├── rbac.ts                  # hasRole, hasAnyRole, requireRole
│   ├── errors.ts                # captureError (Sentry + Filters)
│   ├── db.ts                    # Prisma Client Singleton
│   └── supabase.ts              # Supabase Client (SSR)
│
├── modules/                     # ✅ Domain Modules
│   └── users/                   # Users Module (Phase 0)
│       ├── queries.ts           # getUserByClerkId, getProfile
│       ├── actions.ts           # Server Actions
│       └── types.ts             # TypeScript Interfaces
│
├── components/                  # ✅ Reusable UI Components
│   ├── client/                  # Client Components
│   │   ├── interactive-button.tsx
│   │   ├── toast-provider.tsx
│   │   ├── user-button-client.tsx
│   │   ├── user-avatar-client.tsx
│   │   └── theme-toggle.tsx
│   └── ui/                      # Radix UI Wrappers (Pending)
│
├── lib/                         # ✅ Utilities
│   └── utils.ts                 # Helper Functions (cn, etc.)
│
├── middleware.ts                # ✅ Clerk Auth Middleware
└── instrumentation.ts           # ✅ Sentry Initialization
```

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Next.js** | 16.0.3 | Framework React con SSR/RSC |
| **React** | 19.2.0 | UI Library con React Compiler |
| **TypeScript** | 5.x | Type Safety |
| **Tailwind CSS** | 4.x | Utility-first Styling |
| **Radix UI** | Latest | Accessible Components |
| **Lucide Icons** | 0.554.0 | Icon System |

### Backend & Database
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Prisma** | 7.0.0 | ORM para PostgreSQL |
| **Neon PostgreSQL** | - | Serverless Database |
| **Supabase Client** | 2.83.0 | Real-time DB + Auth Helpers |
| **Clerk** | 6.35.2 | Authentication & User Management |

### Observability & Tools
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Sentry** | 10.26.0 | Error Tracking & Performance |
| **Zod** | 4.1.12 | Schema Validation |
| **React Hook Form** | 7.66.1 | Form Management |
| **date-fns** | 4.1.0 | Date Utilities |

---

## 🔐 Sistema RBAC

### Roles y Jerarquía

```
┌─────────────────────────────────────────────────────────────────┐
│                          ADMIN                                   │
│  • Full Access                                                   │
│  • Can assign any role (including ADMIN)                         │
│  • Access to all panels: /admin, /admin/users                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       ORGANIZER                                  │
│  • Create & Manage Hackathons (Phase 1)                          │
│  • Manage Users (cannot assign ADMIN role)                       │
│  • Access: /admin, /admin/users                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   JUDGE     │  │  SPONSOR    │  │ PARTICIPANT │
│  • Evaluate │  │  • Offer    │  │  • Register │
│    Projects │  │    Challs   │  │  • Join     │
│  • Score    │  │  • Shortlist│  │    Teams    │
│  (Phase 2)  │  │  (Phase 3)  │  │  • Submit   │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Implementación RBAC

**`src/core/rbac.ts`** (100% Completado):
```typescript
// Role Type
export type Role = 'PARTICIPANT' | 'JUDGE' | 'ORGANIZER' | 'ADMIN' | 'SPONSOR';

// Check Functions
hasRole(user, roles: Role[]): boolean
hasAnyRole(user, roles: Role[]): boolean
requireRole(user, roles: Role[]): void // Throws if unauthorized

// Usage Example
if (!hasRole(user, ['ADMIN', 'ORGANIZER'])) {
  redirect('/dashboard');
}
```

### Matriz de Permisos (Phase 0)

| Recurso | ADMIN | ORGANIZER | JUDGE | SPONSOR | PARTICIPANT |
|---------|-------|-----------|-------|---------|-------------|
| `/admin` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/admin/users` | ✅ | ✅* | ❌ | ❌ | ❌ |
| Change ADMIN role | ✅ | ❌ | ❌ | ❌ | ❌ |
| Change other roles | ✅ | ✅ | ❌ | ❌ | ❌ |
| View all users | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/onboarding` | ✅ | ✅ | ✅ | ✅ | ✅ |

\* ORGANIZER puede gestionar usuarios pero **no puede asignar rol ADMIN**

---

## 🔄 Flujo de Datos

### 1. Autenticación y Onboarding

```
┌──────────┐     ┌──────────┐     ┌───────────────┐     ┌──────────┐
│  User    │────▶│  Clerk   │────▶│  Middleware   │────▶│ /onboard │
│  Login   │     │  Auth    │     │  (Check Auth) │     │  ing     │
└──────────┘     └──────────┘     └───────────────┘     └────┬─────┘
                                                               │
                    ┌──────────────────────────────────────────┘
                    ▼
            ┌───────────────────┐
            │  User Selects     │
            │  Role + Profile   │
            │  Info             │
            └─────────┬─────────┘
                      │
                      ▼
            ┌───────────────────┐
            │  Server Action    │
            │  createProfile()  │
            │  • Validate Data  │
            │  • Insert Profile │
            │  • Revalidate     │
            └─────────┬─────────┘
                      │
                      ▼
            ┌───────────────────┐
            │  Redirect to      │
            │  /dashboard       │
            └───────────────────┘
```

### 2. User Management (Admin)

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│  ADMIN or   │────▶│  /admin/users   │────▶│  Fetch All   │
│  ORGANIZER  │     │  page.tsx       │     │  Profiles    │
│  Accesses   │     │  (Server)       │     │  (Supabase)  │
└─────────────┘     └─────────────────┘     └──────┬───────┘
                                                    │
                    ┌───────────────────────────────┘
                    ▼
            ┌─────────────────────┐
            │  Render User Table  │
            │  + Statistics       │
            │  + Role Dropdowns   │
            └──────────┬──────────┘
                       │
                       ▼ (User changes role)
            ┌─────────────────────┐
            │  user-role-manager  │
            │  .tsx (Client)      │
            │  • onChange Event   │
            └──────────┬──────────┘
                       │
                       ▼
            ┌─────────────────────┐
            │  updateUserRole     │
            │  Action (Server)    │
            │  • Check Perms      │
            │  • Validate Role    │
            │  • Update DB        │
            │  • Revalidate       │
            └──────────┬──────────┘
                       │
                       ▼
            ┌─────────────────────┐
            │  Success Feedback   │
            │  "✓ Updated"        │
            └─────────────────────┘
```

### 3. Error Handling Flow

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Error      │────▶│  captureError() │────▶│  Filter      │
│  Occurs     │     │  (errors.ts)    │     │  NEXT_       │
└─────────────┘     └─────────────────┘     │  REDIRECT?   │
                                             └──────┬───────┘
                                                    │
                                ┌───────────────────┼────────────────┐
                                ▼ No                               ▼ Yes
                    ┌─────────────────────┐           ┌──────────────────┐
                    │  Log to Console     │           │  Ignore (Return) │
                    │  Send to Sentry     │           └──────────────────┘
                    │  Include Context    │
                    └─────────────────────┘
```

---

## 🚀 Arquitectura Futura (Phases 1-3)

### Phase 1: Módulo Hackathons (Semana 3) - PRÓXIMO

```
src/modules/hackathons/
├── queries.ts              # DB Queries (Prisma + Supabase)
│   ├── getHackathon(slug)
│   ├── listHackathons(filters)
│   └── getHackathonParticipants(id)
│
├── actions.ts              # Server Actions
│   ├── createHackathon()
│   ├── updateHackathon()
│   ├── deleteHackathon()
│   └── registerForHackathon()
│
├── types.ts                # TypeScript Types
│   ├── HackathonWithRelations
│   └── CreateHackathonInput
│
└── validations.ts          # Zod Schemas
    ├── createHackathonSchema
    └── updateHackathonSchema

src/app/hackathons/
├── page.tsx                # List All Hackathons
├── [slug]/
│   ├── page.tsx           # Hackathon Detail Page
│   ├── register/          # Registration Flow
│   └── dashboard/         # Organizer Dashboard
└── create/
    └── page.tsx           # Create Hackathon Form
```

**Nuevas Capacidades Phase 1**:
- ✅ CRUD completo de Hackathons (ORGANIZER + ADMIN)
- ✅ Gestión de Criterios de Evaluación
- ✅ Registro de Participantes
- ✅ Dashboard de Organizador con estadísticas
- ✅ Sistema de estados (DRAFT → REGISTRATION → RUNNING → JUDGING → FINISHED)

### Phase 2: Módulo Equipos + Evaluación (Semana 4-5)

```
src/modules/teams/
├── queries.ts
│   ├── getTeam(id)
│   ├── getTeamsByHackathon(hackathonId)
│   └── getUserTeam(userId, hackathonId)
│
├── actions.ts
│   ├── createTeam()
│   ├── joinTeam(inviteCode)
│   └── leaveTeam()
│
└── types.ts

src/modules/submissions/
├── queries.ts
│   ├── getSubmission(id)
│   └── getSubmissionsByHackathon(hackathonId)
│
├── actions.ts
│   ├── createSubmission()
│   ├── updateSubmission()
│   └── deleteSubmission()
│
└── types.ts

src/modules/evaluation/
├── queries.ts
│   ├── getAssignedSubmissions(judgeId)
│   ├── getScores(submissionId)
│   └── getLeaderboard(hackathonId)
│
├── actions.ts
│   ├── assignJudge(submissionId, judgeId)
│   ├── submitScore()
│   └── updateScore()
│
└── types.ts

src/app/judge/
├── page.tsx               # Judge Dashboard
├── [hackathonId]/
│   └── submissions/
│       ├── page.tsx       # Assigned Submissions
│       └── [id]/
│           └── page.tsx   # Score Submission
```

**Nuevas Capacidades Phase 2**:
- ✅ Formación de Equipos con códigos de invitación
- ✅ Sistema de Submissions (repos, demos, descripción)
- ✅ Asignación automática de Jueces
- ✅ Interfaz de evaluación con criterios
- ✅ Cálculo de puntajes ponderados
- ✅ Leaderboard en tiempo real

### Phase 3: Módulo Sponsors (Semana 6)

```
src/modules/sponsors/
├── queries.ts
│   ├── getOrganization(id)
│   ├── getSponsorships(hackathonId)
│   └── getChallenges(hackathonId)
│
├── actions.ts
│   ├── createOrganization()
│   ├── createSponsorship()
│   ├── createChallenge()
│   └── shortlistSubmission()
│
└── types.ts

src/app/sponsor/
├── page.tsx               # Sponsor Dashboard
├── [hackathonId]/
│   ├── challenges/
│   │   ├── page.tsx       # Challenge List
│   │   └── create/
│   │       └── page.tsx   # Create Challenge
│   └── shortlist/
│       └── page.tsx       # Shortlisted Projects
```

**Nuevas Capacidades Phase 3**:
- ✅ Gestión de Organizaciones
- ✅ Niveles de Sponsorship (DIAMOND, PLATINUM, GOLD, etc.)
- ✅ Creación de Challenges por Sponsor
- ✅ Shortlist de proyectos favoritos
- ✅ Dashboard de insights para Sponsors

---

## 📊 Diagrama de Arquitectura Futura (Post-Phase 3)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                                   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Next.js 16 App Router + React 19 Server Components             │   │
│  │                                                                   │   │
│  │  /              → Landing Page                                   │   │
│  │  /dashboard     → Role-based Redirect                            │   │
│  │  /onboarding    → User Profile + Role Selection                  │   │
│  │                                                                   │   │
│  │  /admin         → Admin Panel (ADMIN + ORGANIZER)                │   │
│  │    /users       → User Management                                │   │
│  │                                                                   │   │
│  │  /hackathons    → Hackathon Discovery & Detail (Phase 1)         │   │
│  │    /[slug]      → Hackathon Page                                 │   │
│  │    /create      → Create Hackathon (ORGANIZER)                   │   │
│  │                                                                   │   │
│  │  /judge         → Judge Dashboard (Phase 2)                      │   │
│  │    /[hackathon] → Assigned Submissions                           │   │
│  │                                                                   │   │
│  │  /sponsor       → Sponsor Dashboard (Phase 3)                    │   │
│  │    /[hackathon] → Challenges & Shortlist                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BUSINESS LOGIC LAYER                             │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Core Infrastructure (Phase 0 ✅)                                │   │
│  │  • rbac.ts        → Role-based Access Control                    │   │
│  │  • errors.ts      → Error Handling + Sentry                      │   │
│  │  • db.ts          → Prisma Client                                │   │
│  │  • supabase.ts    → Supabase Client (Real-time)                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Domain Modules (Modular Architecture)                           │   │
│  │                                                                   │   │
│  │  users/          ✅ Phase 0                                       │   │
│  │  ├── queries.ts  → DB Queries                                    │   │
│  │  ├── actions.ts  → Server Actions                                │   │
│  │  └── types.ts    → TypeScript Types                              │   │
│  │                                                                   │   │
│  │  hackathons/     🔨 Phase 1 (Next)                               │   │
│  │  ├── queries.ts  → CRUD + List + Stats                           │   │
│  │  ├── actions.ts  → Create, Update, Delete, Register              │   │
│  │  ├── types.ts    → HackathonWithRelations, etc.                  │   │
│  │  └── validations.ts → Zod Schemas                                │   │
│  │                                                                   │   │
│  │  teams/          ⏳ Phase 2                                       │   │
│  │  submissions/    ⏳ Phase 2                                       │   │
│  │  evaluation/     ⏳ Phase 2                                       │   │
│  │                                                                   │   │
│  │  sponsors/       ⏳ Phase 3                                       │   │
│  │  organizations/  ⏳ Phase 3                                       │   │
│  │  challenges/     ⏳ Phase 3                                       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                       │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Prisma Schema (17 Models)                                       │   │
│  │                                                                   │   │
│  │  Core Domain:                                                     │   │
│  │  • Profile          → Users with roles                            │   │
│  │  • Hackathon        → Events with status lifecycle                │   │
│  │  • Team             → Participant groups                          │   │
│  │  • Submission       → Project submissions                         │   │
│  │                                                                   │   │
│  │  Evaluation Domain:                                               │   │
│  │  • Criterion        → Evaluation criteria                         │   │
│  │  • Score            → Judge scores                                │   │
│  │  • HackathonJudge   → Judge assignments                           │   │
│  │  • JudgeSubmissionAssignment → Judge-Submission mapping           │   │
│  │                                                                   │   │
│  │  Sponsor Domain:                                                  │   │
│  │  • Organization     → Companies/Entities                          │   │
│  │  • Sponsorship      → Hackathon sponsorships                      │   │
│  │  • Challenge        → Sponsor challenges                          │   │
│  │  • SponsorShortlist → Favorited projects                          │   │
│  │                                                                   │   │
│  │  Relations: Many-to-Many, One-to-Many, Foreign Keys              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │  Neon           │  │  Supabase       │  │  Clerk          │          │
│  │  PostgreSQL     │  │  Real-time      │  │  Auth           │          │
│  │  (Primary DB)   │  │  Subscriptions  │  │  (Users)        │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛤️ Roadmap de Evolución

### ✅ Phase 0: Infrastructure Core (Completada)
**Tiempo**: Semana 1-2 | **Estado**: 100% ✅

**Logros**:
- ✅ Next.js 16 + React 19 setup con App Router
- ✅ Clerk Authentication integrado
- ✅ Prisma + Neon PostgreSQL configurado
- ✅ Supabase Client para queries en tiempo real
- ✅ Sistema RBAC completo (5 roles)
- ✅ Onboarding con selección de rol
- ✅ Admin panel con gestión de usuarios
- ✅ Sentry error tracking configurado
- ✅ Módulo `users/` con arquitectura modular
- ✅ 5 Client Components reutilizables
- ✅ Middleware de autenticación
- ✅ TypeScript strict mode

**Línea Base Establecida**:
```
Core:
├── rbac.ts          → hasRole(), requireRole()
├── errors.ts        → captureError() + Sentry filters
├── db.ts            → Prisma singleton
└── supabase.ts      → SSR client

Modules:
└── users/
    ├── queries.ts   → getUserByClerkId(), getProfile()
    ├── actions.ts   → createProfile(), updateUserRole()
    └── types.ts     → UserProfile, CreateProfileInput

Components:
└── client/
    ├── interactive-button.tsx
    ├── toast-provider.tsx
    ├── user-button-client.tsx
    ├── user-avatar-client.tsx
    └── theme-toggle.tsx
```

---

### 🔨 Phase 1: Hackathons Module (Próximo)
**Tiempo**: Semana 3 (40-50 horas) | **Estado**: Pending

**Objetivos**:
1. **CRUD Completo de Hackathons**
   - Crear, editar, eliminar hackathons (ORGANIZER + ADMIN)
   - Formulario con validación Zod
   - Gestión de fechas (registro, evento, judging)

2. **Gestión de Criterios**
   - CRUD de criterios de evaluación
   - Pesos relativos para scoring
   - Vista previa de cómo se calculan puntajes

3. **Registro de Participantes**
   - Botón "Register" en página de hackathon
   - Validación de capacidad máxima
   - Confirmación por email (opcional)

4. **Dashboard de Organizador**
   - Estadísticas en tiempo real (participantes, equipos)
   - Lista de hackathons propios
   - Acciones rápidas (editar, publicar, cerrar)

5. **Sistema de Estados**
   - DRAFT → REGISTRATION → RUNNING → JUDGING → FINISHED
   - Validaciones según estado
   - UI adaptativa según fase

**Entregables**:
```
src/modules/hackathons/
├── queries.ts
├── actions.ts
├── types.ts
└── validations.ts

src/app/hackathons/
├── page.tsx              # Lista pública
├── [slug]/page.tsx       # Detalle
├── create/page.tsx       # Crear (ORGANIZER)
└── [slug]/dashboard/     # Organizer Dashboard

src/components/hackathons/
├── hackathon-card.tsx
├── hackathon-form.tsx
├── criterion-manager.tsx
└── status-badge.tsx
```

**Criterios de Aceptación**:
- ✅ ORGANIZER puede crear hackathon completo
- ✅ Participantes pueden registrarse
- ✅ Criterios de evaluación configurables
- ✅ Dashboard funcional con stats
- ✅ Estados del ciclo de vida implementados
- ✅ Todas las queries optimizadas (índices Prisma)

---

### 📋 Phase 2: Teams + Submissions + Evaluation (Futuro)
**Tiempo**: Semana 4-5 (50-60 horas) | **Estado**: Pending

**Objetivos**:
1. **Sistema de Equipos**
   - Crear equipo con código único
   - Invitar miembros por código
   - Límites min/max según hackathon

2. **Submissions**
   - Formulario de envío (título, descripción, links)
   - Soporte para repos de GitHub
   - Demo URLs + documentación

3. **Asignación de Jueces**
   - Asignación manual o automática
   - Distribución equitativa de submissions
   - Notificaciones a jueces

4. **Interfaz de Evaluación**
   - Dashboard de juez con submissions asignados
   - Formulario de scoring por criterio
   - Comentarios y feedback

5. **Leaderboard**
   - Cálculo de puntajes ponderados
   - Ranking en tiempo real
   - Vista pública vs. privada (según fase)

**Módulos Nuevos**:
- `modules/teams/`
- `modules/submissions/`
- `modules/evaluation/`

---

### 🏆 Phase 3: Sponsors + Challenges (Futuro)
**Tiempo**: Semana 6 (30-40 horas) | **Estado**: Pending

**Objetivos**:
1. **Organizaciones**
   - Perfil de empresa
   - Roles dentro de org (OWNER, MANAGER, VIEWER)

2. **Sponsorships**
   - Niveles (DIAMOND, PLATINUM, GOLD, etc.)
   - Benefits personalizables

3. **Challenges**
   - Sponsors crean challenges con premios
   - Tags y categorías
   - Submissions vinculadas a challenges

4. **Shortlist**
   - Sponsors marcan proyectos favoritos
   - Notas privadas
   - Dashboard de insights

**Módulos Nuevos**:
- `modules/sponsors/`
- `modules/organizations/`
- `modules/challenges/`

---

## 📈 Métricas de Arquitectura

### Cobertura Actual (Phase 0)

| Categoría | Completado | Pendiente | %Complete |
|-----------|------------|-----------|-----------|
| **Infrastructure** | 100% | 0% | ✅ 100% |
| **Authentication** | 100% | 0% | ✅ 100% |
| **Database Schema** | 100% | 0% | ✅ 100% |
| **RBAC System** | 100% | 0% | ✅ 100% |
| **Error Handling** | 100% | 0% | ✅ 100% |
| **Module Pattern** | 20% | 80% | 🔨 20% |
| **UI Components** | 30% | 70% | 🔨 30% |

**Total Phase 0**: 100% ✅
**Total MVP (Phases 0-3)**: ~25% (1/4 phases completadas)

### Deuda Técnica
- 🟡 **Media**: Source map warnings (Next.js 16 conocido)
- 🟢 **Baja**: Falta Zod validation en algunos forms
- 🟢 **Baja**: Radix UI wrappers sin implementar

### Performance Targets
- **TTFB**: < 200ms (Server Components)
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **Database Queries**: < 100ms (optimizado con índices)

---

## 🔧 Patrones y Convenciones

### 1. Arquitectura Modular
```
modules/[domain]/
├── queries.ts       # Read operations (Prisma/Supabase)
├── actions.ts       # Write operations (Server Actions)
├── types.ts         # TypeScript interfaces
└── validations.ts   # Zod schemas
```

### 2. Server vs Client Components
```typescript
// Server Component (Default)
export default async function Page() {
  const data = await fetchData();  // Direct DB access
  return <ClientComponent data={data} />;
}

// Client Component (Explicit)
'use client';
export function ClientComponent({ data }) {
  const [state, setState] = useState(data);
  return <button onClick={() => setState(...)}>Update</button>;
}
```

### 3. Error Handling Pattern
```typescript
try {
  // Business logic
} catch (error) {
  captureError(error, { context: 'operation_name' });
  return { success: false, error: 'User-friendly message' };
}
```

### 4. RBAC Pattern
```typescript
// Page level
export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!hasRole(user, ['ADMIN', 'ORGANIZER'])) {
    redirect('/dashboard');
  }
  // ...
}

// Action level
export async function sensitiveAction() {
  const user = await getCurrentUser();
  requireRole(user, ['ADMIN']);  // Throws if unauthorized
  // ...
}
```

---

## 📚 Referencias

### Documentación Externa
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Clerk Auth](https://clerk.com/docs)
- [Sentry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

### Documentación Interna
- `/docs/ARCHITECTURE.md` (este archivo)
- `/prisma/schema.prisma` - Schema completo
- `/README.md` - Setup instructions

---

## 🎯 Próximos Pasos

**Inmediato (Phase 1 Start)**:
1. Crear estructura `modules/hackathons/`
2. Implementar queries básicas (CRUD)
3. Construir formulario de creación
4. Desarrollar página de listado
5. Implementar dashboard de organizador

**Para Discutir**:
- ¿Priorizar dashboard de organizador o listado público primero?
- ¿Implementar search/filter en listado de hackathons desde Phase 1?
- ¿Agregar sistema de notificaciones (email/in-app) en Phase 1 o Phase 2?

---

**Última Actualización**: 22 de noviembre, 2025
**Autor**: Diego RM (GitHub Copilot)
**Versión**: 1.0.0
**Estado del Proyecto**: Phase 0 ✅ | Ready for Phase 1 🚀
