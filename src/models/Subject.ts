import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    HasMany,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript'
import {
    createSubjectSchema,
    type CreateSubject,
    type SubjectRecord,
} from '@/modules/subjects/domain/subject.js'

export const SubjectSchema = createSubjectSchema
export type SubjectAttributes = SubjectRecord

@Table({
    tableName: 'subjects',
    timestamps: true,
    underscored: true,
})
export class Subject
    extends Model<SubjectAttributes, CreateSubject>
    implements SubjectAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'school_id',
    })
    schoolId!: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: 'unique_school_subject_code',
    })
    code!: string

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description!: string | null

    @Column({
        type: DataType.ENUM('CORE', 'ELECTIVE', 'EXTRA_CURRICULAR'),
        allowNull: false,
        defaultValue: 'CORE',
    })
    category!: 'CORE' | 'ELECTIVE' | 'EXTRA_CURRICULAR'

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    credits!: number

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
    })
    isActive!: boolean

    @CreatedAt
    @Column({ type: DataType.DATE, field: 'created_at' })
    createdAt!: Date

    @UpdatedAt
    @Column({ type: DataType.DATE, field: 'updated_at' })
    updatedAt!: Date
}
