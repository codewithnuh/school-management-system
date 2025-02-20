import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Session } from '@/models/index.js'
import process from 'process'

// Ensure that JWT_SECRET is extracted from process.env
const { JWT_SECRET } = process.env
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.')
}

// Authentication error definitions
const AuthErrors = {
    TOKEN_MISSING: { status: 401, message: 'Authentication token missing' },
    INVALID_PAYLOAD: { status: 401, message: 'Invalid token payload' },
    INVALID_TOKEN: { status: 401, message: 'Invalid or expired token' },
    SESSION_NOT_FOUND: {
        status: 401,
        message: 'Session not found. Token may have been revoked.',
    },
    SESSION_EXPIRED: { status: 401, message: 'Session expired' },
    INTERNAL_ERROR: { status: 500, message: 'Internal server error' },
} as const

// Function to validate the session using token
const validateSession = async (token: string): Promise<boolean> => {
    const session = await Session.findOne({ where: { token } })
    if (!session) {
        throw new Error(AuthErrors.SESSION_NOT_FOUND.message)
    }
    if (new Date() > session.expiryDate) {
        throw new Error(AuthErrors.SESSION_EXPIRED.message)
    }
    return true
}

// Express middleware that checks for the token in cookies, verifies the JWT, validates the session,
// and attaches the token payload to the request body for downstream usage.
//
// NOTE: Make sure to use cookie-parser in your application (e.g., app.use(cookieParser()))
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        // Read token from cookies instead of authorization header
        const token = req.cookies?.token
        if (!token) {
            res.status(AuthErrors.TOKEN_MISSING.status).json({
                error: AuthErrors.TOKEN_MISSING.message,
            })
            return
        }
        let payload
        try {
            payload = jwt.verify(token, JWT_SECRET)
        } catch (err) {
            console.error(err)
            res.status(AuthErrors.INVALID_TOKEN.status).json({
                error: AuthErrors.INVALID_TOKEN.message,
            })
            return
        }

        // Validate session data based on the token
        await validateSession(token)

        // Attach token payload to request body for further usage
        req.body.user = payload

        next()
    } catch (error) {
        console.error('Authentication error:', error)
        res.status(AuthErrors.INTERNAL_ERROR.status).json({
            error: AuthErrors.INTERNAL_ERROR.message,
        })
    }
}

export default authenticate
