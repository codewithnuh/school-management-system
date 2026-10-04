import type {
    CreateSubject,
    SubjectRecord,
    UpdateSubject,
} from './domain/subject.js'

export interface SubjectRepository {
    create(input: CreateSubject): Promise<SubjectRecord>
    findById(id: number): Promise<SubjectRecord | null>
    findBySchoolId(schoolId: number): Promise<SubjectRecord[]>
    update(id: number, input: UpdateSubject): Promise<SubjectRecord | null>
    delete(id: number, schoolId: number): Promise<SubjectRecord | null>
}
