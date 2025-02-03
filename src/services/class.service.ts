import sequelize from '@/config/database.js'
import { Class } from '@/models/Class.js'
import { Section } from '@/models/section.js'
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
            const updatedClass = await Class.update(input, {
                where: { id },
                transaction,
            })

            // Update Sections (more complex, requires careful handling)
            // 1. Delete existing sections for the class
            await Section.destroy({ where: { classId: id }, transaction })

            // 2. Create new sections based on the input:
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
            return updatedClass
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    static async deleteClass(id: number) {
        const transaction = await sequelize.transaction()
        try {
            await Section.destroy({ where: { classId: id }, transaction }) // Delete associated sections first
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
