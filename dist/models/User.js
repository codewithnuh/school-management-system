var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DataTypes, UUIDV4 } from 'sequelize';
import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';
let User = class User extends Model {
};
__decorate([
    Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "middleName", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    Column({
        type: DataType.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "placeOfBirth", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "nationality", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [10, 15] },
    }),
    __metadata("design:type", String)
], User.prototype, "phoneNo", void 0);
__decorate([
    Column({ type: DataType.ENUM('STUDENT'), defaultValue: 'STUDENT' }),
    __metadata("design:type", String)
], User.prototype, "entityType", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "emergencyContactName", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [10, 15] },
    }),
    __metadata("design:type", String)
], User.prototype, "emergencyContactNumber", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "currentAddress", void 0);
__decorate([
    Column({ type: DataType.VIRTUAL, allowNull: false, unique: true }),
    __metadata("design:type", String)
], User.prototype, "studentId", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "previousSchool", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "previousGrade", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "previousMarks", void 0);
__decorate([
    Column({ type: DataType.BOOLEAN, defaultValue: false, allowNull: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isRegistered", void 0);
__decorate([
    Column({
        type: DataTypes.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "guardianName", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [13, 13] },
    }),
    __metadata("design:type", String)
], User.prototype, "guardianCNIC", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        validate: { isNumeric: true, len: [10, 15] },
    }),
    __metadata("design:type", String)
], User.prototype, "guardianPhone", void 0);
__decorate([
    Column({ type: DataType.STRING, validate: { isEmail: true } }),
    __metadata("design:type", String)
], User.prototype, "guardianEmail", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [13, 13] },
    }),
    __metadata("design:type", String)
], User.prototype, "CNIC", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "class", void 0);
__decorate([
    Default(UUIDV4),
    Column({ type: DataType.UUID, allowNull: true }),
    __metadata("design:type", String)
], User.prototype, "uuid", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "enrollmentDate", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "photo", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "transportation", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "extracurriculars", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "medicalConditions", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "allergies", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "healthInsuranceInfo", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "doctorContact", void 0);
__decorate([
    Column({ type: DataType.DATE, defaultValue: DataTypes.NOW() }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    Column({ type: DataType.DATE, defaultValue: DataTypes.NOW() }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    Table({
        tableName: 'users',
        timestamps: true,
    })
], User);
export { User };
