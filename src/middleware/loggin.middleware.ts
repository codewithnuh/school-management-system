// middleware/logging.middleware.ts
import winston from 'winston'
import { format } from 'winston'
import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'

const { combine, timestamp } = format

// ---------------------
// 1. Logger Setup
// ---------------------

const logTransports: winston.transport[] = []

if (process.env.NODE_ENV === 'production') {
    logTransports.push(
        new winston.transports.File({
            dirname: 'logs',
            filename: 'error.log',
            level: 'error',
        }),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'combined.log',
        }),
    )
} else {
    logTransports.push(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    )
}

export const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), format.json()),
    transports: logTransports,
    exceptionHandlers: [
        new winston.transports.File({ filename: 'src/logs/exceptions.log' }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'src/logs/rejections.log' }),
    ],
})

// ---------------------
// 2. Request ID Middleware
// ---------------------

export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const requestId = uuidv4()
    req.id = requestId

    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start
        const logMeta = {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            durationMs: duration,
            ip: req.ip || req.socket.remoteAddress,
            userAgent: req.get('user-agent'),
            requestId,
        }

        // Log based on response status
        if (res.statusCode >= 400 && res.statusCode < 500) {
            logger.warn(logMeta)
        } else if (res.statusCode >= 500) {
            logger.error(logMeta)
        } else {
            logger.info(logMeta)
        }
    })

    next()
}

// ---------------------
// 3. Error Logger Middleware
// ---------------------

export const errorLogger = (err: Error, req: Request, res: Response) => {
    const requestId = req.id || 'unknown'

    const errorMeta = {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        method: req.method,
        path: req.path,
        ip: req.ip || req.socket.remoteAddress,
        requestId,
    }

    logger.error(errorMeta)

    // Send minimal error response to client
    res.status(500).json({
        error: 'Internal Server Error',
        requestId,
    })
}
