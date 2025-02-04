import { z } from 'zod'

export const ResultSchema = z.object({
    studentId: z.number().positive('Student ID must be a positive number'),
    examSubjectId: z
        .number()
        .positive('Exam Subject ID must be a positive number'),
    marksObtained: z.number().min(0, 'Marks obtained cannot be negative'),
})

export type ResultAttributes = z.infer<typeof ResultSchema>
