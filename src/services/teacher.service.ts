import { randomUUID } from 'node:crypto'
import { Op, type Includeable, type WhereOptions } from 'sequelize'
import bcrypt from 'bcryptjs'
import { ApplicationStatus, Teacher, type TeacherAttributes, type TeacherApplicationStatus } from '@/models/Teacher.js'
import { User, type UserAttributes } from '@/models/User.js'
import { Subject } from '@/models/Subject.js'
import sequelize from '@/infrastructure/persistence/sequelize/client.js'
import { ConflictError, NotFoundError } from '@/errors/index.js'
import { logger } from '@/middleware/loggin.middleware.js'
import type { teacherSchema } from '@/schema/teacher.schema.js'
import type { z } from 'zod'

type TeacherRegistrationInput = z.infer<typeof teacherSchema>

class TeacherService {
    private async createTeacherRecord(
        data: TeacherRegistrationInput,
        approved: boolean,
    ): Promise<Teacher> {
        const passwordHash = data.password
            ? await bcrypt.hash(data.password, 12)
            : null

        return sequelize.transaction(async transaction => {
            const existingUser = await User.findOne({
                where: { email: data.email },
                transaction,
            })
            if (existingUser) throw new ConflictError('A user with this email already exists')

            const user = await User.create(
                {
                    email: data.email,
                    passwordHash,
                    role: 'TEACHER',
                    schoolId: data.schoolId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phoneNo,
                    isVerified: approved,
                },
                { transaction },
            )

            return Teacher.create(
                {
                    userId: user.id,
                    schoolId: data.schoolId,
                    employeeCode: randomUUID(),
                    qualification: data.highestQualification,
                    specialization: data.specialization ?? null,
                    experienceYears: data.experienceYears ?? 0,
                    joiningDate: data.joiningDate ?? new Date(),
                    dateOfBirth: data.dateOfBirth ?? null,
                    gender: data.gender.toUpperCase() as TeacherAttributes['gender'],
                    address: data.address ?? null,
                    emergencyContactName: data.emergencyContactName ?? null,
                    emergencyContactPhone: data.emergencyContactNumber ?? null,
                    isVerified: approved,
                    verificationDocument: data.verificationDocument ?? null,
                    cvPath: data.cvPath ?? null,
                    applicationStatus: approved
                        ? ApplicationStatus.Accepted
                        : ApplicationStatus.Pending,
                },
                { transaction },
            )
        })
    }

    async registerTeacher(data: TeacherRegistrationInput): Promise<Teacher> {
        try {
            const teacher = await this.createTeacherRecord(data, false)
            logger.info('Teacher registration submitted', { teacherId: teacher.id })
            return teacher
        } catch (error) {
            logger.error('Teacher registration failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
            })
            throw error
        }
    }

    async createTeacher(data: TeacherRegistrationInput): Promise<Teacher> {
        const teacher = await this.createTeacherRecord(data, true)
        logger.info('Teacher created', { teacherId: teacher.id })
        return teacher
    }

    async getAllTeachersBySchoolId(schoolId: number): Promise<Teacher[]> {
        return Teacher.findAll({
            where: { schoolId, isActive: true },
            include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }],
            order: [['createdAt', 'DESC']],
        })
    }

    async getTeachersCount(schoolId?: number): Promise<number> {
        return Teacher.count({ where: schoolId ? { schoolId } : undefined })
    }

    async getTeachers(query: {
        page?: number | string
        limit?: number | string
        sortBy?: string
        sortOrder?: 'ASC' | 'DESC'
        search?: string
        schoolId: number
        subjectId?: number | string | null
    }) {
        const page = Math.max(1, Number(query.page) || 1)
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 10))
        const allowedSortFields = ['createdAt', 'employeeCode', 'experienceYears'] as const
        const sortBy = allowedSortFields.find(field => field === query.sortBy) ?? 'createdAt'
        const sortOrder = query.sortOrder ?? 'ASC'
        const where: WhereOptions<TeacherAttributes> = { schoolId: query.schoolId, isActive: true }
        const include: Includeable[] = []
        const normalizedSearch = query.search?.trim()

        if (normalizedSearch) {
            const pattern = `%${normalizedSearch}%`
            const userWhere: WhereOptions<UserAttributes> = {
                [Op.or]: [
                    { firstName: { [Op.iLike]: pattern } },
                    { lastName: { [Op.iLike]: pattern } },
                    { email: { [Op.iLike]: pattern } },
                ],
            }
            include.push({
                model: User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
                where: userWhere,
                required: true,
            })
        }

        if (query.subjectId !== undefined && query.subjectId !== null) {
            const subjectId = Number(query.subjectId)
            if (Number.isSafeInteger(subjectId) && subjectId > 0) {
                include.push({
                    model: Subject,
                    as: 'subjects',
                    attributes: ['id', 'name', 'code'],
                    where: { id: subjectId },
                    through: { attributes: [] },
                    required: true,
                })
            }
        }

        return Teacher.findAndCountAll({
            where,
            limit,
            offset: (page - 1) * limit,
            include,
            distinct: true,
            order: [[sortBy, sortOrder]],
        })
    }

    async getTeacherById(id: number): Promise<Teacher | null> {
        return Teacher.findByPk(id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
                { model: Subject, as: 'subjects', attributes: ['id', 'name', 'code'], through: { attributes: [] } },
            ],
        })
    }

    async processApplication(
        teacherId: number,
        status: TeacherApplicationStatus,
    ): Promise<Teacher> {
        const teacher = await Teacher.findByPk(teacherId)
        if (!teacher) throw new NotFoundError('Teacher')
        await sequelize.transaction(async transaction => {
            await teacher.update({ applicationStatus: status, isVerified: status === ApplicationStatus.Accepted }, { transaction })
            await User.update(
                { isVerified: status === ApplicationStatus.Accepted },
                { where: { id: teacher.userId }, transaction },
            )
        })
        return teacher
    }

    async getUnregisteredTeachers(query: { page?: number | string; limit?: number | string }) {
        const page = Math.max(1, Number(query.page) || 1)
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 10))
        return Teacher.findAndCountAll({
            where: {
                isVerified: false,
                applicationStatus: { [Op.in]: [ApplicationStatus.Pending, ApplicationStatus.Interview] },
            },
            limit,
            offset: (page - 1) * limit,
            include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }],
            order: [['createdAt', 'DESC']],
        })
    }

    async updateTeacherById(
        teacherId: number,
        data: Partial<TeacherAttributes>,
    ): Promise<Teacher> {
        const teacher = await Teacher.findByPk(teacherId)
        if (!teacher) throw new NotFoundError('Teacher')
        await teacher.update(data)
        return teacher
    }
}

export const teacherService = new TeacherService()
