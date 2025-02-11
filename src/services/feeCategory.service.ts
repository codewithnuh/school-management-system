import sequelize from '@/config/database.js' // Adjust path if needed
import {
    FeeCategory,
    FeeCategoryAttributes,
    FeeCategorySchema, // Import Fee Management Models and potentially Class, AcademicYear, Student
} from '@/models/index.js' // Adjust path if needed

// ========================= Fee Category Service =========================
export class FeeCategoryService {
    static async createFeeCategory(input: FeeCategoryAttributes) {
        FeeCategorySchema.parse(input) // Input validation
        const transaction = await sequelize.transaction()
        try {
            const newFeeCategory = await FeeCategory.create(input, {
                transaction,
            })
            await transaction.commit()
            return newFeeCategory
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async getAllFeeCategories() {
        return FeeCategory.findAll()
    }

    static async getFeeCategoryById(id: number) {
        return FeeCategory.findByPk(id)
    }

    static async updateFeeCategory(id: number, input: FeeCategoryAttributes) {
        FeeCategorySchema.parse(input) // Input validation
        const transaction = await sequelize.transaction()
        try {
            const updatedFeeCategory = await FeeCategory.update(input, {
                where: { feeCategoryId: id },
                transaction,
            })
            await transaction.commit()
            return updatedFeeCategory
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async deleteFeeCategory(id: number) {
        const transaction = await sequelize.transaction()
        try {
            const deletedFeeCategory = await FeeCategory.destroy({
                where: { feeCategoryId: id },
                transaction,
            })
            await transaction.commit()
            return deletedFeeCategory
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}
