import { describe, expect, it } from 'vitest'
import { hashSessionToken } from './session-token.js'

describe('hashSessionToken', () => {
    it('stores a fixed length digest instead of the bearer token', () => {
        const token = 'a-sensitive-bearer-token'
        const digest = hashSessionToken(token)

        expect(digest).toMatch(/^[a-f0-9]{64}$/)
        expect(digest).not.toBe(token)
    })

    it('produces the same digest for session lookup and revocation', () => {
        expect(hashSessionToken('token-123')).toBe(hashSessionToken('token-123'))
        expect(hashSessionToken('token-123')).not.toBe(hashSessionToken('token-124'))
    })
})
