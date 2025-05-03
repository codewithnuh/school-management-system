import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import process from 'process'
import { Session } from '@/models/index.js'

const { JWT_SECRET } = process.env
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.')
}

/**
 * Updated: Include 'OWNER' role in the enumeration
 */
type UserRole = 'ADMIN' | 'TEACHER' | 'USER' | 'PARENT' | 'OWNER'

/**
 * Extended JwtPayload to include ID and role fields for RBAC.
 */
interface AuthTokenPayload extends JwtPayload {
    id?: number
    role?: UserRole
    entityType?: string // Can be 'OWNER', 'TEACHER', etc.
}

/**
 * An object containing relevant authentication/authorization error messages and statuses.
 */
const AuthErrors = {
    TOKEN_MISSING: { status: 401, message: 'Authentication token missing' },
    INVALID_PAYLOAD: { status: 401, message: 'Invalid token payload' },
    INVALID_TOKEN: { status: 401, message: 'Invalid or expired token' },
    SESSION_NOT_FOUND: {
        status: 401,
        message: 'Session not found. Token may have been revoked.',
    },
    SESSION_EXPIRED: { status: 401, message: 'Session expired' },
    INSUFFICIENT_PERMISSIONS: {
        status: 403,
        message: 'You do not have permission to access this resource',
    },
    INTERNAL_ERROR: { status: 500, message: 'Internal server error' },
} as const

const validateSession = async (token: string): Promise<void> => {
    const session = await Session.findOne({ where: { token } })
    if (!session) {
        throw new Error(AuthErrors.SESSION_NOT_FOUND.message)
    }
    if (new Date() > session.expiryDate) {
        await Session.destroy({ where: { token } })
        throw new Error(AuthErrors.SESSION_EXPIRED.message)
    }
}

/**
 * Middleware for JWT-based authentication and role-based access control (RBAC)
 */
function authWithRBAC(allowedRoles: UserRole[] = []) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const token = req.cookies?.token
            if (!token) {
                res.status(AuthErrors.TOKEN_MISSING.status).json({
                    error: AuthErrors.TOKEN_MISSING.message,
                })
                return
            }

            let payload: AuthTokenPayload
            try {
                payload = jwt.verify(token, JWT_SECRET!) as AuthTokenPayload
            } catch {
                res.status(AuthErrors.INVALID_TOKEN.status).json({
                    error: AuthErrors.INVALID_TOKEN.message,
                })
                return
            }

            await validateSession(token)

            // Check if user role is permitted
            if (allowedRoles.length > 0) {
                const userRole: UserRole = payload.entityType as UserRole
                const isRoleAllowed = allowedRoles.includes(userRole)
                if (!isRoleAllowed) {
                    res.status(AuthErrors.INSUFFICIENT_PERMISSIONS.status).json(
                        {
                            error: AuthErrors.INSUFFICIENT_PERMISSIONS.message,
                        },
                    )
                    return
                }
            }

            req.body = req.body || {}
            req.body.user = payload
            return next()
        } catch (error) {
            const errorMessage = (error as Error).message

            if (
                errorMessage === AuthErrors.SESSION_NOT_FOUND.message ||
                errorMessage === AuthErrors.SESSION_EXPIRED.message
            ) {
                res.status(AuthErrors.INVALID_TOKEN.status).json({
                    error: errorMessage,
                })
                return
            }
            if (errorMessage === AuthErrors.INSUFFICIENT_PERMISSIONS.message) {
                res.status(AuthErrors.INSUFFICIENT_PERMISSIONS.status).json({
                    error: errorMessage,
                })
                return
            }

            res.status(AuthErrors.INTERNAL_ERROR.status).json({
                error: AuthErrors.INTERNAL_ERROR.message,
            })
        }
    }
}

export default authWithRBAC
