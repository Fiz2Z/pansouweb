#!/bin/sh
set -e

# 生成配置文件，将环境变量注入到前端应用
cat > /usr/share/nginx/html/config.js << EOF
window.__APP_CONFIG__ = {
  API_DOMAIN: '${API_DOMAIN:-104.194.69.89}'
};
EOF

# 更新 index.html 以加载配置文件
if [ ! -f /usr/share/nginx/html/index.html.backup ]; then
  cp /usr/share/nginx/html/index.html /usr/share/nginx/html/index.html.backup
  # 在 head 标签结束前添加配置文件
  sed -i 's|</head>|<script src="/config.js"></script>\n  </head>|' /usr/share/nginx/html/index.html || true
fi

echo "API域名配置: ${API_DOMAIN:-104.194.69.89}"

# 启动 nginx
exec "$@"
