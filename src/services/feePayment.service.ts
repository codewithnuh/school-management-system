import sequelize from '@/config/database.js'
import {
    FeePayment,
    FeePaymentAttributes,
    feePaymentSchema,
    StudentFeeAllocation,
} from '@/models/index.js'
export class FeePaymentService {
    static async createFeePayment(input: FeePaymentAttributes) {
        feePaymentSchema.parse(input) // Input validation
        const transaction = await sequelize.transaction()
        try {
            const newFeePayment = await FeePayment.create(input, {
                transaction,
            })
            // Update outstanding balance in StudentFeeAllocation
            const studentFeeAllocation = await StudentFeeAllocation.findByPk(
                input.studentFeeAllocationId,
                { transaction },
            )

            if (!studentFeeAllocation) {
                throw new Error('Student fee allocation not found') //Handle the case where the allocation doesn't exist
            }

            await studentFeeAllocation.decrement('outstandingBalance', {
                by: input.amountPaid,
                transaction,
            }) // Decrement balance
            await transaction.commit()
            return newFeePayment
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async getAllFeePayments() {
        return FeePayment.findAll({ include: [StudentFeeAllocation] }) // Include related models
    }

    static async getFeePaymentById(id: number) {
        return FeePayment.findByPk(id, { include: [StudentFeeAllocation] }) // Include related models
    }

    static async updateFeePayment(id: number, input: FeePaymentAttributes) {
        feePaymentSchema.parse(input) // Input validation
        const transaction = await sequelize.transaction()
        try {
            const updatedFeePayment = await FeePayment.update(input, {
                where: { feePaymentId: id },
                transaction,
            })
            await transaction.commit()
            return updatedFeePayment
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async deleteFeePayment(id: number) {
        const transaction = await sequelize.transaction()
        try {
            const deletedFeePayment = await FeePayment.destroy({
                where: { feePaymentId: id },
                transaction,
            })
            await transaction.commit()
            return deletedFeePayment
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}
