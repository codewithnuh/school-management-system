import { z } from 'zod'

export const createSubjectSchema = z.object({
    schoolId: z.number().int().positive(),
    name: z.string().trim().min(1, 'Subject name is required'),
    code: z.string().trim().min(1, 'Subject code is required'),
    description: z.string().optional(),
    category: z.enum(['CORE', 'ELECTIVE', 'EXTRA_CURRICULAR']),
    credits: z.number().min(0).default(0),
    isActive: z.boolean().default(true),
})

export const updateSubjectSchema = createSubjectSchema
    .omit({ schoolId: true })
    .partial()

export type CreateSubject = z.infer<typeof createSubjectSchema>
export type UpdateSubject = z.infer<typeof updateSubjectSchema>

export interface SubjectRecord extends Omit<CreateSubject, 'description'> {
    description: string | null
    id: number
    createdAt: Date
    updatedAt: Date
}
