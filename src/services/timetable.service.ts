import sequelize from '@/config/database'
import { Class } from '@/models/Class'
// Fix capitalization to Section
import { Subject } from '@/models/Subject'
import { Teacher } from '@/models/Teacher'
// Fix capitalization to Timetable
// Fix capitalization to TimetableEntry
import { SectionTeacher } from '@/models/SectionTeacher'
import { Section } from '@/models/section'
import { Timetable } from '@/models/TimeTable'
import { TimetableEntry } from '@/models/TimeTableEntry'

export class TimetableService {
    /**
     * Generates a timetable for all sections of a given class.
     * @param classId - The ID of the class for which to generate the timetable.
     * @param config - Optional configuration for overrides (e.g., periods per day, break times).
     * @returns An array of generated timetables for each section.
     */
    static async generateTimetable(
        classId: number,
        config?: {
            periodsPerDayOverrides?: Record<string, number>
            breakStartTime?: string
            breakEndTime?: string
        },
    ) {
        const transaction = await sequelize.transaction()

        try {
            // Fetch class data including sections
            const classData = await Class.findByPk(classId, {
                include: [Section],
                transaction,
            })

            if (!classData) {
                throw new Error('Class not found')
            }

            if (!classData.sections || classData.sections.length === 0) {
                throw new Error('No sections found for this class')
            }

            const timetables = []

            // Generate a timetable for each section
            for (const section of classData.sections) {
                const timetable = await this.createTimetableForSection(
                    classData,
                    section,
                    config || {},
                    transaction,
                )

                timetables.push(timetable)
            }

            await transaction.commit()
            return timetables
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    /**
     * Creates a timetable for a specific section.
     * @param classData - The class data.
     * @param section - The section for which to create the timetable.
     * @param config - Optional configuration for overrides.
     * @param transaction - The Sequelize transaction.
     * @returns The created timetable.
     */
    private static async createTimetableForSection(
        classData: Class,
        section: Section,
        config: {
            periodsPerDayOverrides?: Record<string, number>
            breakStartTime?: string
            breakEndTime?: string
        },
        transaction: any, // Add proper transaction type
    ) {
        if (!classData.periodsPerDay || classData.periodsPerDay <= 0) {
            throw new Error('Invalid periods per day')
        }

        if (!classData.periodLength || classData.periodLength <= 0) {
            throw new Error('Invalid period length')
        }

        // Fetch subject-teacher assignments for this section
        const sectionTeachers = await SectionTeacher.findAll({
            where: { sectionId: section.id },
            include: [Subject, Teacher],
            transaction,
        })

        if (sectionTeachers.length === 0) {
            throw new Error(
                `No subject-teacher assignments found for section ${section.id}`,
            )
        }

        // Create the timetable
        const timetable = await Timetable.create(
            {
                classId: classData.id,
                sectionId: section.id,
                periodsPerDay: classData.periodsPerDay,
                periodsPerDayOverrides: config?.periodsPerDayOverrides || {},
                breakStartTime: config?.breakStartTime,
                breakEndTime: config?.breakEndTime,
                teacherId: sectionTeachers[0].teacherId, // Assuming the first teacher as default
            },
            { transaction },
        )

        // Generate timetable entries for each day and period
        const daysOfWeek: (
            | 'Monday'
            | 'Tuesday'
            | 'Wednesday'
            | 'Thursday'
            | 'Friday'
            | 'Saturday'
            | 'Sunday'
        )[] = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ]
        const timetableEntries = []

        for (const day of daysOfWeek) {
            const periodsForDay =
                timetable.periodsPerDayOverrides?.[day] ??
                timetable.periodsPerDay

            if (periodsForDay <= 0) {
                continue // Skip days with no periods
            }

            for (
                let periodNumber = 1;
                periodNumber <= periodsForDay;
                periodNumber++
            ) {
                // Assign subject and teacher in a round-robin fashion
                const subjectTeacher =
                    sectionTeachers[(periodNumber - 1) % sectionTeachers.length]

                const startTime = this.calculateStartTime(
                    day,
                    periodNumber,
                    timetable,
                    classData.periodLength,
                )

                const endTime = this.calculateEndTime(
                    startTime,
                    classData.periodLength,
                )

                const entry = await TimetableEntry.create(
                    {
                        timetableId: timetable.id,
                        sectionId: section.id, // Ensure sectionId is assigned
                        dayOfWeek: day,
                        periodNumber,
                        subjectId: subjectTeacher.subjectId,
                        teacherId: subjectTeacher.teacherId,
                        startTime,
                        endTime,
                    },
                    { transaction },
                )

                timetableEntries.push(entry)
            }
        }

        // Update the timetable with the generated entries
        await timetable.update({}, { transaction })

        return timetable
    }

    /**
     * Calculates the start time for a period.
     * @param day - The day of the week.
     * @param periodNumber - The period number.
     * @param timetable - The timetable configuration.
     * @param periodLength - The length of each period in minutes.
     * @returns The start time in "HH:MM" format.
     */
    private static calculateStartTime(
        day: string,
        periodNumber: number,
        timetable: Timetable,
        periodLength: number,
    ): string {
        if (periodNumber <= 0) {
            throw new Error('Invalid period number')
        }

        let startTime = '08:00' // Default start time

        if (periodNumber > 1) {
            let minutesToAdd = (periodNumber - 1) * periodLength

            // Adjust for break time if applicable
            if (timetable.breakStartTime && timetable.breakEndTime) {
                const [breakStartHour, breakStartMinute] =
                    timetable.breakStartTime.split(':').map(Number)
                const [breakEndHour, breakEndMinute] = timetable.breakEndTime
                    .split(':')
                    .map(Number)

                const breakDuration =
                    (breakEndHour - breakStartHour) * 60 +
                    (breakEndMinute - breakStartMinute)

                if (breakDuration <= 0) {
                    throw new Error('Invalid break duration')
                }

                const [startHour, startMinute] = startTime
                    .split(':')
                    .map(Number)
                const currentTimeMinutes =
                    startHour * 60 + startMinute + minutesToAdd
                const breakStartTimeMinutes =
                    breakStartHour * 60 + breakStartMinute

                if (currentTimeMinutes > breakStartTimeMinutes) {
                    minutesToAdd += breakDuration
                }
            }

            startTime = this.addMinutes(startTime, minutesToAdd)
        }

        return startTime
    }

    /**
     * Calculates the end time for a period.
     * @param startTime - The start time in "HH:MM" format.
     * @param periodLength - The length of the period in minutes.
     * @returns The end time in "HH:MM" format.
     */
    private static calculateEndTime(
        startTime: string,
        periodLength: number,
    ): string {
        if (periodLength <= 0) {
            throw new Error('Invalid period length')
        }
        return this.addMinutes(startTime, periodLength)
    }

    /**
     * Adds minutes to a given time.
     * @param time - The time in "HH:MM" format.
     * @param minutesToAdd - The number of minutes to add.
     * @returns The new time in "HH:MM" format.
     */
    private static addMinutes(time: string, minutesToAdd: number): string {
        if (minutesToAdd < 0) {
            throw new Error('Cannot add negative minutes')
        }

        let [hours, minutes] = time.split(':').map(Number)
        minutes += minutesToAdd

        hours += Math.floor(minutes / 60)
        minutes %= 60

        if (hours >= 24) {
            throw new Error('Time exceeds 24 hours')
        }

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }

    /**
     * Fetches the timetable for a specific class and section.
     * @param classId - The ID of the class.
     * @param sectionId - The ID of the section.
     * @returns The timetable with entries.
     */
    static async getTimetable(classId: number, sectionId: number) {
        if (classId <= 0 || sectionId <= 0) {
            throw new Error('Invalid class or section ID')
        }

        return Timetable.findOne({
            where: { classId, sectionId },
            include: [
                {
                    model: TimetableEntry,
                    include: [{ model: Subject }, { model: Teacher }],
                },
            ],
        })
    }
}
