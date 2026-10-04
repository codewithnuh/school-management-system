import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError, ValidationError } from '@/errors/index.js'

export const handleInvalidJSON: ErrorRequestHandler = (
    error,
    _request,
    response,
    next,
) => {
    if (error instanceof SyntaxError && 'body' in error) {
        response
            .status(400)
            .json({ success: false, message: 'Invalid JSON payload' })
        return
    }
    next(error)
}

export const handleValidationErrors: ErrorRequestHandler = (
    error,
    _request,
    response,
    next,
) => {
    if (error instanceof ZodError) {
        response.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        })
        return
    }
    if (error instanceof ValidationError) {
        response.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.details ?? [],
        })
        return
    }
    next(error)
}

export const errorHandler: ErrorRequestHandler = (
    error: unknown,
    _request,
    response,
    _next,
) => {
    if (response.headersSent) return

    if (error instanceof AppError) {
        response
            .status(error.statusCode)
            .json({ success: false, message: error.message })
        return
    }

    console.error('Unhandled request error', error)
    response
        .status(500)
        .json({ success: false, message: 'Internal server error' })
}
