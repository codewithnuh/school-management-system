import type { Transaction } from 'sequelize'
import sequelize from '@/infrastructure/persistence/sequelize/client.js'
import { Class } from '@/models/Class.js'
import { ClassSubject } from '@/models/ClassSubject.js'
import { Section } from '@/models/Section.js'
import { SectionTeacher } from '@/models/SectionTeacher.js'
import { TimeSlot } from '@/models/TimeSlot.js'
import { Timetable } from '@/models/Timetable.js'
import { TimetableEntry } from '@/models/TimetableEntry.js'
import { NotFoundError, ValidationError } from '@/errors/index.js'
import type { DayOfWeek } from './validation.service.js'
import { scheduleSession } from './timetable-scheduler.service.js'

interface AutoScheduleConfig {
    classId: number
    academicYearId: number
    workingDays: DayOfWeek[]
    maxPeriodsPerDay?: number
}

interface ScheduleResult {
    success: boolean
    scheduledCount: number
    failedCount: number
    errors: Array<{ subjectId: number; teacherId: number; error: string }>
    timetable?: TimetableEntry[]
}

export async function generateTimetableForClass(
    config: AutoScheduleConfig,
    transaction?: Transaction,
): Promise<ScheduleResult> {
    const ownsTransaction = transaction === undefined
    const activeTransaction = transaction ?? (await sequelize.transaction())
    const errors: ScheduleResult['errors'] = []
    const entries: TimetableEntry[] = []

    try {
        const schoolClass = await Class.findByPk(config.classId, { transaction: activeTransaction })
        if (!schoolClass) throw new NotFoundError('Class')
        if (schoolClass.academicYearId !== config.academicYearId) {
            throw new ValidationError('Class does not belong to the requested academic year')
        }

        const [sections, classSubjects, timeSlots] = await Promise.all([
            Section.findAll({ where: { classId: config.classId, isActive: true }, transaction: activeTransaction }),
            ClassSubject.findAll({ where: { classId: config.classId }, transaction: activeTransaction }),
            TimeSlot.findAll({
                where: { schoolId: schoolClass.schoolId, isActive: true, isBreak: false },
                order: [['periodNumber', 'ASC']],
                transaction: activeTransaction,
            }),
        ])
        if (sections.length === 0) throw new ValidationError('No active sections are configured for this class')
        if (classSubjects.length === 0) throw new ValidationError('No subjects are configured for this class')
        const maxPeriod = config.maxPeriodsPerDay ?? Number.POSITIVE_INFINITY
        const slots = timeSlots.filter(slot => slot.periodNumber <= maxPeriod)
        if (slots.length === 0 || config.workingDays.length === 0) {
            throw new ValidationError('No usable timetable periods or working days are configured')
        }

        for (const section of sections) {
            for (const classSubject of classSubjects) {
                const assignment = await SectionTeacher.findOne({
                    where: { sectionId: section.id, subjectId: classSubject.subjectId },
                    order: [['teacherId', 'ASC']],
                    transaction: activeTransaction,
                })
                if (!assignment) {
                    errors.push({
                        subjectId: classSubject.subjectId,
                        teacherId: 0,
                        error: `No teacher is assigned to subject ${classSubject.subjectId} in section ${section.name}`,
                    })
                    continue
                }

                for (let period = 0; period < classSubject.periodsPerWeek; period += 1) {
                    let scheduled: TimetableEntry | undefined
                    for (const day of config.workingDays) {
                        for (const slot of slots) {
                            try {
                                const result = await scheduleSession({
                                    classId: config.classId,
                                    sectionId: section.id,
                                    subjectId: classSubject.subjectId,
                                    teacherId: assignment.teacherId,
                                    dayOfWeek: day,
                                    timeSlotId: slot.id,
                                }, activeTransaction)
                                if (result.success && result.timetable) {
                                    scheduled = result.timetable
                                    break
                                }
                            } catch {
                                // Try the next available day and period after a scheduling conflict.
                            }
                        }
                        if (scheduled) break
                    }
                    if (scheduled) {
                        entries.push(scheduled)
                    } else {
                        errors.push({
                            subjectId: classSubject.subjectId,
                            teacherId: assignment.teacherId,
                            error: `No conflict-free period was available for weekly occurrence ${period + 1}`,
                        })
                    }
                }
            }
        }

        if (ownsTransaction) await activeTransaction.commit()
        return {
            success: errors.length === 0,
            scheduledCount: entries.length,
            failedCount: errors.length,
            errors,
            timetable: entries,
        }
    } catch (error) {
        if (ownsTransaction) await activeTransaction.rollback()
        throw error
    }
}

export async function generateTimetablesForSchool(
    schoolId: number,
    academicYearId: number,
    workingDays: DayOfWeek[],
    transaction?: Transaction,
): Promise<{ success: boolean; results: Array<{ classId: number; result: ScheduleResult }> }> {
    const classes = await Class.findAll({ where: { schoolId, academicYearId }, transaction })
    const results: Array<{ classId: number; result: ScheduleResult }> = []
    for (const schoolClass of classes) {
        const result = await generateTimetableForClass(
            { classId: schoolClass.id, academicYearId, workingDays },
            transaction,
        )
        results.push({ classId: schoolClass.id, result })
    }
    return { success: results.every(({ result }) => result.success), results }
}

export async function clearTimetableForClass(
    classId: number,
    academicYearId: number,
    transaction?: Transaction,
): Promise<{ success: boolean; deletedCount: number }> {
    const timetables = await Timetable.findAll({
        where: { classId, academicYearId },
        attributes: ['id'],
        transaction,
    })
    const timetableIds = timetables.map(timetable => timetable.id)
    const deletedCount = await TimetableEntry.destroy({
        where: { timetableId: timetableIds },
        transaction,
    })
    await Timetable.destroy({ where: { id: timetableIds }, transaction })
    return { success: true, deletedCount }
}

export async function validateTimetableCompleteness(
    classId: number,
    academicYearId: number,
    _workingDays: DayOfWeek[],
    transaction?: Transaction,
): Promise<{
    isValid: boolean
    missingPeriods: Array<{ subjectId: number; required: number; scheduled: number }>
    totalScheduled: number
    totalRequired: number
}> {
    const [sections, classSubjects, timetables] = await Promise.all([
        Section.findAll({ where: { classId, isActive: true }, attributes: ['id'], transaction }),
        ClassSubject.findAll({ where: { classId }, transaction }),
        Timetable.findAll({ where: { classId, academicYearId }, attributes: ['id'], transaction }),
    ])
    const entries = await TimetableEntry.findAll({
        where: { timetableId: timetables.map(timetable => timetable.id) },
        attributes: ['subjectId'],
        transaction,
    })
    const missingPeriods = classSubjects.flatMap(classSubject => {
        const scheduled = entries.filter(entry => entry.subjectId === classSubject.subjectId).length
        const required = classSubject.periodsPerWeek * sections.length
        return scheduled < required
            ? [{ subjectId: classSubject.subjectId, required, scheduled }]
            : []
    })
    const totalScheduled = entries.length
    const totalRequired = classSubjects.reduce(
        (total, classSubject) => total + classSubject.periodsPerWeek * sections.length,
        0,
    )
    return { isValid: missingPeriods.length === 0, missingPeriods, totalScheduled, totalRequired }
}
