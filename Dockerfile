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

# Dummy values for build time only — real values injected at runtime by Render
ENV DATABASE_URL=postgresql://placeholder:placeholder@placeholder/placeholder
ENV NEXTAUTH_SECRET=placeholder-secret-for-build-only
ENV NEXTAUTH_URL=https://placeholder.onrender.com
ENV CLOUDINARY_CLOUD_NAME=placeholder
ENV CLOUDINARY_API_KEY=placeholder
ENV CLOUDINARY_API_SECRET=placeholder
ENV SMTP_HOST=placeholder
ENV SMTP_PORT=587
ENV SMTP_USER=placeholder
ENV SMTP_PASSWORD=placeholder
ENV SMTP_FROM=placeholder
ENV GOOGLE_CLIENT_ID=placeholder
ENV GOOGLE_CLIENT_SECRET=placeholder

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

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=10000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 10000

CMD ["pnpm", "start", "--", "-p", "10000"]