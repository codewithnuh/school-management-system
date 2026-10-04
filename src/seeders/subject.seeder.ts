import { School } from '@/models/School.js'
import { Subject } from '@/models/Subject.js'

const SUBJECTS = [
    { code: 'MATH', name: 'Mathematics', description: 'Mathematics subject' },
    { code: 'ENG', name: 'English', description: 'English subject' },
    { code: 'COMP', name: 'Computer Science', description: 'Computer Science subject' },
    { code: 'PHY', name: 'Physics', description: 'Physics subject' },
    { code: 'CHEM', name: 'Chemistry', description: 'Chemistry subject' },
    { code: 'URD', name: 'Urdu', description: 'Urdu subject' },
    { code: 'PAKST', name: 'Pakistan Studies', description: 'Pakistan Studies subject' },
] as const

export async function seedSubjects(): Promise<void> {
    const schools = await School.findAll({ attributes: ['id'] })
    for (const school of schools) {
        for (const subject of SUBJECTS) {
            await Subject.findOrCreate({
                where: { schoolId: school.id, code: subject.code },
                defaults: {
                    ...subject,
                    schoolId: school.id,
                    category: 'CORE',
                    credits: 0,
                },
            })
        }
    }
}
