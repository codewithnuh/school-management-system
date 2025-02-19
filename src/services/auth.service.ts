import { Admin, Parent, Session, Teacher, User } from '@/models/index.js'
import jwt, { SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

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
    entityType: EntityType // Use the EntityType enum here
}

/**
 * Interface defining the structure of a User model *instance* required by AuthService.login.
 * Ensures type safety when accessing user properties like id, email, and password.
 */
interface UserModelInstance {
    id: number
    email: string
    password?: string // Password is often present but might be optional in some model definitions
}

/**
 * Interface defining the structure of a User model *constructor* (the class itself).
 * It enforces that the model constructor has a static 'findOne' method with a specific signature
 * for finding users by email.
 */
interface UserModelConstructor<T extends UserModelInstance> {
    findOne(options: { where: { email: string } }): Promise<T | null>
}

/**
 * AuthService class responsible for handling user authentication and session management.
 */
class AuthService {
    /**
     * Authenticates a user and creates a session.
     *
     * @param {string} email - The user's email.
     * @param {string} passwordPlain - The user's password in plain text.
     * @param {EntityType} entityType - The type of user entity (using EntityType enum).
     * @param {UserModelConstructor<UserModelInstance>} userModel - The Sequelize model constructor
     *        (e.g., User, Admin, Teacher, Parent) to use for finding the user. It must conform to UserModelConstructor.
     * @param {string} [userAgent] - The user agent string (optional, for session tracking).
     * @param {string} [ipAddress] - The user's IP address (optional, for session tracking).
     * @returns {Promise<{ token: string }>} An object containing the authentication token.
     * @throws {Error} Throws an error if credentials are invalid or JWT_SECRET is not defined.
     *
     * @example
     * const authService = new AuthService();
     * try {
     *  const { token } = await authService.login('test@test.com', 'password', EntityType.USER, User);
     *  console.log('User logged in with token:', token);
     * } catch (error) {
     *  console.error('Login failed:', error.message);
     * }
     */
    async login<T extends UserModelInstance>(
        email: string,
        passwordPlain: string,
        entityType: EntityType,
        userModel: UserModelConstructor<T>, // Using the correctly typed UserModelConstructor
        userAgent?: string,
        ipAddress?: string,
    ): Promise<{ token: string }> {
        const user = await userModel.findOne({ where: { email } })

        if (!user) {
            throw new Error('Invalid credentials')
        }

        const passwordMatch = await bcrypt.compare(
            passwordPlain,
            user.password!,
        ) // Non-null assertion as password should be present for login
        if (!passwordMatch) {
            throw new Error('Invalid credentials')
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
            entityType: entityType, // Store entityType as string in Session model (or adjust Session model to use enum)
            token: token,
            expiryDate: expiryDate,
            userAgent: userAgent,
            ipAddress: ipAddress,
        })

        return { token }
    }

    /**
     * Logs out a user by destroying the session associated with the given token.
     *
     * @param {string} token - The authentication token.
     * @returns {Promise<void>}
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
     * @param {string} token - The authentication token.
     * @returns {Promise<CurrentUserPayload | null>} The current user payload or null if the token is invalid or expired.
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
     * @param {number} userId - The ID of the user.
     * @param {EntityType} entityType - The type of the entity (using EntityType enum).
     * @returns {Promise<EntityType>} The entity type (returns EntityType enum).
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
     * @param {string} token - The authentication token.
     * @returns {Promise<number | null>} The user ID or null if the token is invalid or expired.
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
     * @param {number} userId - The ID of the user.
     * @param {EntityType} entityType - The type of user entity (using EntityType enum).
     * @returns {Promise<any | null>} The user entity or null if not found or entityType is invalid.
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
                return null // Or throw an error for unknown entityType
        }
    }
}

export const authService = new AuthService()
