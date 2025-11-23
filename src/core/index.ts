/**
 * Core Infrastructure - Centralized Export
 * 
 * This barrel export provides easy access to all core infrastructure.
 * Import from '@/core' for commonly used utilities.
 * Import from specific modules for better tree-shaking in production.
 */

// Authentication
export * from './auth';

// Role-Based Access Control
export * from './rbac';

// Database (Prisma)
export { db } from './db';

// Error Handling (export all except ForbiddenError to avoid conflict with rbac.ts)
export { captureError, captureWarning, captureInfo, AppError, ValidationError, NotFoundError } from './errors';

// Configuration
export * from './config';

// Supabase clients are not re-exported here to maintain clarity
// Import directly from '@/core/supabase/server' or '@/core/supabase/client'
