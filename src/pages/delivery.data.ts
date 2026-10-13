// Task rows use resource types already written on the internship page and in this
// brief. The 31 / 13 figures are the list's scope, not a claim that every item
// was collected. Channels and deadlines from the source spreadsheet are not in
// the repo, so they are not filled in as completed claims.

export type DeliveryTask = {
  id: string
  name: string
  when: '立即' | '本周' | '展前'
  use: string
  channel: string
  time: string
  status: string
  pending: boolean
}

export const deliverySources = ['官网', '参展商入口', '主办方沟通', '展前安排']

export const deliveryWhen = ['立即', '本周', '展前'] as const

export const deliveryTasks: DeliveryTask[] = [
  {
    id: 'match',
    name: '商务配对报名',
    when: '立即',
    use: '完成报名，而不只是知道有这项资源',
    channel: '参展商入口',
    time: '立即',
    status: '可办理',
    pending: false,
  },
  {
    id: 'open',
    name: '待确认事项',
    when: '本周',
    use: '不能直接确认、需要向主办方提出的问题',
    channel: '主办方沟通',
    time: '单独列出',
    status: '待确认',
    pending: true,
  },
  {
    id: 'copy',
    name: '英文稿',
    when: '展前',
    use: '投稿和展会传播要备好的英文内容',
    channel: '展前安排',
    time: '展前',
    status: '可准备素材',
    pending: false,
  },
  {
    id: 'photo',
    name: '产品图',
    when: '展前',
    use: '投稿要配上的产品图',
    channel: '展前安排',
    time: '展前',
    status: '可准备素材',
    pending: false,
  },
  {
    id: 'invite',
    name: '邀请物料',
    when: '展前',
    use: '观众邀约使用的展会物料',
    channel: '展前安排',
    time: '展前',
    status: '可准备素材',
    pending: false,
  },
]

export const deliveryPosters = [
  { src: '/internships/building.webp', alt: '海外行业展会 邀请海报' },
  { src: '/internships/building.webp', alt: '香港澳门英文视觉海报' },
]

export const deliveryQuestions = ['课程', '活动安排', '报名方式']

export const deliveryMembers = ['A', 'B', 'C']

export const deliveryHandoff = ['宣传', '咨询', '报名', '反馈']

export const deliverySourceLines = ['产品介绍', '性能优势', '客户资料']

export const deliveryOpenLines = ['参展规模', '筹备细节']

export const deliveryEnglishLines = ['产品介绍', '性能优势']

export const deliveryHero = {
  title: '项目推进',
  lead: '让工作从“我已经做完”，走到“下一环节可以接着做”。',
  body: '项目推进的难处，常常出现在交接处：资料有人收集，却没人知道何时提交；内容已经制作，却缺少发布所需的信息；团队在回答同一类问题，却给出不同说法。我会把这些容易断开的环节整理成明确的材料、动作和交付顺序。',
}

export type DeliveryScene = {
  id: 'building' | 'education' | 'machinery'
  index: string
  name: string
  title: string
  body: string
  approach: string
  result: string
  action: string
  aside: string
  href: string
  photo: string
  photoFocus: string
}

export const deliveryScenes: DeliveryScene[] = [
  {
    id: 'building',
    index: '01',
    name: '建材企业 A：把展会资源变成行动清单',
    title: '展会机会已经在那里，团队怎样确保有人去领取？',
    body: '海外行业展会 的参展资源分散在官网、参展商入口、主办方沟通和展前安排里。知道“有商务配对”与完成报名，是两件事；知道“可以投稿”与按时备好英文稿和产品图，也隔着一串具体动作。',
    approach:
      '把展商可使用的资源按用途整理，写明领取渠道、操作链接和时间要求。不能直接确认的事项单独列出，变成需要向主办方提出的问题；再按“立即、本周、展前”安排优先级。展会传播所需的视频、英文内容和邀请物料，依照同一展会节点推进。',
    result:
      '团队拿到的不只是一份资料汇总，还能直接看到哪些事可以办理、哪些仍需确认、何时需要准备素材。既有作品集记录了 若干 条视频、若干 篇推文、若干 张海报等内容交付；资源清单则记录了 若干 项资源条目与 若干 项需继续向主办方确认的事项。后两组数字表示清单范围，不表示资源已经全部领取成功。',
    action: '查看建材企业 A实习经历',
    aside: '实习页打开展会资源与邀请海报。',
    href: '/internships?work=building#industry-exhibition',
    photo: '/internships/building.webp',
    photoFocus: '50% 42%',
  },
  {
    id: 'education',
    index: '02',
    name: '教育机构 D：让多人执行时仍能回答同一个问题',
    title: '活动同时在多个社群传播，咨询怎样接得住？',
    body: '一次校园活动的宣传可以快速铺开，学生的疑问却不会按照海报上的栏目出现。课程、活动安排和报名方式被反复问到时，临场回答很难保证每位推广成员说法一致，也难把用户反馈带回下一次活动。',
    approach:
      '从实际咨询中整理高频问题，形成 FAQ、对外话术和执行材料；在宣传、咨询和报名之间明确交接内容。参与志愿者筛选与岗前培训时，让新加入的成员有材料可查，而不必只靠口头传达。',
    result:
      '既有简历记录了 若干 名校园推广志愿者的筛选与培训、覆盖 若干 所高校；同时记录了 若干 人次咨询、若干 人活动或课程报名。前一组是执行范围，后一组是咨询与报名记录。报名数字不是 FAQ 单独带来的结果。',
    action: '查看教育机构 D实习经历',
    aside: '没有可公开的聊天记录，实习页保留工作流程。',
    href: '/internships?work=education#education-service',
    photo: '/internships/education.webp',
    photoFocus: '50% 42%',
  },
  {
    id: 'machinery',
    index: '03',
    name: '工业设备企业 C：把内部产品信息交给海外沟通现场',
    title: '技术资料已经写好，海外客户能直接听懂吗？',
    body: '石材机械的产品介绍、性能优势和客户资料，原本服务于内部理解；海外展会需要的是准确、易于介绍的英文表达。同时，参展规模与筹备细节还需要和海外团队确认，不能一边信息未定，一边把内容当作最终版本交付。',
    approach:
      '参与 海外石材展会 展会筹备沟通，确认参展相关信息；整理石材切割设备资料，把产品介绍与优势转成可用于英文展示的材料。先确认事实，再调整表达，让负责展会介绍和客户沟通的人能够继续使用。',
    result:
      '英文材料不只是逐句翻译，而是连接了内部产品资料与海外客户沟通。这里没有足够可靠的个人结果数字，因此画面展示“原始资料—待确认信息—英文交付材料”的变化。',
    action: '查看工业设备企业 C实习经历',
    aside: '实习页只写已确认的转译范围，不展示整本产品手册。',
    href: '/internships?work=machinery#machinery-english',
    photo: '/internships/machinery.webp',
    photoFocus: '50% 42%',
  },
]

export const deliveryClose = {
  title: '交付的标准，\n是下一位参与者\n能否继续工作。',
  body: '建材企业 A把分散的展会资源整理成有节点的行动；\n教育机构 D让多人推广有共同的答疑材料；\n工业设备企业 C让经过确认的产品信息进入海外展示与沟通。',
  next: '三个现场的任务不同，推进的关键却相同：每一环都留下下一环能使用的东西。',
}
