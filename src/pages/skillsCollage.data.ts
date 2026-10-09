/** 个人能力页的五格拼贴。画面位置对准现有夕阳九宫格，文案只用项目里已经写过的判断。 */

export type CollageRegion = {
  x: number
  y: number
  w: number
  h: number
}

export type Capability = {
  id: string
  label: string
  frame: string
  region: CollageRegion
  place: { left?: string; right?: string; top: string }
  lead: string
  evidence: { project: string; text: string }[]
}

export const personRegion: CollageRegion = { x: 0, y: 35.5, w: 66.5, h: 64.5 }

export const capabilities: Capability[] = [
  {
    id: 'insight',
    label: '洞察业务场景',
    frame: '研究',
    region: { x: 0, y: 0, w: 33, h: 35.5 },
    place: { left: '2.4%', top: '3.2%' },
    lead: '先从用户、市场和竞品里把问题说清楚，再决定要做什么。',
    evidence: [
      { project: '梅见', text: '体验里口味和饮法并不一致，微醺、独饮、朋友小聚又已经很挤。值得做的是：面对不同中国菜时，给出选饮理由。' },
      { project: '欧莱雅', text: '护肤困扰常常说不清，还可能夹着安全和售后。服务的第一步是判断信息够不够、要不要追问。' },
      { project: '海外压缩沙发', text: '采购方先问装柜、运费、回弹和试单，不是在客厅里选一件家具。' },
    ],
  },
  {
    id: 'problem',
    label: '定义产品问题',
    frame: '产品',
    region: { x: 33, y: 0, w: 33.5, h: 35.5 },
    place: { left: '35.6%', top: '3.2%' },
    lead: '把一句模糊需求收成用户、目标、流程和优先级。',
    evidence: [
      { project: '梅见', text: '问题从“再找一个喝酒场景”收成：两个人吃中国饭时，选哪款、怎么喝、买多少。' },
      { project: '安克创新', text: '售后不是生成一段客服回复，而是先核对设备事实、风险和步骤依赖。' },
      { project: 'PlanFlow', text: '小团队的排期里，负责人、前置依赖、验收条件和状态必须写在同一条任务上。' },
    ],
  },
  {
    id: 'flow',
    label: '设计智能流程',
    frame: 'AI 工作流',
    region: { x: 66.5, y: 0, w: 33.5, h: 35.5 },
    place: { right: '2.2%', top: '3.2%' },
    lead: '让 AI、人和规则各做一件事，输出要能被下一步接住。',
    evidence: [
      { project: '梅见', text: '筛选、归类、候选方向和专属度审查分开。保留、修改或暂缓，由品牌团队决定。' },
      { project: '安克创新', text: '事实版本决定哪一步能执行。信息冲突或风险高时追问或转人工，变更只回退受影响的步骤。' },
      { project: 'HR 招聘', text: '简历没写到的能力标成证据不足，不把没写到判成不符合。' },
    ],
  },
  {
    id: 'growth',
    label: '验证增长结果',
    frame: '数据',
    region: { x: 66.5, y: 35.5, w: 33.5, h: 29.5 },
    place: { right: '2.2%', top: '40%' },
    lead: '用内容、数据和反馈决定下一步，而不是用一个好看的结果代替判断。',
    evidence: [
      { project: '梅见', text: '两阶段真人反馈用来看一个方向会不会被竞品替代，所以场景要收得更具体。' },
      { project: 'Muse Select', text: '少量图文的浏览和点赞，用来判断哪一种视觉更容易被点击和保存。' },
      { project: '海外压缩沙发', text: '复盘时把播放、评论和询盘收回钩子和脚本。没有写清口径的数字，不写成个人业绩。' },
    ],
  },
  {
    id: 'delivery',
    label: '推进落地迭代',
    frame: '项目交付',
    region: { x: 66.5, y: 65, w: 33.5, h: 35 },
    place: { right: '2.2%', top: '71%' },
    lead: '把方案、Demo、脚本和原型推进成别人能打开、能核对的交付。',
    evidence: [
      { project: '梅见', text: '优先场景落到两个人的日常便饭，并拆成溯源、口味图鉴和容量适配。' },
      { project: 'PlanFlow', text: '目标、排期和依赖收进同一条可以运行的时间线。' },
      { project: '海外压缩沙发', text: '买家问题写成可拍摄的脚本，并放进页面里能打开的证据夹。' },
    ],
  },
]
