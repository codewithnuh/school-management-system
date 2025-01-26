import { v4 as uuidv4 } from 'uuid'
import { User } from '@/models/User'
import { PasswordResetToken } from '@/models/PasswordResetToken'
import nodemailer from 'nodemailer'
import { stack } from 'sequelize/types/utils'

// Email configuration
const transporter = nodemailer.createTransport({
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
})

// Email template function with improved styling
const createEmailTemplate = (userName: string, resetLink: string) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to School Management System</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #2c3e50; margin: 0;">Welcome to School Management System</h2>
            </div>
            <p style="margin-bottom: 15px;">Dear ${userName},</p>
            <p style="margin-bottom: 15px;">Your account has been created successfully. To complete your registration, please set up your password using the secure link below:</p>
            <div style="text-align: center; margin: 25px 0;">
                <a href="${resetLink}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s ease;">
                    Set Password
                </a>
            </div>
            <p style="margin-bottom: 15px;">This link will expire in 1 hour for security reasons.</p>
            <p style="margin-bottom: 15px;">If you didn't request this account creation, please ignore this email or contact our support team.</p>
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee;">
                <p style="margin-bottom: 10px;">Best regards,<br>School Management Team</p>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                <p style="margin-bottom: 5px;">This is an automated message, please do not reply to this email.</p>
                <p style="margin-bottom: 5px;">
                    To unsubscribe from these notifications, 
                    <a href="mailto:${process.env.EMAIL_USER}?subject=unsubscribe" style="color: #007bff;">click here</a>
                </p>
            </div>
        </div>
    </body>
    </html>
`

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
    const token = uuidv4()
    const expiryDate = new Date(Date.now() + 3600000) // 1 hour from now

    // Store the token in the database
    await PasswordResetToken.create({
        token,
        userId: user.id,
        expiryDate,
    })

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
        html: createEmailTemplate(user.firstName || 'Student', setupLink),
        headers: {
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
            Precedence: 'bulk',
            'X-Auto-Response-Suppress': 'OOF, AutoReply',
            'X-Priority': '3',
            Importance: 'normal',
            'X-Mailer': 'School Management System',
        },
        priority: 'normal' as 'normal',
    }

    // Verify connection before sending
    await transporter.verify()

    // Send email
    const info: nodemailer.SentMessageInfo =
        await transporter.sendMail(mailOptions)
    console.log('Message sent: %s', info.messageId)

    // Update user status
    await user.update({ isRegistered: true })
}
