// services/TimetableService.ts
import { Class } from '@/models/Class'
import { Section } from '@/models/Section'
import { Subject } from '@/models/Subject'
import { Teacher } from '@/models/Teacher'
import { TimeSlot } from '@/models/Timeslot'
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
        const timetableEntries = this.createTimetableEntries(
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
    private static createTimetableEntries(
        section: Section,
        teachers: Teacher[],
        subjects: Subject[],
        timeSlots: TimeSlot[],
    ): Partial<Timetable>[] {
        const timetableEntries: Partial<Timetable>[] = []

        // Example algorithm: Assign subjects to time slots
        timeSlots.forEach(timeSlot => {
            const subject =
                subjects[Math.floor(Math.random() * subjects.length)]
            const teacher =
                teachers[Math.floor(Math.random() * teachers.length)]

            timetableEntries.push({
                sectionId: section.id,
                timeSlotId: timeSlot.id,
                subjectId: subject.id,
                teacherId: teacher.id,
                roomNumber: 'Room 101', // Example room assignment
            })
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
