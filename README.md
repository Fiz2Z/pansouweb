# 全网资源搜索

一个现代化的全网资源搜索前端应用，基于 [PanSou API](https://github.com/fish2018/pansou) 和 React + Vite + Tailwind CSS 构建。

## 功能特性

- 🔍 **智能搜索**: 支持关键词搜索，快速找到所需资源
- 🌐 **多平台支持**: 支持百度网盘、阿里云盘、夸克网盘等 11 种主流平台
- 🎯 **精准筛选**: 可选择特定资源平台进行搜索
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🎨 **现代化UI**: 采用 Tailwind CSS，界面美观易用
- 🌙 **夜间模式**: 支持浅色/深色主题切换
- 📱 **PWA支持**: 可安装到桌面和手机，支持离线使用
- ⚡ **快速响应**: 基于 Vite 构建，开发和构建速度极快
- 🐳 **Docker部署**: 支持 Docker 容器化部署，轻量级镜像

## 支持的资源平台

- 百度网盘 (baidu)
- 阿里云盘 (aliyun)
- 夸克网盘 (quark)
- 天翼云盘 (tianyi)
- UC网盘 (uc)
- 115网盘 (115)
- PikPak (pikpak)
- 迅雷网盘 (xunlei)
- 123网盘 (123)
- 磁力链接 (magnet)
- ED2K链接 (ed2k)

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **图标库**: Lucide React
- **HTTP客户端**: Axios

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:5173 启动。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 部署方式

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### Docker 部署

#### 使用预构建镜像（推荐）
```bash
# 拉取并运行预构建镜像
docker run -d -p 3000:80 -e API_DOMAIN=your-domain.com ghcr.io/yuucccc/sousou:latest

# 或使用 docker-compose
# 修改 docker-compose.yml 中的 image 字段
# image: ghcr.io/yuucccc/sousou:latest
docker-compose up -d
```

#### 本地构建
```bash
# 构建并启动
docker-compose up --build -d

# 访问应用
http://localhost:3000
```

### 环境变量配置

支持通过环境变量自定义配置：

```bash
# 开发环境 - 创建 .env 文件
VITE_API_DOMAIN=localhost
VITE_AUTHOR_NAME=Yuccc
VITE_BLOG_URL=https://your-blog.com
VITE_BLOG_NAME=我的技术博客

# Docker 部署 - 在 docker-compose.yml 中设置
environment:
  - API_DOMAIN=your-domain.com
  - AUTHOR_NAME=Your Name
  - BLOG_URL=https://your-blog.com
  - BLOG_NAME=Your Blog Name

# 支持完整URL（包含协议和端口）
environment:
  - API_DOMAIN=https://your-domain.com:8888
```

详细配置说明请参考 [环境变量配置文档](docs/ENVIRONMENT.md)。

### PWA 功能

应用支持 Progressive Web App (PWA) 功能：

- **安装到桌面**: 在支持的浏览器中可以直接安装到桌面
- **移动端优化**: 在 iOS Safari 和 Android Chrome 中可添加到主屏幕
- **离线缓存**: 基本的离线访问支持
- **原生体验**: 全屏显示，类似原生应用

## 项目结构

```
src/
├── components/          # React 组件
│   ├── Header.jsx      # 页面头部
│   ├── SearchForm.jsx  # 搜索表单
│   ├── SearchResults.jsx # 搜索结果展示
│   ├── LoadingSpinner.jsx # 加载动画
│   └── Footer.jsx      # 页面底部
├── services/           # API 服务
│   └── api.js         # API 调用封装
├── App.jsx            # 主应用组件
├── main.jsx           # 应用入口
└── index.css          # 全局样式
```

## 使用说明

### 基本使用
1. 在搜索框中输入关键词
2. 可选择特定的网盘类型进行筛选
3. 点击"开始搜索"按钮
4. 浏览搜索结果，点击链接访问资源
5. 支持提取码一键复制功能

### PWA 安装
- **桌面端**: Chrome/Edge 浏览器地址栏会显示安装图标
- **iOS**: Safari 中点击分享按钮 → "添加到主屏幕"
- **Android**: Chrome 中会显示"添加到主屏幕"横幅提示

## 部署到生产环境

### GitHub Container Registry

项目会自动构建Docker镜像并推送到GitHub Container Registry：

```bash
# 拉取最新镜像
docker pull ghcr.io/yuucccc/sousou:latest

# 运行容器
docker run -d \
  --name sousouweb \
  -p 3000:80 \
  -e API_DOMAIN=your-domain.com \
  ghcr.io/yuucccc/sousou:latest
```

### 环境变量说明

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `API_DOMAIN` | API服务域名 | `localhost` | `api.example.com` |
| `AUTHOR_NAME` | 作者名称 | `Yuccc` | `张三` |
| `BLOG_URL` | 博客地址 | `null` | `https://blog.example.com` |
| `BLOG_NAME` | 博客名称 | `Blog` | `我的技术博客` |

## 致谢

本项目基于以下开源项目构建：

- **[PanSou](https://github.com/fish2018/pansou)** - 高性能网盘资源搜索API服务
- **React** - 用户界面构建库
- **Vite** - 现代化构建工具
- **Tailwind CSS** - 原子化CSS框架

特别感谢 [fish2018](https://github.com/fish2018) 开发的 PanSou API，为本项目提供了强大的搜索功能支持。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。
