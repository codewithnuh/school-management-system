import { z } from 'zod';

// Base schemas
const IdSchema = z.number().int().positive();
const EmailSchema = z.string().email();
const PhoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);

// School schemas
export const CreateSchoolSchema = z.object({
  name: z.string().min(2).max(200),
  code: z.string().min(2).max(50),
  address: z.string().optional(),
  phone: PhoneSchema.optional(),
  email: EmailSchema.optional(),
});

export const UpdateSchoolSchema = CreateSchoolSchema.partial();

// User schemas
export const CreateUserSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: PhoneSchema.optional(),
  role: z.enum(['admin', 'principal', 'teacher', 'student', 'parent']),
  schoolId: IdSchema.optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial();

// Academic Year schemas
export const CreateAcademicYearSchema = z.object({
  name: z.string().min(4).max(50),
  startDate: z.string().date(),
  endDate: z.string().date(),
  isCurrent: z.boolean().default(false),
  schoolId: IdSchema,
});

export const UpdateAcademicYearSchema = CreateAcademicYearSchema.partial();

// Class schemas
export const CreateClassSchema = z.object({
  name: z.string().min(1).max(50),
  level: z.number().int().positive(),
  schoolId: IdSchema,
});

export const UpdateClassSchema = CreateClassSchema.partial();

// Section schemas
export const CreateSectionSchema = z.object({
  name: z.string().min(1).max(50),
  classId: IdSchema,
  capacity: z.number().int().positive().optional(),
});

export const UpdateSectionSchema = CreateSectionSchema.partial();

// Subject schemas
export const CreateSubjectSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(20),
  description: z.string().optional(),
  schoolId: IdSchema,
});

export const UpdateSubjectSchema = CreateSubjectSchema.partial();

// Teacher schemas
export const CreateTeacherSchema = z.object({
  userId: IdSchema,
  qualification: z.string().optional(),
  experience: z.number().int().nonnegative().optional(),
  specialization: z.string().optional(),
  joiningDate: z.string().date().optional(),
});

export const UpdateTeacherSchema = CreateTeacherSchema.partial();

// Student schemas
export const CreateStudentSchema = z.object({
  userId: IdSchema,
  classId: IdSchema,
  sectionId: IdSchema,
  admissionNumber: z.string().min(1).max(50),
  admissionDate: z.string().date(),
  dateOfBirth: z.string().date(),
  gender: z.enum(['male', 'female', 'other']),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
});

export const UpdateStudentSchema = CreateStudentSchema.partial();

// Parent schemas
export const CreateParentSchema = z.object({
  userId: IdSchema,
  relation: z.enum(['father', 'mother', 'guardian']),
  occupation: z.string().optional(),
  income: z.number().nonnegative().optional(),
});

export const UpdateParentSchema = CreateParentSchema.partial();

// Room schemas
export const CreateRoomSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(['classroom', 'lab', 'auditorium', 'playground', 'other']),
  capacity: z.number().int().positive().optional(),
  schoolId: IdSchema,
});

export const UpdateRoomSchema = CreateRoomSchema.partial();

// Time Slot schemas
export const CreateTimeSlotSchema = z.object({
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  periodNumber: z.number().int().positive(),
  academicYearId: IdSchema,
});

export const UpdateTimeSlotSchema = CreateTimeSlotSchema.partial();

// Class Subject schemas
export const CreateClassSubjectSchema = z.object({
  classId: IdSchema,
  subjectId: IdSchema,
  academicYearId: IdSchema,
  periodsPerWeek: z.number().int().positive(),
  priority: z.number().int().nonnegative().optional(),
});

export const UpdateClassSubjectSchema = CreateClassSubjectSchema.partial();

// Section Teacher schemas
export const CreateSectionTeacherSchema = z.object({
  sectionId: IdSchema,
  teacherId: IdSchema,
  academicYearId: IdSchema,
});

export const UpdateSectionTeacherSchema = CreateSectionTeacherSchema.partial();

// Timetable schemas
export const CreateTimetableSchema = z.object({
  classId: IdSchema,
  sectionId: IdSchema,
  subjectId: IdSchema,
  teacherId: IdSchema,
  roomId: IdSchema.optional(),
  dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  timeSlotId: IdSchema,
});

export const UpdateTimetableSchema = CreateTimetableSchema.partial();

// Student-Parent relationship schemas
export const CreateStudentParentSchema = z.object({
  studentId: IdSchema,
  parentId: IdSchema,
  isPrimary: z.boolean().default(false),
});

export const UpdateStudentParentSchema = CreateStudentParentSchema.partial();

// Exam schemas
export const CreateExamSchema = z.object({
  name: z.string().min(2).max(100),
  examType: z.enum(['unit', 'half_yearly', 'yearly', 'quarterly', 'other']),
  startDate: z.string().date(),
  endDate: z.string().date(),
  academicYearId: IdSchema,
  classId: IdSchema,
});

export const UpdateExamSchema = CreateExamSchema.partial();

// Exam Subject schemas
export const CreateExamSubjectSchema = z.object({
  examId: IdSchema,
  subjectId: IdSchema,
  maxMarks: z.number().int().positive(),
  passMarks: z.number().int().nonnegative(),
});

export const UpdateExamSubjectSchema = CreateExamSubjectSchema.partial();

// Student Exam schemas
export const CreateStudentExamSchema = z.object({
  studentExamId: IdSchema,
  studentId: IdSchema,
  marksObtained: z.number().nonnegative(),
  remarks: z.string().optional(),
});

export const UpdateStudentExamSchema = CreateStudentExamSchema.partial();

// Query parameter schemas
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const FilterSchema = z.object({
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Type exports
export type CreateSchoolInput = z.infer<typeof CreateSchoolSchema>;
export type UpdateSchoolInput = z.infer<typeof UpdateSchoolSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type CreateAcademicYearInput = z.infer<typeof CreateAcademicYearSchema>;
export type UpdateAcademicYearInput = z.infer<typeof UpdateAcademicYearSchema>;
export type CreateClassInput = z.infer<typeof CreateClassSchema>;
export type UpdateClassInput = z.infer<typeof UpdateClassSchema>;
export type CreateSectionInput = z.infer<typeof CreateSectionSchema>;
export type UpdateSectionInput = z.infer<typeof UpdateSectionSchema>;
export type CreateSubjectInput = z.infer<typeof CreateSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof UpdateSubjectSchema>;
export type CreateTeacherInput = z.infer<typeof CreateTeacherSchema>;
export type UpdateTeacherInput = z.infer<typeof UpdateTeacherSchema>;
export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentInput = z.infer<typeof UpdateStudentSchema>;
export type CreateParentInput = z.infer<typeof CreateParentSchema>;
export type UpdateParentInput = z.infer<typeof UpdateParentSchema>;
export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomInput = z.infer<typeof UpdateRoomSchema>;
export type CreateTimeSlotInput = z.infer<typeof CreateTimeSlotSchema>;
export type UpdateTimeSlotInput = z.infer<typeof UpdateTimeSlotSchema>;
export type CreateClassSubjectInput = z.infer<typeof CreateClassSubjectSchema>;
export type UpdateClassSubjectInput = z.infer<typeof UpdateClassSubjectSchema>;
export type CreateSectionTeacherInput = z.infer<typeof CreateSectionTeacherSchema>;
export type UpdateSectionTeacherInput = z.infer<typeof UpdateSectionTeacherSchema>;
export type CreateTimetableInput = z.infer<typeof CreateTimetableSchema>;
export type UpdateTimetableInput = z.infer<typeof UpdateTimetableSchema>;
export type CreateStudentParentInput = z.infer<typeof CreateStudentParentSchema>;
export type UpdateStudentParentInput = z.infer<typeof UpdateStudentParentSchema>;
export type CreateExamInput = z.infer<typeof CreateExamSchema>;
export type UpdateExamInput = z.infer<typeof UpdateExamSchema>;
export type CreateExamSubjectInput = z.infer<typeof CreateExamSubjectSchema>;
export type UpdateExamSubjectInput = z.infer<typeof UpdateExamSubjectSchema>;
export type CreateStudentExamInput = z.infer<typeof CreateStudentExamSchema>;
export type UpdateStudentExamInput = z.infer<typeof UpdateStudentExamSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type FilterInput = z.infer<typeof FilterSchema>;
