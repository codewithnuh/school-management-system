import { adminUser } from '@/services/admin.service.js'
import { ResponseUtil } from '@/utils/response.util'
import { Request, Response } from 'express'

export class AdminController {
    static async getAllAdmins(req: Request, res: Response): Promise<void> {
        try {
            const admins = await adminUser.getAllAdmins()
            const response = ResponseUtil.success(
                admins,
                'Admins Fetched Successfully',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message })
            }
        }
    }
    static async getAdminByAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const admin = await adminUser.getAdminById(id)
            if (!admin) {
                res.status(404).json(ResponseUtil.error('Admin not found', 404))
            }
            const response = ResponseUtil.success(
                admin,
                'Admin Fetched Successfully',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(
                    ResponseUtil.error('Internal Server Error', 500),
                )
            }
        }
    }
}
