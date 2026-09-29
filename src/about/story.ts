import { profile } from '@/src/content'

export type StoryHotspot = {
  id: string
  label: string
  x: number
  y: number
  paragraphs: string[]
  link?: { href: string; label: string }
}

export type StoryStation = {
  id: string
  index: string
  title: string
  place: string
  still: string
  hotspots: StoryHotspot[]
}

export type VideoSource = {
  mp4: string
  webm?: string
}

/**
 * 正式城市短片的暂停点（秒），与六站一一对应。
 * 只有 videoSources 六项都填上、并且文件能作为视频加载时才会使用。
 */
export const pauseTimes = [4, 8, 12, 16, 20, 24] as const

/**
 * 六段真实图生视频。现在全部留空，页面保持「关键帧交互预览」。
 * 六项都换成真实文件后才会进入正式视频模式；不要用静图交叉淡入淡出填这里。
 */
export const videoSources: Array<VideoSource | null> = [null, null, null, null, null, null]

export function segmentDuration(index: number) {
  const previous = index === 0 ? 0 : pauseTimes[index - 1]
  return pauseTimes[index] - previous
}

/** 正式介绍文案。顺序：创意街区 → 独立书店 → 城市路口 → 图书馆 → 游戏购物街区 → 江边步道。 */
export const storyStations: StoryStation[] = [
  {
    id: 'introduction',
    index: '01',
    title: '初见',
    place: '创意街区',
    still: '/city/city-story-01-introduction.jpg',
    hotspots: [
      {
        id: 'name',
        label: '姓名卡',
        x: 22,
        y: 46,
        paragraphs: [
          '你好，我是 Stephen 吴沛鸿',
          '我目前就读于暨南大学国际经济与贸易专业。',
          '大学的学习让我经常接触商业、市场、品牌和不同国家之间的连接方式。刚开始时，我对未来的理解比较宽泛，觉得自己可能会沿着经贸相关的方向继续走下去。后来接触到 AI、产品和数字化工具，我发现自己会很自然地被这些东西吸引。',
          '我喜欢看一项技术怎样改变人的工作方式，也会关注一个产品为什么能被真正使用。很多时候，功能本身并不难理解，真正困难的是它能不能进入具体的生活和工作场景，能不能让人愿意相信、愿意持续使用。',
          '现在的我正在往 AI 产品方向靠近。这条路还在探索中，但我已经越来越确定：我想把对 AI、商业和用户体验的兴趣放在同一个方向里慢慢做深。',
        ],
      },
    ],
  },
  {
    id: 'ai-product',
    index: '02',
    title: 'AI 与产品',
    place: '独立书店',
    still: '/city/city-story-02-ai-product.jpg',
    hotspots: [
      {
        id: 'ai',
        label: 'AI',
        x: 55,
        y: 84,
        paragraphs: [
          '我对 AI 的兴趣，来自它带来的可能性。',
          '它可以处理大量信息，可以辅助人完成重复任务，也可以给人提供新的思考角度。但我觉得更有意思的问题是：当 AI 越来越强之后，人到底应该把哪些工作交给它，哪些判断依然需要自己完成？',
        ],
      },
      {
        id: 'product',
        label: '产品',
        x: 48,
        y: 52,
        paragraphs: [
          '我喜欢看一项技术怎样改变人的工作方式，也会关注一个产品为什么能被真正使用。很多时候，功能本身并不难理解，真正困难的是它能不能进入具体的生活和工作场景，能不能让人愿意相信、愿意持续使用。',
          '我希望自己以后能参与到这类产品的设计里。让 AI 的能力真正服务于人，也让使用者知道它能做到什么、暂时做不到什么。技术发展很快，产品设计需要把它放回真实世界里看。',
        ],
      },
      {
        id: 'world-model',
        label: '世界模型',
        x: 44,
        y: 22,
        paragraphs: [
          '我对世界模型尤其感兴趣。未来的 AI 如果能更好地理解环境、理解变化、理解任务之间的关联，人和 AI 的关系可能会更接近真正的协同。人提出目标、做价值判断、承担责任；AI 在信息整理、推演和执行上提供帮助。这样的关系比单纯追求“更聪明的工具”更值得研究。',
        ],
      },
    ],
  },
  {
    id: 'direction',
    index: '03',
    title: '我的方向',
    place: '城市路口',
    still: '/city/city-story-03-direction.jpg',
    hotspots: [
      {
        id: 'think-first',
        label: '先想清楚',
        x: 84,
        y: 34,
        paragraphs: [
          '如果用 MBTI 描述自己，我是 INTJ。',
          '我习惯先自己想一想，弄清楚一件事的逻辑和意义，再决定要不要投入。很多事情上，我会有比较强的目标感；一旦认定方向，就会希望自己能长期做下去，而不是只凭一时情绪开始。',
        ],
      },
      {
        id: 'try',
        label: '愿意尝试',
        x: 24,
        y: 68,
        paragraphs: [
          '以前我会更担心选择对不对，也会花很多时间比较不同的可能。现在我依然会认真思考，但开始更愿意为自己的选择负责。方向感对我来说不是一个突然降临的答案，它是在学习、尝试、反复调整之后慢慢清楚起来的。',
          '我希望自己保持理性，也保留对新事物的好奇。能独立思考，同时也能听见不同的声音。',
        ],
      },
    ],
  },
  {
    id: 'effort',
    index: '04',
    title: '努力与成功',
    place: '图书馆',
    still: '/city/city-story-04-effort.jpg',
    hotspots: [
      {
        id: 'notebook',
        label: '笔记本',
        x: 16,
        y: 88,
        paragraphs: [
          '我知道很多目标需要很长时间才能看到结果。学习新的知识、建立能力、找到适合自己的位置，都不会一开始就很顺利。这个过程可能会有反复，也可能会遇到不知道该怎么走的时候。',
          '但我比较愿意坚持。只要我还认可一件事，我就愿意继续学、继续做、继续把它往前推一点。',
        ],
      },
      {
        id: 'goal',
        label: '目标',
        x: 12,
        y: 40,
        paragraphs: [
          '我对成功是有期待的。',
          '我希望未来拥有足够的能力，去选择自己真正想做的事；也希望做出的产品和工作，能带来一点真实的价值。对我来说，成功包含成长、选择权，也包含对自己投入时间的认可。',
          '热爱并不能解决所有困难，但它能让我在不顺的时候，依然记得自己为什么开始。',
        ],
      },
    ],
  },
  {
    id: 'life',
    index: '05',
    title: '生活里的我',
    place: '游戏购物街区',
    still: '/city/city-story-05-life.jpg',
    hotspots: [
      {
        id: 'console',
        label: '掌机',
        x: 58,
        y: 70,
        paragraphs: [
          '我喜欢打游戏。',
          '游戏能让我进入一个完整的世界，感受它的规则、叙事和节奏。有些游戏让我喜欢它的故事，有些游戏吸引我的是策略和挑战，还有些游戏会让我注意到细节：一个任务怎么引导玩家，一段音乐怎样调动情绪，一个互动为什么会让人愿意继续探索。',
          '这也是我喜欢产品的一个原因。好的体验通常不是偶然出现的，它来自很多细小设计共同作用后的结果。',
        ],
      },
      {
        id: 'bag',
        label: '购物袋',
        x: 24,
        y: 72,
        paragraphs: [
          '我也喜欢去购物，看看不同品牌的产品、空间和表达方式。一个包装、一家店的陈列、一件衣服的设计，都会影响人对品牌的第一感觉。我会留意这些细节，也会思考它们为什么能让人停下来、产生兴趣，甚至愿意分享给别人。',
          '这些兴趣看起来很日常，但它们让我对“体验”这件事有了更具体的感受。',
        ],
      },
    ],
  },
  {
    id: 'future',
    index: '06',
    title: '还在路上',
    place: '江边步道',
    still: '/city/city-story-06-future.jpg',
    hotspots: [
      {
        id: 'future',
        label: '未来',
        x: 28,
        y: 40,
        paragraphs: [
          '现在的我，正在把想法变成方向。',
          '现在的 Stephen 吴沛鸿，仍然处在一个不断学习和探索的阶段。',
          '我还没有把所有问题都想清楚，也不觉得人生必须按照一条固定路线前进。但我已经比以前更了解自己：我喜欢 AI，喜欢产品，也喜欢研究技术、商业和人之间会产生什么新的连接。',
          '我会继续努力，把兴趣变成能力，把想法变成真正能落地的东西。希望未来的我，既能保持对新世界的好奇，也能有足够的执行力，把自己想做的事做出来。',
          '这个网站记录的是现在的我。以后，它也会记录我继续成长的过程。',
        ],
      },
      {
        id: 'contact',
        label: '联系我',
        x: 50,
        y: 62,
        paragraphs: [],
        link: { href: profile.github, label: `github.com/${profile.githubHandle}` },
      },
    ],
  },
]
