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
            Class: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                    },
                    name: {
                        type: 'string',
                    },
                    description: {
                        type: 'string',
                    },
                    maxStudents: {
                        type: 'number',
                    },
                    periodsPerDay: {
                        type: 'number',
                    },
                    periodLength: {
                        type: 'number',
                    },
                    workingDays: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: [
                                'Monday',
                                'Tuesday',
                                'Wednesday',
                                'Thursday',
                                'Friday',
                                'Saturday',
                                'Sunday',
                            ],
                        },
                    },
                    subjectIds: {
                        type: 'array',
                        items: {
                            type: 'number',
                        },
                    },
                    sections: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                },
                                maxStudents: {
                                    type: 'number',
                                },
                                classTeacherId: {
                                    type: 'number',
                                },
                                subjectTeachers: {
                                    type: 'object',
                                    additionalProperties: {
                                        type: 'number',
                                    },
                                },
                            },
                            required: [
                                'name',
                                'maxStudents',
                                'classTeacherId',
                                'subjectTeachers',
                            ],
                        },
                    },
                },
                required: [
                    'name',
                    'maxStudents',
                    'periodsPerDay',
                    'periodLength',
                    'workingDays',
                    'subjectIds',
                    'sections',
                ],
            },
            ExamSubject: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 1,
                    },
                    subjectName: {
                        type: 'string',
                        example: 'Mathematics',
                    },
                    maxMarks: {
                        type: 'number',
                        example: 100,
                    },
                    passMarks: {
                        type: 'number',
                        example: 40,
                    },
                },
                required: ['id', 'subjectName', 'maxMarks', 'passMarks'],
            },
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
    apis: ['./src/routes/*.ts'], // Scans all route files for OpenAPI annotations
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
