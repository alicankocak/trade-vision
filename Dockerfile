# ============================================
# TradeVision - TanStack Start + Prisma
# Multi-stage Docker build
# ============================================

# Base image with Node.js
FROM node:22-slim AS base

# Set working directory
WORKDIR /app

# ============================================
# Dependencies stage
# ============================================
FROM base AS deps

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# ============================================
# Build stage
# ============================================
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Copy prisma schema and generate client
# Provide dummy DATABASE_URL for prisma generate (doesn't connect, just generates types)
COPY prisma ./prisma/
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
RUN npx prisma generate

# Build the application
RUN npm run build

# ============================================
# Production stage
# ============================================
FROM base AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 tanstack

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy Prisma files for migrations (if needed at runtime)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

# Set ownership
RUN chown -R tanstack:nodejs /app

# Switch to non-root user
USER tanstack

# Expose the application port
EXPOSE 3000

# Health check
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
