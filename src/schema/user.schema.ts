import { z } from 'zod'

export const userSchema = z.object({
    id: z.number().optional(),
    firstName: z.string().trim().min(1, 'First name is required'),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim().min(1, 'Last name is required'),
    dateOfBirth: z.string(),
    gender: z.enum(['Male', 'Female', 'Other']),
    placeOfBirth: z.string().optional(),
    nationality: z.string().optional(),
    email: z.string().email('Invalid email format'),
    phoneNo: z
        .string()
        .trim()
        .min(10, 'Phone number must be between 10 and 15 characters')
        .max(15, 'Phone number must be between 10 and 15 characters'),
    entityType: z.enum(['STUDENT']),
    sectionId: z.number(),
    emergencyContactName: z
        .string()
        .trim()
        .min(1, 'Emergency contact name is required'),
    emergencyContactNumber: z
        .string()
        .trim()
        .min(
            10,
            'Emergency contact number must be between 10 and 15 characters',
        )
        .max(
            15,
            'Emergency contact number must be between 10 and 15 characters',
        ),
    address: z.string().trim().min(1, 'Address is required'),
    currentAddress: z.string().trim().optional(),
    studentId: z.string().trim().min(1, 'Student ID is required'), // Assuming a virtual column
    previousSchool: z.string().trim().optional(),
    previousGrade: z.string().trim().optional(),
    previousMarks: z.string().optional(), // Consider Zod array or object for complex structure
    isRegistered: z.boolean().default(false),
    password: z
        .string()
        .trim()
        .min(6, 'Password must be at least 6 characters')
        .optional(), // Adjust minimum length as needed

    guardianName: z.string().trim().min(1, 'Guardian name is required'),
    guardianCNIC: z
        .string()
        .trim()
        .min(13, 'Guardian CNIC must be 13 characters')
        .max(13, 'Guardian CNIC must be 13 characters'),
    guardianPhone: z
        .string()
        .trim()
        .min(10, 'Guardian phone number must be between 10 and 15 characters')
        .max(15, 'Guardian phone number must be between 10 and 15 characters')
        .optional(),
    guardianEmail: z.string().email('Invalid guardian email format').optional(),
    CNIC: z
        .string()
        .trim()
        .min(13, 'CNIC must be 13 characters')
        .max(13, 'CNIC must be 13 characters'),
    classId: z.number(),
    enrollmentDate: z.string(),
    photo: z.string().trim().optional(),
    transportation: z.string().trim().optional(),
    extracurriculars: z.string().trim().optional(),
    medicalConditions: z.string().trim().optional(),
    allergies: z.string().trim().optional(),
    healthInsuranceInfo: z.string().trim().optional(),
    doctorContact: z.string().trim().optional(),
})
