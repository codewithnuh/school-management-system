import { Request, Response } from 'express'
import { ExamSubjectService } from '@/services/examSubject.service.js'
import { ResponseUtil } from '@/utils/response.util.js'
import { SubjectAttributes } from '@/models'

export class ExamSubjectController {
    /**
     * Assigns subjects to an exam.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async assignSubjectsToExam(req: Request, res: Response) {
        console.log('exam-subjects route')
        try {
            const { examId } = req.params
            const examIdNumber = parseInt(examId, 10)
            if (isNaN(examIdNumber)) throw new Error('Invalid exam ID')

            const subjects = req.body.subjects.map(
                (subject: SubjectAttributes) => ({
                    name: subject.name,
                    id: subject.id,
                    description: subject.description,
                }),
            )

            const assignedSubjects =
                await ExamSubjectService.assignSubjectsToExam(
                    examIdNumber,
                    subjects,
                    req.body.maxMarks,
                    req.body.passMarks,
                )
            const response = ResponseUtil.success(
                assignedSubjects,
                'Subjects assigned to exam successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(response.statusCode).json(response)
            }
        }
    }

    /**
     * Fetches all subjects assigned to an exam.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async getSubjectsForExam(req: Request, res: Response) {
        try {
            const { examId } = req.params
            const examIdNumber = parseInt(examId, 10)
            if (isNaN(examIdNumber)) throw new Error('Invalid exam ID')

            const subjects =
                await ExamSubjectService.getSubjectsForExam(examIdNumber)
            const response = ResponseUtil.success(
                subjects,
                'Subjects retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(response.statusCode).json(response)
            }
        }
    }

    /**
     * Removes a subject from an exam.
     * @param req - The request object.
     * @param res - The response object.
     */
    public static async removeSubjectFromExam(req: Request, res: Response) {
        try {
            const { examId, subjectId } = req.params
            const examIdNumber = parseInt(examId, 10)
            const subjectIdNumber = parseInt(subjectId, 10)

            if (isNaN(examIdNumber) || isNaN(subjectIdNumber))
                throw new Error('Invalid IDs')

            await ExamSubjectService.removeSubjectFromExam(
                examIdNumber,
                subjectIdNumber,
            )
            const response = ResponseUtil.success(
                null,
                'Subject removed from exam successfully',
                204,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message, 400)
                res.status(response.statusCode).json(response)
            }
        }
    }
}
