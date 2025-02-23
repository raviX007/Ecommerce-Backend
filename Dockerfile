# Stage 1: Build the TypeScript App
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire source code
COPY . .

# Ensure TypeScript is installed
RUN npm install -g typescript

# Run the TypeScript compiler
RUN npm run build

# Stage 2: Run the Compiled JavaScript Code
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy compiled JS files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]