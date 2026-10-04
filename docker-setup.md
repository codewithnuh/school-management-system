# Docker setup

The root `docker-compose.yml` is the source of truth for PostgreSQL, Redis, and the API containers.

## Start the stack

1. Copy `.env.example` to `.env`.
2. Replace the database, Redis, and JWT placeholder values with unique local secrets. Keep `.env` out of Git.
3. Start the services:

    ```sh
    docker compose up --build
    ```

The API listens on `http://localhost:3000`. PostgreSQL is available to the API container as `postgres:5432`; Redis is available as `redis:6379`.

## Run the API on the host

Start only the data stores:

```sh
docker compose up postgres redis
```

In another terminal, install packages and start the API:

```sh
pnpm install
pnpm dev
```

The `.env.example` defaults target local services at `localhost`.

## Database settings

`src/config/env.ts` validates database settings before startup. PostgreSQL is the default dialect. Set `DB_SSL=true` when the PostgreSQL host requires TLS; certificate verification stays enabled.

The first PostgreSQL database is fresh. This setup does not copy records from a MySQL database.

## Useful commands

```sh
docker compose ps
docker compose logs -f app
docker compose down
```

Remove the local database and Redis volumes only when you intend to erase their data:

```sh
docker compose down --volumes
```
