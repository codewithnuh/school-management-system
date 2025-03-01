import { Admin, Parent, Session, Teacher, User } from '@/models/index.js'
import jwt, { SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Op } from 'sequelize'
import process from 'process'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h'
const SESSION_EXPIRY_HOURS = parseInt(
    process.env.SESSION_EXPIRY_HOURS || '24',
    10,
)

// Define EntityType enum for better type safety and readability
export enum EntityType {
    ADMIN = 'ADMIN',
    TEACHER = 'TEACHER',
    USER = 'USER',
    PARENT = 'PARENT',
}

/**
 * Interface representing the payload for the current user in the JWT.
 */
interface CurrentUserPayload {
    userId: number
    entityType: EntityType
}

/**
 * Interface defining the structure of a User model instance required by AuthService.login.
 */
interface UserModelInstance {
    id: number
    email: string
    password?: string
}

/**
 * Interface defining the structure of a User model constructor.
 */
interface UserModelConstructor<T extends UserModelInstance> {
    findOne(options: { where: { email: string } }): Promise<T | null>
}

/**
 * Interface for the login response.
 */
interface LoginResponse {
    success: boolean
    token: string
    message: string
}

/**
 * AuthService class responsible for handling user authentication and session management.
 */
class AuthService {
    /**
     * Authenticates a user and creates a session.
     *
     * Before creating a new session, this method checks if an active session already exists.
     * If found, it returns the existing session's token along with a message indicating that.
     *
     * @param email - The user's email.
     * @param passwordPlain - The user's plain text password.
     * @param entityType - The type of user entity (using EntityType enum).
     * @param userModel - The Sequelize model constructor (e.g., User, Admin, Teacher, Parent) for finding the user.
     * @param userAgent - Optional user agent string for session tracking.
     * @param ipAddress - Optional IP address for session tracking.
     * @returns An object containing the authentication token and a message.
     * @throws Error if credentials are invalid or JWT_SECRET is not defined.
     *
     * @example
     * const authService = new AuthService();
     * try {
     *  const response = await authService.login('test@test.com', 'password', EntityType.USER, User);
     *  console.log('Response:', response);
     * } catch (error) {
     *  console.error('Login failed:', error.message);
     * }
     */
    async login<T extends UserModelInstance>(
        email: string,
        passwordPlain: string,
        entityType: EntityType,
        userModel: UserModelConstructor<T>,
        userAgent?: string,
        ipAddress?: string,
    ): Promise<LoginResponse> {
        const user = await userModel.findOne({ where: { email } })

        if (!user) {
            throw new Error('Invalid credentials')
        }

        const passwordMatch = await bcrypt.compare(
            passwordPlain,
            user.password!,
        )
        if (!passwordMatch) {
            throw new Error('Invalid credentials')
        }

        // Check if an active session already exists for the user with the same entityType
        const activeSession = await Session.findOne({
            where: {
                userId: user.id,
                entityType: entityType,
                expiryDate: { [Op.gt]: new Date() },
            },
        })

        if (activeSession) {
            // Return existing session token if active session is found
            return {
                success: false,
                token: activeSession.token,
                message: 'Session already exists',
            }
        }

        const payload: CurrentUserPayload = {
            userId: user.id,
            entityType: entityType,
        }

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined')
        }

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRY,
        } as SignOptions)

        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + SESSION_EXPIRY_HOURS)

        await Session.create({
            userId: user.id,
            entityType: entityType,
            token: token,
            expiryDate: expiryDate,
            userAgent: userAgent,
            ipAddress: ipAddress,
        })

        return { token, message: 'Login successful', success: true }
    }

    /**
     * Logs out a user by destroying the session associated with the given token.
     *
     * @param token - The authentication token.
     * @returns Promise that resolves when the session is destroyed.
     *
     * @example
     * const authService = new AuthService();
     * await authService.logout('user-token');
     */
    async logout(token: string): Promise<void> {
        await Session.destroy({ where: { token } })
    }

    /**
     * Retrieves the current user information based on the provided token.
     *
     * @param token - The authentication token.
     * @returns The current user payload or null if the token is invalid or expired.
     *
     * @example
     * const authService = new AuthService();
     * const currentUser = await authService.getCurrentUser('user-token');
     * if (currentUser) {
     *  console.log('Current user:', currentUser);
     * }
     */
    async getCurrentUser(token: string): Promise<CurrentUserPayload | null> {
        try {
            const session = await Session.findOne({ where: { token } })
            if (!session || session.expiryDate < new Date()) {
                return null
            }
            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined')
            }
            jwt.verify(token, JWT_SECRET)
            const decoded = jwt.decode(token) as CurrentUserPayload
            return decoded
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return null
        }
    }

    /**
     * Gets the entity type of a user.
     *
     * @param userId - The ID of the user.
     * @param entityType - The type of the entity (using EntityType enum).
     * @returns The entity type.
     */
    async getUserEntityType(
        userId: number,
        entityType: EntityType,
    ): Promise<EntityType> {
        return entityType
    }

    /**
     * Retrieves the user ID from the provided token.
     *
     * @param token - The authentication token.
     * @returns The user ID or null if the token is invalid or expired.
     *
     * @example
     * const authService = new AuthService();
     * const userId = await authService.getUserId('user-token');
     * if (userId) {
     *  console.log('User ID:', userId);
     * }
     */
    async getUserId(token: string): Promise<number | null> {
        const currentUser = await this.getCurrentUser(token)
        return currentUser ? currentUser.userId : null
    }

    /**
     * Fetches the user entity (User, Admin, Teacher, Parent) based on the user ID and entity type.
     *
     * @param userId - The ID of the user.
     * @param entityType - The type of user entity (using EntityType enum).
     * @returns The user entity or null if not found.
     */
    async fetchUserEntity(
        userId: number,
        entityType: EntityType,
    ): Promise<unknown | null> {
        switch (entityType) {
            case EntityType.USER:
                return User.findByPk(userId)
            case EntityType.ADMIN:
                return Admin.findByPk(userId)
            case EntityType.TEACHER:
                return Teacher.findByPk(userId)
            case EntityType.PARENT:
                return Parent.findByPk(userId)
            default:
                return null
        }
    }
    /**
     * Verifies session validity and returns user data with role
     * @param token - JWT token from cookie
     * @returns Session status, user data, and role
     */
    async verifySession(token: string): Promise<{
        isValid: boolean
        user: unknown | null
        role: EntityType | null
    }> {
        try {
            // 1. Check if session exists in database and is not expired
            const session = await Session.findOne({
                where: {
                    token,
                    expiryDate: { [Op.gt]: new Date() },
                },
            })

            if (!session) {
                return { isValid: false, user: null, role: null }
            }

            // 2. Verify JWT token
            const decoded = jwt.verify(token, JWT_SECRET!) as CurrentUserPayload

            // 3. Fetch user entity based on role
            const user = await this.fetchUserEntity(
                decoded.userId,
                decoded.entityType,
            )

            return {
                isValid: true,
                user,
                role: decoded.entityType,
            }
        } catch {
            // Handle JWT verification errors or database errors
            return { isValid: false, user: null, role: null }
        }
    }
}

export const authService = new AuthService()
