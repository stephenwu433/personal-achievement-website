/**
 * 公开版只展示内容方向和复盘方法，不披露具体业务数字。
 * 人群名称、预算、达人数量和晋级指标没有逐条落在已执行结果里，页面不补。
 */

export type GrowthSceneId = 'kelifu' | 'sofa' | 'muse'

export type GrowthScene = {
  id: GrowthSceneId
  index: string
  name: string
  title: string
  body: string
  approach: string
  result: string
  action: string
  aside: string
  photo: string
  photoFocus: string
  href: string
  visual: GrowthSceneId
}

export const growthAudienceCount = 7

export const growthChannels = ['KOL/KOC 内容', 'Feeds 放大', 'Search 承接'] as const

export const growthCriteria = ['匹配度', '内容质量'] as const

export const growthHero = {
  title: '增长运营',
  lead: '一次投放的结果，怎样变成下一次可复用的方法？',
  body: '内容获得曝光之后，团队还要判断：它吸引的是不是目标人群，哪种表达值得追加预算，换一个产品时哪些经验能够留下。增长运营的工作，发生在这些选择之间。',
}

export const growthSofaShots = [
  {
    src: '/projects/sofa.webp',
    alt: '压缩沙发账号主页',
    peak: false,
  },
  {
    src: '/projects/sofa.webp',
    alt: '压缩沙发产品内容',
    peak: false,
  },
  {
    src: '/projects/sofa.webp',
    alt: '压缩沙发产品线',
    peak: false,
  },
  {
    src: '/projects/sofa.webp',
    alt: '压缩沙发高表现内容',
    peak: true,
  },
] as const

export const growthSofaReturns = [
  { question: '装柜与运费', script: '画面证明' },
  { question: '回弹与质量', script: '画面证明' },
  { question: '低风险试单', script: '咨询入口' },
  { question: '工厂履约能力', script: '咨询入口' },
] as const

export const growthMusePosts = [
  { src: '/projects/styling.webp', alt: 'AI 穿搭实验场景示意' },
  { src: '/skills/growth.webp', alt: '内容增长场景示意' },
] as const

export const growthScenes: GrowthScene[] = [
  {
    id: 'kelifu',
    index: '01',
    name: '服饰品牌：从爆款投放到可复用的增长模型',
    title: '当一款产品已经能卖，为什么下一款还要重新试错？',
    body: '服饰品牌有产品和价格优势，但用户记住一件好穿的衣服，不等于记住品牌。每次换新款都重新找达人、测内容、买流量，投放可以持续，却很难积累下一次能直接使用的判断。',
    approach:
      '把增长的基本单位从“单篇笔记”换成“人群、内容、达人和投放方式的组合”。先围绕 若干 类目标人群设计不同的内容表达，用较轻的合作测试方向；筛选达人时，看真实上身效果、粉丝匹配与内容质量，而不是只按粉丝量排序。表现好的内容再进入 Feeds 放大，由 Search 承接主动搜索，并结合转化反馈调整下一轮选择。',
    result: '项目投放 ROI 与团队内容产出效率有所改善；具体业务数字已脱敏。',
    action: '查看内容科技企业 B实习经历',
    aside: '内容科技企业 B实习里的服饰品牌模块，保留用户需求、内容结构、审核规则和反馈迭代。',
    photo: '/internships/contentagency.webp',
    photoFocus: '50% 42%',
    href: '/internships?work=contentagency#kelifu',
    visual: 'kelifu',
  },
  {
    id: 'sofa',
    index: '02',
    name: '海外压缩沙发：把视频反馈带回下一条脚本',
    title: '什么样的视频值得继续拍？',
    body: '工厂、产品和压缩过程都可以拍，但不同画面回答的是不同问题。播放较高的内容提示团队哪些展示方式更能吸引注意；评论和私信则提示买家还担心什么。两种反馈要分别使用，不能把播放量直接当成采购意向。',
    approach:
      '用“买家问题、画面证明、咨询入口”组织脚本，再依据播放表现与用户提问调整下一轮选题。账号因此能够在产品展示之外，持续补充运输、回弹、试单和工厂能力等采购信息。',
    result: '',
    action: '查看压缩沙发项目',
    aside: '项目页展示账号截图与脚本原件。',
    photo: '/projects/sofa.webp',
    photoFocus: '40% 30%',
    href: '/projects?work=sofa',
    visual: 'sofa',
  },
  {
    id: 'muse',
    index: '03',
    name: 'AI 穿搭实验：用少量发布寻找内容方向',
    title: 'AI 生成了很多图，用户愿意看哪一种？',
    body: '视觉素材多，不代表内容方向已经成立。AI 穿搭实验 把穿搭问题放进具体场景，编辑封面、风格解释和搭配建议，再用首批发布观察用户是否愿意点击和互动。',
    approach:
      '先测试图文表达，而不是先扩大生成量。浏览和点赞可以帮助判断哪些主题值得继续尝试；它们还不足以证明粉丝留存或商业转化，因此下一轮仍需继续比较选题与封面。',
    result: '',
    action: '查看 AI 穿搭实验',
    aside: '项目页展开视觉素材档案，不在这页铺开全部图片。',
    photo: '/projects/styling.webp',
    photoFocus: '50% 28%',
    href: '/projects?work=muse',
    visual: 'muse',
  },
]

export const growthClose = {
  title: '各有用途，\n也各有不能替代的判断。',
  body: '服饰品牌展示一套跨人群、达人和投放渠道的增长方法；压缩沙发把账号反馈带回脚本；AI 穿搭实验 用小规模发布寻找下一步方向。',
  next: '三个案例的数字分别是投放回报、内容表现和冷启动反馈。',
}
