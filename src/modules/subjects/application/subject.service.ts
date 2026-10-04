import {
    createSubjectSchema,
    updateSubjectSchema,
    type SubjectRecord,
} from '@/modules/subjects/domain/subject.js'
import type { SubjectRepository } from '@/modules/subjects/subject.repository.js'

export class SubjectService {
    constructor(private readonly repository: SubjectRepository) {}

    async createSubject(data: unknown): Promise<SubjectRecord> {
        const input = createSubjectSchema.parse(data)
        return this.repository.create(input)
    }

    async getSubjectById(id: number): Promise<SubjectRecord> {
        const subject = await this.repository.findById(id)
        if (!subject) throw new Error('Subject not found')
        return subject
    }

    async getAllSubjects(schoolId: number): Promise<SubjectRecord[]> {
        return this.repository.findBySchoolId(schoolId)
    }

    async updateSubject(id: number, data: unknown): Promise<SubjectRecord> {
        const input = updateSubjectSchema.parse(data)
        const subject = await this.repository.update(id, input)
        if (!subject) throw new Error('Subject not found')
        return subject
    }

    async deleteSubject(id: number, schoolId: number): Promise<SubjectRecord> {
        const subject = await this.repository.delete(id, schoolId)
        if (!subject) throw new Error('Subject not found')
        return subject
    }
}
