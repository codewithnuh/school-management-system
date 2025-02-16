import { Admin, Parent, Session, Teacher, User } from '@/models/index';
import jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';
const SESSION_EXPIRY_HOURS = parseInt(process.env.SESSION_EXPIRY_HOURS || '24', 10);

/**
 * Interface representing the payload for the current user.
 */
interface CurrentUserPayload {
  userId: number;
  entityType: string;
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
   * @param {'ADMIN'|'TEACHER'|'USER'|'PARENT'} entityType - The type of user entity.
   * @param {any} userModel - The model to use for finding the user (e.g., User, Admin, Teacher, Parent).
   * @param {string} [userAgent] - The user agent string (optional).
   * @param {string} [ipAddress] - The user's IP address (optional).
   * @returns {Promise<{ token: string }>} An object containing the authentication token.
   * @throws {Error} Throws an error if the credentials are invalid.
   *
   * @example
   * const authService = new AuthService();
   * try {
   *  const { token } = await authService.login('test@test.com', 'password', 'USER', User);
   *  console.log('User logged in with token:', token);
   * } catch (error) {
   *  console.error('Login failed:', error.mefinssage);
   * }
   */
  async login(email: string, passwordPlain: string, entityType: 'ADMIN'|'TEACHER'|'USER'|'PARENT', userModel: any, userAgent?: string, ipAddress?: string): Promise<{ token: string }> { // userModel type as 'any' for flexibility
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(passwordPlain, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      userId: user.id,
      entityType: entityType.toLowerCase(),
    };
    const token = jwt.sign(payload, JWT_SECRET!, { expiresIn: JWT_EXPIRY } as SignOptions);


    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + SESSION_EXPIRY_HOURS);

    await Session.create({
      userId: user.id, // Store the user's ID (regardless of model type)
      entityType: entityType, // Store the entity type in the session
      token: token,
      expiryDate: expiryDate,
      userAgent: userAgent,
      ipAddress: ipAddress,
    });

    return { token };
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
    await Session.destroy({ where: { token } });
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
   *   console.log('Current user:', currentUser);
   * }
   */
  async getCurrentUser(token: string): Promise<CurrentUserPayload | null> {
    try {
      const session = await Session.findOne({ where: { token } });
      if (!session || session.expiryDate < new Date()) {
        return null;
      }
      jwt.verify(token, JWT_SECRET!);
      const decoded = jwt.decode(token) as CurrentUserPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Gets the entity type of a user.
   *
   * @param {number} userId - The ID of the user.
   * @param {string} entityType - The type of the entity.
   * @returns {Promise<string>} The entity type.
   */
  async getUserEntityType(userId: number, entityType: string): Promise<string> { // Now entityType is readily available in JWT/Session
    return entityType;
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
   *   console.log('User ID:', userId);
   * }
   */
  async getUserId(token: string): Promise<number | null> {
    const currentUser = await this.getCurrentUser(token);
    return currentUser ? currentUser.userId : null;
  }

   /**
    * Fetches the user entity (User, Admin, Teacher, Parent) based on the user ID and entity type.
    * @param userId - The ID of the user.
    * @param entityType - The type of user entity.
    * @returns The user entity or null if the entity is not found or the entityType is invalid.
    */
  // New method to fetch the actual user entity based on userId and entityType
  async fetchUserEntity(userId: number, entityType: string): Promise<any | null> {
    switch (entityType) {
      case 'user':
        return User.findByPk(userId);
      case 'admin':
        return Admin.findByPk(userId);
      case 'teacher':
        return Teacher.findByPk(userId);
      case 'parent':
        return Parent.findByPk(userId);
      default:
        return null; // Or throw an error for unknown entityType
    }
  }
}

export const authService = new AuthService();