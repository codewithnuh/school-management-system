import {
    Table,
    Column,
    Model,
    DataType,
    BeforeCreate,
} from 'sequelize-typescript'
import * as crypto from 'crypto'
import { Op } from 'sequelize'
type EntityType = 'USER' | 'TEACHER'
interface PasswordResetTokenAttributes {
    id?: number
    token: string
    expiresDate: Date
    isUsed: boolean
    entityType: EntityType
    entityId: number
    createdAt?: Date
    updatedAt?: Date
}
interface PasswordResetTokenCreationAttributes {
    entityId: number
    entityType: EntityType
    userId?: number // Optional for flexibility
    teacherId?: number
    token?: string
    isUsed?: boolean
    expiresDate?: Date
}
@Table({
    tableName: 'password_reset_tokens',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
})
export class PasswordResetToken
    extends Model<
        PasswordResetTokenAttributes,
        PasswordResetTokenCreationAttributes
    >
    implements PasswordResetTokenAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id?: number
    @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
    token!: string
    @Column({ type: DataType.INTEGER, allowNull: false })
    entityId!: number
    @Column({ type: DataType.ENUM('USER', 'TEACHER'), allowNull: false })
    entityType!: EntityType
    @Column({ type: DataType.DATE, allowNull: false, field: 'expiresDate' })
    expiresDate!: Date
    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isUsed!: boolean
    @Column({ type: DataType.DATE })
    createdAt?: Date
    @Column({ type: DataType.DATE })
    updatedAt?: Date
    @BeforeCreate
    static async generateToken(instance: PasswordResetToken) {
        instance.token = crypto.randomBytes(32).toString('hex')
        instance.expiresDate = new Date(Date.now() + 3600000)
        instance.isUsed = false
    }
    //Helper methods
    static async createToken({
        entityType,
        entityId,
    }: {
        entityType: EntityType
        entityId: number
    }) {
        await this.update(
            {
                isUsed: true,
            },
            {
                where: {
                    entityId,
                    entityType,
                    isUsed: false,
                    expiresDate: {
                        [Op.gt]: new Date(),
                    },
                },
            },
        )
        // First cleanup any expired tokens for this entity
        await this.destroy({
            where: {
                entityId,
                entityType,
                [Op.or]: [
                    { expiresDate: { [Op.lt]: new Date() } },
                    { isUsed: true },
                ],
            },
        })
        const token = crypto.randomBytes(32).toString('hex')
        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
        return await this.create({
            entityId,
            entityType,
            isUsed: false,
            expiresDate: expiryDate,
            token: token,
        })
    }
    static async cleanupExpiredTokens(): Promise<number> {
        const deleted = await this.destroy({
            where: {
                [Op.or]: [
                    {
                        expiresDate: {
                            [Op.lt]: new Date(),
                        },
                    },
                    {
                        isUsed: true,
                    },
                ],
            },
        })
        return deleted
    }

    static async findValidToken(
        token: string,
    ): Promise<PasswordResetToken | null> {
        return await this.findOne({
            where: {
                token,
                isUsed: false,
                expiresDate: {
                    [Op.gt]: new Date(),
                },
            },
        })
    }
    async markAsUsed(): Promise<void> {
        this.isUsed = true
        await this.save()
    }
}
