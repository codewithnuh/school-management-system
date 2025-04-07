/* eslint-disable @typescript-eslint/no-unused-vars */

import sequelize from '@/config/database.js'
import { Class } from '@/models/Class.js'
import { Subject } from '@/models/Subject.js'
import { Teacher } from '@/models/Teacher.js'
import { SectionTeacher } from '@/models/SectionTeacher.js'
import { Section } from '@/models/Section.js'
import { Timetable } from '@/models/TimeTable.js'
import { TimetableEntry } from '@/models/TimeTableEntry.js'
import { Sequelize, Transaction, Op } from 'sequelize' // Import Op for queries

// Type definitions for timetable generation
interface TeacherAvailability {
    [day: string]: {
        [periodNumber: number]: boolean // true if available, false if booked
    }
}

interface SubjectDistribution {
    [subjectId: number]: number // Number of periods allocated
}

interface SubjectTeacherPair {
    subjectId: number
    teacherId: number
    sectionTeacherId: number
    weight: number // Weight for prioritization
}

interface SubjectPeriodPreference {
    [subjectId: number]: {
        preferredPeriods: number[]
        avoidPeriods: number[]
    }
}

export class TimetableService {
    /**
     * Generates a timetable for all sections of a given class, ensuring teacher availability
     * across sections and cleaning up previous timetables for the class.
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
        // Start a transaction for atomic operations
        const transaction = await sequelize.transaction()

        try {
            // --- Cleanup Previous Timetables ---
            // 1. Find existing timetable IDs for this class
            const existingTimetables = await Timetable.findAll({
                where: { classId },
                attributes: ['id'], // Only need the IDs
                transaction,
                raw: true, // Get plain objects
            })
            const existingTimetableIds = existingTimetables.map(tt => tt.id)

            // 2. Delete existing timetable entries associated with these timetables
            if (existingTimetableIds.length > 0) {
                await TimetableEntry.destroy({
                    where: {
                        timetableId: {
                            [Op.in]: existingTimetableIds,
                        },
                    },
                    transaction,
                })
            }

            // 3. Delete the existing timetables themselves
            await Timetable.destroy({
                where: { classId },
                transaction,
            })
            // --- End Cleanup ---

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

            // Validate the class has working days defined
            if (!classData.workingDays || classData.workingDays.length === 0) {
                throw new Error('No working days defined for this class')
            }

            const timetables = []

            // Initialize teacher availability tracking *before* the loop
            // This map will be shared across all sections of this class generation
            const sharedTeacherAvailability: {
                [teacherId: number]: TeacherAvailability
            } = {}

            // Generate subject preferences - can still be different for each section
            const sectionSubjectPreferences: {
                [sectionId: number]: SubjectPeriodPreference
            } = {}

            // Pre-calculate preferences for all sections
            for (const section of classData.sections) {
                sectionSubjectPreferences[section.id] =
                    await this.generateSectionSubjectPreferences(
                        section.id,
                        transaction,
                    )
            }

            // Generate a timetable for each section, using the shared availability map
            for (let i = 0; i < classData.sections.length; i++) {
                const section = classData.sections[i]

                // Generate a section-specific pattern staggered from other sections
                const sectionOffset = i * 2 // Stagger pattern by 2 periods per section

                const timetable = await this.createTimetableForSection(
                    classData,
                    section,
                    config || {},
                    transaction,
                    sharedTeacherAvailability, // Pass the shared map
                    sectionSubjectPreferences[section.id],
                    sectionOffset,
                )

                timetables.push(timetable)
            }

            // If everything succeeded, commit the transaction
            await transaction.commit()
            return timetables
        } catch (error) {
            // If any error occurred, rollback the transaction
            await transaction.rollback()
            console.error('Error generating timetable:', error) // Log the error
            // Re-throw the error so the caller knows something went wrong
            throw new Error(
                `Failed to generate timetable: ${error instanceof Error ? error.message : String(error)}`,
            )
        }
    }

    /**
     * Generates subject preferences for a specific section.
     * This creates variety between sections by assigning different
     * period preferences to subjects for each section.
     */
    private static async generateSectionSubjectPreferences(
        sectionId: number,
        transaction: Transaction,
    ): Promise<SubjectPeriodPreference> {
        const sectionTeachers = await SectionTeacher.findAll({
            where: { sectionId },
            include: [Subject],
            transaction,
        })

        const preferences: SubjectPeriodPreference = {}
        const periodsPerDay = 8 // Assuming max 8 periods per day

        sectionTeachers.forEach((st, index) => {
            // Assign different preferred periods for each subject
            // by staggering them across the day
            const preferredStart = ((index * 2) % periodsPerDay) + 1

            preferences[st.subjectId] = {
                preferredPeriods: [
                    preferredStart,
                    (preferredStart % periodsPerDay) + 1,
                    ((preferredStart + 2) % periodsPerDay) + 1,
                ].filter(p => p > 0 && p <= periodsPerDay), // Ensure periods are valid
                avoidPeriods: [
                    ((preferredStart + 4) % periodsPerDay) + 1,
                    ((preferredStart + 5) % periodsPerDay) + 1,
                ].filter(p => p > 0 && p <= periodsPerDay), // Ensure periods are valid
            }
        })

        return preferences
    }

    /**
     * Creates a timetable for a specific section.
     * @param classData - The class data.
     * @param section - The section for which to create the timetable.
     * @param config - Optional configuration for overrides.
     * @param transaction - The Sequelize transaction.
     * @param teacherAvailability - Shared record of teacher availability to prevent conflicts.
     * @param subjectPreferences - Subject period preferences for this section.
     * @param sectionOffset - Offset value to stagger patterns between sections.
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
        transaction: Transaction,
        // This is now the SHARED availability map
        teacherAvailability: { [teacherId: number]: TeacherAvailability },
        subjectPreferences: SubjectPeriodPreference,
        sectionOffset: number = 0,
    ) {
        // --- Input Validations ---
        if (!classData.periodsPerDay || classData.periodsPerDay <= 0) {
            throw new Error(
                `Invalid periods per day defined for class ${classData.id}`,
            )
        }
        if (!classData.periodLength || classData.periodLength <= 0) {
            throw new Error(
                `Invalid period length defined for class ${classData.id}`,
            )
        }

        // Fetch subject-teacher assignments for this section
        const sectionTeachers = await SectionTeacher.findAll({
            where: { sectionId: section.id },
            include: [Subject, Teacher],
            transaction,
        })

        if (sectionTeachers.length === 0) {
            console.warn(
                `No subject-teacher assignments found for section ${section.id} (Class ${classData.id}). Skipping timetable generation for this section.`,
            )
            // Return a placeholder or handle as needed, maybe throw error if required
            // For now, let's skip creating a timetable for this section to avoid errors later
            return null // Or throw new Error(...) if a section *must* have teachers
        }

        // --- Timetable Creation ---
        const timetable = await Timetable.create(
            {
                classId: classData.id,
                sectionId: section.id,
                periodsPerDay: classData.periodsPerDay,
                periodsPerDayOverrides: config?.periodsPerDayOverrides || {},
                breakStartTime: config?.breakStartTime,
                breakEndTime: config?.breakEndTime,
                // Assign a default teacher ID - maybe the class teacher if available?
                // Using the first section teacher as a fallback. Consider refining this.
                teacherId: sectionTeachers[0].teacherId,
            },
            { transaction },
        )

        // --- Scheduling Logic ---
        // Use only the working days from the class model
        const activeDays = classData.workingDays.filter(
            day =>
                // Keep only days that have periods (based on overrides or base value)
                (timetable.periodsPerDayOverrides?.[day] ??
                    timetable.periodsPerDay) > 0,
        )

        const totalPeriodsForSection = activeDays.reduce(
            (sum, day) =>
                sum +
                (timetable.periodsPerDayOverrides?.[day] ??
                    timetable.periodsPerDay),
            0,
        )

        // Ensure there are periods to schedule
        if (totalPeriodsForSection === 0) {
            console.warn(
                `Section ${section.id} has 0 periods to schedule. Skipping entry generation.`,
            )
            return timetable // Return the created timetable shell
        }

        // Determine subject distribution
        const subjectDistribution = this.calculateSubjectDistribution(
            sectionTeachers,
            totalPeriodsForSection,
            section.id,
            sectionOffset,
        )

        // Create pools for each day
        const subjectTeacherPoolsByDay: {
            [day: string]: SubjectTeacherPair[]
        } = {}
        activeDays.forEach(day => {
            subjectTeacherPoolsByDay[day] = this.createSubjectTeacherPool(
                sectionTeachers,
                subjectDistribution, // Use overall distribution
                day,
                section.id,
                subjectPreferences,
            )
            this.shuffleArray(subjectTeacherPoolsByDay[day]) // Shuffle each day's pool
        })

        const lastPeriodSubjectByDay: { [day: string]: number | null } = {}
        const subjectOccurrencesByDay: {
            [day: string]: { [subjectId: number]: number }
        } = {}

        activeDays.forEach(day => {
            lastPeriodSubjectByDay[day] = null
            subjectOccurrencesByDay[day] = {}
            sectionTeachers.forEach(st => {
                subjectOccurrencesByDay[day][st.subjectId] = 0
            })
        })

        const timetableEntries = []

        for (const day of activeDays) {
            const periodsForDay =
                timetable.periodsPerDayOverrides?.[day] ??
                timetable.periodsPerDay
            const dailyPool = [...subjectTeacherPoolsByDay[day]] // Copy pool for modification
            let assignedCount = 0

            for (
                let periodNumber = 1;
                periodNumber <= periodsForDay;
                periodNumber++
            ) {
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

                let bestOption: SubjectTeacherPair | null = null
                let bestScore = -Infinity
                let bestOptionIndex = -1

                // Find the best available option for this period
                for (let i = 0; i < dailyPool.length; i++) {
                    const pair = dailyPool[i]

                    // *** CORE CHANGE: Check SHARED teacherAvailability ***
                    const isTeacherAvailable =
                        teacherAvailability[pair.teacherId]?.[day]?.[
                            periodNumber
                        ] !== false // Defaults to true if not set

                    if (!isTeacherAvailable) {
                        continue // Skip if teacher is booked in another section
                    }

                    // Calculate score (similar logic as before)
                    let score = pair.weight
                    if (
                        subjectPreferences[
                            pair.subjectId
                        ]?.preferredPeriods.includes(periodNumber)
                    )
                        score += 3
                    if (
                        subjectPreferences[
                            pair.subjectId
                        ]?.avoidPeriods.includes(periodNumber)
                    )
                        score -= 2
                    if (
                        (subjectOccurrencesByDay[day][pair.subjectId] || 0) ===
                        0
                    )
                        score += 2
                    else if (
                        (subjectOccurrencesByDay[day][pair.subjectId] || 0) ===
                        1
                    )
                        score += 1
                    if (lastPeriodSubjectByDay[day] === pair.subjectId)
                        score -= 5 // Avoid consecutive

                    if (score > bestScore) {
                        bestScore = score
                        bestOption = pair
                        bestOptionIndex = i
                    }
                }

                // If no suitable option found from the pool, try fallback
                if (!bestOption) {
                    console.warn(
                        `[${day} P${periodNumber} S${section.id}] No ideal subject found. Trying fallback.`,
                    )
                    // Fallback: Find *any* teacher assigned to this section who is available
                    const availableSectionTeachers = sectionTeachers.filter(
                        st =>
                            teacherAvailability[st.teacherId]?.[day]?.[
                                periodNumber
                            ] !== false,
                    )

                    if (availableSectionTeachers.length > 0) {
                        // Prioritize teachers whose subjects haven't been taught yet today or least taught
                        availableSectionTeachers.sort(
                            (a, b) =>
                                (subjectOccurrencesByDay[day][a.subjectId] ||
                                    0) -
                                (subjectOccurrencesByDay[day][b.subjectId] ||
                                    0),
                        )
                        const fallbackTeacher = availableSectionTeachers[0]
                        bestOption = {
                            subjectId: fallbackTeacher.subjectId,
                            teacherId: fallbackTeacher.teacherId,
                            sectionTeacherId: fallbackTeacher.id,
                            weight: -10, // Indicate fallback
                        }
                        console.log(
                            `Fallback assigned: T${bestOption.teacherId} Sub${bestOption.subjectId}`,
                        )
                    } else {
                        // VERY BAD SCENARIO: No teacher available AT ALL for this slot.
                        // This indicates a fundamental scheduling conflict (e.g., not enough teachers).
                        console.error(
                            `[${day} P${periodNumber} S${section.id}] CRITICAL: No available teacher found for this slot! Skipping period.`,
                        )
                        // Skip creating an entry for this period? Or assign a placeholder?
                        // Skipping for now. This needs careful consideration based on requirements.
                        continue // Skip to the next period
                    }
                }

                // Assign the chosen option
                const assignedPair = bestOption

                // *** CORE CHANGE: Mark teacher as unavailable in SHARED map ***
                if (!teacherAvailability[assignedPair.teacherId])
                    teacherAvailability[assignedPair.teacherId] = {}
                if (!teacherAvailability[assignedPair.teacherId][day])
                    teacherAvailability[assignedPair.teacherId][day] = {}
                teacherAvailability[assignedPair.teacherId][day][periodNumber] =
                    false // Mark as booked

                // Update tracking
                lastPeriodSubjectByDay[day] = assignedPair.subjectId
                subjectOccurrencesByDay[day][assignedPair.subjectId] =
                    (subjectOccurrencesByDay[day][assignedPair.subjectId] ||
                        0) + 1

                // Remove used option from the daily pool if it wasn't a fallback generated on the spot
                if (bestOptionIndex !== -1) {
                    dailyPool.splice(bestOptionIndex, 1)
                }

                // Create the timetable entry
                const entry = {
                    // Create as object first for bulkCreate later
                    timetableId: timetable.id,
                    sectionId: section.id,
                    dayOfWeek: day,
                    classId: classData.id,
                    periodNumber,
                    subjectId: assignedPair.subjectId,
                    teacherId: assignedPair.teacherId,
                    startTime,
                    endTime,
                }
                timetableEntries.push(entry)
                assignedCount++
            }

            // Log if not all periods were assigned (due to critical conflicts)
            if (assignedCount < periodsForDay) {
                console.warn(
                    `[${day} S${section.id}] Only ${assignedCount}/${periodsForDay} periods were assigned due to conflicts.`,
                )
            }
        }

        // Bulk create entries for efficiency
        if (timetableEntries.length > 0) {
            await TimetableEntry.bulkCreate(timetableEntries, { transaction })
        }

        // No need to update timetable here, bulkCreate handles entries
        return timetable
    }

    /**
     * Calculates how many periods each subject should have based on importance
     * and total available periods. Now section-specific for variety.
     */
    private static calculateSubjectDistribution(
        sectionTeachers: SectionTeacher[],
        totalPeriods: number,
        sectionId: number,
        sectionOffset: number,
    ): SubjectDistribution {
        const distribution: SubjectDistribution = {}
        if (sectionTeachers.length === 0 || totalPeriods <= 0) {
            return distribution // Avoid division by zero or pointless calculation
        }

        // Base distribution values
        const basePeriodsPerSubject = Math.max(
            0,
            Math.floor(totalPeriods / sectionTeachers.length),
        )
        let remainingPeriods = Math.max(
            0,
            totalPeriods - basePeriodsPerSubject * sectionTeachers.length,
        )

        const subjectOrder = [...sectionTeachers]
        // Stable sort based on section variance logic
        subjectOrder.sort((a, b) => {
            const valA = (a.subjectId * 3 + sectionId + sectionOffset * 2) % 101
            const valB = (b.subjectId * 3 + sectionId + sectionOffset * 2) % 101
            if (valA !== valB) return valA - valB
            return a.subjectId - b.subjectId // Tie-breaker
        })

        // Initial distribution
        subjectOrder.forEach(st => {
            distribution[st.subjectId] = basePeriodsPerSubject
        })

        // Distribute remaining periods giving priority based on the sorted order
        let i = 0
        while (remainingPeriods > 0 && i < subjectOrder.length) {
            distribution[subjectOrder[i].subjectId]++
            remainingPeriods--
            i++
        }

        // Sanity check: Log if distribution doesn't match total periods (can happen with rounding)
        const distributedTotal = Object.values(distribution).reduce(
            (sum, count) => sum + count,
            0,
        )
        if (distributedTotal !== totalPeriods && sectionTeachers.length > 0) {
            console.warn(
                `Section ${sectionId}: Subject distribution total (${distributedTotal}) does not match target periods (${totalPeriods}). Adjusting...`,
            )
            // Simple adjustment: add/remove from the first subject in the order
            const diff = totalPeriods - distributedTotal
            if (subjectOrder.length > 0) {
                distribution[subjectOrder[0].subjectId] = Math.max(
                    0,
                    distribution[subjectOrder[0].subjectId] + diff,
                )
            }
        }

        return distribution
    }

    /**
     * Creates a pool of subject-teacher pairs based on the desired distribution.
     * Incorporates day-specific and section-specific weighting for variety.
     */
    private static createSubjectTeacherPool(
        sectionTeachers: SectionTeacher[],
        distribution: SubjectDistribution,
        day: string,
        sectionId: number,
        preferences: SubjectPeriodPreference,
    ): SubjectTeacherPair[] {
        const pool: SubjectTeacherPair[] = []

        const dayWeights: { [key: string]: number } = {
            Monday: 1.2,
            Tuesday: 1.0,
            Wednesday: 0.9,
            Thursday: 1.1,
            Friday: 1.0,
            Saturday: 0.7,
            Sunday: 0.5, // Lower weights for weekends if applicable
        }
        const dayFactor = dayWeights[day] || 1.0 // Default factor

        sectionTeachers.forEach(st => {
            // Calculate target count for this subject *on this day*
            // This is tricky; the distribution is weekly. Let's aim for roughly distribution / active_days
            const approxPeriodsPerDay = (distribution[st.subjectId] || 0) / 5 // Assume 5 active days roughly
            const count = Math.max(
                0,
                Math.round(approxPeriodsPerDay * dayFactor),
            ) // Allow 0 periods

            // Calculate base weight with section variance
            let baseWeight = 10 + ((st.subjectId + sectionId * 2) % 7) // Vary weight by section

            // Adjust weight based on day - prioritize certain subjects on certain days
            const dayIndex = [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
            ].indexOf(day)
            if (dayIndex !== -1) {
                // Only apply for weekdays perhaps
                // Example: Prioritize core subjects (e.g., low subject IDs) early week
                if (st.subjectId < 5 && dayIndex < 2) baseWeight += 3
                // Example: Prioritize other subjects later in week
                if (st.subjectId >= 5 && dayIndex > 2) baseWeight += 2
            }

            for (let i = 0; i < count; i++) {
                pool.push({
                    subjectId: st.subjectId,
                    teacherId: st.teacherId,
                    sectionTeacherId: st.id,
                    weight: baseWeight + Math.random() * 0.1, // Add small random jitter
                })
            }
        })

        // Ensure the pool isn't excessively large or small compared to periods needed
        // This part needs refinement based on how many periods are expected per day vs weekly total

        return pool
    }

    /**
     * Shuffles an array in-place using the Fisher-Yates algorithm.
     */
    private static shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
    }

    /**
     * Calculates the start time for a period, considering breaks.
     */
    private static calculateStartTime(
        day: string, // Keep day for potential future day-specific start times
        periodNumber: number,
        timetable: Timetable,
        periodLength: number,
    ): string {
        if (periodNumber <= 0) throw new Error('Invalid period number')

        // Use a fixed start time for simplicity, e.g., 08:00
        // Could be made configurable per class/school later
        const schoolStartTime = '08:00'
        let currentMinutes = this.timeToMinutes(schoolStartTime)
        const breakStartMinutes = timetable.breakStartTime
            ? this.timeToMinutes(timetable.breakStartTime)
            : null
        const breakEndMinutes = timetable.breakEndTime
            ? this.timeToMinutes(timetable.breakEndTime)
            : null
        let breakDuration = 0

        if (
            breakStartMinutes !== null &&
            breakEndMinutes !== null &&
            breakEndMinutes > breakStartMinutes
        ) {
            breakDuration = breakEndMinutes - breakStartMinutes
        } else if (breakStartMinutes || breakEndMinutes) {
            console.warn('Incomplete or invalid break time configuration.')
        }

        for (let p = 1; p < periodNumber; p++) {
            const periodStartMinutes = currentMinutes
            const periodEndMinutes = currentMinutes + periodLength

            // Check if the *start* of the break falls within this period we just added
            if (
                breakDuration > 0 &&
                breakStartMinutes !== null &&
                breakStartMinutes >= periodStartMinutes &&
                breakStartMinutes < periodEndMinutes
            ) {
                // Period spans the break start time, add break duration *after* this period
                currentMinutes += periodLength + breakDuration
            } else {
                // No break interference in this period
                currentMinutes += periodLength
            }
        }

        return this.minutesToTime(currentMinutes)
    }

    /**
     * Calculates the end time for a period based on start time and length.
     */
    private static calculateEndTime(
        startTime: string,
        periodLength: number,
    ): string {
        if (periodLength <= 0) throw new Error('Invalid period length')
        const startMinutes = this.timeToMinutes(startTime)
        return this.minutesToTime(startMinutes + periodLength)
    }

    /** Converts "HH:MM" to total minutes from midnight. */
    private static timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number)
        if (isNaN(hours) || isNaN(minutes))
            throw new Error(`Invalid time format: ${time}`)
        return hours * 60 + minutes
    }

    /** Converts total minutes from midnight to "HH:MM". */
    private static minutesToTime(totalMinutes: number): string {
        if (totalMinutes < 0) throw new Error('Cannot represent negative time')
        const hours = Math.floor(totalMinutes / 60) % 24 // Handle potential overflow past midnight if needed
        const minutes = totalMinutes % 60
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }

    // --- Fetching Methods ---

    /**
     * Fetches the timetable for a specific class and section.
     */
    static async getTimetable(classId: number, sectionId: number) {
        if (!classId || classId <= 0 || !sectionId || sectionId <= 0) {
            throw new Error('Invalid class or section ID provided')
        }

        return Timetable.findOne({
            where: { classId, sectionId },
            include: [
                {
                    model: TimetableEntry,
                    include: [Subject, Teacher],
                },
                Section,
                Class,
                Teacher,
            ],
        })
    }

    /**
     * Fetches all timetables with entries for a specific class.
     */
    static async getTimetablesByClass(classId: number) {
        if (!classId || classId <= 0) {
            throw new Error('Invalid class ID provided')
        }

        return Timetable.findAll({
            where: { classId },
            include: [
                {
                    model: TimetableEntry,
                    include: [Subject, Teacher],
                },
                Section,
                Class,
                Teacher,
            ],
        })
    }

    /**
     * Fetches all timetable entries for a specific teacher.
     * This helps a teacher view their schedule across all sections/classes.
     */
    static async getTeacherTimetable(teacherId: number) {
        if (!teacherId || teacherId <= 0) {
            throw new Error('Invalid teacher ID provided')
        }

        return TimetableEntry.findAll({
            where: { teacherId },
            include: [
                {
                    model: Timetable,
                    include: [Section, Teacher],
                },
                Subject,
                Class,
                Section,
            ],
            order: [
                ['dayOfWeek', 'ASC'],
                ['periodNumber', 'ASC'],
            ],
        })
    }
}
