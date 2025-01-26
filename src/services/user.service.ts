import { v4 as uuidv4 } from 'uuid' // For generating tokens
import { User } from '@/models/User'
import { PasswordResetToken } from '@/models/PasswordResetToken'
// import sendEmail from './utils/sendEmail' // Your email sending function

export async function acceptStudentApplication(userId: number): Promise<void> {
    try {
        const user = await User.findByPk(userId)
        if (!user) {
            throw new Error('User not found')
        }

        if (user.isRegistered) {
            throw new Error('User already registered')
        }

        // Generate a unique token
        const token = uuidv4()

        // Set token expiry (e.g., 1 hour)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        // Store the token in the database
        await PasswordResetToken.create({
            token,
            userId: user.id,
            expiryDate,
        })
        console.log(token)

        // Send acceptance email with password setup link
        // const setupLink = `http://yourdomain.com/set-password?token=${token}` // Replace with your actual domain
        //    WIP
        // await sendEmail({
        //     to: user.email,
        //     subject: 'Your Application Has Been Accepted',
        //     html: `<p>Congratulations! Your application has been accepted. Please click <a href="${setupLink}">here</a> to set up your password.</p>`,
        // })

        await user.update({ isRegistered: true })

        console.log(
            `Acceptance email sent to ${user.email} with token: ${token}`,
        )
    } catch (error) {
        console.error('Error accepting student application:', error)
        throw error
    }
}
