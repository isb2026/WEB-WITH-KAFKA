# Step 1: Build Stage
FROM node:18 AS builder

WORKDIR /build

# pnpm 준비
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

# 코드 복사 및 설치
COPY . .
RUN pnpm install
RUN pnpm build --filter esg

# Step 2: Production Image
FROM nginx:alpine

# Nginx 설정 덮어쓰기 (선택사항)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Vite 결과물 복사
COPY --from=builder /build/apps/esg/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
