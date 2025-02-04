Here I will provide you my existing models and your job is to analyze it and try to learn the how everything is being written I will provide each and every model your job is to write clear easy to understand model use comments where requried for better developer experiend, use zod for generating types and schema for validation here is the fist model

```ts
//user.model.ts
import { userSchema } from '@/schema/user.schema.js'
import { DataTypes, UUIDV4 } from 'sequelize'
import { Table, Column, Model, DataType, Default } from 'sequelize-typescript'
import { z } from 'zod'

type UserAttributes = z.infer<typeof userSchema>
type Grade =
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | '11'
    | '12'
@Table({
    tableName: 'users',
    timestamps: true,
})
export class User extends Model<UserAttributes> implements UserAttributes {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number

    @Column({ type: DataType.STRING, allowNull: false })
    firstName!: string

    @Column({ type: DataType.STRING })
    middleName?: string

    @Column({ type: DataType.STRING, allowNull: false })
    lastName!: string

    @Column({ type: DataType.STRING, allowNull: false })
    dateOfBirth!: string

    @Column({
        type: DataType.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
    })
    gender!: 'Male' | 'Female' | 'Other'

    @Column({ type: DataType.STRING })
    placeOfBirth?: string

    @Column({ type: DataType.STRING })
    nationality?: string

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
    })
    email!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [10, 15] },
    })
    phoneNo!: string
    @Column({ type: DataType.ENUM('STUDENT'), defaultValue: 'STUDENT' })
    entityType!: 'STUDENT'
    @Column({ type: DataType.STRING, allowNull: false })
    emergencyContactName!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [10, 15] },
    })
    emergencyContactNumber!: string

    @Column({ type: DataType.STRING, allowNull: false })
    address!: string

    @Column({ type: DataType.STRING })
    currentAddress?: string

    @Column({ type: DataType.VIRTUAL, allowNull: false, unique: true })
    studentId!: string

    @Column({ type: DataType.STRING })
    previousSchool?: string

    @Column({ type: DataType.STRING })
    previousGrade?: string

    @Column({ type: DataType.STRING })
    previousMarks?: string

    @Column({ type: DataType.BOOLEAN, defaultValue: false, allowNull: true })
    isRegistered!: boolean
    @Column({
        type: DataTypes.STRING,
        allowNull: true,
    })
    password!: string
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    guardianName!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [13, 13] },
    })
    guardianCNIC!: string

    @Column({
        type: DataType.STRING,
        validate: { isNumeric: true, len: [10, 15] },
    })
    guardianPhone?: string

    @Column({ type: DataType.STRING, validate: { isEmail: true } })
    guardianEmail?: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [13, 13] },
    })
    CNIC!: string

    @Column({ type: DataType.STRING, allowNull: false })
    class!: Grade

    @Default(UUIDV4)
    @Column({ type: DataType.UUID, allowNull: true })
    uuid?: string

    @Column({ type: DataType.STRING, allowNull: false })
    enrollmentDate!: string

    @Column({ type: DataType.STRING })
    photo?: string

    @Column({ type: DataType.STRING })
    transportation?: string

    @Column({ type: DataType.STRING })
    extracurriculars?: string

    @Column({ type: DataType.STRING })
    medicalConditions?: string

    @Column({ type: DataType.STRING })
    allergies?: string

    @Column({ type: DataType.STRING })
    healthInsuranceInfo?: string

    @Column({ type: DataType.STRING })
    doctorContact?: string
    @Column({ type: DataType.DATE, defaultValue: DataTypes.NOW() })
    createdAt?: Date
    @Column({ type: DataType.DATE, defaultValue: DataTypes.NOW() })
    updatedAt?: Date
}
```

try to avoid circular dependcey problem ,
here is teacher model

```ts
import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany,
    Index,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript'
import { z } from 'zod'

import { teacherSchema } from '@/schema/teacher.schema.js'

// Define enums for better type safety
export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
}

export enum ApplicationStatus {
    Pending = 'Pending',
    Interview = 'Interview',
    Accepted = 'Accepted',
    Rejected = 'Rejected',
}

export type TeacherAttributes = z.infer<typeof teacherSchema> & {
    id?: number
    isVerified?: boolean
    role: 'TEACHER'
    subjectId: number
}

@Table({
    tableName: 'teachers',
    timestamps: true,
})
export class Teacher
    extends Model<TeacherAttributes>
    implements TeacherAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number

    @Column({ type: DataType.STRING, allowNull: false })
    firstName!: string

    @Column({ type: DataType.STRING })
    middleName?: string

    @Column({ type: DataType.STRING, allowNull: false })
    lastName!: string

    @Column({ type: DataType.DATE, allowNull: false })
    dateOfBirth!: Date

    @Column({
        type: DataType.ENUM(...Object.values(Gender)),
        allowNull: false,
    })
    gender!: Gender

    @Column({ type: DataType.STRING })
    nationality?: string

    @Index({ name: 'email', unique: true })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    })
    email!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 15],
        },
    })
    phoneNo!: string

    @Column({
        type: DataType.ENUM('TEACHER'),
        defaultValue: 'TEACHER',
        allowNull: false,
    })
    entityType!: 'TEACHER'

    @Column({
        type: DataType.STRING,
        allowNull: true, // Allow null for password initially
    })
    password?: string

    @Column({ type: DataType.STRING, allowNull: false })
    address!: string

    @Column({ type: DataType.STRING })
    currentAddress?: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [13, 13],
        },
    })
    cnic!: string

    @Column({ type: DataType.STRING, allowNull: false })
    highestQualification!: string

    @Column({ type: DataType.STRING })
    specialization?: string

    @Column({ type: DataType.INTEGER })
    experienceYears?: number

    @Column({ type: DataType.DATE, allowNull: false })
    joiningDate!: Date

    @Column({ type: DataType.STRING })
    photo?: string

    @Column({ type: DataType.STRING, allowNull: false })
    emergencyContactName!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 15],
        },
    })
    emergencyContactNumber!: string

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isVerified?: boolean

    @Column({
        type: DataType.ENUM(...Object.values(ApplicationStatus)),
        defaultValue: ApplicationStatus.Pending,
    })
    applicationStatus!: ApplicationStatus

    @Column({ type: DataType.STRING })
    verificationDocument?: string

    @Column({ type: DataType.STRING })
    cvPath?: string

    @Column({
        type: DataType.ENUM('TEACHER'),
        defaultValue: 'TEACHER',
        allowNull: false,
    })
    role!: 'TEACHER'

    @ForeignKey(() => Subject)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    subjectId!: number // Replace the enum with a foreign key

    @HasMany(() => TimetableEntry) // Teacher has many TimetableEntries
    timetableEntries!: TimetableEntry[]
    @BelongsTo(() => Subject)
    subject!: Subject

    @HasMany(() => Timetable)
    assignedPeriods!: Timetable[]
    // models/Teacher.ts
    @HasMany(() => SectionTeacher)
    sectionTeachers!: SectionTeacher[]
    @HasMany(() => Section)
    sections!: Section[]
    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date
}
import {
    Timetable,
    TimetableEntry,
    SectionTeacher,
    Subject,
    Section,
} from '@/models/index.js'
```

here is subject model

```ts
// subject.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    Unique,
    ForeignKey,
} from 'sequelize-typescript'
import { z } from 'zod'
import { Section } from '@/models/index.js'
// Zod schema for validation
export const SubjectSchema = z.object({
    id: z.number().optional(), // Optional for creation, auto-generated
    name: z
        .string()
        .min(1, 'Subject name cannot be empty')
        .max(100, 'Subject name cannot exceed 100 characters'),
    description: z.string().optional().nullable(),
})

// Type inference from Zod schema
export type SubjectAttributes = z.infer<typeof SubjectSchema>

@Table({
    tableName: 'subjects',
    timestamps: true, // Adds createdAt and updatedAt columns
})
export class Subject extends Model<SubjectAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number
    // models/Subject.ts
    // @HasMany(() => SectionTeacher)
    // sectionTeachers!: SectionTeacher[]
    @Unique
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    name!: string
    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string
    @ForeignKey(() => Section)
    @Column(DataType.INTEGER)
    sectionId!: number
    // Validation method using Zod schema
    static validateSubject(data: Partial<SubjectAttributes>) {
        return SubjectSchema.parse(data)
    }
}
```

here is class model

```ts

// class.model.ts
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { Section } from '@/models/index.js'

import { z } from 'zod'

export const CreateClassSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Class name is required'),
    description: z.string().optional(),
    maxStudents: z.number().min(1, 'Max students must be at least 1'),
    periodsPerDay: z.number().min(1).max(10),
    periodLength: z.number().min(30).max(60),
    workingDays: z
        .array(
            z.enum([
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ]),
        )
        .min(1, 'At least one working day is required'),
    subjectIds: z.array(z.number()).min(1, 'At least one subject is required'),
    sections: z.array(
        z.object({
            name: z
                .string()
                .length(1, 'Section name must be a single character'),
            maxStudents: z
                .number()
                .min(1, 'Max students per section must be at least 1'),
            classTeacherId: z
                .number()
                .positive('Class teacher ID must be a positive number'),
            subjectTeachers: z.record(z.string(), z.number()), // { subjectId: teacherId }
        }),
    ),
})

export type CreateClassInput = z.infer<typeof CreateClassSchema>

@Table({
    tableName: 'classes',
    timestamps: true,
})
export class Class extends Model<CreateClassInput> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    maxStudents!: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    periodsPerDay!: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    periodLength!: number

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    workingDays!: string[] // Store working days as JSON array

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    subjectIds!: number[]

    @HasMany(() => Section)
    sections!: Section[]

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string
}

```

```ts
//section.model.ts
// section.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript'
import { z } from 'zod'
import { Class, Timetable, TimetableEntry, Subject } from '@/models/index.js'

export const createSectionSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
    }),
    classTeacherId: z.number({
        required_error: 'Class teacher ID is required',
    }),
    subjectTeachers: z.record(z.number(), z.number(), {
        required_error: 'Subject teachers mapping is required',
    }),
    classId: z.number({
        required_error: 'Class ID is required',
    }),
})

export type CreateSectionInput = z.infer<typeof createSectionSchema>
@Table({ tableName: 'sections' })
export class Section extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string

    // Class Teacher Relationship
    @ForeignKey(() => Teacher)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    classTeacherId!: number

    // Subject Teachers Mapping
    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    subjectTeachers!: Record<number, number>

    // Class Relationship
    @ForeignKey(() => Class)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    classId!: number

    @BelongsTo(() => Class)
    class!: Class

    // Timetable Relationships
    @HasMany(() => Timetable)
    timetables!: Timetable[]

    @HasMany(() => TimetableEntry)
    timetableEntries!: TimetableEntry[]

    // Subjects Relationship
    @HasMany(() => Subject)
    subjects!: Subject[]
}

// Import Teacher AFTER the class definition
import { Teacher } from '@/models/index.js'
```

Here is database config where everything is imported

```ts
//database.config.ts
import { Sequelize } from 'sequelize-typescript'
import { config } from 'dotenv'
import process from 'process'
import {
    Class,
    Section,
    Subject,
    Teacher,
    Timetable,
    TimetableEntry,
    SectionTeacher,
    OTP,
    PasswordResetToken,
    Session,
    TimeSlot,
    User,
} from '@/models/index.js'
config()
const sequelize = new Sequelize(process.env.DATABASE_URI as string, {
    logging: false,

    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // You can adjust this based on your SSL requirements
        },
    },

    models: [
        Class,
        Section,
        Subject,
        Teacher,
        Timetable,
        TimetableEntry,
        SectionTeacher,
        OTP,
        User,
        PasswordResetToken,
        Session,
        TimeSlot,
    ],
})
Section.belongsTo(Teacher, { foreignKey: 'classTeacherId' })
Teacher.hasMany(Section, { foreignKey: 'classTeacherId' })
SectionTeacher.belongsTo(Subject, { foreignKey: 'subjectId' })
SectionTeacher.belongsTo(Teacher, { foreignKey: 'teacherId' })
Subject.hasMany(SectionTeacher, { foreignKey: 'sectionId' })
export default sequelize

```

Here you can see there we are referencing models in datbase config after model intializing because in this way can avoid circular dependancy

Try to define each exam model correctly adn also here is @/models/index.ts

```ts


export * from '@/models/Class.js'
export * from '@/models/section.js'
export { EntityType as OTPEntityType, OTP } from './OTP.js'

export * from '@/models/PasswordResetToken.js'
export * from '@/models/SectionTeacher.js'
export * from '@/models/Session.js'
export * from '@/models/Subject.js'
export * from '@/models/Teacher.js'
export * from '@/models/TimeSlot.js'
export * from '@/models/TimeTable.js'
export * from '@/models/TimeTableEntry.js'
export * from '@/models/User.js'
```

when a new modl created first we wil import it in index.ts with .js extension because I am using express + typescript thats why and also use @ path alias for root src like @/modes/index.js @/controllers/index.js

when all models initialized ask me to create a services for it, because the project model I am using is service controllers,model,routes , I write business logic in services and import them in controllers and then import controllers in routes and I am using .js extension for every import the file itself will be typescript but we will use .js

here is an example of how I write service

```ts
//example.service.ts
import sequelize from '@/config/database.js'
import { Class } from '@/models/Class.js'
// Fix capitalization to Section
import { Subject } from '@/models/Subject.js'
import { Teacher } from '@/models/Teacher.js'
// Fix capitalization to Timetable
// Fix capitalization to TimetableEntry
import { SectionTeacher } from '@/models/SectionTeacher.js'
import { Section } from '@/models/section.js'
import { Timetable } from '@/models/TimeTable.js'
import { TimetableEntry } from '@/models/TimeTableEntry.js'
import { Sequelize } from 'sequelize-typescript'
import { Transaction } from 'sequelize'
export class TimetableService {
    /**
     * Generates a timetable for all sections of a given class.
     * @param classId - The ID of the class for which to generate the timetable.
     * @param config - Optional configuration for overrides (e.g., periods per day, break times).
     * @returns An array of generated timetables for each section.
     */
    static async generateTimetable(
        classId: number,
        config?: {
            periodsPerDayOverrides?: Record<string, number>
            breakStartTime?: string
            breakEndTime?: string
        },
    ) {
        const transaction = await sequelize.transaction()

        try {
            // Fetch class data including sections
            const classData = await Class.findByPk(classId, {
                include: [Section],
                transaction,
            })

            if (!classData) {
                throw new Error('Class not found')
            }

            if (!classData.sections || classData.sections.length === 0) {
                throw new Error('No sections found for this class')
            }

            const timetables = []

            // Generate a timetable for each section
            for (const section of classData.sections) {
                const timetable = await this.createTimetableForSection(
                    classData,
                    section,
                    config || {},
                    transaction,
                )

                timetables.push(timetable)
            }

            await transaction.commit()
            return timetables
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    /**
     * Creates a timetable for a specific section.
     * @param classData - The class data.
     * @param section - The section for which to create the timetable.
     * @param config - Optional configuration for overrides.
     * @param transaction - The Sequelize transaction.
     * @returns The created timetable.
     */
    private static async createTimetableForSection(
        classData: Class,
        section: Section,
        config: {
            periodsPerDayOverrides?: Record<string, number>
            breakStartTime?: string
            breakEndTime?: string
        },
        transaction: Transaction,
    ) {
        if (!classData.periodsPerDay || classData.periodsPerDay <= 0) {
            throw new Error('Invalid periods per day')
        }

        if (!classData.periodLength || classData.periodLength <= 0) {
            throw new Error('Invalid period length')
        }

        // Fetch subject-teacher assignments for this section
        const sectionTeachers = await SectionTeacher.findAll({
            where: { sectionId: section.id },
            include: [Subject, Teacher],
            transaction,
        })

        if (sectionTeachers.length === 0) {
            throw new Error(
                `No subject-teacher assignments found for section ${section.id}`,
            )
        }

        // Create the timetable
        const timetable = await Timetable.create(
            {
                classId: classData.id,
                sectionId: section.id,
                periodsPerDay: classData.periodsPerDay,
                periodsPerDayOverrides: config?.periodsPerDayOverrides || {},
                breakStartTime: config?.breakStartTime,
                breakEndTime: config?.breakEndTime,
                teacherId: sectionTeachers[0].teacherId, // Assuming the first teacher as default
            },
            { transaction },
        )

        // Generate timetable entries for each day and period
        const daysOfWeek: (
            | 'Monday'
            | 'Tuesday'
            | 'Wednesday'
            | 'Thursday'
            | 'Friday'
            | 'Saturday'
            | 'Sunday'
        )[] = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ]
        const timetableEntries = []

        for (const day of daysOfWeek) {
            const periodsForDay =
                timetable.periodsPerDayOverrides?.[day] ??
                timetable.periodsPerDay

            if (periodsForDay <= 0) {
                continue // Skip days with no periods
            }

            for (
                let periodNumber = 1;
                periodNumber <= periodsForDay;
                periodNumber++
            ) {
                // Assign subject and teacher in a round-robin fashion
                const subjectTeacher =
                    sectionTeachers[(periodNumber - 1) % sectionTeachers.length]

                const startTime = this.calculateStartTime(
                    day,
                    periodNumber,
                    timetable,
                    classData.periodLength,
                )

                const endTime = this.calculateEndTime(
                    startTime,
                    classData.periodLength,
                )

                const entry = await TimetableEntry.create(
                    {
                        timetableId: timetable.id,
                        sectionId: section.id, // Ensure sectionId is assigned
                        dayOfWeek: day,
                        classId: classData.id,
                        periodNumber,
                        subjectId: subjectTeacher.subjectId,
                        teacherId: subjectTeacher.teacherId,
                        startTime,
                        endTime,
                    },
                    { transaction },
                )

                timetableEntries.push(entry)
            }
        }

        // Update the timetable with the generated entries
        await timetable.update({}, { transaction })

        return timetable
    }

    /**
     * Calculates the start time for a period.
     * @param day - The day of the week.
     * @param periodNumber - The period number.
     * @param timetable - The timetable configuration.
     * @param periodLength - The length of each period in minutes.
     * @returns The start time in "HH:MM" format.
     */
    private static calculateStartTime(
        day: string,
        periodNumber: number,
        timetable: Timetable,
        periodLength: number,
    ): string {
        if (periodNumber <= 0) {
            throw new Error('Invalid period number')
        }

        let startTime = '08:00' // Default start time

        if (periodNumber > 1) {
            let minutesToAdd = (periodNumber - 1) * periodLength

            // Adjust for break time if applicable
            if (timetable.breakStartTime && timetable.breakEndTime) {
                const [breakStartHour, breakStartMinute] =
                    timetable.breakStartTime.split(':').map(Number)
                const [breakEndHour, breakEndMinute] = timetable.breakEndTime
                    .split(':')
                    .map(Number)

                const breakDuration =
                    (breakEndHour - breakStartHour) * 60 +
                    (breakEndMinute - breakStartMinute)

                if (breakDuration <= 0) {
                    throw new Error('Invalid break duration')
                }

                const [startHour, startMinute] = startTime
                    .split(':')
                    .map(Number)
                const currentTimeMinutes =
                    startHour * 60 + startMinute + minutesToAdd
                const breakStartTimeMinutes =
                    breakStartHour * 60 + breakStartMinute

                if (currentTimeMinutes > breakStartTimeMinutes) {
                    minutesToAdd += breakDuration
                }
            }

            startTime = this.addMinutes(startTime, minutesToAdd)
        }

        return startTime
    }

    /**
     * Calculates the end time for a period.
     * @param startTime - The start time in "HH:MM" format.
     * @param periodLength - The length of the period in minutes.
     * @returns The end time in "HH:MM" format.
     */
    private static calculateEndTime(
        startTime: string,
        periodLength: number,
    ): string {
        if (periodLength <= 0) {
            throw new Error('Invalid period length')
        }
        return this.addMinutes(startTime, periodLength)
    }

    /**
     * Adds minutes to a given time.
     * @param time - The time in "HH:MM" format.
     * @param minutesToAdd - The number of minutes to add.
     * @returns The new time in "HH:MM" format.
     */
    private static addMinutes(time: string, minutesToAdd: number): string {
        if (minutesToAdd < 0) {
            throw new Error('Cannot add negative minutes')
        }

        let [hours, minutes] = time.split(':').map(Number)
        minutes += minutesToAdd

        hours += Math.floor(minutes / 60)
        minutes %= 60

        if (hours >= 24) {
            throw new Error('Time exceeds 24 hours')
        }

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }

    /**
     * Fetches the timetable for a specific class and section.
     * @param classId - The ID of the class.
     * @param sectionId - The ID of the section.
     * @returns The timetable with entries.
     */
    static async getTimetable(classId: number, sectionId: number) {
        if (classId <= 0 || sectionId <= 0) {
            throw new Error('Invalid class or section ID')
        }

        return Timetable.findOne({
            where: { classId, sectionId },
            include: [
                {
                    model: TimetableEntry,
                    include: [{ model: Subject }, { model: Teacher }],
                },
            ],
        })
    }
    static async getTeacherTimetable(teacherId: number) {
        if (isNaN(teacherId) || teacherId <= 0) {
            throw new Error('Invalid teacher ID')
        }

        // Fetch all timetable entries for the teacher
        const timetableEntries = await TimetableEntry.findAll({
            where: { teacherId },
            include: [
                {
                    model: Timetable,
                    include: [Section, Class], // Include section and class details
                },
                Subject, // Include subject details
            ],
            order: [
                ['dayOfWeek', 'ASC'], // Sort by day of the week
                ['periodNumber', 'ASC'], // Sort by period number
            ],
        })

        if (timetableEntries.length === 0) {
            throw new Error('No timetable entries found for this teacher')
        }

        return timetableEntries
    }
    // timetable.service.ts
    static async getWeeklyTimetable(
        classId: number,
        sectionId?: number,
        teacherId?: number,
    ) {
        if (!sectionId && !teacherId) {
            throw new Error('Specify sectionId or teacherId')
        }

        // Fetch timetable entries for the section or teacher
        const whereClause = sectionId
            ? { classId, sectionId }
            : { classId, teacherId }

        const timetableEntries = await TimetableEntry.findAll({
            where: whereClause,
            include: [
                {
                    model: Timetable,
                    include: [Section, Class], // Include section and class details
                },
                Subject, // Include subject details
                Teacher, // Include teacher details
            ],
            order: [
                // Sort by day of the week with a custom order (Monday to Friday)
                [
                    Sequelize.literal(
                        `FIELD(dayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')`,
                    ),
                    'ASC',
                ],
                ['periodNumber', 'ASC'], // Sort by period number
            ],
        })

        if (timetableEntries.length === 0) {
            throw new Error('No timetable entries found')
        }

        // Group entries by day of the week
        const weeklyTimetable = timetableEntries.reduce(
            (acc, entry) => {
                const day = entry.dayOfWeek
                if (!acc[day]) {
                    acc[day] = []
                }
                acc[day].push(entry)
                return acc
            },
            {} as Record<string, TimetableEntry[]>,
        )

        // Ensure the days are in the correct order (Monday to Friday)
        const orderedTimetable: Record<string, TimetableEntry[]> = {}
        const daysOfWeek = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
        ]
        daysOfWeek.forEach(day => {
            if (weeklyTimetable[day]) {
                orderedTimetable[day] = weeklyTimetable[day]
            }
        })

        return orderedTimetable
    }
}

```

if you need more info and have questions feel free to ask before procceeding.
