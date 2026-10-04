import type {
    CreateHealthOptions,
    Health,
} from '@/blocks/health-check/types/index.js'
import { buildReport as defaultBuildReport } from '@/blocks/health-check/core/build-report.js'
import { calculateStatus as defaultCalculateStatus } from '@/blocks/health-check/core/calculate-status.js'
import { runChecks } from '@/blocks/health-check/core/run-checks.js'
import { validateConfig } from '@/blocks/health-check/core/validate-config.js'

export function createHealth(options: CreateHealthOptions): Health {
    // Fail fast: Validate configuration immediately upon creation
    validateConfig(options)

    // Allow teams to override default policies if business rules differ
    const calculateStatus = options.calculateStatus ?? defaultCalculateStatus
    const buildReport = options.buildReport ?? defaultBuildReport

    return {
        async run() {
            const results = await runChecks(
                options.checks,
                options.defaultTimeoutMs,
            )
            const status = calculateStatus(results)
            return buildReport(results, status)
        },
    }
}
