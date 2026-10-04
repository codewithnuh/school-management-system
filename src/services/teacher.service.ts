// src/services/teacher.service.ts
import {
    ApplicationStatus,
    Teacher,
    TeacherAttributes,
} from '@/models/Teacher.js'
import { Op, type Includeable, type WhereOptions } from 'sequelize'
import bcrypt from 'bcryptjs'
import { logger } from '@/middleware/loggin.middleware.js'
import { User } from '@/models/User.js'
import { Subject } from '@/models/Subject.js'
import type { UserAttributes } from '@/models/User.js'

class TeacherService {
    /**
     * Register a new teacher
     */
    async registerTeacher(data: TeacherAttributes) {
        try {
            // Check if teacher already exists
            const existingTeacher = await Teacher.findOne({
                where: {
                    [Op.or]: [{ email: data.email }, { cnic: data.cnic }],
                },
            })

            if (existingTeacher) {
                throw new Error(
                    'Teacher with this email or CNIC already exists',
                )
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(
                data.password as string,
                10,
            )

            // Create teacher
            const teacher = await Teacher.create({
                ...data, // Ensure schoolId is included
                password: hashedPassword,
                isVerified: false,
                role: 'TEACHER',
                applicationStatus: 'Pending',
            })

            logger.info('New teacher registered successfully', {
                teacherId: teacher.id,
                email: teacher.email,
            })

            return teacher
        } catch (error) {
            logger.error('Teacher registration failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            })
            throw error
        }
    }
    async createTeacher(data: TeacherAttributes) {
        try {
            // Check if teacher already exists
            const existingTeacher = await Teacher.findOne({
                where: {
                    [Op.or]: [{ email: data.email }, { cnic: data.cnic }],
                },
            })

            if (existingTeacher) {
                throw new Error(
                    'Teacher with this email or CNIC already exists',
                )
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(
                data.password as string,
                10,
            )

            // Create teacher
            const teacher = await Teacher.create({
                ...data, // Ensure schoolId is included
                password: hashedPassword,
                isVerified: true,
                role: 'TEACHER',
                applicationStatus: 'Accepted',
            })

            logger.info('New teacher registered successfully', {
                teacherId: teacher.id,
                email: teacher.email,
            })

            return teacher
        } catch (error) {
            logger.error('Teacher registration failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            })
            throw error
        }
    }
    async getAllTeachersBySchoolId(schoolId: number) {
        const teachers = await Teacher.findAll({
            where: {
                schoolId,
            },
        })
        return teachers
    }
    async getTeachersCount() {
        const teachers = await Teacher.findAll()
        const count = teachers.length
        return count
    }
    /**
     * Get all teachers with pagination, sorting, filtering
     */
    async getTeachers(query: {
        page?: number | string
        limit?: number | string
        sortBy?: string
        sortOrder?: 'ASC' | 'DESC'
        search?: string
        schoolId: number
        subjectId?: number | string | null
    }) {
        try {
            // Parse pagination parameters, ensuring proper type conversion
            const page =
                typeof query.page === 'string'
                    ? parseInt(query.page, 10) || 1
                    : query.page || 1
            const limit =
                typeof query.limit === 'string'
                    ? parseInt(query.limit, 10) || 10
                    : query.limit || 10
            const offset = (page - 1) * limit

            // Sorting parameters
            const allowedSortFields = ['createdAt', 'employeeId', 'experience'] as const
            const sortBy =
                allowedSortFields.find(field => field === query.sortBy) ?? 'createdAt'
            const sortOrder = query.sortOrder || 'ASC'

            // Filter parameters
            const search = query.search
            const schoolId = query.schoolId
            const subjectId =
                query.subjectId !== undefined && query.subjectId !== null
                    ? typeof query.subjectId === 'string'
                        ? parseInt(query.subjectId, 10)
                        : query.subjectId
                    : null

            const whereConditions: WhereOptions<TeacherAttributes> = { schoolId }
            const include: Includeable[] = []
            const normalizedSearch = search?.trim()
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
            if (subjectId !== null) {
                include.push({
                    model: Subject,
                    as: 'subjects',
                    attributes: ['id', 'name', 'code'],
                    where: { id: subjectId },
                    through: { attributes: [] },
                    required: true,
                })
            }

            return await Teacher.findAndCountAll({
                where: whereConditions,
                limit,
                offset,
                include,
                distinct: true,
                order: [[sortBy, sortOrder]],
                // include: [{
                //     model: Subject, // Make sure Subject model is imported and associated
                //     attributes: ['id', 'name', 'description'],
                //     where: { deletedAt: null } // Ensure only non-soft-deleted subjects are included
                // }],
            })
        } catch (error) {
            logger.error('Error retrieving teachers:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            })
            throw error
        }
    }

    /**
     * Get teacher by ID
     */
    async getTeacherById(id: string) {
        return await Teacher.findByPk(id, {
            attributes: {
                exclude: ['cvPath', 'verificationDocument', 'password'],
            },
            include: ['sections'], // Assumes you have associations set up
        })
    }

    /**
     * Update teacher application status
     */
    async processApplication(teacherId: number, status: ApplicationStatus) {
        const teacher = await Teacher.findByPk(teacherId)
        if (!teacher) {
            throw new Error('Teacher not found')
        }

        teacher.applicationStatus = status
        await teacher.save()

        return teacher
    }

    /**
     * Get unregistered teachers (pending/interviewing)
     */
    async getUnregisteredTeachers(query: { page?: number; limit?: number }) {
        const page = parseInt(query.page as unknown as string) || 1
        const limit = parseInt(query.limit as unknown as string) || 10
        const offset = (page - 1) * limit

        return await Teacher.findAndCountAll({
            where: {
                isVerified: false,
                applicationStatus: {
                    [Op.in]: ['Pending', 'Interview'],
                },
            },
            limit,
            offset,
            attributes: {
                exclude: ['cvPath', 'verificationDocument', 'password'],
            },
            order: [['createdAt', 'DESC']],
        })
    }
    async updateTeacherById(teacherId: number, data: TeacherAttributes) {
        const teacher = await Teacher.findOne({
            where: {
                id: teacherId,
            },
        })
        if (!teacher) throw new Error('No Teacher Found')
        const updatedTeacher = await teacher.update({ ...data })
        return updatedTeacher
    }
}

export const teacherService = new TeacherService()
