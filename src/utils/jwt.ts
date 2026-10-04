import { SignJWT, jwtVerify } from 'jose'
import { env } from '@/config/env.js'

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)

import { JWTPayload } from 'jose'

export const createJWT = async (
    payload: JWTPayload,
    expiresIn: string = '1h',
) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(JWT_SECRET)
}

export const verifyJWT = async (token: string) => {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
}
