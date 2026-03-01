# ==============================
# Stage 1 — Build
# ==============================
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# 👇 Nhận build arg ngay đầu
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


# ==============================
# Stage 2 — Runtime
# ==============================
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# 👇 Copy node_modules từ builder (giống backend)
COPY --from=builder /app/node_modules ./node_modules

# 👇 Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

CMD ["npm", "start"]
