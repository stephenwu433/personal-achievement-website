/** 安克详情只记录原型里已经定义并跑通的范围，不把未提供的业务数据写成线上结果。 */

export type AnkerKind = 'defined'

export const ankerLinks = [
  {
    label: '公开演示',
    href: 'https://smart-service-agent-uwrbryeu6vpiwfoumkugyd.streamlit.app/',
    note: '打开后是这套售后 Agent 的原型演示，用来核对事实回退、单步排障、风险中断和人工接管。不是已上线的售后系统。',
  },
  {
    label: '代码仓库',
    href: 'https://github.com/stephenwu433/smart-service-agent',
    note: 'Anker 智能售后 Agent 原型的公开代码，可在 GitHub 查看实现。',
  },
] as const

export const ankerHero = {
  tag: 'ANKER HACKATHON · INTELLIGENT SERVICE · 2026',
  name: 'Anker 智能售后 Agent',
  title: ['让 AI 在用户改口后，', '仍从正确的事实继续排障。'],
  subtitle: '面向复杂消费电子售后场景，设计可追溯事实、单步闭环排障、风险中断与人工接管机制的智能售后 Agent 原型。',
  role: 'AI / 产品负责人',
  roleNote: '场景定义｜产品方案｜验收设计｜路演表达',
  boardLabel: '已定义 · 原型范围',
  stats: [
    { value: '01', label: '明确 MVP 故障场景', note: 'Anker A1289「充不进电」', kind: 'defined' },
    { value: '03', label: '核心产品机制', note: '事实回退｜单步排障｜人工接管', kind: 'defined' },
    { value: '05', label: '系统架构层', note: '交互｜服务集成｜Agent 编排｜AI 与知识｜数据治理', kind: 'defined' },
    { value: '04', label: '系统处理结局', note: '解决｜局部回退｜风险中断｜人工接管', kind: 'defined' },
    { value: '24H', label: '原型开发约束', note: '黑客松开发范围内完成方案与原型设计', kind: 'defined' },
  ] satisfies { value: string; label: string; note: string; kind: AnkerKind }[],
  footnote: '以 1 个明确故障场景、3 个核心机制、4 类处理结局和 5 个验收维度，完成智能售后 Agent 原型闭环。',
}

export const ankerProblem = {
  index: '02',
  kicker: '业务问题 / Why',
  title: '一次“改口”，为什么会让售后 AI 走错？',
  lead: '复杂售后不是一次性问答。',
  paragraphs: [
    '用户经常先给出一个模糊描述，例如“充不进电”；随后才补充设备型号、接口类型、配件情况，或者在执行某一步操作后提供新的观察结果。',
    '如果系统只把新消息继续拼接到聊天记录里，原本建立在旧事实上的判断会被保留，AI 可能继续推荐一条已经不适用的排障路径。',
  ],
  chainLabel: '问题链路',
  chain: ['模糊描述', 'AI 基于不完整信息给出建议', '用户补充 / 更正关键事实', '旧判断仍被沿用', '用户重复沟通，客服难以接管'],
  impactLabel: '问题影响',
  impacts: [
    { title: '用户侧', body: '不知道自己已经做过什么，也不知道下一步建议是否仍然有效。' },
    { title: '客服侧', body: '人工介入后需要重新追问型号、操作记录和观察结果。' },
    { title: '系统侧', body: '无法解释一条建议依赖了哪些事实，也难以修正失效步骤。' },
  ],
}

export const ankerGoals = {
  index: '03',
  kicker: '产品目标 / What to solve',
  title: '把售后对话，变成可追溯的排障过程',
  goals: [
    { index: '01', title: '事实可追溯', body: '用户的型号、接口、配件、操作结果，不能只停留在聊天记录中。' },
    { index: '02', title: '判断可回退', body: '关键事实更正后，只撤回受影响的步骤，保留仍然有效的信息。' },
    { index: '03', title: '建议有依据', body: '每一步排障都应对应知识来源、版本和执行反馈。' },
    { index: '04', title: '风险可停止', body: '遇到安全风险或知识不足时，AI 停止自动排障并无损交接人工。' },
  ],
  close: '这个项目关注的不是“让 AI 多说一点”，而是“让 AI 在不确定时少犯错，并留下可接管的过程”。',
}

export const ankerOverview = {
  index: '04',
  kicker: '方案全景 / Solution Overview',
  title: '从用户输入，到四类处理结局',
  steps: ['用户输入', 'AI 提取事实与反馈', '规则与知识校验', '单步排障', '结果更新', '解决 / 局部回退 / 风险中断 / 人工接管'],
  outcomes: [
    { code: 'RESOLVE', body: '满足结案条件，完成排障。' },
    { code: 'ROLLBACK', body: '事实更正后，只撤回受影响的旧步骤。' },
    { code: 'BLOCK', body: '命中安全风险，立即停止自动处理。' },
    { code: 'HANDOFF', body: '知识不足或持续未解决，生成完整接管包。' },
  ],
}

export const ankerFact = {
  index: '05',
  code: '01 / FACT DEPENDENCY',
  title: '用户更正事实后，系统只回退错误的那一段。',
  sceneLabel: '原型验证场景',
  scene: '用户先说自己使用 C1 接口，随后更正为 C2 接口。',
  columns: [
    { index: 'A', title: '变化发生', body: '用户补充或更正型号、接口、配件、操作方式或观察结果。' },
    { index: 'B', title: '系统判断', body: '识别哪些排障步骤依赖这个事实；仅标记受影响的 Attempt 为失效。' },
    { index: 'C', title: '继续排障', body: '保留仍有效的型号信息、已执行动作和观察记录，从正确节点继续，而不是重新开始整段对话。' },
  ],
  chain: ['自然语言输入', 'LLM 识别补充 / 更正 / 反馈', '结构化事实与版本记录', '事实字段绑定 Attempt', '依赖图分析影响范围', '确定性规则局部撤回', '正确状态继续排障'],
  note: 'LLM 负责理解语言和抽取事实；依赖计算与业务状态变更由规则执行。',
}

export const ankerStep = {
  index: '06',
  code: '02 / ONE-STEP LOOP',
  title: '一次只推进一步，让每个结论都有来源和反馈。',
  sceneLabel: '原型验证场景',
  scene: '用户只知道“充不进电”，现有信息不足以判断具体故障。',
  states: [
    { code: 'ASK', body: '追问影响判断的最小必要信息。' },
    { code: 'GUIDE', body: '根据审核后的知识条目，给出一条当前最合适的测试步骤。' },
    { code: 'RESOLVE', body: '记录是否执行、观察到什么、该步骤是否形成有效结论。' },
  ],
  fieldsLabel: 'Attempt 记录字段',
  fields: ['当前建议动作', '执行状态', '用户观察结果', '本轮结论', '关联 knowledge_id', '知识版本', '来源记录'],
  close: '当缺少可靠知识依据时，系统不继续生成排障建议，转入人工接管流程。',
}

export const ankerRisk = {
  index: '07',
  code: '03 / RISK INTERRUPTION',
  title: '风险出现时，AI 必须先停下来。',
  block: {
    title: 'BLOCK / 安全中断',
    triggerLabel: '触发信号',
    triggers: ['冒烟', '异味', '鼓包', '异常发热'],
    actionLabel: '系统动作',
    actions: ['停止自动排障', '提示停用与断电', '明确禁止拆机', '设置 risk_lock = true', '自动流程无法自行解除'],
  },
  handoff: {
    title: 'HANDOFF / 人工接管',
    triggerLabel: '触发条件',
    triggers: ['缺少可靠知识', '多轮排障未解决', '需要人工进一步判断'],
    packetLabel: '接管包包含',
    packet: ['用户原话', '已确认事实', '已执行操作', '观察结果', '未排除项', '相关知识依据', '建议下一步', '完整审计轨迹'],
  },
  close: '安全规则优先于 LLM 执行。AI 可以协助理解和整理，但不能绕过风险边界。',
}

export const ankerArchitecture = {
  index: '08',
  kicker: '产品架构 / Architecture',
  title: '五层架构，把“会对话”拆成“可治理的系统”',
  layers: [
    { index: '01', name: 'Interaction Layer', body: '消费者端与客服工作台；承接故障描述、多轮反馈和人工接管。' },
    { index: '02', name: 'Service Integration Layer', body: '连接售后业务系统、知识库与服务接口。' },
    { index: '03', name: 'Agent Orchestration Layer', body: 'Case、Attempt、状态机、依赖关系、回退、BLOCK 与 HANDOFF 路由。' },
    { index: '04', name: 'AI & Knowledge Layer', body: '自然语言理解、事实抽取、知识检索、当前状态下的引导生成。' },
    { index: '05', name: 'Data & Governance Layer', body: '事实版本、知识版本、来源记录、审计轨迹、风险规则与权限边界。' },
  ],
  split: [
    { title: 'AI 负责', items: ['理解', '抽取', '检索', '生成'] },
    { title: '规则负责', items: ['状态迁移', '依赖计算', '证据校验', '风险锁定', '结案判断'] },
  ],
}

export const ankerAcceptance = {
  index: '09',
  kicker: '原型验证结果',
  title: '24 小时内，\n完成一套可运行的售后决策闭环',
  board: [
    { value: '01', label: 'MVP 故障场景', note: 'Anker A1289「充不进电」' },
    { value: '03', label: '核心能力验证', note: '事实局部回退｜单步闭环排障｜风险中断接管' },
    { value: '04', label: '系统路由结果', note: '解决｜回退｜BLOCK｜HANDOFF' },
    { value: '05', label: '验收维度', note: '事实｜知识｜状态｜风险｜交接' },
  ],
  paragraphs: [
    '项目围绕复杂售后中“用户改口后，系统如何继续正确排障”完成原型验证。',
    '原型并非只验证 Agent 能否生成回复，而是验证它是否能在关键事实变化、知识依据不足、风险出现与人工接管等情况下，维持一条可追溯、可解释、可中断的排障链路。',
  ],
  columns: ['验证模块', '验证结果'],
  rows: [
    { item: '事实更正', check: '用户将接口信息从 C1 更正为 C2 后，系统识别受影响的排障步骤，并执行局部回退。' },
    { item: '知识依据', check: '每条排障建议关联 knowledge_id、知识版本与来源记录。' },
    { item: '单步闭环', check: '系统按 ASK、GUIDE、RESOLVE 状态推进，分别记录建议动作、执行状态、观察结果与结论。' },
    { item: '风险中断', check: '检测到冒烟、异味、鼓包、异常发热等风险时，系统进入 BLOCK，停止自动排障并锁定风险状态。' },
    { item: '人工交接', check: '进入 HANDOFF 后，系统输出用户原话、确认事实、操作记录、未排除项与下一步建议。' },
  ],
  close: '验证对象不是“AI 是否回答得更长”，而是“售后流程能否在变化与风险中保持正确”。',
}

export const ankerValue = {
  index: '10',
  kicker: '方案价值',
  title: '从聊天式客服，\n走向可管理的售后决策过程',
  cards: [
    {
      title: '用户体验',
      paragraphs: ['用户补充信息后，不需要重新描述整个问题。', '排障建议一次只推进一步，用户知道当前该做什么，也知道这一步为什么出现。'],
    },
    {
      title: '客服协作',
      paragraphs: ['人工介入时，不再从零追问故障经过。', '客服可以直接查看：已确认事实、已执行操作、关联知识、未排除项和推荐下一步。'],
    },
    {
      title: '系统治理',
      paragraphs: ['关键事实具备版本记录；排障步骤具备依赖关系；建议具备知识来源；风险处理具备锁定和审计轨迹。'],
    },
  ],
  summary: [
    { value: '01', text: '个 MVP 故障场景' },
    { value: '03', text: '个核心产品机制' },
    { value: '04', text: '条明确处理路径' },
    { value: '05', text: '个原型验收维度' },
    { value: '24', text: '小时完成方案与原型闭环' },
  ],
  close: '这次项目让我更关注一件事：AI 产品的可靠，不只来自模型是否聪明，也来自产品是否能处理信息变化、流程边界与人的接管。',
}

export const ankerWork = {
  index: '11',
  kicker: '我的工作 / Personal Contribution',
  title: '我在项目中负责什么',
  items: [
    { title: '场景定义', body: '从“用户改口导致排障路径失效”切入，定义 Anker A1289「充不进电」为 MVP 验证场景。' },
    { title: '产品方案', body: '拆解事实管理、单步闭环、风险中断、人工接管四类关键处理机制。' },
    { title: '验收设计', body: '把“系统能回答”转化为可验证条件：事实是否回退、知识是否有依据、风险是否被锁定、人工是否拿到完整接管信息。' },
    { title: '路演表达', body: '将多轮对话、知识检索、规则状态和人工协作，整理为评审能理解的产品流程与系统边界。' },
  ],
  close: '这不是一个追求“自动替代客服”的方案，而是一次关于 AI 如何在复杂、高风险服务场景中更可靠地辅助人完成判断的产品探索。',
}
