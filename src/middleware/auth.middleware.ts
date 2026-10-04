import type { Request, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { AUTH_COOKIE_NAME } from '@/config/auth-cookie.js'
import { env } from '@/config/env.js'
import { sessionStore } from '@/services/session-store.service.js'

type UserRole = 'ADMIN' | 'TEACHER' | 'USER' | 'STUDENT' | 'PARENT' | 'OWNER'
const VALID_ROLES: readonly UserRole[] = [
    'ADMIN',
    'TEACHER',
    'USER',
    'STUDENT',
    'PARENT',
    'OWNER',
]

interface AuthTokenPayload extends jwt.JwtPayload {
    userId?: number
    entityType?: UserRole
}

async function validateSession(
    token: string,
    userId: number,
    entityType: UserRole,
): Promise<boolean> {
    const session = await sessionStore.findByToken(token)
    if (!session) {
        return false
    }
    if (session.expiryDate <= new Date()) {
        await sessionStore.deleteByToken(token)
        return false
    }
    return session.userId === userId && session.entityType === entityType
}

function getTokenFromRequest(req: Request): string | undefined {
    // Try cookie, then Authorization header (Bearer)
    if (req.cookies?.[AUTH_COOKIE_NAME]) {
        return req.cookies[AUTH_COOKIE_NAME]
    }

    const authHeader =
        req.headers['authorization'] || req.headers['Authorization']
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7)
    }

    return undefined
}

export default function authWithRBAC(
    allowedRoles: UserRole[] = [],
): RequestHandler {
    return async (req, res, next) => {
        const token = getTokenFromRequest(req)
        if (!token) {
            res.status(401).json({ error: 'Authentication token missing' })
            return
        }

        let payload: AuthTokenPayload
        try {
            payload = jwt.verify(token, env.JWT_SECRET, {
                algorithms: ['HS256'],
            }) as AuthTokenPayload
        } catch {
            res.status(401).json({ error: 'Invalid or expired token' })
            return
        }

        if (
            !Number.isSafeInteger(payload.userId) ||
            !payload.userId ||
            !payload.entityType ||
            !VALID_ROLES.includes(payload.entityType)
        ) {
            res.status(401).json({ error: 'Invalid or expired token' })
            return
        }

        try {
            if (!(await validateSession(token, payload.userId, payload.entityType))) {
                res.status(401).json({ error: 'Invalid or expired token' })
                return
            }
        } catch (error: unknown) {
            next(error)
            return
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(payload.entityType)) {
            res.status(403).json({ error: 'Insufficient permissions' })
            return
        }

        req.auth = {
            userId: payload.userId,
            entityType: payload.entityType,
        }
        next()
    }
}
