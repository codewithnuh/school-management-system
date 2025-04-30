import { adminUser } from '@/services/admin.service.js'
import { ResponseUtil } from '@/utils/response.util'
import { Request, Response } from 'express'

export class AdminController {
    async getAllAdmins(req: Request, res: Response): Promise<void> {
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
    async getAdminByAdmin(req: Request, res: Response) {
        try {
            const { id } = req.params
            const admin = await adminUser.getAdminById(id)
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' })
            }
            const response = ResponseUtil.success(
                admin,
                'Admin Fetched Successfully',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message })
            }
        }
    }
}
