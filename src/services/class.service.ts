import sequelize from '@/config/database.js'
import { Class } from '@/models/Class.js'
import { Section } from '@/models/Section.js'
import { SectionTeacher } from '@/models/SectionTeacher.js'
import { Teacher } from '@/models/Teacher.js'
import { CreateClassInput } from '@/models/Class.js' // Import your types

// Class Service
export class ClassService {
    static async createClass(input: CreateClassInput) {
        const transaction = await sequelize.transaction()
        try {
            // 1. Create the class FIRST
            const newClass = await Class.create(input, { transaction })

            // 2. NOW create the sections, using the newClass.id
            for (const sectionInput of input.sections) {
                const section = await Section.create(
                    {
                        ...sectionInput,
                        classId: newClass.id,
                        name: sectionInput!.name!,
                        maxStudents: sectionInput!.maxStudents!,
                        classTeacherId: sectionInput!.classTeacherId!,
                        subjectTeachers: sectionInput!.subjectTeachers!,
                    }, // Ensure all required fields are provided
                    { transaction },
                )

                // 3. Create SectionTeacher records (if applicable)
                for (const [subjectId, teacherId] of Object.entries(
                    sectionInput!.subjectTeachers,
                )) {
                    const teacher = await Teacher.findOne({
                        where: { id: teacherId, subjectId: Number(subjectId) }, // Verify teacher qualification
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
            }

            await transaction.commit()
            return newClass
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async getAllClasses() {
        return Class.findAll({ include: [Section] }) // Include sections in the result
    }

    static async getClassById(id: number) {
        return Class.findByPk(id, { include: [Section] })
    }

    static async updateClass(id: number, input: CreateClassInput) {
        const transaction = await sequelize.transaction()
        try {
            // Update basic class information
            await Class.update(input, {
                where: { id },
                transaction,
            })

            // Get all existing sections for this class
            const existingSections = await Section.findAll({
                where: { classId: id },
                transaction,
            })

            // 1. First, delete all section_teachers records for these sections
            for (const section of existingSections) {
                await SectionTeacher.destroy({
                    where: { sectionId: section.id },
                    transaction,
                })
            }

            // 2. Now it's safe to delete the sections
            await Section.destroy({
                where: { classId: id },
                transaction,
            })

            // 3. Create new sections based on the input
            for (const sectionInput of input.sections) {
                const section = await Section.create(
                    {
                        ...sectionInput,
                        classId: id,
                        name: sectionInput!.name!,
                        maxStudents: sectionInput!.maxStudents!,
                        classTeacherId: sectionInput!.classTeacherId!,
                        subjectTeachers: sectionInput!.subjectTeachers!,
                    },
                    { transaction },
                )

                // Subject Teacher assignment
                for (const [subjectId, teacherId] of Object.entries(
                    sectionInput!.subjectTeachers,
                )) {
                    // Skip if teacherId is 0 (no teacher assigned)
                    if (!teacherId) continue

                    const teacher = await Teacher.findOne({
                        where: { id: teacherId, subjectId: Number(subjectId) }, // Check if teacher is qualified for the subject
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
            }

            await transaction.commit()

            // Return the updated class with its sections
            return await Class.findByPk(id, {
                include: [Section],
                transaction: null, // Use a new transaction or no transaction
            })
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async deleteClass(id: number) {
        const transaction = await sequelize.transaction()
        try {
            // Get all sections for this class
            const sections = await Section.findAll({
                where: { classId: id },
                transaction,
            })

            // Delete section_teachers records first
            for (const section of sections) {
                await SectionTeacher.destroy({
                    where: { sectionId: section.id },
                    transaction,
                })
            }

            // Now it's safe to delete the sections
            await Section.destroy({
                where: { classId: id },
                transaction,
            })

            // Finally delete the class
            const deletedClass = await Class.destroy({
                where: { id },
                transaction,
            })

            await transaction.commit()
            return deletedClass
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}
