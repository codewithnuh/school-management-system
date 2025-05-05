import { Admin, School } from '@/models/index.js'

class AdminService {
    async getAllAdmins() {
        const admins = await Admin.findAll({
            attributes: { exclude: ['password', 'phoneNo'] },
        })
        return admins
    }
    async getAdminById(id: number) {
        const admin = await Admin.findOne({
            where: {
                id,
            },
            attributes: { exclude: ['password', 'phoneNo'] },
        })
        return admin
    }
    async getAllSchools() {
        const schools = await School.findAll()
        return schools
    }
    async getSchoolById(id: string) {
        const school = await School.findByPk(id)
        return school
    }
    async getSchoolByAdminId(adminId: number) {
        const school = await School.findOne({
            where: { adminId: adminId },
        })
        return school
    }
    async updateAdminById(
        adminId: number,
        isSubscriptionActive: boolean,
        subscriptionPlan: 'yearly' | 'monthly',
    ) {
        const admin = await Admin.findOne({
            where: {
                id: adminId,
            },
            attributes: { exclude: ['password', 'phoneNo'] },
        })
        const updatedAdmin = admin?.update({
            isSubscriptionActive,
            subscriptionPlan,
        })
        return updatedAdmin
    }
    async verifyAdminSubscriptionByAdminId(adminId: number) {
        const admin = await Admin.findOne({
            where: {
                id: adminId,
            },
        })
        if (!admin) throw new Error('No admin found with this id')
        const isSubscriptionActive = admin?.isSubscriptionActive
        return isSubscriptionActive
    }
}
export const adminService = new AdminService()
