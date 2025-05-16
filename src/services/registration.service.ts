import { RegistrationLink } from '@/models/RegistrationLinks.js'
import { Op } from 'sequelize'
class RegistrationService {
    async generateLink({
        type,
        createdBy,
        schoolId,
        isActive,
        expiresAt,
    }: {
        type: 'TEACHER' | 'STUDENT'
        createdBy: number
        schoolId: number
        isActive: boolean
        expiresAt?: Date
    }) {
        const existedLink = await RegistrationLink.findOne({
            where: {
                createdBy,
                type,
                expiresAt,
            },
        })

        if ((existedLink?.expiresAt ?? new Date(0)) < new Date()) {
            existedLink?.destroy()
        } else if (existedLink?.expiresAt ?? new Date(0) < new Date()) {
            throw new Error('Link already created')
        }

        const newLink = await RegistrationLink.create({
            type,
            createdBy,
            schoolId,
            isActive,
            expiresAt: expiresAt || new Date(Date.now() + 48 * 60 * 60 * 1000),
        })
        return newLink
    }

    async deleteLink({
        type,
        createdBy,
        schoolId,
    }: {
        type: 'TEACHER' | 'STUDENT'
        createdBy: number
        schoolId: number
    }) {
        const link = await RegistrationLink.findOne({
            where: {
                type,
                createdBy,
                schoolId,
            },
        })

        if (!link) throw new Error('No link found')
        await link.destroy()
    }
    async getTeacherLinks({
        type,
        adminId,
        schoolId,
    }: {
        adminId: number
        schoolId: number
        type: 'TEACHER'
    }) {
        const teacherLinks = await RegistrationLink.findAll({
            where: {
                type: type,
                schoolId: schoolId,
                createdBy: adminId,
                isActive: true,
                expiresAt: {
                    [Op.gt]: new Date(),
                },
            },
        })
        if (!teacherLinks) return []

        return teacherLinks
    }
    async getStudentLinks({
        type,
        adminId,
        schoolId,
    }: {
        type: 'STUDENT'
        adminId: number
        schoolId: number
    }) {
        return (
            (await RegistrationLink.findAll({
                where: {
                    type,
                    schoolId,
                    createdBy: adminId,
                    isActive: true,
                    expiresAt: {
                        [Op.gt]: new Date(),
                    },
                },
            })) || []
        )
    }

    async getTeacherLinkById(id: string) {
        const teacherLink = await RegistrationLink.findOne({
            where: {
                id,
            },
            attributes: { exclude: ['adminId'] },
        })
        if (!teacherLink) throw new Error('No teacher Link found')
        return teacherLink
    }
    async getStudentLinkById(id: string) {
        const studentLink = await RegistrationLink.findOne({
            where: {
                id: id,
            },
            attributes: { exclude: ['adminId'] },
        })
        if (!studentLink) throw new Error('No teacher Link found')
        return studentLink
    }
}

export const registrationService = new RegistrationService()
