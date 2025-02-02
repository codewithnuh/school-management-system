// src/seeders/index.ts
import { seedUsers } from './user.seeder'
import { seedTeachers } from './teacher.seeder'
import { seedClasses } from './class.seeder'
import { seedSubjects } from './subject.seeder'
import { seedSections } from './section.seeder'

const seed = async () => {
    await seedTeachers()
    await seedUsers()
    await seedSubjects()
    // await seedClasses()
    // await seedSections()
}

export default seed
