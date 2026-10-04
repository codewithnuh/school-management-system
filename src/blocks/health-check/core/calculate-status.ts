import type {
    HealthCheckResult,
    HealthStatus,
} from '@/blocks/health-check/types/index.js'

export function calculateStatus(results: HealthCheckResult[]): HealthStatus {
    const hasCriticalFailure = results.some(
        result => result.critical && result.status === 'unhealthy',
    )

    if (hasCriticalFailure) {
        return 'unhealthy'
    }

    const hasOptionalFailure = results.some(
        result => !result.critical && result.status === 'unhealthy',
    )

    if (hasOptionalFailure) {
        return 'degraded'
    }

    return 'healthy'
}
