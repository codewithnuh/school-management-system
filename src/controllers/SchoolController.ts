import { schoolSchema } from '@/models/index.js'
import { schoolService } from '@/services/school.service.js'
import { ResponseUtil } from '@/utils/response.util.js'
import { Request, Response } from 'express'

export class SchoolController {
    static async createSchool(req: Request, res: Response): Promise<void> {
        const validatedData = schoolSchema.parse(req.body)
        const school = await schoolService.createSchool({
            ...validatedData,
        })
        const response = ResponseUtil.success(
            school,
            'School created successfully',
            201,
        )
        res.status(response.statusCode).json(response)
    }
    static async getSchoolById(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        const school = await schoolService.getSchoolById(Number(id))
        if (!school) {
            const response = ResponseUtil.error(
                'School not found',
                404,
                'School not found',
            )
            res.status(response.statusCode).json(response)
        }
        const response = ResponseUtil.success(
            school,
            'School retrieved successfully',
        )
        res.status(response.statusCode).json(response)
    }
    static async getSchoolByAdminId(
        req: Request,
        res: Response,
    ): Promise<void> {
        const { adminId } = req.params
        const school = await schoolService.getSchoolById(Number(adminId))
        if (!school) {
            const response = ResponseUtil.error(
                'School not found',
                404,
                'School not found',
            )
            res.status(response.statusCode).json(response)
        }
        const response = ResponseUtil.success(
            school,
            'School retrieved successfully',
        )
        res.status(response.statusCode).json(response)
    }
}
