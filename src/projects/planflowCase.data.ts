/** PlanFlow 只记录已定义的协作机制，以及标明口径的管理效益测算。 */

export const planflowLinks = [
  {
    label: '线上产品',
    href: 'https://ban-weld.vercel.app',
    note: '打开后是 PlanFlow 的线上协作产品，可以进入团队、项目、排期、任务和日报。未配置模型时，系统不会伪造 AI 排期结论。',
  },
  {
    label: '代码仓库',
    href: 'https://github.com/stephenwu433/planflow-app',
    note: 'PlanFlow 的公开代码，可在 GitHub 查看团队、项目、排期、任务和日报的实现。',
  },
] as const

export const planflowHero = {
  english: 'AI PROJECT ORCHESTRATION',
  mark: ['PLAN', 'FLOW'],
  title: ['让团队计划，', '进入每天真实的推进过程。'],
  body: '从项目目标、AI 排期、成员任务到日报更新，PlanFlow 让团队在同一条时间线上协作。',
  positioning: '面向 5 人左右小型项目团队的项目协作系统。通过团队、项目、成员邀请、AI 排期、任务、日报与日历，将项目管理从分散同步收敛为持续更新的协作流。',
  stats: [
    { value: '05', label: 'AI 排期阶段', note: '根据项目目标、需求与周期生成项目初稿' },
    { value: '05 人', label: '典型项目团队规模', note: '用于管理效益测算' },
    { value: '06', label: '核心协作动作', note: '团队｜成员｜项目｜排期｜任务｜日报' },
    { value: '03', label: '项目管理层级', note: '团队 → 项目 → 任务与日报' },
  ],
  stack: ['NEXT.JS', 'FASTAPI', 'NEON', 'CLERK', 'AI SCHEDULING'],
}

export const planflowProblem = {
  index: '02',
  kicker: '业务问题',
  title: '项目没有失控，\n只是信息散在了不同地方。',
  paragraphs: [
    '小团队推进项目时，目标写在文档里，任务散在聊天记录和表格中，成员进度依赖负责人反复询问，项目延期后也很难判断问题来自需求变化、任务依赖还是资源冲突。',
    'PlanFlow 将团队、成员、项目、排期、任务与日报放到同一套项目上下文中，让每一次更新都能影响项目下一步安排。',
  ],
  cards: [
    { title: '计划断裂', body: '目标、需求、任务和日期没有稳定的拆解关系。' },
    { title: '状态不同步', body: '成员完成任务后，负责人仍需跨工具收集进度。' },
    { title: '风险滞后', body: '延期、资源冲突和无人负责的任务，往往在最后才暴露。' },
  ],
}

export const planflowLoop = {
  index: '03',
  kicker: '产品闭环',
  title: '从一句项目目标，\n到一套可执行的团队节奏。',
  steps: [
    '创建团队',
    '邀请成员',
    '建立项目',
    '填写项目目标、需求与起止时间',
    'AI 分析并生成五阶段排期',
    '阶段拆分为每日任务',
    '成员更新日报与进度',
    '负责人查看日历、风险与下一步安排',
  ],
  notes: [
    { name: '团队', body: '成员关系、权限和邀请链接。' },
    { name: '项目', body: '目标、需求、状态、开始与结束日期。' },
    { name: 'AI 排期', body: '五阶段工作项与阶段化推进建议。' },
    { name: '任务', body: '负责人、截止时间、状态与完成记录。' },
    { name: '日报', body: '完成内容、投入工时、阻塞问题与下一步计划。' },
  ],
}

export const planflowSchedule = {
  index: '04',
  kicker: '核心功能 / 01 AI 排期',
  title: '让项目从“空白表格”，\n变成一份可以讨论的计划初稿。',
  body: '负责人填写项目目标、需求和计划周期后，系统生成五阶段排期，并给出 AI 分析结论。',
  phases: [
    { index: '01', name: '目标与需求对齐' },
    { index: '02', name: '方案与任务拆解' },
    { index: '03', name: '核心执行与联调' },
    { index: '04', name: '测试、修复与优化' },
    { index: '05', name: '交付、复盘与归档' },
  ],
  close: 'AI 生成的是项目初稿；负责人结合真实资源、优先级和项目风险完成调整。',
}

export const planflowTeam = {
  kicker: '02 团队协作',
  title: '成员状态，\n应回到项目本身。',
  body: '团队可以创建项目、邀请成员、分配任务、记录日报，并在项目页和日历视图中查看推进状态。',
  tags: ['团队成员', '项目状态', '任务分配', '项目日历', '邀请链接', '日报记录'],
}

export const planflowDaily = {
  kicker: '03 每日更新',
  title: '排期只有持续更新，\n才真正有管理价值。',
  cycle: ['项目排期', '每日任务', '成员日报', '阻塞与风险', '负责人调整', '更新项目节奏'],
  fields: ['今日完成', '投入工时', '当前阻塞', '明日计划', '协作需求'],
}

export const planflowValue = {
  index: '05',
  kicker: '管理效益测算',
  title: '减少的不是“做项目的时间”，\n而是反复同步和手工汇总的时间。',
  basis: '基于 5 人、8 周项目组的管理效益测算。',
  stats: [
    { value: '05 人', label: '典型项目协作规模' },
    { value: '02 次 / 周', label: '减少全员重复进度同步' },
    { value: '30 分钟', label: '单次同步会平均占用时间' },
    { value: '40 人时', label: '8 周周期内释放的团队协作时间' },
    { value: '16 小时', label: '8 周内负责人减少的任务、日报与排期手工汇总时间' },
  ],
  formulas: [
    {
      name: '全员同步时间',
      lines: ['5 人', '× 每周 2 次重复进度同步', '× 每次 30 分钟', '× 8 周'],
      result: '40 人时',
    },
    {
      name: '负责人管理整理时间',
      lines: ['每周减少约 2 小时', '× 8 周'],
      result: '16 小时',
    },
  ],
  values: [
    { title: '管理效率', body: '负责人从反复追问和整理信息中释放出来，将时间投入资源协调、风险判断和优先级决策。' },
    { title: '协作效率', body: '成员不必在聊天、表格和会议中重复确认项目状态，任务和日报直接成为项目推进记录。' },
    { title: '交付风险', body: '统一排期与日历让团队更早发现延期、资源冲突、依赖阻塞和无人负责的任务。' },
  ],
  note: '本区数据为基于 5 人、8 周团队项目的业务测算模型；实际收益随团队规模、项目复杂度和使用频率变化。',
}

export const planflowArchitecture = {
  index: '06',
  kicker: '技术架构',
  title: '从登录到排期，\n形成可部署的团队协作链路。',
  layers: [
    { name: 'Next.js 前端', body: '团队｜项目｜任务｜日历｜日报｜成员邀请' },
    { name: 'FastAPI 后端', body: '权限校验｜项目管理｜AI 排期｜任务与日报接口' },
    { name: 'Neon 数据库', body: '用户｜团队｜成员关系｜项目与排期数据' },
    { name: 'Clerk', body: '登录、身份与会话管理' },
  ],
  note: '配置模型 API 后，AI 根据项目目标、需求和计划周期生成五阶段排期。未配置模型时，系统不伪造 AI 分析结果。',
}

export const planflowWork = {
  index: '07',
  kicker: '我的工作',
  title: '我希望解决的，\n是团队如何持续保持同一个项目节奏。',
  items: [
    { title: '产品定义', body: '将项目协作收敛为团队、项目、排期、任务、日报五个连续动作。' },
    { title: 'AI 排期', body: '设计“目标 + 需求 + 周期”到“五阶段排期初稿”的生成路径。' },
    { title: '协作机制', body: '设计成员邀请、任务推进、日历查看和日报更新之间的关系。' },
    { title: '系统落地', body: '完成 Next.js、FastAPI、Neon、Clerk 的可部署协作架构。' },
  ],
  close: 'PlanFlow 不只是生成任务列表。它让团队在每一次需求变化、任务完成和日报更新后，都能知道项目现在在哪里，以及下一步该一起解决什么。',
}
