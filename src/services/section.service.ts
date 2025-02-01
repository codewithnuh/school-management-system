import sequelize from '@/config/database'
import { Section } from '@/models/Section'
import { SectionTeacher } from '@/models/SectionTeacher'
import { Teacher } from '@/models/Teacher'
import { CreateSectionInput } from '@/models/Section'

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
            include: [{ model: Teacher, as: 'classTeacher' }],
        })
    }

    static async getSectionById(id: number) {
        return Section.findByPk(id, {
            include: [{ model: Teacher, as: 'classTeacher' }],
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
