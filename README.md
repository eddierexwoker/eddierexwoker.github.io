# 闻天翔 · Robotics Portfolio

纯静态机器人项目作品集，无需构建工具或第三方依赖。

## 本地预览

在当前目录启动支持视频字节范围请求的预览服务器：

```bash
python serve.py
```

然后访问 `http://localhost:8000/`。请不要使用 `python -m http.server`：它不会响应 HTTP Range 请求，长视频的进度条无法立即跳转。

## 发布到 GitHub Pages

1. 在 GitHub 创建公开仓库 `eddierexwoker.github.io`。
2. 在本目录初始化并推送：

```bash
git init -b main
git add .
git commit -m "Add robotics portfolio"
git remote add origin https://github.com/eddierexwoker/eddierexwoker.github.io.git
git push -u origin main
```

3. 在仓库 `Settings → Pages` 中选择 `Deploy from a branch`，分支设为 `main`、目录设为 `/(root)`。

## 内容结构

- `index.html`：全部页面内容与项目叙事
- `assets/css/styles.css`：桌面端及移动端视觉样式
- `assets/js/main.js`：导航、滚动动画、视频互斥播放与架构图放大
- `assets/figures/`：从 HolisticVLA 论文原页提取的两张架构图
- `media/`：四个经过网页压缩的 H.264 项目视频
- `docs/`：公开简历

## 发布前提醒

HolisticVLA 原 PDF 带有 `CONFIDENTIAL / For review only` 标记，因此发布目录只保留用户指定的两张核心架构图，没有放入完整论文 PDF。正式公开前，请确认论文投稿规定允许公开这些架构图。
