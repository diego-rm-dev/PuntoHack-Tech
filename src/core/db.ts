/**
 * Arquitectura Híbrida: Prisma 7 (Schema + Tipos) + Supabase Client (Queries)
 * 
 * DECISIÓN ARQUITECTÓNICA:
 * - Prisma: Schema definition + Type generation + Migraciones
 * - Supabase Client: Todas las queries en runtime
 * 
 * JUSTIFICACIÓN:
 * ✅ Type-safety en desarrollo con Prisma types
 * ✅ Mejor compatibilidad con React Server Components (Supabase)
 * ✅ Migraciones robustas con Prisma Migrate
 * ✅ No hay overhead de Prisma Client en producción
 * 
 * USO CORRECTO:
 * 
 * 1. Para TODAS las queries: Usa Supabase Client
 *    import { createClient } from '@/lib/supabase/server';
 *    const supabase = await createClient();
 *    const { data } = await supabase.from('profiles').select('*');
 * 
 * 2. Para tipos: Importa desde @prisma/client
 *    import type { Profile, Role } from '@prisma/client';
 * 
 * 3. NO uses prisma.* en runtime (solo para migraciones/seeds)
 * 
 * NOTA: Este archivo exporta PrismaClient SOLO para seeds y scripts.
 *       En producción, Supabase Client maneja todas las queries.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Export default for backward compatibility
export const db = prisma;

// Re-exportar tipos útiles desde Prisma
// IMPORTANTE: Usa estos tipos, pero NO uses prisma.* para queries
// Todas las queries deben ir vía Supabase Client (@/core/supabase/server)
export type { Profile, Hackathon, Team, Submission } from '@prisma/client';

