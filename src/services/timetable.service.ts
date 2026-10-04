import {
    AcademicYear,
    Timetable,
    TimeSlot,
    Class,
    Section,
    Subject,
    Teacher,
    Room,
} from '../models'
import {
    validateScheduleEntry,
    checkTeacherAvailability,
    checkRoomAvailability,
    checkClassAvailability,
    type ConflictCheck,
    getAvailableSlotsForTeacher,
    getAvailableSlotsForClass,
    getAvailableSlotsForRoom,
} from './timetable-validator.service'
import {
    scheduleSession,
    updateSession,
    deleteSession,
    getClassSessions,
    getTeacherSessions,
    getRoomSessions,
} from './timetable-scheduler.service'
import {
    generateTimetableForClass,
    generateTimetablesForSchool,
    clearTimetableForClass,
    validateTimetableCompleteness,
} from './timetable-generator.service'
import { NotFoundError, ValidationError } from '../errors'
import type {
    DayOfWeek,
    CreateTimetableInput,
    UpdateTimetableInput,
} from './validation.service.js'

type AvailabilityResult = {
    day: string
    timeSlotId?: number
    conflicts: Array<{ type: 'teacher' | 'room' | 'class' } & ConflictCheck>
    available: boolean
    teacher?: {
        id: number
        available: boolean
        conflict: ConflictCheck['conflictingEntity']
    }
    room?: {
        id: number
        available: boolean
        conflict: ConflictCheck['conflictingEntity']
    }
    class?: {
        id: number
        sectionId: number
        available: boolean
        conflict: ConflictCheck['conflictingEntity']
    }
}

/**
 * Main Timetable Service - Orchestrates all timetable operations
 */
export class TimetableService {
    /**
     * Create a new timetable entry
     */
    static async createEntry(data: CreateTimetableInput) {
        const result = await scheduleSession(data)

        if (!result.success || !result.timetable) {
            throw new ValidationError(
                result.error || 'Failed to create timetable entry',
            )
        }

        return result.timetable
    }

    /**
     * Update a timetable entry
     */
    static async updateEntry(id: number, data: UpdateTimetableInput) {
        const result = await updateSession(id, data)

        if (!result.success || !result.timetable) {
            throw new ValidationError(
                result.error || 'Failed to update timetable entry',
            )
        }

        return result.timetable
    }

    /**
     * Delete a timetable entry
     */
    static async deleteEntry(id: number) {
        const result = await deleteSession(id)

        if (!result.success) {
            throw new NotFoundError('Timetable entry')
        }

        return result
    }

    /**
     * Get timetable for a class and section
     */
    static async getClassTimetable(
        classId: number,
        sectionId: number,
        academicYearId?: number,
    ) {
        if (!academicYearId) {
            // Get current academic year
            const currentYear = await AcademicYear.findOne({
                where: { isCurrent: true },
            })

            if (!currentYear) {
                throw new NotFoundError('Current academic year')
            }

            academicYearId = currentYear.id
        }

        return await getClassSessions(classId, sectionId, academicYearId)
    }

    /**
     * Get timetable for a teacher
     */
    static async getTeacherTimetable(
        teacherId: number,
        academicYearId?: number,
    ) {
        if (!academicYearId) {
            const currentYear = await AcademicYear.findOne({
                where: { isCurrent: true },
            })

            if (!currentYear) {
                throw new NotFoundError('Current academic year')
            }

            academicYearId = currentYear.id
        }

        return await getTeacherSessions(teacherId, academicYearId)
    }

    /**
     * Get timetable for a room
     */
    static async getRoomTimetable(roomId: number, academicYearId?: number) {
        if (!academicYearId) {
            const currentYear = await AcademicYear.findOne({
                where: { isCurrent: true },
            })

            if (!currentYear) {
                throw new NotFoundError('Current academic year')
            }

            academicYearId = currentYear.id
        }

        return await getRoomSessions(roomId, academicYearId)
    }

    /**
     * Generate timetable for a class
     */
    static async generateTimetable(config: {
        classId: number
        academicYearId: number
        workingDays: DayOfWeek[]
    }) {
        return await generateTimetableForClass(config)
    }

    /**
     * Generate timetables for all classes in a school
     */
    static async generateSchoolTimetable(config: {
        schoolId: number
        academicYearId: number
        workingDays: DayOfWeek[]
    }) {
        return await generateTimetablesForSchool(
            config.schoolId,
            config.academicYearId,
            config.workingDays,
        )
    }

    /**
     * Clear timetable for a class
     */
    static async clearTimetable(classId: number, academicYearId?: number) {
        return await clearTimetableForClass(classId, academicYearId)
    }

    /**
     * Validate timetable completeness
     */
    static async validateCompleteness(
        classId: number,
        academicYearId?: number,
        workingDays: DayOfWeek[] = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
        ],
    ) {
        if (!academicYearId) {
            const currentYear = await AcademicYear.findOne({
                where: { isCurrent: true },
            })

            if (!currentYear) {
                throw new NotFoundError('Current academic year')
            }

            academicYearId = currentYear.id
        }

        return await validateTimetableCompleteness(
            classId,
            academicYearId,
            workingDays,
        )
    }

    /**
     * Check availability for scheduling
     */
    static async checkAvailability(params: {
        classId?: number
        sectionId?: number
        subjectId?: number
        teacherId?: number
        roomId?: number
        dayOfWeek: string
        timeSlotId?: number
    }) {
        const { classId, sectionId, teacherId, roomId, dayOfWeek, timeSlotId } =
            params

        const results: AvailabilityResult = {
            day: dayOfWeek,
            timeSlotId,
            conflicts: [],
            available: true,
        }

        if (teacherId && timeSlotId) {
            const teacherCheck = await checkTeacherAvailability(
                teacherId,
                dayOfWeek,
                timeSlotId,
            )

            results.teacher = {
                id: teacherId,
                available: !teacherCheck.hasConflict,
                conflict: teacherCheck.conflictingEntity,
            }

            if (teacherCheck.hasConflict) {
                results.available = false
                results.conflicts.push({ type: 'teacher', ...teacherCheck })
            }
        }

        if (roomId && timeSlotId) {
            const roomCheck = await checkRoomAvailability(
                roomId,
                dayOfWeek,
                timeSlotId,
            )

            results.room = {
                id: roomId,
                available: !roomCheck.hasConflict,
                conflict: roomCheck.conflictingEntity,
            }

            if (roomCheck.hasConflict) {
                results.available = false
                results.conflicts.push({ type: 'room', ...roomCheck })
            }
        }

        if (classId && sectionId && timeSlotId) {
            const classCheck = await checkClassAvailability(
                classId,
                sectionId,
                dayOfWeek,
                timeSlotId,
            )

            results.class = {
                id: classId,
                sectionId,
                available: !classCheck.hasConflict,
                conflict: classCheck.conflictingEntity,
            }

            if (classCheck.hasConflict) {
                results.available = false
                results.conflicts.push({ type: 'class', ...classCheck })
            }
        }

        return results
    }

    /**
     * Get available slots for a teacher
     */
    static async getAvailableSlotsForTeacher(
        teacherId: number,
        dayOfWeek: string,
        academicYearId?: number,
    ) {
        if (!academicYearId) {
            const currentYear = await AcademicYear.findOne({
                where: { isCurrent: true },
            })

            if (!currentYear) {
                throw new NotFoundError('Current academic year')
            }

            academicYearId = currentYear.id
        }

        return await getAvailableSlotsForTeacher(
            teacherId,
            dayOfWeek,
            academicYearId,
        )
    }

    /**
     * Get available slots for a class
     */
    static async getAvailableSlotsForClass(
        classId: number,
        sectionId: number,
        dayOfWeek: string,
        academicYearId?: number,
    ) {
        if (!academicYearId) {
            const currentYear = await AcademicYear.findOne({
                where: { isCurrent: true },
            })

            if (!currentYear) {
                throw new NotFoundError('Current academic year')
            }

            academicYearId = currentYear.id
        }

        return await getAvailableSlotsForClass(
            classId,
            sectionId,
            dayOfWeek,
            academicYearId,
        )
    }

    /**
     * Get available slots for a room
     */
    static async getAvailableSlotsForRoom(
        roomId: number,
        dayOfWeek: string,
        academicYearId?: number,
    ) {
        if (!academicYearId) {
            const currentYear = await AcademicYear.findOne({
                where: { isCurrent: true },
            })

            if (!currentYear) {
                throw new NotFoundError('Current academic year')
            }

            academicYearId = currentYear.id
        }

        return await getAvailableSlotsForRoom(roomId, dayOfWeek, academicYearId)
    }
}
