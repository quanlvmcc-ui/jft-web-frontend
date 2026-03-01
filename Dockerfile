# ==============================
# Stage 1 — Build
# ==============================
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Nhận build arg
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy package files trước (cache tốt hơn)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Debug (có thể xoá sau khi ổn)
RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"

# Build Next.js
RUN npm run build


# ==============================
# Stage 2 — Runtime
# ==============================
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY --from=builder /app/package*.json ./

# Install ONLY production deps
RUN npm ci --omit=dev

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

CMD ["npm", "start"]
