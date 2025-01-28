import { Request, Response } from 'express'
import { ForgotPasswordService } from '@/services/forgot-password.service'
import { ResponseUtil } from '@/utils/response.util'
import { EntityType } from '@/models/PasswordResetToken'

export class ForgotPasswordController {
    static async initiatePasswordReset(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { email, entityType } = req.body

            await ForgotPasswordService.initiatePasswordReset(
                email,
                entityType as EntityType,
            )

            const response = ResponseUtil.success({
                message: 'Password reset email sent successfully',
            })

            res.json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message)
                res.status(400).json(response)
            } else {
                const response = ResponseUtil.error(
                    'An unexpected error occurred',
                )
                res.status(500).json(response)
            }
        }
    }

    static async verifyResetToken(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.params

            const resetToken = await ForgotPasswordService.verifyToken(token)

            const response = ResponseUtil.success({
                message: 'Token is valid',
                data: { token: resetToken },
            })

            res.json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message)
                res.status(400).json(response)
            } else {
                const response = ResponseUtil.error(
                    'An unexpected error occurred',
                )
                res.status(500).json(response)
            }
        }
    }

    static async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, newPassword } = req.body

            await ForgotPasswordService.resetPassword(token, newPassword)

            const response = ResponseUtil.success({
                message: 'Password reset successful',
            })

            res.json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message)
                res.status(400).json(response)
            } else {
                const response = ResponseUtil.error(
                    'An unexpected error occurred',
                )
                res.status(500).json(response)
            }
        }
    }

    static async cleanupExpiredTokens(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const count = await ForgotPasswordService.cleanupExpiredTokens()

            const response = ResponseUtil.success({
                message: 'Expired tokens cleaned up successfully',
                data: { deletedCount: count },
            })

            res.json(response)
        } catch (error) {
            if (error instanceof Error) {
                const response = ResponseUtil.error(error.message)
                res.status(500).json(response)
            } else {
                const response = ResponseUtil.error(
                    'An unexpected error occurred',
                )
                res.status(500).json(response)
            }
        }
    }
}
