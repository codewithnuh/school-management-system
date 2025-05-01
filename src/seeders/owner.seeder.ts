import { Owner } from '@/models/Owner'
import bcrypt from 'bcryptjs'
export const seedOwner = async () => {
    try {
        await Owner.bulkCreate([
            {
                email: 'codewithnuh@outlook.com',
                password: bcrypt.hashSync('Owner.password', 10),
                fullName: 'Noor ul hassan',
                isSuperAdmin: true,
            },
        ])
    } catch (error) {
        console.log(error)
    }
}
