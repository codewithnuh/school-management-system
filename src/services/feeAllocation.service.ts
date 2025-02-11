import {
    AcademicYear,
    Class,
    FeeCategory,
    FeePayment,
    FeeStructure,
    StudentFeeAllocation,
    StudentFeeAllocationAttributes,
    StudentFeeAllocationSchema,
    User,
} from '@/models/index.js'
import sequelize from '@/config/database.js'
export class StudentFeeAllocationService {
    static async createStudentFeeAllocation(
        input: StudentFeeAllocationAttributes,
    ) {
        StudentFeeAllocationSchema.parse(input) // Input validation
        const transaction = await sequelize.transaction()
        try {
            const newStudentFeeAllocation = await StudentFeeAllocation.create(
                input,
                {
                    transaction,
                },
            )
            await transaction.commit()
            return newStudentFeeAllocation
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async getAllStudentFeeAllocations() {
        return StudentFeeAllocation.findAll({
            include: [User, AcademicYear, Class], // Include related models
        })
    }

    static async getStudentFeeAllocationById(id: number) {
        return StudentFeeAllocation.findByPk(id, {
            include: [User, AcademicYear, Class, FeePayment], // Include related models + payments
        })
    }

    static async updateStudentFeeAllocation(
        id: number,
        input: StudentFeeAllocationAttributes,
    ) {
        StudentFeeAllocationSchema.parse(input) // Input validation
        const transaction = await sequelize.transaction()
        try {
            const updatedStudentFeeAllocation =
                await StudentFeeAllocation.update(input, {
                    where: { studentFeeAllocationId: id },
                    transaction,
                })
            await transaction.commit()
            return updatedStudentFeeAllocation
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async deleteStudentFeeAllocation(id: number) {
        const transaction = await sequelize.transaction()
        try {
            const deletedStudentFeeAllocation =
                await StudentFeeAllocation.destroy({
                    where: { studentFeeAllocationId: id },
                    transaction,
                })
            await transaction.commit()
            return deletedStudentFeeAllocation
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async getStudentFeeAllocationByStudentAndYear(
        studentId: number,
        academicYearId: number,
    ) {
        return StudentFeeAllocation.findOne({
            where: { studentId: studentId, academicYearId: academicYearId },
            include: [
                FeePayment,
                { model: FeeStructure, include: [FeeCategory] },
            ], // Include payments and Fee Structures + Categories
        })
    }
}
