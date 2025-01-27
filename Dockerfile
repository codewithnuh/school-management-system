# Use Node.js 20 as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build TypeScript code
RUN pnpm exec tsc

# Expose port 3000 (assuming this is the port your app uses)
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]