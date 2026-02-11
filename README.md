# Team Challenge Tracker - 团队挑战打卡应用

<div align="center">
  <img src="./images/icons/icon-192x192.png" alt="Logo" width="120" />
  <h3>通过群体责任制完成长期目标</h3>
  <p>
    <a href="#features">功能特性</a> •
    <a href="#demo">在线演示</a> •
    <a href="#installation">本地开发</a> •
    <a href="#deployment">部署</a>
  </p>
</div>

---

## ✨ 功能特性

- 🎯 **挑战管理** - 创建自定义挑战，设置多任务目标
- 👥 **团队协作** - 通过邀请码邀请好友共同参与
- 📊 每日打卡** - 记录每日完成量，可视化进度追踪
- 📈 **数据统计** - 全面的进度分析和成员贡献排行
- 📱 **PWA支持** - 可安装到桌面，支持离线使用
- 🎨 **精美设计** - Flat Design后现代简约风格
- 💾 **本地存储** - 数据完全存储在浏览器本地

## 🎨 设计系统

- **字体**: Bodoni Moda (标题) + Jost (正文)
- **配色**: 冠军红 (#DC2626) + 胜利金 (#FBBF24)
- **风格**: Flat Design - 简洁、现代、高性能

## 🚀 技术栈

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **存储**: localStorage API
- **PWA**: Service Worker, Web App Manifest
- **部署**: Vercel
- **架构**: SPA (Single Page Application)

## 📦 本地开发

### 前置要求

- 现代浏览器 (Chrome 90+, Safari 14+, Firefox 88+)
- Python 3 (用于本地服务器) 或任何静态文件服务器

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/team-challenge-tracker.git
cd team-challenge-tracker

# 启动本地服务器
python3 -m http.server 8000

# 访问应用
open http://localhost:8000
```

## 📖 使用指南

### 1. 创建挑战

1. 点击首页的"创建挑战"按钮
2. 填写挑战信息:
   - 标题和描述
   - 上传图片 (可选)
   - 设置开始和结束日期
3. 添加任务:
   - 任务名称 (例如: "阅读页数")
   - 目标数量 (例如: 600)
   - 单位 (例如: "页")
4. 点击"创建挑战"完成

### 2. 邀请好友

1. 进入挑战详情页
2. 点击"分享"按钮
3. 复制邀请码 (例如: ABC123)
4. 将邀请码发送给好友
5. 好友在首页点击"加入挑战"，输入邀请码

### 3. 每日打卡

1. 进入挑战详情页
2. 点击"今日打卡"
3. 选择任务
4. 输入完成数量 (或使用快捷按钮)
5. 点击"提交打卡"

### 4. 查看统计

1. 进入挑战详情页
2. 点击"数据统计"
3. 查看:
   - 总体进度环形图
   - 任务完成详情
   - 成员贡献排行

## 🌐 部署到 Vercel

### 使用 GitHub

```bash
# 1. 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit: Team Challenge Tracker PWA"

# 2. 推送到 GitHub
gh repo create team-challenge-tracker --public --source=. --remote=origin --push
```

### 在 Vercel 上部署

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Import Project"
3. 选择 GitHub 仓库 `team-challenge-tracker`
4. 配置:
   - Framework Preset: **Other**
   - Build Command: (留空)
   - Output Directory: (留空)
5. 点击 "Deploy"

部署完成后，您将获得一个 HTTPS URL (例如: `team-challenge-tracker.vercel.app`)

## 📱 PWA 功能

应用支持安装为 PWA，提供:

- ✅ 桌面图标 - 添加到主屏幕
- ✅ 离线访问 - Service Worker 缓存
- ✅ 全屏体验 - Standalone 显示模式
- ✅ 快速加载 - 资源缓存策略

### 安装步骤

**Desktop (Chrome/Edge):**
1. 访问应用 URL
2. 点击地址栏右侧的"安装"图标
3. 确认安装

**Mobile (iOS Safari):**
1. 访问应用 URL
2. 点击分享按钮
3. 选择"添加到主屏幕"

**Mobile (Android Chrome):**
1. 访问应用 URL
2. 点击底部弹出的"安装应用"提示
3. 或点击菜单 > "添加到主屏幕"

## 🔒 隐私与数据

- 所有数据存储在浏览器本地 (localStorage)
- 无需服务器或账号注册
- 数据完全私密，仅您可见
- 支持导出/导入数据备份

## 🛠️ 数据管理

### 导出数据

1. 进入"个人资料"页面
2. 点击"导出所有数据"
3. 保存 JSON 文件

### 导入数据

1. 进入"个人资料"页面
2. 点击"导入数据"
3. 选择之前导出的 JSON 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

Created with ❤️ using Claude

---

**立即开始你的挑战之旅！** 🚀
