var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, BeforeCreate, } from 'sequelize-typescript';
import * as crypto from 'crypto';
import { Op } from 'sequelize';
let PasswordResetToken = class PasswordResetToken extends Model {
    static async generateToken(instance) {
        instance.token = crypto.randomBytes(32).toString('hex');
        instance.expiresDate = new Date(Date.now() + 3600000);
        instance.isUsed = false;
    }
    //Helper methods
    static async createToken({ entityType, entityId, userId, teacherId, }) {
        await this.update({
            isUsed: true,
        }, {
            where: {
                entityId,
                entityType,
                isUsed: false,
                expiresDate: {
                    [Op.gt]: new Date(),
                },
            },
        });
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
        });
        const token = crypto.randomBytes(32).toString('hex');
        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        return await this.create({
            entityId,
            entityType,
            isUsed: false,
            expiresDate: expiryDate,
            token: token,
            ...(entityType === 'USER' ? { userId } : { teacherId }),
        });
    }
    static async cleanupExpiredTokens() {
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
        });
        return deleted;
    }
    static async findValidToken(token) {
        return await this.findOne({
            where: {
                token,
                isUsed: false,
                expiresDate: {
                    [Op.gt]: new Date(),
                },
            },
        });
    }
    async markAsUsed() {
        this.isUsed = true;
        await this.save();
    }
};
__decorate([
    Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], PasswordResetToken.prototype, "id", void 0);
__decorate([
    Column({ type: DataType.STRING(100), allowNull: false, unique: true }),
    __metadata("design:type", String)
], PasswordResetToken.prototype, "token", void 0);
__decorate([
    Column({ type: DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], PasswordResetToken.prototype, "entityId", void 0);
__decorate([
    Column({ type: DataType.ENUM('USER', 'TEACHER'), allowNull: false }),
    __metadata("design:type", String)
], PasswordResetToken.prototype, "entityType", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false, field: 'expiresDate' }),
    __metadata("design:type", Date)
], PasswordResetToken.prototype, "expiresDate", void 0);
__decorate([
    Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], PasswordResetToken.prototype, "isUsed", void 0);
__decorate([
    Column({ type: DataType.DATE }),
    __metadata("design:type", Date)
], PasswordResetToken.prototype, "createdAt", void 0);
__decorate([
    Column({ type: DataType.DATE }),
    __metadata("design:type", Date)
], PasswordResetToken.prototype, "updatedAt", void 0);
__decorate([
    BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PasswordResetToken]),
    __metadata("design:returntype", Promise)
], PasswordResetToken, "generateToken", null);
PasswordResetToken = __decorate([
    Table({
        tableName: 'password_reset_tokens',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        deletedAt: 'deletedAt',
    })
], PasswordResetToken);
export { PasswordResetToken };
