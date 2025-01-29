import { User } from '@/models/User';
import { PasswordResetToken } from '@/models/PasswordResetToken';
import nodemailer from 'nodemailer';
import { generateUniqueId } from '@/utils/uniqueIdGenerator';
import { Teacher } from '@/models/Teacher';
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
});
const getEmailContent = (status, userType, resetLink) => {
    const contents = {
        Accepted: {
            title: 'Welcome to School Management System',
            content: `
                <p style="margin-bottom: 15px;">Your ${userType} account has been created successfully. To complete your registration, please set up your password using the secure link below:</p> 
                <div style="text-align: center; margin: 25px 0;">
                    <a href="${resetLink}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color: 0.3s ease;">
                        Set Password
                    </a>
                </div>
                <p style="margin-bottom: 15px;">This link will expire in 1 hour for security reasons.</p>
                <p style="margin-bottom: 15px;">If you didn't request this account creation, please ignore this email or contact our support team.</p>`,
        },
        Rejected: {
            title: 'Account Application Status',
            content: `
                <p style="margin-bottom: 15px;">We regret to inform you that your ${userType} account application has not been approved at this time.</p>
                <p style="margin-bottom: 15px;">If you believe this decision was made in error or would like more information, please contact our support team.</p>`,
        },
        Interview: {
            title: 'Interview Invitation',
            content: `
                <p style="margin-bottom: 15px;">We are pleased to inform you that your ${userType} application has been shortlisted for an interview.</p>
                <p style="margin-bottom: 15px;">Our HR team will contact you shortly with the interview details and schedule.</p>
                <p style="margin-bottom: 15px;">Please ensure your contact information is up to date.</p>`,
        },
    };
    return contents[status];
};
const createEmailTemplate = (userName, status, userType, resetLink) => {
    const { title, content } = getEmailContent(status, userType, resetLink);
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header h2 {
                color: #2c3e50;
                margin: 0;
            }
            .content {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .footer {
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #eee;
            }
            .sub-footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                transition: background-color 0.3s ease;
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
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
                    <a href="mailto:${process.env.EMAIL_USER}?subject=unsubscribe" style="color: #007bff;">click here</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};
export async function acceptStudentApplication(userId) {
    // Validate environment variables
    const requiredEnvVars = [
        'EMAIL_HOST',
        'EMAIL_USER',
        'EMAIL_APP_PASSWORD',
        'FRONTEND_URL',
    ];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`${envVar} environment variable is not set`);
        }
    }
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if (user.isRegistered) {
        throw new Error('User already registered');
    }
    // Generate a unique token
    // Store the token in the database
    const passwordReset = await PasswordResetToken.createToken({
        entityId: userId,
        entityType: 'USER',
        userId: userId,
    });
    const token = passwordReset.token;
    // Create setup link
    const setupLink = `${process.env.FRONTEND_URL}/set-password?token=${token}`;
    // Prepare email options with improved headers
    const mailOptions = {
        from: {
            name: process.env.EMAIL_SENDER_NAME || 'School Management System',
            address: process.env.EMAIL_USER || '',
        },
        to: user.email,
        subject: 'Welcome to School Management System - Account Setup',
        html: createEmailTemplate(user.firstName || 'Student', 'Accepted', 'student', setupLink),
        headers: {
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
            Precedence: 'bulk',
            'X-Auto-Response-Suppress': 'OOF, AutoReply',
            'X-Priority': '3',
            Importance: 'normal',
            'X-Mailer': 'School Management System',
        },
        priority: 'normal',
    };
    // Verify connection before sending
    await transporter.verify();
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    // Update user status
    const id = generateUniqueId();
    await user.update({ isRegistered: true, studentId: String(id) });
}
export async function rejectStudentApplication(userId) {
    // Validate environment variables
    const requiredEnvVars = [
        'EMAIL_HOST',
        'EMAIL_USER',
        'EMAIL_APP_PASSWORD',
        'FRONTEND_URL',
    ];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`${envVar} environment variable is not set`);
        }
    }
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if (user.isRegistered) {
        throw new Error('User already registered');
    }
    // Prepare email options with improved headers
    const mailOptions = {
        from: {
            name: process.env.EMAIL_SENDER_NAME || 'School Management System',
            address: process.env.EMAIL_USER || '',
        },
        to: user.email,
        subject: 'Welcome to School Management System - Account Setup',
        html: createEmailTemplate(user.firstName || 'Student', 'Rejected', 'student'),
        headers: {
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
            Precedence: 'bulk',
            'X-Auto-Response-Suppress': 'OOF, AutoReply',
            'X-Priority': '3',
            Importance: 'normal',
            'X-Mailer': 'School Management System',
        },
        priority: 'normal',
    };
    // Verify connection before sending
    await transporter.verify();
    // Send email
    const info = await transporter.sendMail(mailOptions);
    if (info) {
        await User.destroy({
            where: {
                id: user.id,
            },
        });
    }
}
const STATUS_EMAIL_CONFIG = {
    Accepted: {
        subject: 'Welcome to School Management System - Account Setup',
        template: (name, link) => createEmailTemplate(name, 'Accepted', 'teacher', link),
    },
    Rejected: {
        subject: 'School Management System - Application Status Update',
        template: (name) => createEmailTemplate(name, 'Rejected', 'teacher'),
    },
    Interview: {
        subject: 'School Management System - Interview Invitation',
        template: (name) => createEmailTemplate(name, 'Interview', 'teacher'), // You might want to create a separate template for interview
    },
};
export async function processTeacherApplication(teacherId, status) {
    // Validate environment variables
    const requiredEnvVars = [
        'EMAIL_HOST',
        'EMAIL_USER',
        'EMAIL_APP_PASSWORD',
        'FRONTEND_URL',
    ];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`${envVar} environment variable is not set`);
        }
    }
    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
        throw new Error('Teacher not found');
    }
    if (teacher.isVerified && status === 'Accepted') {
        throw new Error('Teacher already registered');
    }
    let setupLink;
    // Only generate token and setup link for accepted applications
    if (status === 'Accepted') {
        // Generate a unique token
        // Store the token in the database
        const passwordReset = await PasswordResetToken.createToken({
            entityId: teacherId,
            entityType: 'TEACHER',
            teacherId: teacherId,
        });
        const token = passwordReset.token;
        // Create setup link
        setupLink = `${process.env.FRONTEND_URL}/set-password?token=${token}`;
    }
    if (status === 'Rejected') {
        await teacher.destroy();
    }
    // Prepare email options
    const mailOptions = {
        from: {
            name: process.env.EMAIL_SENDER_NAME || 'School Management System',
            address: process.env.EMAIL_USER || '',
        },
        to: teacher.email,
        subject: STATUS_EMAIL_CONFIG[status].subject,
        html: STATUS_EMAIL_CONFIG[status].template(teacher.firstName || 'Teacher', setupLink),
        headers: {
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
            Precedence: 'bulk',
            'X-Auto-Response-Suppress': 'OOF, AutoReply',
            'X-Priority': '3',
            Importance: 'normal',
            'X-Mailer': 'School Management System',
        },
        priority: 'normal',
    };
    // Verify connection before sending
    await transporter.verify();
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    // Update user status
    await teacher.update({
        applicationStatus: status,
        isVerified: status === 'Accepted' ? true : false,
    });
}
// Password Reset Service
export class PasswordResetService {
    static async generateResetToken(email, entityType) {
        let entity;
        if (entityType === 'USER') {
            entity = await User.findOne({ where: { email } });
        }
        else {
            entity = await Teacher.findOne({ where: { email } });
        }
        if (!entity) {
            throw new Error(`${entityType.toLowerCase()} not found`);
        }
        const resetToken = await PasswordResetToken.createToken({
            entityId: entity.id,
            entityType,
        });
        return resetToken.token;
    }
    static async resetPassword(token, newPassword) {
        const resetToken = await PasswordResetToken.findValidToken(token);
        if (!resetToken || resetToken.isUsed) {
            throw new Error('Invalid or expired token');
        }
        let entity;
        if (resetToken.entityType === 'USER') {
            entity = await User.findByPk(resetToken.entityId);
        }
        else {
            entity = await Teacher.findByPk(resetToken.entityId);
        }
        if (!entity) {
            throw new Error(`${resetToken.entityType.toLowerCase()} not found`);
        }
        // Update password
        entity.password = newPassword; // Assuming you have password hashing middleware
        await entity.save();
        // Mark token as used
        await resetToken.markAsUsed();
        return true;
    }
    static async verifyToken(token) {
        const resetToken = await PasswordResetToken.findValidToken(token);
        return !!resetToken && !!resetToken.isUsed;
    }
}
