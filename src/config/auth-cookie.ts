import type { CookieOptions, Response } from 'express'
import { env } from '@/config/env.js'

export const AUTH_COOKIE_NAME = 'token'

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: env.SESSION_EXPIRY_HOURS * 60 * 60 * 1000,
    path: '/',
}

export function clearAuthCookie(response: Response): void {
    response.clearCookie(AUTH_COOKIE_NAME, {
        path: AUTH_COOKIE_OPTIONS.path,
        secure: AUTH_COOKIE_OPTIONS.secure,
        sameSite: AUTH_COOKIE_OPTIONS.sameSite,
    })
}
