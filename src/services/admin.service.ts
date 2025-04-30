import { Admin } from '@/models/index.js'

class AdminUser {
    async getAllAdmins() {
        try {
            return await Admin.findAll({
                attributes: { exclude: ['password'] },
            })
        } catch (error) {
            return error
        }
    }
    async getAdminById(id: string) {
        try {
            return await Admin.findOne({
                where: {
                    id,
                },
                attributes: {
                    exclude: ['password'],
                },
            })
        } catch (error) {
            return error
        }
    }
}

export const adminUser = new AdminUser()
