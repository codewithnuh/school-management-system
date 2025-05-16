// src/seeders/admin.seeder.ts
import { Admin } from '@/models/Admin.js'
import bcrypt from 'bcryptjs'

export const seedAdmins = async () => {
    try {
        // Hash the password before seeding
        const hashedPassword = await bcrypt.hash('admin123', 10) // Hash 'admin123' with a salt round of 10

        await Admin.bulkCreate(
            [
                {
                    firstName: 'Super',
                    lastName: 'Admin',
                    email: 'nuh25792@gmail.com',
                    phoneNo: '1234567890',
                    password: hashedPassword, // Use the hashed password
                    entityType: 'ADMIN',
                    isSubscriptionActive: false,
                },
            ],
            { ignoreDuplicates: true },
        )
        console.log('Admins seeded successfully')
    } catch (error) {
        console.error('Error seeding admins:', error)
    }
}
