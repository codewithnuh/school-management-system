import type { RequestHandler } from 'express'
import { AUTH_COOKIE_NAME } from '@/config/auth-cookie.js'
import { env } from '@/config/env.js'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
const TRUSTED_ORIGINS = new Set([
    ...env.CORS_ORIGINS,
    new URL(env.FRONTEND_URL).origin,
])

export function isTrustedBrowserOrigin(origin: string | undefined): boolean {
    if (!origin || origin === 'null') return false
    try {
        const parsedOrigin = new URL(origin).origin
        return TRUSTED_ORIGINS.has(parsedOrigin) && parsedOrigin === origin
    } catch {
        return false
    }
}

export const protectCookieAuthenticatedRequests: RequestHandler = (
    request,
    response,
    next,
) => {
    if (SAFE_METHODS.has(request.method) || !request.cookies?.[AUTH_COOKIE_NAME]) {
        next()
        return
    }

    let refererOrigin: string | undefined
    const referer = request.get('referer')
    if (referer) {
        try {
            refererOrigin = new URL(referer).origin
        } catch {
            refererOrigin = undefined
        }
    }

    if (!isTrustedBrowserOrigin(request.get('origin') ?? refererOrigin)) {
        response.status(403).json({
            success: false,
            message: 'Request origin is not allowed',
        })
        return
    }

    next()
}
