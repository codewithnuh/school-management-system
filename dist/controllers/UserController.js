import { User } from '@/models/User';
import { userSchema } from '@/schema/user.schema';
import { PasswordResetToken } from '@/models/PasswordResetToken';
import bcrypt from 'bcrypt';
import { createJWT } from '@/utils/jwt';
import { Session } from '@/models/Session';
import { acceptStudentApplication } from '@/services/application.service';
import { ResponseUtil } from '@/utils/response.util';
import { forgotPasswordService } from '@/services/forgot-password.service';
class UserController {
    constructor() {
        this.createUser = async (req, res) => {
            try {
                const userData = req.body;
                const validatedUserData = userSchema.parse(userData);
                // Create user in a transaction
                const user = await User.sequelize?.transaction(async (t) => {
                    return await User.create(validatedUserData, { transaction: t });
                });
                const response = ResponseUtil.success(user, 'User created successfully', 201);
                res.status(response.statusCode).json(response);
            }
            catch (error) {
                this.handleError(res, error);
            }
        };
        this.getAllUsers = async (req, res) => {
            try {
                const allUsers = await User.findAll({
                    where: { isRegistered: true },
                    attributes: { exclude: ['password'] }, // Don't send password in response
                });
                if (!allUsers.length) {
                    res.status(404).json({
                        success: false,
                        message: 'No users found',
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: allUsers,
                    message: 'Users retrieved successfully',
                });
            }
            catch (error) {
                this.handleError(res, error);
            }
        };
        this.deleteUser = async (req, res) => {
            try {
                const { userId } = req.params;
                if (!userId) {
                    res.status(400).json({
                        success: false,
                        message: 'User ID is required',
                    });
                    return;
                }
                const deletedUser = await User.destroy({
                    where: { id: userId },
                });
                if (!deletedUser) {
                    res.status(404).json({
                        success: false,
                        message: 'User not found',
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'User deleted successfully',
                });
            }
            catch (error) {
                this.handleError(res, error);
            }
        };
        this.resetUserPassword = async (req, res) => {
            try {
                const token = req.query.token;
                if (!token) {
                    res.status(400).json({
                        success: false,
                        message: 'Reset token is required',
                    });
                    return;
                }
                const { newPassword } = req.body;
                if (!newPassword) {
                    res.status(400).json({
                        success: false,
                        message: 'New password is required',
                    });
                    return;
                }
                const passwordResetToken = await PasswordResetToken.findOne({
                    where: { token: !token }, // Fixed the condition here
                });
                if (!passwordResetToken) {
                    res.status(404).json({
                        success: false,
                        message: 'Invalid or expired reset token',
                    });
                    return;
                }
                // Check if token is expired
                if (new Date() > passwordResetToken.expiresDate) {
                    await passwordResetToken.destroy();
                    const response = ResponseUtil.error('Reset token has expired', 400);
                    res.status(response.statusCode).json(response);
                    return;
                }
                const user = await User.findByPk(passwordResetToken.entityId);
                if (!user) {
                    const response = ResponseUtil.error('User not found', 404);
                    res.status(response.statusCode).json(response);
                    return;
                }
                const hashedPassword = await bcrypt.hash(newPassword, UserController.SALT_ROUNDS);
                await user.update({
                    password: hashedPassword,
                    isRegistered: true,
                });
                // Delete the used token
                await passwordResetToken.destroy();
                res.status(200).json({
                    success: true,
                    message: 'Password reset successful',
                });
            }
            catch (error) {
                this.handleError(res, error);
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    const response = ResponseUtil.error('Email and password are required', 400);
                    res.status(response.statusCode).json(response);
                    return;
                }
                const user = await User.findOne({
                    where: { email },
                });
                if (!user) {
                    const response = ResponseUtil.error('Invalid credentials', 401);
                    res.status(response.statusCode).json(response);
                    return;
                }
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    res.status(401).json({
                        success: false,
                        message: 'Invalid credentials',
                    });
                    return;
                }
                // Clear any existing sessions
                await Session.destroy({
                    where: { userId: user.id },
                });
                const jwtToken = await createJWT({ userId: user.id });
                // Create new session
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + UserController.SESSION_EXPIRY_HOURS);
                const session = await Session.create({
                    userId: user.id,
                    sessionId: jwtToken,
                    expiresAt,
                });
                res.cookie('sessionId', session.sessionId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: UserController.SESSION_EXPIRY_HOURS * 60 * 60 * 1000,
                    sameSite: 'strict',
                });
                const response = ResponseUtil.success({
                    id: user.id,
                    email: user.email,
                    name: user.firstName,
                }, 'Login successful');
                res.status(response.statusCode).json(response);
            }
            catch (error) {
                this.handleError(res, error);
            }
        };
        this.acceptUserApplication = async (req, res) => {
            const userId = req.query.id;
            if (userId === undefined || isNaN(Number(userId))) {
                // Handle invalid or missing userId
                res.status(400).json({ error: 'Invalid or missing user ID' });
                return;
            }
            const numericUserId = Number(userId);
            try {
                await acceptStudentApplication(numericUserId);
                res.status(200).json({
                    success: true,
                    message: 'User registered successfully',
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({
                        success: false,
                        message: error.message,
                        stack: error.message,
                    });
                }
            }
        };
        this.forgotPassword = async (req, res) => {
            const { email } = req.body;
            if (!email) {
                const response = ResponseUtil.error('Entity Id missing', 400, 'Please provide entity id');
                res.status(400).json(response);
                return;
            }
            const isUserExists = await User.findOne({
                where: {
                    email,
                },
            });
            if (!isUserExists) {
                const response = ResponseUtil.error('User not found', 404, 'You are not registered');
                res.status(404).json(response);
                return;
            }
            try {
                await forgotPasswordService({
                    email,
                    entityType: 'STUDENT',
                });
                const response = ResponseUtil.success('', 'OTP has been sent to your mail', 200);
                res.status(201).json(response);
            }
            catch (error) { }
        };
        this.logout = async (req, res) => {
            try {
                const sessionId = req.cookies.sessionId;
                if (!sessionId) {
                    res.status(400).json({
                        success: false,
                        message: 'No active session',
                    });
                    return;
                }
                await Session.destroy({
                    where: { sessionId },
                });
                res.clearCookie('sessionId');
                res.status(200).json({
                    success: true,
                    message: 'Logout successful',
                });
            }
            catch (error) {
                this.handleError(res, error);
            }
        };
        this.handleError = (res, error) => {
            if (error instanceof Error) {
                const statusCode = this.getErrorStatusCode(error);
                const response = ResponseUtil.error(error.message, statusCode);
                res.status(response.statusCode).json(response);
            }
            else {
                const response = ResponseUtil.error('An unexpected error occurred', 500);
                res.status(response.statusCode).json(response);
            }
        };
        this.getErrorStatusCode = (error) => {
            switch (error.name) {
                case 'ValidationError':
                    return 400;
                case 'UnauthorizedError':
                    return 401;
                case 'ForbiddenError':
                    return 403;
                case 'NotFoundError':
                    return 404;
                default:
                    return 500;
            }
        };
    }
}
UserController.SALT_ROUNDS = 10;
UserController.SESSION_EXPIRY_HOURS = 1;
export default new UserController();
