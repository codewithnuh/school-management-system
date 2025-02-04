// examSubject.schema.ts
import { z } from 'zod'

export const ExamSubjectSchema = z.object({
    examId: z.number().positive('Exam ID must be a positive number'),
    subjectId: z.number().positive('Subject ID must be a positive number'),
    maxMarks: z.number().min(1, 'Maximum marks must be at least 1'),
    passMarks: z.number().min(0, 'Pass marks cannot be negative'),
})

export type ExamSubjectAttributes = z.infer<typeof ExamSubjectSchema>
