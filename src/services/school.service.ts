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
            const school = await School.findByPk(id)
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
