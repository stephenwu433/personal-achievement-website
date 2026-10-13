import type { GalleryItem } from '@/components/ui/circular-gallery'

export const profile = {
  name: '作品集作者',
  github: 'https://github.com/stephenwu433',
  githubHandle: 'stephenwu433',
  portrait: '/photos/home-about.webp',
}

export type SiteSection = {
  id: 'about' | 'internships' | 'projects' | 'skills'
  href: string
  label: string
  english: string
  summary: string
}

export const sections: SiteSection[] = [
  {
    id: 'about',
    href: '/about',
    label: '个人介绍',
    english: 'About',
    summary: '六站城市短片：每段播完停下，点热点阅读，再继续下一站。',
  },
  {
    id: 'internships',
    href: '/internships',
    label: '实习目录',
    english: 'Internships',
    summary: '按时间列出实习：机构、岗位、时间和具体工作。',
  },
  {
    id: 'projects',
    href: '/projects',
    label: '项目列表',
    english: 'Projects',
    summary: '做过的项目，每件配一句说明、你的角色和链接。',
  },
  {
    id: 'skills',
    href: '/skills',
    label: '个人能力',
    english: 'Skills',
    summary: '按语言、工具和方向分组的能力。',
  },
]

/** 打开网站时的环形画廊。背景图之后再换。 */
export const homeGallery: GalleryItem[] = [
  {
    common: '个人介绍',
    binomial: 'About',
    href: '/about',
    photo: {
      url: '/photos/home-about.webp',
      text: '个人介绍',
      pos: '72% 42%',
      by: '',
    },
  },
  {
    common: '实习目录',
    binomial: 'Internships',
    href: '/internships',
    photo: {
      url: '/photos/home-internships.webp',
      text: '实习目录',
      pos: '78% 40%',
      by: '',
    },
  },
  {
    common: '项目列表',
    binomial: 'Projects',
    href: '/projects',
    photo: {
      url: '/photos/home-projects.webp',
      text: '项目列表',
      pos: '58% 36%',
      by: '',
    },
  },
  {
    common: '个人能力',
    binomial: 'Skills',
    href: '/skills',
    photo: {
      url: '/photos/home-skills.webp',
      text: '个人能力',
      pos: '64% 34%',
      by: '',
    },
  },
]

/** 个人能力拼贴上的五个格子。点进去进入对应能力的滚动页。 */
export const projectCells = [
  { id: 'insight', label: '商业洞察', x: 0, y: 0, width: 33, height: 35.5 },
  { id: 'strategy', label: '产品策略', x: 33, y: 0, width: 33.5, height: 35.5 },
  { id: 'ai', label: 'AI 产品设计', x: 66.5, y: 0, width: 33.5, height: 35.5 },
  { id: 'growth', label: '增长运营', x: 66.5, y: 35.5, width: 33.5, height: 29.5 },
  { id: 'delivery', label: '项目推进', x: 66.5, y: 65, width: 33.5, height: 35 },
]

/** 项目列表里真实打开的案例。能力页只链接到这里有的 id。 */
export const projectPieces = [
  { id: 'beverage', index: '01', title: '酒饮品牌', image: '/projects/beverage.webp' },
  { id: 'device', index: '02', title: '消费电子品牌', image: '/projects/device.webp' },
  { id: 'beauty', index: '03', title: '美妆品牌', image: '/projects/beauty.webp' },
  { id: 'hr', index: '04', title: 'HR 招聘', image: '/projects/hr.webp' },
  { id: 'sofa', index: '05', title: '海外压缩沙发', image: '/projects/sofa.webp' },
  { id: 'muse', index: '06', title: 'AI 穿搭实验', image: '/projects/styling.webp' },
  { id: 'planflow', index: '07', title: 'PlanFlow', image: '/projects/planflow.webp' },
] as const

export const projects = projectPieces.map((piece) => ({ title: piece.title, image: piece.image }))
