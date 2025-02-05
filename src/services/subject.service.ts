import { Subject, SubjectAttributes } from '@/models/Subject.js'
import { z } from 'zod'

export class SubjectService {
    /**
     * Creates a new subject.
     * @param data - The subject data to create.
     * @returns The created subject.
     */
    public static async createSubject(data: Omit<SubjectAttributes, 'id'>) {
        try {
            // Validate the input data using Zod schema
            const validatedData = Subject.validateSubject(data)

            // Create the subject in the database
            const subject = await Subject.create(validatedData)
            return subject
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(
                    `Validation error: ${error.errors.map(e => e.message).join(', ')}`,
                )
            }
            throw error
        }
    }

    /**
     * Retrieves a subject by its ID.
     * @param id - The ID of the subject to retrieve.
     * @returns The subject if found.
     * @throws Error if the subject is not found.
     */
    public static async getSubjectById(id: number) {
        const subject = await Subject.findByPk(id)
        if (!subject) {
            throw new Error('Subject not found')
        }
        return subject
    }

    /**
     * Retrieves all subjects.
     * @returns A list of all subjects.
     */
    public static async getAllSubjects() {
        const subjects = await Subject.findAll()
        return subjects
    }

    /**
     * Updates an existing subject.
     * @param id - The ID of the subject to update.
     * @param data - The updated subject data.
     * @returns The updated subject.
     */
    public static async updateSubject(
        id: number,
        data: Partial<SubjectAttributes>,
    ) {
        try {
            // Validate the input data using Zod schema
            const validatedData = Subject.validateSubject(data)

            // Update the subject in the database
            const [updatedRowsCount] = await Subject.update(validatedData, {
                where: { id },
            })

            if (updatedRowsCount === 0) {
                throw new Error('Subject not found or no changes were made')
            }

            // Fetch and return the updated subject
            const updatedSubject = await Subject.findByPk(id)
            if (!updatedSubject) {
                throw new Error('Subject not found after update')
            }
            return updatedSubject
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(
                    `Validation error: ${error.errors.map(e => e.message).join(', ')}`,
                )
            }
            throw error
        }
    }

    /**
     * Deletes a subject by its ID.
     * @param id - The ID of the subject to delete.
     * @returns The deleted subject.
     * @throws Error if the subject is not found.
     */
    public static async deleteSubject(id: number) {
        const subject = await Subject.findByPk(id)
        if (!subject) {
            throw new Error('Subject not found')
        }
        await subject.destroy()
        return subject
    }
}
