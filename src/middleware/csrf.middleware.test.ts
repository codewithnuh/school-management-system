import { describe, expect, it, vi } from 'vitest'
import type { NextFunction, Request, Response } from 'express'
import {
    isTrustedBrowserOrigin,
    protectCookieAuthenticatedRequests,
} from './csrf.middleware.js'

describe('isTrustedBrowserOrigin', () => {
    it('accepts configured origins exactly', () => {
        expect(isTrustedBrowserOrigin('http://localhost:5173')).toBe(true)
    })

    it('rejects an origin with a path or different port', () => {
        expect(isTrustedBrowserOrigin('http://localhost:5173/')).toBe(false)
        expect(isTrustedBrowserOrigin('http://localhost:5174')).toBe(false)
    })

    it('rejects absent and opaque origins', () => {
        expect(isTrustedBrowserOrigin(undefined)).toBe(false)
        expect(isTrustedBrowserOrigin('null')).toBe(false)
    })

    it('blocks unsafe cookie-authenticated requests with an untrusted origin', () => {
        const request = {
            method: 'POST',
            cookies: { token: 'session-token' },
            get: () => 'https://attacker.example',
        } as unknown as Request
        const status = vi.fn().mockReturnThis()
        const json = vi.fn()
        const response = { status, json } as unknown as Response
        const next = vi.fn() as unknown as NextFunction

        protectCookieAuthenticatedRequests(request, response, next)

        expect(status).toHaveBeenCalledWith(403)
        expect(json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Request origin is not allowed' }),
        )
        expect(next).not.toHaveBeenCalled()
    })

    it('allows unsafe cookie-authenticated requests from a trusted origin', () => {
        const request = {
            method: 'POST',
            cookies: { token: 'session-token' },
            get: () => 'http://localhost:5173',
        } as unknown as Request
        const response = {} as Response
        const next = vi.fn() as unknown as NextFunction

        protectCookieAuthenticatedRequests(request, response, next)

        expect(next).toHaveBeenCalledOnce()
    })
})
