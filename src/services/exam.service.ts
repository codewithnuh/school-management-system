import { Section, Class, Exam } from '@/models/index.js'
import sequelize from '@/config/database.js'
import { ExamAttributes, ExamSchema } from '@/schema/exam.schema.js'
export class ExamService {
    /**
     * Creates a new exam.
     * @param data - Exam creation data.
     * @returns The created exam.
     */
    static async createExam(data: ExamAttributes) {
        const transaction = await sequelize.transaction()
        try {
            // Validate class and section (if provided)
            const classExists = await Class.findByPk(data.classId, {
                transaction,
            })
            if (!classExists) throw new Error('Class not found')

            if (data.sectionId) {
                const sectionExists = await Section.findByPk(data.sectionId, {
                    transaction,
                })
                if (!sectionExists) throw new Error('Section not found')
            }
            const validatedExamData = ExamSchema.parse(data)
            // Create the exam
            const exam = await Exam.create(validatedExamData, { transaction })
            await transaction.commit()
            return exam
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    /**
     * Fetches all exams.
     * @returns A list of exams.
     */
    static async getAllExams() {
        return Exam.findAll({
            include: [{ model: Class }, { model: Section }],
        })
    }

    /**
     * Fetches an exam by ID.
     * @param id - The ID of the exam.
     * @returns The exam details.
     */
    static async getExamById(id: number) {
        const exam = await Exam.findByPk(id, {
            include: [{ model: Class }, { model: Section }],
        })
        if (!exam) throw new Error('Exam not found')
        return exam
    }

    /**
     * Updates an exam.
     * @param id - The ID of the exam.
     * @param data - Updated exam data.
     * @returns The updated exam.
     */
    static async updateExam(id: number, data: ExamAttributes) {
        const transaction = await sequelize.transaction()
        try {
            const exam = await Exam.findByPk(id, { transaction })
            if (!exam) throw new Error('Exam not found')

            // Update exam details
            const validatedExamData = ExamSchema.parse(data)
            await exam.update(validatedExamData, { transaction })
            await transaction.commit()
            return exam
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    /**
     * Deletes an exam.
     * @param id - The ID of the exam.
     */
    static async deleteExam(id: number) {
        const transaction = await sequelize.transaction()
        try {
            const exam = await Exam.findByPk(id, { transaction })
            if (!exam) throw new Error('Exam not found')

            await exam.destroy({ transaction })
            await transaction.commit()
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}
