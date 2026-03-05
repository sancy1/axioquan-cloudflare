# ── Stage 1: Dependencies ─────────────────────────────────────────────────────
FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# ── Stage 2: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Dummy DATABASE_URL for build time only
# Real value injected by Render at runtime
ENV DATABASE_URL=postgresql://build:build@build/build
ENV NEXTAUTH_SECRET=build-time-placeholder
ENV NEXTAUTH_URL=https://placeholder.onrender.com

RUN pnpm build

# ── Stage 3: Local Development ────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
EXPOSE 3001

CMD ["pnpm", "dev"]

# ── Stage 4: Production Runner ────────────────────────────────────────────────
# THIS MUST BE LAST — Render uses the final stage by default
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=10000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# With output: standalone, Next.js creates a self-contained server
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 10000

# Standalone mode uses node server.js directly — no pnpm needed
CMD ["node", "server.js"]
