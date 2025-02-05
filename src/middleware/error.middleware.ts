import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

// Custom error class for better error handling
export class AppError extends Error {
    statusCode: number
    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }
}

// Middleware to handle invalid JSON payloads
export const handleInvalidJSON = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON payload',
            error: err.message,
        })
    }
    next(err) // Pass other errors to the next middleware
}

// Middleware to handle Zod validation errors
export const handleValidationErrors = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        })
    }
    next(err) // Pass other errors to the next middleware
}

// Generic error-handling middleware
export const errorHandler = (
    err: Error & { statusCode?: number },
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    console.error('Error:', err.message || err)

    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'

    res.status(statusCode).json({
        success: false,
        message,
    })
}
