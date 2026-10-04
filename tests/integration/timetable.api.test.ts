import { describe, expect, it } from 'vitest'
import request from 'supertest'
import express from 'express'
import authWithRBAC from '@/middleware/auth.middleware.js'

const app = express()
app.post('/api/v1/timetables/generate/:classId', authWithRBAC(['ADMIN']), (_request, response) => response.sendStatus(200))
app.get('/api/v1/timetables/weekly/:classId/:sectionId', authWithRBAC(['ADMIN', 'USER']), (_request, response) => response.sendStatus(200))
app.get('/api/v1/timetables/teacher/:teacherId', authWithRBAC(['ADMIN', 'TEACHER']), (_request, response) => response.sendStatus(200))

describe('timetable API authorization boundary', () => {
    it('requires authentication before generating a timetable', async () => {
        const response = await request(app)
            .post('/api/v1/timetables/generate/1')
            .send({})

        expect(response.status).toBe(401)
    })

    it('requires authentication before reading a class timetable', async () => {
        const response = await request(app).get('/api/v1/timetables/weekly/1/1')

        expect(response.status).toBe(401)
    })

    it('requires authentication before reading a teacher timetable', async () => {
        const response = await request(app).get('/api/v1/timetables/teacher/1')

        expect(response.status).toBe(401)
    })
})
