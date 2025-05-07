// src/services/teacher.service.ts
import {
    ApplicationStatus,
    Teacher,
    TeacherAttributes,
} from '@/models/Teacher.js'
import { Op, WhereOptions } from 'sequelize'
import bcrypt from 'bcryptjs'
import { logger } from '@/middleware/loggin.middleware.js'

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

    /**
     * Get all teachers with pagination, sorting, filtering
     */
    async getTeachers(query: {
        page?: number
        limit?: number
        sortBy?: string
        sortOrder?: 'ASC' | 'DESC'
        search?: string
    }) {
        const page = parseInt(query.page as unknown as string) || 1
        const limit = parseInt(query.limit as unknown as string) || 10
        const offset = (page - 1) * limit
        const sortBy = query.sortBy || 'createdAt'
        const sortOrder = query.sortOrder || 'ASC'
        const search = query.search

        const whereClause: WhereOptions<TeacherAttributes> = {}
        if (search) {
            whereClause.firstName = { [Op.iLike]: `%${search}%` }
        }

        return await Teacher.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: {
                exclude: ['password'],
            },
            order: [[sortBy, sortOrder]],
        })
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
}

export const teacherService = new TeacherService()
