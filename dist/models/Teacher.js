var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, Default, IsUUID, Index, CreatedAt, UpdatedAt, } from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
// Define enums for better type safety
export var Gender;
(function (Gender) {
    Gender["Male"] = "Male";
    Gender["Female"] = "Female";
    Gender["Other"] = "Other";
})(Gender || (Gender = {}));
export var Subject;
(function (Subject) {
    Subject["English"] = "English";
    Subject["Urdu"] = "Urdu";
    Subject["ComputerScience"] = "Computer Science";
    Subject["Physics"] = "Physics";
    Subject["Maths"] = "Maths";
    Subject["PakistanStudy"] = "Pakistan Study";
    Subject["Chemistry"] = "Chemistry";
})(Subject || (Subject = {}));
export var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["Pending"] = "Pending";
    ApplicationStatus["Interview"] = "Interview";
    ApplicationStatus["Accepted"] = "Accepted";
    ApplicationStatus["Rejected"] = "Rejected";
})(ApplicationStatus || (ApplicationStatus = {}));
let Teacher = class Teacher extends Model {
};
__decorate([
    Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Teacher.prototype, "id", void 0);
__decorate([
    Default(UUIDV4),
    IsUUID(4),
    Column({
        type: DataType.UUID,
        allowNull: true,
        unique: true,
    }),
    __metadata("design:type", String)
], Teacher.prototype, "uuid", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Teacher.prototype, "firstName", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], Teacher.prototype, "middleName", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Teacher.prototype, "lastName", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Teacher.prototype, "dateOfBirth", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(Gender)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Teacher.prototype, "gender", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], Teacher.prototype, "nationality", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    }),
    Index({ unique: true }),
    __metadata("design:type", String)
], Teacher.prototype, "email", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 15],
        },
    }),
    __metadata("design:type", String)
], Teacher.prototype, "phoneNo", void 0);
__decorate([
    Column({
        type: DataType.ENUM('Teacher'),
        defaultValue: 'Teacher',
        allowNull: false,
    }),
    __metadata("design:type", String)
], Teacher.prototype, "entityType", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true, // Changed to true to allow null initially
    }),
    __metadata("design:type", String)
], Teacher.prototype, "password", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Teacher.prototype, "address", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], Teacher.prototype, "currentAddress", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [13, 13],
        },
    }),
    __metadata("design:type", String)
], Teacher.prototype, "cnic", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Teacher.prototype, "highestQualification", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], Teacher.prototype, "specialization", void 0);
__decorate([
    Column({ type: DataType.INTEGER }),
    __metadata("design:type", Number)
], Teacher.prototype, "experienceYears", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Teacher.prototype, "joiningDate", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], Teacher.prototype, "photo", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Teacher.prototype, "emergencyContactName", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 15],
        },
    }),
    __metadata("design:type", String)
], Teacher.prototype, "emergencyContactNumber", void 0);
__decorate([
    Column({ type: DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], Teacher.prototype, "isVerified", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(ApplicationStatus)),
        defaultValue: ApplicationStatus.Pending,
    }),
    __metadata("design:type", String)
], Teacher.prototype, "applicationStatus", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], Teacher.prototype, "verificationDocument", void 0);
__decorate([
    Column({ type: DataType.STRING }),
    __metadata("design:type", String)
], Teacher.prototype, "cvPath", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        defaultValue: 'TEACHER',
        allowNull: false,
    }),
    __metadata("design:type", String)
], Teacher.prototype, "role", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(Subject)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Teacher.prototype, "subject", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], Teacher.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], Teacher.prototype, "updatedAt", void 0);
Teacher = __decorate([
    Table({
        tableName: 'teachers',
        timestamps: true,
    })
], Teacher);
export { Teacher };
