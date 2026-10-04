import { beforeEach, describe, expect, it, vi } from 'vitest'

const models = vi.hoisted(() => ({
    classFindByPk: vi.fn(),
    classSubjectFindOne: vi.fn(),
    roomFindByPk: vi.fn(),
    sectionFindByPk: vi.fn(),
    sectionTeacherFindOne: vi.fn(),
    subjectFindByPk: vi.fn(),
    teacherFindByPk: vi.fn(),
    timeSlotFindByPk: vi.fn(),
    timetableEntryFindOne: vi.fn(),
}))

vi.mock('@/models/Class.js', () => ({ Class: { findByPk: models.classFindByPk } }))
vi.mock('@/models/ClassSubject.js', () => ({ ClassSubject: { findOne: models.classSubjectFindOne } }))
vi.mock('@/models/Room.js', () => ({ Room: { findByPk: models.roomFindByPk } }))
vi.mock('@/models/Section.js', () => ({ Section: { findByPk: models.sectionFindByPk } }))
vi.mock('@/models/SectionTeacher.js', () => ({ SectionTeacher: { findOne: models.sectionTeacherFindOne } }))
vi.mock('@/models/Subject.js', () => ({ Subject: { findByPk: models.subjectFindByPk } }))
vi.mock('@/models/Teacher.js', () => ({ Teacher: { findByPk: models.teacherFindByPk } }))
vi.mock('@/models/TimeSlot.js', () => ({ TimeSlot: { findByPk: models.timeSlotFindByPk } }))
vi.mock('@/models/TimetableEntry.js', () => ({ TimetableEntry: { findOne: models.timetableEntryFindOne } }))

import {
    checkClassAvailability,
    checkRoomAvailability,
    checkTeacherAvailability,
    validateScheduleEntry,
} from '@/services/timetable-validator.service.js'

describe('timetable validation', () => {
    beforeEach(() => {
        vi.resetAllMocks()
        models.classFindByPk.mockResolvedValue({ schoolId: 1 })
        models.classSubjectFindOne.mockResolvedValue({ id: 1 })
        models.roomFindByPk.mockResolvedValue({ schoolId: 1 })
        models.sectionFindByPk.mockResolvedValue({ classId: 1 })
        models.sectionTeacherFindOne.mockResolvedValue({ id: 1 })
        models.subjectFindByPk.mockResolvedValue({ schoolId: 1 })
        models.teacherFindByPk.mockResolvedValue({ schoolId: 1 })
        models.timeSlotFindByPk.mockResolvedValue({
            id: 1,
            schoolId: 1,
            periodNumber: 1,
            isActive: true,
            isBreak: false,
        })
        models.timetableEntryFindOne.mockResolvedValue(null)
    })

    it('allows an available teacher, room, and class period', async () => {
        const results = await Promise.all([
            checkTeacherAvailability(1, 'monday', 1),
            checkRoomAvailability(1, 'monday', 1),
            checkClassAvailability(1, 1, 'monday', 1),
        ])
        expect(results.every(result => !result.hasConflict)).toBe(true)
    })

    it('reports a teacher conflict when the period is occupied', async () => {
        models.timetableEntryFindOne.mockResolvedValue({ id: 12 })
        const result = await checkTeacherAvailability(1, 'monday', 1)
        expect(result).toMatchObject({
            hasConflict: true,
            conflictType: 'teacher',
            conflictingEntity: { id: 12 },
        })
    })

    it('rejects an inactive slot and a slot belonging to another school', async () => {
        models.timeSlotFindByPk.mockResolvedValueOnce({
            id: 1,
            schoolId: 1,
            isActive: false,
            isBreak: false,
        })
        const inactive = await checkTeacherAvailability(1, 'monday', 1)
        expect(inactive.hasConflict).toBe(true)

        models.timeSlotFindByPk.mockResolvedValueOnce({
            id: 1,
            schoolId: 2,
            isActive: true,
            isBreak: false,
        })
        const foreign = await checkTeacherAvailability(1, 'monday', 1)
        expect(foreign.hasConflict).toBe(true)
    })

    it('validates school, section, subject, teacher assignment, and slot references', async () => {
        const result = await validateScheduleEntry({
            classId: 1,
            sectionId: 1,
            subjectId: 1,
            teacherId: 1,
            roomId: 1,
            dayOfWeek: 'monday',
            timeSlotId: 1,
        })
        expect(result).toEqual({ valid: true, errors: [], conflicts: [] })

        models.sectionTeacherFindOne.mockResolvedValueOnce(null)
        const missingAssignment = await validateScheduleEntry({
            classId: 1,
            sectionId: 1,
            subjectId: 1,
            teacherId: 1,
            dayOfWeek: 'monday',
            timeSlotId: 1,
        })
        expect(missingAssignment.valid).toBe(false)
        expect(missingAssignment.errors).toHaveLength(1)
    })
})
