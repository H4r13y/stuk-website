# Build stage
FROM node:20-alpine AS build

WORKDIR /opt/app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy application files
COPY . .

# Build Strapi admin panel
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /opt/app

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm install --frozen-lockfile --production

# Copy necessary files first
COPY . .

# Copy built application from build stage (overwrite)
COPY --from=build /opt/app/dist ./dist

# Create uploads directory
RUN mkdir -p /opt/app/public/uploads

# Set ownership
RUN chown -R node:node /opt/app

# Switch to non-root user
USER node

# Expose Strapi port
EXPOSE 1337

# Start Strapi
CMD ["npm", "start"]
