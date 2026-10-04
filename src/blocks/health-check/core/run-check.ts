import type {
    HealthCheck,
    HealthCheckResult,
} from '@/blocks/health-check/types/index.js'

export async function runCheck(
    check: HealthCheck,
    defaultTimeoutMs = 5000,
): Promise<HealthCheckResult> {
    const start = performance.now()
    const timeout = check.timeoutMs ?? defaultTimeoutMs

    try {
        // Bound health request latency and release the timer after a fast check.
        let timer: ReturnType<typeof setTimeout> | undefined
        const timeoutPromise = new Promise<never>((_, reject) => {
            timer = setTimeout(
                () => reject(new Error('Health check timed out')),
                timeout,
            )
        })

        try {
            await Promise.race([check.run(), timeoutPromise])
        } finally {
            if (timer !== undefined) clearTimeout(timer)
        }

        return {
            name: check.name,
            critical: check.critical,
            status: 'healthy',
            duration: performance.now() - start,
            ...(check.message === undefined ? {} : { message: check.message }),
        }
    } catch (error) {
        const duration = performance.now() - start

        return {
            name: check.name,
            critical: check.critical,
            status: 'unhealthy',
            duration,
            ...(check.message === undefined ? {} : { message: check.message }),
            // Never expose underlying connection failures or stack details publicly.
            error: 'Dependency check failed',
        }
    }
}
