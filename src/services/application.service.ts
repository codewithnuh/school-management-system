import { User } from '@/models/User.js'
import { PasswordResetToken } from '@/models/PasswordResetToken.js'

import nodemailer from 'nodemailer'
import { generateUniqueId } from '@/utils/uniqueIdGenerator.js'
import { Teacher } from '@/models/Teacher.js'

import process from 'process'
type EntityType = 'TEACHER' | 'STUDENT' | 'PARENT' | 'ADMIN' | 'USER'
// Email configuration
export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: true,
    },
    pool: true, // use pooled connections
    maxConnections: 5, // limit concurrent connections
    maxMessages: 100, // limit messages per connection
    connectionTimeout: 3000, // 3 seconds
    greetingTimeout: 3000,
    socketTimeout: 3000,
})

// Email template function with improved styling
type ApplicationStatus = 'Accepted' | 'Rejected' | 'Interview' | 'Sent'

type UserType = 'student' | 'teacher'

interface EmailContent {
    title: string
    content: string
}

const getEmailContent = (
    status: ApplicationStatus,
    userType: UserType,
    resetLink?: string,
): EmailContent => {
    const contents: Record<ApplicationStatus, EmailContent> = {
        Accepted: {
            title: 'Welcome to School Management System',
            content: `
                <div style="background-color: #f0f8ff; border-left: 4px solid #007bff; padding: 15px; margin-bottom: 20px;">
                    <p style="margin: 0; font-weight: bold;">Congratulations! Your ${userType} account has been created successfully.</p>
                </div>
                <p style="margin-bottom: 15px;">To complete your registration, please set up your password using the secure link below:</p> 
                <div style="text-align: center; margin: 25px 0;">
                    <a href="${resetLink}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s ease;">
                        Set Password
                    </a>
                </div>
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 20px;">
                    <p style="margin: 0;"><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
                </div>
                <p style="margin-top: 20px; font-style: italic; color: #666;">If you didn't request this account creation, please ignore this email or contact our support team.</p>`,
        },
        Rejected: {
            title: 'Account Application Status',
            content: `
                <div style="background-color: #fff5f5; border-left: 4px solid #dc3545; padding: 15px; margin-bottom: 20px;">
                    <p style="margin: 0; font-weight: bold;">We regret to inform you that your ${userType} account application has not been approved at this time.</p>
                </div>
                <p style="margin-bottom: 15px;">We appreciate your interest in joining our school management system. While we're unable to approve your application at this moment, we encourage you to:</p>
                <ul style="margin-bottom: 20px; padding-left: 20px;">
                    <li>Review our application criteria</li>
                    <li>Consider reapplying after gaining more experience or qualifications</li>
                    <li>Reach out to our support team for more detailed feedback</li>
                </ul>
                <div style="background-color: #e9ecef; border-left: 4px solid #6c757d; padding: 15px;">
                    <p style="margin: 0;">If you believe this decision was made in error or would like more information, please don't hesitate to contact our support team.</p>
                </div>`,
        },
        Interview: {
            title: 'Interview Invitation',
            content: `
                <div style="background-color: #f0fff0; border-left: 4px solid #28a745; padding: 15px; margin-bottom: 20px;">
                    <p style="margin: 0; font-weight: bold;">Congratulations! Your ${userType} application has been shortlisted for an interview.</p>
                </div>
                <p style="margin-bottom: 15px;">We're excited to move forward with your application. Here's what you need to know:</p>
                <ul style="margin-bottom: 20px; padding-left: 20px;">
                    <li>Our HR team will contact you shortly with the interview details and schedule.</li>
                    <li>The interview may be conducted in person or via video conference.</li>
                    <li>Please ensure your contact information is up to date in your application profile.</li>
                </ul>
                <div style="background-color: #e9ecef; border-left: 4px solid #17a2b8; padding: 15px;">
                    <p style="margin: 0;"><strong>Tip:</strong> Review your application and prepare any relevant documents or portfolios that showcase your skills and experience.</p>
                </div>
                <p style="margin-top: 20px; font-style: italic; color: #666;">We look forward to meeting you and learning more about your qualifications!</p>`,
        },
        Sent: {
            title: 'Application Sent',
            content: `
                <div style="background-color: #f0fff0; border-left: 4px solid #28a745; padding: 15px; margin-bottom: 20px;">
                    <p style="margin: 0; font-weight: bold;">Congratulations! Your ${userType} application has been sent.</p>
                </div>
                <p style="margin-bottom: 15px;">You will be Informed you about your application in few days:</p>
                <ul style="margin-bottom: 20px; padding-left: 20px;">
                    <li>Our HR team will review your application and give updates about the application to you.</li>
                </ul>
                <p style="margin-top: 20px; font-style: italic; color: #666;">We look forward to review you application.</p>`,
        },
    }

    return contents[status]
}

const createEmailTemplate = (
    userName: string,
    status: ApplicationStatus,
    userType: UserType,
    resetLink?: string,
) => {
    const { title, content } = getEmailContent(status, userType, resetLink)

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f6f9fc;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #003366;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
            background-color: #ffffff;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            font-size: 14px;
            color: #666666;
            border-top: 1px solid #e9ecef;
        }
        .sub-footer {
            background-color: #003366;
            color: #ffffff;
            padding: 15px 30px;
            font-size: 12px;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #0056b3;
        }
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100%;
                margin: 0;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h2>${title}</h2>
        </div>
        <div class="content">
            <p style="margin-bottom: 15px;">Dear ${userName},</p>
            ${content}
        </div>
        <div class="footer">
            <p style="margin-bottom: 10px;">Best regards,<br>School Management Team</p>
        </div>
        <div class="sub-footer">
            <p style="margin-bottom: 5px;">This is an automated message, please do not reply to this email.</p>
            <p style="margin-bottom: 5px;">
                To unsubscribe from these notifications, 
                <a href="mailto:${process.env.EMAIL_USER}?subject=unsubscribe" style="color: #ffffff; text-decoration: underline;">click here</a>
            </p>
        </div>
    </div>
</body>
</html>`
}
export async function acceptStudentApplication(userId: number): Promise<void> {
    // Validate environment variables
    const requiredEnvVars = [
        'EMAIL_HOST',
        'EMAIL_USER',
        'EMAIL_APP_PASSWORD',
        'FRONTEND_URL',
    ]
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`${envVar} environment variable is not set`)
        }
    }

    const user = await User.findByPk(userId)
    if (!user) {
        throw new Error('User not found')
    }

    if (user.isRegistered) {
        throw new Error('User already registered')
    }

    // Generate a unique token

    // Store the token in the database
    const passwordReset = await PasswordResetToken.createToken({
        entityId: userId,
        entityType: 'USER',
    })
    const token = passwordReset.token
    // Create setup link
    const setupLink = `${process.env.FRONTEND_URL}/set-password?token=${token}`

    // Prepare email options with improved headers
    const mailOptions = {
        from: {
            name: process.env.EMAIL_SENDER_NAME || 'School Management System',
            address: process.env.EMAIL_USER || '',
        },
        to: user.email,
        subject: 'Welcome to School Management System - Account Setup',
        html: createEmailTemplate(
            user.firstName || 'Student',
            'Accepted',
            'student',
            setupLink,
        ),
        headers: {
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
            Precedence: 'bulk',
            'X-Auto-Response-Suppress': 'OOF, AutoReply',
            'X-Priority': '3',
            Importance: 'normal',
            'X-Mailer': 'School Management System',
        },
        priority: 'normal' as const,
    }

    // Verify connection before sending
    await transporter.verify()

    // Send email
    const info: nodemailer.SentMessageInfo =
        await transporter.sendMail(mailOptions)
    console.log('Message sent: %s', info.messageId)
    // WIP - check before updating that weather this is being done by administration
    // Update user status
    const id = generateUniqueId()
    await user.update({ isRegistered: true, studentId: String(id) })
}
export async function rejectStudentApplication(userId: number): Promise<void> {
    // Validate environment variables
    const requiredEnvVars = [
        'EMAIL_HOST',
        'EMAIL_USER',
        'EMAIL_APP_PASSWORD',
        'FRONTEND_URL',
    ]
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`${envVar} environment variable is not set`)
        }
    }

    const user = await User.findByPk(userId)
    if (!user) {
        throw new Error('User not found')
    }

    if (user.isRegistered) {
        throw new Error('User already registered')
    }

    // Prepare email options with improved headers
    const mailOptions = {
        from: {
            name: process.env.EMAIL_SENDER_NAME || 'School Management System',
            address: process.env.EMAIL_USER || '',
        },
        to: user.email,
        subject: 'Welcome to School Management System - Account Setup',
        html: createEmailTemplate(
            user.firstName || 'Student',
            'Rejected',
            'student',
        ),
        headers: {
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
            Precedence: 'bulk',
            'X-Auto-Response-Suppress': 'OOF, AutoReply',
            'X-Priority': '3',
            Importance: 'normal',
            'X-Mailer': 'School Management System',
        },
        priority: 'normal' as const,
    }

    // Verify connection before sending
    await transporter.verify()

    // Send email
    const info: nodemailer.SentMessageInfo =
        await transporter.sendMail(mailOptions)
    if (info) {
        await User.destroy({
            where: {
                id: user.id,
            },
        })
    }
}

interface EmailConfig {
    subject: string
    template: (name: string, link?: string) => string
}

const STATUS_EMAIL_CONFIG: Record<ApplicationStatus, EmailConfig> = {
    Accepted: {
        subject: 'Welcome to School Management System - Account Setup',
        template: (name: string, link?: string) =>
            createEmailTemplate(name, 'Accepted', 'teacher', link),
    },
    Rejected: {
        subject: 'School Management System - Application Status Update',
        template: (name: string) =>
            createEmailTemplate(name, 'Rejected', 'teacher'),
    },
    Interview: {
        subject: 'School Management System - Interview Invitation',
        template: (name: string) =>
            createEmailTemplate(name, 'Interview', 'teacher'), // You might want to create a separate template for interview
    },
    Sent: {
        subject: 'School Management System - Application Sent',
        template: (name: string) =>
            createEmailTemplate(name, 'Sent', 'teacher'),
    },
}

export async function processTeacherApplication(
    teacherId: number,
    status: ApplicationStatus,
): Promise<void> {
    // Validate environment variables
    const requiredEnvVars = [
        'EMAIL_HOST',
        'EMAIL_USER',
        'EMAIL_APP_PASSWORD',
        'FRONTEND_URL',
    ]

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`${envVar} environment variable is not set`)
        }
    }

    const teacher = await Teacher.findByPk(teacherId)
    if (!teacher) {
        throw new Error('Teacher not found')
    }

    if (teacher.isVerified && status === 'Accepted') {
        throw new Error('Teacher already registered')
    }

    let setupLink: string | undefined

    // Only generate token and setup link for accepted applications
    if (status === 'Accepted') {
        // Generate a unique token

        // Store the token in the database
        const passwordReset = await PasswordResetToken.createToken({
            entityId: teacherId,
            entityType: 'TEACHER',
        })
        const token = passwordReset.token
        // Create setup link
        setupLink = `${process.env.FRONTEND_URL}/set-password?token=${token}`
    }
    if (status === 'Rejected') {
        await teacher.destroy()
    }
    // Prepare email options
    const mailOptions = {
        from: {
            name: process.env.EMAIL_SENDER_NAME || 'School Management System',
            address: process.env.EMAIL_USER || '',
        },
        to: teacher.email,
        subject: STATUS_EMAIL_CONFIG[status].subject,
        html: STATUS_EMAIL_CONFIG[status].template(
            teacher.firstName || 'Teacher',
            setupLink,
        ),
        headers: {
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
            Precedence: 'bulk',
            'X-Auto-Response-Suppress': 'OOF, AutoReply',
            'X-Priority': '3',
            Importance: 'normal',
            'X-Mailer': 'School Management System',
        },
        priority: 'normal' as const,
    }

    // Verify connection before sending
    await transporter.verify()

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log('Message sent: %s', info.messageId)

    // Update user status
    await teacher.update({
        applicationStatus: status,
        isVerified: status === 'Accepted' ? true : false,
    })
}

// Password Reset Service
export class PasswordResetService {
    static async generateResetToken(
        email: string,
        entityType: EntityType,
    ): Promise<string> {
        let entity

        if (entityType === 'USER') {
            entity = await User.findOne({ where: { email } })
        } else {
            entity = await Teacher.findOne({ where: { email } })
        }

        if (!entity) {
            throw new Error(`${entityType.toLowerCase()} not found`)
        }

        const resetToken = await PasswordResetToken.createToken({
            entityId: entity.id,
            entityType,
        })
        return resetToken.token
    }

    static async resetPassword(
        token: string,
        newPassword: string,
    ): Promise<boolean> {
        const resetToken = await PasswordResetToken.findValidToken(token)

        if (!resetToken || resetToken.isUsed) {
            throw new Error('Invalid or expired token')
        }

        let entity
        if (resetToken.entityType === 'USER') {
            entity = await User.findByPk(resetToken.entityId)
        } else {
            entity = await Teacher.findByPk(resetToken.entityId)
        }

        if (!entity) {
            throw new Error(`${resetToken.entityType.toLowerCase()} not found`)
        }

        // Update password
        entity.password = newPassword // Assuming you have password hashing middleware
        await entity.save()

        // Mark token as used
        await resetToken.markAsUsed()

        return true
    }

    static async verifyToken(token: string): Promise<boolean> {
        const resetToken = await PasswordResetToken.findValidToken(token)
        return !!resetToken && !!resetToken.isUsed
    }
}
