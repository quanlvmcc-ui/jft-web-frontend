# ==============================
# Stage 1 — Build
# ==============================
FROM node:20-bookworm-slim AS builder

WORKDIR /app

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

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]
