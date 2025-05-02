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
        const newLink = await RegistrationLink.create({
            type,
            createdBy,
            schoolId,
            isActive,
            expiresAt: expiresAt || new Date(Date.now() + 48 * 60 * 60 * 1000),
        })
        return newLink
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
        const studentLinks = await RegistrationLink.findAll({
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
        if (!studentLinks) return []
        return studentLinks
    }
}

export const registrationService = new RegistrationService()
