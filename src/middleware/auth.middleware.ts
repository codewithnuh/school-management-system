/**
 * @fileoverview
 * authWithRBAC is a middleware that enforces JWT-based authentication and role-based access control (RBAC).
 * It checks for an existing session, validates the JWT, and verifies that the user's role is
 * among the allowed roles for the endpoint. If successful, it attaches the token payload to req.body.
 *
 * Usage Example:
 * -----------------------------------------------------------------------------------------
 * // In your routes file, for an endpoint accessible only to 'ADMIN' role:
 * import { Router } from 'express'
 * import authWithRBAC from '@/middleware/auth.middleware'
 *
 * const router = Router()
 *
 * // This route is protected and only accessible to users with the 'ADMIN' role.
 * router.post('/admin-route', authWithRBAC(['ADMIN']), (req, res) => {
 *   res.json({ message: 'Admin route accessed.' })
 * })
 *
 * export default router
 * -----------------------------------------------------------------------------------------
 */

import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import process from 'process'
import { Session } from '@/models/index.js'

/**
 * The JWT secret key must be set as an environment variable.
 */
const { JWT_SECRET } = process.env
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.')
}

/**
 * Enumeration of possible roles. Adjust or extend as needed for your application.
 */
type UserRole = 'ADMIN' | 'TEACHER' | 'USER' | 'PARENT'

/**
 * Extended JwtPayload to include ID and role fields for RBAC.
 */
interface AuthTokenPayload extends JwtPayload {
    id?: number
    role?: UserRole
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
        message: 'You do not have permission to access this resource', // Updated message for role-based access
    },
    INTERNAL_ERROR: { status: 500, message: 'Internal server error' },
} as const

/**
 * Validates the session associated with the token in the Session model.
 * If the session doesn't exist or has expired, throws an error.
 *
 * @param token - The JWT token associated with the session.
 * @throws {Error} if the session is missing or expired.
 */
const validateSession = async (token: string): Promise<void> => {
    const session = await Session.findOne({ where: { token } })
    if (!session) {
        throw new Error(AuthErrors.SESSION_NOT_FOUND.message)
    }

    if (new Date() > session.expiryDate) {
        throw new Error(AuthErrors.SESSION_EXPIRED.message)
    }
}

/**
 * Creates an Express middleware that:
 *   1. Retrieves a JWT token from cookies ('token').
 *   2. Verifies the token using JWT_SECRET.
 *   3. Validates the session in the DB.
 *   4. Checks if the user's role is in the list of allowed roles (allowedRoles).
 *   5. Attaches the token payload to req.body.user.
 *
 * If any check fails, it sends an error response and halts request processing.
 *
 * @example
 * import authWithRBAC from '@/middleware/auth.middleware'
 *
 * router.get('/admin-dashboard', authWithRBAC(['ADMIN']), (req, res) => {
 *   // Accessible only to users with 'ADMIN' role.
 *   res.json({ message: 'Welcome to the admin dashboard.' })
 * })
 *
 * @param allowedRoles - Array of roles allowed to access the endpoint.
 *                       If empty, only authentication is enforced, no role check.
 * @returns An Express middleware function.
 */
function authWithRBAC(allowedRoles: UserRole[] = []) {
    // Modified: Accepts allowedRoles
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            // 1. Retrieve token from cookies
            const token = req.cookies?.token
            if (!token) {
                res.status(AuthErrors.TOKEN_MISSING.status).json({
                    error: AuthErrors.TOKEN_MISSING.message,
                })
                return
            }

            // 2. Verify the JWT
            let payload: AuthTokenPayload
            try {
                payload = jwt.verify(
                    token,
                    process.env.JWT_SECRET!,
                ) as AuthTokenPayload
            } catch (err) {
                console.error(err)
                res.status(AuthErrors.INVALID_TOKEN.status).json({
                    error: AuthErrors.INVALID_TOKEN.message,
                })
                return
            }

            // 3. Validate session
            await validateSession(token)

            // 4. If this route has allowed roles, verify user's role is permitted
            if (allowedRoles.length > 0) {
                const userRole: UserRole = payload.entityType!
                const isRoleAllowed = allowedRoles.includes(userRole) // Check if userRole is in allowedRoles
                if (!isRoleAllowed) {
                    res.status(AuthErrors.INSUFFICIENT_PERMISSIONS.status).json(
                        {
                            error: AuthErrors.INSUFFICIENT_PERMISSIONS.message,
                        },
                    )
                    return
                }
            }

            // 5. Attach token payload to request -  Make sure to initialize req.body if it's undefined
            req.body = req.body || {}
            req.body.user = payload

            // 6. Hand off to next middleware or route handler
            return next()
        } catch (error) {
            console.error('Authentication error:', error)
            const errorMessage = (error as Error).message

            // Check for known error messages and return specific error responses
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

            // Otherwise, return a generic internal error
            res.status(AuthErrors.INTERNAL_ERROR.status).json({
                error: AuthErrors.INTERNAL_ERROR.message,
            })
        }
    }
}

export default authWithRBAC
