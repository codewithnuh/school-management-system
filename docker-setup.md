# Docker Configuration for School Management System

## Multi-stage Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/server.js"]
```

## Development Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install development dependencies
RUN apk add --no-cache git

COPY package*.json ./
COPY pnpm-lock.yaml* ./

RUN npm install -g pnpm nodemon
RUN pnpm install

COPY . .

EXPOSE 3000

# Enable hot reload
ENV NODE_ENV=development

CMD ["pnpm", "run", "dev"]
```

## Docker Compose Configuration
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: school_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: school_management
      POSTGRES_USER: school_admin
      POSTGRES_PASSWORD: ${DB_PASSWORD:-secure_password_123}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "${DB_PORT:-5432}:5432"
    networks:
      - school_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U school_admin -d school_management"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: school_redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD:-redis_password_123}
    volumes:
      - redis_data:/data
    ports:
      - "${REDIS_PORT:-6379}:6379"
    networks:
      - school_network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: school_app
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: school_management
      DB_USER: school_admin
      DB_PASSWORD: ${DB_PASSWORD:-secure_password_123}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD:-redis_password_123}
      JWT_SECRET: ${JWT_SECRET:-your_jwt_secret_key_here}
      JWT_EXPIRES_IN: 7d
    ports:
      - "${APP_PORT:-3000}:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - school_network
    volumes:
      - ./logs:/app/logs
    command: >
      sh -c "node dist/server.js"

  # Development App (optional)
  app-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: school_app_dev
    profiles:
      - development
    environment:
      NODE_ENV: development
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: school_management
      DB_USER: school_admin
      DB_PASSWORD: ${DB_PASSWORD:-secure_password_123}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD:-redis_password_123}
      JWT_SECRET: dev_secret_key
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis
    networks:
      - school_network
    command: ["pnpm", "run", "dev"]

  # Test Runner
  test:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: school_test
    profiles:
      - test
    environment:
      NODE_ENV: test
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: school_management_test
      DB_USER: school_admin
      DB_PASSWORD: ${DB_PASSWORD:-secure_password_123}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD:-redis_password_123}
    depends_on:
      - postgres
      - redis
    networks:
      - school_network
    command: ["pnpm", "run", "test"]

  # Database Migration Runner
  migrate:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: school_migrate
    profiles:
      - migration
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: school_management
      DB_USER: school_admin
      DB_PASSWORD: ${DB_PASSWORD:-secure_password_123}
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - school_network
    command: ["pnpm", "run", "migrate"]

networks:
  school_network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```

## Environment Variables Template (.env.example)
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_management
DB_USER=school_admin
DB_PASSWORD=secure_password_123

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_123

# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

## Init Database Script (init-db.sql)
```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'UTC';

-- Create enum types
CREATE TYPE user_role AS ENUM ('super_admin', 'school_admin', 'teacher', 'student', 'parent');
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TYPE day_of_week AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE school_management TO school_admin;
```

## .dockerignore
```text
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
.DS_Store
coverage
.nyc_output
*.log
tests
*.test.ts
*.spec.ts
vitest.config.ts
tsconfig.test.json
README.md
docs
.postman
```

## Usage Commands

### Development
```bash
# Start all services in development mode
docker-compose --profile development up

# Start only database and redis
docker-compose up postgres redis

# View logs
docker-compose logs -f app-dev
```

### Production
```bash
# Build and start production
docker-compose up --build

# Run migrations first
docker-compose --profile migration up migrate

# Then start app
docker-compose up app
```

### Testing
```bash
# Run tests in container
docker-compose --profile test up test

# Run specific test file
docker-compose --profile test up test -- pnpm test timetable-validator.test.ts
```

### Maintenance
```bash
# Backup database
docker exec school_db pg_dump -U school_admin school_management > backup.sql

# Restore database
docker exec -i school_db psql -U school_admin school_management < backup.sql

# Reset database
docker-compose down -v
docker-compose up postgres -d
sleep 10
docker-compose --profile migration up migrate
```

## Health Check Endpoints
- `GET /health` - Application health
- `GET /health/db` - Database connection
- `GET /health/redis` - Redis connection

## Monitoring
```bash
# View resource usage
docker stats

# Inspect container
docker inspect school_app

# Access container shell
docker exec -it school_app sh
```
