# Build stage
FROM node:22.14.0 AS builder

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Install dependencies
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
    && pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN pnpm build

#────────────────────────────────────────────
# Production stage
#────────────────────────────────────────────
FROM node:22.14.0

# Set working directory
WORKDIR /app

# Create a non-root user and group (Debian style)
RUN groupadd --system appgroup \
    && useradd --system --gid appgroup --home-dir /app --no-create-home appuser

# Copy only the production artifacts from builder stage
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist         ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json  ./package.json
# Copy example env for default config (real .env should be injected at runtime)
COPY --from=builder --chown=appuser:appgroup /app/.env.example   .env.example

# Switch to non-root user
USER appuser

# Set runtime environment
ENV NODE_ENV=production
EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/app.js"]
