// src/seeders/user.seeder.ts
import { User } from '@/models/User.js'

export const seedUsers = async () => {
    try {
        await User.bulkCreate(
            [
                {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    password: 'password123',
                    dateOfBirth: '1990-01-01',
                    gender: 'Male',
                    phoneNo: '1234567890',
                    emergencyContactName: 'Jane Doe',
                    emergencyContactNumber: '0987654321',
                    address: '123 Main St',
                    guardianName: 'Guardian',
                    guardianCNIC: '1234567890123',
                    CNIC: '1234567890123',
                    classId: 1,
                    enrollmentDate: '2025-01-30',
                    isRegistered: true,
                    studentId: '123456',
                    entityType: 'STUDENT',
                },
                {
                    firstName: 'Alice',
                    lastName: 'Smith',
                    email: 'alice.smith@example.com',
                    password: 'password123',
                    dateOfBirth: '1992-05-04',
                    gender: 'Female',
                    phoneNo: '1234567891',
                    emergencyContactName: 'Bob Smith',
                    emergencyContactNumber: '0987654322',
                    address: '124 Main St',
                    guardianName: 'Guardian',
                    guardianCNIC: '1234567890124',
                    CNIC: '1234567890124',
                    classId: 2,
                    enrollmentDate: '2025-01-30',
                    studentId: '123457',
                    entityType: 'STUDENT',
                    isRegistered: true,
                },
            ],
            { ignoreDuplicates: true },
        ) // Ignore duplicates on subsequent seeding
        console.log('Users seeded successfully')
    } catch (error) {
        console.error('Error seeding users:', error)
    }
}
