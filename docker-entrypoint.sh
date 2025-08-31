#!/bin/sh
set -e

# 生成配置文件，将环境变量注入到前端应用
cat > /usr/share/nginx/html/config.js << EOF
window.__APP_CONFIG__ = {
  API_DOMAIN: '${API_DOMAIN:-localhost}',
  AUTHOR_NAME: '${AUTHOR_NAME:-Yuccc}',
  BLOG_URL: '${BLOG_URL:-}',
  BLOG_NAME: '${BLOG_NAME:-Blog}'
};
EOF

# 更新 index.html 以加载配置文件
if [ ! -f /usr/share/nginx/html/index.html.backup ]; then
  cp /usr/share/nginx/html/index.html /usr/share/nginx/html/index.html.backup
  # 在 head 标签结束前添加配置文件
  sed -i 's|</head>|<script src="/config.js"></script>\n  </head>|' /usr/share/nginx/html/index.html || true
fi

echo "配置已更新: AUTHOR_NAME=${AUTHOR_NAME:-Yuccc}, BLOG_URL=${BLOG_URL:-}, BLOG_NAME=${BLOG_NAME:-Blog}"

# 启动 nginx
exec "$@"
