import { SequelizeSubjectRepository } from '@/infrastructure/persistence/sequelize/subject.repository.js'
import { SubjectService } from './application/subject.service.js'

export { SubjectService } from './application/subject.service.js'
export { createSubjectSchema, updateSubjectSchema } from './domain/subject.js'
export type { SubjectRepository } from './subject.repository.js'

export const subjectService = new SubjectService(
    new SequelizeSubjectRepository(),
)
