import {
    FeePayment,
    FeePaymentAttributes,
    feePaymentSchema,
} from '@/models/index.js'
import { FeePaymentService } from '@/services/feePayment.service.js'
import { ResponseUtil } from '@/utils/response.util.js'
import { Request, Response } from 'express'
export class FeePaymentController {
    public static async createFeePayment(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const validatedData = feePaymentSchema.parse(
                req.body,
            ) as FeePaymentAttributes
            const feePaymentInput: FeePaymentAttributes = {
                studentFeeAllocationId: validatedData.studentFeeAllocationId,
                paymentDate: validatedData.paymentDate,
                paymentMethod: validatedData.paymentMethod,
                amountPaid: validatedData.amountPaid,
                receiptNumber: validatedData.receiptNumber,
                transactionReference: validatedData.transactionReference,
                paymentNotes: validatedData.paymentNotes,
            }
            const feePayment =
                await FeePaymentService.createFeePayment(feePaymentInput)
            const response = ResponseUtil.success<FeePayment>(
                feePayment,
                'Fee payment recorded successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error creating fee payment:', error)
            const genericMessage =
                'Fee payment recording failed. Please verify your input and try again.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async getAllFeePayments(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const feePayments = await FeePaymentService.getAllFeePayments()
            const response = ResponseUtil.success<FeePayment[]>(
                feePayments,
                'Fee payments retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error fetching all fee payments:', error)
            const genericMessage =
                'Failed to retrieve fee payments. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 500)
            res.status(response.statusCode).json(response)
        }
    }

    public static async getFeePaymentById(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const feePaymentId = parseInt(id, 10)
            if (isNaN(feePaymentId)) throw new Error('Invalid fee payment ID')

            const feePayment =
                await FeePaymentService.getFeePaymentById(feePaymentId)
            const response = ResponseUtil.success<FeePayment | null>(
                feePayment,
                'Fee payment retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error fetching fee payment by ID:', error)
            const genericMessage =
                'Failed to retrieve fee payment. Please verify your request.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async updateFeePayment(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const feePaymentId = parseInt(id, 10)
            if (isNaN(feePaymentId)) throw new Error('Invalid fee payment ID')

            const validatedData = feePaymentSchema.parse(
                req.body,
            ) as FeePaymentAttributes
            const feePaymentInput: FeePaymentAttributes = {
                studentFeeAllocationId: validatedData.studentFeeAllocationId,
                paymentDate: validatedData.paymentDate,
                paymentMethod: validatedData.paymentMethod,
                amountPaid: validatedData.amountPaid,
                receiptNumber: validatedData.receiptNumber,
                transactionReference: validatedData.transactionReference,
                paymentNotes: validatedData.paymentNotes,
            }

            const updatedFeePayment = await FeePaymentService.updateFeePayment(
                feePaymentId,
                feePaymentInput,
            )
            const response = ResponseUtil.success<number[]>(
                updatedFeePayment,
                'Fee payment updated successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error updating fee payment:', error)
            const genericMessage =
                'Fee payment update failed. Please ensure your input is correct and try again.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async deleteFeePayment(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const feePaymentId = parseInt(id, 10)
            if (isNaN(feePaymentId)) throw new Error('Invalid fee payment ID')

            const deletedFeePaymentCount =
                await FeePaymentService.deleteFeePayment(feePaymentId)
            const response = ResponseUtil.success<number>(
                deletedFeePaymentCount,
                'Fee payment deleted successfully',
                204,
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error deleting fee payment:', error)
            const genericMessage =
                'Fee payment deletion failed. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }
}
