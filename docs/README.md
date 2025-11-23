# 📚 Documentación PuntoHack MVP

## 📖 Documentos Disponibles

### [ARCHITECTURE.md](./ARCHITECTURE.md) 📐
Arquitectura completa del sistema, stack tecnológico, RBAC, modelo de datos y patrones de código.

### [DIAGRAMS.md](./DIAGRAMS.md) 📊
Diagramas visuales en Mermaid: arquitectura, flujos, ERD, roadmap.

### [ROADMAP.md](./ROADMAP.md) 🚀
Plan detallado de implementación por fases con estimaciones y checklists.

### [TESTING-GUIDE.md](./TESTING-GUIDE.md) 🧪
Guía completa de testing: setup, patterns, coverage, best practices.

---

## 🎯 Estado del Proyecto

### ✅ Phase 0: Infrastructure Core (100%)
- Next.js 16 + React 19 + TypeScript
- Clerk Auth + Prisma + Supabase
- RBAC (5 roles) + Admin Panel
- Users Module + Testing (100% coverage)

### 🔨 Phase 1: Hackathons (Próximo)
- CRUD completo de Hackathons
- Gestión de Criterios
- Sistema de Registro

---

## 🛠️ Quick Commands

```bash
# Development
pnpm dev
pnpm type-check
pnpm lint

# Database
pnpm db:generate
pnpm db:push
pnpm db:studio

# Testing
pnpm test
pnpm test:coverage
```

---

## 🗂️ Estructura Principal

```
src/
├── app/              # Next.js App Router
├── core/             # Infrastructure (auth, rbac, db, errors)
├── modules/          # Domain modules (users, hackathons, etc.)
├── components/       # UI Components
└── lib/              # Utilities
```

---

**Última Actualización**: 23 de Noviembre, 2025  
**Versión**: 2.0 - Clean
