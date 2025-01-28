import { Teacher } from '@/models/Teacher'
import { User } from '@/models/User'
import { sendOtp } from './email.service'
import { OTP } from '@/models/OTP'

export const forgotPasswordService = async ({
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
        case 'PARENT':
        default:
            break
    }
    if (!entity) {
        throw new Error('No entity found')
    }
    const Otp = await OTP.createOTP(entity!.id, entityType)
    sendOtp({
        entityEmail: entity!.email,
        entityFirstName: entity!.firstName,
        entityType,
        OTP: Otp.otp,
    })
}
