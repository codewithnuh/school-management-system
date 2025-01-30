import sequelize from '@/config/database'
import { Section } from '@/models/Section'
import { SectionTeacher } from '@/models/SectionTeacher'
import { Teacher } from '@/models/Teacher'

// services/SectionService.ts
interface CreateSectionInput {
    name: string
    classId: number
    classTeacherId: number // General supervisor (not tied to a subject)
    subjectTeachers: { [subjectId: number]: number } // { subjectId: teacherId }
}

export class SectionService {
    static async createSection(input: CreateSectionInput) {
        const transaction = await sequelize.transaction()
        try {
            // 1. Validate class teacher exists
            const classTeacher = await Teacher.findByPk(input.classTeacherId)
            if (!classTeacher) throw new Error('Class teacher not found')

            // 2. Create the section
            const section = await Section.create(
                {
                    name: input.name,
                    classId: input.classId,
                    classTeacherId: input.classTeacherId,
                },
                { transaction },
            )

            // 3. Validate and assign subject teachers
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
            }

            // 4. Store subject-teacher assignments (optional)
            await SectionTeacher.bulkCreate(
                Object.entries(input.subjectTeachers).map(
                    ([subjectId, teacherId]) => ({
                        sectionId: section.id,
                        subjectId: Number(subjectId),
                        teacherId: teacherId,
                    }),
                ),
                { transaction },
            )

            await transaction.commit()
            return section
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}
