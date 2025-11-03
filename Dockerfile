# Backend Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Install deps
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --only=production || npm ci

# Copy source
COPY backend ./

# Expose port
EXPOSE 5000

# Healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start
CMD ["node", "server.js"]
