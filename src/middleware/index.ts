import type { RequestHandler } from 'express'
import type { ZodType, ZodTypeDef } from 'zod'

type RequestSchema = ZodType<unknown, ZodTypeDef, unknown>

export function validate(schema: RequestSchema): RequestHandler {
    return (request, response, next) => {
        const result = schema.safeParse(request.body)
        if (!result.success) {
            response.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'Invalid input data',
                details: result.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            })
            return
        }

        request.body = result.data
        next()
    }
}

function parsePositiveInteger(value: unknown): number | undefined {
    if (typeof value !== 'string' || !/^\d+$/.test(value)) return undefined
    const parsed = Number(value)
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined
}

export const paginate: RequestHandler = (request, response, next) => {
    const rawPage = request.query.page
    const rawLimit = request.query.limit
    const page = rawPage === undefined ? 1 : parsePositiveInteger(rawPage)
    const limit = rawLimit === undefined ? 20 : parsePositiveInteger(rawLimit)

    if (page === undefined || limit === undefined || limit > 100) {
        response.status(400).json({
            success: false,
            error: 'ValidationError',
            message: 'page and limit must be positive integers; limit cannot exceed 100',
        })
        return
    }

    request.pagination = { page, limit, offset: (page - 1) * limit }
    next()
}
