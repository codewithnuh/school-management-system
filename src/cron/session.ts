import { logger } from '@/middleware/loggin.middleware'
import { PasswordResetToken } from '@/models/PasswordResetToken'
import { Session } from '@/models/Session'
import cron from 'node-cron'
import { Op } from 'sequelize'
// Run every day at midnight
export const deleteExpiredSessions = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            await Session.destroy({
                where: {
                    expiresAt: { [Op.lt]: new Date() }, // Delete sessions expired before now
                },
            })
            logger.info({ message: 'Expired Sessions deleted' })
        } catch (error) {
            if (error instanceof Error) {
                logger.info({ message: error.message })
            }
        }
    })
}
export const deleteExpiredPasswordResetTokens = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            const deletedCount = await PasswordResetToken.cleanupExpiredTokens()
            console.log(`Cleaned up ${deletedCount} expired tokens`)
        } catch (error) {
            console.error('Error cleaning up expired tokens:', error)
        }
    })
}
