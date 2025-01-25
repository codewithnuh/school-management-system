import { UUIDV4 } from "sequelize";
import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface UserAttributes {
  id: number;
  firstName: string;
  middleName?: string; // Optional middle name
  lastName: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other"; // Use enum or string literal type
  placeOfBirth?: string;
  nationality?: string;
  email: string;
  phoneNo: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  address: string;
  currentAddress?: string;
  studentId: string;
  previousSchool?: string;
  previousGrade?: string;
  previousMarks?: string; // Consider storing as JSON if more complex
  isRegistered: boolean;
  guardianName: string;
  guardianCNIC: string;
  guardianPhone?: string;
  guardianEmail?: string;
  CNIC: string;
  class: Grade;
  uuid?: string;
  enrollmentDate: Date;
  photo?: string; // Store path or URL to photo
  transportation?: string;
  extracurriculars?: string;
  medicalConditions?: string;
  allergies?: string;
  healthInsuranceInfo?: string;
  doctorContact?: string;
}

@Table({
  tableName: "users",
  timestamps: true,
})
export class User extends Model<UserAttributes> implements UserAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName!: string;

  @Column({ type: DataType.STRING })
  middleName?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  dateOfBirth!: Date;

  @Column({ type: DataType.ENUM("Male", "Female", "Other"), allowNull: false })
  gender!: "Male" | "Female" | "Other";

  @Column({ type: DataType.STRING })
  placeOfBirth?: string;

  @Column({ type: DataType.STRING })
  nationality?: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isNumeric: true, len: [10, 15] },
  })
  phoneNo!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  emergencyContactName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isNumeric: true, len: [10, 15] },
  })
  emergencyContactNumber!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address!: string;

  @Column({ type: DataType.STRING })
  currentAddress?: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  studentId!: string;

  @Column({ type: DataType.STRING })
  previousSchool?: string;

  @Column({ type: DataType.STRING })
  previousGrade?: string;

  @Column({ type: DataType.STRING })
  previousMarks?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRegistered!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isNumeric: true, len: [13, 13] },
  })
  guardianName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isNumeric: true, len: [13, 13] },
  })
  guardianCNIC!: string;

  @Column({
    type: DataType.STRING,
    validate: { isNumeric: true, len: [10, 15] },
  })
  guardianPhone?: string;

  @Column({ type: DataType.STRING, validate: { isEmail: true } })
  guardianEmail?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isNumeric: true, len: [13, 13] },
  })
  CNIC!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  class!: Grade;

  @Default(UUIDV4)
  @Column({ type: DataType.UUID, allowNull: true })
  uuid?: string;

  @Column({ type: DataType.DATE, allowNull: false })
  enrollmentDate!: Date;

  @Column({ type: DataType.STRING })
  photo?: string;

  @Column({ type: DataType.STRING })
  transportation?: string;

  @Column({ type: DataType.STRING })
  extracurriculars?: string;

  @Column({ type: DataType.STRING })
  medicalConditions?: string;

  @Column({ type: DataType.STRING })
  allergies?: string;

  @Column({ type: DataType.STRING })
  healthInsuranceInfo?: string;

  @Column({ type: DataType.STRING })
  doctorContact?: string;
}
