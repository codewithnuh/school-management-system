import { Admin, School } from '@/models/index.js'

class OwnerService {
    async getAllAdmins() {
        const admins = await Admin.findAll()
        return admins
    }
    async getAdminById(id: string) {
        const admin = await Admin.findByPk(id)
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
    async getSchoolByAdminId(adminId: string) {
        const school = await School.findOne({ where: { adminId: adminId } })
        return school
    }
}
export const ownerService = new OwnerService()
