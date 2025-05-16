import { Admin } from '@/models/index.js'

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
