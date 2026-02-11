# OiaOia Pilates · 体态评估与课程设计

Reformer postural assessment and personalized program design tool.

---

## 🚀 部署方式 Deployment Options

### 方法一：Vercel（推荐，最简单）

1. 注册 [vercel.com](https://vercel.com)（可以用 GitHub 账号登录）
2. 把这个文件夹上传到 GitHub：
   ```bash
   git init
   git add .
   git commit -m "OiaOia Pilates app"
   # 在 GitHub 创建一个新 repo，然后：
   git remote add origin https://github.com/你的用户名/oiaia-pilates.git
   git push -u origin main
   ```
3. 在 Vercel 点 **"New Project"** → 选择你的 GitHub repo → 点 **"Deploy"**
4. 完成！Vercel 会给你一个网址如 `oiaia-pilates.vercel.app`

> 之后每次修改代码 push 到 GitHub，Vercel 会自动重新部署。

### 方法二：Netlify（同样简单）

1. 注册 [netlify.com](https://netlify.com)
2. 先在本地编译：
   ```bash
   npm install
   npm run build
   ```
3. 把生成的 `dist` 文件夹直接拖拽到 Netlify 的部署页面
4. 完成！

### 方法三：自己的服务器

```bash
npm install
npm run build
# 把 dist/ 文件夹的内容放到你的 nginx/apache 服务器
```

---

## 💻 本地开发 Local Development

```bash
npm install        # 安装依赖
npm run dev        # 启动开发服务器 (localhost:5173)
npm run build      # 打包生产版本 → dist/
npm run preview    # 预览打包结果
```

---

## 🌐 绑定自定义域名 Custom Domain

在 Vercel 或 Netlify 后台的 **Settings → Domains** 中：
1. 添加你的域名（如 `pilates.oiaoia.com`）
2. 在你的 DNS 服务商添加 CNAME 记录指向 Vercel/Netlify 提供的地址
3. HTTPS 会自动配置

---

## 📁 文件结构

```
oiaia-pilates/
├── index.html              # HTML 入口
├── package.json            # 依赖配置
├── vite.config.js          # Vite 构建配置
└── src/
    ├── main.jsx            # React 入口
    └── pilates-system.jsx  # 主应用组件 (所有功能)
```
