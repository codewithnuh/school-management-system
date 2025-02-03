// models/SectionTeacher.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript'
import { Section, Subject, Teacher } from '@/models/index.js'
import { z } from 'zod'

export const SectionTeacherSchema = z.object({
    sectionId: z.number().positive(),
    subjectId: z.number().positive(),
    teacherId: z.number().positive(),
})

export type SectionTeacherAttributes = z.infer<typeof SectionTeacherSchema>

@Table({ tableName: 'section_teachers', timestamps: true })
export class SectionTeacher
    extends Model<SectionTeacherAttributes>
    implements SectionTeacherAttributes
{
    @ForeignKey(() => Section)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    sectionId!: number

    @BelongsTo(() => Section)
    section!: Section

    @ForeignKey(() => Subject)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    subjectId!: number

    @BelongsTo(() => Subject)
    subject!: Subject

    @ForeignKey(() => Teacher)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    teacherId!: number

    @BelongsTo(() => Teacher)
    teacher!: Teacher
    static async validateAssignment(input: SectionTeacherAttributes) {
        // 1. Check if the teacher is qualified for the subject
        const teacher = await Teacher.findOne({
            where: { id: input.teacherId, subjectId: input.subjectId },
        })
        if (!teacher) {
            throw new Error(
                `Teacher ${input.teacherId} is not qualified for subject ${input.subjectId}`,
            )
        }
        const existing = await SectionTeacher.findOne({
            where: {
                sectionId: input.sectionId,
                subjectId: input.subjectId,
                teacherId: input.teacherId,
            },
        })
        if (existing) {
            throw new Error(
                'Duplicate assignment for section, subject, and teacher',
            )
        }
    }
}
