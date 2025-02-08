import sequelize from '@/config/database.js'
import {
    Result,
    Exam,
    StudentExam,
    Grade,
    User,
    Class,
    Section,
    Subject,
} from '@/models/index.js'
import { ResultAttributes, resultSchema } from '@/models/Result.js'

export class ResultService {
    // Service to generate results for a specific exam
    static async generateExamResults(
        examId: number,
    ): Promise<{ message: string }> {
        const transaction = await sequelize.transaction()
        try {
            // Fetch the exam including associated Class and Section data.
            const exam = await Exam.findByPk(examId, {
                include: [
                    { model: Class, include: [{ model: Subject }] }, // Include subjects associated with the class
                    { model: Section }, // Include sections for result breakdown if available.
                ],
            })
            if (!exam) {
                throw new Error(`Exam with ID ${examId} not found`)
            }
            // Fetch grades ordered by lowerPercentage descending.
            const grades = await Grade.findAll({
                order: [['lowerPercentage', 'DESC']],
            })
            // Get sections from exam or query all sections for the class.
            let sections: Section[] = []
            if (exam.sections) {
                sections = Array.isArray(exam.sections)
                    ? exam.sections
                    : [exam.sections]
            } else {
                sections = await Section.findAll({
                    where: { classId: exam.classId },
                })
            }
            // Loop through each section.
            for (const section of sections) {
                // Query for all students in the section with entityType 'STUDENT'.
                const students = await User.findAll({
                    where: {
                        sectionId: section.id,
                        classId: exam.classId,
                        entityType: 'STUDENT',
                    },
                    transaction,
                })
                // Process each student.
                for (const student of students) {
                    let totalMarksObtained = 0
                    // Ensure exam has associated class data with subjectIds.
                    if (
                        !exam.class ||
                        !exam.class ||
                        !Array.isArray(exam.class.subjectIds)
                    ) {
                        throw new Error(
                            'Exam is missing associated class subjects',
                        )
                    }
                    // Sum marks for each subject.

                    for (const subject of exam.class.subjectIds) {
                        const studentExamRecord = await StudentExam.findOne({
                            where: {
                                examId: examId,
                                studentId: student.id,
                                subjectId: subject,
                            },
                            transaction,
                        })

                        if (
                            studentExamRecord &&
                            studentExamRecord.marksObtained !== null
                        ) {
                            totalMarksObtained += Number(
                                studentExamRecord.marksObtained,
                            )
                        }
                    }
                    // Default result status is Fail if not meeting passing criteria.
                    let overallGrade: string | null = null
                    let resultStatus: 'Pass' | 'Fail' | 'Pending' = 'Fail'
                    // Check if student has passed based on exam passing marks.
                    if (
                        exam.passingMarks != null &&
                        totalMarksObtained >= Number(exam.passingMarks)
                    ) {
                        resultStatus = 'Pass'
                    }
                    // Determine the grade based on percentage.
                    const percentage =
                        exam.totalMarks > 0
                            ? (totalMarksObtained / Number(exam.totalMarks)) *
                              100
                            : 0
                    for (const grade of grades) {
                        if (
                            exam.totalMarks > 0 &&
                            percentage >= Number(grade.lowerPercentage) &&
                            percentage <= Number(grade.upperPercentage)
                        ) {
                            overallGrade = grade.gradeName
                            break
                        }
                    }
                    const resultInput: ResultAttributes = {
                        examId: examId,
                        studentId: student.id,
                        classId: exam.classId,
                        totalMarksObtained: totalMarksObtained,
                        percentage: percentage,
                        overallGrade: overallGrade,
                        resultStatus: resultStatus,
                    }
                    // Validate result input using Zod schema
                    resultSchema.parse(resultInput)
                    // Instead of using upsert with a where clause (which is not supported),
                    // find an existing result and update it, or create a new one.
                    const existingResult = await Result.findOne({
                        where: { examId: examId, studentId: student.id },
                        transaction,
                    })
                    if (existingResult) {
                        await existingResult.update(resultInput, {
                            transaction,
                        })
                    } else {
                        await Result.create(resultInput, { transaction })
                    }
                }
            }
            await transaction.commit()
            return {
                message: `Results generated successfully for exam ${exam.examName}`,
            }
        } catch (error) {
            await transaction.rollback()
            throw error // Propagate error after rollback for proper error handling.
        }
    }
    static async getAllResults() {
        return Result.findAll({ include: [Exam, User, Class] })
    }
    static async getResultById(id: number) {
        return Result.findByPk(id, { include: [Exam, User, Class] })
    }
    // Additional methods (e.g., updateResult, deleteResult) can be implemented with input functionalities.
}
