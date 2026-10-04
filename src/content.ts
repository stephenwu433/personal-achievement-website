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
    summary: '按光盘目录翻实习：拖动或滚轮切换，左侧是机构、岗位和时间。',
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

export type InternshipNote = {
  source: string
  quote: string
}

export type Internship = {
  slug: string
  title: string
  organization: string
  role: string
  period: string
  work: string[]
  summary: string
  note: InternshipNote
  disc: {
    from: string
    to: string
    ink: string
    motif: 'field' | 'lines' | 'block' | 'warm'
  }
}

/** 四段实习还没有具体机构。目录先按这个顺序排，补上文字后直接改这里。 */
export const internships: Internship[] = [
  {
    slug: '01',
    title: '第一段',
    organization: '机构待补充',
    role: '岗位待补充',
    period: '时间待补充',
    work: ['具体工作待补充'],
    summary: '这一段的机构、岗位、起止时间和具体工作还没有放上来。补上之后，光盘和左侧条目会换成那段实习。',
    note: { source: '这一段', quote: '照片和经历待放入' },
    disc: { from: '#d2c07a', to: '#3d3416', ink: '#1c1608', motif: 'field' },
  },
  {
    slug: '02',
    title: '第二段',
    organization: '机构待补充',
    role: '岗位待补充',
    period: '时间待补充',
    work: ['具体工作待补充'],
    summary: '这一段的机构、岗位、起止时间和具体工作还没有放上来。补上之后，光盘和左侧条目会换成那段实习。',
    note: { source: '做过的事', quote: '具体工作待放入' },
    disc: { from: '#d5e0e8', to: '#243646', ink: '#f7f4ee', motif: 'lines' },
  },
  {
    slug: '03',
    title: '第三段',
    organization: '机构待补充',
    role: '岗位待补充',
    period: '时间待补充',
    work: ['具体工作待补充'],
    summary: '这一段的机构、岗位、起止时间和具体工作还没有放上来。补上之后，光盘和左侧条目会换成那段实习。',
    note: { source: '起止', quote: '时间还没写上' },
    disc: { from: '#f6f1e7', to: '#e7d7c4', ink: '#9d1c1c', motif: 'block' },
  },
  {
    slug: '04',
    title: '第四段',
    organization: '机构待补充',
    role: '岗位待补充',
    period: '时间待补充',
    work: ['具体工作待补充'],
    summary: '这一段的机构、岗位、起止时间和具体工作还没有放上来。补上之后，光盘和左侧条目会换成那段实习。',
    note: { source: '下一段', quote: '内容补上就会出现' },
    disc: { from: '#ffb067', to: '#c2410c', ink: '#2a1206', motif: 'warm' },
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
