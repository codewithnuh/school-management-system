import type {
    HealthCheck,
    HealthCheckResult,
} from '@/blocks/health-check/types/index.js'
import { runCheck } from '@/blocks/health-check/core/run-check.js'

export async function runChecks(
    checks: HealthCheck[],
    defaultTimeoutMs?: number,
): Promise<HealthCheckResult[]> {
    const tasks = checks.map(check => runCheck(check, defaultTimeoutMs))
    return await Promise.all(tasks)
}
