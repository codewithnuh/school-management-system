import { Teacher } from '@/models/Teacher.js'
import { User } from '@/models/User.js'
import { sendOtp } from './email.service.js'
import { OTP } from '@/models/OTP.js'

export const sendForgotPasswordOTP = async ({
    entityType,
    email,
}: {
    email: string
    entityType: 'STUDENT' | 'ADMIN' | 'TEACHER' | 'PARENT'
}) => {
    let entity = null
    switch (entityType) {
        case 'STUDENT':
            entity = await User.findOne({
                where: {
                    email,
                },
            })
            break
        case 'TEACHER':
            entity = await Teacher.findOne({
                where: {
                    email,
                },
            })
            break
        case 'PARENT':
        default:
            break
    }
    if (!entity) {
        throw new Error('No entity found')
    }
    await OTP.cleanPreviousOtps({ entityId: entity.id, entityType })
    const Otp = await OTP.createOTP(entity!.id, entityType)

    sendOtp({
        entityEmail: entity!.email,
        entityFirstName: entity!.firstName,
        entityType,
        OTP: Otp.otp,
    })
    return {
        OTP: Otp.otp,
        id: entity.id,
        entityType,
        email: entity.email,
        isUsed: Otp.isUsed,
    }
}
