# 禹尧珅 · SHEN-OS — 极客风个人主页

一个单页极客风个人网站：three.js 3D 粒子星链 + GSAP 滚动动效 + Lenis 平滑滚动，
动效风格对标 Apple 官网（缓动、视差、模糊揭示），世界观是"一台正在运行的机器"。

## 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 开发模式  http://localhost:5173
npm run build      # 生产构建 → dist/
npm run preview    # 预览构建产物  http://localhost:4173
```

## 功能总览

| 功能 | 说明 |
| --- | --- |
| 🌐 中英双语 | 右上角 中/EN 一键切换，全站内容（研究/项目/荣誉/日志）跟随切换，记忆在 localStorage |
| ⌨️ Ctrl+K 命令面板 | 搜项目/论文/区块/操作，↑↓ 选择、↵ 执行、esc 关闭 |
| 🖼 项目详情弹窗 | 点任意项目卡片弹出大图 + 详情 + 链接，Esc 关闭 |
| 📋 BibTeX 复制 | 研究卡片「引用 BibTeX」一键复制到剪贴板（带降级方案） |
| 📜 CHANGELOG | `git log --oneline --life` 风格的人生更新日志 |
| 📶 PWA | manifest + Service Worker，可加到主屏幕、静态资源离线缓存 |
| 💥 404 彩蛋 | SEGMENTATION FAULT 风格崩溃页（`public/404.html`） |
| 🔍 SEO | sitemap.xml + robots.txt + JSON-LD Person 结构化数据 |
| ⚡ 性能 | 图片全量 WebP（6.67MB→1.13MB）、three.js 独立 chunk 懒加载 |
| ♿ 无障碍 | 键盘焦点描边、弹窗 aria-modal、prefers-reduced-motion 降级 |

## 技术栈

- **Vite 5** — 构建
- **three.js** — Hero 神经星链球体（1500 粒子 + 连线 + 星野）、联络区线框晶格体（懒加载）
- **GSAP + ScrollTrigger** — 滚动揭示、视差、模糊入场
- **Lenis** — 惯性平滑滚动
- **@fontsource**（JetBrains Mono / Space Grotesk / Noto Sans SC）— 本地字体，离线可用

## 目录结构

```
├── index.html              # 页面骨架
├── public/
│   ├── 404.html            # SEGMENTATION FAULT 崩溃页
│   ├── manifest.webmanifest
│   ├── sw.js               # Service Worker（离线缓存）
│   ├── sitemap.xml / robots.txt
│   └── assets/             # WebP 素材 / CV PDF / PWA 图标
├── src/
│   ├── data.js             # ★ 全部内容（中英双语）：资料/研究/项目/时间线/荣誉/更新日志
│   ├── main.js             # 入口：双语渲染引擎 + 滚动动效 + 面板/弹窗/Toast
│   ├── style.css           # 样式入口
│   ├── styles/             # base / hero / sections / projects / journey-contact / features
│   ├── three/              # heroScene / contactScene（懒加载）
│   └── anim/               # boot 启动序列 / cursor 光标 / interact 磁吸+倾斜
└── scripts/
    ├── shots-v3.mjs / shots-v4.mjs   # 视觉回归测试（puppeteer 驱动 Edge）
    ├── optimize-images.mjs           # PNG/JPG → WebP（质量 82，≤1600px）
    └── ...
```

## 修改内容

所有文案、项目、论文、荣誉、更新日志都在 **`src/data.js`**：
- 中文直接改主字段；英文改各项的 `en: {...}` 子对象
- 新增项目：往 `PROJECTS` 数组加一条，精选则把 id 加进 `FEATURED_ORDER`
- 新增人生版本：往 `CHANGELOG` 加一条

## 部署注意

- `sitemap.xml` / `robots.txt` / JSON-LD 里的域名当前是 `https://shen-intro.de5.net/`，**换域名记得同步改这三处**
- `404.html` 依赖主机支持（GitHub Pages / Netlify 原生支持；Vercel 需在配置里指定）
- Service Worker 仅在 HTTPS 环境注册

## 实用开关

- `?static=1` — 静态预览：跳过启动与揭示动画（等价 `prefers-reduced-motion` 降级）
- 控制台 `__shen.heroScene` / `__shen.contactScene` — 3D 场景调试句柄
- 启动屏点击任意处跳过；Ctrl+K / Cmd+K 命令面板

## 设计概念

把个人主页做成一台「正在运行的机器」：启动屏是开机自检，区块是系统模块
（SYS.01 关于 … SYS.06 联络），磷光绿 `#3dff88` 终端配色 + Apple 式的克制排版。
`while (alive) { learn(); build(); share(); }`
