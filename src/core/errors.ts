import * as Sentry from '@sentry/nextjs';

/**
 * Capture error with Sentry and console logging
 * Adds contextual tags for better error tracking
 * Ignores Next.js redirects and not-found errors (they're not real errors)
 */
export function captureError(
  error: unknown,
  context?: {
    userId?: string;
    hackathonId?: string;
    teamId?: string;
    organizationId?: string;
    role?: string;
    action?: string;
    [key: string]: any;
  }
) {
  // Ignore Next.js redirects and not-found - they're not errors
  if (error instanceof Error) {
    const errorMessage = error.message || '';
    const errorDigest = (error as any).digest || '';
    
    // NEXT_REDIRECT and NEXT_NOT_FOUND are normal Next.js flow control
    if (
      errorMessage === 'NEXT_REDIRECT' ||
      errorMessage === 'NEXT_NOT_FOUND' ||
      errorDigest.includes('NEXT_REDIRECT') ||
      errorDigest.includes('NEXT_NOT_FOUND')
    ) {
      // Don't log redirects/not-found as errors
      return;
    }
  }

  // Log only in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error captured:', error, context);
  }

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
      tags: {
        userId: context?.userId,
        hackathonId: context?.hackathonId,
        role: context?.role,
        action: context?.action,
      },
      level: 'error',
    });
  }
}

/**
 * Log warning to Sentry
 */
export function captureWarning(
  message: string,
  context?: Record<string, any>
) {
  // Log only in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('Warning:', message, context);
  }

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level: 'warning',
      extra: context,
    });
  }
}

/**
 * Log info to Sentry (for important business events)
 */
export function captureInfo(
  message: string,
  context?: Record<string, any>
) {
  // Log only in development
  if (process.env.NODE_ENV === 'development') {
    console.info('Info:', message, context);
  }

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level: 'info',
      extra: context,
    });
  }
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}
