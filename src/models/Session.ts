import type { Optional } from 'sequelize'
import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
} from 'sequelize-typescript'

export type SessionEntityType =
    | 'ADMIN'
    | 'TEACHER'
    | 'USER'
    | 'STUDENT'
    | 'PARENT'
    | 'OWNER'

export interface SessionAttributes {
    id: number
    tokenHash: string
    userId: number
    entityType: SessionEntityType
    expiryDate: Date
    userAgent: string | null
    ipAddress: string | null
    isSuperAdmin: boolean
    createdAt: Date
    updatedAt: Date
}

export type SessionCreationAttributes = Optional<
    SessionAttributes,
    'id' | 'userAgent' | 'ipAddress' | 'isSuperAdmin' | 'createdAt' | 'updatedAt'
>

@Table({ tableName: 'sessions', timestamps: true, underscored: true })
export class Session
    extends Model<SessionAttributes, SessionCreationAttributes>
    implements SessionAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number

    @Column({
        type: DataType.STRING(64),
        allowNull: false,
        unique: true,
        field: 'token_hash',
    })
    tokenHash!: string

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
    userId!: number

    @Column({
        type: DataType.ENUM('ADMIN', 'TEACHER', 'USER', 'STUDENT', 'PARENT', 'OWNER'),
        allowNull: false,
        field: 'entity_type',
    })
    entityType!: SessionEntityType

    @Column({ type: DataType.DATE, allowNull: false, field: 'expiry_date' })
    expiryDate!: Date

    @Column({ type: DataType.STRING, allowNull: true, field: 'user_agent' })
    userAgent!: string | null

    @Column({ type: DataType.STRING, allowNull: true, field: 'ip_address' })
    ipAddress!: string | null

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_super_admin',
    })
    isSuperAdmin!: boolean

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt!: Date

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt!: Date
}
