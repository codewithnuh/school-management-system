import type { ShutdownStateProvider } from '@/blocks/graceful-shutdown/types.js'

/**
 * Returns `true` when the request should be rejected because the application
 * is shutting down.
 */
export function shouldRejectRequest(provider: ShutdownStateProvider): boolean {
    return provider.isShuttingDownState
}
