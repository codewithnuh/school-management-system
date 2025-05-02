import {
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript'
import { School, Admin } from '@/models/index.js'
import { z } from 'zod'

export const registrationLinkSchema = z.object({
    id: z.string().uuid().optional(), // Optional for creation
    type: z.enum(['TEACHER', 'STUDENT']),
    createdBy: z.number().int().positive(),
    schoolId: z.number().int().positive(),
    isActive: z.boolean(),
    expiresAt: z.coerce.date(), // allows string or Date input and coerces to Date
})
type RegistrationLinkInput = z.infer<typeof registrationLinkSchema>
@Table({ tableName: 'registration_links', timestamps: true })
export class RegistrationLink
    extends Model<RegistrationLinkInput>
    implements RegistrationLinkInput
{
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string

    @Column(DataType.ENUM('TEACHER', 'STUDENT'))
    type!: 'TEACHER' | 'STUDENT'

    @ForeignKey(() => Admin)
    @Column(DataType.INTEGER)
    createdBy!: number

    @ForeignKey(() => School)
    @Column(DataType.INTEGER)
    schoolId!: number

    @Column(DataType.BOOLEAN)
    isActive!: boolean

    @Column(DataType.DATE)
    expiresAt!: Date
}
