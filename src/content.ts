import type { GalleryItem } from '@/components/ui/circular-gallery'

export const profile = {
  name: 'Stephen舞',
  github: 'https://github.com/stephenwu433',
  githubHandle: 'stephenwu433',
  portrait: '/photos/home-about.jpg',
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
      url: '/photos/home-about.jpg',
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
      url: '/photos/home-internships.jpg',
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
      url: '/photos/home-projects.jpg',
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
      url: '/photos/home-skills.jpg',
      text: '个人能力',
      pos: '64% 34%',
      by: '',
    },
  },
]

/** 个人能力拼贴上的五个格子。点击后的展开页之后再接。 */
export const projectCells = [
  { id: 'diagrams', label: '商业洞察', x: 0, y: 0, width: 33, height: 35.5 },
  { id: 'charts', label: '产品策略', x: 33, y: 0, width: 33.5, height: 35.5 },
  { id: 'desk', label: 'AI 产品设计', x: 66.5, y: 0, width: 33.5, height: 35.5 },
  { id: 'globe', label: '增长运营', x: 66.5, y: 35.5, width: 33.5, height: 29.5 },
  { id: 'map', label: '项目推进', x: 66.5, y: 65, width: 33.5, height: 35 },
]

export const projects = [
  { title: '梅见', image: '/projects/meijian.png' },
  { title: '安克创新', image: '/projects/anker.png' },
  { title: '欧莱雅', image: '/projects/loreal.png' },
  { title: 'HR 招聘', image: '/projects/hr.png' },
  { title: '海外压缩沙发', image: '/projects/sofa.png' },
  { title: 'Muse Select', image: '/projects/muse-select.png' },
  { title: 'PlanFlow', image: '/projects/planflow.png' },
]
