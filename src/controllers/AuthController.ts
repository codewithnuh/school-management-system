import { PasswordResetToken } from '@/models/PasswordResetToken'
import { User } from '@/models/User'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
export class AuthController {
    public async resetPassword(res: Response, req: Request) {
        try {
            const { password } = req.body
            const token = req.params.token
            const resetToken = await PasswordResetToken.findOne({
                where: {
                    token,
                },
            })
            if (!resetToken || resetToken.expiryDate < new Date()) {
                return res.status(400).send('Invalid or expired token')
            }
            const userId = resetToken.userId
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10)

            // Update user's password and registration status
            await User.update(
                { password: hashedPassword, isRegistered: true },
                { where: { id: Number(userId) } },
            )

            // Delete the used token
            await resetToken.destroy()
            res.json({
                success: true,
                message: 'Password reset successfully',
            })
            return
        } catch (error) {
            if (error instanceof Error) {
                res.json({
                    success: false,
                    message: error.message,
                })
                return
            }
        }
    }
}
