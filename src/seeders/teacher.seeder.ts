// src/seeders/teacher.seeder.ts
import { Teacher, Subject } from '@/models/Teacher'

export const seedTeachers = async () => {
    try {
        await Teacher.bulkCreate(
            [
                {
                    firstName: 'Test',
                    lastName: 'Teacher',
                    email: 'teacher@example.com',
                    password: 'password',
                    dateOfBirth: new Date('2000-01-01'),
                    gender: 'Male',
                    phoneNo: '1234567890',
                    address: 'Test Address',
                    cnic: '1234567891234',
                    highestQualification: 'Masters',
                    joiningDate: new Date('2025-01-30'),
                    emergencyContactName: 'Test Contact',
                    emergencyContactNumber: '0987654321',
                    subject: Subject.Maths,
                    isVerified: true,
                    entityType: 'TEACHER',
                    role: 'TEACHER',
                },
                {
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'jane.doe@example.com',
                    password: 'password',
                    dateOfBirth: new Date('2000-01-01'),
                    gender: 'Female',
                    phoneNo: '1234567891',
                    address: 'Test Address 2',
                    cnic: '1234567891235',
                    highestQualification: 'Bachelors',
                    joiningDate: new Date('2025-01-30'),
                    emergencyContactName: 'Jane Contact',
                    emergencyContactNumber: '0987654322',
                    subject: Subject.English,
                    isVerified: true,
                    entityType: 'TEACHER',
                    role: 'TEACHER',
                },
            ],
            { ignoreDuplicates: true },
        ) // Ignore duplicates on subsequent seeding
        console.log('Teachers seeded successfully')
    } catch (error) {
        console.error('Error seeding teachers:', error)
    }
}
