# Use Node.js 20 as the base image
FROM node:20

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# ✅ Ensure both dependencies 
RUN pnpm install 
RUN pnpm add -D typescript

# Copy all files
COPY . .

# ✅ Ensure TypeScript is installed before running tsc
RUN pnpm exec tsc

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]
