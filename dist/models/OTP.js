var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { z } from 'zod';
import { Op } from 'sequelize';
export const otpSchema = z.object({
    id: z.number().optional(),
    otp: z.number().max(6),
    entityId: z.number(),
    entityType: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
    isUsed: z.boolean().default(false),
    expiresAt: z.date(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
let OTP = class OTP extends Model {
    static async generateOTP() {
        return Math.floor(100000 + Math.random() * 900000);
    }
    static async createOTP(entityId, entityType) {
        const otp = await this.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
        return await this.create({
            otp,
            entityId,
            entityType,
            isUsed: false,
            expiresAt,
        });
    }
    static async findValidOTP(otp, entityId, entityType) {
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
        });
    }
    async markAsUsed() {
        this.isUsed = true;
        await this.save();
    }
    static async cleanupExpiredOTPs() {
        const result = await this.destroy({
            where: {
                [Op.or]: [
                    { expiresAt: { [Op.lt]: new Date() } },
                    { isUsed: true },
                ],
            },
        });
        return result;
    }
};
__decorate([
    Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], OTP.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.NUMBER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], OTP.prototype, "otp", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], OTP.prototype, "entityId", void 0);
__decorate([
    Column({
        type: DataType.ENUM('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], OTP.prototype, "entityType", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], OTP.prototype, "isUsed", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], OTP.prototype, "expiresAt", void 0);
__decorate([
    Column({
        type: DataType.DATE,
    }),
    __metadata("design:type", Date)
], OTP.prototype, "createdAt", void 0);
__decorate([
    Column({
        type: DataType.DATE,
    }),
    __metadata("design:type", Date)
], OTP.prototype, "updatedAt", void 0);
OTP = __decorate([
    Table({
        tableName: 'otps',
        timestamps: true,
    })
], OTP);
export { OTP };
