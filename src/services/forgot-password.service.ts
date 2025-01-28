import { PasswordResetToken, EntityType } from '@/models/PasswordResetToken'
import { User } from '@/models/User'
import { Teacher } from '@/models/Teacher'
import { ResponseUtil } from '@/utils/response.util'
import { sendEmail } from './application.service'
import { ApiResponse } from '@/types/api-response'

export class ForgotPasswordService {
    static async initiatePasswordReset(
        email: string,
        entityType: EntityType
    ): Promise<void> {
        try {
            let entity = null;
            
            switch (entityType) {
                case 'USER':
                    entity = await User.findOne({ where: { email } });
                    break;
                case 'TEACHER':
                    entity = await Teacher.findOne({ where: { email } });
                    break;
            }

            if (!entity) {
                throw new Error('User not found');
            }

            const resetToken = await PasswordResetToken.createToken({
                entityId: entity.id,
                entityType,
                ...(entityType === 'USER' ? { userId: entity.id } : { teacherId: entity.id }),
            });

            const emailContent = {
                subject: 'Password Reset Request',
                body: `
                    <h1>Password Reset Request</h1>
                    <p>You have requested to reset your password. Please use the following link to reset your password:</p>
                    <p><a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken.token}">Reset Password</a></p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you did not request this password reset, please ignore this email.</p>
                `,
            };

            await sendEmail({
                to: email,
                subject: emailContent.subject,
                html: emailContent.body,
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to initiate password reset: ${error.message}`);
            }
            throw error;
        }
    }

    static async verifyToken(
        token: string,
    ): Promise<PasswordResetToken> {
        try {
            const resetToken = await PasswordResetToken.findValidToken(token);

            if (!resetToken) {
                throw new Error('Invalid or expired reset token');
            }

            return resetToken;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Token verification failed: ${error.message}`);
            }
            throw error;
        }
    }

    static async resetPassword(
        token: string,
        newPassword: string,
    ): Promise<void> {
        try {
            const resetToken = await this.verifyToken(token);
            
            let entity = null;
            
            switch (resetToken.entityType) {
                case 'USER':
                    entity = await User.findByPk(resetToken.entityId);
                    break;
                case 'TEACHER':
                    entity = await Teacher.findByPk(resetToken.entityId);
                    break;
            }

            if (!entity) {
                throw new Error('User not found');
            }

            await entity.update({ password: newPassword });
            await resetToken.markAsUsed();
            
            // Send confirmation email
            const emailContent = {
                subject: 'Password Reset Successful',
                body: `
                    <h1>Password Reset Successful</h1>
                    <p>Your password has been successfully reset.</p>
                    <p>If you did not perform this action, please contact support immediately.</p>
                `,
            };

            await sendEmail({
                to: entity.email,
                subject: emailContent.subject,
                html: emailContent.body,
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Password reset failed: ${error.message}`);
            }
            throw error;
        }
    }

    static async cleanupExpiredTokens(): Promise<number> {
        return await PasswordResetToken.cleanupExpiredTokens();
    }
}