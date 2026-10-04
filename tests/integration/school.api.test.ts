import { describe, expect, it } from 'vitest'
import request from 'supertest'
import express from 'express'
import authWithRBAC from '@/middleware/auth.middleware.js'

const app = express()
app.post('/api/v1/schools', authWithRBAC(['ADMIN']), (_request, response) => response.sendStatus(201))
app.get('/api/v1/schools/:id', authWithRBAC(['ADMIN']), (_request, response) => response.sendStatus(200))

describe('school API authorization boundary', () => {
    it('requires authentication to create a school', async () => {
        const response = await request(app)
            .post('/api/v1/schools')
            .send({ name: 'Unauthorized School' })

        expect(response.status).toBe(401)
    })

    it('requires authentication to read school records', async () => {
        const response = await request(app).get('/api/v1/schools/1')

        expect(response.status).toBe(401)
    })
})
