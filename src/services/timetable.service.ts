// services/TimetableService.ts
import { Class } from '@/models/Class'
import { ClassSubject } from '@/models/ClassSubject'
import { Section } from '@/models/Section'
import { Subject } from '@/models/Subject'
import { Teacher } from '@/models/Teacher'
import { TimeSlot, TimeSlotAttributes } from '@/models/TimeSlot'
import { Timetable } from '@/models/TimeTable'
import { generateTimeSlots } from '@/utils/timeTableUtils'
import { z } from 'zod'

export const TimetableGenerationSchema = z.object({
    sectionId: z.number().positive(),
    // startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    // endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export type TimetableGenerationInput = z.infer<typeof TimetableGenerationSchema>

export class TimetableService {
    private static async pickSubject(
        classId: number,
        day: string,
    ): Promise<Subject> {
        const classSubjects = await ClassSubject.findAll({ where: { classId } })
        const timetable = await Timetable.findAll({
            where: { sectionId: classId },
            include: [TimeSlot],
        })

        // Count subject occurrences per day
        const subjectCounts: Record<number, number> = {}
        timetable.forEach(entry => {
            if (entry.timeSlot.day === day) {
                subjectCounts[entry.subjectId] =
                    (subjectCounts[entry.subjectId] || 0) + 1
            }
        })

        // Prioritize subjects with fewer occurrences
        const sortedSubjects = classSubjects.sort(
            (a, b) =>
                (subjectCounts[a.subjectId] || 0) -
                (subjectCounts[b.subjectId] || 0),
        )

        return sortedSubjects[0].subject
    }
    private static async findAvailableTeacher(
        subjectId: number,
        timeSlot: TimeSlot,
    ): Promise<Teacher> {
        const teachers = await Teacher.findAll({ where: { subjectId } })
        const busyTeachers = await Timetable.findAll({
            where: { timeSlotId: timeSlot.id },
            attributes: ['teacherId'],
        })

        const availableTeachers = teachers.filter(
            t => !busyTeachers.some(bt => bt.teacherId === t.id),
        )

        if (availableTeachers.length === 0) {
            throw new Error(
                `No available teachers for subject ${subjectId} at ${timeSlot.startTime}`,
            )
        }

        return availableTeachers[0]
    }

    /**
     * Generate a timetable for a specific section
     */
    static async generateTimetable(sectionId: number) {
        const section = await Section.findByPk(sectionId, { include: [Class] })
        if (!section) throw new Error('Section not found')

        // Fetch all time slots for the section's class
        const timeSlots = await TimeSlot.findAll({
            where: { day: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] },
        })

        // Clear existing timetable entries
        await Timetable.destroy({ where: { sectionId } })

        // Generate new timetable
        const timetableEntries: Partial<Timetable>[] = []
        for (const timeSlot of timeSlots) {
            if (timeSlot.type === 'BREAK') continue // Skip breaks

            const subject = await this.pickSubject(
                section.classId,
                timeSlot.day,
            )
            const teacher = await this.findAvailableTeacher(
                subject.id,
                timeSlot,
            )

            timetableEntries.push({
                sectionId,
                timeSlotId: timeSlot.id,
                subjectId: subject.id,
                teacherId: teacher.id,
            })
        }

        return Timetable.bulkCreate(timetableEntries)
    }

    /**
     * Validate constraints before generating the timetable
     */
    private static validateTimetableConstraints(
        section: Section,
        teachers: Teacher[],
        subjects: Subject[],
        timeSlots: TimeSlot[],
    ): void {
        // Check if section has enough teachers and subjects
        if (teachers.length < 1) throw new Error('No teachers available')
        if (subjects.length < 1) throw new Error('No subjects available')
        if (timeSlots.length < 1) throw new Error('No time slots available')

        // Additional validation logic can be added here
    }

    /**
     * Create timetable entries based on the provided data
     */
    private static async createTimetableEntries(
        section: Section,
        teachers: Teacher[],
        subjects: Subject[],
        timeSlots: TimeSlot[],
    ): Promise<Partial<Timetable>[]> {
        const timetableEntries: Partial<Timetable>[] = []
        const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

        // Fetch the class to get periodsPerDay
        const classDetails = await Class.findByPk(section.classId)
        if (!classDetails) throw new Error('Class not found')

        const periodsPerDay = classDetails.periodsPerDay

        // Create a map of teachers by their subjectId for quick lookup
        const teacherMap = new Map<number, Teacher[]>()
        teachers.forEach(teacher => {
            if (!teacherMap.has(teacher.subjectId)) {
                teacherMap.set(teacher.subjectId, [])
            }
            teacherMap.get(teacher.subjectId)?.push(teacher)
        })

        // Assign subjects to periods
        days.forEach(day => {
            const dayTimeSlots = timeSlots.filter(ts => ts.day === day)

            for (let period = 1; period <= periodsPerDay; period++) {
                const timeSlot = dayTimeSlots[period - 1]
                if (!timeSlot) continue

                // Find a subject for this period
                const subject = subjects[period % subjects.length] // Distribute subjects evenly

                // Find available teachers for this subject
                const availableTeachers = teacherMap.get(subject.id)
                if (!availableTeachers || availableTeachers.length === 0) {
                    throw new Error(
                        `No available teachers for subject: ${subject.name}`,
                    )
                }

                // Assign the first available teacher (can be improved further)
                const teacher = availableTeachers[0]

                // Check for conflicts (teacher already assigned at this time)
                const isTeacherBusy = timetableEntries.some(
                    entry =>
                        entry.teacherId === teacher.id &&
                        entry.timeSlotId === timeSlot.id,
                )

                if (isTeacherBusy) {
                    throw new Error(
                        `Teacher ${teacher.id} is already assigned at this time.`,
                    )
                }

                // Add the timetable entry
                timetableEntries.push({
                    sectionId: section.id,
                    timeSlotId: timeSlot.id,
                    subjectId: subject.id,
                    teacherId: teacher.id,
                    roomNumber: `Room ${101 + (period % 5)}`, // Example room assignment
                })
            }
        })

        return timetableEntries
    }

    /**
     * Get timetable for a specific section
     */
    static async getSectionTimetable(sectionId: number): Promise<Timetable[]> {
        return await Timetable.findAll({
            where: { sectionId },
            include: [TimeSlot, Subject, Teacher],
        })
    }

    /**
     * Get timetable for a specific teacher
     */
    static async getTeacherTimetable(teacherId: number): Promise<Timetable[]> {
        return await Timetable.findAll({
            where: { teacherId },
            include: [TimeSlot, Subject, Section],
        })
    }
    static async generateTimeSlotsForClass(classId: number) {
        const classDetails = await Class.findByPk(classId)
        if (!classDetails) throw new Error('Class not found')

        const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        const slots: TimeSlotAttributes[] = []

        days.forEach(day => {
            const dailySlots = generateTimeSlots({
                startTime: '08:00',
                endTime: '14:00',
                periodLength: classDetails.periodLength, // Add this field to Class model
                breakLength: 15,
            })
            dailySlots.forEach(
                slot =>
                    (slot.day = day as
                        | 'MON'
                        | 'TUE'
                        | 'WED'
                        | 'THU'
                        | 'FRI'
                        | 'SAT'),
            )
            slots.push(...dailySlots)
        })

        return TimeSlot.bulkCreate(slots)
    }
}
