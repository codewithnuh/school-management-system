import {
    FeeStructure,
    FeeStructureAttributes,
    feeStructureSchema,
} from '@/models/index.js'
import { FeeStructureService } from '@/services/feeStructure.service.js'
import { ResponseUtil } from '@/utils/response.util.js'
import { Response, Request } from 'express'
export class FeeStructureController {
    public static async createFeeStructure(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const validatedData = feeStructureSchema.parse(
                req.body,
            ) as FeeStructureAttributes
            const feeStructureInput: FeeStructureAttributes = {
                academicYearId: validatedData.academicYearId,
                classId: validatedData.classId,
                feeCategoryId: validatedData.feeCategoryId,
                amount: validatedData.amount,
            }
            const feeStructure =
                await FeeStructureService.createFeeStructure(feeStructureInput)
            const response = ResponseUtil.success<FeeStructure>(
                feeStructure,
                'Fee structure created successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error creating fee structure:', error)
            const genericMessage =
                'Fee structure creation failed. Please verify your input and try again.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async getAllFeeStructures(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const feeStructures =
                await FeeStructureService.getAllFeeStructures()
            const response = ResponseUtil.success<FeeStructure[]>(
                feeStructures,
                'Fee structures retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error fetching all fee structures:', error)
            const genericMessage =
                'Failed to retrieve fee structures. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 500)
            res.status(response.statusCode).json(response)
        }
    }

    public static async getFeeStructureById(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const feeStructureId = parseInt(id, 10)
            if (isNaN(feeStructureId))
                throw new Error('Invalid fee structure ID')

            const feeStructure =
                await FeeStructureService.getFeeStructureById(feeStructureId)
            const response = ResponseUtil.success<FeeStructure | null>(
                feeStructure,
                'Fee structure retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error fetching fee structure by ID:', error)
            const genericMessage =
                'Failed to retrieve fee structure. Please verify your request.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async updateFeeStructure(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const feeStructureId = parseInt(id, 10)
            if (isNaN(feeStructureId))
                throw new Error('Invalid fee structure ID')

            const validatedData = feeStructureSchema.parse(
                req.body,
            ) as FeeStructureAttributes
            const feeStructureInput: FeeStructureAttributes = {
                academicYearId: validatedData.academicYearId,
                classId: validatedData.classId,
                feeCategoryId: validatedData.feeCategoryId,
                amount: validatedData.amount,
            }

            const updatedFeeStructure =
                await FeeStructureService.updateFeeStructure(
                    feeStructureId,
                    feeStructureInput,
                )
            const response = ResponseUtil.success<number[]>(
                updatedFeeStructure,
                'Fee structure updated successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error updating fee structure:', error)
            const genericMessage =
                'Fee structure update failed. Please ensure your input is correct and try again.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async deleteFeeStructure(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const feeStructureId = parseInt(id, 10)
            if (isNaN(feeStructureId))
                throw new Error('Invalid fee structure ID')

            const deletedFeeStructureCount =
                await FeeStructureService.deleteFeeStructure(feeStructureId)
            const response = ResponseUtil.success<number>(
                deletedFeeStructureCount,
                'Fee structure deleted successfully',
                204,
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error deleting fee structure:', error)
            const genericMessage =
                'Fee structure deletion failed. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async getFeeStructuresByClassAndYear(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { classId, academicYearId } = req.params
            const class_Id = parseInt(classId, 10)
            const academic_YearId = parseInt(academicYearId, 10)

            if (isNaN(class_Id)) throw new Error('Invalid class ID')
            if (isNaN(academic_YearId))
                throw new Error('Invalid academic year ID')

            const feeStructures =
                await FeeStructureService.getFeeStructuresByClassAndYear(
                    class_Id,
                    academic_YearId,
                )
            const response = ResponseUtil.success<FeeStructure[]>(
                feeStructures,
                'Fee structures retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error(
                'Error fetching fee structures by class and year:',
                error,
            )
            const genericMessage =
                'Failed to retrieve fee structures. Please verify your request.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }
}
