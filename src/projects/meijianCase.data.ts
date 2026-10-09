/** 梅见详情的数字按类型分开存放，避免把测算或试点目标写成已实现结果。 */

export type EvidenceKind = 'project-fact' | 'human-validation' | 'scenario' | 'pilot'

export type HeroStat = {
  id: string
  kind: EvidenceKind
  display: string
  label: string
  note: string
  count?: { to: number; decimals: number; suffix: string }
}

export const meijianLinks = [
  {
    label: '公开演示',
    href: 'https://meijian-narrative-intelligence.streamlit.app/',
    note: '打开后是冻结语料与 Checkpoint 的回放演示，不在页面里实时调用企业模型或密钥。',
  },
  {
    label: '代码仓库',
    href: 'https://github.com/stylewth/Meijian-Narrative-Intelligence',
    note: '梅见品牌认知演化智能体的公开代码，可在 GitHub 查看这套决策流程的实现。',
  },
] as const

export const meijianHero = {
  title: '梅见品牌认知演化智能体',
  subtitle: '从市场证据到可持续占领的品牌认知',
  background: '梅见已有青梅酒、中式佐餐等品牌基础，但“微醺、独饮、朋友小聚”等泛化场景竞争拥挤，消费者面对不同中国菜时仍缺少清晰的选饮理由。要解决如何从分散的消费者、市场和竞品信息中，找到梅见可以持续占领的具体选择场景。',
  conclusion: '梅见具备优先承接“中国饭选饮”认知的资格，但专属性仍需通过产品、内容、场景与市场验证持续建设。',
  stats: [
    {
      id: 'corpus',
      kind: 'project-fact',
      display: '484 → 419',
      label: '有效语料',
      note: '原始消费者语料经清洗、去重与人工确认后冻结',
    },
    {
      id: 'converge',
      kind: 'project-fact',
      display: '5 → 3 → 1',
      label: '决策收敛',
      note: '五个候选机会收敛为三项核心机制与一个品牌母题',
    },
    {
      id: 'people',
      kind: 'human-validation',
      display: '56 + 51',
      label: '真人验证',
      note: '无品牌提示验证与品牌专属度验证',
    },
    {
      id: 'association',
      kind: 'human-validation',
      display: '67.86%',
      label: '自然联想',
      note: '不揭示品牌时，受访者将该方向联想到梅见',
      count: { to: 67.86, decimals: 2, suffix: '%' },
    },
    {
      id: 'gap',
      kind: 'human-validation',
      display: '78.43%',
      label: '专属度缺口',
      note: '受访者认为竞品仍可完全或部分替代',
      count: { to: 78.43, decimals: 2, suffix: '%' },
    },
    {
      id: 'agents',
      kind: 'project-fact',
      display: '4 个 Agent',
      label: '决策分工',
      note: '筛选、Routing、候选生成、品牌专属度审查',
      count: { to: 4, decimals: 0, suffix: ' 个 Agent' },
    },
  ] satisfies HeroStat[],
}

export const meijianProblem = {
  title: '从“知道梅见”\n到“吃中国饭时会选梅见”',
  paragraphs: [
    '梅见已经具备青梅酒与中式佐餐认知。',
    '但消费者在具体吃饭场景中，仍未形成稳定的选择理由：为什么选、选哪款、买多少。',
    '企业不缺数据与创意，真正缺少的是把多源证据转化为可比较、可反驳、可验证品牌决策的机制。',
  ],
  flow: ['消费者语料 / 品牌事实 / 竞品信息', '选择理由缺口', '品牌方向判断'],
}

export const meijianJudgment = {
  title: 'AI 不直接替品牌写答案',
  body: '同一批市场证据可能支持多个合理方向。好听的表达不等于值得长期经营；若替换品牌名称后仍然成立，就不具备品牌专属度。',
  states: [
    { code: 'PASS', text: '证据充分，可进入验证' },
    { code: 'REVISE', text: '方向有价值，但需要重构' },
    { code: 'DEFER', text: '当前证据不足，需要补证' },
    { code: 'REJECT', text: '关键前提不成立，退出候选池' },
  ],
}

export const meijianSystem = {
  title: '一个编排器、四个 Agent、\n一个人工决策节点',
  steps: [
    '消费者语料 + 品牌与竞品公开事实',
    '确定性编排器',
    '数据筛选 Agent → 证据 Routing Agent → 主决策 Agent → 品牌专属度审查 Agent',
    '人工确认：修订 / 补证 / 验证 / 淘汰',
    'Checkpoint 留痕与市场数据回流',
  ],
  ai: ['证据结构化', '多候选生成', '反例寻找', '验证建议'],
  human: ['规则定义', '战略判断', '资源投入', '最终责任'],
  boundary: '当前 Demo 为冻结数据与 Checkpoint 回放，并通过飞书只读连接呈现结果；不在公开页面实时调用企业模型或密钥。',
}

export const meijianEvolution = {
  title: '五个候选，\n没有直接选“最高分”',
  candidates: ['梅见口味图鉴', '梅见溯源', '双容量双剧本', '官方兑饮比例', '火锅局自主饮酒'],
  checks: ['证据检验', '反模板检查', '竞品替换攻击', '人工确认'],
  kept: [
    { name: '梅见溯源', question: '回答“为什么相信”', role: '品牌事实资产' },
    { name: '口味图鉴', question: '回答“选哪一款”', role: '产品选择工具' },
    { name: '容量适配', question: '回答“买多少合适”', role: '场景消费规则' },
  ],
  theme: '中国饭的青梅酒选饮标准',
  expression: '梅见，中国饭的刚好一杯',
  note: '“刚好一杯”不是独立的品牌战略起点，而是溯源、口味图鉴与容量适配共同兑现后，被消费者感知到的结果。',
}

export const meijianPath = {
  title: '从一顿具体的饭，\n建立稳定的选择记忆',
  stages: [
    { phase: '第一阶段', name: '两个人日常便饭', role: '优先场景' },
    { phase: '第二阶段', name: '三五人重口味小聚', role: '扩展场景' },
    { phase: '第三阶段', name: '中国饭的青梅酒选饮标准', role: '长期认知' },
  ],
  questions: ['为什么选梅见？', '这顿饭选哪款？', '这个人数买多少？'],
  aside: '“一人中餐”仅作为补充观察，不放进主扩张路径。',
}

export const meijianBoundary = {
  title: '项目已经验证什么，\n仍需要验证什么',
  knownTitle: '当前已获得的证据',
  known: [
    { kind: 'human-validation' as const, text: '67.86%：不揭示品牌时，受访者将方向联想到梅见' },
    { kind: 'human-validation' as const, text: '78.43%：竞品仍可完全或部分替代' },
    { kind: 'human-validation' as const, text: '两个人日常便饭是优先验证场景' },
    { kind: 'project-fact' as const, text: '5 个候选已收敛为 3 项可执行机制' },
    { kind: 'project-fact' as const, text: '现阶段证明的是系统可以处理证据、暴露问题并支持品牌决策进入验证' },
  ],
  nextTitle: '下一阶段待验证',
  next: [
    '新方向是否优于泛化的中式佐餐表达',
    '消费者是否因此产生更强的品牌理解与选择行为',
    '口味、来源、容量与菜品规则能否持续降低替代性',
    '企业试点是否带来真实经营价值',
  ],
}

export const meijianScenario = {
  kind: 'scenario' as const,
  label: '情境测算，不是已实现收益',
  title: 'Business Case',
  cost: '6,400 元',
  costName: '单方向最小测试成本',
  basis: '计算口径：2 条素材；单条制作 1,200 元；单条测试投放 2,000 元',
  condition: '只有在系统提前阻断原本会进入测试的低潜方向时，才可能产生避免投入的价值。',
}

export const meijianPilot = {
  kind: 'pilot' as const,
  title: '建议试点目标',
  tag: 'proposed',
  rows: [
    {
      name: '无提示梅见联想率',
      tag: 'pending',
      from: '67.86%',
      mid: '3 个月 72%–75%',
      end: '6 个月 ≥78%',
    },
    {
      name: '竞品替代成立率',
      tag: 'pending',
      from: '78.43%',
      mid: '3 个月 ≤70%',
      end: '6 个月 ≤60%',
    },
  ],
}

export const meijianClose = '这套系统交付的不是一条未经验证的品牌口号，而是一条可追溯、可质疑、可修正，并能进入市场实验的品牌决策链。'
