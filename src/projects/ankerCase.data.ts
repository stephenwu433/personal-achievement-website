/** 安克详情把方案范围、预期价值和待验证项分开，避免把原型能力写成业务结果。 */

export type AnkerKind = 'scope' | 'expected' | 'pending'

export const ankerMeta = {
  name: 'Anker 智能售后 Agent',
  subtitle: '让 AI 在用户更正信息后，仍能沿着正确事实继续排障',
  summary:
    '面向复杂售后中“用户一改口，AI 就沿着错误路径继续排障”的问题，设计以事实依赖追踪、局部回退、风险中断和人工接管为核心的智能售后 Agent 原型。',
  role: 'AI / 产品负责人',
  roleNote: '负责场景定义、产品方案、验收设计与路演。',
  type: 'Anker 首届黑客松｜智能服务赛道｜24 小时原型方案',
}

export const ankerHero = {
  lines: ['AN KER', 'INTELLIGENT', 'AFTER-SALES AGENT'],
  paragraphs: [
    '当用户在多轮对话中补充型号、改正接口、反馈新的操作结果时，售后 AI 不应继续沿用失效的判断。',
    '这个项目尝试让 Agent 把“用户说过什么”变成可追溯的事实，把“系统为什么给出这一步建议”变成可检查的过程。',
  ],
  scopeLabel: '方案范围',
  stats: [
    { value: '1', label: '明确 MVP 场景', note: 'Anker A1289「充不进电」', kind: 'scope' },
    { value: '3', label: '核心机制', note: '局部回退｜单步排障｜风险接管', kind: 'scope' },
    { value: '5', label: '系统架构层', note: '交互｜服务集成｜Agent 编排｜AI 与知识｜数据治理', kind: 'scope' },
    { value: '4', label: '处理结局', note: '解决｜局部回退｜风险中断｜人工接管', kind: 'scope' },
  ] satisfies { value: string; label: string; note: string; kind: AnkerKind }[],
  footnoteEn: 'Prototype scope · Hackathon concept',
  footnoteZh: '业务效果与实际效率需在真实售后环境中继续验证',
}

export const ankerProblem = {
  title: '复杂售后，不是一次问答就能解决的问题',
  paragraphs: [
    '消费电子售后中，用户往往无法一开始准确描述故障。他们可能先说“充不进电”，随后补充设备型号、充电接口、配件情况，也可能在执行操作后给出新的观察结果。',
    '如果系统只把每句话当作独立输入，就会在关键事实变更后继续沿着旧路径排障。这不仅会让用户重复沟通，也会让客服难以判断：哪些信息已经确认、哪些操作已经做过、下一步应该如何继续。',
  ],
  usual: {
    label: '普通对话式客服',
    steps: ['用户更正信息', '原有建议仍被沿用', '排障链路混乱'],
  },
  proposed: {
    label: '本项目方案',
    steps: ['用户更正信息', '定位受影响步骤', '仅撤回失效判断', '从正确节点继续'],
  },
}

export const ankerJudgment = {
  title: '先管理事实，再生成回复',
  cards: [
    {
      index: '01',
      title: '事实不是聊天记录',
      body: '用户的型号、接口、配件、操作结果，需要被记录为结构化事实，而不是散落在聊天历史中。',
    },
    {
      index: '02',
      title: 'AI 不应直接改写业务状态',
      body: 'LLM 用于理解口语、识别补充或更正、抽取事实；依赖计算、状态更新和风险判断由规则系统执行。',
    },
    {
      index: '03',
      title: '售后 Agent 必须知道何时停止',
      body: '遇到安全风险、缺少可靠知识或持续无法解决时，系统应该停止自动排障，并提供完整上下文给人工接管。',
    },
  ],
}

export const ankerFlow = {
  title: '从一句模糊描述，到可接管的排障过程',
  steps: [
    { id: 'input', text: '用户输入', phase: null },
    { id: 'extract', text: 'AI 提取事实与反馈', phase: 0 },
    { id: 'check', text: '规则与知识校验', phase: 1 },
    { id: 'step', text: '单步排障', phase: 2 },
    { id: 'update', text: '结果更新', phase: null },
    { id: 'route', text: '解决｜局部回退｜风险中断｜人工接管', phase: 3 },
  ],
  marks: ['事实提取', '知识校验', '单步排障', '四类路由'],
  layers: [
    { index: '01', name: 'Interaction', note: '消费者端、客服工作台与多轮对话交互' },
    { index: '02', name: 'Service Integration', note: '售后系统、知识来源与服务接口衔接' },
    { index: '03', name: 'Agent Orchestration', note: 'Case、Attempt、状态机、依赖关系与路由' },
    { index: '04', name: 'AI & Knowledge', note: '自然语言理解、事实抽取、知识检索与引导生成' },
    { index: '05', name: 'Data & Governance', note: '版本记录、审计轨迹、证据来源与风险控制' },
  ],
}

export const ankerFeatures = [
  {
    id: 'rollback',
    index: '01',
    title: '事实依赖排障与局部回退',
    scene: '用户起初说自己使用 C1 接口，随后更正为 C2 接口。如果接口是某个排障步骤的前提，系统需要识别哪些判断因此失效；但已经确认的型号、已完成的操作和有效观察结果仍应保留。',
    columns: [
      { title: '用户发生了什么', body: '用户补充或更正型号、接口、配件、操作结果等关键信息。' },
      { title: '系统做了什么', body: '记录每个排障步骤依赖的事实；事实变化后，识别受影响步骤，只撤回失效部分。' },
      {
        title: '产品机制',
        body: 'LLM 将自然语言转换为结构化事实和更正事件；依赖图绑定事实字段与 Attempt 记录；确定性规则完成影响分析、局部撤回和状态更新；每次变更保留版本与审计记录。',
      },
    ],
    diagram: {
      before: 'C1 接口',
      after: 'C2 接口',
      drop: '依赖该接口的判断撤回',
      keep: ['已确认型号', '已完成操作', '有效观察结果'],
    },
    close: '让系统修正错误路径，而不是让用户重新开始描述问题。',
  },
  {
    id: 'step',
    index: '02',
    title: '有依据的单步闭环排障',
    scene: '当用户只知道“充不进电”，一次性给出多项建议会造成反馈缺失，也无法判断真正有效的是哪一步。',
    states: [
      { name: 'ASK', note: '先追问影响判断的最小必要信息' },
      { name: 'GUIDE', note: '基于已审核知识，给出一条当前最合适的测试步骤' },
      { name: 'RESOLVE', note: '记录用户是否执行、观察到什么、下一步是否成立' },
    ],
    rules: [
      '检索经审核的知识条目，并保留 knowledge_id、版本与来源',
      'Attempt 单独记录建议动作、执行状态、观察结果与结论',
      '缺少可靠依据时不继续生成排障建议，转交人工',
      'AI 负责理解模糊描述、抽取缺失信息、匹配知识和生成引导',
      '状态迁移、证据校验与结案条件由规则约束',
    ],
    close: '每一步都应该能回答：为什么建议这一步，用户是否真的做过，结果是什么。',
  },
  {
    id: 'handoff',
    index: '03',
    title: '风险中断与可接管人工升级',
    scene: '用户出现冒烟、异味、鼓包、异常发热等风险信号；或系统缺少可靠知识、连续排障仍未解决。',
    block: {
      title: '安全风险 BLOCK',
      triggers: ['冒烟', '异味', '鼓包', '异常发热'],
      actions: ['立即停止自动排障', '提示停用、断电、禁止拆机', '设置 risk_lock=true', '自动流程不可自行解除'],
    },
    handoff: {
      title: '普通未解决 HANDOFF',
      triggers: ['知识不足', '多轮排障无结果', '需要人工判断'],
      packet: ['用户原话', '已确认事实', '已执行操作', '未排除项', '引用的知识依据', '建议下一步', '审计轨迹'],
    },
    close: 'AI 的边界不只是“答不出来”，还包括“此刻不应该继续自动处理”。',
  },
] as const

export const ankerValue = {
  title: '预期价值，需要在真实售后场景中验证',
  tag: '预期价值 / 待真实业务验证',
  items: [
    {
      title: '对用户',
      kind: 'expected' as const,
      body: '减少因信息更正导致的重复沟通，让排障过程更连贯、更可理解。',
    },
    {
      title: '对客服',
      kind: 'expected' as const,
      body: '人工接手时无需重新追问基础信息，可直接查看已确认事实、已执行步骤和未解决问题。',
    },
    {
      title: '对系统治理',
      kind: 'expected' as const,
      body: '通过知识来源、版本记录、事实依赖和审计轨迹，让 AI 输出具备更清晰的可解释性与复盘基础。',
    },
  ],
  boundary: {
    title: '当前状态',
    state: '黑客松方案与原型范围',
    definedLabel: '已定义',
    defined: 'MVP 场景、状态机制、事实依赖、风险拦截、人工接管结构',
    pendingLabel: '尚待验证',
    pending: '真实用户完成率、人工接管效率、知识命中质量、业务节省效果',
    pendingKind: 'pending' as const,
  },
}
