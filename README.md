# School Management System

This project is a comprehensive school management system built with Express.js and Sequelize ORM, designed to streamline educational institution operations.

The School Management System is a robust web application that provides a centralized platform for managing various aspects of school administration. It offers features for student and teacher management, course scheduling, attendance tracking, and more. Built with modern web technologies, it ensures efficient data handling and a smooth user experience.

Key features include:

- User management (students and teachers)
- Database integration with MySQL
- RESTful API endpoints for CRUD operations
- Secure authentication and authorization
- Data validation and error handling

## Repository Structure

```
.
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── app.ts
│   ├── config
│   │   ├── database.ts
│   │   └── seed.ts
│   ├── controllers
│   │   └── UserController.ts
│   ├── data
│   │   └── mockData.ts
│   ├── index.ts
│   ├── models
│   │   ├── Teacher.ts
│   │   └── User.ts
│   └── routes
│       └── UserRoutes.ts
└── tsconfig.json
```

Key Files:

- `src/index.ts`: Application entry point
- `src/app.ts`: Express application setup and configuration
- `src/config/database.ts`: Database connection configuration
- `src/models/`: Sequelize model definitions
- `src/controllers/`: Request handlers for different routes
- `src/routes/`: API route definitions
- `tsconfig.json`: TypeScript configuration file

## Usage Instructions

### Installation

Prerequisites:

- Node.js (v18 or later)
- pnpm (v7 or later)
- MySQL (v8 or later)

Steps:

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

    ```
    pnpm install
    ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

    ```
    MYSQL_PASSWORD=your_mysql_password
    PORT=3000
    ```

### Getting Started

1. Start the development server:

    ```
    pnpm start
    ```

2. The server will start running on `http://localhost:3000`

### Configuration Options

Database configuration can be modified in `src/config/database.ts`. Adjust the following parameters as needed:

- `database`
- `username`
- `host`
- `port`

### Common Use Cases

1. Creating a new user:

    ```typescript
    POST /users
    Content-Type: application/json

    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "dateOfBirth": "1990-01-01",
      "gender": "Male",
      "phoneNo": "1234567890",
      "address": "123 Main St",
      "studentId": "S12345",
      "guardianName": "Jane Doe",
      "guardianCNIC": "1234567890123",
      "CNIC": "1234567890123",
      "class": 10,
      "enrollmentDate": "2023-09-01"
    }
    ```

2. Retrieving all users:

    ```
    GET /users
    ```

### Testing & Quality

To ensure the quality of the codebase, consider implementing unit tests for controllers and models using a testing framework like Jest.

### Troubleshooting

1. Database Connection Issues:

    - Problem: Unable to connect to the database
    - Error message: "Unable to connect to the database"
    - Diagnostic steps:
        1. Check if MySQL service is running
        2. Verify database credentials in `.env` file
        3. Ensure the database exists and is accessible
    - Debug command:

        ```
        DEBUG=sequelize* pnpm start
        ```

    - Expected outcome: Detailed Sequelize logs should appear in the console

2. Server Start-up Failure:

    - Problem: Server fails to start
    - Error message: "Error: listen EADDRINUSE: address already in use :::3000"
    - Diagnostic steps:
        1. Check if another process is using port 3000
        2. Change the port in the `.env` file if needed
    - Debug command:

        ```
        lsof -i :3000
        ```

    - Expected outcome: List of processes using port 3000, if any

### Performance Optimization

- Monitor database query performance using Sequelize's logging feature
- Implement database indexing for frequently queried fields
- Use connection pooling in database configuration for better resource utilization

## Data Flow

The School Management System follows a typical client-server architecture with a RESTful API. Here's an overview of the data flow:

1. Client sends HTTP request to the server
2. Express.js middleware processes the request (parsing, CORS, security headers)
3. Router directs the request to the appropriate controller
4. Controller interacts with the Sequelize models to perform database operations
5. Sequelize models communicate with the MySQL database
6. Database returns results to the Sequelize models
7. Controller processes the data and sends the HTTP response back to the client

```
Client <-> Express Middleware <-> Router <-> Controller <-> Sequelize Models <-> MySQL Database
```

Note: Ensure proper error handling and data validation at each step of the flow to maintain data integrity and provide meaningful feedback to the client.

## Infrastructure

The School Management System uses the following key infrastructure components:

Database:

- Type: MySQL
- Configuration: Defined in `src/config/database.ts`
- Purpose: Stores all application data including user information, courses, and other school-related data

Web Server:

- Type: Express.js
- Configuration: Set up in `src/app.ts`
- Purpose: Handles HTTP requests, routes them to appropriate controllers, and sends responses back to clients

ORM:

- Type: Sequelize
- Configuration: Models defined in `src/models/`
- Purpose: Provides an abstraction layer for database operations and defines data models

Note: This project does not have a dedicated infrastructure stack defined in CloudFormation, CDK, or Terraform. The infrastructure is primarily managed through code and configuration files within the application itself.

```import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    BeforeCreate,
} from 'sequelize-typescript';
import { User } from '@/models/User';
import { Teacher } from '@/models/Teacher';
import * as crypto from 'crypto';
import { Op } from 'sequelize';

type EntityType = 'USER' | 'TEACHER';

interface PasswordResetTokenAttributes {
    id?: number;
    token: string;
    entityId: number;
    entityType: EntityType;
    expiryDate: Date;
    isUsed: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

@Table({
    tableName: 'password_reset_tokens',
    timestamps: true,
})
export class PasswordResetToken
    extends Model<PasswordResetTokenAttributes>
    implements PasswordResetTokenAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id?: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
    })
    token!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    entityId!: number;

    @Column({
        type: DataType.ENUM('USER', 'TEACHER'),
        allowNull: false,
    })
    entityType!: EntityType;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    expiryDate!: Date;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    isUsed!: boolean;

    @Column({ type: DataType.DATE })
    createdAt?: Date;

    @Column({ type: DataType.DATE })
    updatedAt?: Date;

    @BeforeCreate
    static async generateToken(instance: PasswordResetToken) {
        instance.token = crypto.randomBytes(32).toString('hex');
        instance.expiryDate = new Date(Date.now() + 3600000); // 1 hour from now
    }

    // Helper methods
    static async createToken(entityId: number, entityType: EntityType): Promise<PasswordResetToken> {
        // Invalidate any existing tokens
        await this.update(
            { isUsed: true },
            {
                where: {
                    entityId,
                    entityType,
                    isUsed: false,
                    expiryDate: {
                        [Op.gt]: new Date(),
                    },
                },
            }
        );

        return await this.create({
            entityId,
            entityType,
        });
    }

    static async findValidToken(token: string): Promise<PasswordResetToken | null> {
        return await this.findOne({
            where: {
                token,
                isUsed: false,
                expiryDate: {
                    [Op.gt]: new Date(),
                },
            },
        });
    }

    async markAsUsed(): Promise<void> {
        this.isUsed = true;
        await this.save();
    }

    isExpired(): boolean {
        return new Date() > this.expiryDate;
    }

    isValid(): boolean {
        return !this.isUsed && !this.isExpired();
    }
}

// Password Reset Service
export class PasswordResetService {
    static async generateResetToken(
        email: string,
        entityType: EntityType
    ): Promise<string> {
        let entity;

        if (entityType === 'USER') {
            entity = await User.findOne({ where: { email } });
        } else {
            entity = await Teacher.findOne({ where: { email } });
        }

        if (!entity) {
            throw new Error(`${entityType.toLowerCase()} not found`);
        }

        const resetToken = await PasswordResetToken.createToken(entity.id, entityType);
        return resetToken.token;
    }

    static async resetPassword(
        token: string,
        newPassword: string
    ): Promise<boolean> {
        const resetToken = await PasswordResetToken.findValidToken(token);

        if (!resetToken || !resetToken.isValid()) {
            throw new Error('Invalid or expired token');
        }

        let entity;
        if (resetToken.entityType === 'USER') {
            entity = await User.findByPk(resetToken.entityId);
        } else {
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

    static async verifyToken(token: string): Promise<boolean> {
        const resetToken = await PasswordResetToken.findValidToken(token);
        return !!resetToken && resetToken.isValid();
    }
}

// Controller Example
export class PasswordController {
    async requestReset(req: Request, res: Response) {
        try {
            const { email, entityType } = req.body;

            if (!['USER', 'TEACHER'].includes(entityType)) {
                throw new Error('Invalid entity type');
            }

            const token = await PasswordResetService.generateResetToken(
                email,
                entityType as EntityType
            );

            // Send email with reset link
            await sendResetEmail(email, token, entityType);

            res.json({
                success: true,
                message: 'Password reset instructions sent to email'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { token, newPassword } = req.body;

            await PasswordResetService.resetPassword(token, newPassword);

            res.json({
                success: true,
                message: 'Password successfully reset'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async verifyToken(req: Request, res: Response) {
        try {
            const { token } = req.query;
            const isValid = await PasswordResetService.verifyToken(token as string);

            res.json({
                success: true,
                isValid
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

// Email helper function
async function sendResetEmail(email: string, token: string, entityType: EntityType) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Implement your email sending logic here
    // You might want to use different email templates for users and teachers
    const template = entityType === 'USER'
        ? 'user-reset-password'
        : 'teacher-reset-password';

    // Send email using your preferred email service
    // await emailService.send({
    //     to: email,
    //     template,
    //     context: { resetLink }
    // });
}
```
