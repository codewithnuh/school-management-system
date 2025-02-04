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
            // Added Class schema to resolve the missing token issue
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
    apis: ['./src/routes/*.ts'], // Path to the API docs
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
