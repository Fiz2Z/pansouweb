# 项目设置说明

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. 开发环境
```bash
npm install
npm run dev
```

### 3. Docker 部署
```bash
# 本地构建
docker-compose up --build -d

# 或使用预构建镜像
docker run -d -p 3000:80 -e API_DOMAIN=your-domain.com ghcr.io/your-username/your-repo:latest
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `API_DOMAIN` | PanSou API 域名 | `104.194.69.89` |

## 自定义配置

### 1. 更换 API 地址
在 `docker-compose.yml` 中修改：
```yaml
environment:
  - API_DOMAIN=your-api-domain.com
```

### 2. 添加应用图标
将图标文件放在 `public/` 目录下，并更新：
- `public/manifest.json` - PWA 图标配置
- `index.html` - 页面图标引用

### 3. 修改应用信息
编辑以下文件：
- `index.html` - 页面标题和描述
- `public/manifest.json` - PWA 应用信息
- `src/components/Header.jsx` - 页面头部信息

## 部署说明

项目包含 GitHub Actions 工作流，推送到 main 分支时会自动构建 Docker 镜像。

镜像地址：`ghcr.io/your-username/your-repo:latest`
