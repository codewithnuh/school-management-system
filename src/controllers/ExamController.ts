import { Request, Response } from 'express'
import { ExamService } from '@/services/exam.service.js'
import { ExamAttributes, examSchema } from '@/models/Exam.js' // Correct import for ExamAttributes and examSchema from '@/models/Exam.js'
import { ResponseUtil } from '@/utils/response.util.js'
import { Exam } from '@/models/Exam.js' // Correct import for Exam model from '@/models/Exam.js'

export class ExamController {
    /**
     * Securely creates a new exam.
     * In case of an error, a generic error message is returned while detailed error logging is performed internally.
     *
     * @param req - The incoming request object
     * @param res - The response object used to return the results
     */
    public static async createExam(req: Request, res: Response): Promise<void> {
        try {
            // Parse and validate data. ExamSchema.parse will throw if invalid.
            const validatedData = examSchema.parse(req.body) as ExamAttributes // Type assertion here

            // **Transform validatedData to match ExamAttributes type**
            const examInput: ExamAttributes = {
                examName: validatedData.examName,
                classId: validatedData.classId,
                examType: validatedData.examType,
                examDate: validatedData.examDate,
                academicYear: validatedData.academicYear,
                sectionId: validatedData.sectionId,
                totalMarks: validatedData.totalMarks, // Get totalMarks from validatedData
                passingMarks: validatedData.passingMarks, // Get passingMarks from validatedData
                description: validatedData.description, // Get description from validatedData
                isPublished:
                    validatedData.isPublished !== undefined
                        ? validatedData.isPublished
                        : false, // Get isPublished from validatedData or default to false
            }

            const exam = await ExamService.createExam(examInput)
            const response = ResponseUtil.success<Exam>( // Specify type for success response
                exam,
                'Exam created successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            // Use unknown for catch errors
            // Log the detailed error internally for diagnostics.
            console.error('Error during exam creation:', error)
            // Return a generic error message to the client.
            const genericMessage =
                'Exam creation failed. Please verify your input and try again.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Fetches all exams.
     *
     * @param req - The request object
     * @param res - The response object
     */
    public static async getAllExams(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const exams = await ExamService.getAllExams()
            const response = ResponseUtil.success<Exam[]>( // Specify type for success response
                exams,
                'Exams retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            // Use unknown for catch errors
            // Log detailed error for internal diagnostics.
            console.error('Error fetching all exams:', error)
            // Return a generic error message to the client.
            const genericMessage =
                'Failed to retrieve exams. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 500)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Fetches an exam by ID.
     *
     * @param req - The request object
     * @param res - The response object
     */
    public static async getExamById(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const examId = parseInt(id, 10)
            if (isNaN(examId)) throw new Error('Invalid exam ID')

            const exam = await ExamService.getExamById(examId)
            const response = ResponseUtil.success<Exam | null>( // Specify type for success response, can be null
                exam,
                'Exam retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            // Use unknown for catch errors
            console.error('Error fetching exam by ID:', error)
            // Use a generic error message without revealing whether the exam exists or not.
            const genericMessage =
                'Failed to retrieve exam. Please verify your request.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    /**
     * Updates an exam.
     *
     * @param req - The request object
     * @param res - The response object
     */
    public static async updateExam(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const examId = parseInt(id, 10)
            if (isNaN(examId)) throw new Error('Invalid exam ID')

            const validatedData = examSchema.parse(req.body) as ExamAttributes

            const examInput: ExamAttributes = {
                examName: validatedData.examName,
                classId: validatedData.classId,
                examType: validatedData.examType,
                examDate: validatedData.examDate,
                academicYear: validatedData.academicYear,
                sectionId: validatedData.sectionId,
                totalMarks: validatedData.totalMarks,
                passingMarks: validatedData.passingMarks,
                description: validatedData.description,
                isPublished: validatedData.isPublished,
            }

            const updatedExam = await ExamService.updateExam(
                // Change type to number
                examId,
                examInput,
            )
            const response = ResponseUtil.success(
                // Change type to number in ResponseUtil.success
                updatedExam,
                'Exam updated successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error during exam update:', error)
            const genericMessage =
                'Exam update failed. Please ensure your input is correct and try again.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }
    /**
     * Deletes an exam.
     *
     * @param req - The request object
     * @param res - The response object
     */
    public static async deleteExam(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const examId = parseInt(id, 10)
            if (isNaN(examId)) throw new Error('Invalid exam ID')

            const deletedExamCount = await ExamService.deleteExam(examId) // Capture the count of deleted exams
            const response = ResponseUtil.success<number>( // Specify type for success response as number (count)
                deletedExamCount,
                'Exam deleted successfully',
                204, // 204 No Content for successful deletion
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            // Use unknown for catch errors
            console.error('Error during exam deletion:', error)
            // Return a generic message for deletion failures.
            const genericMessage =
                'Exam deletion failed. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }
}
