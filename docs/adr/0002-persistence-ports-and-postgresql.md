# ADR 0002: Persistence ports with PostgreSQL as the first adapter

## Status

Accepted

## Context

Application code imports Sequelize models directly, while the database connection is configured for MySQL. Docker already declares PostgreSQL. This couples feature behavior to the ORM and leaves runtime and deployment configuration inconsistent.

The project will use a fresh PostgreSQL database. Existing MySQL rows do not need to be copied.

## Decision

- Feature modules depend on typed persistence interfaces expressed in school-domain terms.
- Database implementations live under infrastructure and are selected at application composition.
- PostgreSQL is the first production adapter. Add another adapter only when a real deployment or test needs it.
- Use versioned migrations for schema changes. Production startup does not create or alter tables with ORM synchronization.
- Move existing direct Sequelize access into adapters incrementally by feature module. Do not expose Sequelize models or operators through module interfaces.

## Consequences

- PostgreSQL connection settings come from validated environment configuration. Credentials do not live in tracked files or fallback defaults.
- A Sequelize CLI migration command and Compose migration service run the existing CommonJS migrations on Node 26. The migration history still needs a PostgreSQL-specific review before deployment.
- The current service and controller imports remain to be moved behind feature persistence interfaces. This ADR records the target and migration sequence, not a claim that the entire application is already database-agnostic.
- A fresh PostgreSQL database uses the existing versioned migrations; no MySQL data conversion is planned.
