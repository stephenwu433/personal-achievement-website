export type InsightPieceId = 'beverage' | 'sofa' | 'device'

export type InsightScene = {
  pieceId: InsightPieceId
  index: string
  name: string
  title: string
  body: string
  judgment: string
  turn: string
  kind: '问题信号' | '内容触达' | '原型范围'
  figure: string
  unit: string
  caption: string
  limit: string
  action: string
  aside: string
  photo: string
  photoFocus: string
}

export const insightHero = {
  title: '商业洞察',
  lead: '找到选择发生之前，真正卡住的那一步。',
  body: '从消费者选酒、海外买家采购，到用户寻求售后服务，我关注的都是同一个问题：人已经获得信息，为什么仍没有迈出下一步？找到这处阻力，产品、内容和 AI 才知道该解决什么。',
}

export const insightScenes: InsightScene[] = [
  {
    pieceId: 'beverage',
    index: '01',
    name: '酒饮品牌',
    title: '这顿饭，为什么没有选酒饮品牌？',
    body: '消费者知道青梅酒，也理解它可以搭配中餐；但到了具体的一顿饭，仍缺少足够明确的理由选酒饮品牌。',
    judgment: '如果一个场景换成竞品仍然成立，继续扩大传播并不能让品牌变得更难替代。项目需要先找到餐桌上真实存在的选择障碍，再决定品牌要占据什么认知。',
    turn: '讨论从宽泛的“微醺场景”，转向可以被验证的“这顿饭如何选酒”。',
    kind: '问题信号',
    figure: '已脱敏',
    unit: '',
    caption: '受访者认为竞品仍可完全或部分替代。',
    limit: '这里展示的是发现的问题，不是已经取得的增长成绩。',
    action: '查看酒饮品牌项目',
    aside: '项目页再讲候选方向、真人验证与具体方案。',
    photo: '/projects/beverage.webp',
    photoFocus: '76% 40%',
  },
  {
    pieceId: 'sofa',
    index: '02',
    name: '海外压缩沙发',
    title: '这笔采购，为什么还没有发出询盘？',
    body: '海外买家不会只凭沙发外观作决定。他们还在判断运输成本、压缩后的品质、试单风险，以及工厂能否稳定交付。',
    judgment: '内容首先要回答采购者的疑虑，产品卖点才会进入对方的采购考虑。拍摄主题因此应围绕买家的决策顺序组织，而不是依次介绍产品参数。',
    turn: '项目内容从“展示沙发”，转向“帮助买家判断这款产品是否值得采购和进一步询价”。',
    kind: '内容触达',
    figure: '已脱敏',
    unit: '项目账号阶段累计播放',
    caption: '',
    limit: '不用增长曲线，因为目前没有可支持逐期走势的数据。',
    action: '查看压缩沙发项目',
    aside: '项目页再讲脚本、内容矩阵、账号证据和询盘承接。',
    photo: '/projects/sofa.webp',
    photoFocus: '40% 30%',
  },
  {
    pieceId: 'device',
    index: '03',
    name: '消费电子品牌 智能售后 Agent',
    title: '用户改口后，为什么服务又从头开始？',
    body: '用户最初描述“充不进电”，随后才补充或更正接口、配件与操作结果。关键事实一变，建立在旧事实上的建议可能已经不适用；人工接手时，也可能不得不重新询问。',
    judgment: '售后体验的关键不只是回复速度，而是信息变化后，服务能否从正确的位置继续。这让宽泛的“做智能客服”，收敛成一个明确、可验证的产品问题。',
    turn: '原型围绕事实变化后的处理连续性设计，而不是以“AI 能回答多少问题”作为成功标准。',
    kind: '原型范围',
    figure: '已脱敏',
    unit: '种处理结局',
    caption: '原型设计范围，并非线上业务结果。',
    limit: '',
    action: '查看 消费电子品牌 项目',
    aside: '项目页再讲具体流程、规则和验收结果。',
    photo: '/projects/device.webp',
    photoFocus: '50% 28%',
  },
]

export const insightOutcomes = ['解决', '局部回退', '风险中断', '人工接管'] as const

export const insightThumbs = [
  '/projects/sofa.webp',
  '/projects/sofa.webp',
  '/projects/sofa.webp',
  '/projects/sofa.webp',
]

export const insightClose = {
  title: '不同的行业，相同的工作起点。',
  body: '酒饮品牌缺少的是一顿饭里的选择理由；压缩沙发需要先消除采购疑虑；智能售后必须处理事实改变后的服务断点。',
  next: '我会先找到这些阻力，再判断团队下一步值得投入研究、内容，还是产品设计。商业洞察的价值，是让后续工作对准同一个真实问题。',
}
