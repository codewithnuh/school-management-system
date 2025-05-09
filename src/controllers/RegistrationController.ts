import { School } from '@/models/index.js'
import { CurrentUserPayload } from '@/services/auth.service.js'
import { registrationService } from '@/services/registration.service.js'
import { Request, Response } from 'express'
import QRCode from 'qrcode'
import jwt from 'jsonwebtoken'
import { ResponseUtil } from '@/utils/response.util.js'

export class RegistrationController {
    static async createTeacherRegistrationLink(req: Request, res: Response) {
        try {
            const token = req.cookies.token
            if (!token) throw new Error('Token Missing')
            const decodedToken = jwt.verify(
                token,
                process.env.JWT_SECRET!,
            ) as CurrentUserPayload
            const adminId = decodedToken.userId
            const school = await School.findOne({
                where: {
                    adminId,
                },
            })
            if (!school) throw new Error('School Does not exists')

            const generateLink = await registrationService.generateLink({
                createdBy: adminId,
                isActive: true,
                schoolId: school!.id,
                type: 'TEACHER',
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days
            })
            const link = `${process.env.FRONTEND_URL}/register/${generateLink.id}`
            const response = ResponseUtil.success(
                link,
                'Teacher Registration Link Created',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    error.message,
                    500,
                    'Error Creating Registration Link',
                )
                res.status(response.statusCode).json(response)
            }
        }
    }
    static async updateTeacherRegistrationLink(req: Request, res: Response) {
        try {
            const token = req.cookies.token
            if (!token) throw new Error('Token Missing')
            const decodedToken = jwt.verify(
                token,
                process.env.JWT_SECRET!,
            ) as CurrentUserPayload
            const adminId = decodedToken.userId
            const school = await School.findOne({
                where: {
                    adminId,
                },
            })
            if (!school) throw new Error('School Does not exists')
            const generateLink = await registrationService.generateLink({
                createdBy: adminId,
                isActive: true,
                schoolId: school!.id,
                type: 'TEACHER',
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days
            })
            const link = `${process.env.FRONTEND_URL}/register/${generateLink.id}`
            const response = ResponseUtil.success(
                link,
                'Teacher Registration Link Created',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    error.message,
                    500,
                    'Error Creating Registration Link',
                )
                res.status(response.statusCode).json(response)
            }
        }
    }
    static async deleteTeacherRegistrationLink(req: Request, res: Response) {
        try {
            const token = req.cookies.token
            if (!token) throw new Error('Token Missing')
            const decodedToken = jwt.verify(
                token,
                process.env.JWT_SECRET!,
            ) as CurrentUserPayload
            const adminId = decodedToken.userId
            const school = await School.findOne({
                where: {
                    adminId,
                },
            })
            if (!school) throw new Error('School Does not exists')
            await registrationService.deleteLink({
                createdBy: adminId,
                schoolId: school!.id,
                type: 'TEACHER',
            })
            const response = ResponseUtil.success(
                null,
                'Link deleted successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    error.message,
                    500,
                    'Error Creating Registration Link',
                )
                res.status(response.statusCode).json(response)
            }
        }
    }
    static async deleteStudentRegistrationLink(req: Request, res: Response) {
        try {
            const token = req.cookies.token
            if (!token) throw new Error('Token Missing')
            const decodedToken = jwt.verify(
                token,
                process.env.JWT_SECRET!,
            ) as CurrentUserPayload
            const adminId = decodedToken.userId
            const school = await School.findOne({
                where: {
                    adminId,
                },
            })
            if (!school) throw new Error('School Does not exists')
            await registrationService.deleteLink({
                createdBy: adminId,
                schoolId: school!.id,
                type: 'STUDENT',
            })
            const response = ResponseUtil.success(
                null,
                'Link deleted successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    error.message,
                    500,
                    'Error Creating Registration Link',
                )
                res.status(response.statusCode).json(response)
            }
        }
    }
    static async createStudentRegistrationLink(req: Request, res: Response) {
        try {
            const cookie = req.cookies.token
            if (!cookie) throw new Error('Token Missing')
            const decodedToken = jwt.verify(
                cookie,
                process.env.JWT_SECRET!,
            ) as CurrentUserPayload
            const adminId = decodedToken.userId
            const school = await School.findOne({ where: { adminId } })
            if (!school) throw new Error('School Does not exists')
            const generateLink = await registrationService.generateLink({
                createdBy: adminId,
                isActive: true,
                schoolId: school!.id,
                type: 'STUDENT',
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // Link expires in 48 hours
            })
            const link = `${process.env.FRONTEND_URL}/student/register/${generateLink.id}`
            const response = ResponseUtil.success(
                link,
                'Student Registration Link Created',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    error.message,
                    500,
                    'Error Creating Registration Link',
                )
                res.status(response.statusCode).json(response)
            }
        }
    }

    static async getTeacherRegistrationLinks(req: Request, res: Response) {
        try {
            const cookie = req.cookies.token
            if (!cookie) throw new Error('Token Missing')
            const decodedToken = jwt.verify(
                cookie,
                process.env.JWT_SECRET!,
            ) as CurrentUserPayload
            const adminId = decodedToken.userId
            const school = await School.findOne({ where: { adminId } })
            if (!school) throw new Error('School Does not exists')

            const teacherLinks = await registrationService.getTeacherLinks({
                adminId,
                schoolId: school!.id,
                type: 'TEACHER',
            })

            const enrichedLinks = await Promise.all(
                teacherLinks.map(async link => {
                    const fullLink = `${process.env.FRONTEND_URL}/register/${link.id}`
                    const qrCode = await QRCode.toDataURL(fullLink)
                    return {
                        ...link.toJSON(),
                        url: fullLink,
                        qrCode, // base64 QR image string
                    }
                }),
            )

            const response = ResponseUtil.success(
                enrichedLinks,
                'Teacher Registration Links with QR Codes',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            const response = ResponseUtil.error(
                error instanceof Error ? error.message : 'Unknown error',
                500,
                'Error Getting Teacher Registration Links',
            )
            res.status(response.statusCode).json(response)
        }
    }
    static async getStudentRegistrationLinks(req: Request, res: Response) {
        try {
            const cookie = req.cookies.token
            if (!cookie) throw new Error('Token Missing')
            const decodedToken = jwt.verify(
                cookie,
                process.env.JWT_SECRET!,
            ) as CurrentUserPayload
            const adminId = decodedToken.userId
            const school = await School.findOne({ where: { adminId } })
            if (!school) throw new Error('School Does not exists')

            const teacherLinks = await registrationService.getStudentLinks({
                adminId,
                schoolId: school!.id,
                type: 'STUDENT',
            })

            const enrichedLinks = await Promise.all(
                teacherLinks.map(async link => {
                    const fullLink = `${process.env.FRONTEND_URL}/register/${link.id}`
                    const qrCode = await QRCode.toDataURL(fullLink)
                    return {
                        ...link.toJSON(),
                        url: fullLink,
                        qrCode, // base64 QR image string
                    }
                }),
            )

            const response = ResponseUtil.success(
                enrichedLinks,
                'Student Registration Links with QR Codes',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            const response = ResponseUtil.error(
                error instanceof Error ? error.message : 'Unknown error',
                500,
                'Error Getting Teacher Registration Links',
            )
            res.status(response.statusCode).json(response)
        }
    }
    static async getTeacherRegistrationLinkByAdminId(
        req: Request,
        res: Response,
    ) {
        const cookie = req.cookies.token
        if (!cookie) throw new Error('Token Missing')
        const decodedToken = jwt.verify(
            cookie,
            process.env.JWT_SECRET!,
        ) as CurrentUserPayload
        const adminId = decodedToken.userId
        try {
            const teacherLink =
                await registrationService.getTeacherLinkById(adminId)
            if (!teacherLink)
                throw new Error('There is no teacher link found with this id')
            const response = ResponseUtil.success(
                teacherLink,
                'Teacher Link retrieved successfully ',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            console.log(`[DEBUG:RegistrationLInk] :[${error}]`)
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    'Failed to retrieve teacher link information ',
                    400,
                )
                res.status(response.statusCode).json(response)
            }
        }
    }
    static async getStudentRegistrationLinkWithId(req: Request, res: Response) {
        const { id } = req.params

        try {
            const studentLink = await registrationService.getStudentLinkById(id)
            if (!studentLink) throw new Error('No link with this Id found')
            const response = ResponseUtil.success(
                studentLink,
                'Student Link retrieved successfully ',
                200,
            )
            res.status(response.statusCode).json(response)
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                const response = ResponseUtil.error(
                    'Failed to retrieve student link information ',
                    400,
                )
                res.status(response.statusCode).json(response)
            }
        }
    }
}
