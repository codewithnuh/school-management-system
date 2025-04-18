import sequelize from '@/config/database.js'
import { Class, Timetable, TimetableEntry } from '@/models/index.js'
import { CreateSectionInput, Section } from '@/models/Section.js'
import { SectionTeacher } from '@/models/SectionTeacher.js'
import { Teacher } from '@/models/Teacher.js'
export class SectionService {
    static async createSection(input: CreateSectionInput) {
        const transaction = await sequelize.transaction()
        try {
            const section = await Section.create(input, { transaction })

            for (const [subjectId, teacherId] of Object.entries(
                input.subjectTeachers,
            )) {
                const teacher = await Teacher.findOne({
                    where: { id: teacherId, subjectId: Number(subjectId) },
                    transaction,
                })

                if (!teacher) {
                    throw new Error(
                        `Teacher ${teacherId} is not qualified for subject ${subjectId}`,
                    )
                }

                await SectionTeacher.create(
                    {
                        sectionId: section.id,
                        subjectId: Number(subjectId),
                        teacherId: teacherId,
                    },
                    { transaction },
                )
            }

            await transaction.commit()
            return section
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async getAllSections(classId: number) {
        return Section.findAll({
            where: { classId },
            include: [Teacher, Class],
        })
    }

    static async getSectionById(id: number) {
        return Section.findByPk(id, {
            include: [
                { model: Teacher },
                { model: Timetable },
                { model: TimetableEntry },
            ],
        })
    }

    /**
     * Get all sections by teacher ID and optionally filtered by class ID
     * @param teacherId - The ID of the teacher
     * @param classId - Optional: The ID of the class to filter by
     * @returns Array of Section instances
     */
    static async getSectionsByTeacherAndClass(
        teacherId: number,
        classId?: number,
    ) {
        // Find all section IDs where the teacher teaches
        const sectionTeachers = await SectionTeacher.findAll({
            where: { teacherId },
            attributes: ['sectionId'],
        })

        const sectionIds = sectionTeachers.map(st => st.sectionId)

        if (sectionIds.length === 0) {
            return [] // Return empty array if teacher doesn't teach any sections
        }

        // Build the query
        const whereClause: any = { id: sectionIds }

        // Add classId filter if provided
        if (classId) {
            whereClause.classId = classId
        }

        // Fetch sections with related models
        return Section.findAll({
            where: whereClause,
            include: [
                { model: Teacher },
                { model: Class },
                {
                    model: SectionTeacher,
                    where: { teacherId },
                    required: false, // Use left join to ensure we get the section even if the relationship might be missing
                },
            ],
        })
    }

    static async updateSection(id: number, input: CreateSectionInput) {
        const transaction = await sequelize.transaction()
        try {
            const [updatedCount] = await Section.update(input, {
                where: { id },
                transaction,
            })

            if (updatedCount === 0) {
                throw new Error('Section not found') // Or return a 404
            }

            await SectionTeacher.destroy({
                where: { sectionId: id },
                transaction,
            }) // Clear existing assignments

            for (const [subjectId, teacherId] of Object.entries(
                input.subjectTeachers,
            )) {
                const teacher = await Teacher.findOne({
                    where: { id: teacherId, subjectId: Number(subjectId) },
                    transaction,
                })

                if (!teacher) {
                    throw new Error(
                        `Teacher ${teacherId} is not qualified for subject ${subjectId}`,
                    )
                }

                await SectionTeacher.create(
                    {
                        sectionId: id,
                        subjectId: Number(subjectId),
                        teacherId: teacherId,
                    },
                    { transaction },
                )
            }

            await transaction.commit()
            return await Section.findByPk(id, {
                include: [{ model: Teacher, as: 'classTeacher' }],
            }) // Return the updated section with includes.
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async deleteSection(id: number) {
        const transaction = await sequelize.transaction()
        try {
            await SectionTeacher.destroy({
                where: { sectionId: id },
                transaction,
            })
            const deletedCount = await Section.destroy({
                where: { id },
                transaction,
            })

            if (deletedCount === 0) {
                throw new Error('Section not found')
            }

            await transaction.commit()
            return deletedCount
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}
