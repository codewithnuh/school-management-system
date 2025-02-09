import { Result } from '@/models/Result.js' // Adjust path if necessary
import { ResultAttributes } from '@/models/Result.js' // Adjust path if necessary
import { ResultSchema } from '@/schema/result.schema.js' // Adjust path if necessary
import { Exam } from '@/models/Exam.js' // Adjust path if necessary
import { User } from '@/models/index.js'

export class ResultService {
    /**
     * Creates a new exam result.
     * Validates input and handles database interaction.
     *
     * @param input - Data to create a new result, conforming to ResultAttributes
     * @returns The newly created Result instance.
     * @throws Error if validation fails or database operation fails.
     */
    public static async createResult(input: ResultAttributes): Promise<Result> {
        try {
            ResultSchema.parse(input) // Validate input against schema
            const newResult = await Result.create(input)
            return newResult
        } catch (error: unknown) {
            console.error('Error creating result:', error)
            throw error // Re-throw to be caught by the controller
        }
    }

    /**
     * Fetches all exam results.
     *
     * @returns Array of all Result instances.
     * @throws Error if database operation fails.
     */
    public static async getAllResults(): Promise<Result[]> {
        try {
            const results = await Result.findAll({
                include: [
                    { model: User, as: 'student' }, // Assuming you have associations defined
                    { model: Exam, as: 'exam' }, // Assuming you have associations defined
                ],
            })
            return results
        } catch (error: unknown) {
            console.error('Error fetching all results:', error)
            throw error
        }
    }

    /**
     * Fetches a result by its unique ID.
     *
     * @param resultId - The ID of the result to fetch.
     * @returns The Result instance if found, null otherwise.
     * @throws Error if database operation fails.
     */
    public static async getResultById(
        resultId: number,
    ): Promise<Result | null> {
        try {
            const result = await Result.findByPk(resultId, {
                include: [
                    { model: User, as: 'student' },
                    { model: Exam, as: 'exam' },
                ],
            })
            return result
        } catch (error: unknown) {
            console.error(`Error fetching result by ID ${resultId}:`, error)
            throw error
        }
    }

    /**
     * Fetches all results for a specific student.
     *
     * @param studentId - The ID of the student.
     * @returns Array of Result instances for the student.
     * @throws Error if database operation fails.
     */
    public static async getResultsByStudentId(
        studentId: number,
    ): Promise<Result[]> {
        try {
            const results = await Result.findAll({
                where: { studentId },
                include: [{ model: Exam, as: 'exam' }],
            })
            return results
        } catch (error: unknown) {
            console.error(
                `Error fetching results for student ID ${studentId}:`,
                error,
            )
            throw error
        }
    }

    /**
     * Fetches all results for a specific exam.
     *
     * @param examId - The ID of the exam.
     * @returns Array of Result instances for the exam.
     * @throws Error if database operation fails.
     */
    public static async getResultsByExamId(examId: number): Promise<Result[]> {
        try {
            const results = await Result.findAll({
                where: { examId },
                include: [{ model: User, as: 'student' }],
            })
            return results
        } catch (error: unknown) {
            console.error(
                `Error fetching results for exam ID ${examId}:`,
                error,
            )
            throw error
        }
    }

    /**
     * Updates an existing exam result.
     *
     * @param resultId - The ID of the result to update.
     * @param updates - An object containing the fields to update and their new values.
     * @returns The number of affected rows (usually 1 if successful).
     * @throws Error if validation fails or database operation fails.
     */
    public static async updateResult(
        resultId: number,
        updates: Partial<ResultAttributes>,
    ): Promise<number> {
        try {
            // Fetch the existing result to validate updates against schema (optional, but good practice)
            const existingResult = await ResultService.getResultById(resultId)
            if (!existingResult) {
                throw new Error(`Result with ID ${resultId} not found`) // Or handle not found appropriately
            }

            const validatedUpdates = ResultSchema.partial().parse(updates) // Validate updates - using partial schema for updates

            const [affectedRows] = await Result.update(validatedUpdates, {
                where: { resultId },
            })
            return affectedRows
        } catch (error: unknown) {
            console.error(`Error updating result ID ${resultId}:`, error)
            throw error
        }
    }

    /**
     * Deletes an exam result by ID.
     *
     * @param resultId - The ID of the result to delete.
     * @returns The number of deleted rows (usually 1 if successful).
     * @throws Error if database operation fails.
     */
    public static async deleteResult(resultId: number): Promise<number> {
        try {
            const deletedRows = await Result.destroy({
                where: { resultId },
            })
            return deletedRows
        } catch (error: unknown) {
            console.error(`Error deleting result ID ${resultId}:`, error)
            throw error
        }
    }
}
