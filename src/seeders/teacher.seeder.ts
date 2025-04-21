// src/seeders/teacher.seeder.ts
import { Teacher, Gender, ApplicationStatus } from '@/models/Teacher.js'
import { Subject } from '@/models/Subject.js'
import { faker } from '@faker-js/faker' // You'll need to install faker: npm install @faker-js/faker
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcryptjs'
enum EntityType {
    TEACHER = 'TEACHER',
}
export const seedTeachers = async () => {
    try {
        // Fetch all subjects
        const subjects = await Subject.findAll()

        if (!subjects || subjects.length === 0) {
            console.error('No subjects found. Seed subjects first.')
            return
        }

        // Create teachers dynamically
        const teachers = subjects.map(subject => ({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            dateOfBirth: faker.date.past(),
            role: EntityType.TEACHER,
            gender: faker.helpers.arrayElement([
                Gender.Male,
                Gender.Female,
                Gender.Other,
            ]),
            email: faker.internet.email(),
            phoneNo: faker.phone.number(),
            entityType: EntityType.TEACHER,
            password: bcrypt.hashSync('teacher123'), //Insecure - use bcrypt or similar for production
            address: faker.address.streetAddress(),
            cnic: uuid(), //Insecure - use a proper CNIC generation method if possible
            highestQualification: faker.helpers.arrayElement([
                'Bachelors',
                'Masters',
                'PhD',
            ]),
            joiningDate: faker.date.past(),
            emergencyContactName: faker.person.fullName(),
            emergencyContactNumber: faker.phone.number(),
            isVerified: false,
            applicationStatus: ApplicationStatus.Pending,
            subjectId: subject.id, // Assign each teacher to a subject
        }))

        await Teacher.bulkCreate(teachers, { ignoreDuplicates: true })
        console.log('Teachers seeded successfully')
    } catch (error) {
        console.error('Error seeding teachers:', error)
    }
}
