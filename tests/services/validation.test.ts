import { describe, expect, it } from 'vitest'
import {
    CreateSchoolSchema,
    CreateStudentSchema,
    CreateTeacherSchema,
} from '../../src/services/validation.service.js'

describe('request validation schemas', () => {
    it('accepts a valid school', () => {
        const result = CreateSchoolSchema.safeParse({
            name: 'Test School',
            code: 'TS001',
            address: '123 Test St',
            phone: '+1234567890',
            email: 'test@school.com',
        })

        expect(result.success).toBe(true)
    })

    it('rejects a school without a code', () => {
        expect(
            CreateSchoolSchema.safeParse({ name: 'Test School' }).success,
        ).toBe(false)
    })

    it('rejects an invalid school email', () => {
        expect(
            CreateSchoolSchema.safeParse({
                name: 'Test School',
                code: 'TS001',
                email: 'invalid-email',
            }).success,
        ).toBe(false)
    })

    it('accepts a teacher with a nonnegative experience value', () => {
        expect(
            CreateTeacherSchema.safeParse({
                userId: 1,
                qualification: 'M.Ed',
                experience: 5,
                specialization: 'Mathematics',
            }).success,
        ).toBe(true)
    })

    it('rejects negative teacher experience', () => {
        expect(
            CreateTeacherSchema.safeParse({
                userId: 1,
                experience: -1,
            }).success,
        ).toBe(false)
    })

    it('accepts a student with the required admission details', () => {
        expect(
            CreateStudentSchema.safeParse({
                userId: 1,
                classId: 2,
                sectionId: 3,
                admissionNumber: 'ADM2024001',
                admissionDate: '2024-01-10',
                dateOfBirth: '2010-05-15',
                gender: 'male',
                bloodGroup: 'A+',
            }).success,
        ).toBe(true)
    })

    it('rejects an unsupported student gender', () => {
        expect(
            CreateStudentSchema.safeParse({
                userId: 1,
                classId: 2,
                sectionId: 3,
                admissionNumber: 'ADM2024001',
                admissionDate: '2024-01-10',
                dateOfBirth: '2010-05-15',
                gender: 'invalid',
            }).success,
        ).toBe(false)
    })

    it('rejects a future date of birth', () => {
        const futureDate = new Date()
        futureDate.setUTCFullYear(futureDate.getUTCFullYear() + 1)

        expect(
            CreateStudentSchema.safeParse({
                userId: 1,
                classId: 2,
                sectionId: 3,
                admissionNumber: 'ADM2024001',
                admissionDate: '2024-01-10',
                dateOfBirth: futureDate.toISOString().slice(0, 10),
                gender: 'male',
            }).success,
        ).toBe(false)
    })
})
