import { Owner } from '@/models/Owner'
import bcrypt from 'bcryptjs'
import process from 'process'
export const seedOwner = async () => {
    try {
        await Owner.bulkCreate([
            {
                email: 'codewithnuh@outlook.com',
                password: bcrypt.hashSync(
                    process.env.OWNER_PASSWORD as string,
                    10,
                ),
                fullName: 'Noor ul hassan',
                isSuperAdmin: true,
            },
        ])
    } catch (error) {
        console.log(error)
    }
}
