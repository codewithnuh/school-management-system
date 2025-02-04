import { z } from 'zod'

export const GradeSchema = z.object({
    grade: z.string().min(1, 'Grade is required'),
    minMarks: z.number().min(0, 'Minimum marks cannot be negative'),
    maxMarks: z.number().min(1, 'Maximum marks must be at least 1'),
})

export type GradeAttributes = z.infer<typeof GradeSchema>
