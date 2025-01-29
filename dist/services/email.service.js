import nodemailer from 'nodemailer';
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
const emailHTML = ({ entityType, name, OTP, }) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forgot Password</title>
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
            <h2>Forgot Password</h2>
            </div>
            <div class="content">
                <p style="margin-bottom: 15px;">Dear ${name},</p>
               <p>Here is your OTP that you have requested ${OTP}
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
    </html>`;
};
export const sendOtp = async ({ entityEmail, entityFirstName, entityType, OTP, }) => {
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
        priority: 'normal',
    };
    // Verify connection before sending
    await transporter.verify();
    // Send email
    const info = await transporter.sendMail(mailOptions);
};
