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
}
