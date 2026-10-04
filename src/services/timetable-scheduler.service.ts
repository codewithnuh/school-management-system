import type { Transaction } from 'sequelize'
import { Class } from '@/models/Class.js'
import { Room } from '@/models/Room.js'
import { Section } from '@/models/Section.js'
import { Subject } from '@/models/Subject.js'
import { Teacher } from '@/models/Teacher.js'
import { TimeSlot } from '@/models/TimeSlot.js'
import { Timetable } from '@/models/Timetable.js'
import { TimetableEntry } from '@/models/TimetableEntry.js'
import { User } from '@/models/User.js'
import { NotFoundError, TimetableConflictError } from '@/errors/index.js'
import { validateScheduleEntry, type ScheduleEntry } from './timetable-validator.service.js'

export interface SchedulingRequest extends ScheduleEntry {}

interface SchedulingResult {
    success: boolean
    timetable?: TimetableEntry
    error?: string
}

async function getOrCreateTimetable(
    classId: number,
    sectionId: number,
    transaction?: Transaction,
): Promise<Timetable> {
    const schoolClass = await Class.findByPk(classId, { transaction })
    if (!schoolClass) throw new NotFoundError('Class')

    const section = await Section.findByPk(sectionId, { transaction })
    if (!section || section.classId !== classId) {
        throw new NotFoundError('Section')
    }

    const [timetable] = await Timetable.findOrCreate({
        where: {
            classId,
            sectionId,
            academicYearId: schoolClass.academicYearId,
        },
        defaults: {
            classId,
            sectionId,
            academicYearId: schoolClass.academicYearId,
            name: `${schoolClass.name} ${section.name} timetable`,
        },
        transaction,
    })
    return timetable
}

export async function scheduleSession(
    request: SchedulingRequest,
    transaction?: Transaction,
): Promise<SchedulingResult> {
    const validation = await validateScheduleEntry(request, undefined, transaction)
    if (!validation.valid) {
        throw new TimetableConflictError(
            'Cannot schedule session due to conflicts',
            validation.conflicts,
        )
    }

    try {
        const [timetable, slot] = await Promise.all([
            getOrCreateTimetable(request.classId, request.sectionId, transaction),
            TimeSlot.findByPk(request.timeSlotId, { transaction }),
        ])
        if (!slot) throw new NotFoundError('Time slot')

        const entry = await TimetableEntry.create(
            {
                timetableId: timetable.id,
                teacherId: request.teacherId,
                subjectId: request.subjectId,
                dayOfWeek: request.dayOfWeek.toUpperCase() as TimetableEntry['dayOfWeek'],
                periodNumber: slot.periodNumber,
                roomId: request.roomId ?? null,
            },
            { transaction },
        )
        return { success: true, timetable: entry }
    } catch (error) {
        if (error instanceof TimetableConflictError || error instanceof NotFoundError) {
            throw error
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
    }
}

export async function updateSession(
    entryId: number,
    updates: Partial<SchedulingRequest>,
    transaction?: Transaction,
): Promise<SchedulingResult> {
    const existing = await TimetableEntry.findByPk(entryId, {
        include: [{ model: Timetable, as: 'timetable' }],
        transaction,
    })
    if (!existing) throw new NotFoundError('Timetable entry')
    const timetable = existing.timetable
    if (!timetable) throw new NotFoundError('Timetable')
    const schoolClass = await Class.findByPk(timetable.classId, { transaction })
    if (!schoolClass) throw new NotFoundError('Class')
    const currentSlot = await TimeSlot.findOne({
        where: { schoolId: schoolClass.schoolId, periodNumber: existing.periodNumber },
        transaction,
    })
    if (!currentSlot) throw new NotFoundError('Time slot')

    const request: SchedulingRequest = {
        classId: updates.classId ?? timetable.classId,
        sectionId: updates.sectionId ?? timetable.sectionId,
        subjectId: updates.subjectId ?? existing.subjectId,
        teacherId: updates.teacherId ?? existing.teacherId,
        roomId: updates.roomId ?? existing.roomId ?? undefined,
        dayOfWeek: updates.dayOfWeek ?? (existing.dayOfWeek.toLowerCase() as SchedulingRequest['dayOfWeek']),
        timeSlotId: updates.timeSlotId ?? currentSlot.id,
    }

    const validation = await validateScheduleEntry(request, entryId, transaction)
    if (!validation.valid) {
        throw new TimetableConflictError(
            'Cannot update session due to conflicts',
            validation.conflicts,
        )
    }

    const [targetTimetable, slot] = await Promise.all([
        getOrCreateTimetable(request.classId, request.sectionId, transaction),
        TimeSlot.findByPk(request.timeSlotId, { transaction }),
    ])
    if (!slot) throw new NotFoundError('Time slot')
    await existing.update(
        {
            timetableId: targetTimetable.id,
            teacherId: request.teacherId,
            subjectId: request.subjectId,
            dayOfWeek: request.dayOfWeek.toUpperCase() as TimetableEntry['dayOfWeek'],
            periodNumber: slot.periodNumber,
            roomId: request.roomId ?? null,
        },
        { transaction },
    )
    return { success: true, timetable: existing }
}

export async function deleteSession(
    entryId: number,
    transaction?: Transaction,
): Promise<{ success: boolean; error?: string }> {
    try {
        const entry = await TimetableEntry.findByPk(entryId, { transaction })
        if (!entry) throw new NotFoundError('Timetable entry')
        await entry.destroy({ transaction })
        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
    }
}

export async function batchScheduleSessions(
    requests: SchedulingRequest[],
    transaction?: Transaction,
): Promise<{ success: boolean; results: SchedulingResult[]; error?: string }> {
    const results: SchedulingResult[] = []
    try {
        for (const request of requests) {
            const result = await scheduleSession(request, transaction)
            results.push(result)
            if (!result.success) throw new Error(result.error ?? 'Failed to schedule session')
        }
        return { success: true, results }
    } catch (error) {
        return {
            success: false,
            results,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
    }
}

export async function getClassSessions(
    classId: number,
    sectionId: number,
    academicYearId: number,
    transaction?: Transaction,
): Promise<TimetableEntry[]> {
    return TimetableEntry.findAll({
        include: [
            { model: Timetable, as: 'timetable', where: { classId, sectionId, academicYearId } },
            { model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] },
            { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }] },
            { model: Room, as: 'room', attributes: ['id', 'name', 'capacity'] },
        ],
        order: [['dayOfWeek', 'ASC'], ['periodNumber', 'ASC']],
        transaction,
    })
}

export async function getTeacherSessions(
    teacherId: number,
    academicYearId: number,
    transaction?: Transaction,
): Promise<TimetableEntry[]> {
    return TimetableEntry.findAll({
        where: { teacherId },
        include: [
            { model: Timetable, as: 'timetable', where: { academicYearId }, include: [{ model: Class, as: 'class' }, { model: Section, as: 'section' }] },
            { model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] },
            { model: Room, as: 'room', attributes: ['id', 'name', 'capacity'] },
        ],
        order: [['dayOfWeek', 'ASC'], ['periodNumber', 'ASC']],
        transaction,
    })
}

export async function getRoomSessions(
    roomId: number,
    academicYearId: number,
    transaction?: Transaction,
): Promise<TimetableEntry[]> {
    return TimetableEntry.findAll({
        where: { roomId },
        include: [
            { model: Timetable, as: 'timetable', where: { academicYearId }, include: [{ model: Class, as: 'class' }, { model: Section, as: 'section' }] },
            { model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] },
            { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }] },
        ],
        order: [['dayOfWeek', 'ASC'], ['periodNumber', 'ASC']],
        transaction,
    })
}
