import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript'
import { Class } from './Class'
import { Subject } from './Subject'

// models/ClassSubject.ts
@Table({ tableName: 'class_subjects' })
export class ClassSubject extends Model {
    @ForeignKey(() => Class)
    @Column(DataType.INTEGER)
    classId!: number

    @ForeignKey(() => Subject)
    @Column(DataType.INTEGER)
    subjectId!: number

    @BelongsTo(() => Class)
    class!: Class

    @BelongsTo(() => Subject)
    subject!: Subject
}
