# PanSou Web

一个现代化、响应式的网盘资源搜索前端项目，基于 React + Vite + Tailwind CSS 构建，接入 [PanSou API](https://github.com/fish2018/pansou)。

仓库地址：`https://github.com/Fiz2Z/pansouweb`

## 项目亮点

- 响应式布局：移动端优先，适配桌面与平板
- 聚合搜索：支持多网盘与多类链接统一检索
- 持续回填：首轮返回后继续后台增量搜索，结果实时刷新
- 骨架屏加载：搜索中使用 Skeleton，减少等待焦虑
- 主题切换：支持浅色 / 深色模式
- PWA 支持：可安装到桌面，具备基础离线能力

## 支持的资源类型

- 网盘平台：百度网盘、阿里云盘、夸克网盘、天翼云盘、UC 网盘、115 网盘、PikPak、迅雷网盘、123 网盘、移动云盘、蓝奏云盘
- 其他链接：磁力链接（magnet）、Torrent、Thunder、ED2K

## 技术栈

- React 18
- Vite 5
- Tailwind CSS 3
- Lucide React
- Axios

## 本地开发

```bash
npm install
npm run dev
```

默认启动后访问：`http://localhost:5173`

## 生产构建

```bash
npm run build
npm run preview
```

## 环境变量

前端通过环境变量配置 API 域名。

开发环境可在项目根目录创建 `.env`：

```bash
VITE_API_DOMAIN=localhost
```

你也可以使用完整 URL（包含协议和端口）：

```bash
VITE_API_DOMAIN=https://your-domain.com:8888
```

更多细节请查看：`docs/ENVIRONMENT.md`

## Docker 部署

```bash
docker-compose up -d --build
```

部署后默认访问：`http://localhost:3000`

如需修改 API 域名，请在 `docker-compose.yml` 中设置容器环境变量 `API_DOMAIN`。

## 目录结构

```text
src/
  components/
    Header.jsx
    SearchForm.jsx
    SearchResults.jsx
    SettingsModal.jsx
    AboutModal.jsx
    ThemeToggle.jsx
    PWAInstallPrompt.jsx
    Footer.jsx
  contexts/
    ThemeContext.jsx
  services/
    api.js
  App.jsx
  main.jsx
  index.css
```

## 使用说明

1. 输入关键词并发起搜索
2. 按需在“设置”中选择资源类型筛选
3. 查看分组结果（默认折叠）
4. 对支持直达的平台点击“直达”；磁力/种子类可一键复制链接
5. 如资源有提取码，可点击复制

## 开源致谢

- [fish2018/pansou](https://github.com/fish2018/pansou)
- React / Vite / Tailwind CSS / Lucide

## License

MIT
