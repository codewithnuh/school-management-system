import { describe, expect, it } from 'vitest'
import { InMemorySubjectRepository } from '@/infrastructure/persistence/memory/subject.repository.js'
import { SubjectService } from '@/modules/subjects/application/subject.service.js'

describe('SubjectService', () => {
    it('validates inputs and persists subjects through the repository contract', async () => {
        const service = new SubjectService(new InMemorySubjectRepository())
        const subject = await service.createSubject({
            schoolId: 1,
            name: 'Mathematics',
            code: 'MATH-1',
            category: 'CORE',
        })

        expect(subject.name).toBe('Mathematics')
        expect(subject.description).toBeNull()
        expect(subject.credits).toBe(0)
        await expect(service.getSubjectById(subject.id)).resolves.toEqual(
            subject,
        )
    })

    it('rejects malformed create inputs before calling persistence', async () => {
        const service = new SubjectService(new InMemorySubjectRepository())

        await expect(
            service.createSubject({ schoolId: -1, name: '', code: '' }),
        ).rejects.toThrow()
    })

    it('does not delete a subject belonging to another school', async () => {
        const service = new SubjectService(new InMemorySubjectRepository())
        const subject = await service.createSubject({
            schoolId: 1,
            name: 'Science',
            code: 'SCI-1',
            category: 'CORE',
        })

        await expect(service.deleteSubject(subject.id, 2)).rejects.toThrow(
            'Subject not found',
        )
        await expect(service.getSubjectById(subject.id)).resolves.toEqual(
            subject,
        )
    })
})
