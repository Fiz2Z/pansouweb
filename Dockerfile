# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 只复制依赖文件
COPY package*.json ./

# 安装依赖（包含开发依赖，构建需要）
RUN npm ci && npm cache clean --force

# 复制源代码
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# 构建应用
RUN npm run build

# 生产阶段 - 使用更小的基础镜像
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制配置文件
COPY nginx.conf /etc/nginx/nginx.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh

# 设置权限并清理
RUN chmod +x /docker-entrypoint.sh && \
    rm -rf /var/cache/apk/*

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
