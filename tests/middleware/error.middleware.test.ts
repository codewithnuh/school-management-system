import type { NextFunction, Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { errorHandler } from '../../src/middleware/error.middleware.js'
import { AppError } from '../../src/errors/index.js'

describe('error handler middleware', () => {
    let request: Partial<Request>
    let response: Partial<Response>
    let next: NextFunction

    beforeEach(() => {
        request = {}
        response = {
            headersSent: false,
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        }
        next = vi.fn()
    })

    it('returns operational errors with their status and message', () => {
        errorHandler(
            new AppError('Invalid input', 400),
            request as Request,
            response as Response,
            next,
        )

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
            success: false,
            message: 'Invalid input',
        })
    })

    it('hides unexpected error details from clients', () => {
        errorHandler(
            new Error('Database password leaked'),
            request as Request,
            response as Response,
            next,
        )

        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.json).toHaveBeenCalledWith({
            success: false,
            message: 'Internal server error',
        })
    })

    it('never includes stack traces in client responses', () => {
        errorHandler(
            new AppError('Invalid input', 400),
            request as Request,
            response as Response,
            next,
        )

        expect(response.json).toHaveBeenCalledWith(
            expect.not.objectContaining({ stack: expect.any(String) }),
        )
    })

    it('does not write a response after headers were sent', () => {
        response.headersSent = true

        errorHandler(
            new Error('Unexpected failure'),
            request as Request,
            response as Response,
            next,
        )

        expect(response.status).not.toHaveBeenCalled()
        expect(response.json).not.toHaveBeenCalled()
    })
})
