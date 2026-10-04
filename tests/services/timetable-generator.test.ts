import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    classFindByPk: vi.fn(),
    sectionFindAll: vi.fn(),
    sectionFindByPk: vi.fn(),
    classSubjectFindAll: vi.fn(),
    timeSlotFindAll: vi.fn(),
    sectionTeacherFindOne: vi.fn(),
    timetableFindOrCreate: vi.fn(),
    timeSlotFindByPk: vi.fn(),
    entryCreate: vi.fn(),
    transaction: vi.fn(),
    commit: vi.fn(),
    rollback: vi.fn(),
    validateScheduleEntry: vi.fn(),
}))

vi.mock('@/models/Class.js', () => ({ Class: { findByPk: mocks.classFindByPk } }))
vi.mock('@/models/Section.js', () => ({ Section: { findAll: mocks.sectionFindAll, findByPk: mocks.sectionFindByPk } }))
vi.mock('@/models/ClassSubject.js', () => ({ ClassSubject: { findAll: mocks.classSubjectFindAll } }))
vi.mock('@/models/TimeSlot.js', () => ({ TimeSlot: { findAll: mocks.timeSlotFindAll, findByPk: mocks.timeSlotFindByPk } }))
vi.mock('@/models/SectionTeacher.js', () => ({ SectionTeacher: { findOne: mocks.sectionTeacherFindOne } }))
vi.mock('@/models/Timetable.js', () => ({ Timetable: { findOrCreate: mocks.timetableFindOrCreate } }))
vi.mock('@/models/TimetableEntry.js', () => ({ TimetableEntry: { create: mocks.entryCreate } }))
vi.mock('@/infrastructure/persistence/sequelize/client.js', () => ({
    default: { transaction: mocks.transaction },
}))
vi.mock('@/services/timetable-validator.service.js', () => ({
    validateScheduleEntry: mocks.validateScheduleEntry,
}))

import { generateTimetableForClass } from '@/services/timetable-generator.service.js'
import { generateTimeSlots } from '@/utils/timeTableUtils.js'

describe('timetable generation', () => {
    beforeEach(() => {
        vi.resetAllMocks()
        mocks.commit.mockResolvedValue(undefined)
        mocks.rollback.mockResolvedValue(undefined)
        mocks.transaction.mockResolvedValue({ commit: mocks.commit, rollback: mocks.rollback })
        mocks.classFindByPk.mockResolvedValue({
            id: 1,
            name: 'Grade 1',
            schoolId: 10,
            academicYearId: 2,
        })
        mocks.sectionFindAll.mockResolvedValue([{ id: 11, name: 'A' }])
        mocks.sectionFindByPk.mockResolvedValue({ id: 11, name: 'A', classId: 1 })
        mocks.classSubjectFindAll.mockResolvedValue([
            { subjectId: 5, periodsPerWeek: 1 },
        ])
        mocks.timeSlotFindAll.mockResolvedValue([
            { id: 20, periodNumber: 1 },
            { id: 21, periodNumber: 2 },
        ])
        mocks.sectionTeacherFindOne.mockResolvedValue({ teacherId: 8 })
        mocks.timetableFindOrCreate.mockResolvedValue([
            { id: 30, classId: 1, sectionId: 11, academicYearId: 2 },
            false,
        ])
        mocks.timeSlotFindByPk.mockResolvedValue({
            id: 20,
            schoolId: 10,
            periodNumber: 1,
            isActive: true,
            isBreak: false,
        })
        mocks.entryCreate.mockResolvedValue({
            id: 40,
            timetableId: 30,
            subjectId: 5,
            teacherId: 8,
        })
        mocks.validateScheduleEntry.mockResolvedValue({
            valid: true,
            errors: [],
            conflicts: [],
        })
    })

    it('creates scheduled entries for configured subjects and sections', async () => {
        const result = await generateTimetableForClass({
            classId: 1,
            academicYearId: 2,
            workingDays: ['monday', 'tuesday'],
        })

        expect(result.success).toBe(true)
        expect(result.scheduledCount).toBe(1)
        expect(result.timetable).toHaveLength(1)
        expect(mocks.entryCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                timetableId: 30,
                subjectId: 5,
                teacherId: 8,
                dayOfWeek: 'MONDAY',
                periodNumber: 1,
            }),
            expect.objectContaining({ transaction: expect.anything() }),
        )
        expect(mocks.commit).toHaveBeenCalledOnce()
    })

    it('rolls back when the class is not in the requested academic year', async () => {
        await expect(
            generateTimetableForClass({
                classId: 1,
                academicYearId: 3,
                workingDays: ['monday'],
            }),
        ).rejects.toThrow('Class does not belong to the requested academic year')
        expect(mocks.rollback).toHaveBeenCalledOnce()
        expect(mocks.commit).not.toHaveBeenCalled()
    })

    it('generates periods within the requested time range and inserts breaks', () => {
        expect(
            generateTimeSlots({
                startTime: '08:00',
                endTime: '10:00',
                periodLength: 45,
                breakLength: 15,
            }),
        ).toEqual([
            { name: 'Period 1', startTime: '08:00', endTime: '08:45', periodNumber: 1, isBreak: false },
            { name: 'Break', startTime: '08:45', endTime: '09:00', periodNumber: 2, isBreak: true },
            { name: 'Period 3', startTime: '09:00', endTime: '09:45', periodNumber: 3, isBreak: false },
        ])
    })
})
