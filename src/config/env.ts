import { config as loadDotEnv } from 'dotenv'
import { z } from 'zod'
import { parseEnv } from '@/blocks/env-config/index.js'

loadDotEnv()

const corsOriginsSchema = z
    .string()
    .default('http://localhost:5173,http://localhost:3000')
    .transform(value =>
        value
            .split(',')
            .map(origin => origin.trim())
            .filter(Boolean),
    )
    .refine(
        origins =>
            origins.every(origin => {
                try {
                    const parsed = new URL(origin)
                    return (
                        (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
                        parsed.origin === origin
                    )
                } catch {
                    return false
                }
            }),
        { message: 'CORS_ORIGINS must be a comma-separated list of exact HTTP(S) origins' },
    )

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    DB_DIALECT: z.literal('postgres').default('postgres'),
    DB_HOST: z.string().trim().min(1).default('localhost'),
    DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
    DB_NAME: z.string().trim().min(1),
    DB_USER: z.string().trim().min(1),
    DB_PASSWORD: z
        .string()
        .min(16)
        .refine(value => !value.toLowerCase().startsWith('replace-with-'), {
            message:
                'Replace the sample database password with a unique secret',
        }),
    DB_SSL: z
        .enum(['true', 'false'])
        .default('false')
        .transform(value => value === 'true'),
    JWT_SECRET: z
        .string()
        .min(32)
        .refine(value => !value.toLowerCase().startsWith('replace-with-'), {
            message: 'Replace the sample JWT secret with a unique secret',
        }),
    JWT_EXPIRES_IN: z.string().trim().min(1).default('7d'),
    SESSION_EXPIRY_HOURS: z.coerce.number().int().min(1).max(8760).default(168),
    FRONTEND_URL: z.string().url().default('http://localhost:5173'),
    CORS_ORIGINS: corsOriginsSchema,
    TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(0),
    UPLOADTHING_TOKEN: z.string().trim().min(1).optional(),
})

export const env = parseEnv(envSchema)
