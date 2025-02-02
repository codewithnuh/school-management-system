import nodemailer from 'nodemailer'

// Function to check for missing environment variables
const checkEnvVariables = () => {
    const requiredEnvVars = [
        'EMAIL_HOST',
        'EMAIL_PORT',
        'EMAIL_USER',
        'EMAIL_APP_PASSWORD',
        'EMAIL_SENDER_NAME',
    ]

    requiredEnvVars.forEach(envVar => {
        if (!process.env[envVar]) {
            console.error(`Error: Missing environment variable ${envVar}`)
        }
    })
}

// Call the function to check for missing environment variables
checkEnvVariables()

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

const emailHTML = ({
    name,
    OTP,
}: {
    entityType: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN'
    name: string
    OTP: string
}) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - School Management System</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f7f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header img {
            max-width: 150px;
            height: auto;
        }
        .header h2 {
            color: #003366;
            margin: 20px 0 0;
            font-size: 24px;
        }
        .content {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .otp {
            font-size: 32px;
            font-weight: bold;
            color: #003366;
            text-align: center;
            margin: 20px 0;
            letter-spacing: 5px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #003366;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #004080;
        }
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                padding: 20px !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png" alt="School Logo" />
            <h2>Password Reset</h2>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>You have requested to reset your password for the School Management System. Please use the following One-Time Password (OTP) to complete the process:</p>
            <div class="otp">${OTP}</div>
            <p>This OTP will expire in 15 minutes. If you did not request a password reset, please ignore this email or contact the IT support team immediately.</p>
        </div>
        <div class="footer">
            <p>If you're having trouble, please contact our support team:</p>
            <p><a href="mailto:support@schoolmanagementsystem.com" class="button">Contact Support</a></p>
            <p style="margin-top: 20px;">Best regards,<br>School Management System Team</p>
        </div>
        <div style="font-size: 12px; color: #999; margin-top: 20px; text-align: center;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>To unsubscribe from these notifications, <a href="mailto:${process.env.EMAIL_USER}?subject=unsubscribe" style="color: #003366;">click here</a></p>
        </div>
    </div>
</body>
</html>`
}

export const sendOtp = async ({
    entityEmail,
    entityFirstName,
    entityType,
    OTP,
}: {
    entityEmail: string
    entityFirstName: string
    entityType: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN'
    OTP: string
}) => {
    const mailOptions = {
        from: {
            name: process.env.EMAIL_SENDER_NAME || 'School Management System',
            address: process.env.EMAIL_USER || '',
        },
        to: entityEmail,
        subject: 'Welcome to School Management System - Account Setup',
        html: emailHTML({ entityType, name: entityFirstName, OTP }),
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
    await transporter.sendMail(mailOptions)
}
