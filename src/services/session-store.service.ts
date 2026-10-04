import { Op } from 'sequelize'
import { Session } from '@/models/index.js'
import { env } from '@/config/env.js'
import type { SessionEntityType } from '@/models/Session.js'
import { hashSessionToken } from '@/security/session-token.js'

const SESSION_TTL_SECONDS = env.SESSION_EXPIRY_HOURS * 3600

interface SessionRecord {
    token: string
    userId: number
    entityType: SessionEntityType
    expiryDate: Date
    userAgent?: string
    ipAddress?: string
    isSuperAdmin?: boolean
}

class SessionStoreService {
    async create(record: SessionRecord): Promise<void> {
        const { token, ...attributes } = record
        await Session.create({ ...attributes, tokenHash: hashSessionToken(token) })
    }

    async findByToken(token: string) {
        return Session.findOne({ where: { tokenHash: hashSessionToken(token) } })
    }

    async deleteByToken(token: string): Promise<void> {
        await Session.destroy({ where: { tokenHash: hashSessionToken(token) } })
    }

    async deleteByCriteria(params: {
        token?: string
        userId?: number
        entityType?: SessionEntityType
        userAgent?: string
    }): Promise<void> {
        const { token, ...filters } = params
        const where = {
            ...filters,
            ...(token ? { tokenHash: hashSessionToken(token) } : {}),
        }
        if (Object.keys(where).length === 0) {
            throw new Error('At least one session filter is required')
        }
        await Session.destroy({ where })
    }

    async clearExpiredSessions(): Promise<void> {
        await Session.destroy({ where: { expiryDate: { [Op.lte]: new Date() } } })
    }

    getSessionTtlSeconds(): number {
        return SESSION_TTL_SECONDS
    }

}

export const sessionStore = new SessionStoreService()
