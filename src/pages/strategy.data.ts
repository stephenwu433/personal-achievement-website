export type StrategyPieceId = 'beauty' | 'hr' | 'planflow'

export type StrategyScene = {
  pieceId: StrategyPieceId
  index: string
  name: string
  title: string
  body: string
  choice: string
  turn: string
  kind: '需求范围' | '离线对照结果' | '产品结构'
  caption: string
  detail: string
  action: string
  aside: string
  photo: string
  photoFocus: string
  visual: 'layers' | 'compare' | 'loop'
}

export const strategyHero = {
  title: '产品策略',
  lead: '把好点子，收敛成必须做对的第一步。',
  body: '产品有很多看似合理的功能，但第一版不能同时兑现所有承诺。先确定服务范围、谁保留决定权，以及用户为什么会持续使用，功能才有清晰的先后顺序。',
}

export const strategyLayers = {
  total: 18,
  p0: 12,
  p1: 6,
}

// 18 core requirements: 12 P0 and 6 P1. The card names what that first service has to hold.
export const strategyHolds = ['记住失败尝试', '一次一个下一步', '证据不足就停', '该停止就停止'] as const

export const strategyCompare = {
  baseline: 43,
  generic: 23,
  full: 28,
  genericLabel: '通用 AI 加同一 Rubric',
  fullLabel: '完整系统',
  scope: '同一标准，前 若干 个复核名额',
}

export const strategyLoop = ['团队', '成员', '项目', '排期', '任务', '日报'] as const

export const strategyScenes: StrategyScene[] = [
  {
    pieceId: 'beauty',
    index: '01',
    name: '美妆品牌数据共情智能服务系统',
    title: 'AI 美妆管家，第一版该回答所有问题吗？',
    body: '商品推荐、使用咨询和售后排查都可以装进“AI 管家”的愿景。但入口越宽，越难判断产品究竟有没有把一次服务做好。',
    choice: '从“底妆搓泥，且用户已有失败尝试”这一非医疗场景开始。它足够具体：如果系统忘记用户试过什么、反复推荐无效方法，或者无法判断何时交给人工，一次服务是否有效就能被看见。',
    turn: '项目不再按“能回答多少类问题”排列功能，而围绕一次服务能否从求助走到结果确认，确定第一版的需求顺序。',
    kind: '需求范围',
    caption: '第一版需求范围与优先级',
    detail: '若干 项核心需求：若干 项 P0、若干 项 P1。',
    action: '查看美妆品牌项目',
    aside: '项目页再展开服务机制、状态切换和验收用例。',
    photo: '/projects/beauty.webp',
    photoFocus: '40% 28%',
    visual: 'layers',
  },
  {
    pieceId: 'hr',
    index: '02',
    name: '岗证匹配',
    title: '招聘 AI 应该替 HR 选人，还是帮 HR 避免漏看？',
    body: '直接给候选人一个匹配分很容易理解，却可能把“没有标准职位名称”或“简历没有写全”，当成“不具备岗位能力”。',
    choice: '产品承诺不是自动决定录用，而是在有限的复核名额内，把有相关任务证据、原流程却可能漏掉的人送回 HR 视野。用人经理确认招聘标准，系统关联原文证据，HR 决定是否继续面试。',
    turn: '评价重点从“分数像不像人工判断”，转向“同样的复核名额里，能否多找回值得面试的人，同时减少错误推荐”。',
    kind: '离线对照结果',
    caption: '若干 份候选人样本的离线对照，并非企业录用结果。',
    detail: '',
    action: '查看 HR 招聘项目',
    aside: '项目页再展示标准、证据链、对照实验与人工复核细节。',
    photo: '/projects/hr.webp',
    photoFocus: '50% 42%',
    visual: 'compare',
  },
  {
    pieceId: 'planflow',
    index: '03',
    name: 'PlanFlow',
    title: '一份 AI 排期，为什么撑不起团队协作？',
    body: '生成一张五阶段计划可以让项目快速开始。但成员任务、日报和阻塞如果没有回到原计划，排期很快就会变成一张过时的时间表。',
    choice: '不把“生成得快”当作产品的终点。AI 提供排期初稿，负责人依据资源调整；成员每天的任务与反馈继续留在同一个项目里，让计划随着执行更新。',
    turn: '产品从单次使用的排期工具，转向团队持续使用的协作流。排期是入口，后续更新才让它保持价值。',
    kind: '产品结构',
    caption: '产品结构',
    detail: '',
    action: '查看 PlanFlow 项目',
    aside: '项目页再讲五阶段排期、任务与日报如何落到产品中。',
    photo: '/projects/planflow.webp',
    photoFocus: '50% 40%',
    visual: 'loop',
  },
]

export const strategyClose = {
  title: '策略不是把产品做小，而是让第一步有明确承诺。',
  body: '美妆品牌选择先做深一次服务；岗证匹配选择帮助人看见证据，而不替人作录用决定；PlanFlow 选择让计划进入每天的协作，而不止停在生成瞬间。',
  next: '这些选择决定了产品第一版要交付什么，也决定了下一步该根据什么继续扩展。',
}
