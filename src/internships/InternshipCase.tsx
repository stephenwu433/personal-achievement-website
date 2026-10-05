import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger)
if (!CustomEase.get('type-in')) CustomEase.create('type-in', 'M0,0 C0.22,0.84 0.18,1 1,1')

type Module = {
  index: string
  title: string
  lines: string[]
}

type Card = {
  index: string
  title: string
  lines: string[]
}

type MaterialGroup = {
  title: string
  lines: string[]
  cards: Card[]
}

type CaseContent = {
  title: string[]
  overview: string[]
  modules: Module[]
  materialsNote?: string[]
  materials: MaterialGroup[]
  method: string[]
  proof: string[]
  boundary?: string[]
}

const cases: Record<string, CaseContent> = {
  gaodun: {
    title: ['高顿教育｜校园市场与用户服务'],
    overview: ['围绕校园用户的咨询、活动参与和课程转化，', '参与校园市场推广、用户答疑与服务内容标准化。'],
    modules: [
      {
        index: '01',
        title: '用户问题整理',
        lines: ['基于校园用户咨询和活动反馈，梳理高频问题与典型需求，', '识别学生在课程、活动和求职信息获取过程中的主要疑问。'],
      },
      {
        index: '02',
        title: '服务内容标准化',
        lines: ['将分散的用户问题整理为 FAQ、咨询话术和培训材料，', '帮助校园推广团队形成更统一的沟通方式和服务流程。'],
      },
      {
        index: '03',
        title: '校园活动与渠道协同',
        lines: ['参与校园活动宣传、社群触达和学生咨询承接，', '连接活动传播、用户沟通与报名转化等环节。'],
      },
    ],
    materialsNote: ['没有可公开的活动海报或聊天截图，这里用工作流程代替。'],
    materials: [
      {
        title: '从用户问题到服务流程',
        lines: ['把咨询和活动反馈收成可以复用的服务内容，而不是单次回答。'],
        cards: [
          { index: '01', title: '用户问题', lines: ['从咨询和活动反馈里整理高频疑问与典型需求。'] },
          { index: '02', title: 'FAQ', lines: ['把重复出现的问题收成可查阅的问答。'] },
          { index: '03', title: '标准话术', lines: ['整理对外说明，让校园推广团队的说法更一致。'] },
          { index: '04', title: '服务流程', lines: ['把活动传播、用户沟通和报名转化接成一条路径。'] },
        ],
      },
    ],
    method: ['用户反馈收集', '高频问题归纳', 'FAQ 与话术整理', '团队培训与使用', '服务反馈优化'],
    proof: ['形成了从一线用户反馈中识别需求，', '并将需求转化为标准化服务内容的工作方法。'],
  },
  huigu: {
    title: ['佛山慧谷科技｜海外展会与产品沟通'],
    overview: ['参与海外展会筹备和国际客户沟通，', '将石材机械产品、展会信息和企业资料转化为适合海外客户理解的英文材料。'],
    modules: [
      {
        index: '01',
        title: '海外展会沟通',
        lines: ['参与意大利 Marmomac 展会相关事项沟通，', '通过英文邮件与海外基地确认展会规模、参展细节和筹备信息。'],
      },
      {
        index: '02',
        title: '产品资料本地化',
        lines: ['整理并翻译石材切割机产品介绍、产品优势和客户分布资料，', '协助制作面向国际客户的企业与产品展示材料。'],
      },
      {
        index: '03',
        title: '信息转译与客户表达',
        lines: ['将企业内部的产品信息和技术表达转化为更清晰的英文市场语言，', '支持展会现场介绍和海外客户沟通。'],
      },
    ],
    materialsNote: ['邮件、翻译稿和产品手册的原始页面未放入。', '企业产品手册不作为个人作品整本展示。'],
    materials: [
      {
        title: '展会材料如何被转译',
        lines: ['确认过的信息先整理，再写成海外客户能看懂的英文表达。'],
        cards: [
          { index: '01', title: '展会信息', lines: ['规模、参展细节和筹备事项，来自与海外基地的沟通。'] },
          { index: '02', title: '产品资料', lines: ['介绍、优势和客户分布，整理成可对照的中英文资料。'] },
          { index: '03', title: '市场语言', lines: ['把内部的技术说法改成展会介绍和客户沟通能使用的表达。'] },
        ],
      },
    ],
    method: ['展会需求确认', '海外信息沟通', '产品资料整理', '英文内容转译', '展会材料交付'],
    proof: ['形成了将复杂产品信息转化为海外客户可理解的展示内容和沟通材料的能力。'],
    boundary: ['产品手册与企业介绍仅作为内容依据；无法确认个人贡献的原始文件不放入页面。'],
  },
  zhijunzhu: {
    title: ['知君竹科技传媒', 'AI 辅助的品牌增长与内容策略'],
    overview: ['负责品牌增长项目中的用户洞察、内容策略、投放优化与脚本工作流，', '将用户需求和产品卖点转化为可执行的内容方案和复用机制。'],
    modules: [
      {
        index: '01',
        title: '用户与竞品研究',
        lines: ['围绕品牌目标用户和竞品内容表现进行分析，', '梳理不同人群的需求、关注点和内容偏好，', '为后续内容方向和传播策略提供依据。'],
      },
      {
        index: '02',
        title: '内容策略与投放方案',
        lines: ['将用户需求和产品卖点转化为内容 Brief、选题方向、', '达人合作要求和投放方案，并根据不同用户阶段设计差异化的内容节奏。'],
      },
      {
        index: '03',
        title: '内容生产工作流',
        lines: ['针对科里芙品牌项目和海外压缩沙发项目，', '建立从用户痛点、产品卖点到内容脚本和人工审核的结构化流程，', '推动内容生产从单次创作转向可复用的工作机制。'],
      },
      {
        index: '04',
        title: '数据反馈与策略迭代',
        lines: ['结合内容表现、用户互动和询盘反馈，', '持续调整选题、钩子、卖点表达和咨询引导，', '推动内容策略与业务目标保持一致。'],
      },
    ],
    materialsNote: ['整份脚本和客户档案不上页。下面保留的是判断顺序：用户需求、内容结构、审核规则、反馈迭代。'],
    materials: [
      {
        title: '科里芙品牌内容增长',
        lines: ['围绕运动服饰品牌的用户分层、内容矩阵和投放优化，', '参与建立从用户研究到内容验证的品牌增长方案。'],
        cards: [
          { index: '01', title: '用户需求', lines: ['按人群整理需求、关注点和内容偏好，作为选题依据。'] },
          { index: '02', title: '内容结构', lines: ['把卖点和用户阶段拆成选题方向、内容矩阵和达人合作要求。'] },
          { index: '03', title: '审核规则', lines: ['上线前按筛选标准判断内容，而不是只看成品。'] },
          { index: '04', title: '反馈迭代', lines: ['用内容表现和互动，回到选题、钩子与卖点表达。'] },
        ],
      },
      {
        title: '海外压缩沙发内容增长',
        lines: ['围绕海外客户对产品功能、空间使用和采购信息的关注点，', '设计产品卖点、短视频脚本和询盘引导，形成可复用的脚本生产与审核流程。'],
        cards: [
          { index: '01', title: '用户需求', lines: ['功能、空间使用和采购信息，是脚本要回答的问题。'] },
          { index: '02', title: '内容结构', lines: ['卖点、脚本段落和中英文表达按同一结构组织。'] },
          { index: '03', title: '审核规则', lines: ['脚本先分类，再经人工审核，然后才进入使用。'] },
          { index: '04', title: '询盘迭代', lines: ['客户沟通和询盘反馈，用来调整引导和卖点说法。'] },
        ],
      },
    ],
    method: ['用户与竞品研究', '需求与卖点提炼', 'Brief 与脚本设计', '内容生产与人工审核', '投放 / 询盘反馈', '策略迭代与机制沉淀'],
    proof: ['形成了从用户洞察、内容方案设计到反馈迭代和工作流沉淀的完整增长方法，', '能够把模糊的营销需求转化为结构化内容任务。'],
    boundary: ['科里芙方案与压缩沙发脚本为项目协作成果；完整文档和客户档案仅作背景，不整份展示。'],
  },
}

function CaseStudy({ content }: { content: CaseContent }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const scroller = root.closest('[data-internship-sheet]')
      if (!(scroller instanceof HTMLElement) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const ease = 'type-in'
      gsap.utils.toArray<HTMLElement>('[data-reveal-block]', root).forEach((block) => {
        const title = block.querySelector('[data-title]')
        const lines = block.querySelectorAll('[data-rise]')
        const frames = block.querySelectorAll('[data-frame]')
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            scroller,
            start: 'top 82%',
            once: true,
          },
        })
        if (title) timeline.from(title, { yPercent: 110, duration: 0.85, ease }, 0.1)
        if (lines.length) timeline.from(lines, { y: 20, autoAlpha: 0, duration: 0.75, stagger: 0.16, ease }, 0.18)
        if (frames.length) timeline.from(frames, { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease }, 0.4)
      })
      ScrollTrigger.refresh()
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="relative">
      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-8 pt-20 pb-2">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">项目标题</p>
        <div className="mt-3 overflow-hidden">
          <h2 data-title className="text-[clamp(28px,3vw,40px)] leading-[1.35] font-normal">
            {content.title.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>
        </div>
      </section>

      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-8 pt-12 pb-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">一、项目概述</p>
        <div className="mt-4 overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            {content.overview.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1080px] px-8 pt-12">
        <p className="text-[12px] tracking-[0.28em] text-black/45">二、工作模块</p>
      </section>

      {content.modules.map((item) => (
        <article key={item.index} data-reveal-block className="mx-auto w-full max-w-[1080px] px-8 py-10">
          <p data-rise className="text-[12px] tracking-[0.22em] text-black/40">{item.index}</p>
          <div className="mt-3 overflow-hidden">
            <h3 data-title className="text-[clamp(32px,2.8vw,44px)] leading-[1.25] font-normal whitespace-nowrap">
              {item.title}
            </h3>
          </div>
          <div className="mt-5 max-w-[46rem]">
            {item.lines.map((line) => (
              <p key={line} data-rise className="text-[16px] leading-[1.75]">
                {line}
              </p>
            ))}
          </div>
        </article>
      ))}

      <section className="mx-auto w-full max-w-[1080px] px-8 pt-8">
        <p className="text-[12px] tracking-[0.28em] text-black/45">三、代表性素材</p>
        {content.materialsNote ? (
          <div className="mt-4 max-w-[40rem] text-[14px] leading-[1.8] text-black/55">
            {content.materialsNote.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {content.materials.map((group) => (
        <article key={group.title} data-reveal-block className="mx-auto w-full max-w-[1080px] px-8 py-10">
          <div className="overflow-hidden">
            <h3 data-title className="max-w-[18em] text-[clamp(26px,2.4vw,36px)] leading-[1.3] font-normal">
              {group.title}
            </h3>
          </div>
          <div className="mt-4 max-w-[42rem]">
            {group.lines.map((line) => (
              <p key={line} data-rise className="text-[16px] leading-[1.75]">
                {line}
              </p>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {group.cards.map((card) => (
              <div key={card.title} data-frame className="border border-black/15 bg-white/45 px-5 py-5">
                <p className="text-[12px] tracking-[0.18em] text-black/40">{card.index}</p>
                <p className="mt-3 text-[16px] leading-[1.45]">{card.title}</p>
                {card.lines.map((line) => (
                  <p key={line} className="mt-2 text-[14px] leading-[1.7] text-black/60">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </article>
      ))}

      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-8 py-16">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">四、工作方法</p>
        <ol className="mt-8 space-y-3">
          {content.method.map((step, index) => (
            <li key={step} data-rise className="grid grid-cols-[2.5rem_1fr] gap-3 text-[15px] leading-[1.7]">
              <span className="text-black/40">0{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-8 pt-4 pb-28">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">五、能力沉淀</p>
        <div className="mt-4 overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            {content.proof.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
        {content.boundary ? (
          <div className="mt-5 text-[14px] leading-[1.8] text-black/60">
            {content.boundary.map((line) => (
              <p key={line} data-rise>
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default function InternshipCase({ id }: { id: string }) {
  const content = cases[id]
  if (!content) return null
  return <CaseStudy content={content} />
}
