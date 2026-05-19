# ADR 0001: Redis-backed Auth Sessions with Rotating Refresh Tokens

## Status
Accepted

## Context
The codebase currently has inconsistent assumptions around session persistence and model availability.

## Decision
Use Redis as the primary auth session store for refresh/session lifecycle. Keep access JWT stateless and short-lived.

## Consequences
- Better revocation and multi-device session control.
- Requires Redis availability in production.
- Reduces direct DB coupling in auth middleware.
