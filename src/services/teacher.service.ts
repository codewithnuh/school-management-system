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
            const sortBy = query.sortBy || 'createdAt'
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

            // Build where conditions with proper typing
            const whereConditions: WhereOptions<TeacherAttributes> = {
                schoolId: schoolId,
            }

            // Build search condition if provided
            if (search && search.trim() !== '') {
                whereConditions[Op.and] = [
                    // Keep the schoolId condition within the AND array to ensure it's always applied
                    { schoolId },
                    {
                        [Op.or]: [
                            { firstName: { [Op.iLike]: `%${search}%` } },
                            { lastName: { [Op.iLike]: `%${search}%` } },
                            { email: { [Op.iLike]: `%${search}%` } },
                            { cnic: { [Op.iLike]: `%${search}%` } },
                        ],
                    },
                ]
            }

            // Add subjectId filter if provided
            if (subjectId !== null) {
                if (whereConditions[Op.and]) {
                    // If we already have an AND condition, add the subjectId to it
                    ;(whereConditions[Op.and] as any[]).push({ subjectId })
                } else {
                    // Otherwise, create a new AND condition that includes schoolId
                    whereConditions[Op.and] = [{ schoolId }, { subjectId }]
                }
            }

            return await Teacher.findAndCountAll({
                where: whereConditions,
                limit,
                offset,
                attributes: {
                    exclude: ['password'],
                },
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
