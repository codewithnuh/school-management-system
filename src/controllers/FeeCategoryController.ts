import { Request, Response } from 'express'
import {
    FeeCategoryAttributes,
    FeeCategorySchema,
    FeeCategory,
} from '@/models/index.js' // Adjust path to your model files
import { ResponseUtil } from '@/utils/response.util.js' // Adjust path to ResponseUtil
import { FeeCategoryService } from '@/services/feeCategory.service.js'

// ========================= Fee Category Controller =========================
export class FeeCategoryController {
    public static async createFeeCategory(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const validatedData = FeeCategorySchema.parse(
                req.body,
            ) as FeeCategoryAttributes
            const feeCategoryInput: FeeCategoryAttributes = {
                categoryName: validatedData.categoryName,
                description: validatedData.description,
            }
            const feeCategory =
                await FeeCategoryService.createFeeCategory(feeCategoryInput)
            const response = ResponseUtil.success<FeeCategory>(
                feeCategory,
                'Fee category created successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error creating fee category:', error)
            const genericMessage =
                'Fee category creation failed. Please verify your input and try again.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async getAllFeeCategories(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const feeCategories = await FeeCategoryService.getAllFeeCategories()
            const response = ResponseUtil.success<FeeCategory[]>(
                feeCategories,
                'Fee categories retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error fetching all fee categories:', error)
            const genericMessage =
                'Failed to retrieve fee categories. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 500)
            res.status(response.statusCode).json(response)
        }
    }

    public static async getFeeCategoryById(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const feeCategoryId = parseInt(id, 10)
            if (isNaN(feeCategoryId)) throw new Error('Invalid fee category ID')

            const feeCategory =
                await FeeCategoryService.getFeeCategoryById(feeCategoryId)
            const response = ResponseUtil.success<FeeCategory | null>(
                feeCategory,
                'Fee category retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error fetching fee category by ID:', error)
            const genericMessage =
                'Failed to retrieve fee category. Please verify your request.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async updateFeeCategory(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const feeCategoryId = parseInt(id, 10)
            if (isNaN(feeCategoryId)) throw new Error('Invalid fee category ID')

            const validatedData = FeeCategorySchema.parse(
                req.body,
            ) as FeeCategoryAttributes
            const feeCategoryInput: FeeCategoryAttributes = {
                categoryName: validatedData.categoryName,
                description: validatedData.description,
            }

            const updatedFeeCategory =
                await FeeCategoryService.updateFeeCategory(
                    feeCategoryId,
                    feeCategoryInput,
                )
            const response = ResponseUtil.success<number[]>( // update returns number of affected rows
                updatedFeeCategory,
                'Fee category updated successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error updating fee category:', error)
            const genericMessage =
                'Fee category update failed. Please ensure your input is correct and try again.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async deleteFeeCategory(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const feeCategoryId = parseInt(id, 10)
            if (isNaN(feeCategoryId)) throw new Error('Invalid fee category ID')

            const deletedFeeCategoryCount =
                await FeeCategoryService.deleteFeeCategory(feeCategoryId)
            const response = ResponseUtil.success<number>(
                deletedFeeCategoryCount,
                'Fee category deleted successfully',
                204,
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error deleting fee category:', error)
            const genericMessage =
                'Fee category deletion failed. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }
}
