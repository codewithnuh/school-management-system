# School Management System — Target Architecture Redesign

## Current Problems
- Mixed legacy and new domain models are coexisting, causing broken imports and type mismatches.
- Controllers contain business logic and authentication/session concerns.
- Auth/session state is inconsistent across middleware, services, and DB assumptions.
- Build quality gate is failing due to cross-module contract drift.

## Proposed Professional Architecture

### 1) Domain-first modular monolith
Organize by bounded contexts:
- `src/modules/auth`
- `src/modules/users`
- `src/modules/academics`
- `src/modules/timetable`
- `src/modules/exams`
- `src/modules/fees`
- `src/modules/core`

Each module contains:
- `controller/`
- `service/`
- `repository/`
- `dto/`
- `validator/`
- `mapper/`
- `routes/`

### 2) Clean app layers
- **HTTP layer**: express routes/controllers only parse request/response.
- **Application layer**: services implement use-cases.
- **Infrastructure layer**: sequelize repositories, redis adapters, mail adapters.

### 3) Contract unification
- Keep one source-of-truth per model (sequelize model + zod DTO mapper).
- Remove duplicated/legacy model exports and mismatched names.
- Add explicit module public API index files.

### 4) Authentication redesign (smooth + secure)
- Access token: short-lived JWT (15 min).
- Refresh token: opaque random token stored in Redis with rotation.
- Session index in Redis:
  - `session:{sid}` -> user/session metadata (TTL)
  - `user_sessions:{userId}` -> set of active session ids
  - `refresh:{tokenHash}` -> session id (TTL)
- Revoke on logout by deleting session and rotated refresh tokens.
- Support per-device sessions with user-agent fingerprint and IP metadata.

### 5) Security baseline
- Enforce cookie-only refresh token (httpOnly, secure, sameSite=lax/none per env).
- Keep access token in Authorization header.
- Add brute-force guard (IP + account key in Redis).
- Standardize audit logs for auth events (no token data in logs).

### 6) Reliability and maintainability
- Add lint + typecheck + test as required CI checks.
- Add migration verification in CI (`sequelize db:migrate:status`).
- Add architecture decision records (ADRs) under `docs/adr/`.

## Migration Plan (Incremental)
1. Freeze legacy auth endpoints and create `modules/auth` v2 paths.
2. Introduce Redis-backed refresh/session service and token rotation.
3. Replace controller-level DB logic with repositories + services module-by-module.
4. Remove legacy imports and dead exports after each module cutover.
5. Enforce strict TS mode module-by-module and fail CI on regressions.

## Definition of Done for “fixed system”
- `pnpm lint` passes.
- `pnpm build` passes.
- auth e2e login/refresh/logout tests pass.
- legacy duplicate model names removed.
