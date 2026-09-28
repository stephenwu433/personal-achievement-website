# Stephen舞 — 个人网站

打开网站时是一圈可以滚动旋转的照片画廊。四张图分别是个人介绍、实习目录、项目列表和个人能力。画廊后面是整张草地放风筝的照片，cover 之后人物在右侧、风筝在左上；草浪、云和风筝线叠在画面上缓慢动，鼠标或触摸会改变风向。

首页没有四个按钮。点对应的照片进入：

- 个人介绍 `/about`
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

文案和项目在 `src/content.ts`。个人介绍的肖像是 `public/photos/about.jpg`。

## 还需要的素材

把内容发过来之后，会替换掉页面上标着「待补充」的部分。

- 个人介绍：一句自我介绍、一段更完整的话、想公开的联系方式。肖像已经用上你发来的第一张照片
- 实习目录：每一段的机构、岗位、起止时间、具体做了什么，以及对应的图片
- 项目展示：封面图。名称和仓库说明已经放上 Planflow、智能售后服务 Agent
- 个人能力：按语言和工程、工具、方向写出的具体条目，以及你想配的图片
