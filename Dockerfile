# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Копируем .npmrc для доступа к приватному core-пакету
COPY .npmrc ./
# Аргумент сборки для передачи токена
ARG COOLCINEMA_GH_PKG_TOKEN
RUN pnpm install
COPY . .
RUN pnpm run build

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
