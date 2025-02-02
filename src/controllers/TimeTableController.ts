import { Request, Response } from 'express'
import { TimetableService } from '@/services/timetable.service'
import { ResponseUtil } from '@/utils/response.util'
import { InstanceError } from 'sequelize'

export class TimetableController {
    static async generateTimetable(req: Request, res: Response): Promise<void> {
        try {
            const classId = parseInt(req.params.classid, 10)
            console.log(classId)
            const timetables = await TimetableService.generateTimetable(classId)
            res.status(200).json(
                ResponseUtil.success(
                    timetables,
                    'Timetable generated successfully',
                ),
            )
        } catch (error: any) {
            console.error(error)
            res.status(error?.statusCode || 500).json(
                ResponseUtil.error(
                    error?.message || 'Failed to generate timetable',
                ),
            )
        }
    }

    static async getTimetable(req: Request, res: Response): Promise<void> {
        try {
            const classId = parseInt(req.params.classId, 10)
            const sectionId = parseInt(req.params.sectionId, 10)
            const timetable = await TimetableService.getTimetable(
                classId,
                sectionId,
            )
            if (!timetable) {
                res.status(404).json(
                    ResponseUtil.error('Timetable not found', 404),
                )
            }
            res.status(200).json(
                ResponseUtil.success(
                    timetable,
                    'Timetable retrieved successfully',
                ),
            )
        } catch (error) {
            console.error(error)
            if (error instanceof Error) {
                res.status(500).json(
                    ResponseUtil.error(
                        error?.message || 'Failed to retrieve timetable',
                    ),
                )
            }
        }
    }
}
