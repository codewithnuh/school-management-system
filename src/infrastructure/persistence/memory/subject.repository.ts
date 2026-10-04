import type {
    CreateSubject,
    SubjectRecord,
    UpdateSubject,
} from '@/modules/subjects/domain/subject.js'
import type { SubjectRepository } from '@/modules/subjects/subject.repository.js'

export class InMemorySubjectRepository implements SubjectRepository {
    private readonly records = new Map<number, SubjectRecord>()
    private nextId = 1

    async create(input: CreateSubject): Promise<SubjectRecord> {
        const now = new Date()
        const subject: SubjectRecord = {
            ...input,
            description: input.description ?? null,
            id: this.nextId++,
            createdAt: now,
            updatedAt: now,
        }
        this.records.set(subject.id, subject)
        return { ...subject }
    }

    async findById(id: number): Promise<SubjectRecord | null> {
        const subject = this.records.get(id)
        return subject ? { ...subject } : null
    }

    async findBySchoolId(schoolId: number): Promise<SubjectRecord[]> {
        return [...this.records.values()]
            .filter(subject => subject.schoolId === schoolId)
            .map(subject => ({ ...subject }))
    }

    async update(
        id: number,
        input: UpdateSubject,
    ): Promise<SubjectRecord | null> {
        const subject = this.records.get(id)
        if (!subject) return null

        const updated = { ...subject, ...input, updatedAt: new Date() }
        this.records.set(id, updated)
        return { ...updated }
    }

    async delete(id: number, schoolId: number): Promise<SubjectRecord | null> {
        const subject = this.records.get(id)
        if (!subject || subject.schoolId !== schoolId) return null

        this.records.delete(id)
        return { ...subject }
    }
}
