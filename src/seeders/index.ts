// src/seeders/index.ts
import { seedUsers } from './user.seeder'
import { seedTeachers } from './teacher.seeder'
import { seedClasses } from './class.seeder'
import { seedSubjects } from './subject.seeder'
import { seedSections } from './section.seeder'
import { seedTimeSlots } from './timeslot.seeder'

const seed = async () => {
    // await seedClasses()
    await seedTeachers()
    await seedUsers()
    await seedSubjects()
    // await seedSections()
    // await seedTimeSlots()
}

export default seed
