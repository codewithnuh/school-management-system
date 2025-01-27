import { PasswordResetToken } from '@/models/PasswordResetToken'
import { User } from '@/models/User'
import { Request, Response } from 'express'
import { ResponseUtil } from '@/utils/response.util'
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
                const response = ResponseUtil.error('Invalid or expired token', 400)
                return res.status(response.statusCode).json(response)
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
            const response = ResponseUtil.success(null, 'Password reset successfully')
            res.status(response.statusCode).json(response)
            return
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message)
                res.status(response.statusCode).json(response)
                return
            }
        }
    }
}
