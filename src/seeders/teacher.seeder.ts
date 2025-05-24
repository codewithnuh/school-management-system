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
            middleName: faker.name.middleName(),
            lastName: faker.name.lastName(),
            dateOfBirth: faker.date.past(),
            gender: faker.helpers.arrayElement([
                Gender.Male,
                Gender.Female,
                Gender.Other,
            ]),
            nationality: faker.address.country(),
            email: faker.internet.email(),
            phoneNo: faker.phone.number(),
            entityType: EntityType.TEACHER,
            password: bcrypt.hashSync('teacher123'), //Insecure - use bcrypt or similar for production
            address: faker.address.streetAddress(),
            currentAddress: faker.address.streetAddress(),
            cnic: faker.string.numeric(13), // Ensure CNIC is 13 digits
            highestQualification: faker.helpers.arrayElement([
                'Bachelors',
                'Masters',
                'PhD',
            ]),
            specialization: faker.lorem.word(),
            experienceYears: faker.number.int({ min: 1, max: 10 }),
            joiningDate: faker.date.past(),
            photo: faker.image.avatar(),
            emergencyContactName: faker.person.fullName(),
            emergencyContactNumber: faker.phone.number(),
            isVerified: true,
            applicationStatus: ApplicationStatus.Accepted,
            subjectId: subject.id, // Assign each teacher to a subject
            schoolId: 1,
            role: EntityType.TEACHER,
        }))

        await Teacher.bulkCreate(teachers, { ignoreDuplicates: true })
        console.log('Teachers seeded successfully')
    } catch (error) {
        console.error('Error seeding teachers:', error)
    }
}
