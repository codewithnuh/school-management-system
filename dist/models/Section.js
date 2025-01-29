var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AutoIncrement, BelongsTo, Model } from 'sequelize-typescript';
import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { z } from 'zod';
import { Class } from '@/models/Class';
import { Teacher } from '@/models/Teacher';
export const SectionSchema = z.object({
    id: z.number().optional(),
    name: z
        .string()
        .length(1, 'Section name must be a single character')
        .regex(/^[A-H]$/, 'Section name must be a letter from A to H'),
    classId: z.number().positive('Class ID must be a positive number'),
    classTeacherId: z.number(),
});
let Section = class Section extends Model {
    static validateSection(data) {
        return SectionSchema.parse(data);
    }
};
__decorate([
    AutoIncrement,
    Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], Section.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING(1),
        allowNull: false,
        validate: {
            isIn: [['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']],
        },
    }),
    __metadata("design:type", String)
], Section.prototype, "name", void 0);
__decorate([
    ForeignKey(() => Class),
    Column({
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: 'classes',
            key: 'id',
        },
    }),
    __metadata("design:type", Number)
], Section.prototype, "classId", void 0);
__decorate([
    BelongsTo(() => Class),
    __metadata("design:type", Class)
], Section.prototype, "class", void 0);
__decorate([
    Column({
        type: DataType.NUMBER,
        allowNull: false,
        validate: {
            isNumeric: true,
        },
    }),
    BelongsTo(() => Teacher),
    __metadata("design:type", Number)
], Section.prototype, "classTeacherId", void 0);
Section = __decorate([
    Table({
        tableName: 'sections',
        timestamps: true,
    })
], Section);
export { Section };
