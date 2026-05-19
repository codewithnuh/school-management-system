import { Table, Column, Model, DataType, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript'
import { z } from 'zod'

export const SectionTeacherSchema = z.object({
  id: z.number().optional(),
  sectionId: z.number(),
  teacherId: z.number(),
  subjectId: z.number(),
  academicYearId: z.number().optional(),
})

export type SectionTeacherAttributes = z.infer<typeof SectionTeacherSchema> & {
  id: number
  createdAt: Date
  updatedAt: Date
}

@Table({
  tableName: 'section_teachers',
  timestamps: true,
  underscored: true,
})
export class SectionTeacher extends Model<SectionTeacherAttributes> implements SectionTeacherAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'section_id',
    unique: 'unique_section_teacher_subject',
  })
  sectionId!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'teacher_id',
    unique: 'unique_section_teacher_subject',
  })
  teacherId!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'subject_id',
    unique: 'unique_section_teacher_subject',
  })
  subjectId!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'academic_year_id',
  })
  academicYearId!: number | null

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date
}
