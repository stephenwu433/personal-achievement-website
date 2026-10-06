import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger)
if (!CustomEase.get('type-in')) CustomEase.create('type-in', 'M0,0 C0.22,0.84 0.18,1 1,1')

type Slot = {
  title: string
  hint: string
  image?: string
}

type Evidence = {
  kicker: string
  title: string[]
  lines: string[]
  steps?: string[]
}

type Module = {
  index: string
  title: string
  lines: string[]
  output?: string[]
  slots?: Slot[]
  cards?: Evidence[]
  notes?: { title: string; lines: string[] }[]
}

const results = [
  { value: '2 → 5', unit: '条/周', label: '发布频率' },
  { value: '10+', unit: '条', label: '海外推广视频' },
  { value: '3', unit: '篇', label: '英文推文' },
  { value: '5', unit: '张', label: '视觉海报' },
  { value: '5 万+', unit: '', label: '内容触达' },
  { value: '5+', unit: '套', label: '内容模板' },
]

const modules: Module[] = [
  {
    index: '01',
    title: '从市场信息到海外客户触达策略',
    lines: ['围绕马来西亚 B2B 建材市场，完成渠道研究、客户沟通路径设计和内容方向规划，', '为海外市场传播与展会获客提供策略依据。'],
    cards: [
      {
        kicker: '研究范围',
        title: ['马来西亚 B2B 建材市场'],
        lines: ['梳理户外广告、LinkedIn、WhatsApp', '等海外客户触达渠道，', '明确不同渠道的使用场景', '与传播形式。'],
      },
      {
        kicker: '关键判断',
        title: ['LinkedIn 建立认知，', 'WhatsApp 承接沟通'],
        lines: ['海外客户触达被拆成一条可执行的路径。'],
        steps: ['专业内容建立信任', '站内沟通', 'WhatsApp 深度沟通', '样品 / 验厂跟进'],
      },
      {
        kicker: '工作产出',
        title: ['形成市场策略资料包'],
        lines: ['输出市场渠道分析、客户沟通路径', '和海外内容方向，', '为后续展会传播、产品介绍', '和客户沟通提供统一参考。'],
      },
    ],
  },
  {
    index: '02',
    title: '将展会资源转化为可执行的传播计划',
    lines: ['围绕 ARCHIDEX 2026 展会，梳理展位、官网、媒体、商务配对和观众邀约等传播资源，', '整理领取渠道、时间节点和行动事项，形成展会传播清单与执行计划。'],
    output: ['展会资源清单', '展前行动计划', '媒体与观众邀约信息', '展会英文邀请物料'],
    slots: [
      { title: '文档封面', hint: '待放入截图' },
      { title: '展会资源分类', hint: '待放入截图' },
      { title: 'Action Checklist 行动清单', hint: '待放入截图' },
    ],
  },
  {
    index: '03',
    title: '将产品与业务信息转化为海外传播内容',
    lines: ['根据不同海外市场和传播节点，参与英文主题提炼、视觉设计和图文物料制作，', '将企业、产品和展会信息转化为适合海外受众理解和传播的内容。'],
    output: ['海外主题海报', 'ARCHIDEX 2026 邀请海报', '英文品牌与产品内容', '海外市场视觉物料'],
    slots: [
      { title: '香港澳门主题海报', hint: '待放入海报', image: '/internships/dongpeng/hongkong-macao.jpg' },
      { title: 'ARCHIDEX 2026 邀请海报', hint: '待放入海报', image: '/internships/dongpeng/archidex-2026.jpg' },
    ],
    notes: [
      {
        title: '海报 1 · 香港澳门主题内容',
        lines: ['围绕香港与澳门的建筑、城市和商业场景，', '提炼区域传播主题，将城市语境与东鹏海外业务结合，', '形成英文视觉内容。参与策划与制作。'],
      },
      {
        title: '海报 2 · ARCHIDEX 2026 展会邀请',
        lines: ['围绕海外客户邀约与展会传播需求，', '将展会时间、地点、展位和品牌信息转化为英文视觉物料。', '参与策划与制作。'],
      },
    ],
  },
]

const method = ['市场信息整理', '客户与渠道分析', '展会任务拆解', '英文内容与视觉设计', '传播物料交付']

export default function DongpengCase() {
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
    <div ref={rootRef} id="dongpeng-case" className="relative">
      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-8 pt-20 pb-4">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">可量化成果</p>
        <p data-rise className="mt-4 max-w-[40rem] text-[16px] leading-[1.75]">
          <span className="block">内容发布频率提升，并完成视频、推文、海报与可复用模板。</span>
          <span className="block">数字来自简历中已写明的交付记录。</span>
        </p>
        <ul className="mt-8 grid grid-cols-2 border border-black/15 sm:grid-cols-3 lg:grid-cols-6">
          {results.map((item) => (
            <li key={item.label} data-frame className="min-w-0 px-4 py-5 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-black/10">
              <p className="text-[clamp(22px,1.8vw,28px)] leading-none">{item.value}</p>
              <p className="mt-2 h-4 text-[12px] tracking-[0.04em] text-black/45">{item.unit}</p>
              <p className="mt-2 text-[13px] leading-[1.45] text-black/55">{item.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section data-reveal-block className="mx-auto w-full max-w-[860px] px-8 pt-12 pb-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">一、项目概述</p>
        <div className="mt-4 overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            <span className="block">梳理了马来西亚海外客户触达路径，形成市场传播策略；</span>
            <span className="block">同时参与海外内容交付，推动发布频率提升，</span>
            <span className="block">完成多类传播物料并沉淀可复用模板。</span>
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1080px] px-8 pt-16">
        <p className="text-[12px] tracking-[0.28em] text-black/45">二、工作模块</p>
      </section>

      {modules.map((item) => (
        <article key={item.index} data-reveal-block className="mx-auto w-full max-w-[1080px] px-8 py-12">
          <p data-rise className="text-[12px] tracking-[0.22em] text-black/40">{item.index}</p>
          <div className="mt-3 overflow-hidden">
            <h3 data-title className="text-[clamp(32px,2.8vw,44px)] leading-[1.25] font-normal whitespace-nowrap">
              {item.title}
            </h3>
          </div>
          <div className="mt-5">
            {item.lines.map((line) => (
              <p key={line} data-rise className="text-[16px] leading-[1.75]">
                {line}
              </p>
            ))}
            {item.output ? <p data-rise className="mt-4 text-[13px] leading-[1.6] text-black/50">{item.output.join(' · ')}</p> : null}
          </div>
          {item.notes ? (
            <div className="mt-6 grid gap-x-12 gap-y-4 md:grid-cols-2">
              {item.notes.map((note) => (
                <p key={note.title} data-rise className="text-[13px] leading-[1.7] text-black/60">
                  <span className="block text-[#1c1c1c]">{note.title}</span>
                  {note.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          ) : null}
          {item.cards ? (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {item.cards.map((card) => (
                <div key={card.kicker} data-frame className="border border-black/15 bg-white/45 px-5 py-6">
                  <p className="text-[12px] tracking-[0.18em] text-black/40">{card.kicker}</p>
                  <p className="mt-3 text-[18px] leading-[1.45]">
                    {card.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                  {card.lines.map((line) => (
                    <p key={line} className="mt-3 text-[14px] leading-[1.7] text-black/65">
                      {line}
                    </p>
                  ))}
                  {card.steps ? (
                    <ol className="mt-4 space-y-2">
                      {card.steps.map((step, index) => (
                        <li key={step} className="text-[14px] leading-[1.55]">
                          <span className="mr-2 text-black/35">0{index + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {item.slots ? (
            <div className={`mt-8 grid gap-5 ${item.slots.some((slot) => slot.image) ? 'max-w-[760px] grid-cols-2' : 'grid-cols-3'}`}>
              {item.slots.map((slot) => (
                <figure key={slot.title} data-frame className="min-w-0">
                  <div className={`flex items-center justify-center overflow-hidden border border-black/15 bg-white/45 text-center text-[13px] text-black/40 ${slot.image ? 'aspect-[3/4]' : 'h-[200px] px-4'}`}>
                    {slot.image ? <img src={slot.image} alt={slot.title} className="h-full w-full object-contain" /> : slot.hint}
                  </div>
                  <figcaption className="mt-3 text-[15px] leading-[1.4]">{slot.title}</figcaption>
                </figure>
              ))}
            </div>
          ) : null}
        </article>
      ))}

      <section data-reveal-block className="mx-auto w-full max-w-[860px] px-8 py-20">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">三、我的工作方式</p>
        <div className="mt-4 overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            <span className="block">先梳理市场与客户信息，再拆解展会和传播任务，</span>
            <span className="block">最后通过英文文案、视觉物料和资料整理完成内容交付。</span>
          </p>
        </div>
        <ol className="mt-8 space-y-3">
          {method.map((step, index) => (
            <li key={step} data-rise className="grid grid-cols-[2.5rem_1fr] gap-3 text-[15px] leading-[1.7]">
              <span className="text-black/40">0{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

    </div>
  )
}
