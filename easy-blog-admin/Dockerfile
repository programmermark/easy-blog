# 构建阶段
FROM node:20-alpine AS builder

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

WORKDIR /app

ENV NEXT_DISABLE_FONT_DOWNLOADS=1

# 确保 public 目录存在（即使在源码中被忽略，也避免 COPY 失败）
RUN mkdir -p public

# 安装 pnpm
RUN npm install -g pnpm

# 复制锁文件与 package
COPY pnpm-lock.yaml package.json ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm run build

# 生产阶段
FROM node:20-alpine AS production

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

WORKDIR /app

ENV NEXT_DISABLE_FONT_DOWNLOADS=1

# 安装 pnpm
RUN npm install -g pnpm

# 复制锁文件与 package
COPY pnpm-lock.yaml package.json ./

# 安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 复制构建产物
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# 更改文件所有权
RUN chown -R nextjs:nodejs /app
USER nextjs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["pnpm", "start"]
