import { Grade } from '@/models/Grade.js'
import { GradeAttributes, gradeSchema } from '@/models/Grade.js'
export class GradeService {
    static async createGrade(input: GradeAttributes) {
        gradeSchema.parse(input) // OWASP: Input Validation
        return Grade.create(input)
    }

    static async getAllGrades() {
        return Grade.findAll()
    }

    static async getGradeById(id: number) {
        return Grade.findByPk(id)
    }

    static async updateGrade(id: number, input: GradeAttributes) {
        gradeSchema.parse(input) // OWASP: Input Validation
        const [updatedRows] = await Grade.update(input, {
            where: { gradeId: id },
        })
        if (updatedRows === 0) {
            throw new Error(`Grade with ID ${id} not found`) // More specific error
        }
        return { message: 'Grade updated successfully' }
    }

    static async deleteGrade(id: number) {
        const deletedRows = await Grade.destroy({ where: { gradeId: id } })
        if (deletedRows === 0) {
            throw new Error(`Grade with ID ${id} not found`) // More specific error
        }
        return { message: 'Grade deleted successfully' }
    }
}
