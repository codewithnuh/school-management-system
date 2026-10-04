import { Subject as SequelizeSubject } from '@/models/Subject.js'
import type {
    CreateSubject,
    SubjectRecord,
    UpdateSubject,
} from '@/modules/subjects/domain/subject.js'
import type { SubjectRepository } from '@/modules/subjects/subject.repository.js'

export class SequelizeSubjectRepository implements SubjectRepository {
    async create(input: CreateSubject): Promise<SubjectRecord> {
        const subject = await SequelizeSubject.create(input)
        return this.toRecord(subject)
    }

    async findById(id: number): Promise<SubjectRecord | null> {
        const subject = await SequelizeSubject.findByPk(id)
        return subject ? this.toRecord(subject) : null
    }

    async findBySchoolId(schoolId: number): Promise<SubjectRecord[]> {
        const subjects = await SequelizeSubject.findAll({ where: { schoolId } })
        return subjects.map(subject => this.toRecord(subject))
    }

    async update(
        id: number,
        input: UpdateSubject,
    ): Promise<SubjectRecord | null> {
        const subject = await SequelizeSubject.findByPk(id)
        if (!subject) return null

        await subject.update(input)
        return this.toRecord(subject)
    }

    async delete(id: number, schoolId: number): Promise<SubjectRecord | null> {
        const subject = await SequelizeSubject.findOne({
            where: { id, schoolId },
        })
        if (!subject) return null

        const record = this.toRecord(subject)
        await subject.destroy()
        return record
    }

    private toRecord(subject: SequelizeSubject): SubjectRecord {
        return {
            id: subject.id,
            schoolId: subject.schoolId,
            name: subject.name,
            code: subject.code,
            description: subject.description ?? null,
            category: subject.category,
            credits: subject.credits,
            isActive: subject.isActive,
            createdAt: subject.createdAt,
            updatedAt: subject.updatedAt,
        }
    }
}
