# School Management System API

A TypeScript REST API for school management. The project currently uses Express, Sequelize, and PostgreSQL. The Subjects feature is the first module with a domain contract and swappable persistence adapters; the remaining features are being migrated incrementally.

## Requirements

- Node.js 26 or newer
- pnpm 10
- Docker Compose, or PostgreSQL and Redis running locally

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env` and replace every `replace-with-...` value with a unique local secret.
3. Start the API stack with `docker compose up --build`.

Compose starts PostgreSQL and Redis, runs the versioned migrations, then starts the API. The API listens on `http://localhost:3000`; OpenAPI documentation is at `/api/v1/api-docs`, the specification is at `/api/v1/openapi.json`, and readiness is at `/api/v1/health/ready`.

For development outside Docker, start PostgreSQL and Redis, then run `pnpm dev`. Development startup synchronizes Sequelize models; production startup relies on migrations.

## Configuration

`src/config/env.ts` validates environment variables once at startup. Database credentials and application secrets must come from the environment; the sample DB password and JWT secret are rejected until replaced. PostgreSQL is the configured adapter, and `DB_SSL=true` enables verified TLS.

`CORS_ORIGINS` is a comma-separated allowlist. Set `TRUST_PROXY_HOPS` to the exact number of trusted proxy hops in front of the API; it defaults to `0`. Set `UPLOADTHING_TOKEN` when file uploads are enabled. `JWT_SECRET` must be at least 32 characters.

## Project layout

- `src/modules/` contains feature application and domain code.
- `src/infrastructure/persistence/` contains database and in-memory adapters.
- `src/blocks/` contains shared infrastructure blocks, including validated environment configuration, health checks, and graceful shutdown.
- `src/config/` contains composition and runtime configuration.
- `src/routes/`, `src/controllers/`, and `src/services/` contain legacy features that are being migrated into modules.
- `src/migrations/` contains versioned database migrations.
- `docs/adr/` records architecture decisions.

New feature modules should depend on domain repository interfaces. Keep Sequelize models and SQL-specific behavior inside persistence adapters so an alternate database or test adapter can be selected at the composition boundary.

## Commands

- `pnpm dev` starts the development server.
- `pnpm build` compiles the API.
- `pnpm typecheck` runs strict TypeScript checking.
- `pnpm test` runs the Vitest suite.
- `pnpm migrate` applies pending database migrations.
- `pnpm migrate:status` lists migration state.

## Current migration scope

The architecture work is incremental. Most existing controllers and services still access Sequelize directly, and the repository currently has pre-existing TypeScript errors outside the modules already migrated. Review the existing migration history before applying it to any database containing valuable data. This project is configured for a fresh PostgreSQL database and does not include a MySQL data transfer.
