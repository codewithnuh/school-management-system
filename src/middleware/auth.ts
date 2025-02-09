// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { Session } from '@/models/Session.js'

export interface AuthenticatedRequest extends Request {
    userId?: number
}

export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const sessionId = req.cookies.sessionId

        if (!sessionId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            })
            return
        }

        const session = await Session.findOne({
            where: { sessionId },
        })

        if (!session || new Date() > session.expiresAt) {
            if (session) {
                await session.destroy()
            }
            res.clearCookie('sessionId')
            res.status(401).json({
                success: false,
                message: 'Session expired',
            })
            return
        }

        req.userId = session.userId
        next()
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }
}
