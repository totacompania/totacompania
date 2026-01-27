FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install
RUN npm install sharp

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create data directory for SQLite
RUN mkdir -p data

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install sharp dependencies for alpine
RUN apk add --no-cache libc6-compat

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create data directory
RUN mkdir -p data && chown -R nextjs:nodejs data

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy sharp from node_modules
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/sharp ./node_modules/sharp
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@img ./node_modules/@img

USER nextjs

EXPOSE 3101

ENV PORT 3101
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
