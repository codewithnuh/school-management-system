import rateLimit from 'express-rate-limit'
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // 5 login attempts per IP per windowMs. Use `limit` instead of `max` for express-rate-limit v6+.
    message: {
        success: false,
        message: 'Too many login attempts. Please try again later.',
    },
    standardHeaders: 'draft-8', // Consistent with the global limiter in app.ts
    legacyHeaders: false,
    // store: store, // Uncomment and use the initialized store for production
    skipSuccessfulRequests: true, // Reset limit on successful login.
})

export const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 100, // 100 requests per IP per minute. Use `limit` instead of `max` for express-rate-limit v6+.
    message: {
        success: false,
        message: 'Too many requests. Please try again later.',
    },
    standardHeaders: 'draft-8', // Consistent with the global limiter in app.ts
    legacyHeaders: false,
    // store: store, // Uncomment and use the initialized store for production
})

export const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10, // 10 registration attempts per IP per hour
    message: {
        success: false,
        message:
            'Too many account creation attempts from this IP. Please try again later.',
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    // store: store, // Uncomment and use the initialized store for production
})

export const sensitiveOperationLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    limit: 5, // 5 attempts per IP per 30 minutes for operations like password reset
    message: {
        success: false,
        message:
            'Too many attempts for this operation. Please try again later.',
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    // store: store, // Uncomment and use the initialized store for production
})
