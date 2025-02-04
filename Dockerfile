# Use Node.js 20 as the base image
FROM node:20

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (ensure TypeScript is installed)
RUN pnpm install --unsafe-perm
RUN pnpm add -D typescript tsc-alias


# Copy all files
COPY . .

# Remove .env file if it exists
RUN rm -f .env

# Ensure TypeScript is available
RUN pnpm exec tsc --version

# Compile TypeScript and fix paths
RUN pnpm exec tsc && pnpm exec tsc-alias

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]
