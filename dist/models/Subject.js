var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// subject.model.ts
import { Table, Column, Model, DataType, Unique } from 'sequelize-typescript';
import { z } from 'zod';
// Zod schema for validation
export const SubjectSchema = z.object({
    id: z.number().optional(), // Optional for creation, auto-generated
    name: z
        .string()
        .min(1, 'Subject name cannot be empty')
        .max(100, 'Subject name cannot exceed 100 characters'),
    description: z.string().optional().nullable(),
});
let Subject = class Subject extends Model {
    // Validation method using Zod schema
    static validateSubject(data) {
        return SubjectSchema.parse(data);
    }
};
__decorate([
    Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], Subject.prototype, "id", void 0);
__decorate([
    Unique,
    Column({
        type: DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Subject.prototype, "name", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Subject.prototype, "description", void 0);
Subject = __decorate([
    Table({
        tableName: 'subjects',
        timestamps: true, // Adds createdAt and updatedAt columns
    })
], Subject);
export { Subject };
