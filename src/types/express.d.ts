declare global {
    namespace Express {
        interface Request {
            id?: string
            user?: {
                userid: string
                email: string
                role: string
                schoolId?: number
            }
        }
    }
}

export {}
