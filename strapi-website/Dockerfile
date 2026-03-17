# Build stage
FROM node:20-alpine AS build

WORKDIR /opt/app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (once)
RUN npm install --frozen-lockfile

# Copy application files
COPY . .

# Build Strapi admin panel
RUN npm run build

# Remove dev dependencies (fast, no network needed)
RUN npm prune --omit=dev

# Production stage
FROM node:20-alpine

RUN mkdir -p /opt/app && chown -R node:node /opt/app
WORKDIR /opt/app

# Switch to non-root user early
USER node

# Copy necessary files
COPY --chown=node:node . .

# Copy pruned node_modules from build stage (no second npm install!)
COPY --chown=node:node --from=build /opt/app/node_modules ./node_modules

# Copy built application from build stage
COPY --chown=node:node --from=build /opt/app/dist ./dist

# Create uploads directory
RUN mkdir -p /opt/app/public/uploads

# Expose Strapi port
EXPOSE 1337

# Start Strapi
CMD ["npm", "start"]
