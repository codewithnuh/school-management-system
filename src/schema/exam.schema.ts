import { z } from 'zod'

export const ExamSchema = z.object({
    name: z.string().min(1, 'Exam name is required'),
    type: z.enum(['Mid-Term', 'Final']),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    academicYear: z
        .string()
        .regex(/^\d{4}-\d{4}$/, 'Invalid academic year format (YYYY-YYYY)'),
    classId: z.number().positive('Class ID must be a positive number'),
    sectionId: z
        .number()
        .positive('Section ID must be a positive number')
        .optional(),
})

export type ExamAttributes = z.infer<typeof ExamSchema>
