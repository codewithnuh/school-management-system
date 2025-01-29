import { Table, Column, Model, DataType } from 'sequelize-typescript'
import { z } from 'zod'
import { Op } from 'sequelize'
export const otpSchema = z.object({
    id: z.number().optional(),
    otp: z.number().max(6),
    entityId: z.number(),
    entityType: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
    isUsed: z.boolean().default(false),
    expiresAt: z.date(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export type OTPAttributes = z.infer<typeof otpSchema>
export type EntityType = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'

@Table({
    tableName: 'otps',
    timestamps: true,
})
export class OTP extends Model<OTPAttributes> implements OTPAttributes {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    public id!: number

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    public otp!: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    public entityId!: number

    @Column({
        type: DataType.ENUM('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
        allowNull: false,
    })
    public entityType!: EntityType

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    public isUsed!: boolean

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    public expiresAt!: Date

    @Column({
        type: DataType.DATE,
    })
    public readonly createdAt!: Date

    @Column({
        type: DataType.DATE,
    })
    public readonly updatedAt!: Date

    static async generateOTP(): Promise<number> {
        return Math.floor(100000 + Math.random() * 900000)
    }

    static async createOTP(
        entityId: number,
        entityType: EntityType,
    ): Promise<OTP> {
        const otp = await this.generateOTP()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry

        return await this.create({
            otp,
            entityId,
            entityType,
            isUsed: false,
            expiresAt,
        })
    }

    static async findValidOTP(
        otp: number,
        entityId: number,
        entityType: EntityType,
    ): Promise<OTP | null> {
        return await this.findOne({
            where: {
                otp,
                entityId,
                entityType,
                isUsed: false,
                expiresAt: {
                    [Op.gt]: new Date(),
                },
            },
        })
    }

    async markAsUsed(): Promise<void> {
        this.isUsed = true
        await this.save()
    }

    static async cleanupExpiredOTPs(): Promise<number> {
        const result = await this.destroy({
            where: {
                [Op.or]: [
                    { expiresAt: { [Op.lt]: new Date() } },
                    { isUsed: true },
                ],
            },
        })
        return result
    }
}
