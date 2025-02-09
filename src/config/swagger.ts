import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'School Management System API',
        version: '1.0.0',
        description: 'API documentation for School Management System',
        contact: {
            name: 'API Support',
            email: 'support@example.com',
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
        {
            url: 'https://api.production.com',
            description: 'Production server',
        },
    ],
    tags: [
        {
            name: 'Timetable',
            description: 'Endpoints for managing timetables',
        },
        {
            name: 'Exam Subjects',
            description: 'Endpoints for assigning and managing exam subjects',
        },
        {
            name: 'Users',
            description: 'Endpoints for user management and authentication',
        },
        {
            name: 'Exams',
            description: 'Endpoints for managing exams',
        },
        {
            name: 'Grades',
            description: 'Endpoints for managing grade criteria',
        },
        {
            name: 'Results',
            description: 'Endpoints for managing exam results',
        },
        {
            name: 'Sections',
            description: 'Endpoints for managing school sections',
        },
        {
            name: 'Subjects',
            description: 'Endpoints for managing school subjects',
        },
        {
            name: 'Teachers',
            description: 'Endpoints for managing teachers',
        },
        // Add other tags as needed for additional route groups
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                    internal_code: {
                        type: 'string',
                    },
                },
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        default: false,
                    },
                    message: {
                        type: 'string',
                    },
                },
                required: ['success', 'message'],
            },
            // ... [Your other schemas here]
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
}

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'], // Path to your route files
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
