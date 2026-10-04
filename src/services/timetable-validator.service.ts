import { Op, type Transaction, type WhereOptions } from 'sequelize'
import { Class } from '@/models/Class.js'
import { ClassSubject } from '@/models/ClassSubject.js'
import { Room } from '@/models/Room.js'
import { Section } from '@/models/Section.js'
import { SectionTeacher } from '@/models/SectionTeacher.js'
import { Subject } from '@/models/Subject.js'
import { Teacher } from '@/models/Teacher.js'
import { TimeSlot } from '@/models/TimeSlot.js'
import { Timetable } from '@/models/Timetable.js'
import {
    TimetableEntry,
    type TimetableEntryAttributes,
    type TimetableDay,
} from '@/models/TimetableEntry.js'
import { DayOfWeekSchema, type DayOfWeek } from './validation.service.js'
import { z } from 'zod'

export const ScheduleEntrySchema = z.object({
    classId: z.number().int().positive(),
    sectionId: z.number().int().positive(),
    subjectId: z.number().int().positive(),
    teacherId: z.number().int().positive(),
    roomId: z.number().int().positive().optional(),
    dayOfWeek: DayOfWeekSchema,
    timeSlotId: z.number().int().positive(),
})

export type ScheduleEntry = z.infer<typeof ScheduleEntrySchema>

export interface ConflictCheck {
    hasConflict: boolean
    conflictType?: 'teacher' | 'room' | 'class' | 'subject'
    conflictingEntity?: {
        type: string
        id: number
        name?: string
    }
}

export interface ScheduleConflict {
    type: 'teacher' | 'room' | 'class'
    entityId: number
    timeSlotId: number
    day: string
    details?: ConflictCheck['conflictingEntity']
}

const DB_DAY: Record<DayOfWeek, TimetableDay> = {
    monday: 'MONDAY',
    tuesday: 'TUESDAY',
    wednesday: 'WEDNESDAY',
    thursday: 'THURSDAY',
    friday: 'FRIDAY',
    saturday: 'SATURDAY',
    sunday: 'SUNDAY',
}

function toDatabaseDay(day: string): TimetableDay | null {
    const parsed = DayOfWeekSchema.safeParse(day.toLowerCase())
    return parsed.success ? DB_DAY[parsed.data] : null
}

async function getActiveSlot(
    timeSlotId: number,
    schoolId: number,
    transaction?: Transaction,
): Promise<TimeSlot | null> {
    const slot = await TimeSlot.findByPk(timeSlotId, { transaction })
    if (
        !slot ||
        slot.schoolId !== schoolId ||
        !slot.isActive ||
        slot.isBreak
    ) {
        return null
    }
    return slot
}

function excludeEntry(
    where: WhereOptions<TimetableEntryAttributes>,
    excludeEntryId?: number,
): WhereOptions<TimetableEntryAttributes> {
    if (excludeEntryId === undefined) return where
    return { ...where, id: { [Op.ne]: excludeEntryId } }
}

export async function checkTeacherAvailability(
    teacherId: number,
    dayOfWeek: string,
    timeSlotId: number,
    excludeEntryId?: number,
    transaction?: Transaction,
): Promise<ConflictCheck> {
    const day = toDatabaseDay(dayOfWeek)
    const teacher = await Teacher.findByPk(teacherId, {
        attributes: ['schoolId'],
        transaction,
    })
    if (!day || !teacher) {
        return { hasConflict: true, conflictType: 'teacher' }
    }

    const slot = await getActiveSlot(timeSlotId, teacher.schoolId, transaction)
    if (!slot) return { hasConflict: true, conflictType: 'teacher' }

    const where = excludeEntry(
        {
            teacherId,
            dayOfWeek: day,
            periodNumber: slot.periodNumber,
        },
        excludeEntryId,
    )
    const conflict = await TimetableEntry.findOne({ where, transaction })
    return conflict
        ? {
              hasConflict: true,
              conflictType: 'teacher',
              conflictingEntity: { type: 'timetable-entry', id: conflict.id },
          }
        : { hasConflict: false }
}

export async function checkRoomAvailability(
    roomId: number,
    dayOfWeek: string,
    timeSlotId: number,
    excludeEntryId?: number,
    transaction?: Transaction,
): Promise<ConflictCheck> {
    const day = toDatabaseDay(dayOfWeek)
    const room = await Room.findByPk(roomId, {
        attributes: ['schoolId'],
        transaction,
    })
    if (!day || !room) return { hasConflict: true, conflictType: 'room' }

    const slot = await getActiveSlot(timeSlotId, room.schoolId, transaction)
    if (!slot) return { hasConflict: true, conflictType: 'room' }

    const where = excludeEntry(
        {
            roomId,
            dayOfWeek: day,
            periodNumber: slot.periodNumber,
        },
        excludeEntryId,
    )
    const conflict = await TimetableEntry.findOne({ where, transaction })
    return conflict
        ? {
              hasConflict: true,
              conflictType: 'room',
              conflictingEntity: { type: 'timetable-entry', id: conflict.id },
          }
        : { hasConflict: false }
}

export async function checkClassAvailability(
    classId: number,
    sectionId: number,
    dayOfWeek: string,
    timeSlotId: number,
    excludeEntryId?: number,
    transaction?: Transaction,
): Promise<ConflictCheck> {
    const day = toDatabaseDay(dayOfWeek)
    const [schoolClass, section] = await Promise.all([
        Class.findByPk(classId, { attributes: ['schoolId'], transaction }),
        Section.findByPk(sectionId, { attributes: ['classId'], transaction }),
    ])
    if (!day || !schoolClass || !section || section.classId !== classId) {
        return { hasConflict: true, conflictType: 'class' }
    }

    const slot = await getActiveSlot(timeSlotId, schoolClass.schoolId, transaction)
    if (!slot) return { hasConflict: true, conflictType: 'class' }

    const where = excludeEntry(
        {
            dayOfWeek: day,
            periodNumber: slot.periodNumber,
        },
        excludeEntryId,
    )
    const conflict = await TimetableEntry.findOne({
        where,
        include: [
            {
                model: Timetable,
                as: 'timetable',
                attributes: [],
                where: { classId, sectionId },
            },
        ],
        transaction,
    })
    return conflict
        ? {
              hasConflict: true,
              conflictType: 'class',
              conflictingEntity: { type: 'timetable-entry', id: conflict.id },
          }
        : { hasConflict: false }
}

export async function validateScheduleEntry(
    input: ScheduleEntry,
    excludeEntryId?: number,
    transaction?: Transaction,
): Promise<{ valid: boolean; errors: string[]; conflicts: ScheduleConflict[] }> {
    const parsed = ScheduleEntrySchema.safeParse(input)
    if (!parsed.success) {
        return {
            valid: false,
            errors: parsed.error.issues.map(issue => issue.message),
            conflicts: [],
        }
    }

    const entry = parsed.data
    const errors: string[] = []
    const conflicts: ScheduleConflict[] = []
    const [schoolClass, section, teacher, subject, assignment] =
        await Promise.all([
            Class.findByPk(entry.classId, { attributes: ['schoolId'], transaction }),
            Section.findByPk(entry.sectionId, { attributes: ['classId'], transaction }),
            Teacher.findByPk(entry.teacherId, { attributes: ['schoolId'], transaction }),
            Subject.findByPk(entry.subjectId, { attributes: ['schoolId'], transaction }),
            SectionTeacher.findOne({
                where: {
                    sectionId: entry.sectionId,
                    teacherId: entry.teacherId,
                    subjectId: entry.subjectId,
                },
                transaction,
            }),
        ])

    const classSubject = await ClassSubject.findOne({
        where: { classId: entry.classId, subjectId: entry.subjectId },
        transaction,
    })
    const slot = schoolClass
        ? await getActiveSlot(entry.timeSlotId, schoolClass.schoolId, transaction)
        : null

    if (
        !schoolClass ||
        !section ||
        section.classId !== entry.classId ||
        !teacher ||
        !subject ||
        teacher.schoolId !== schoolClass.schoolId ||
        subject.schoolId !== schoolClass.schoolId ||
        !slot ||
        !classSubject ||
        !assignment
    ) {
        errors.push('Schedule references are invalid or belong to different schools')
        return { valid: false, errors, conflicts }
    }

    const checks: Array<{
        type: ScheduleConflict['type']
        entityId: number
        result: ConflictCheck
    }> = [
        {
            type: 'teacher',
            entityId: entry.teacherId,
            result: await checkTeacherAvailability(
                entry.teacherId,
                entry.dayOfWeek,
                entry.timeSlotId,
                excludeEntryId,
                transaction,
            ),
        },
        {
            type: 'class',
            entityId: entry.classId,
            result: await checkClassAvailability(
                entry.classId,
                entry.sectionId,
                entry.dayOfWeek,
                entry.timeSlotId,
                excludeEntryId,
                transaction,
            ),
        },
    ]

    if (entry.roomId !== undefined) {
        checks.push({
            type: 'room',
            entityId: entry.roomId,
            result: await checkRoomAvailability(
                entry.roomId,
                entry.dayOfWeek,
                entry.timeSlotId,
                excludeEntryId,
                transaction,
            ),
        })
    }

    for (const check of checks) {
        if (!check.result.hasConflict) continue
        conflicts.push({
            type: check.type,
            entityId: check.entityId,
            timeSlotId: entry.timeSlotId,
            day: entry.dayOfWeek,
            details: check.result.conflictingEntity,
        })
        errors.push(`${check.type} is already assigned during this period`)
    }

    return { valid: errors.length === 0, errors, conflicts }
}

async function availableSlots(
    schoolId: number,
    dayOfWeek: string,
    transaction?: Transaction,
    extraWhere: WhereOptions<TimetableEntryAttributes> = {},
    classScope?: { classId: number; sectionId: number },
): Promise<number[]> {
    const day = toDatabaseDay(dayOfWeek)
    if (!day) return []

    const slots = await TimeSlot.findAll({
        where: { schoolId, isActive: true, isBreak: false },
        order: [['periodNumber', 'ASC']],
        transaction,
    })
    const bookedWhere: WhereOptions<TimetableEntryAttributes> = {
        ...extraWhere,
        dayOfWeek: day,
    }
    const entries = await TimetableEntry.findAll({
        where: bookedWhere,
        attributes: ['periodNumber'],
        ...(classScope
            ? {
                  include: [
                      {
                          model: Timetable,
                          as: 'timetable',
                          attributes: [],
                          where: classScope,
                      },
                  ],
              }
            : {}),
        transaction,
    })
    const bookedPeriods = new Set(entries.map(entry => entry.periodNumber))
    return slots
        .filter(slot => !bookedPeriods.has(slot.periodNumber))
        .map(slot => slot.id)
}

export async function getAvailableSlotsForTeacher(
    teacherId: number,
    dayOfWeek: string,
    _academicYearId: number,
    transaction?: Transaction,
): Promise<number[]> {
    const teacher = await Teacher.findByPk(teacherId, {
        attributes: ['schoolId'],
        transaction,
    })
    return teacher
        ? availableSlots(
              teacher.schoolId,
              dayOfWeek,
              transaction,
              { teacherId },
          )
        : []
}

export async function getAvailableSlotsForClass(
    classId: number,
    sectionId: number,
    dayOfWeek: string,
    _academicYearId: number,
    transaction?: Transaction,
): Promise<number[]> {
    const [schoolClass, section] = await Promise.all([
        Class.findByPk(classId, { attributes: ['schoolId'], transaction }),
        Section.findByPk(sectionId, { attributes: ['classId'], transaction }),
    ])
    return schoolClass && section?.classId === classId
        ? availableSlots(
              schoolClass.schoolId,
              dayOfWeek,
              transaction,
              {},
              { classId, sectionId },
          )
        : []
}

export async function getAvailableSlotsForRoom(
    roomId: number,
    dayOfWeek: string,
    _academicYearId: number,
    transaction?: Transaction,
): Promise<number[]> {
    const room = await Room.findByPk(roomId, {
        attributes: ['schoolId'],
        transaction,
    })
    return room
        ? availableSlots(room.schoolId, dayOfWeek, transaction, { roomId })
        : []
}
