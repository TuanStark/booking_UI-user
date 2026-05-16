# ==================== BASE STAGE ====================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat dumb-init
WORKDIR /app

# ==================== DEPENDENCIES STAGE ====================
FROM base AS deps
# Copy package files trước để cache layer
COPY package*.json ./
# Nếu dùng pnpm/yarn thì thay tương ứng
RUN npm ci --include=dev --frozen-lockfile && npm cache clean --force

# ==================== BUILDER STAGE ====================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments (nếu cần)
ARG NEXT_PUBLIC_AGENT_API_URL=https://dorm-agent.tuanstark.id.vn/api/v1/super-agent/query
ARG NEXT_PUBLIC_CHAT_WS_URL=https://dorm-api.tuanstark.id.vn
ARG NEXT_PUBLIC_API_BASE_URL=https://dorm-api.tuanstark.id.vn

ENV NEXT_PUBLIC_AGENT_API_URL=$NEXT_PUBLIC_AGENT_API_URL
ENV NEXT_PUBLIC_CHAT_WS_URL=$NEXT_PUBLIC_CHAT_WS_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Build với standalone
RUN npm run build

# ==================== RUNNER STAGE (Production) ====================
FROM base AS runner

# Tạo non-root user (security best practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# Copy standalone output (chỉ những gì Next.js cần)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy package.json (cho một số script nếu cần)
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# dumb-init giúp handle signals tốt (PID 1)
ENTRYPOINT ["dumb-init", "--"]

# Standalone mode sẽ generate server.js
CMD ["node", "server.js"]