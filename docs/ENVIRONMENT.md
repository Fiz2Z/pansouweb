# 环境变量配置说明

## 概述

本项目支持通过环境变量自定义配置，包括API地址、作者信息、博客链接等。

## 支持的环境变量

### API 配置

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `VITE_API_DOMAIN` | API服务域名 | `localhost` | `api.example.com` |

**说明：**
- 如果域名包含协议（http/https），将直接使用
- 否则会自动添加 `http://` 协议和 `:8888` 端口
- 支持完整URL格式

### 作者信息配置

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `VITE_AUTHOR_NAME` | 作者名称 | `Yuccc` | `张三` |
| `VITE_BLOG_URL` | 博客地址 | `null` | `https://blog.example.com` |
| `VITE_BLOG_NAME` | 博客名称 | `Blog` | `我的技术博客` |

**说明：**
- `AUTHOR_NAME` 显示在关于页面的作者信息中
- `BLOG_URL` 为空时不显示博客链接
- `BLOG_NAME` 只在设置了 `BLOG_URL` 时生效

## 配置方法

### 1. 开发环境

创建 `.env` 文件：

```bash
# 复制示例文件
cp .env.example .env

# 编辑配置
VITE_API_DOMAIN=localhost
VITE_AUTHOR_NAME=Your Name
VITE_BLOG_URL=https://your-blog.com
VITE_BLOG_NAME=Your Blog Name
```

### 2. Docker Compose

在 `docker-compose.yml` 中配置：

```yaml
services:
  sousouweb:
    build: .
    environment:
      - API_DOMAIN=your-api-domain.com
      - AUTHOR_NAME=Your Name
      - BLOG_URL=https://your-blog.com
      - BLOG_NAME=Your Blog Name
```

### 3. Docker 命令行

```bash
docker run -d \
  --name sousouweb \
  -p 3000:80 \
  -e API_DOMAIN=your-api-domain.com \
  -e AUTHOR_NAME="Your Name" \
  -e BLOG_URL="https://your-blog.com" \
  -e BLOG_NAME="Your Blog Name" \
  ghcr.io/yuucccc/sousou:latest
```

### 4. 生产环境

```bash
# 系统环境变量
export API_DOMAIN=your-api-domain.com
export AUTHOR_NAME="Your Name"
export BLOG_URL="https://your-blog.com"
export BLOG_NAME="Your Blog Name"
```

## 环境变量优先级

1. **Vite 环境变量**：`import.meta.env.VITE_*`（开发环境）
2. **运行时配置**：`window.__APP_CONFIG__.*`（Docker部署）
3. **默认值**：代码中定义的默认值

## 示例配置

### 个人博客配置
```bash
VITE_AUTHOR_NAME=Yuccc
VITE_BLOG_URL=https://blog.yuccc.com
VITE_BLOG_NAME=Yuccc的技术分享
```

### 企业部署配置
```bash
VITE_API_DOMAIN=https://api.company.com:8888
VITE_AUTHOR_NAME=技术团队
VITE_BLOG_URL=https://tech.company.com
VITE_BLOG_NAME=技术博客
```

### 最小配置
```bash
# 只配置API地址，其他使用默认值
VITE_API_DOMAIN=your-api-server.com
```

## 注意事项

- 修改环境变量后需要重启开发服务器
- Docker部署时环境变量会在容器启动时注入
- 博客相关配置为可选，不设置 `BLOG_URL` 则不显示博客链接
- 所有配置都有合理的默认值，确保应用正常运行
