var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, DataType, HasMany, Model } from 'sequelize-typescript';
import z from 'zod';
import { Section } from '@/models/Section';
export const ClassSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    maxStudents: z.number(),
});
export class Class extends Model {
}
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], Class.prototype, "id", void 0);
__decorate([
    HasMany(() => Section),
    __metadata("design:type", Array)
], Class.prototype, "sections", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Class.prototype, "name", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Class.prototype, "description", void 0);
__decorate([
    Column({
        type: DataType.NUMBER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Class.prototype, "maxStudents", void 0);
