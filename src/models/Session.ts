import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
} from 'sequelize-typescript'
import { User } from '@/models/User'

type SessionAttributes = {
    userId: number
    sessionId: string
    expiresAt: Date
}
@Table({ tableName: 'sessions', timestamps: true })
export class Session
    extends Model<SessionAttributes>
    implements SessionAttributes
{
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId!: number

    @Column({ type: DataType.STRING, allowNull: false })
    sessionId!: string

    @Column({ type: DataType.DATE, allowNull: false })
    expiresAt!: Date
}
