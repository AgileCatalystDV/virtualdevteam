# Subscription Tracker Frontend — Cloud Run (Next.js standalone)
# @Ian — Sprint 5
# NEXT_PUBLIC_API_URL moet bij build time ingesteld zijn (Next.js bakt het in)

FROM node:20-slim AS builder
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 8080
CMD ["node", "server.js"]
