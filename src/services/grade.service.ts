import { Grade } from '@/models/index.js'
import sequelize from '@/config/database.js'
import { GradeAttributes, GradeSchema } from '@/schema/grade.schema.js'

export class GradeService {
    /**
     * Adds a new grade criterion.
     * @param data - Grade data (grade, minMarks, maxMarks).
     * @returns The created grade.
     */
    static async addGrade(data: GradeAttributes) {
        const transaction = await sequelize.transaction()
        try {
            const grade = await Grade.create(data, { transaction })
            await transaction.commit()
            return grade
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    /**
     * Fetches all grade criteria.
     * @returns A list of grades.
     */
    static async getAllGrades() {
        return Grade.findAll()
    }

    /**
     * Updates a grade criterion.
     * @param id - The ID of the grade.
     * @param data - Updated grade data.
     * @returns The updated grade.
     */
    static async updateGrade(id: number, data: GradeAttributes) {
        const transaction = await sequelize.transaction()
        try {
            const grade = await Grade.findByPk(id, { transaction })
            if (!grade) throw new Error('Grade not found')
            const validatedData = GradeSchema.parse(data)
            if (!validatedData) throw new Error('Invalid Data')
            await grade.update(validatedData, { transaction })
            await transaction.commit()
            return grade
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    /**
     * Deletes a grade criterion.
     * @param id - The ID of the grade.
     */
    static async deleteGrade(id: number) {
        const transaction = await sequelize.transaction()
        try {
            const grade = await Grade.findByPk(id, { transaction })
            if (!grade) throw new Error('Grade not found')

            await grade.destroy({ transaction })
            await transaction.commit()
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}
