import type { Request, RequestHandler } from 'express'
import { ZodError } from 'zod'
import { ExamService } from '@/services/exam.service.js'
import { ResponseUtil } from '@/utils/response.util.js'

function parseId(value: string): number | null {
    const id = Number(value)
    return Number.isSafeInteger(id) && id > 0 ? id : null
}

async function getSchoolId(request: Request): Promise<number | null> {
    if (!request.auth) return null
    return ExamService.getSchoolIdForPrincipal(
        request.auth.userId,
        request.auth.entityType,
    )
}

function sendError(
    response: Parameters<RequestHandler>[1],
    error: unknown,
    fallback: string,
): void {
    if (error instanceof ZodError) {
        response.status(400).json(
            ResponseUtil.error('Request validation failed', 400),
        )
        return
    }

    console.error(fallback, error)
    response
        .status(500)
        .json(ResponseUtil.error('Internal server error', 500))
}

export class ExamController {
    static readonly createExam: RequestHandler = async (request, response) => {
        try {
            const schoolId = await getSchoolId(request)
            if (schoolId === null) {
                response.status(403).json(ResponseUtil.error('School access denied', 403))
                return
            }
            const exam = await ExamService.createExam(schoolId, request.body)
            response
                .status(201)
                .json(ResponseUtil.success(exam, 'Exam created successfully', 201))
        } catch (error: unknown) {
            sendError(response, error, 'Exam creation failed')
        }
    }

    static readonly getAllExams: RequestHandler = async (request, response) => {
        try {
            const schoolId = await getSchoolId(request)
            if (schoolId === null) {
                response.status(403).json(ResponseUtil.error('School access denied', 403))
                return
            }
            const exams = await ExamService.getAllExams(schoolId)
            response.json(ResponseUtil.success(exams, 'Exams retrieved successfully'))
        } catch (error: unknown) {
            sendError(response, error, 'Exam listing failed')
        }
    }

    static readonly getExamById: RequestHandler = async (request, response) => {
        const id = parseId(request.params.id ?? '')
        if (id === null) {
            response.status(400).json(ResponseUtil.error('Invalid exam ID', 400))
            return
        }

        try {
            const schoolId = await getSchoolId(request)
            if (schoolId === null) {
                response.status(403).json(ResponseUtil.error('School access denied', 403))
                return
            }
            const exam = await ExamService.getExamById(id, schoolId)
            if (!exam) {
                response.status(404).json(ResponseUtil.error('Exam not found', 404))
                return
            }
            response.json(ResponseUtil.success(exam, 'Exam retrieved successfully'))
        } catch (error: unknown) {
            sendError(response, error, 'Exam lookup failed')
        }
    }

    static readonly updateExam: RequestHandler = async (request, response) => {
        const id = parseId(request.params.id ?? '')
        if (id === null) {
            response.status(400).json(ResponseUtil.error('Invalid exam ID', 400))
            return
        }

        try {
            const schoolId = await getSchoolId(request)
            if (schoolId === null) {
                response.status(403).json(ResponseUtil.error('School access denied', 403))
                return
            }
            const exam = await ExamService.updateExam(id, request.body, schoolId)
            if (!exam) {
                response.status(404).json(ResponseUtil.error('Exam not found', 404))
                return
            }
            response.json(ResponseUtil.success(exam, 'Exam updated successfully'))
        } catch (error: unknown) {
            sendError(response, error, 'Exam update failed')
        }
    }

    static readonly deleteExam: RequestHandler = async (request, response) => {
        const id = parseId(request.params.id ?? '')
        if (id === null) {
            response.status(400).json(ResponseUtil.error('Invalid exam ID', 400))
            return
        }

        try {
            const schoolId = await getSchoolId(request)
            if (schoolId === null) {
                response.status(403).json(ResponseUtil.error('School access denied', 403))
                return
            }
            const deleted = await ExamService.deleteExam(id, schoolId)
            if (deleted === 0) {
                response.status(404).json(ResponseUtil.error('Exam not found', 404))
                return
            }
            response.status(204).end()
        } catch (error: unknown) {
            sendError(response, error, 'Exam deletion failed')
        }
    }
}
