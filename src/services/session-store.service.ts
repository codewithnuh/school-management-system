import { Op } from 'sequelize'
import { Session } from '@/models/index.js'
import process from 'process'

const SESSION_TTL_SECONDS = parseInt(process.env.SESSION_EXPIRY_HOURS || '168', 10) * 3600

interface SessionRecord {
    token: string
    userId: number
    entityType: string
    expiryDate: Date
    userAgent?: string
    ipAddress?: string
    isSuperAdmin?: boolean
}

class SessionStoreService {
    private redisEnabled = process.env.REDIS_AUTH_ENABLED === 'true'
    private redisUrl = process.env.REDIS_URL

    private redisNotConfigured(): boolean {
        return this.redisEnabled && !this.redisUrl
    }

    async create(record: SessionRecord): Promise<void> {
        await Session.create(record)
    }

    async findByToken(token: string) {
        return Session.findOne({ where: { token } })
    }

    async findActiveSession(userId: number, entityType: string, userAgent?: string) {
        return Session.findOne({
            where: {
                userId,
                entityType,
                userAgent,
                expiryDate: { [Op.gt]: new Date() },
            },
        })
    }

    async deleteByToken(token: string): Promise<void> {
        await Session.destroy({ where: { token } })
    }

    async deleteByCriteria(params: {
        token?: string
        userId?: number
        entityType?: string
        userAgent?: string
    }): Promise<void> {
        await Session.destroy({ where: params })
    }

    async clearExpiredSessions(): Promise<void> {
        await Session.destroy({ where: { expiryDate: { [Op.lte]: new Date() } } })
    }

    getSessionTtlSeconds(): number {
        return SESSION_TTL_SECONDS
    }

    isRedisConfigured(): boolean {
        return this.redisEnabled && Boolean(this.redisUrl) && !this.redisNotConfigured()
    }
}

export const sessionStore = new SessionStoreService()
