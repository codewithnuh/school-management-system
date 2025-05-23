import { Op } from 'sequelize'
import { User, Teacher, Admin, OTP, Parent, Owner } from '@/models/index.js'
import { sendOtp } from '@/services/email.service.js'
import bcrypt from 'bcryptjs'

/**
 * The ForgotPassword service implements a two-step flow for resetting passwords:
 * 1. verifyEmailAndSendOTP: Verifies if an entity exists with the provided email and entity type,
 *    cleans up previous OTPs, creates a new OTP, and sends it to the registered email.
 * 2. resetPassword: Verifies the provided OTP (with expiration), marks it as used, and resets the password.
 *
 * The flow ensures that first the email is validated and the OTP is sent,
 * and later, using the OTP, the user can reset the password.
 */
export class ForgotPassword {
    /**
     * Step 1: Verify email exists and send OTP.
     *
     * @param params.entityType - The type of entity ('STUDENT' | 'ADMIN' | 'TEACHER' | 'PARENT')
     * @param params.email - The email address to verify.
     * @returns An object with information that the OTP was sent.
     *
     * Flow:
     *  - Verify if a record exists matching the provided email and entity type.
     *  - Clean up any previous OTPs for that entity.
     *  - Generate a new OTP and send it via email.
     */
    public static verifyEmailAndSendOTP = async ({
        entityType,
        email,
    }: {
        email: string
        entityType: 'STUDENT' | 'ADMIN' | 'TEACHER' | 'PARENT' | 'OWNER'
    }): Promise<{
        id: number
        entityType: string
        email: string
        message: string
    }> => {
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
            case 'OWNER':
                entity = await Owner.findOne({ where: { email } })
                break
            default:
                break
        }

        if (!entity) {
            throw new Error('No entity found with the provided email')
        }

        // Clean up previous OTPs for this entity.
        await OTP.cleanPreviousOtps({ entityId: entity.id, entityType })

        // Generate and store a new OTP (with expiration).
        const otpRecord = await OTP.createOTP(entity.id, entityType)

        // Send the OTP via email.
        await sendOtp({
            entityEmail: entity.email,
            entityFirstName:
                'firstName' in entity ? entity.firstName : entity.fullName,
            entityType,
            OTP: otpRecord.otp,
        })

        return {
            id: entity.id,
            entityType,
            email: entity.email,
            message: 'OTP has been sent successfully. Please check your email.',
        }
    }

    /**
     * Step 2: Reset the password using the OTP.
     *
     * @param oneTimePassword - The OTP provided by the user.
     * @param newPassword - The new password to be set.
     * @returns A success message upon successful password change.
     *
     * Flow:
     *  - Validate the OTP to ensure it is unexpired and unused.
     *  - Immediately mark the OTP as used to prevent race conditions.
     *  - Hash the new password.
     *  - Update the password for the corresponding entity.
     */
    public static resetPassword = async (
        oneTimePassword: string,
        newPassword: string,
    ): Promise<string> => {
        if (!oneTimePassword)
            throw new Error('Please provide one-time password')
        if (!newPassword) throw new Error('Please provide new password')

        // Validate OTP with check for expiration and that it is not used.
        const validOtp = await OTP.findOne({
            where: {
                otp: oneTimePassword,
                isUsed: false,
                expiresAt: { [Op.gt]: new Date() },
            },
        })

        if (!validOtp) throw new Error('Invalid or expired OTP')

        // Mark the OTP as used immediately to avoid race conditions.
        await validOtp.markAsUsed()

        const personId = validOtp.entityId
        const entityType = validOtp.entityType

        // Hash the new password before storing.
        const hashedNewPassword = await bcrypt.hash(newPassword, 10)

        // Update password based on the entity type.
        switch (entityType) {
            case 'ADMIN': {
                const admin = await Admin.findByPk(personId)
                if (!admin) throw new Error('Admin not found')
                await admin.update({ password: hashedNewPassword })
                break
            }
            case 'TEACHER': {
                const teacher = await Teacher.findByPk(personId)
                if (!teacher) throw new Error('Teacher not found')
                await teacher.update({ password: hashedNewPassword })
                break
            }
            case 'STUDENT': {
                const student = await User.findByPk(personId)
                if (!student) throw new Error('Student not found')
                await student.update({ password: hashedNewPassword })
                break
            }
            case 'PARENT': {
                const parent = await Parent.findByPk(personId)
                if (!parent) throw new Error('Parent not found')
                await parent.update({ password: hashedNewPassword })
                break
            }
            case 'OWNER': {
                const owner = await Owner.findByPk(personId)
                if (!owner) throw new Error('Owner not found')
                await owner.update({ password: hashedNewPassword })
                break
            }
            default:
                throw new Error('Invalid entity type')
        }

        return 'Password reset successfully'
    }
}
