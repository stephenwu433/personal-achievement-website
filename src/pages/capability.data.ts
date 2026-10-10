import { projectPieces } from '@/src/content'

/** 能力页只放底色、一句介绍、主图、项目证据。证据以外的文案不在这里编。 */

const RETURN_KEY = 'capability-return'

export type CapabilityProject = {
  name: string
  text: string
  figure: string
  /** 对应项目列表里真实打开的案例。没有详情页则为 null。 */
  pieceId: string | null
}

export type Capability = {
  id: string
  label: string
  ink: string
  paper: string
  text: string
  intro: string
  image: string
  focus: string
  place: string
  videoSrc: string
  posterSrc: string
  cursorAsset: string
  desktopFrameSources: string[]
  mobileFrameSources: string[]
  scrollFrameStart: number
  scrollFrameEnd: number
  projects: CapabilityProject[]
}

const pieceIds = new Set(projectPieces.map((piece) => piece.id))

function piece(id: string | null) {
  return id && pieceIds.has(id) ? id : null
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
    focus: '42% 40%',
    place: 'left-5 top-4 w-[min(22rem,38vw)]',
    videoSrc: '',
    posterSrc: '',
    cursorAsset: '',
    desktopFrameSources: [],
    mobileFrameSources: [],
    scrollFrameStart: 0,
    scrollFrameEnd: 0,
    projects: [
      {
        name: '梅见品牌认知智能体',
        text: '从消费者体验、饮酒场景与竞品资料中定位“选饮帮助”机会。',
        figure: '229 条',
        pieceId: piece('meijian'),
      },
      {
        name: '海外压缩沙发',
        text: '将海外买家顾虑转化为内容选题与沟通切口。',
        figure: '50万+ 播放',
        pieceId: piece('sofa'),
      },
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
    focus: '50% 36%',
    place: 'right-5 top-4 w-[min(22rem,36vw)]',
    videoSrc: '',
    posterSrc: '',
    cursorAsset: '',
    desktopFrameSources: [],
    mobileFrameSources: [],
    scrollFrameStart: 0,
    scrollFrameEnd: 0,
    projects: [
      {
        name: '梅见品牌认知智能体',
        text: '通过候选比较，将泛化品牌表达收敛为具体选择任务。',
        figure: '3 个候选',
        pieceId: piece('meijian'),
      },
      {
        name: 'HR 招聘证据复核系统',
        text: '将招聘判断拆成可追溯、可复核的能力评价维度。',
        figure: '4 项能力',
        pieceId: piece('hr'),
      },
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
    focus: '48% 40%',
    place: 'left-5 top-4 w-[min(22rem,36vw)]',
    videoSrc: '',
    posterSrc: '',
    cursorAsset: '',
    desktopFrameSources: [],
    mobileFrameSources: [],
    scrollFrameStart: 0,
    scrollFrameEnd: 0,
    projects: [
      {
        name: '梅见品牌认知智能体',
        text: '将证据处理、候选生成、专属度审查拆成职责清晰的协作系统。',
        figure: '4 个 Agent',
        pieceId: piece('meijian'),
      },
      {
        name: 'HR 招聘证据复核系统',
        text: '从材料输入到人工纠正与重新评估，设计最小闭环。',
        figure: '8 个环节',
        pieceId: piece('hr'),
      },
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
    focus: '40% 32%',
    place: 'right-5 top-4 w-[min(24rem,40vw)]',
    videoSrc: '',
    posterSrc: '',
    cursorAsset: '',
    desktopFrameSources: [],
    mobileFrameSources: [],
    scrollFrameStart: 0,
    scrollFrameEnd: 0,
    projects: [
      {
        name: '海外压缩沙发',
        text: '通过 ToB 内容矩阵放大工厂、压缩测试与采购沟通内容。',
        figure: '50万+ 播放',
        pieceId: piece('sofa'),
      },
      {
        name: 'Muse Select',
        text: '以 AI 穿搭图文测试用户对审美内容的反馈。',
        figure: '2万+ 浏览',
        pieceId: piece('muse'),
      },
      {
        name: 'Muse Select',
        text: '从内容主题与视觉表达中找到更高互动的切入方式。',
        figure: '500+ 最高点赞',
        pieceId: piece('muse'),
      },
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
    focus: '50% 34%',
    place: 'left-5 top-4 w-[min(22rem,40vw)]',
    videoSrc: '',
    posterSrc: '',
    cursorAsset: '',
    desktopFrameSources: [],
    mobileFrameSources: [],
    scrollFrameStart: 0,
    scrollFrameEnd: 0,
    projects: [
      {
        name: '梅见品牌认知智能体',
        text: '将研究、系统机制、品牌场景与路演叙事整合为完整交付。',
        figure: '18 页',
        pieceId: piece('meijian'),
      },
      {
        name: 'HR 招聘证据复核系统',
        text: '将需求、规则、原型与评估连成一条可演示主链路。',
        figure: '8 个环节',
        pieceId: piece('hr'),
      },
      {
        name: '个人项目档案',
        text: '将不同行业的案例整理成可浏览、可追溯的作品系统。',
        figure: '7 个项目',
        pieceId: null,
      },
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

export function rememberCapabilityReturn(id: string, item: number, scroll: number) {
  sessionStorage.setItem(RETURN_KEY, JSON.stringify({ id, item, scroll }))
}

export function takeCapabilityReturn(id: string) {
  const raw = sessionStorage.getItem(RETURN_KEY)
  if (!raw) return null
  sessionStorage.removeItem(RETURN_KEY)
  try {
    const data = JSON.parse(raw) as { id?: string; item?: number; scroll?: number }
    if (data.id !== id) return null
    return { item: data.item ?? 0, scroll: data.scroll ?? 0 }
  } catch {
    return null
  }
}
