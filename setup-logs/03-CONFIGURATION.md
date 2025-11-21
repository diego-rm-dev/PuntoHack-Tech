# 03 - Archivos de Configuración

## 📅 Timeline de Configuración

### tsconfig.json - Strict Mode
**Timestamp:** 19 Nov 2025, 21:20 UTC  
**Acción:** Modificación de configuración TypeScript  
**Duración:** Instantánea

---

### .env y .env.example
**Timestamp:** 21:25 UTC  
**Acción:** Creación de archivos de entorno  
**Duración:** 2 minutos

---

### package.json - Scripts Personalizados
**Timestamp:** 21:28 UTC  
**Acción:** Añadir scripts de utilidad  
**Duración:** 1 minuto

---

### prisma.config.ts
**Timestamp:** 21:32 UTC  
**Acción:** Configuración de Prisma 7  
**Duración:** 1 minuto

---

## 📝 Archivo 1: tsconfig.json

### Estado Original (generado por Next.js)
```json
{
  "compilerOptions": {
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Modificaciones Realizadas
**Cambios aplicados:**
```json
{
  "compilerOptions": {
    // ... existing config
    "target": "ES2022",              // ← AÑADIDO
    "strict": true,                  // ← MODIFICADO (era false)
    "strictNullChecks": true,        // ← AÑADIDO
    "noUncheckedIndexedAccess": true,// ← AÑADIDO
    "noImplicitAny": true,          // ← AÑADIDO
    // ... rest of config
  }
}
```

### Justificación de Cambios

#### 1. `"target": "ES2022"`
**Razón:** Mejor soporte de features modernas  
**Beneficios:**
- Top-level await
- Class fields
- Private methods
- Better async/await

**Compatibilidad:** Node.js 20+ (requisito del proyecto)

---

#### 2. `"strict": true` (changed from false)
**Razón:** Activar todas las verificaciones estrictas  
**Incluye:**
- `noImplicitAny`
- `strictNullChecks`
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`
- `noImplicitThis`
- `alwaysStrict`

**Impacto:** Código más seguro, menos bugs en runtime

---

#### 3. `"strictNullChecks": true`
**Razón:** Prevenir errores de null/undefined  
**Ejemplo de error detectado:**
```typescript
// ❌ Error sin strict null checks
function getUser(id: string) {
  return users.find(u => u.id === id); // puede ser undefined
}
const name = getUser("123").name; // Crash si user no existe

// ✅ Con strict null checks
function getUser(id: string): User | undefined {
  return users.find(u => u.id === id);
}
const user = getUser("123");
if (user) {
  const name = user.name; // Seguro
}
```

---

#### 4. `"noUncheckedIndexedAccess": true`
**Razón:** Arrays y objetos indexados son potencialmente undefined  
**Ejemplo:**
```typescript
const arr = [1, 2, 3];

// ❌ Sin la opción
const value: number = arr[10]; // Tipo: number (MENTIRA!)

// ✅ Con la opción
const value: number | undefined = arr[10]; // Tipo correcto
if (value !== undefined) {
  // uso seguro
}
```

---

#### 5. `"noImplicitAny": true`
**Razón:** Forzar tipos explícitos  
**Ejemplo:**
```typescript
// ❌ Error con noImplicitAny
function process(data) { // Error: 'data' implicitly has 'any' type
  return data.value;
}

// ✅ Correcto
function process(data: { value: string }) {
  return data.value;
}
```

---

### Impacto en el Proyecto

**Ventajas:**
- ✅ Detección temprana de errores
- ✅ Mejor autocompletado en VSCode
- ✅ Refactoring más seguro
- ✅ Menos bugs en producción

**Desventajas:**
- ⚠️ Código más verboso
- ⚠️ Curva de aprendizaje para devs juniors
- ⚠️ Algunas librerías mal tipadas pueden causar problemas

**Decisión:** Ventajas superan desventajas para proyecto de esta escala

---

## 📝 Archivo 2: .env

### Creación
**Timestamp:** 21:25 UTC  
**Ubicación:** `puntohack-mvp-app/.env`  
**Contenido completo:**

```env
# Database Configuration
# PostgreSQL connection string via Supabase
# Format: postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?pgbouncer=true
DATABASE_URL="postgresql://postgres:password@db.example.supabase.co:5432/postgres?pgbouncer=true"

# Direct database connection (bypasses PgBouncer for migrations)
# Format: postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
DIRECT_URL="postgresql://postgres:password@db.example.supabase.co:5432/postgres"

# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# Clerk Authentication
# Get these from: https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Clerk URLs (customize as needed)
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# Sentry Error Tracking (Optional)
# Get these from: https://sentry.io
SENTRY_AUTH_TOKEN=""
NEXT_PUBLIC_SENTRY_DSN=""
SENTRY_ORG=""
SENTRY_PROJECT=""

# Application Configuration
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Análisis Detallado de Variables

#### Grupo 1: Database (Crítico)
**Variables:**
1. `DATABASE_URL` - Conexión principal con PgBouncer
2. `DIRECT_URL` - Conexión directa para migraciones

**Formato Supabase:**
- Host: `db.{project-ref}.supabase.co`
- Puerto: `5432`
- Usuario: `postgres`
- Database: `postgres`
- PgBouncer: `?pgbouncer=true` en URL principal

**⚠️ IMPORTANTE:** 
- `DATABASE_URL` usa PgBouncer (connection pooling)
- `DIRECT_URL` bypassa PgBouncer (requerido para migraciones)
- Prisma 7 requiere ambas

**Estado:** ⏳ Placeholder - Requiere credenciales reales

---

#### Grupo 2: Supabase (Crítico para Realtime)
**Variables:**
1. `NEXT_PUBLIC_SUPABASE_URL` - URL del proyecto
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - API key pública

**Uso:**
- Realtime subscriptions (leaderboard)
- Client-side queries (si aplica)

**Obtención:**
Dashboard → Project Settings → API

**Prefijo NEXT_PUBLIC:**
- ✅ Expuesto al cliente
- ✅ Seguro (anon key tiene permisos limitados)

**Estado:** ⏳ Placeholder - Requiere credenciales reales

---

#### Grupo 3: Clerk (Crítico)
**Variables:**
1. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - API key pública
2. `CLERK_SECRET_KEY` - API key secreta
3. `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Ruta de login
4. `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Ruta de registro
5. `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - Redirect post-login
6. `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Redirect post-registro

**Obtención:**
Dashboard → API Keys

**Configuración de URLs:**
- `/sign-in` y `/sign-up` son rutas por defecto
- Redirect a `/` (home) después de auth
- Personalizables según flujo deseado

**⚠️ SEGURIDAD:**
- `CLERK_SECRET_KEY` NUNCA debe exponerse al cliente
- Solo usar en server components/API routes

**Estado:** ⏳ Placeholder - Requiere credenciales reales

---

#### Grupo 4: Sentry (Opcional)
**Variables:**
1. `SENTRY_AUTH_TOKEN` - Token para deploys
2. `NEXT_PUBLIC_SENTRY_DSN` - Data Source Name
3. `SENTRY_ORG` - Nombre de organización
4. `SENTRY_PROJECT` - Nombre de proyecto

**Uso:**
- Error tracking en producción
- Performance monitoring
- Release tracking

**Setup pendiente:**
```bash
pnpm sentry:wizard
```

**Estado:** ⏳ Opcional - Puede configurarse después

---

#### Grupo 5: Application (Configurado)
**Variables:**
1. `NODE_ENV` - Ambiente (development/production)
2. `NEXT_PUBLIC_APP_URL` - URL base de la app

**Valores actuales:**
- `development` para local
- `http://localhost:3000` por defecto

**Cambios en producción:**
- `NODE_ENV="production"`
- `NEXT_PUBLIC_APP_URL="https://puntohack.com"` (ejemplo)

**Estado:** ✅ Configurado para desarrollo

---

## 📝 Archivo 3: .env.example

### Creación
**Timestamp:** 21:26 UTC  
**Ubicación:** `puntohack-mvp-app/.env.example`  
**Propósito:** Template para nuevos desarrolladores

**Contenido:** Idéntico a `.env` pero con valores de placeholder  
**Razón:** Documentar todas las variables requeridas sin exponer credenciales

**Uso:**
```bash
# Nuevo desarrollador clona el repo
cp .env.example .env
# Luego edita .env con credenciales reales
```

**Estado:** ✅ Creado y documentado

---

## 📝 Archivo 4: package.json - Scripts Personalizados

### Scripts Añadidos
**Timestamp:** 21:28 UTC  
**Scripts agregados:** 8

#### package.json - Sección scripts ANTES:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

#### package.json - Sección scripts DESPUÉS:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seeds/dev-seed.ts",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "sentry:wizard": "sentry-wizard -i nextjs"
  }
}
```

### Análisis de Scripts

#### 1. `db:generate`
**Comando:** `prisma generate`  
**Propósito:** Generar Prisma Client  
**Cuándo usar:** 
- Después de cambiar schema.prisma
- Después de git pull con cambios en schema

**Output:** 
- Genera código en `node_modules/.prisma/client`
- TypeScript types actualizados

**Uso:**
```bash
pnpm db:generate
```

---

#### 2. `db:push`
**Comando:** `prisma db push`  
**Propósito:** Sincronizar schema con DB sin crear migración  
**Cuándo usar:**
- En desarrollo rápido/prototipado
- No crea archivos de migración
- ⚠️ NO USAR EN PRODUCCIÓN

**Ventajas:**
- Rápido
- No contamina carpeta migrations/

**Desventajas:**
- No hay historial de cambios
- No reversible

**Uso:**
```bash
pnpm db:push
```

---

#### 3. `db:migrate`
**Comando:** `prisma migrate dev`  
**Propósito:** Crear y aplicar migración con nombre  
**Cuándo usar:**
- Cambios que irán a producción
- Cuando necesitas historial de cambios
- ✅ RECOMENDADO PARA FEATURES

**Proceso:**
1. Detecta cambios en schema.prisma
2. Crea archivo SQL en prisma/migrations/
3. Aplica migración a DB
4. Genera Prisma Client

**Uso:**
```bash
pnpm db:migrate
# Te pedirá nombre de migración
```

**Ejemplo:**
```bash
pnpm db:migrate
# ✔ Enter a name for the new migration: add_deadline_to_hackathon
```

---

#### 4. `db:studio`
**Comando:** `prisma studio`  
**Propósito:** UI visual para ver/editar datos  
**Cuándo usar:**
- Debugging de datos
- Edición manual de registros
- Verificar relaciones

**Features:**
- Interfaz web en http://localhost:5555
- Ver todas las tablas
- Editar, crear, eliminar registros
- Ver relaciones

**Uso:**
```bash
pnpm db:studio
# Abre navegador automáticamente
```

---

#### 5. `db:seed`
**Comando:** `tsx prisma/seeds/dev-seed.ts`  
**Propósito:** Poblar DB con datos de desarrollo  
**Cuándo usar:**
- Después de reset de DB
- Al empezar desarrollo
- Para testing

**Estado:** ⏳ Script pendiente de crear

**Contenido futuro:**
- Usuarios de prueba
- Hackathon de ejemplo
- Equipos de ejemplo
- Submissions de ejemplo

**Uso:**
```bash
pnpm db:seed
```

---

#### 6. `format`
**Comando:** `prettier --write "**/*.{ts,tsx,json,md}"`  
**Propósito:** Formatear código automáticamente  
**Cuándo usar:**
- Antes de commit
- Después de merge conflicts
- Para mantener consistencia

**Archivos afectados:**
- TypeScript/TSX
- JSON
- Markdown

**⚠️ NOTA:** Requiere prettier.config.js (pendiente crear)

**Uso:**
```bash
pnpm format
```

---

#### 7. `type-check`
**Comando:** `tsc --noEmit`  
**Propósito:** Verificar errores de TypeScript sin compilar  
**Cuándo usar:**
- Antes de commit
- En CI/CD pipeline
- Debugging de tipos

**Ventajas:**
- Rápido (no compila)
- Detecta errores de tipos
- No modifica archivos

**Uso:**
```bash
pnpm type-check
```

---

#### 8. `sentry:wizard`
**Comando:** `sentry-wizard -i nextjs`  
**Propósito:** Configurar Sentry interactivamente  
**Cuándo usar:**
- Cuando tengas cuenta de Sentry
- Para setup inicial de monitoring

**Proceso:**
1. Login en Sentry
2. Seleccionar proyecto
3. Configurar DSN
4. Crear archivos de config

**Estado:** ⏳ Pendiente ejecutar

**Uso:**
```bash
pnpm sentry:wizard
```

---

## 📝 Archivo 5: prisma.config.ts

### Creación
**Timestamp:** 21:32 UTC  
**Ubicación:** `puntohack-mvp-app/prisma.config.ts`  
**Razón:** Prisma 7 requiere configuración externa

### Contenido Completo:
```typescript
import "dotenv/config";

export default {
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    url: process.env.DIRECT_URL,
  },
};
```

### Análisis del Archivo

#### Import de dotenv
```typescript
import "dotenv/config";
```
**Propósito:** Cargar variables de .env  
**Razón:** Prisma CLI necesita acceso a env vars  
**Alternativa:** Usar `dotenv-cli` pero menos directo

---

#### datasource.url
```typescript
datasource: {
  url: process.env.DATABASE_URL,
}
```
**Propósito:** URL principal de la base de datos  
**Usa:** Conexión con PgBouncer  
**Para:** Queries normales de la aplicación

---

#### migrations.url
```typescript
migrations: {
  url: process.env.DIRECT_URL,
}
```
**Propósito:** URL directa para migraciones  
**Usa:** Conexión sin PgBouncer  
**Para:** `prisma migrate dev/deploy`

**⚠️ IMPORTANTE:**
- PgBouncer no soporta comandos DDL (CREATE TABLE, etc)
- Migraciones requieren conexión directa
- Prisma 7 separó esto en `migrations.url`

---

### Cambios vs Prisma 6

**Prisma 6 (schema.prisma):**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**Prisma 7 (schema.prisma + prisma.config.ts):**

**schema.prisma:**
```prisma
datasource db {
  provider = "postgresql"
  // ❌ No more url or directUrl here
}
```

**prisma.config.ts:**
```typescript
export default {
  datasource: { url: process.env.DATABASE_URL },
  migrations: { url: process.env.DIRECT_URL },
};
```

**Razón del cambio:**
- Mayor flexibilidad
- Configuración más programática
- Mejor separación de concerns

---

## 📊 Resumen de Configuraciones

### Archivos Modificados/Creados

| Archivo | Acción | Timestamp | Estado |
|---------|--------|-----------|--------|
| tsconfig.json | Modificado | 21:20 | ✅ |
| .env | Creado | 21:25 | ⏳ Credenciales pendientes |
| .env.example | Creado | 21:26 | ✅ |
| package.json | Modificado | 21:28 | ✅ |
| prisma.config.ts | Creado | 21:32 | ✅ |

### Compliance con Roadmap

**Según development-roadmap.md, Fase 0:**

- [x] Configure TypeScript strict mode ✅
- [x] Setup .env file structure ✅
- [x] Add utility scripts to package.json ✅
- [x] Configure Prisma (adapted for v7) ✅

**Compliance:** 100% (con ajustes para Prisma 7)

---

## ➡️ Siguiente Paso

**Acción:** Creación de schema Prisma (ver 04-PRISMA-SCHEMA.md)  
**Archivo:** `prisma/schema.prisma`

---

**Documento generado:** 19 Nov 2025, 22:40 UTC  
**Última actualización:** 19 Nov 2025, 22:40 UTC
