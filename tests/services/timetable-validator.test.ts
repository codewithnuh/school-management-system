import { describe, expect, it } from 'vitest'
import { ScheduleEntrySchema } from '@/services/timetable-validator.service.js'

describe('schedule entry contract', () => {
    const validEntry = {
        classId: 1,
        sectionId: 2,
        subjectId: 3,
        teacherId: 4,
        roomId: 5,
        dayOfWeek: 'monday',
        timeSlotId: 6,
    }

    it('accepts a complete schedule entry', () => {
        expect(ScheduleEntrySchema.safeParse(validEntry).success).toBe(true)
    })

    it('rejects invalid identifiers and weekday values', () => {
        expect(
            ScheduleEntrySchema.safeParse({ ...validEntry, classId: 0 }).success,
        ).toBe(false)
        expect(
            ScheduleEntrySchema.safeParse({ ...validEntry, dayOfWeek: 'Monday' }).success,
        ).toBe(false)
    })

    it('allows an omitted room assignment', () => {
        const { roomId: _roomId, ...entry } = validEntry
        expect(ScheduleEntrySchema.safeParse(entry).success).toBe(true)
    })
})
