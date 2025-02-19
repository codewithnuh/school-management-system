import { User, Teacher, Admin, OTP, Parent } from '@/models/index.js'
import { sendOtp } from '@/services/email.service.js'
import bcrypt from 'bcryptjs'

export class ForgotPassword {
    public static sendForgotPasswordOTP = async ({
        entityType,
        email,
    }: {
        email: string
        entityType: 'STUDENT' | 'ADMIN' | 'TEACHER' | 'PARENT'
    }) => {
        let entity = null

        switch (entityType) {
            case 'STUDENT':
                entity = await User.findOne({ where: { email } })
                break
            case 'TEACHER':
                entity = await Teacher.findOne({ where: { email } })
                break
            case 'ADMIN':
                entity = await Admin.findOne({ where: { email } })
                break
            case 'PARENT':
                entity = await Parent.findOne({ where: { email } })
                break
            default:
                break
        }

        if (!entity) {
            throw new Error('No entity found')
        }

        await OTP.cleanPreviousOtps({ entityId: entity.id, entityType })
        const otpRecord = await OTP.createOTP(entity.id, entityType)

        await sendOtp({
            entityEmail: entity.email,
            entityFirstName: entity.firstName,
            entityType,
            OTP: otpRecord.otp,
        })

        return {
            OTP: otpRecord.otp,
            id: entity.id,
            entityType,
            email: entity.email,
            isUsed: otpRecord.isUsed,
        }
    }

    public static resetPassword = async (
        oneTimePassword: string,
        newPassword: string,
    ) => {
        const validOtp = await OTP.findOne({
            where: { otp: oneTimePassword },
        })
        if (!validOtp) throw new Error('Invalid OTP')
        if (validOtp.isUsed) throw new Error('OTP already used')

        await validOtp.markAsUsed()

        const personId = validOtp.entityId
        const entityType = validOtp.entityType

        if (!newPassword) throw new Error('Please provide new password')

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)

        switch (entityType) {
            case 'ADMIN': {
                const admin = await Admin.findByPk(personId)
                if (!admin) throw new Error('Admin not found')
                await admin.update({ password: hashedNewPassword })
                return 'Password reset successfully'
            }
            case 'TEACHER': {
                const teacher = await Teacher.findByPk(personId)
                if (!teacher) throw new Error('Teacher not found')
                await teacher.update({ password: hashedNewPassword })
                return 'Password reset successfully'
            }
            case 'STUDENT': {
                const student = await User.findByPk(personId)
                if (!student) throw new Error('Student not found')
                await student.update({ password: hashedNewPassword })
                return 'Password reset successfully'
            }
            case 'PARENT': {
                const parent = await Parent.findByPk(personId)
                if (!parent) throw new Error('Parent not found')
                await parent.update({ password: hashedNewPassword })
                return 'Password reset successfully'
            }
            default:
                throw new Error('Invalid entity type')
        }
    }
}
