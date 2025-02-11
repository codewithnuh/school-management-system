import {
    AcademicYear,
    Class,
    FeeCategory,
    FeeStructure,
    FeeStructureAttributes,
    feeStructureSchema,
} from '@/models/index.js'
import sequelize from '@/config/database.js'
export class FeeStructureService {
    static async createFeeStructure(input: FeeStructureAttributes) {
        feeStructureSchema.parse(input) // Input validation
        const transaction = await sequelize.transaction()
        try {
            const newFeeStructure = await FeeStructure.create(input, {
                transaction,
            })
            await transaction.commit()
            return newFeeStructure
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async getAllFeeStructures() {
        return FeeStructure.findAll({
            include: [AcademicYear, Class, FeeCategory], // Include related models
        })
    }

    static async getFeeStructureById(id: number) {
        return FeeStructure.findByPk(id, {
            include: [AcademicYear, Class, FeeCategory], // Include related models
        })
    }

    static async updateFeeStructure(id: number, input: FeeStructureAttributes) {
        feeStructureSchema.parse(input) // Input validation
        const transaction = await sequelize.transaction()
        try {
            const updatedFeeStructure = await FeeStructure.update(input, {
                where: { feeStructureId: id },
                transaction,
            })
            await transaction.commit()
            return updatedFeeStructure
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async deleteFeeStructure(id: number) {
        const transaction = await sequelize.transaction()
        try {
            const deletedFeeStructure = await FeeStructure.destroy({
                where: { feeStructureId: id },
                transaction,
            })
            await transaction.commit()
            return deletedFeeStructure
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async getFeeStructuresByClassAndYear(
        classId: number,
        academicYearId: number,
    ) {
        return FeeStructure.findAll({
            where: { classId: classId, academicYearId: academicYearId },
            include: [FeeCategory], // Optionally include FeeCategory for details
        })
    }
}
