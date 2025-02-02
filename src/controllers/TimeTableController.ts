import { Request, Response } from 'express'
import { TimetableService } from '@/services/timetable.service'
import { ResponseUtil } from '@/utils/response.util'
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
    static async getTeacherTimetable(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const teacherId = parseInt(req.params.teacherId, 10)

            const timetableEntries =
                await TimetableService.getTeacherTimetable(teacherId)
            res.status(200).json(
                ResponseUtil.success(
                    timetableEntries,
                    'Teacher timetable retrieved successfully',
                ),
            )
        } catch (error: any) {
            console.error(error)
            res.status(error?.statusCode || 500).json(
                ResponseUtil.error(
                    error?.message || 'Failed to retrieve teacher timetable',
                ),
            )
        }
    }
    // timetable.controller.ts
    static async getWeeklyTimetable(
        req: Request,
        res: Response,
    ): Promise<void> {
        console.log('weekly timetable')
        try {
            const classId = parseInt(req.params.classId, 10)
            const sectionId = req.params.sectionId
                ? parseInt(req.params.sectionId, 10)
                : undefined
            const teacherId = req.params.teacherId
                ? parseInt(req.params.teacherId, 10)
                : undefined

            const weeklyTimetable = await TimetableService.getWeeklyTimetable(
                classId,
                sectionId,
                teacherId,
            )

            res.status(200).json(
                ResponseUtil.success(
                    weeklyTimetable,
                    'Weekly timetable retrieved successfully',
                ),
            )
        } catch (error: any) {
            console.error(error)
            res.status(error?.statusCode || 500).json(
                ResponseUtil.error(
                    error?.message || 'Failed to retrieve weekly timetable',
                ),
            )
        }
    }
}
