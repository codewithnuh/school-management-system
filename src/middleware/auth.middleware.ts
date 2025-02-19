import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Session } from '@/models/index.js'
import process from 'process'

// Fix: Declare and extract JWT_SECRET from process.env
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

// Express middleware that checks the Authorization header, verifies the JWT, validates the session,
// and attaches the token payload to the request body for downstream usage.
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res
                .status(AuthErrors.TOKEN_MISSING.status)
                .json({ error: AuthErrors.TOKEN_MISSING.message })
        }

        // Expected format: "Bearer token"
        const token = authHeader.split(' ')[1]
        if (!token) {
            return res
                .status(AuthErrors.TOKEN_MISSING.status)
                .json({ error: AuthErrors.TOKEN_MISSING.message })
        }

        // Verify the token using JWT_SECRET
        let payload
        try {
            payload = jwt.verify(token, JWT_SECRET)
        } catch (err) {
            console.error(err)
            return res
                .status(AuthErrors.INVALID_TOKEN.status)
                .json({ error: AuthErrors.INVALID_TOKEN.message })
        }

        // Validate associated session data from the database
        await validateSession(token)

        // Attach token payload to request body for further use
        req.body.user = payload
        next()
    } catch (error) {
        console.error('Authentication error:', error)
        return res
            .status(AuthErrors.INTERNAL_ERROR.status)
            .json({ error: AuthErrors.INTERNAL_ERROR.message })
    }
}

export default authenticate
