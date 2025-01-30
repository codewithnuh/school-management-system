// services/TimetableService.ts
import { Class } from '@/models/Class'
import { Section } from '@/models/Section'
import { Subject } from '@/models/Subject'
import { Teacher } from '@/models/Teacher'
import { TimeSlot } from '@/models/TimeSlot'
import { Timetable } from '@/models/TimeTable'
import { z } from 'zod'

export const TimetableGenerationSchema = z.object({
    sectionId: z.number().positive(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export type TimetableGenerationInput = z.infer<typeof TimetableGenerationSchema>

export class TimetableService {
    /**
     * Generate a timetable for a specific section
     */
    static async generateTimetable(
        input: TimetableGenerationInput,
    ): Promise<Timetable[]> {
        const { sectionId, startDate, endDate } = input

        // Fetch required data
        const section = await Section.findByPk(sectionId, {
            include: [Class],
        })
        if (!section) throw new Error('Section not found')

        const teachers = await Teacher.findAll()
        const subjects = await Subject.findAll()
        const timeSlots = await TimeSlot.findAll()

        // Validate constraints
        this.validateTimetableConstraints(
            section,
            teachers,
            subjects,
            timeSlots,
        )

        // Generate timetable
        const timetableEntries = await this.createTimetableEntries(
            section,
            teachers,
            subjects,
            timeSlots,
        )

        // Save to database
        const savedEntries = await Timetable.bulkCreate(timetableEntries)
        return savedEntries
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

        // Create a map of teachers by their subject for quick lookup
        const teacherMap = new Map<string, Teacher[]>()
        teachers.forEach(teacher => {
            const subjectName = teacher.subject // e.g., 'Maths'
            if (!teacherMap.has(subjectName)) {
                teacherMap.set(subjectName, [])
            }
            teacherMap.get(subjectName)?.push(teacher)
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
                const subjectName = subject.name // e.g., 'Maths'
                const availableTeachers = teacherMap.get(subjectName)
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
}
