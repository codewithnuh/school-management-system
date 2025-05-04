import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import process from 'process'
import { Admin, Session } from '@/models/index.js'

const { JWT_SECRET } = process.env
if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined.')

type UserRole = 'ADMIN' | 'TEACHER' | 'USER' | 'PARENT' | 'OWNER'

interface AuthTokenPayload extends jwt.JwtPayload {
    id?: number
    entityType?: UserRole
}

const AuthErrors = {
    TOKEN_MISSING: { status: 401, message: 'Authentication token missing' },
    INVALID_TOKEN: { status: 401, message: 'Invalid or expired token' },
    SESSION_NOT_FOUND: { status: 401, message: 'Session not found' },
    SESSION_EXPIRED: { status: 401, message: 'Session expired' },
    INSUFFICIENT_PERMISSIONS: {
        status: 403,
        message: 'Insufficient permissions',
    },
    SUBSCRIPTION_REQUIRED: {
        status: 403,
        message:
            'Your subscription is not active. Please renew to access this feature.',
    },
    ADMIN_NOT_FOUND: { status: 401, message: 'Admin not found' },
    INTERNAL_ERROR: { status: 500, message: 'Internal server error' },
} as const

async function validateSession(token: string) {
    try {
        console.log(
            `[Auth Debug] Looking up session for token: ${token.substring(0, 10)}...`,
        )
        const session = await Session.findOne({ where: { token } })

        if (!session) {
            console.log('[Auth Debug] Session not found for token')
            throw new Error(AuthErrors.SESSION_NOT_FOUND.message)
        }

        console.log(
            `[Auth Debug] Session found, expiry: ${session.expiryDate}, current time: ${new Date()}`,
        )
        if (new Date() > session.expiryDate) {
            console.log('[Auth Debug] Session expired, destroying session')
            await Session.destroy({ where: { token } })
            throw new Error(AuthErrors.SESSION_EXPIRED.message)
        }

        console.log('[Auth Debug] Session is valid')
        return true
    } catch (error) {
        console.error('[Auth Debug] Session validation error:', error)
        throw error
    }
}

function getTokenFromRequest(req: Request): string | undefined {
    // Try cookie, then Authorization header (Bearer)
    if (req.cookies?.token) {
        console.log('[Auth Debug] Token found in cookies')
        return req.cookies.token
    }

    const authHeader =
        req.headers['authorization'] || req.headers['Authorization']
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        console.log('[Auth Debug] Token found in Authorization header')
        return authHeader.slice(7)
    }

    // Additional fallback - check if token is in query params
    if (req.query?.token && typeof req.query.token === 'string') {
        console.log('[Auth Debug] Token found in query parameters')
        return req.query.token
    }

    console.log('[Auth Debug] No token found in request')
    return undefined
}

export default function authWithRBAC(
    allowedRoles: UserRole[] = [],
    checkSubscriptionForPremiumFeatures = false,
) {
    return (req: Request, res: Response, next: NextFunction) => {
        ;(async () => {
            console.log(
                `[Auth Debug] authWithRBAC called with roles: ${JSON.stringify(allowedRoles)}, checkSubscription: ${checkSubscriptionForPremiumFeatures}`,
            )
            console.log(
                `[Auth Debug] Request path: ${req.path}, method: ${req.method}`,
            )

            try {
                // 1) Get and validate token
                const token = getTokenFromRequest(req)
                if (!token) {
                    return res
                        .status(AuthErrors.TOKEN_MISSING.status)
                        .json({ error: AuthErrors.TOKEN_MISSING.message })
                }

                // 2) Verify JWT
                let payload: AuthTokenPayload
                try {
                    console.log('[Auth Debug] Verifying JWT token')
                    payload = jwt.verify(
                        token,
                        JWT_SECRET as string,
                    ) as AuthTokenPayload
                    console.log(
                        `[Auth Debug] JWT verified successfully, payload: id=${payload.userId}, type=${payload.entityType}`,
                    )
                } catch (err) {
                    console.error('[Auth Debug] JWT verification error:', err)
                    let errorMessage = AuthErrors.INVALID_TOKEN.message

                    if (err instanceof jwt.TokenExpiredError) {
                        errorMessage = 'Invalid or expired token'
                    } else if (err instanceof jwt.JsonWebTokenError) {
                        errorMessage = 'Invalid or expired token'
                    }

                    return res.status(AuthErrors.INVALID_TOKEN.status).json({
                        error: errorMessage,
                        details: (err as Error).message,
                    })
                }

                if (!payload?.userId || !payload.entityType) {
                    console.log(
                        '[Auth Debug] Payload missing required fields:',
                        payload,
                    )
                    return res.status(AuthErrors.INVALID_TOKEN.status).json({
                        error: AuthErrors.INVALID_TOKEN.message,
                        details: 'Token payload missing id or entityType',
                    })
                }

                // 3) Validate session
                try {
                    console.log('[Auth Debug] Validating session')
                    await validateSession(token)
                } catch (error) {
                    const msg = (error as Error).message
                    if (
                        msg === AuthErrors.SESSION_NOT_FOUND.message ||
                        msg === AuthErrors.SESSION_EXPIRED.message
                    ) {
                        return res
                            .status(AuthErrors.SESSION_NOT_FOUND.status)
                            .json({
                                error: msg,
                            })
                    }
                    throw error
                }

                // 4) Role check
                if (
                    allowedRoles.length &&
                    !allowedRoles.includes(payload.entityType)
                ) {
                    console.log(
                        `[Auth Debug] Role check failed: user role ${payload.entityType} not in allowed roles ${JSON.stringify(allowedRoles)}`,
                    )
                    return res
                        .status(AuthErrors.INSUFFICIENT_PERMISSIONS.status)
                        .json({
                            error: AuthErrors.INSUFFICIENT_PERMISSIONS.message,
                            details: `Your role (${payload.entityType}) doesn't have access to this resource`,
                        })
                }

                // 5) Subscription check for ADMIN users when accessing premium features
                if (
                    checkSubscriptionForPremiumFeatures &&
                    payload.entityType === 'ADMIN'
                ) {
                    try {
                        console.log(
                            '[Auth Debug] Checking subscription for admin user',
                        )
                        const admin = await Admin.findByPk(payload.userId)
                        if (!admin) {
                            console.log(
                                `[Auth Debug] Admin not found with ID: ${payload.userId}`,
                            )
                            return res
                                .status(AuthErrors.ADMIN_NOT_FOUND.status)
                                .json({
                                    error: AuthErrors.ADMIN_NOT_FOUND.message,
                                })
                        }

                        console.log(
                            `[Auth Debug] Admin found, subscription status: ${admin.isSubscriptionActive}`,
                        )
                        if (!admin.isSubscriptionActive) {
                            return res
                                .status(AuthErrors.SUBSCRIPTION_REQUIRED.status)
                                .json({
                                    error: AuthErrors.SUBSCRIPTION_REQUIRED
                                        .message,
                                })
                        }
                    } catch (error) {
                        console.error(
                            '[Auth Debug] Admin subscription check error:',
                            error,
                        )
                        throw error
                    }
                } else {
                    console.log('[Auth Debug] Skipping subscription check')
                }

                // 6) All good - attach user info to request and proceed
                console.log(
                    '[Auth Debug] Authentication successful, proceeding to route handler',
                )
                req.body.user = payload
                next()
            } catch (err) {
                console.error(
                    '[Auth Debug] Unhandled auth middleware error:',
                    err,
                )
                res.status(AuthErrors.INTERNAL_ERROR.status).json({
                    error: AuthErrors.INTERNAL_ERROR.message,
                    details: (err as Error).message,
                })
            }
        })()
    }
}
