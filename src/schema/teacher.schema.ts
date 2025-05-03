import { z } from 'zod'

// Zod schema for Teacher Registration
export const teacherSchema = z.object({
    firstName: z.string().trim().min(1, 'First name is required'),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim().min(1, 'Last name is required'),
    password: z.string().optional(),
    dateOfBirth: z.coerce.date(),
    schoolId: z.number(),
    subjectId: z.number(),
    gender: z.enum(['Male', 'Female', 'Other']),
    nationality: z.string().trim().optional(),
    email: z.string().email('Invalid email format'),
    entityType: z.enum(['TEACHER']),
    phoneNo: z
        .string()
        .trim()
        .min(10, 'Phone number must be between 10 and 15 digits')
        .max(15, 'Phone number must be between 10 and 15 digits'),
    address: z.string().trim().min(1, 'Address is required'),
    currentAddress: z.string().trim().optional(),
    cnic: z.string().trim().length(13, 'CNIC must be 13 digits'),
    highestQualification: z
        .string()
        .trim()
        .min(1, 'Highest qualification is required'),
    specialization: z.string().trim().optional(),
    experienceYears: z.number().int().positive().optional(),
    joiningDate: z.coerce.date().optional(),
    photo: z.string().trim().optional(), // Store path or URL
    emergencyContactName: z
        .string()
        .trim()
        .min(1, 'Emergency contact name is required'),
    emergencyContactNumber: z
        .string()
        .trim()
        .min(10, 'Emergency contact number must be between 10 and 15 digits')
        .max(15, 'Emergency contact number must be between 10 and 15 digits'),
    verificationDocument: z.string().trim().optional(), // Store path or URL
    cvPath: z.string().trim().optional(), // Path or URL to CV

    applicationStatus: z
        .enum(['Pending', 'Interview', 'Accepted', 'Rejected'])
        .optional(),
})
