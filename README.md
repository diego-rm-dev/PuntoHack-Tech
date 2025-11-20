# 🚀 PuntoHack MVP Pro - Application

Professional hackathon management platform built with Next.js 15, Prisma, and Supabase.

## 📋 Prerequisites

- Node.js 20.x or 22.x LTS
- pnpm 9.x or higher
- PostgreSQL database (Supabase recommended)
- Clerk account for authentication
- Supabase account for realtime features
- Sentry account for monitoring (optional)

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
├── prisma/
│   ├── schema.prisma       # Database schema (source of truth)
│   ├── migrations/         # Database migrations
│   └── seeds/             # Seed scripts
├── src/
│   ├── app/               # Next.js App Router
│   ├── core/              # Core infrastructure
│   │   ├── db.ts         # Prisma client
│   │   ├── auth.ts       # Clerk + Profile resolver
│   │   ├── rbac.ts       # Permission helpers
│   │   ├── realtime.ts   # Supabase Realtime client
│   │   ├── errors.ts     # Error handling + Sentry
│   │   └── config.ts     # Environment config
│   ├── modules/           # Domain modules
│   │   ├── users/
│   │   ├── hackathons/
│   │   ├── teams/
│   │   ├── submissions/
│   │   ├── judging/
│   │   ├── leaderboard/
│   │   ├── organizations/
│   │   ├── sponsorships/
│   │   └── challenges/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── forms/        # Form components
│   │   └── layouts/      # Layout components
│   └── lib/              # Utilities
│       ├── utils/        # Helper functions
│       ├── hooks/        # Custom React hooks
│       └── constants/    # Constants
└── package.json
```

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

## 🎭 User Roles

- **PARTICIPANT** - Create/join teams, submit projects
- **JUDGE** - Evaluate submissions based on criteria
- **ORGANIZER** - Manage hackathons, configure criteria, assign judges
- **ADMIN** - Full access to all features
- **SPONSOR** - Manage challenges, view submissions, create shortlists

## 🔑 Tech Stack

- **Framework:** Next.js 15 (App Router, RSC-first)
- **Language:** TypeScript 5.6+
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 7.x
- **Auth:** Clerk
- **Realtime:** Supabase Realtime
- **Validation:** Zod
- **Styling:** Tailwind CSS 4.x
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Monitoring:** Sentry

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

See the `/docs` folder for detailed documentation:

- `mvp-definition.md` - Complete technical design
- `database-definition.md` - Database model details
- `flows-definition.md` - User flow specifications
- `development-roadmap.md` - Step-by-step development guide

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

Private - All rights reserved

## 🤝 Contributing

This is a private project. Contact the project owner for contribution guidelines.
