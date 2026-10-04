import type { WhereOptions } from 'sequelize'
import { Exam, type ExamAttributes, ExamSchema } from '@/models/Exam.js'
import { Teacher } from '@/models/Teacher.js'
import { User } from '@/models/User.js'
import type { SessionEntityType } from '@/models/Session.js'

export class ExamService {
    static async getSchoolIdForPrincipal(
        userId: number,
        entityType: SessionEntityType,
    ): Promise<number | null> {
        if (entityType === 'TEACHER') {
            const teacher = await Teacher.findByPk(userId, {
                attributes: ['schoolId'],
            })
            return teacher?.schoolId ?? null
        }

        const user = await User.findByPk(userId, {
            attributes: ['schoolId'],
        })
        return user?.schoolId ?? null
    }

    static async createExam(schoolId: number, input: unknown): Promise<Exam> {
        const examInput = ExamSchema.omit({ schoolId: true }).parse(input)
        return Exam.create({ ...examInput, schoolId })
    }

    static async getAllExams(schoolId: number): Promise<Exam[]> {
        const where: WhereOptions<ExamAttributes> = { schoolId }
        return Exam.findAll({ where, order: [['startDate', 'DESC']] })
    }

    static async getExamById(id: number, schoolId: number): Promise<Exam | null> {
        const where: WhereOptions<ExamAttributes> = { id, schoolId }
        return Exam.findOne({ where })
    }

    static async updateExam(
        id: number,
        input: unknown,
        schoolId: number,
    ): Promise<Exam | null> {
        const data = ExamSchema.omit({ schoolId: true }).partial().parse(input)
        const exam = await this.getExamById(id, schoolId)
        if (!exam) return null
        await exam.update(data)
        return exam
    }

    static async deleteExam(id: number, schoolId: number): Promise<number> {
        const where: WhereOptions<ExamAttributes> = { id, schoolId }
        return Exam.destroy({ where })
    }
}
