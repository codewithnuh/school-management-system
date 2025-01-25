import { Request, Response } from 'express'
import { User } from '@/models/User'

class UserController {
    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const {
                firstName,
                middleName,
                lastName,
                dateOfBirth,
                gender,
                placeOfBirth,
                nationality,
                email,
                phoneNo,
                emergencyContactName,
                emergencyContactNumber,
                address,
                studentId,
                previousSchool,
                previousGrade,
                previousMarks,
                isRegistered,
                guardianName,
                guardianCNIC,
                guardianPhone,
                guardianEmail,
                CNIC,
                class: userClass,
                enrollmentDate,
                uuid,
                medicalConditions,
                allergies,
                photo,
                transportation,
                extracurriculars,
                healthInsuranceInfo,
                doctorContact,
            } = req.body

            const user = await User.create({
                firstName,
                middleName,
                lastName,
                dateOfBirth,
                gender,
                placeOfBirth,
                nationality,
                email,
                phoneNo,
                emergencyContactName,
                emergencyContactNumber,
                address,
                studentId,
                previousSchool,
                previousGrade,
                previousMarks,
                isRegistered,
                guardianName,
                guardianCNIC,
                guardianPhone,
                guardianEmail,
                CNIC,
                class: userClass,
                enrollmentDate,
                uuid,
                medicalConditions,
                allergies,
                photo,
                transportation,
                extracurriculars,
                healthInsuranceInfo,
                doctorContact,
            })

            res.json({
                user,
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message })
            }
        }
    }

    public async getAllUsers(req: Request, res: Response): Promise<void> {
        res.json({
            body: req.body,
        })
    }
}

export default new UserController()
