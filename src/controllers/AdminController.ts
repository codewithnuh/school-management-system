import { adminService } from '@/services/admin.service.js'
import { ResponseUtil } from '@/utils/response.util.js'
import { Request, Response } from 'express'
export class AdminController {
    static async getAllAdmins(req: Request, res: Response): Promise<void> {
        try {
            const allAdmins = await adminService.getAllAdmins()
            const response = ResponseUtil.success(
                allAdmins,
                'Admins Retrieved Successfully',
                200,
            )
            res.json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(
                    ResponseUtil.error(
                        error.message,
                        400,
                        'Failed to retrieved admins',
                    ),
                )
            }
        }
    }
    static async getAdminById(req: Request, res: Response): Promise<void> {
        try {
            const { adminId } = req.params
            const allAdmins = await adminService.getAdminById(Number(adminId))
            const response = ResponseUtil.success(
                allAdmins,
                'Admins Retrieved Successfully',
                200,
            )
            res.json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(
                    ResponseUtil.error(
                        error.message,
                        400,
                        'Failed to retrieved admins',
                    ),
                )
            }
        }
    }
    static async updateAdminById(req: Request, res: Response): Promise<void> {
        try {
            const { adminId, isSubscriptionActive, subscriptionPlan } = req.body
            const updatedAdmin = await adminService.updateAdminById(
                Number(adminId),
                isSubscriptionActive,
                subscriptionPlan,
            )
            const response = ResponseUtil.success(
                updatedAdmin,
                'Admin updated Successfully',
                200,
            )
            res.json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(
                    ResponseUtil.error(
                        error.message,
                        400,
                        'Failed to update admin',
                    ),
                )
            }
        }
    }
    static async verifyAdminSubscriptionByAdminId(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { adminId } = req.params
            if (!adminId) throw new Error('Please provide admin id')
            const subscriptionStatus =
                await adminService.verifyAdminSubscriptionByAdminId(
                    Number(adminId),
                )
            const response = ResponseUtil.success(
                { isSubscriptionActive: subscriptionStatus },
                'Successfully verified',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    'Failed to verify',
                    400,
                    'Failed to verify subscription status',
                )
                res.status(response.statusCode).json(response)
            }
        }
    }
}
