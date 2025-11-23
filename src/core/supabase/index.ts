/**
 * Supabase Clients - Centralized Export
 * 
 * Usage:
 * - Server Components/Actions: import { createClient } from '@/core/supabase/server'
 * - Client Components: import { createClient } from '@/core/supabase/client'
 * - Realtime Features: import { createRealtimeClient } from '@/core/supabase/realtime'
 */

// Note: Don't export all from here to maintain tree-shaking
// Import specific clients where needed
export { createClient as createServerClient } from './server';
export { createClient as createBrowserClient } from './client';
export { createRealtimeClient } from './realtime';
