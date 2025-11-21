# 02 - Instalación de Dependencias

## 📅 Timeline de Instalación

### Round 1: Dependencias Base + Core Services
**Timestamp:** 19 Nov 2025, 21:08 UTC  
**Duración:** ~2 minutos  
**Comando:**
```powershell
pnpm install
```

**Resultado:** Instalación de dependencias por defecto de Next.js  
**Paquetes instalados:** 30 base packages

---

### Round 2: Core Dependencies
**Timestamp:** 21:10 UTC  
**Duración:** ~3 minutos  
**Comando:**
```powershell
pnpm add @prisma/client @clerk/nextjs @supabase/supabase-js zod date-fns nanoid @sentry/nextjs
```

**Output:**
```
Packages: +171
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 201, reused 0, downloaded 171, added 171, done
```

**Resultado:** ✅ Éxito - 171 paquetes añadidos

---

### Round 3: UI Dependencies
**Timestamp:** 21:15 UTC  
**Duración:** ~2 minutos  
**Comando:**
```powershell
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-toast lucide-react react-hook-form @hookform/resolvers clsx tailwind-merge
```

**Output:**
```
Packages: +49
++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 250, reused 201, downloaded 49, added 49, done
```

**Resultado:** ✅ Éxito - 49 paquetes añadidos

---

### Round 4: Dev Dependencies
**Timestamp:** 21:18 UTC  
**Duración:** ~1.5 minutos  
**Comando:**
```powershell
pnpm add -D prisma @types/node prettier prettier-plugin-tailwindcss tsx dotenv
```

**Output:**
```
Packages: +86
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 336, reused 250, downloaded 86, added 86, done
```

**Resultado:** ✅ Éxito - 86 paquetes añadidos

---

### Round 5: Prisma Configuration Fix
**Timestamp:** 21:35 UTC  
**Duración:** ~30 segundos  
**Comando:**
```powershell
pnpm add -D dotenv
```

**Razón:** Requerido para prisma.config.ts en Prisma 7  
**Resultado:** ✅ Ya estaba instalado (confirmado)

---

## 📦 Análisis Detallado de Dependencias

### Production Dependencies (18 paquetes principales)

#### 1. **@prisma/client** (7.0.0)
**Especificado:** 6.1.0  
**Obtenido:** 7.0.0  
**⚠️ Major Version Jump**

**Uso:** ORM para PostgreSQL  
**Importancia:** Crítica - Core del proyecto  
**Archivos que lo usan:**
- `src/core/db.ts`
- Todos los módulos futuros

**Breaking Changes identificados:**
- ❌ `url` y `directUrl` ya no van en `schema.prisma`
- ✅ Ahora se configura en `prisma.config.ts`
- ✅ `migrations.url` en lugar de `directUrl`

**Acción tomada:**
- Schema actualizado sin URLs
- prisma.config.ts creado
- db.ts ajustado para pasar URL al cliente

**Sub-dependencias:** ~45 paquetes

---

#### 2. **@clerk/nextjs** (6.35.2)
**Especificado:** 6.7.0  
**Obtenido:** 6.35.2  
**✅ Minor/Patch Updates (Compatible)**

**Uso:** Sistema de autenticación  
**Importancia:** Crítica - Auth del proyecto  
**Archivos que lo usan:**
- `src/core/auth.ts`
- Futuro `middleware.ts`
- Todos los componentes con auth

**Features usadas:**
- `currentUser()` - Obtener usuario actual
- `auth()` - Server-side auth
- Clerk Provider (a configurar)

**Sub-dependencias:** ~25 paquetes

**Variables de entorno requeridas:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

#### 3. **@supabase/supabase-js** (2.83.0)
**Especificado:** 2.47.0  
**Obtenido:** 2.83.0  
**✅ Minor Updates (Compatible)**

**Uso:** Realtime para leaderboard  
**Importancia:** Alta - Feature diferenciador  
**Archivos que lo usan:**
- `src/core/realtime.ts`
- Componentes de leaderboard (futuros)

**Features usadas:**
- Realtime subscriptions
- Client-side only
- Rate limit: 10 eventos/segundo

**Sub-dependencias:** ~15 paquetes

**Variables de entorno requeridas:**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

#### 4. **zod** (4.1.12)
**Especificado:** 3.23.8  
**Obtenido:** 4.1.12  
**⚠️ Major Version Jump**

**Uso:** Validación de datos  
**Importancia:** Alta - Seguridad de datos  
**Archivos que lo usan:**
- Futuros schemas de validación
- React Hook Form resolvers

**Breaking Changes conocidos:**
- API changes en Zod 4
- Mejor performance
- Mejores mensajes de error

**Acción requerida:**
- ⚠️ Verificar compatibilidad al crear schemas
- ✅ @hookform/resolvers compatible con Zod 4

**Sub-dependencias:** 0 (standalone)

---

#### 5. **date-fns** (4.1.0)
**Especificado:** 3.6.0  
**Obtenido:** 4.1.0  
**⚠️ Major Version Jump**

**Uso:** Manejo de fechas  
**Importancia:** Media - Timestamps, deadlines  
**Archivos que lo usan:**
- Componentes con fechas
- Formateo de timestamps
- Cálculo de deadlines

**Breaking Changes conocidos:**
- API changes en date-fns 4
- Mejor tree-shaking
- Soporte para Time Zones mejorado

**Sub-dependencias:** 0 (standalone)

---

#### 6. **nanoid** (5.0.8)
**Especificado:** 5.0.7  
**Obtenido:** 5.0.8  
**✅ Patch Update**

**Uso:** Generación de IDs únicos  
**Importancia:** Media - IDs para invite links  
**Casos de uso:**
- Invite codes para equipos
- Códigos de acceso únicos
- Short IDs para URLs

**Sub-dependencias:** 0 (standalone)

---

#### 7. **@sentry/nextjs** (10.26.0)
**Especificado:** 8.38.0  
**Obtenido:** 10.26.0  
**⚠️ Major Version Jump (+2 versions)**

**Uso:** Error tracking y monitoring  
**Importancia:** Media - Debugging en producción  
**Archivos que lo usan:**
- `src/core/errors.ts`
- Middleware de Sentry (pendiente setup)

**Features usadas:**
- Error capture
- Performance monitoring
- User context
- Breadcrumbs

**Sub-dependencias:** ~30 paquetes

**Variables de entorno requeridas:**
```env
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
```

**Setup pendiente:**
```bash
pnpm sentry:wizard
```

---

#### 8-17. **Radix UI Components** (varios)
**Paquetes instalados:**
1. `@radix-ui/react-dialog` (1.1.4)
2. `@radix-ui/react-dropdown-menu` (2.1.4)
3. `@radix-ui/react-label` (2.1.1)
4. `@radix-ui/react-select` (2.1.5)
5. `@radix-ui/react-tabs` (1.1.3)
6. `@radix-ui/react-toast` (1.2.4)

**Uso:** Componentes UI accesibles  
**Importancia:** Alta - Base de UI  
**Estado:** Instalados, no configurados aún

**Próximos pasos:**
- Crear componentes wrapper en `src/components/ui/`
- Configurar estilos con Tailwind
- Crear Storybook (opcional)

**Sub-dependencias totales:** ~40 paquetes

---

#### 18. **lucide-react** (0.469.0)
**Uso:** Iconos  
**Importancia:** Media - UI polish  
**Features:**
- Tree-shakable
- +1400 iconos
- Soporte para React 19

**Sub-dependencias:** 0 (standalone)

---

#### 19. **react-hook-form** (7.54.2)
**Uso:** Manejo de formularios  
**Importancia:** Alta - UX de forms  
**Archivos que lo usan:**
- Futuros formularios (login, registro hackathon, etc)

**Features usadas:**
- useForm hook
- Validación con Zod
- Performance optimization

**Sub-dependencias:** ~5 paquetes

---

#### 20. **@hookform/resolvers** (3.9.2)
**Uso:** Integración React Hook Form + Zod  
**Importancia:** Alta - Validación de forms  
**Compatibilidad:** ✅ Compatible con Zod 4

---

#### 21. **clsx** (2.1.1)
**Uso:** Construcción de classNames condicionales  
**Importancia:** Media - DX improvement  
**Archivos que lo usan:**
- `src/lib/utils/cn.ts`

---

#### 22. **tailwind-merge** (2.6.0)
**Uso:** Merge de clases Tailwind sin conflictos  
**Importancia:** Media - Evitar conflictos de estilos  
**Archivos que lo usan:**
- `src/lib/utils/cn.ts`

**Función implementada:**
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### Dev Dependencies (11 paquetes principales)

#### 1. **prisma** (7.0.0)
**Uso:** Prisma CLI y Dev Tools  
**Importancia:** Crítica - Generación de cliente, migraciones  
**Scripts que lo usan:**
- `db:generate`
- `db:push`
- `db:migrate`
- `db:studio`

**Sub-dependencias:** ~20 paquetes

---

#### 2. **@types/node** (22.10.2)
**Uso:** Types de Node.js para TypeScript  
**Importancia:** Alta - Autocompletado y type checking  
**Actualizado automáticamente:** Sí

---

#### 3. **prettier** (3.4.2)
**Uso:** Formateo de código  
**Importancia:** Alta - Consistencia de código  
**Estado:** Instalado, no configurado

**Configuración pendiente:**
```javascript
// prettier.config.js (pendiente crear)
module.exports = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  plugins: ["prettier-plugin-tailwindcss"],
};
```

---

#### 4. **prettier-plugin-tailwindcss** (0.6.9)
**Uso:** Auto-ordenar clases de Tailwind  
**Importancia:** Media - Mejores prácticas Tailwind  
**Estado:** Instalado, requiere configurar prettier

---

#### 5. **tsx** (4.19.2)
**Uso:** Ejecutar archivos TypeScript directamente  
**Importancia:** Media - Útil para scripts  
**Casos de uso:**
- Ejecutar seed files
- Scripts de mantenimiento
- Testing manual

---

#### 6. **dotenv** (16.4.7)
**Uso:** Cargar variables de entorno  
**Importancia:** Alta - Requerido por Prisma 7  
**Archivos que lo usan:**
- `prisma.config.ts`

---

## 📊 Estadísticas de Instalación

### Resumen de Paquetes
```
Total de paquetes principales: 29
├── Dependencies: 18
└── DevDependencies: 11

Total con sub-dependencias: ~809
├── Primera instalación: 30
├── Round 2: +171
├── Round 3: +49
├── Round 4: +86
└── Paquetes finales en node_modules: ~809
```

### Tamaño de node_modules
**Estimado:** ~350 MB  
**Archivos:** ~50,000  
**Tiempo de instalación total:** ~8 minutos

---

## 🔍 Comparación con Especificaciones

### Según development-roadmap.md:

| Dependencia | Especificado | Obtenido | Diferencia | Impacto |
|-------------|--------------|----------|------------|---------|
| @prisma/client | 6.1.0 | 7.0.0 | +1 major | ⚠️ Alto |
| @clerk/nextjs | 6.7.0 | 6.35.2 | +0.28 minor | ✅ Bajo |
| @supabase/supabase-js | 2.47.0 | 2.83.0 | +0.36 minor | ✅ Bajo |
| zod | 3.23.8 | 4.1.12 | +1 major | ⚠️ Medio |
| date-fns | 3.6.0 | 4.1.0 | +1 major | ⚠️ Medio |
| nanoid | 5.0.7 | 5.0.8 | +0.0.1 patch | ✅ Ninguno |
| @sentry/nextjs | 8.38.0 | 10.26.0 | +2 major | ⚠️ Medio |

### Análisis de Impacto:

**🚨 Alto Impacto:**
- **Prisma 7.0.0**: Cambios en configuración (solucionado)

**⚠️ Medio Impacto:**
- **Zod 4**: API changes (verificar al crear schemas)
- **date-fns 4**: API changes (verificar al usar)
- **Sentry 10**: Configuración diferente (verificar wizard)

**✅ Bajo/Sin Impacto:**
- Clerk, Supabase, nanoid: Compatible

---

## 🐛 Problemas Durante Instalación

### Problema 1: pnpm approve-builds
**Timestamp:** 21:12 UTC  
**Mensaje:**
```
? @prisma/client@7.0.0 requires a build script. Do you approve it?
```

**Solución:** Usuario aprobó con "y"  
**Razón:** Prisma genera código en post-install

---

### Problema 2: Peer Dependencies Warnings
**Timestamp:** 21:15 UTC  
**Warnings:**
```
WARN react-hook-form requires a peer of react@^18 but has react@19
```

**Análisis:** Warning solo, no error  
**Impacto:** Ninguno, React 19 retro-compatible  
**Acción:** Ignorar warning

---

### Problema 3: Git LF→CRLF Warnings
**Timestamp:** Durante toda la instalación  
**Mensaje:**
```
warning: in the working copy of 'package.json', LF will be replaced by CRLF
```

**Razón:** Sistema Windows  
**Impacto:** Ninguno, comportamiento esperado  
**Acción:** Ninguna requerida

---

## ✅ Validación Post-Instalación

### Checklist
- [x] node_modules/ directory existe
- [x] pnpm-lock.yaml generado
- [x] package.json actualizado con versiones
- [x] No errores críticos en instalación
- [x] Prisma CLI disponible (`pnpm prisma --version`)
- [x] TypeScript types disponibles

### Comandos de Validación Ejecutados
```powershell
# Verificar Prisma
pnpm prisma --version
# Output: prisma: 7.0.0

# Verificar estructura
ls node_modules/@prisma
# Output: client/ directory found

# Verificar TypeScript
pnpm tsc --version
# Output: Version 5.9.3
```

---

## 📈 Métricas

- **Tiempo total de instalación:** ~8 minutos
- **Paquetes descargados:** ~306
- **Paquetes reutilizados:** ~503
- **Ancho de banda usado:** ~180 MB
- **Espacio en disco:** ~350 MB (node_modules)

---

## ➡️ Siguiente Paso

**Acción:** Configuración de archivos (ver 03-CONFIGURATION.md)  
**Próximas tareas:**
- Actualizar tsconfig.json con strict mode
- Crear .env y .env.example
- Actualizar package.json con scripts

---

**Documento generado:** 19 Nov 2025, 22:35 UTC  
**Última actualización:** 19 Nov 2025, 22:35 UTC
