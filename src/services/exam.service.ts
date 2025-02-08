import sequelize from '@/config/database.js'
import {
    Exam,
    Class,
    Section,
    StudentExam,
    SectionTeacher,
    User,
} from '@/models/index.js' // Import all relevant models
import { ExamAttributes, examSchema } from '@/models/Exam.js' // Import types and schema

export class ExamService {
    static async createExam(input: ExamAttributes) {
        examSchema.parse(input) // OWASP: Input Validation - against injection, data integrity
        const transaction = await sequelize.transaction()
        try {
            const newExam = await Exam.create(input, { transaction })

            // Initialize StudentExam records for all students in the class/sections for each subject
            const classSubjects = await Class.findOne({
                where: { id: input.classId },
                attributes: ['subjectIds'], // Only fetch subjectIds
            })

            if (!classSubjects || !classSubjects.subjectIds) {
                throw new Error(
                    `Class with ID ${input.classId} not found or has no subjects.`,
                ) // Basic error handling
            }

            const subjectIds = classSubjects.subjectIds as number[] // Assuming subjectIds is number[]

            let sectionsToEnroll: Section[] = []
            if (input.sectionId) {
                const section = await Section.findByPk(input.sectionId, {
                    transaction,
                })
                if (section) {
                    sectionsToEnroll = [section]
                }
            } else {
                sectionsToEnroll = await Section.findAll({
                    where: { classId: input.classId },
                    transaction,
                })
            }

            for (const section of sectionsToEnroll) {
                const students = await User.findAll({
                    where: {
                        classId: input.classId,
                        sectionId: section.id,
                        entityType: 'STUDENT',
                    },
                    transaction,
                }) // Get students in the section
                for (const subjectId of subjectIds) {
                    for (const student of students) {
                        await StudentExam.create(
                            {
                                examId: newExam.id,
                                studentId: student.id,
                                subjectId: subjectId,
                                sectionId: section.id,
                                studentExamId: newExam.id,
                                markingStatus: 'Pending',
                            },
                            { transaction },
                        )
                    }
                }
            }

            await transaction.commit()
            return newExam // OWASP: Least Privilege - returns only necessary data
        } catch (error) {
            await transaction.rollback()
            throw error // OWASP: Error Handling - generic error for security, detailed logging server-side
        }
    }

    static async getAllExams() {
        return Exam.findAll({ include: [Class, Section] }) // Include related models for richer data
    }

    static async getExamById(id: number) {
        return Exam.findByPk(id, { include: [Class, Section] })
    }

    static async updateExam(id: number, input: ExamAttributes) {
        examSchema.parse(input) // OWASP: Input Validation - against injection, data integrity
        const transaction = await sequelize.transaction()
        try {
            const updatedExam = await Exam.update(input, {
                where: { examId: id },
                transaction,
            })
            await transaction.commit()
            return updatedExam // OWASP: Least Privilege - returns only necessary data
        } catch (error) {
            await transaction.rollback()
            throw error // OWASP: Error Handling - generic error for security, detailed logging server-side
        }
    }

    static async deleteExam(id: number) {
        const transaction = await sequelize.transaction()
        try {
            //  Consider cascading deletes or handling related records (StudentExams, Results) if needed
            const deletedExam = await Exam.destroy({
                where: { examId: id },
                transaction,
            })
            await transaction.commit()
            return deletedExam
        } catch (error) {
            await transaction.rollback()
            throw error // OWASP: Error Handling - generic error for security, detailed logging server-side
        }
    }

    //  Service to check marking completion for an exam (as discussed previously)
    static async isMarkingCompleted(examId: number): Promise<boolean> {
        const exam = await Exam.findByPk(examId, {
            include: [
                {
                    model: Class,
                    attributes: ['subjectIds'],
                    include: [
                        {
                            model: Section,
                            attributes: ['id'],
                            include: [
                                {
                                    model: SectionTeacher,
                                    attributes: ['subjectId', 'teacherId'],
                                },
                            ],
                        },
                    ],
                },
            ],
        })

        if (!exam || !exam.class || !exam.class.subjectIds) {
            return false // Exam or class not found or no subjects
        }

        // const requiredSubjectCount = exam.class.subjectIds.length
        const sections = exam.class.sections || []

        for (const section of sections) {
            const studentsInSection = await User.count({
                where: {
                    sectionId: section.id,
                    entityType: 'STUDENT',
                    classId: exam.classId,
                },
            })
            for (const subjectId of exam.class.subjectIds) {
                const markedCount = await StudentExam.count({
                    where: {
                        examId: examId,
                        sectionId: section.id,
                        subjectId: subjectId,
                        markingStatus: 'Completed',
                    },
                })
                if (markedCount < studentsInSection) {
                    return false // Marking incomplete for this section/subject
                }
            }
        }

        return true // Marking completed for all sections and subjects
    }

    // Service to publish exam results
    static async publishExamResults(examId: number) {
        const transaction = await sequelize.transaction()
        try {
            const isCompleted = await ExamService.isMarkingCompleted(examId) // Ensure marking is complete before publishing
            if (!isCompleted) {
                throw new Error(
                    'Marking is not yet complete for this exam. Cannot publish results.',
                ) // Prevent premature publishing
            }

            await Exam.update(
                { isPublished: true },
                { where: { examId: examId }, transaction },
            ) // Update exam status to published
            await transaction.commit()
            return { message: 'Exam results published successfully' } // Success message
        } catch (error) {
            await transaction.rollback()
            throw error // OWASP: Error Handling
        }
    }
}
