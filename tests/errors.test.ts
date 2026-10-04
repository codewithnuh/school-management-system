import { describe, expect, it } from 'vitest'
import {
    AppError,
    TimetableConflictError,
    ValidationError,
} from '../src/errors/index.js'

describe('application errors', () => {
    it('uses the supplied status code and defaults to 500', () => {
        expect(new AppError('Invalid input', 400).statusCode).toBe(400)
        expect(new AppError('Unexpected failure').statusCode).toBe(500)
    })

    it('marks application errors as operational', () => {
        expect(new AppError('Not found').isOperational).toBe(true)
    })

    it('retains timetable conflict details', () => {
        const conflicts = [
            {
                type: 'teacher' as const,
                entityId: 7,
                timeSlotId: 3,
                day: 'monday',
            },
        ]
        const error = new TimetableConflictError(
            'Timetable conflict detected',
            conflicts,
        )

        expect(error.statusCode).toBe(409)
        expect(error.conflicts).toEqual(conflicts)
    })

    it('carries validation field details', () => {
        const error = new ValidationError('Invalid request', [
            { field: 'name', message: 'Required' },
        ])

        expect(error.statusCode).toBe(400)
        expect(error.details).toEqual([
            { field: 'name', message: 'Required' },
        ])
    })
})
