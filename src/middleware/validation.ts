import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Input validation schemas
export const IntakeDataSchema = z.object({
  title: z.string().min(1).max(200),
  topic: z.string().min(1).max(200),
  duration: z.number().min(10).max(480), // 10 minutes to 8 hours
  audienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  prerequisites: z.array(z.string().max(100)).min(1).max(10),
  mainGoals: z.array(z.string().max(200)).min(1).max(10),
  constraints: z.array(z.string().max(200)).max(10).optional(),
  preferredStyle: z.string().max(200).optional(),
  specialRequirements: z.array(z.string().max(200)).max(10).optional()
});

export const CheckpointApprovalSchema = z.object({
  approved: z.boolean(),
  feedback: z.string().max(1000).optional()
});

export const ExportRequestSchema = z.object({
  format: z.enum(['zip', 'json']),
  package: z.any() // Will be validated separately based on LecturePackageSchema
});

// Sanitize input to prevent XSS
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove script tags and dangerous HTML
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (input && typeof input === 'object') {
    const sanitized: any = {};
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }

  return input;
}

// Validation middleware factory
export function validateBody(schema: z.ZodType<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitize input first
      req.body = sanitizeInput(req.body);

      // Validate against schema
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal validation error'
        });
      }
    }
  };
}

// Session ID validation
export function validateSessionId(req: Request, res: Response, next: NextFunction) {
  const { sessionId } = req.params;

  // UUID v4 regex pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!sessionId || !uuidPattern.test(sessionId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid session ID format'
    });
  }

  next();
}

// Rate limiting for specific endpoints
export const strictRateLimit = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
  message: 'Too many requests. Please wait before trying again.'
};

export const standardRateLimit = {
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Rate limit exceeded. Please try again later.'
};

// File size limits
export const fileSizeLimits = {
  json: 20 * 1024 * 1024, // 20MB
  zip: 50 * 1024 * 1024, // 50MB
};

// Timeout middleware
export function timeoutMiddleware(seconds: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      res.status(408).json({
        success: false,
        error: 'Request timeout'
      });
    }, seconds * 1000);

    res.on('finish', () => {
      clearTimeout(timeout);
    });

    next();
  };
}