# Stephen舞 — 个人网站

打开网站时是一圈可以滚动旋转的照片画廊。四张图分别是个人介绍、实习目录、项目列表和个人能力。画廊后面播放 `public/backgrounds/gallery-background.mp4`。这个文件不在项目里时，页面会停在草地静帧上。

首页没有四个按钮。点对应的照片进入：

- 个人介绍 `/about`：从画廊第一张照片进入全屏六站叙事。第 1 站先停在创意街区静帧，点「开始探索」才播放下一段。五段视频各自独立，播完的 `ended` 事件停在下一站，不会自动连播。文字、按钮和热点都是 HTML。桌面文字卡片在左侧，手机是视频下方的阅读区。减少动态时只切换静帧，不自动播放。
- 实习目录 `/internships`
- 项目列表 `/projects`
- 个人能力 `/skills`：打开后直接是能力页。移动光标时肖像会跟着倾斜，能力从肖像周围散开。首页四张画廊照片也会跟着光标倾斜。

画廊组件在 `components/ui/circular-gallery.tsx`。

## 本地运行

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
npm run preview
```

## 目录

这个项目用 shadcn CLI 初始化（Vite、Tailwind CSS v4、TypeScript）。`components.json` 里的组件别名是 `@/components/ui`，`@` 指向仓库根目录，所以组件放在 `/components/ui`，不要再放到别处。样式在 `src/index.css`，这是 shadcn 写进配置的样式入口。

文案和项目在 `src/content.ts`。个人介绍的六站文案在 `src/about/story.ts`，站点静帧在 `public/city/`。五段视频放在 `public/assets/personal-intro/`：

1. `segment-01-street-to-bookstore.mp4`（创意街区 → 独立书店）
2. `segment-02-bookstore-to-crossing.mp4`（独立书店 → 城市路口）
3. `segment-03-crossing-to-library.mp4`（城市路口 → 图书馆）
4. `segment-04-library-to-life.mp4`（图书馆 → 游戏与购物街区）
5. `segment-05-life-to-riverside.mp4`（游戏与购物街区 → 江边）

## 还需要的素材

把内容发过来之后，会替换掉页面上标着「待补充」的部分。

- 首页画廊背景：把动态背景视频放到 `public/backgrounds/gallery-background.mp4`。没有这个文件时，页面继续显示草地静帧
- 项目列表背景：把循环视频放到 `public/projects/project-gallery-natural-motion-loop.webm`。画面上五个小格子可点，大格子里的人物不是项目入口。项目名称之后再补
- 个人介绍：六张静帧和原文已经放上。五段视频需要放到上面的 `public/assets/personal-intro/` 文件名下，页面会按每段的结束事件停下。联系方式只有公开的 GitHub
- 实习目录：每一段的机构、岗位、起止时间、具体做了什么，以及对应的图片
- 项目展示：封面图。名称和仓库说明已经放上 Planflow、智能售后服务 Agent
- 个人能力：按语言和工程、工具、方向写出的具体条目，以及你想配的图片
