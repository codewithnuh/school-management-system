import type { Request, Response } from 'express'
import { Class } from '@/models/Class.js'
import { Teacher } from '@/models/Teacher.js'
import { User } from '@/models/User.js'
import { TimetableService } from '@/services/timetable.service.js'
import { ForbiddenError, NotFoundError, ValidationError } from '@/errors/index.js'

function parsePositiveId(value: string | undefined, field: string): number {
    const id = Number(value)
    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new ValidationError(`${field} must be a positive integer`)
    }
    return id
}

async function requireSchoolAccess(req: Request, schoolId: number): Promise<void> {
    if (!req.auth) throw new ForbiddenError()
    const user = await User.findByPk(req.auth.userId, { attributes: ['schoolId'] })
    if (!user || user.schoolId !== schoolId) throw new ForbiddenError()
}

export class TimetableController {
    static async generateTimetable(req: Request, res: Response): Promise<void> {
        const classId = parsePositiveId(req.params.classid, 'classId')
        const schoolClass = await Class.findByPk(classId)
        if (!schoolClass) throw new NotFoundError('Class')
        await requireSchoolAccess(req, schoolClass.schoolId)

        const timetable = await TimetableService.generateTimetable({
            classId,
            academicYearId: schoolClass.academicYearId,
            workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        })
        res.status(200).json({ success: true, data: timetable })
    }

    static async getWeeklyTimetable(req: Request, res: Response): Promise<void> {
        const classId = parsePositiveId(req.params.classId, 'classId')
        const sectionId = parsePositiveId(req.params.sectionId, 'sectionId')
        const schoolClass = await Class.findByPk(classId, { attributes: ['schoolId'] })
        if (!schoolClass) throw new NotFoundError('Class')
        await requireSchoolAccess(req, schoolClass.schoolId)
        const timetable = await TimetableService.getClassTimetable(classId, sectionId)
        res.status(200).json({ success: true, data: timetable })
    }

    static async getTeacherTimetable(req: Request, res: Response): Promise<void> {
        const teacherId = parsePositiveId(req.params.teacherId, 'teacherId')
        if (!req.auth) throw new ForbiddenError()
        if (req.auth.entityType === 'TEACHER') {
            const teacher = await Teacher.findOne({
                where: { userId: req.auth.userId },
                attributes: ['id', 'schoolId'],
            })
            if (!teacher || teacher.id !== teacherId) throw new ForbiddenError()
        } else {
            const teacher = await Teacher.findByPk(teacherId, { attributes: ['schoolId'] })
            if (!teacher) throw new NotFoundError('Teacher')
            await requireSchoolAccess(req, teacher.schoolId)
        }
        const timetable = await TimetableService.getTeacherTimetable(teacherId)
        res.status(200).json({ success: true, data: timetable })
    }
}
