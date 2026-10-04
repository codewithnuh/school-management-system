import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
    openapi: '3.0.3',
    info: {
        title: 'School Management System API',
        version: '1.0.0',
        description: 'Versioned HTTP API for school management.',
        license: {
            name: 'ISC',
            url: 'https://opensource.org/license/isc-license-txt/',
        },
    },
    servers: [
        {
            url: '/api/v1',
            description: 'Current API deployment',
        },
    ],
    tags: [
        {
            name: 'Health',
            description: 'Service readiness and dependency status',
        },
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
}

const options = {
    swaggerDefinition,
    apis: [
        ...(process.env.NODE_ENV === 'production'
            ? ['./dist/routes/*.js', './dist/app.js']
            : ['./src/routes/*.ts', './src/app.ts']),
    ],
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
