# Use Node.js 20 as the base image
FROM node:20

# Set working directory
WORKDIR /app

# Install build essentials
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Ensure both dependencies are installed
RUN pnpm install

# Copy all files
COPY . .

# Remove .env file if it exists
RUN rm -f .env

# Ensure TypeScript is installed before running tsc
RUN pnpm exec tsc && node_modules/.bin/tsc-alias

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]