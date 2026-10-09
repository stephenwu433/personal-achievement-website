/** 五项能力页只放底色、介绍、主图、证据。滚动高亮其中一条证据，不另写文案。 */

export type CapabilityEvidence = {
  project: string
  text: string
  figure: string
}

export type Capability = {
  id: string
  label: string
  ink: string
  paper: string
  text: string
  intro: string
  image: string
  /** 字块落在主图留白上，不压脸和关键动作。 */
  place: string
  /** 留白是一条横带时，证据横排。 */
  band?: boolean
  focus: string
  evidence: CapabilityEvidence[]
}

export const capabilities: Capability[] = [
  {
    id: 'insight',
    label: '商业洞察',
    ink: '#5D674C',
    paper: '#E8DFC9',
    text: '#E8DFC9',
    intro: '在分散的用户、市场与竞品信息里，找到值得被解决的真实机会。',
    image: '/skills/insight.webp',
    place: 'left-6 top-5 w-[min(23.5rem,32vw)]',
    focus: '42% 40%',
    evidence: [
      { project: '梅见品牌认知智能体', text: '从消费者体验、饮酒场景与竞品资料中定位“选饮帮助”机会。', figure: '229 条' },
      { project: '海外压缩沙发', text: '将海外买家顾虑转化为内容选题与沟通切口。', figure: '50万+ 播放' },
    ],
  },
  {
    id: 'strategy',
    label: '产品策略',
    ink: '#B9673F',
    paper: '#D88A55',
    text: '#FFF6EE',
    intro: '把模糊需求拆成可取舍的目标、路径与优先级。',
    image: '/skills/strategy.webp',
    place: 'right-6 top-4 w-[min(23.5rem,30vw)]',
    focus: '50% 36%',
    evidence: [
      { project: '梅见品牌认知智能体', text: '通过候选比较，将泛化品牌表达收敛为具体选择任务。', figure: '3 个候选' },
      { project: 'HR 招聘证据复核系统', text: '将招聘判断拆成可追溯、可复核的能力评价维度。', figure: '4 项能力' },
    ],
  },
  {
    id: 'ai',
    label: 'AI 产品设计',
    ink: '#102C66',
    paper: '#8798E8',
    text: '#E7ECFF',
    intro: '把 AI、规则与人的判断组织成可被使用的产品流程。',
    image: '/skills/ai.webp',
    place: 'left-5 top-4 w-[min(22rem,32vw)]',
    focus: '48% 40%',
    evidence: [
      { project: '梅见品牌认知智能体', text: '将证据处理、候选生成、专属度审查拆成职责清晰的协作系统。', figure: '4 个 Agent' },
      { project: 'HR 招聘证据复核系统', text: '从材料输入到人工纠正与重新评估，设计最小闭环。', figure: '8 个环节' },
    ],
  },
  {
    id: 'growth',
    label: '增长运营',
    ink: '#EC765C',
    paper: '#F3B1B6',
    text: '#3C1712',
    intro: '用内容、数据与反馈，让一个方向在真实用户面前被验证。',
    image: '/skills/growth.webp',
    place: 'right-6 top-4 w-[min(28rem,38vw)]',
    focus: '40% 32%',
    evidence: [
      { project: '海外压缩沙发', text: '通过 ToB 内容矩阵放大工厂、压缩测试与采购沟通内容。', figure: '50万+ 播放' },
      { project: 'Muse Select', text: '以 AI 穿搭图文测试用户对审美内容的反馈。', figure: '2万+ 浏览' },
      { project: 'Muse Select', text: '从内容主题与视觉表达中找到更高互动的切入方式。', figure: '500+ 最高点赞' },
    ],
  },
  {
    id: 'delivery',
    label: '项目推进',
    ink: '#193E35',
    paper: '#EEE3CC',
    text: '#EEE3CC',
    intro: '把判断持续推进成原型、交付物和下一轮行动。',
    image: '/skills/delivery.webp',
    place: 'left-5 top-3 w-[min(40rem,42vw)]',
    band: true,
    focus: '50% 34%',
    evidence: [
      { project: '梅见品牌认知智能体', text: '将研究、系统机制、品牌场景与路演叙事整合为完整交付。', figure: '18 页' },
      { project: 'HR 招聘证据复核系统', text: '将需求、规则、原型与评估连成一条可演示主链路。', figure: '8 个环节' },
      { project: '个人项目档案', text: '将不同行业的案例整理成可浏览、可追溯的作品系统。', figure: '7 个项目' },
    ],
  },
]

export function capabilityById(id: string | undefined) {
  return capabilities.find((item) => item.id === id)
}

export function splitFigure(figure: string) {
  const space = figure.indexOf(' ')
  if (space === -1) return { value: figure, unit: '' }
  return { value: figure.slice(0, space), unit: figure.slice(space + 1) }
}
