import { randomBytes, randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'
import { School } from '@/models/School.js'
import { Subject } from '@/models/Subject.js'
import { Teacher, ApplicationStatus } from '@/models/Teacher.js'
import { User } from '@/models/User.js'
import sequelize from '@/infrastructure/persistence/sequelize/client.js'

export async function seedTeachers(): Promise<void> {
    const subjects = await Subject.findAll({ where: { isActive: true } })
    for (const subject of subjects) {
        const school = await School.findByPk(subject.schoolId, { attributes: ['id'] })
        if (!school) continue

        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const email = faker.internet.email({ firstName, lastName }).toLowerCase()
        const passwordHash = await bcrypt.hash(randomBytes(32).toString('base64url'), 12)

        await sequelize.transaction(async transaction => {
            const user = await User.create(
                {
                    email,
                    passwordHash,
                    role: 'TEACHER',
                    schoolId: school.id,
                    firstName,
                    lastName,
                    phone: faker.phone.number(),
                    isActive: true,
                    isVerified: true,
                },
                { transaction },
            )

            await Teacher.create(
                {
                    userId: user.id,
                    schoolId: school.id,
                    employeeCode: randomUUID(),
                    qualification: faker.helpers.arrayElement(['Bachelors', 'Masters', 'PhD']),
                    specialization: subject.name,
                    experienceYears: faker.number.int({ min: 1, max: 10 }),
                    joiningDate: faker.date.past(),
                    dateOfBirth: faker.date.birthdate({ min: 25, max: 55, mode: 'age' }),
                    gender: faker.helpers.arrayElement(['MALE', 'FEMALE', 'OTHER']),
                    address: faker.location.streetAddress(),
                    isVerified: true,
                    applicationStatus: ApplicationStatus.Accepted,
                },
                { transaction },
            )
        })
    }
}
