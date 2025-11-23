/**
 * Next.js Instrumentation API
 * Used to configure Sentry and other monitoring tools
 * This runs once when the server starts
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation
    const Sentry = await import('@sentry/nextjs');
    
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        
        // Performance Monitoring
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        
        // Session Replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        
        // Environment
        environment: process.env.NODE_ENV || 'development',
        
        // Ignore Next.js internal errors
        ignoreErrors: [
          'NEXT_REDIRECT',
          'NEXT_NOT_FOUND',
          /NEXT_REDIRECT/i,
          /NEXT_NOT_FOUND/i,
        ],
        
        // Filter out Next.js redirects from error tracking
        beforeSend(event, hint) {
          const error = hint.originalException;
          
          // Ignore Next.js redirects and not-found
          if (error instanceof Error) {
            const message = error.message || '';
            const digest = (error as Error & { digest?: string }).digest || '';
            
            if (
              message === 'NEXT_REDIRECT' ||
              message === 'NEXT_NOT_FOUND' ||
              digest.includes('NEXT_REDIRECT') ||
              digest.includes('NEXT_NOT_FOUND')
            ) {
              return null; // Don't send to Sentry
            }
          }
          
          return event;
        },
      });
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation (if needed)
    const Sentry = await import('@sentry/nextjs');
    
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 0.1,
        environment: process.env.NODE_ENV || 'development',
        
        ignoreErrors: [
          'NEXT_REDIRECT',
          'NEXT_NOT_FOUND',
        ],
      });
    }
  }
}
