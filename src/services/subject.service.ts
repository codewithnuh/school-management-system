import { Subject, SubjectAttributes } from '@/models/Subject'
import { z } from 'zod'

export async function createSubject(data: Omit<SubjectAttributes, 'id'>) {
    try {
        // Validate the input data
        const validatedData = Subject.validateSubject(data)

        // Create the subject
        const subject = await Subject.create(validatedData)
        return subject
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(
                `Validation error: ${error.errors.map(e => e.message).join(', ')}`,
            )
        }
        throw error
    }
}

export async function getSubjectById(id: number) {
    const subject = await Subject.findByPk(id)
    if (!subject) {
        throw new Error('Subject not found')
    }
    return subject
}

export async function getAllSubjects() {
    const subjects = await Subject.findAll()
    return subjects
}
export async function updateSubject(
    id: number,
    data: Partial<SubjectAttributes>,
) {
    try {
        // Validate the input data
        const validatedData = Subject.validateSubject(data)

        // Update the subject
        const subject = await Subject.update(validatedData, {
            where: { id },
        })
        return subject
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(
                `Validation error: ${error.errors.map(e => e.message).join(', ')}`,
            )
        }
        throw error
    }
}

export async function deleteSubject(id: number) {
    const subject = await Subject.findByPk(id)
    if (!subject) {
        throw new Error('Subject not found')
    }
    await subject.destroy()
    return subject
}
