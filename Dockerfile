# ---------- builder stage ----------
FROM node:22.14.0 AS builder

# make a directory inside the container
WORKDIR /app
RUN npm install -g pnpm
# install pnpm
RUN npm install -g pnpm

# copy lockfile and package manifest
COPY package.json pnpm-lock.yaml* ./

# install dependencies
RUN pnpm install --frozen-lockfile
RUN pnpm add -D typescript tsc-alias

# copy rest of the project and build
COPY . .
RUN pnpm build
# ---------- runner stage ----------
FROM node:22.14.0 AS runner

WORKDIR /app
ENV NODE_ENV=production

# copy only the compiled output and production deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# expose your app port (adjust if needed)
EXPOSE 4000

# default start command
CMD ["node", "dist/app.js"]