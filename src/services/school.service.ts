import { School, SchoolType } from '@/models/index.js'

class SchoolService {
    async createSchool({
        name,
        description,
        brandColor,
        logo,
        adminId,
    }: SchoolType) {
        try {
            const school = await School.create({
                adminId,
                brandColor,
                description,
                logo,
                name,
            })
            return school
        } catch (error) {
            return error
        }
    }
    async getSchoolById(id: number) {
        try {
            const school = await School.findOne({
                where: { id },
            })
            return school
        } catch (error) {
            return error
        }
    }
    async getSchoolByAdminId(adminId: number) {
        try {
            const school = await School.findOne({
                where: { adminId },
            })
            return school
        } catch (error) {
            return error
        }
    }
    async getAllSchools() {
        try {
            const schools = await School.findAll()
            return schools
        } catch (error) {
            return error
        }
    }
    async getAllSchoolsCount() {
        const schools = await School.findAll()
        const count = schools.length
        return count
    }
    async updateSchool(id: number, data: SchoolType) {
        try {
            await School.update(data, {
                where: { id },
            })
        } catch (error) {
            return error
        }
    }
    async deleteSchool(id: number) {
        try {
            await School.destroy({ where: { id } })
        } catch (error) {
            return error
        }
    }
}
export const schoolService = new SchoolService()
