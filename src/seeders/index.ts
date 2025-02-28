// src/seeders/index.ts
import { seedUsers } from './user.seeder.js'
import { seedTeachers } from './teacher.seeder.js'
// import { seedClasses } from './class.seeder'
import { seedSubjects } from './subject.seeder.js'
import { seedAdmins } from './admin.seeder.js'
// import { seedSections } from './section.seeder'

const seed = async () => {
    await seedTeachers()
    await seedUsers()
    await seedSubjects()
    await seedAdmins()
    // await seedClasses()
    // await seedSections()
}

export default seed
