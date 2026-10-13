export type AiPieceId = 'beverage' | 'hr' | 'device'

export type AiScene = {
  pieceId: AiPieceId
  index: string
  name: string
  title: string
  body: string
  design: string
  change: string
  caption: string
  action: string
  aside: string
  photo: string
  photoFocus: string
  visual: 'agents' | 'evidence' | 'service'
}

export const aiHero = {
  title: 'AI 产品设计',
  lead: '让 AI 不只给出答案，也能交代答案从何而来、下一步由谁负责。',
  body: '真实业务不会始终按照一条顺畅的对话推进：证据可能互相矛盾，候选人的经历可能没有标准名称，用户也可能在执行建议后更正事实。此时，写出一段流畅的回答并不够。系统还需要知道依据是否成立、当前判断能否继续，以及什么时候应该把决定交还给人。',
}

export const aiAgents = ['筛选材料', '整理证据', '形成候选', '检验排他'] as const

export const aiMaterials = 30

export const aiZones = ['PILOT', 'BUILD', 'CHALLENGE', 'HOLDOUT'] as const

export const aiPath = ['输入', '事实', '知识', '建议'] as const

export const aiAxes = ['事实', '知识', '状态', '风险', '交接'] as const

export const aiScenes: AiScene[] = [
  {
    pieceId: 'beverage',
    index: '01',
    name: '酒饮品牌：让多个判断接受同一套检验',
    title: '当几个品牌方向都说得通，AI 凭什么选一个？',
    body: '市场材料里往往能找到支持不同方向的证据。让模型写出一个漂亮的品牌主张并不难；难的是看清它用了哪些材料、忽略了哪些反例，以及这个说法换成竞品后是否仍然成立。',
    design: '把工作拆给四个职责不同的 Agent：筛选材料、整理证据、形成候选判断、检验品牌排他性。编排器控制调用顺序与状态，不替它们作品牌结论。候选方向带着证据和反例进入人工决策；说不清的返回修订，证据不足的继续补充。',
    change: 'AI 不再负责“一次生成正确答案”，而是把原本容易混在一起的材料、推断和反对意见摊开，让人能够判断一个方向为什么值得继续。',
    caption: '项目原型的协作结构；最终品牌判断由人作出。',
    action: '查看酒饮品牌项目',
    aside: '项目页承接候选方向、真人验证和最终方案。',
    photo: '/projects/beverage.webp',
    photoFocus: '76% 40%',
    visual: 'agents',
  },
  {
    pieceId: 'hr',
    index: '02',
    name: 'HR 招聘系统：让每一次推荐都能回到原文',
    title: '一个候选人为什么值得看，不能只靠模型说“匹配”。',
    body: '招聘标准、简历写法和真实工作能力之间，并没有天然一致的语言。只让 AI 给简历打分，可能比关键词筛选更会理解文本，却仍说不清：它按哪一版标准判断，证据来自候选人的哪句话，团队成果是否被误算成个人贡献。',
    design: '企业任务先被整理成岗位标准草案，由用人经理确认并冻结版本。AI 再处理岗位要求与候选人经历，把每项判断连到“任务要求—个人贡献—交付结果—简历原文位置”。规则层检查引用是否存在、证据是否充分，并把“材料没写清”与“不符合要求”分开。系统形成可复核的队列，HR 查看原文后决定下一步。',
    change: '重点不是让模型更像招聘专家，而是让它的每个判断都接受同一版标准和原始材料的检验。标准变化要建立新版本；证据找不到，就不能假装确定。',
    caption: '用于开发与检验机制的材料划分，并非招聘业务成果。',
    action: '查看 HR 招聘系统',
    aside: '项目页承接候选人案例、对照实验和具体结果。',
    photo: '/projects/hr.webp',
    photoFocus: '50% 42%',
    visual: 'evidence',
  },
  {
    pieceId: 'device',
    index: '03',
    name: '消费电子品牌：让售后 Agent 管理过程，而不只是管理对话',
    title: '一次排障里，系统究竟要记住什么？',
    body: '用户描述故障、执行建议、更正接口、反馈结果，任何一步都可能改变后面的判断。如果 AI 只拿到一整段聊天记录，它也许能继续回答，却无法稳定判断哪条建议仍有效、哪一步已经失败、什么时候继续排障会带来风险。',
    design: '每个服务案例保存确认过的事实、知识依据、单次排障尝试和用户观察结果。AI 负责理解输入、抽取变化并提出下一步；编排层根据事实版本、步骤依赖和当前状态决定能否继续。事实更正时，只撤销受影响的尝试；知识不足时不继续编造办法；出现安全风险时立即中断；需要人工接管时，将已确认事实、已做操作与未解决问题一并移交。',
    change: '局部回退只是其中一个动作。更重要的是让理解、知识、状态、风险和人工责任接成连续的服务路径：系统知道自己正处于哪一步，为什么能给出这一步，以及什么条件下必须停下。',
    caption: '原型验收范围，并非线上解决率。',
    action: '查看 消费电子品牌 项目',
    aside: '项目页承接具体状态规则、排障步骤和原型演示。',
    photo: '/projects/device.webp',
    photoFocus: '50% 28%',
    visual: 'service',
  },
]

export const aiClose = {
  title: 'AI 的能力，不该只体现在它说出了什么。',
  body: '酒饮品牌让不同判断接受证据与反例的检验；HR 系统让每条推荐回到同一版标准和候选人原文；消费电子品牌 让服务在事实变化、知识不足和风险出现时仍能走向正确的下一步。',
  next: '模型可以参与理解和生成，但证据如何核对、状态如何改变、决定由谁承担，必须在产品里事先设计清楚。',
}
