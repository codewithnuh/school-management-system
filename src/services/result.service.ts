import { Result, ExamSubject, User, Grade } from '@/models/index.js'
import sequelize from '@/config/database.js'
import { Op } from 'sequelize'
import { ResultAttributes, ResultSchema } from '../schema/result.schema.js'

export class ResultService {
    /**
     * Records marks for a student in an exam subject.
     * @param data - Result data (studentId, examSubjectId, marksObtained).
     * @returns The recorded result.
     */
    static async recordMarks(data: ResultAttributes) {
        const transaction = await sequelize.transaction()
        try {
            const { studentId, examSubjectId, marksObtained } = data

            // Validate student, exam subject, and marks
            const student = await User.findByPk(studentId, { transaction })
            if (!student) throw new Error('Student not found')

            const examSubject = await ExamSubject.findByPk(examSubjectId, {
                transaction,
            })
            if (!examSubject) throw new Error('Exam subject not found')

            if (marksObtained > examSubject.maxMarks) {
                throw new Error('Marks obtained exceed maximum marks')
            }
            const validatedData = ResultSchema.parse(data)
            if (!validatedData) throw new Error('Invalid Data')
            // Record the result
            const result = await Result.create(validatedData, { transaction })
            await transaction.commit()
            return result
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    /**
     * Fetches results for a specific student.
     * @param studentId - The ID of the student.
     * @returns A list of results.
     */
    static async getResultsForStudent(studentId: number) {
        return Result.findAll({
            where: { studentId },
            include: [ExamSubject],
        })
    }

    /**
     * Fetches results for a specific exam.
     * @param examId - The ID of the exam.
     * @returns A list of results.
     */
    static async getResultsForExam(examId: number) {
        return Result.findAll({
            include: [
                {
                    model: ExamSubject,
                    where: { examId },
                    include: [User],
                },
            ],
        })
    }

    /**
     * Calculates grades for a result based on marks obtained.
     * @param marksObtained - Marks obtained by the student.
     * @returns The grade.
     */
    static async calculateGrade(marksObtained: number) {
        const grade = await Grade.findOne({
            where: {
                minMarks: { [Op.lte]: marksObtained },
                maxMarks: { [Op.gte]: marksObtained },
            },
        })
        if (!grade)
            throw new Error('No grade criteria found for the given marks')
        return grade.grade
    }
}
