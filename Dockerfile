# Production Dockerfile for varmanli.ir (Next.js, standalone output).
# Designed for Coolify's "Dockerfile" build pack. No secrets are baked in —
# all values below are supplied by Coolify's build/runtime environment.

# ---- deps: install dependencies reproducibly -------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: typecheck + build --------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined at build time — Coolify must provide these
# as build-time variables. DATABASE_URL is not required at build time by
# default; schema bootstrap runs safely at container startup instead. If your
# build environment can reach the production database and you explicitly want
# build-time bootstrap, enable RUN_DB_BOOTSTRAP_AT_BUILD=true.
ARG NEXT_PUBLIC_SITE_URL
ARG DATABASE_URL
ARG RUN_DB_BOOTSTRAP_AT_BUILD=false
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV RUN_DB_BOOTSTRAP_AT_BUILD=$RUN_DB_BOOTSTRAP_AT_BUILD
ENV NODE_ENV=production

RUN npx tsc --noEmit
RUN if [ "$RUN_DB_BOOTSTRAP_AT_BUILD" = "true" ]; then RUN_DB_BOOTSTRAP_ON_START=true node scripts/production-bootstrap.mjs; fi
RUN npm run build

# ---- runner: minimal production image --------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3003
ENV HOSTNAME=0.0.0.0
ENV UPLOAD_DIR=/app/uploads
ENV NEXT_PUBLIC_UPLOAD_BASE_URL=/uploads
ENV RUN_DB_BOOTSTRAP_ON_START=false
ENV DB_BOOTSTRAP_FAIL_HARD=false

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/db/migrations ./db/migrations
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3003

# Mount a persistent volume to /app/uploads in production so admin-uploaded
# assets survive restarts and redeploys. Real secrets (DATABASE_URL,
# AUTH_SECRET, etc.) must be provided as runtime environment variables in
# Coolify — never baked into this image. Startup bootstrap is opt-in at
# runtime via RUN_DB_BOOTSTRAP_ON_START=true and is non-fatal by default.
CMD ["node", "scripts/start-production.mjs"]
