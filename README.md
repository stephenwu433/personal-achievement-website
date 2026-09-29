# Stephen舞 — 个人网站

打开网站时是一圈可以滚动旋转的照片画廊。四张图分别是个人介绍、实习目录、项目列表和个人能力。画廊后面是整张草地放风筝的照片，cover 之后人物在右侧、风筝在左上；草浪、云和风筝线叠在画面上缓慢动，鼠标或触摸会改变风向。

首页没有四个按钮。点对应的照片进入：

- 个人介绍 `/about`：同一座城市、同一个傍晚的六站。画面停在固定机位的关键帧上，点场景里的物件或同名按钮阅读；桌面是左侧抽屉，手机是底部面板。真正的人物视频还没有，页面不会用静图淡入淡出冒充动作。之后可以把 `public/city/clip-01.mp4` 到 `clip-06.mp4`（或同名 webm）放进来，每站会先播完再停下。
- 实习目录 `/internships`
- 项目列表 `/projects`
- 个人能力 `/skills`

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

文案和项目在 `src/content.ts`。个人介绍的六站文案在 `src/about/story.ts`，关键帧在 `public/city/`。

## 还需要的素材

把内容发过来之后，会替换掉页面上标着「待补充」的部分。

- 个人介绍：六站文案已经放上。联系方式只有公开的 GitHub
- 实习目录：每一段的机构、岗位、起止时间、具体做了什么，以及对应的图片
- 项目展示：封面图。名称和仓库说明已经放上 Planflow、智能售后服务 Agent
- 个人能力：按语言和工程、工具、方向写出的具体条目，以及你想配的图片
