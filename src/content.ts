import type { GalleryItem } from '@/components/ui/circular-gallery'

export const profile = {
  name: 'Stephen舞',
  github: 'https://github.com/stephenwu433',
  githubHandle: 'stephenwu433',
  portrait: '/photos/about.png',
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
    summary: '你是谁，现在在做什么，别人可以怎么找到你。',
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
    photo: {
      url: '/photos/about.png',
      text: '个人介绍',
      pos: '72% 42%',
      by: '',
    },
  },
  {
    common: '实习目录',
    binomial: 'Internships',
    photo: {
      url: '/photos/internships.png',
      text: '实习目录',
      pos: '78% 40%',
      by: '',
    },
  },
  {
    common: '项目列表',
    binomial: 'Projects',
    photo: {
      url: '/photos/projects.png',
      text: '项目列表',
      pos: '58% 36%',
      by: '',
    },
  },
  {
    common: '个人能力',
    binomial: 'Skills',
    photo: {
      url: '/photos/skills.png',
      text: '个人能力',
      pos: '64% 34%',
      by: '',
    },
  },
]

export const projects = [
  {
    title: 'Planflow',
    summary: '公开仓库中的项目。仓库里还没有详细介绍，源代码和后续更新都在 GitHub。',
    href: 'https://github.com/stephenwu433/planflow-app',
  },
  {
    title: '智能售后服务 Agent',
    summary: '聚焦故障定位、排障引导，以及升级到人工处理的闭环。',
    href: 'https://github.com/stephenwu433/smart-service-agent',
  },
]
