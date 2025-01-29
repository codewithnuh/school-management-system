import { Session } from '@/models/Session';
export const authenticate = async (req, res, next) => {
    try {
        const sessionId = req.cookies.sessionId;
        if (!sessionId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }
        const session = await Session.findOne({
            where: { sessionId },
        });
        if (!session || new Date() > session.expiresAt) {
            if (session) {
                await session.destroy();
            }
            res.clearCookie('sessionId');
            res.status(401).json({
                success: false,
                message: 'Session expired',
            });
            return;
        }
        req.userId = session.userId;
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Authentication error',
        });
    }
};
