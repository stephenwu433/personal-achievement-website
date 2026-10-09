/** Muse Select 只使用已给出的内容实验结果，不补粉丝、收入、转化或商业合作。 */

export const museHero = {
  index: '06',
  kicker: 'PROJECT ARCHIVE',
  title: ['Muse Select', 'AI 穿搭内容实验'],
  english: 'MUSESELECT / AI FASHION CONTENT LAB',
  lead: ['把“今天穿什么”转化为', '可以被点击、保存和讨论的视觉内容。'],
  paragraphs: [
    '项目围绕 AI 穿搭、风格识别、色彩分析和场景化搭配展开。',
    '内容不只展示一套衣服，而是把用户的模糊偏好变成可以立刻理解的风格选择。',
  ],
  panel: ['AI / STYLE / COLOR / MOOD', 'VISUAL CONTENT', 'FOR EVERYDAY CHOICES'],
  role: 'AI 穿搭内容策划与视觉设计',
  period: '2026',
  type: 'AI 穿搭账号图文内容增长',
}

export const museSignals = {
  kicker: 'PROJECT SIGNALS',
  title: '内容实验结果',
  stats: [
    { value: '10 篇', label: '图文内容发布' },
    { value: '2万+', label: '累计浏览量' },
    { value: '500+', label: '单篇最高点赞' },
    { value: '10 个', label: '内容主题方向' },
    { value: '62 张', label: '视觉素材资产' },
  ],
  note: '以少量图文测试 AI 穿搭内容的点击与互动表现，并沉淀为可复用的视觉内容资产。',
}

export const museJudgment = {
  kicker: 'FROM OUTFIT TO CONTENT',
  title: '穿搭不是单一答案，\n而是一组选择',
  items: [
    { index: '01', title: '场景', body: '上课、通勤、约会、购物、节日等情境，比“推荐一套衣服”更容易让用户代入。' },
    { index: '02', title: '风格', body: 'Clean Fit、复古、轻熟、松弛、个性风格，帮助用户先找到自己想表达的状态。' },
    { index: '03', title: '色彩', body: '色彩季型、金属饰品、肤色与面料关系，让搭配建议具有可解释性。' },
    { index: '04', title: '单品', body: '从衣柜已有单品出发，提供不同场景下的组合方式，降低“必须买新衣服”的压力。' },
    { index: '05', title: '情绪', body: '把穿搭与“今天想成为什么样的人”连接，让内容不只停留在功能建议。' },
  ],
  close: 'AI 的作用不是替用户决定穿什么，而是把原本模糊的风格偏好变成可比较、可选择的视觉方案。',
}

export const visualTopics = [
  { id: 'ai', label: 'AI 视觉实验', path: 'AI files' },
  { id: 'outfits', label: 'AI 搭配方案', path: 'AI搭10套' },
  { id: 'clean-fit', label: 'Clean Fit', path: 'clean fit' },
  { id: 'qixi', label: '节日穿搭情绪', path: '七夕 files' },
  { id: 'color', label: '色彩测试', path: '颜色测试' },
  { id: 'gold', label: '黄金饰品搭配', path: '黄金' },
  { id: 'style', label: '风格识别', path: '风格' },
  { id: 'styling', label: '穿搭灵感', path: '穿搭' },
  { id: 'analysis', label: '风格分析', path: '分析' },
  { id: 'commerce', label: '消费决策', path: '变现' },
] as const

export const museCovers = [
  { topicId: 'ai', file: 'AI 1.png', path: 'AI files/AI 1.png' },
  { topicId: 'color', file: '颜色1.png', path: '颜色测试/颜色1.png' },
  { topicId: 'gold', file: '黄金 1.png', path: '黄金/黄金 1.png' },
  { topicId: 'styling', file: '穿搭 1.png', path: '穿搭/穿搭 1.png' },
  { topicId: 'clean-fit', file: 'clean fit 1.png', path: 'clean fit/clean fit 1.png' },
] as const

export const museArchive = {
  kicker: 'VISUAL ARCHIVE',
  title: 'AI 穿搭内容素材档案',
  lead: '10 个内容方向，62 张视觉素材。点击打开，查看不同内容主题如何被组织成图文表达。',
}

export const museMethod = {
  kicker: 'CONTENT METHOD',
  title: '从模糊偏好到可保存的搭配方案',
  flow: ['用户情绪或场景', '拆解风格问题', 'AI 生成视觉候选', '整理成图文叙事', '测试点击与互动反馈'],
  cards: [
    { index: 'A', title: '场景型内容', body: '例如上课、通勤、节日、约会。用明确场景降低用户理解成本。' },
    { index: 'B', title: '知识型内容', body: '例如色彩季型、面料、配色、饰品选择。让审美建议更有解释性。' },
    { index: 'C', title: '灵感型内容', body: '例如多风格人格、Clean Fit、风格拼贴。用视觉冲击吸引用户停留和分享。' },
  ],
}

export const museDirections = {
  kicker: 'EDITORIAL DIRECTIONS',
  title: '内容不是重复发图',
  note: '将热点、美学判断和可执行建议放进同一张图文中。',
  items: [
    'AI 看完收藏夹，识别你的风格倾向',
    '七夕穿什么：从穿搭进入情绪表达',
    '你的色彩季型是什么',
    '黄金饰品怎样戴得更年轻',
    'Clean Fit 之后，年轻人开始研究哪一种 Fit',
  ],
}

export const museWork = {
  kicker: 'WHAT I BUILT',
  title: '我完成的不只是视觉生成',
  items: [
    { index: '01', title: '内容选题', body: '从场景、风格、色彩和情绪切入，确定更容易让用户产生代入感的话题。' },
    { index: '02', title: 'AI 视觉方向', body: '通过不同视觉语言生成搭配候选，包括杂志感、剪贴簿、色彩研究和单品拆解。' },
    { index: '03', title: '图文结构', body: '将一张好看的图拆成封面钩子、审美解释、搭配建议和保存理由。' },
    { index: '04', title: '内容测试', body: '用少量图文观察浏览和点赞反馈，判断哪些视觉主题更容易获得用户注意。' },
  ],
  close: 'Muse Select 让我开始理解：AI 内容的价值不只在生成图片，更在于它能否帮助用户更快表达、理解和选择自己的风格。',
}
