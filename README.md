# Stephen舞 — 个人网站

首页是一圈会转的 3D 画廊。页首有四个入口，点进去是各自独立的介绍页：

- 个人介绍 `/about`
- 实习目录 `/internships`
- 项目展示 `/projects`
- 个人能力 `/skills`

滚动首页时画廊跟着转；停下之后会缓慢自转。组件在 `components/ui/circular-gallery.tsx`。

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

文案、项目和首页图片都在 `src/content.ts`。

## 还需要的素材

把内容发过来之后，会替换掉页面上标着「待补充」的部分。

- 个人介绍：一句自我介绍、一段更完整的话、想公开的联系方式、一张清晰肖像
- 实习目录：每一段的机构、岗位、起止时间、具体做了什么
- 项目展示：名称、一句说明、你的角色、链接、封面图。已挂上公开仓库 Planflow 和智能售后服务 Agent
- 个人能力：按语言和工程、工具、方向分组的条目
- 首页：如果要换掉现在的临时配图，给四张封面，或说明直接用上面的照片
