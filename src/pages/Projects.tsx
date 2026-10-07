import { useEffect, useState, type ReactNode } from 'react'
import SiteHeader from '@/src/components/SiteHeader'

type SourceKind = '用户反馈' | '本地测试' | '项目复盘' | '设计产物' | '待补证'
type ProjectStatus = '公开案例' | '可运行原型' | '产品设计阶段' | '增长项目' | '概念验证'
type EvidenceKind = '流程图' | '原型' | '规则 / Brief' | '测试或复盘'

type Evidence = {
  kind: EvidenceKind
  title: string
  lines: string[]
  source: SourceKind
}

type ProjectCase = {
  id: string
  index: string
  name: string
  tag: string
  line: string
  image: string
  status: ProjectStatus
  scene: string[]
  judgment: string[]
  mechanism: string[]
  evidence: Evidence[]
  state: string[]
  takeaway: string
}

const serif = '"LXGW WenKai", "Iowan Old Style", Palatino, "Palatino Linotype", "Songti SC", serif'

const cases: ProjectCase[] = [
  {
    id: 'meijian',
    index: '01',
    name: '梅见品牌证据决策系统',
    tag: 'BRAND DECISION SYSTEM / TOP 40',
    line: '为品牌研究与方向选择设计一套“证据—候选方向—反例攻击—人工决策—验证反馈”的可审计工作流。',
    image: '/projects/meijian.png',
    status: '公开案例',
    scene: [
      '品牌策略讨论容易停留在主观判断。研究材料很多，但证据从哪里来、候选方向如何被比较、为什么淘汰某个方向，往往无法追溯。',
    ],
    judgment: [
      'AI 不应该直接替代品牌决策。',
      '更重要的是让它帮助整理证据、生成候选、提出反例；关键选择、修改和责任仍由人完成。',
    ],
    mechanism: [
      '汇集研究材料并结构化整理。',
      '生成品牌方向候选。',
      '通过竞争替代、证据充分性、产品承接等压力测试。',
      '使用 Gold、Challenge、Holdout 区分校准、压力测试与盲测。',
      '人工确认方向，记录修订、补证或退出理由。',
    ],
    evidence: [
      {
        kind: '流程图',
        title: '决策工作流与 Agent 分工',
        lines: ['1 个编排器 + 4 类职责 Agent。', '43 项任务拆解，把证据整理、候选生成和人工确认分开。'],
        source: '设计产物',
      },
      {
        kind: '规则 / Brief',
        title: 'Gold / Challenge / Holdout',
        lines: ['用三套集合区分校准、压力测试与盲测。', '证据状态、版本快照和审计规则一起保留。'],
        source: '设计产物',
      },
      {
        kind: '测试或复盘',
        title: '问卷与续答',
        lines: ['56 份有效问卷。', '51 人续答。'],
        source: '用户反馈',
      },
      {
        kind: '原型',
        title: '公开 Demo 与验收',
        lines: ['23 个验收用例。', '公开 Demo 为冻结回放；本地链路才支持实时推理。'],
        source: '本地测试',
      },
    ],
    state: [
      '已有公开展示与原型证据。',
      '它证明的是问题拆解、证据治理、评估与人机协同能力，不代表品牌策略已被企业规模化采用。',
    ],
    takeaway: '我把品牌选择收成可回溯的记录：证据来源、候选比较、淘汰理由和人工确认留在同一条工作流里。',
  },
  {
    id: 'anker',
    index: '02',
    name: '安克智能售后服务 Agent',
    tag: 'AFTER-SALES AGENT / RUNNABLE PROTOTYPE',
    line: '将售后对话拆成事实确认、风险门禁、步骤依赖、人工升级与局部回退，而不是只生成一段客服回复。',
    image: '/projects/anker.png',
    status: '可运行原型',
    scene: [
      '售后咨询会涉及设备状态、订单事实、风险判断和下一步操作。单纯的语言模型回复难以稳定处理状态冲突、依赖关系和高风险情况。',
    ],
    judgment: [
      'AI 适合处理用户表达、意图和语言事实；',
      '业务规则需要明确控制安全、状态、步骤依赖与人工接管。',
    ],
    mechanism: [
      '识别用户意图与已知事实。',
      '根据事实版本和设备状态判断可执行步骤。',
      '对冲突、高风险或信息不足情况进入 ASK / HANDOFF。',
      '发生变更时仅回退受影响步骤，避免全流程重来。',
      '记录决策路径，支持复盘。',
    ],
    evidence: [
      {
        kind: '流程图',
        title: '状态机与步骤依赖',
        lines: ['事实版本决定哪些步骤可以执行。', '变更时只回退受影响步骤。'],
        source: '设计产物',
      },
      {
        kind: '原型',
        title: '模拟工单环境',
        lines: ['可运行的模拟工单 Demo。', 'Streamlit 原型与公开代码仓库。'],
        source: '设计产物',
      },
      {
        kind: '测试或复盘',
        title: '本地自动化测试',
        lines: ['86 项本地自动化测试通过。'],
        source: '本地测试',
      },
      {
        kind: '测试或复盘',
        title: '异常路径',
        lines: ['覆盖 ASK、人工接管和回退。', '状态流转留有架构图，供复盘对照。'],
        source: '本地测试',
      },
    ],
    state: [
      '原型与测试环境已完成验证。',
      '它不是安克官方生产系统，也不应展示为真实企业客服上线成果。',
    ],
    takeaway: '我把售后处理拆成事实版本、风险门禁、步骤依赖和局部回退，高风险情况进入追问或人工接管。',
  },
  {
    id: 'loreal',
    index: '03',
    name: '欧莱雅 Data Empathy',
    tag: 'BEAUTY SERVICE / PRODUCT DESIGN',
    line: '为美妆用户设计一条从问题识别、补充信息、排查建议到人工升级的服务路径。',
    image: '/projects/loreal.png',
    status: '产品设计阶段',
    scene: [
      '护肤困扰往往描述模糊，且会涉及安全风险、重复推荐和复杂售后。用户需要的不只是产品答案，而是被理解、被引导和被正确分流。',
    ],
    judgment: [
      '产品第一步不应急着给推荐。',
      '先判断信息是否足够、是否需要追问、是否存在风险，再决定自动回答、辅助人工或直接升级。',
    ],
    mechanism: [
      '识别用户需求与已知信息。',
      '对信息不足的情况发起最少必要追问。',
      '将问题分为自动回复、Agent 辅助、人工处理。',
      '用状态机处理排查、结果反馈、继续排查与转人工。',
      '为每次输出保留证据、限制和安全边界。',
    ],
    evidence: [
      {
        kind: '规则 / Brief',
        title: '范围与字段合同',
        lines: ['PRD 写明 P0 / P1 / P2。', '5 项最小标注字段，5 类 AI 输出。'],
        source: '设计产物',
      },
      {
        kind: '流程图',
        title: '排查到升级',
        lines: ['用状态机串起排查、结果反馈、继续排查和转人工。', '搓泥排查是其中一条典型服务流程。'],
        source: '设计产物',
      },
      {
        kind: '规则 / Brief',
        title: '三种服务模式',
        lines: ['AUTO_REPLY / AGENT_ASSIST / HUMAN_REQUIRED。', '信息不足时先追问，而不是直接推荐。'],
        source: '设计产物',
      },
      {
        kind: '原型',
        title: '服务流程原型',
        lines: ['页面保留机制和服务边界。', '信息不足时先做最少必要追问。'],
        source: '设计产物',
      },
    ],
    state: ['属于产品设计与原型阶段。', '页面应展示机制与服务边界，不写成已接入欧莱雅正式系统。'],
    takeaway: '我把服务的第一步放在分流：先核对信息够不够、要不要追问、有没有风险，再决定自动回答、辅助或升级。',
  },
  {
    id: 'hr',
    index: '04',
    name: 'AI 招聘筛选系统',
    tag: 'AI SCREENING / EVALUATION-FIRST',
    line: '把“AI 看简历”变成可解释的候选人证据标注与人工评估辅助流程。',
    image: '/projects/hr.png',
    status: '概念验证',
    scene: [
      '招聘筛选容易被简历表述、模型幻觉或模糊评分影响。若没有统一证据标准，AI 推荐结果无法解释，也无法被招聘者复核。',
    ],
    judgment: [
      '先定义岗位能力证据和人工 Gold 标准，再讨论模型效果。',
      '模型输出需要与证据绑定；材料不足时必须允许“不确定”，不能强行给结论。',
    ],
    mechanism: [
      '将候选人材料拆成可核对证据。',
      '使用 BARS Rubric 标注能力表现。',
      '对信息不足样本输出 INSUFFICIENT。',
      '分离校准集、Challenge 集与 Holdout 集。',
      '比较基础模型、明确 Rubric 模型与完整机制的差异。',
    ],
    evidence: [
      {
        kind: '规则 / Brief',
        title: 'P0 与 BARS Rubric',
        lines: ['先写招聘筛选 P0 和能力证据字段。', '表现按 BARS Rubric 标注，方便人工复核。'],
        source: '设计产物',
      },
      {
        kind: '规则 / Brief',
        title: '评估集合',
        lines: ['校准集、Challenge 集和 Holdout 集分开。', '信息不足时输出 INSUFFICIENT。'],
        source: '设计产物',
      },
      {
        kind: '规则 / Brief',
        title: '人工复核',
        lines: ['推荐结果绑定证据。', '人工复核保留原因码。'],
        source: '设计产物',
      },
      {
        kind: '原型',
        title: '合成样本上的原型',
        lines: ['用可运行原型和合成测试样本核对机制。', '样本不是真实候选人，页面不写招聘准确率。'],
        source: '设计产物',
      },
    ],
    state: ['当前以合成测试材料验证产品机制。', '不能展示为真实招聘准确率，也不能展示为企业级招聘筛选结果。'],
    takeaway: '我把筛选收成证据标注：能力表现对照 Rubric，材料不足就标 INSUFFICIENT，结论要能被招聘者核对。',
  },
  {
    id: 'sofa',
    index: '05',
    name: '海外压缩沙发内容增长',
    tag: 'B2B CONTENT GROWTH / OVERSEAS',
    line: '围绕海外 B2B 买家的空间、物流和选品顾虑，设计短视频脚本与询盘引导结构。',
    image: '/projects/sofa.png',
    status: '增长项目',
    scene: [
      '海外压缩沙发的购买者关心的不只是产品外观，还会判断运输成本、目标市场、压缩方式、采购量和转售可能性。',
    ],
    judgment: [
      '内容不能按照消费者“选家具”的逻辑写。',
      '需要站在进口商、批发商、跨境卖家和连锁采购方的决策角度，先解决他们对选品与利润的疑问。',
    ],
    mechanism: [
      '提炼海外买家的典型顾虑。',
      '用前几秒钩子建立场景和价值解释。',
      '在脚本中嵌入产品卖点与询盘引导。',
      '根据播放、评论与询盘反馈迭代模板。',
      '沉淀可复用的 ToB 脚本结构。',
    ],
    evidence: [
      {
        kind: '规则 / Brief',
        title: '脚本与模板',
        lines: ['50+ 条海外短视频脚本。', '10+ 套可复用脚本模板。'],
        source: '设计产物',
      },
      {
        kind: '规则 / Brief',
        title: '卖点与询盘引导',
        lines: ['脚本里写入空间、物流、压缩方式和采购量。', '评论区引导话术跟在卖点后面。'],
        source: '设计产物',
      },
      {
        kind: '测试或复盘',
        title: '内容复盘规则',
        lines: ['按播放、评论和询盘反馈回到钩子、卖点和模板。'],
        source: '项目复盘',
      },
      {
        kind: '测试或复盘',
        title: '播放与客资',
        lines: [
          '后续平均播放量提升 35%。',
          '2,000+ 潜在线索，500+ 高意向客资。',
          '统计口径与个人贡献范围尚未写入，这些数字不作为个人独立业绩。',
        ],
        source: '待补证',
      },
    ],
    state: ['此项目属于知君竹阶段的增长案例。', '展示时需标明数据统计口径与个人贡献范围。'],
    takeaway: '我按进口商和批发商的物流、压缩方式、采购量和转售疑问来组织脚本，再把询盘引导放进同一条内容结构。',
  },
  {
    id: 'muse',
    index: '06',
    name: 'Muse Select',
    tag: 'AI FASHION COMMUNITY / CONCEPT TO CAMPAIGN',
    line: '面向愿意把 AI 用进穿搭、视觉生成、衣橱整理和趋势研究的人，设计一个时尚创作者社区的招募与内容表达。',
    image: '/projects/muse-select.png',
    status: '概念验证',
    scene: [
      '许多人已经在用 AI 做时尚相关创作，但他们分散在不同能力层级和创作方式中，缺少一个低门槛、能展示实际作品的参与入口。',
    ],
    judgment: [
      '不把社区定义成“只招设计师”的圈层。',
      '重点是找到真正把 AI 用进时尚表达的人，让不同经验的人都能以作品和方法加入。',
    ],
    mechanism: [
      '定义创作者参与范围：穿搭、视觉生成、衣橱、趋势、选品。',
      '设计低门槛招募入口与作品提交方式。',
      '用内容模板降低表达成本。',
      '将创作案例沉淀为可浏览的主题内容。',
      '根据互动反馈调整招募语言和展示方式。',
    ],
    evidence: [
      {
        kind: '规则 / Brief',
        title: '定位与招募',
        lines: ['社区面向把 AI 用进穿搭、视觉、衣橱、趋势和选品的人。', '招募文案对应作品提交，不设设计师门槛。'],
        source: '设计产物',
      },
      {
        kind: '规则 / Brief',
        title: '内容主题结构',
        lines: ['案例按主题浏览。', '内容模板用来降低表达成本。'],
        source: '设计产物',
      },
      {
        kind: '原型',
        title: '视觉方向',
        lines: ['AI 时尚视觉作为表达样例。', '这里只展示视觉方向。'],
        source: '设计产物',
      },
      {
        kind: '规则 / Brief',
        title: '参与规则',
        lines: ['不同经验的人用作品和方法加入。', '互动反馈用来调整招募语言和展示方式。'],
        source: '设计产物',
      },
    ],
    state: ['这是一个社区与内容产品概念。', '展示定位、机制与视觉原型即可，不虚构用户规模或运营成果。'],
    takeaway: '我把参与入口放在作品和方法上：穿搭、视觉生成、衣橱、趋势和选品都能提交，招募不收成设计师圈层。',
  },
  {
    id: 'planflow',
    index: '07',
    name: 'PlanFlow 团队排期系统',
    tag: 'TEAM PLANNING / RUNNABLE PRODUCT',
    line: '把分散的任务、负责人、依赖关系和验收节点放进同一个可追踪的团队协作流程。',
    image: '/projects/planflow.png',
    status: '可运行原型',
    scene: [
      '多人协作时，任务状态、依赖关系和责任边界容易分散在聊天记录与不同表格里，导致等待、遗漏和返工难以追踪。',
    ],
    judgment: [
      '排期工具的价值不只是“列任务”。',
      '关键在于每个任务是否有负责人、前置依赖、验收条件和明确状态。',
    ],
    mechanism: [
      '为任务定义负责人、优先级、截止时间和状态。',
      '识别任务之间的前后依赖。',
      '在状态变化时提示受影响任务。',
      '用看板呈现整体推进与阻塞位置。',
      '将协作过程沉淀为可复用的项目模板。',
    ],
    evidence: [
      {
        kind: '原型',
        title: '任务看板',
        lines: ['团队排期和任务看板可以运行。', '公开代码仓库保留实现。'],
        source: '设计产物',
      },
      {
        kind: '流程图',
        title: '依赖与阻塞',
        lines: ['任务之间有前后依赖。', '状态变化时提示受影响的任务。'],
        source: '设计产物',
      },
      {
        kind: '规则 / Brief',
        title: '协作规则',
        lines: ['每个任务同时写负责人、优先级、截止时间、验收条件和状态。'],
        source: '设计产物',
      },
      {
        kind: '原型',
        title: '可复用模板',
        lines: ['协作过程可以收成项目模板。', '还没有长期采用数据，这里只保留模板本身。'],
        source: '设计产物',
      },
    ],
    state: ['已有可运行产品与公开代码证据。', '尚无真实团队长期采用数据，因此不展示为已验证的效率提升。'],
    takeaway: '我把排期收成同一条任务记录：负责人、前置依赖、验收条件和当前状态必须同时在场，阻塞才能被指出来。',
  },
]

function readHash() {
  const id = window.location.hash.replace(/^#/, '')
  return cases.some((item) => item.id === id) ? id : null
}

export default function Projects() {
  const [openId, setOpenId] = useState<string | null>(readHash)

  useEffect(() => {
    const next = openId ? `#${openId}` : `${window.location.pathname}${window.location.search}`
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
    if (current !== next) window.history.replaceState(null, '', next)
  }, [openId])

  useEffect(() => {
    if (!openId) return
    const node = document.getElementById(`case-${openId}`)
    if (!node) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' })
  }, [openId])

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#1c1915] [&_header]:border-[#e4dfd6] [&_header]:bg-[#f7f5f2]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1180px] px-4 pt-10 pb-24 break-keep sm:px-6">
        <header className="border-b border-[#d9d3c8] pb-8">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h1
              className="m-0 text-[clamp(34px,4.6vw,56px)] leading-none font-normal tracking-tight"
              style={{ fontFamily: serif }}
            >
              PROJECT ARCHIVE
            </h1>
            <p className="m-0 text-[13px] tracking-[0.22em] text-[#6b645c]">07 CASES</p>
          </div>
          <p className="mt-6 max-w-[40rem] text-[15px] leading-7 text-[#3f3a34]">
            从品牌决策、智能服务到协作工具。
            <br />
            每个项目都从一个具体问题出发，
            <br className="sm:hidden" />
            留下可查看的机制、原型或验证痕迹。
          </p>
        </header>

        <ol className="m-0 list-none p-0">
          {cases.map((item) => {
            const open = openId === item.id
            return (
              <li key={item.id} id={`case-${item.id}`} className="scroll-mt-36 border-b border-[#d9d3c8]">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`detail-${item.id}`}
                  onClick={() => toggle(item.id)}
                  className="grid w-full grid-cols-1 gap-4 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1c1915] sm:grid-cols-[4.5rem_minmax(0,1fr)_220px] sm:items-center sm:gap-6"
                >
                  <span className="text-[22px] leading-none text-[#6b645c]" style={{ fontFamily: serif }}>
                    {item.index}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[22px] leading-snug sm:text-[26px]" style={{ fontFamily: serif }}>
                      {item.name}
                    </span>
                    <span className="mt-2 block text-[14px] leading-7 text-[#3f3a34]">{item.line}</span>
                  </span>
                  <img
                    src={item.image}
                    alt=""
                    className="h-40 w-full object-cover sm:h-[148px] sm:w-[220px]"
                  />
                </button>
                {open ? <CaseDetail item={item} onClose={() => toggle(item.id)} /> : null}
              </li>
            )
          })}
        </ol>
      </main>
    </div>
  )
}

function CaseDetail({ item, onClose }: { item: ProjectCase; onClose: () => void }) {
  return (
    <div id={`detail-${item.id}`} className="border-t border-[#e4dfd6] pt-8 pb-10">
      <div className="flex flex-wrap items-center gap-3">
        <p className="m-0 text-[12px] tracking-[0.16em] text-[#6b645c]">{item.tag}</p>
        <p className="m-0 border border-[#1c1915] px-2 py-1 text-[12px] leading-none">项目状态 · {item.status}</p>
      </div>

      <Section label="问题场景">
        {item.scene.map((paragraph) => (
          <p key={paragraph} className="m-0 max-w-[42rem] text-[15px] leading-8">
            {paragraph}
          </p>
        ))}
      </Section>

      <Section label="我的判断">
        <div className="max-w-[42rem] space-y-3">
          {item.judgment.map((paragraph) => (
            <p key={paragraph} className="m-0 text-[15px] leading-8">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section label="产品机制">
        <ol className="m-0 max-w-[42rem] list-none space-y-3 p-0">
          {item.mechanism.map((step, index) => (
            <li key={step} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 text-[15px] leading-7">
              <span className="text-[#6b645c]">{String(index + 1).padStart(2, '0')}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section label="交付与证据">
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
          {item.evidence.map((card) => (
            <li key={card.title} className="border border-[#e4dfd6] bg-white px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="m-0 text-[12px] tracking-[0.12em] text-[#6b645c]">{card.kind}</p>
                <p className="m-0 shrink-0 text-[12px] text-[#1c1915]">{card.source}</p>
              </div>
              <h3 className="mt-3 mb-2 text-[16px] leading-snug font-normal" style={{ fontFamily: serif }}>
                {card.title}
              </h3>
              <div className="space-y-1">
                {card.lines.map((line) => (
                  <p key={line} className="m-0 text-[14px] leading-7 text-[#3f3a34]">
                    {line}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="当前状态">
        <div className="max-w-[42rem] space-y-3">
          {item.state.map((paragraph) => (
            <p key={paragraph} className="m-0 text-[15px] leading-8">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <div className="mt-10 border-t border-[#1c1915] pt-5">
        <p className="m-0 text-[12px] tracking-[0.16em] text-[#6b645c]">我从这个项目带走了什么</p>
        <p className="mt-3 mb-0 max-w-[42rem] text-[20px] leading-9" style={{ fontFamily: serif }}>
          {item.takeaway}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-8 text-[12px] tracking-[0.14em] text-[#6b645c] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1c1915]"
      >
        收起
      </button>
    </div>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="m-0 text-[12px] tracking-[0.18em] text-[#6b645c]">{label}</h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}
