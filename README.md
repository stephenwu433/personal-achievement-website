# AI 产品作品集（匿名公开版）

在线网站：[Netlify 作品集](https://stephenwu-portfolio.netlify.app/)

本仓库与线上网站使用同一份前端源码。首页与个人能力页保留视频和交互，项目详情包含问题、产品机制、验证边界和个人工作。公开版已将姓名、学校、雇主和合作品牌统一改为匿名称呼，具体业务数字不公开；含品牌标识、账号、联系方式或指标的原始截图不放在公开仓库。

## 本地运行

```sh
npm ci
npm run build
npm run dev
```

Netlify 发布目录为 `dist`。修改后运行 `npm run build`，再将同一构建结果发布到 Netlify。不要将客户截图、个人联系方式、内部资料或可追溯业务数据加入 `public/`。
