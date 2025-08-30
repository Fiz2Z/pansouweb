# 构建阶段 - 使用更小的基础镜像
FROM node:18-alpine AS builder

WORKDIR /app

# 只复制依赖文件
COPY package*.json ./

# 安装依赖并清理缓存
RUN npm ci --only=production && \
    npm install --save-dev vite @vitejs/plugin-react && \
    npm cache clean --force

# 复制源代码
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# 构建应用并移除不必要的文件
RUN npm run build && \
    rm -rf node_modules src public *.js *.json

# 生产阶段 - 使用最小的 nginx 镜像
FROM nginx:1.25-alpine

# 移除默认的 nginx 内容
RUN rm -rf /usr/share/nginx/html/*

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制配置文件
COPY nginx.conf /etc/nginx/nginx.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh

# 设置权限、清理缓存并移除不必要的包
RUN chmod +x /docker-entrypoint.sh && \
    rm -rf /var/cache/apk/* /tmp/* && \
    apk del --purge && \
    rm -rf /usr/share/man /usr/share/doc

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
