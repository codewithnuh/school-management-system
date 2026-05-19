import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    schoolId?: number;
  };
}

/**
 * Error handling middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message,
      ...(err instanceof (require('../errors').TimetableConflictError as any) && {
        conflicts: (err as any).conflicts,
      }),
    });
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = (err as any).errors.map((e: any) => ({
      field: e.path,
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Validation error',
      details: errors,
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const fields = (err as any).errors.map((e: any) => e.path).join(', ');
    return res.status(409).json({
      success: false,
      error: 'ConflictError',
      message: `Duplicate value for: ${fields}`,
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    error: 'InternalServerError',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
  });
};

/**
 * Not found middleware
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: 'NotFoundError',
    message: `Route ${req.method} ${req.path} not found`,
  });
};

/**
 * Authentication middleware (placeholder - implement with your auth system)
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // TODO: Implement actual JWT/token verification
  // This is a placeholder for demonstration
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'UnauthorizedError',
      message: 'No token provided',
    });
  }

  // Placeholder: In real implementation, verify JWT and extract user info
  // For now, we'll skip actual authentication in development
  next();
};

/**
 * Role-based access control middleware
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UnauthorizedError',
        message: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'ForbiddenError',
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

/**
 * School-scoped data access middleware
 */
export const scopeToSchool = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'UnauthorizedError',
      message: 'Authentication required',
    });
  }

  // Admin can access all schools
  if (req.user.role === 'admin') {
    return next();
  }

  // Other roles are scoped to their school
  if (!req.user.schoolId) {
    return res.status(403).json({
      success: false,
      error: 'ForbiddenError',
      message: 'User not associated with any school',
    });
  }

  // Add schoolId to query params for filtering
  req.query.schoolId = req.user.schoolId.toString();
  next();
};

/**
 * Validation middleware factory
 */
export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Invalid input data',
        details: result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    // Attach validated data to request
    req.body = result.data;
    next();
  };
};

/**
 * Pagination middleware
 */
export const paginate = (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  req.query.page = page.toString();
  req.query.limit = limit.toString();

  // Calculate offset
  const offset = (page - 1) * limit;
  (req as any).pagination = { page, limit, offset };

  next();
};
