```
 ____             _        _   _            _    
|  _ \ _   _ _ __ | |_ ___ | | | | __ _  ___| | __
| |_) | | | | '_ \| __/ _ \| |_| |/ _` |/ __| |/ /
|  __/| |_| | | | | || (_) |  _  | (_| | (__|   < 
|_|    \__,_|_| |_|\__\___/|_| |_|\__,_|\___|_|\_\
                                                   
         MVP - Hackathon Management Platform       
```

# 🚀 PuntoHack MVP

Professional hackathon management platform built with **Next.js 16**, **Prisma**, **Supabase**, and **Clerk**.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?logo=prisma)](https://www.prisma.io)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

---

## 📊 Estado del Proyecto

```
Phase 0: ████████████████████ 100% ✅ Infrastructure Core
Phase 1: ░░░░░░░░░░░░░░░░░░░░   0% 🔨 Hackathons Module
Phase 2: ░░░░░░░░░░░░░░░░░░░░   0% ⏳ Teams & Evaluation
Phase 3: ░░░░░░░░░░░░░░░░░░░░   0% ⏳ Sponsors & Challenges

Total MVP Progress: 25% (1/4 phases complete)
```

**Latest Update**: Phase 0 completada - RBAC 100% funcional con UI de gestión de usuarios.

---

## ✨ Características Principales

### ✅ Implementado (Phase 0)

- 🔐 **Authentication**: Clerk integration con SSO
- 👥 **RBAC System**: 5 roles (ADMIN, ORGANIZER, JUDGE, SPONSOR, PARTICIPANT)
- 🎨 **Admin Panel**: Gestión completa de usuarios y roles
- 📝 **Onboarding**: Flujo de registro con selección de rol
- 💾 **Database**: PostgreSQL (Neon) con Prisma ORM
- ⚡ **Real-time**: Supabase client para actualizaciones en vivo
- 🐛 **Error Tracking**: Sentry con filtros inteligentes
- 🎯 **Module Pattern**: Arquitectura modular escalable

### 🔨 En Desarrollo (Phase 1)

- 🎪 **Hackathons CRUD**: Crear, editar, eliminar eventos
- 📋 **Criteria Management**: Definir criterios de evaluación
- 👤 **Organizer Dashboard**: Estadísticas y gestión
- 📅 **Lifecycle States**: DRAFT → REGISTRATION → RUNNING → JUDGING → FINISHED

### ⏳ Próximamente

- **Phase 2**: Teams, Submissions, Evaluation System, Leaderboard
- **Phase 3**: Sponsors, Organizations, Challenges, Shortlist

---

## 📋 Prerequisites

| Requisito | Versión | Propósito |
|-----------|---------|-----------|
| **Node.js** | 20.x or 22.x LTS | Runtime |
| **pnpm** | 10.22.0+ | Package manager |
| **PostgreSQL** | Latest | Database (Neon serverless) |
| **Clerk** | Latest | Authentication |
| **Supabase** | Latest | Real-time client |
| **Sentry** | Latest | Error monitoring (opcional) |

---

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - Supabase PostgreSQL connection string (pooled)
- `DIRECT_URL` - Supabase PostgreSQL direct connection (for migrations)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key

### 3. Setup Database

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# OR create migration (recommended for production)
pnpm db:migrate

# Open Prisma Studio to view data
pnpm db:studio
```

### 4. Seed Database (Optional)

```bash
pnpm db:seed
```

This creates test data including:
- Admin, Organizer, Judge, Participant, and Sponsor users
- A test hackathon with criteria
- Sample organization and challenges

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
puntohack-mvp-app/
├── 📂 prisma/
│   ├── schema.prisma          # 17 Models - Database Schema ✅
│   ├── migrations/            # Migration history
│   └── seeds/                 # Dev seed scripts
│
├── 📂 src/
│   ├── 📂 app/               # Next.js App Router (Route Groups) ✅
│   │   ├── (auth)/          # Authentication routes ✅
│   │   │   ├── layout.tsx   # Auth layout (clean)
│   │   │   ├── sign-in/     # Clerk sign-in
│   │   │   ├── sign-up/     # Clerk sign-up
│   │   │   └── onboarding/  # User onboarding flow
│   │   │
│   │   ├── (dashboard)/     # User dashboard routes ✅
│   │   │   ├── layout.tsx   # Dashboard layout (navbar)
│   │   │   └── dashboard/   # Main dashboard
│   │   │
│   │   ├── (admin)/         # Admin routes ✅
│   │   │   ├── layout.tsx   # Admin layout (RBAC)
│   │   │   └── admin/       # Admin panel
│   │   │       ├── page.tsx # Admin dashboard
│   │   │       └── users/   # User management
│   │   │
│   │   ├── _archive/        # Placeholder pages (archived) ✅
│   │   │   ├── judge/       # Phase 2
│   │   │   ├── sponsor/     # Phase 3
│   │   │   └── test-db/     # Testing
│   │   │
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Landing page
│   │   └── globals.css      # Global styles
│   │
│   ├── 📂 core/              # Core Infrastructure ✅
│   │   ├── index.ts         # Barrel export
│   │   ├── auth.ts          # Authentication helpers
│   │   ├── rbac.ts          # RBAC (hasRole, requireRole)
│   │   ├── db.ts            # Prisma Client Singleton
│   │   ├── errors.ts        # Error Handling + Sentry
│   │   ├── config.ts        # Environment Config
│   │   └── 📂 supabase/     # Supabase clients ✅
│   │       ├── index.ts     # Barrel export
│   │       ├── server.ts    # Server client (SSR)
│   │       ├── client.ts    # Browser client
│   │       └── realtime.ts  # Realtime subscriptions
│   │
│   ├── 📂 modules/           # Domain Modules (Feature-Sliced Design) ✅
│   │   └── 📂 users/        # Users domain module ✅
│   │       ├── index.ts     # Barrel export
│   │       ├── types.ts     # TypeScript interfaces
│   │       ├── validations.ts # Zod schemas
│   │       ├── queries.ts   # Data access layer
│   │       └── actions.ts   # Server Actions
│   │   # Future modules:
│   │   # ├── hackathons/    # 🔨 Phase 1
│   │   # ├── teams/         # ⏳ Phase 2
│   │   # ├── submissions/   # ⏳ Phase 2
│   │   # ├── evaluation/    # ⏳ Phase 2
│   │   # └── sponsors/      # ⏳ Phase 3
│   │
│   ├── 📂 components/        # React Components (Organized) ✅
│   │   ├── 📂 ui/           # Pure UI primitives ✅
│   │   │   ├── index.ts     # Barrel export
│   │   │   ├── interactive-button.tsx
│   │   │   ├── interactive-form.tsx
│   │   │   ├── button-link.tsx
│   │   │   └── card-link.tsx
│   │   │
│   │   ├── 📂 common/       # Shared business components ✅
│   │   │   ├── index.ts     # Barrel export
│   │   │   └── nav-link.tsx
│   │   │
│   │   └── 📂 features/     # Feature-specific components ✅
│   │       ├── users/       # User components (future)
│   │       └── admin/       # Admin components (future)
│   │
│   ├── 📂 lib/               # Utilities & Helpers
│   │   ├── db/              # Database helpers
│   │   │   └── queries.ts   # Example queries
│   │   └── utils.ts         # General utilities
│   │
│   ├── middleware.ts         # Clerk Auth Middleware ✅
│   └── instrumentation.ts    # Sentry Initialization ✅
│
├── 📂 docs/                  # 📚 Documentation
│   ├── README.md            # Documentation Index
│   ├── ARCHITECTURE.md      # Complete Architecture
│   ├── DIAGRAMS.md          # Mermaid Diagrams
│   ├── ROADMAP.md           # Implementation Roadmap
│   └── PHASE0-REORGANIZATION.md  # Phase 0 refactor plan ✅
│
└── package.json              # Dependencies + Scripts
```

### 🎯 Architectural Highlights

**Route Groups** (`(auth)`, `(dashboard)`, `(admin)`):
- Clean URL structure without group names
- Shared layouts per group
- RBAC protection at layout level

**Feature-Sliced Design**:
- Modules organized by domain (users, hackathons, etc.)
- Clear separation: types → validations → queries → actions
- Barrel exports for clean imports

**Component Organization**:
- `ui/` - Pure UI primitives (stateless, reusable)
- `common/` - Shared business components
- `features/` - Feature-specific components

**Core Infrastructure**:
- Centralized Supabase clients (server, client, realtime)
- RBAC helpers exported from core
- Error handling with Sentry integration

---

## 📦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema to database (dev)
- `pnpm db:migrate` - Create and run migration
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed database with test data

## 🎭 User Roles & Permissions

### Jerarquía de Roles

```
┌─────────────────────────────────────────────────────────┐
│  ADMIN - Super Usuario                                  │
│  • Full Access                                          │
│  • Puede asignar cualquier rol (incluido ADMIN)         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  ORGANIZER - Creador de Hackathons                      │
│  • Create/Manage Hackathons                             │
│  • Gestionar Usuarios (excepto crear ADMIN)             │
│  • Access: /admin, /admin/users                         │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   JUDGE      │  │   SPONSOR    │  │ PARTICIPANT  │
│ • Evaluate   │  │ • Create     │  │ • Register   │
│   Projects   │  │   Challenges │  │ • Join Teams │
│ • Score      │  │ • Shortlist  │  │ • Submit     │
│ (Phase 2)    │  │ (Phase 3)    │  │   Projects   │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Matriz de Permisos (Phase 0)

| Recurso | ADMIN | ORGANIZER | JUDGE | SPONSOR | PARTICIPANT |
|---------|:-----:|:---------:|:-----:|:-------:|:-----------:|
| `/admin` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/admin/users` | ✅ | ✅* | ❌ | ❌ | ❌ |
| Change ADMIN role | ✅ | ❌ | ❌ | ❌ | ❌ |
| Change other roles | ✅ | ✅ | ❌ | ❌ | ❌ |
| View all users | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ |

\* ORGANIZER puede gestionar usuarios pero **no puede asignar rol ADMIN**

---

## 🔑 Tech Stack

### Frontend Layer
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Next.js** | 16.0.3 | Framework con App Router + RSC |
| **React** | 19.2.0 | UI Library con React Compiler |
| **TypeScript** | 5.x | Type Safety (strict mode) |
| **Tailwind CSS** | 4.x | Utility-first Styling |
| **Radix UI** | Latest | Accessible Components |
| **Lucide React** | 0.554.0 | Icon System |

### Backend & Database
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Prisma** | 7.0.0 | ORM para PostgreSQL |
| **Neon PostgreSQL** | - | Serverless Database |
| **Supabase Client** | 2.83.0 | Real-time DB + Helpers |
| **Clerk** | 6.35.2 | Authentication & User Management |

### DevOps & Monitoring
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Sentry** | 10.26.0 | Error Tracking & Performance |
| **Vercel** | - | Hosting & Deployment |
| **Zod** | 4.1.12 | Schema Validation |
| **React Hook Form** | 7.66.1 | Form Management |

---

## 📝 Development Guidelines

### Layer Architecture

Each domain module follows this pattern:

```
modules/[domain]/
  ├── schemas.ts      # Zod schemas for validation
  ├── repository.ts   # Database operations (Prisma)
  ├── service.ts      # Business logic
  └── actions.ts      # Server Actions (Next.js)
```

### Code Style

- Use TypeScript strict mode
- Follow functional programming patterns
- Validate all inputs with Zod
- Handle errors with try/catch and Sentry
- Use server components by default
- Add 'use client' only when needed

### Commits

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all variables from `.env.example` in your deployment platform with production values.

## 📚 Documentation

📖 **Documentación completa disponible en `/docs`**:

| Documento | Descripción | Contenido Principal |
|-----------|-------------|---------------------|
| **[README.md](./docs/README.md)** | Índice de Documentación | Quick start, estructura, enlaces |
| **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | Arquitectura Completa | Stack tech, RBAC, modelo de datos, patrones |
| **[DIAGRAMS.md](./docs/DIAGRAMS.md)** | Diagramas Visuales | Mermaid diagrams, flujos, ERD |
| **[ROADMAP.md](./docs/ROADMAP.md)** | Plan de Implementación | Phase 1-3 detallado, código de ejemplo |

### Quick Links

- **Para nuevos desarrolladores**: Leer [`docs/README.md`](./docs/README.md) → [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- **Para entender flujos**: Ver [`docs/DIAGRAMS.md`](./docs/DIAGRAMS.md)
- **Para desarrollar features**: Consultar [`docs/ROADMAP.md`](./docs/ROADMAP.md)

### Diagramas Disponibles

- ✅ Arquitectura en capas (Frontend → Backend → Data)
- ✅ Flujo de autenticación y onboarding
- ✅ Sistema RBAC con jerarquía de roles
- ✅ Modelo de datos completo (ERD - 17 tablas)
- ✅ Flujo de user management (Admin Panel)
- ✅ Arquitectura de módulos (patrón modular)
- ✅ Roadmap visual (Gantt chart)
- ✅ Flujo de hackathons (Phase 1)
- ✅ Flujo de evaluación (Phase 2)

---

## 🐛 Troubleshooting

### Prisma Client Not Generating

```bash
pnpm db:generate
# Restart TypeScript server in VS Code
```

### Database Connection Issues

Check your `DATABASE_URL` and `DIRECT_URL` are correct in `.env`

### Build Errors

```bash
# Clean and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

## 📄 License

Private - All rights reserved © 2025 PuntoHack

---

## 🤝 Contributing & Contact

**Team**:
- Lead Developer: Diego RM
- AI Assistant: GitHub Copilot

**Resources**:
- GitHub Repo: [PuntoHack-Tech](https://github.com/diego-rm-dev/PuntoHack-Tech)
- Documentation: [`/docs`](./docs)
- Issues: GitHub Issues

---

## 📝 Changelog

### v0.1.0 - Phase 0 Complete (2025-11-22) ✅

**Infrastructure Core**:
- ✅ Next.js 16 + React 19 + App Router
- ✅ Clerk Authentication integration
- ✅ Prisma ORM + Neon PostgreSQL setup
- ✅ Supabase Client para real-time queries
- ✅ Sistema RBAC completo (5 roles)
- ✅ Onboarding flow con selección de rol
- ✅ Admin panel con gestión de usuarios
- ✅ Sentry error tracking configurado
- ✅ Módulo `users/` con arquitectura modular
- ✅ 5 Client Components reutilizables
- ✅ Middleware de autenticación
- ✅ TypeScript strict mode

**Línea Base Establecida**:
```
Core: rbac.ts, errors.ts, db.ts, supabase.ts
Modules: users/ (queries, actions, types)
Components: 5 client components
Documentation: Complete (4 docs)
```

### v0.2.0 - Phase 1 (Planned - Week 3)

- 🔨 Hackathons module (CRUD)
- 🔨 Criteria management
- 🔨 Participant registration
- 🔨 Organizer dashboard
- 🔨 Lifecycle states

### v0.3.0 - Phase 2 (Planned - Week 4-5)

- ⏳ Teams module
- ⏳ Submissions system
- ⏳ Evaluation interface
- ⏳ Leaderboard with scoring

### v0.4.0 - Phase 3 (Planned - Week 6)

- ⏳ Sponsors module
- ⏳ Organizations management
- ⏳ Challenges system
- ⏳ Shortlist feature

---

<div align="center">

**Built with ❤️ by the PuntoHack Team**

[Documentation](./docs) • [Architecture](./docs/ARCHITECTURE.md) • [Diagrams](./docs/DIAGRAMS.md) • [Roadmap](./docs/ROADMAP.md)

**Status**: Phase 0 Complete ✅ | Ready for Phase 1 🚀

</div>
