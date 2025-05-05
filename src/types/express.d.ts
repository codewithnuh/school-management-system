// src/types/express.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express'

declare module 'express-serve-static-core' {
    interface Request {
        id?: string // Make it optional in case it's not always set
    }
}
