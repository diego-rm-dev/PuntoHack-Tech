export const config = {
  app: {
    name: 'PuntoHack MVP Pro',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
} as const;
