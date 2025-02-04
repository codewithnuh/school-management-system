import {
    ExamSubject,
    Exam,
    Subject,
    SubjectAttributes,
} from '@/models/index.js'
import sequelize from '@/config/database.js'
import { ExamSubjectSchema } from '@/schema/examSubject.schema.js'
export class ExamSubjectService {
    /**
     * Assigns subjects to an exam.
     * @param examId - The ID of the exam.
     * @param subjects - Array of subjects with maxMarks and passMarks.
     * @returns The assigned subjects.
     */
    static async assignSubjectsToExam(
        examId: number,
        subjects: SubjectAttributes[],
        maxMarks: number,
        passMarks: number,
    ) {
        const transaction = await sequelize.transaction()
        try {
            const exam = await Exam.findByPk(examId, { transaction })
            if (!exam) throw new Error('Exam not found')

            const assignedSubjects = []
            for (const subject of subjects) {
                const subjectExists = await Subject.findByPk(subject.id, {
                    transaction,
                })
                if (!subjectExists)
                    throw new Error(`Subject with ID ${subject.id} not found`)
                const validatedData = ExamSubjectSchema.parse({
                    examId,
                    subjectId: subject.id!,
                    maxMarks,
                    passMarks,
                })
                if (!validatedData) {
                    throw new Error('Invalid data')
                }
                const examSubject = await ExamSubject.create(validatedData, {
                    transaction,
                })
                assignedSubjects.push(examSubject)
            }

            await transaction.commit()
            return assignedSubjects
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    /**
     * Fetches all subjects assigned to an exam.
     * @param examId - The ID of the exam.
     * @returns A list of assigned subjects.
     */
    static async getSubjectsForExam(examId: number) {
        return ExamSubject.findAll({
            where: { examId },
            include: [Subject],
        })
    }

    /**
     * Removes a subject from an exam.
     * @param examId - The ID of the exam.
     * @param subjectId - The ID of the subject.
     */
    static async removeSubjectFromExam(examId: number, subjectId: number) {
        const transaction = await sequelize.transaction()
        try {
            const examSubject = await ExamSubject.findOne({
                where: { examId, subjectId },
                transaction,
            })
            if (!examSubject)
                throw new Error('Subject not assigned to this exam')

            await examSubject.destroy({ transaction })
            await transaction.commit()
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}
