// middleware/logging.middleware.ts
import winston from 'winston'
import { Request, Response, NextFunction } from 'express'

const logTransports = []

if (process.env.NODE_ENV === 'production') {
    logTransports.push(
        new winston.transports.File({
            dirname: 'src/logs',
            filename: 'error.log',
            level: 'error',
        }),
        new winston.transports.File({
            dirname: 'src/logs',
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
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: logTransports,
})

export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start
        logger.info({
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            ip: req.ip,
            userAgent: req.get('user-agent'),
        })
    })

    next()
}

export const errorLogger = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        path: req.path,
        ip: req.ip,
    })
    next(err)
}
