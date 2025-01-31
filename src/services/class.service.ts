import { Class } from '../models/Class'
import { z } from 'zod'

export const UpdatePeriodsSchema = z.object({
    periodsPerDay: z.number().min(1).max(10), // Example: Max 10 periods per day
})

export type UpdatePeriodsInput = z.infer<typeof UpdatePeriodsSchema>

export class ClassService {
    /**
     * Update the number of periods per day for a class
     */
    static async updatePeriodsPerDay(
        classId: number,
        input: UpdatePeriodsInput,
    ): Promise<Class> {
        const { periodsPerDay } = input

        const classDetails = await Class.findByPk(classId)
        if (!classDetails) throw new Error('Class not found')

        classDetails.periodsPerDay = periodsPerDay
        await classDetails.save()

        return classDetails
    }

    /**
     * Get class details by ID
     */
    static async getClassById(classId: number): Promise<Class | null> {
        return await Class.findByPk(classId)
    }

    /**
     * Create a new class
     */
    static async createClass(
        name: string,
        periodsPerDay: number,
    ): Promise<Class> {
        return await Class.create({
            name,
            periodsPerDay,
            description: '',
            maxStudents: 50,
        })
    }
}
