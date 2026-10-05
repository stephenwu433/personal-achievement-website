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
}

type Module = {
  index: string
  title: string
  lines: string[]
  output: string[]
  slots: Slot[]
  notes?: { title: string; lines: string[] }[]
}

const modules: Module[] = [
  {
    index: '01',
    title: '从市场信息中识别客户触达路径',
    lines: ['围绕马来西亚 B2B 建材市场，梳理户外广告、LinkedIn、WhatsApp 等客户触达渠道，', '分析不同渠道的使用场景与内容形式，为海外市场传播和客户沟通提供资料支持。'],
    output: ['马来西亚市场渠道研究', 'B2B 客户触达路径', '海外内容方向建议'],
    slots: [
      { title: '马来西亚市场渠道分析', hint: '待放入截图' },
      { title: 'LinkedIn / WhatsApp 客户沟通路径', hint: '待放入截图' },
      { title: '内容方向或传播建议', hint: '待放入截图' },
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
      { title: '香港澳门主题海报', hint: '待放入海报' },
      { title: 'ARCHIDEX 2026 邀请海报', hint: '待放入海报' },
      { title: '东鹏陶瓷万能品牌片头方案', hint: '待放入关键页' },
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
      <section data-reveal-block className="mx-auto w-full max-w-[860px] px-8 pt-20 pb-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">一、项目概述</p>
        <div className="mt-4 overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            <span className="block">围绕海外市场拓展，负责市场资料整理、展会资源梳理、英文内容策划与视觉物料交付，</span>
            <span className="block">支持产品和品牌信息在海外市场中的传播与沟通。</span>
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
            <p data-rise className="mt-4 text-[13px] leading-[1.6] text-black/50">{item.output.join(' · ')}</p>
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
          <div className="mt-8 grid grid-cols-3 gap-5">
            {item.slots.map((slot) => (
              <figure key={slot.title} data-frame className="min-w-0">
                <div className="flex h-[200px] items-center justify-center border border-black/15 bg-white/45 px-4 text-center text-[13px] text-black/40">
                  {slot.hint}
                </div>
                <figcaption className="mt-3 text-[15px] leading-[1.4]">{slot.title}</figcaption>
              </figure>
            ))}
          </div>
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

      <section data-reveal-block className="mx-auto w-full max-w-[860px] px-8 pt-4 pb-28">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">四、这段经历证明了什么</p>
        <div className="mt-4 overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            <span className="block">具备将海外市场信息、产品资料和展会需求转化为传播方案与内容资产的能力，</span>
            <span className="block">能够参与完成从信息整理、任务拆解到视觉交付的完整工作链路。</span>
          </p>
        </div>
        <p data-rise className="mt-5 text-[14px] leading-[1.8] text-black/60">
          <span className="block">个人贡献边界：市场研究与展会资源清单为个人工作成果；</span>
          <span className="block">企业介绍、产品资料和认证文件仅作为项目背景与内容依据使用。</span>
        </p>
      </section>
    </div>
  )
}
