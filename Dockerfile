# ==============================
# Global ARG (quan trọng)
# ==============================
ARG NEXT_PUBLIC_API_URL

# ==============================
# Stage 1 — Build
# ==============================
FROM node:20-bookworm-slim AS builder

# Nhận lại ARG trong stage
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN echo ">>> BUILD ARG: $NEXT_PUBLIC_API_URL"

RUN npm run build


# ==============================
# Stage 2 — Runtime
# ==============================
FROM node:20-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

CMD ["npm", "start"]
