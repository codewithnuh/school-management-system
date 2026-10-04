declare global {
    namespace Express {
        interface Request {
            id?: string
            auth?: {
                userId: number
                entityType: 'ADMIN' | 'TEACHER' | 'USER' | 'STUDENT' | 'PARENT' | 'OWNER'
            }
            pagination?: {
                page: number
                limit: number
                offset: number
            }
        }
    }
}

export {}
