# ---------- builder stage ----------
FROM node:26-alpine AS builder

# make a directory inside the container
WORKDIR /app
RUN npm install -g pnpm

# copy lockfile and package manifest
COPY package.json pnpm-lock.yaml* ./

# install dependencies
RUN pnpm install --frozen-lockfile

# copy rest of the project and build
COPY . .
RUN pnpm build

# ---------- runner stage ----------
FROM node:26-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# copy only the compiled output and production deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/src/config/config.cjs ./src/config/config.cjs

USER nodejs

# expose your app port (adjust if needed)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health/ready', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# default start command
CMD ["node", "dist/app.js"]
