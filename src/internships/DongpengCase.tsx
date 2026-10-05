import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Slot = {
  title: string
  hint: string
}

type Module = {
  index: string
  title: string
  body: string
  output: string[]
  slots: Slot[]
  notes?: { title: string; body: string }[]
}

const modules: Module[] = [
  {
    index: '01',
    title: '从市场信息中识别客户触达路径',
    body: '围绕马来西亚 B2B 建材市场，梳理户外广告、LinkedIn、WhatsApp 等客户触达渠道，分析不同渠道的使用场景与内容形式，为海外市场传播和客户沟通提供资料支持。',
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
    body: '围绕 ARCHIDEX 2026 展会，梳理展位、官网、媒体、商务配对和观众邀约等传播资源，整理领取渠道、时间节点和行动事项，形成展会传播清单与执行计划。',
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
    body: '根据不同海外市场和传播节点，参与英文主题提炼、视觉设计和图文物料制作，将企业、产品和展会信息转化为适合海外受众理解和传播的内容。',
    output: ['海外主题海报', 'ARCHIDEX 2026 邀请海报', '英文品牌与产品内容', '海外市场视觉物料'],
    slots: [
      { title: '香港澳门主题海报', hint: '待放入海报' },
      { title: 'ARCHIDEX 2026 邀请海报', hint: '待放入海报' },
      { title: '东鹏陶瓷万能品牌片头方案', hint: '待放入关键页' },
    ],
    notes: [
      {
        title: '海报 1 · 香港澳门主题内容',
        body: '围绕香港与澳门的建筑、城市和商业场景，提炼区域传播主题，将城市语境与东鹏海外业务结合，形成英文视觉内容。参与策划与制作。',
      },
      {
        title: '海报 2 · ARCHIDEX 2026 展会邀请',
        body: '围绕海外客户邀约与展会传播需求，将展会时间、地点、展位和品牌信息转化为英文视觉物料。参与策划与制作。',
      },
    ],
  },
]

const method = ['市场信息整理', '客户与渠道分析', '展会任务拆解', '英文内容与视觉设计', '传播物料交付']
const tilts = [-5, 3, -2]

export default function DongpengCase() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const scroller = root.closest('[data-internship-sheet]')
      if (!(scroller instanceof HTMLElement) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const overview = root.querySelector('[data-overview-line]')
      if (overview) {
        gsap.from(overview, {
          yPercent: 120,
          ease: 'none',
          scrollTrigger: {
            trigger: overview,
            scroller,
            start: 'top 92%',
            end: 'top 58%',
            scrub: 0.6,
            refreshPriority: 0,
          },
        })
      }

      const reel = root.querySelector('[data-reel]')
      const track = root.querySelector('[data-track]')
      const bar = root.querySelector('[data-reel-bar]')
      const label = root.querySelector('[data-reel-index]')
      if (reel && track) {
        const distance = () => Math.max(0, track.scrollWidth - scroller.clientWidth)
        const reelTween = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: reel,
            scroller,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => '+=' + distance(),
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onUpdate: (self) => {
              if (!label) return
              const index = Math.min(modules.length - 1, Math.round(self.progress * (modules.length - 1)))
              label.textContent = modules[index].index
            },
          },
        })
        reelTween.to(track, { x: () => -distance(), ease: 'none' }, 0)
        if (bar) reelTween.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)

        gsap.utils.toArray<HTMLElement>('[data-card]', track).forEach((card) => {
          gsap.from(card, {
            y: Number(card.dataset.shift || 72),
            rotate: Number(card.dataset.tilt || 0),
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: reelTween,
              start: 'left 92%',
              end: 'left 58%',
              scrub: true,
            },
          })
        })
      }

      const methodSection = root.querySelector('[data-method]')
      const methodLine = root.querySelector('[data-method-line]')
      const steps = gsap.utils.toArray<HTMLElement>('[data-step]', root)
      if (methodSection && methodLine) {
        const flow = gsap.timeline({
          scrollTrigger: {
            trigger: methodSection,
            scroller,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: '+=820',
            refreshPriority: 2,
          },
        })
        flow.fromTo(methodLine, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0)
        steps.forEach((step, index) => {
          flow.fromTo(step, { y: 28, autoAlpha: 0.28 }, { y: 0, autoAlpha: 1, duration: 0.18, ease: 'power2.out' }, index * 0.16)
        })
      }

      const proof = root.querySelector('[data-proof]')
      if (proof) {
        gsap.from(proof, {
          y: 48,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: proof,
            scroller,
            start: 'top 86%',
            end: 'top 52%',
            scrub: 0.7,
            refreshPriority: 3,
          },
        })
      }

      ScrollTrigger.refresh()
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} id="dongpeng-case" className="relative">
      <section className="mx-auto flex min-h-[54vh] max-w-4xl items-end px-8 pt-16 pb-16">
        <div className="overflow-hidden">
          <p className="text-[12px] tracking-[0.28em] text-black/45">一、项目概述</p>
          <p data-overview-line className="mt-5 text-[clamp(28px,3.5vw,48px)] leading-[1.35] font-normal">
            围绕海外市场拓展，负责市场资料整理、展会资源梳理、英文内容策划与视觉物料交付，支持产品和品牌信息在海外市场中的传播与沟通。
          </p>
        </div>
      </section>

      <section data-reel className="relative h-dvh overflow-hidden motion-reduce:h-auto motion-reduce:overflow-visible">
        <div className="pointer-events-none absolute top-7 right-[6vw] left-28 z-10 flex items-center justify-between text-[12px] tracking-[0.22em] text-black/50 motion-reduce:hidden">
          <span>二、工作模块</span>
          <span data-reel-index>01</span>
        </div>
        <div data-track className="flex h-full motion-reduce:h-auto motion-reduce:flex-col">
          {modules.map((item) => (
            <article key={item.index} className="flex h-full w-screen shrink-0 flex-col justify-center gap-6 px-[6vw] pt-12 pb-14 motion-reduce:h-auto motion-reduce:w-full motion-reduce:py-16">
              <div className="grid items-end gap-8 md:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <p className="text-[clamp(56px,6vw,88px)] leading-none text-black/15">{item.index}</p>
                  <h3 className="mt-2 max-w-xl text-[clamp(24px,2.4vw,36px)] leading-[1.25] font-normal">{item.title}</h3>
                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-black/55">
                    {item.output.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className="max-w-md pb-1">
                  <p className="text-[15px] leading-[1.7]">{item.body}</p>
                  {item.notes ? (
                    <div className="mt-3 space-y-2">
                      {item.notes.map((note) => (
                        <p key={note.title} className="text-[13px] leading-[1.6] text-black/70">
                          <span className="text-[#1c1c1c]">{note.title}</span> {note.body}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {item.slots.map((slot, index) => (
                  <figure
                    key={slot.title}
                    data-card
                    data-shift={64 + index * 22}
                    data-tilt={tilts[index]}
                    className="min-w-0"
                  >
                    <div className="flex h-[min(18vh,168px)] items-center justify-center border border-black/20 bg-white/35 px-3 text-center text-[13px] text-black/40">
                      {slot.hint}
                    </div>
                    <figcaption className="mt-2 text-[13px] leading-[1.4]">{slot.title}</figcaption>
                  </figure>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="absolute right-[6vw] bottom-7 left-[6vw] z-10 motion-reduce:hidden">
          <div className="h-px bg-black/15">
            <div data-reel-bar className="h-px origin-left bg-[#1c1c1c]" />
          </div>
        </div>
      </section>

      <section data-method className="flex h-dvh items-center motion-reduce:h-auto motion-reduce:py-24">
        <div className="mx-auto w-full max-w-5xl px-8">
          <p className="text-[12px] tracking-[0.28em] text-black/45">三、我的工作方式</p>
          <p className="mt-5 max-w-2xl text-[clamp(22px,2.4vw,34px)] leading-[1.45]">
            先梳理市场与客户信息，再拆解展会和传播任务，最后通过英文文案、视觉物料和资料整理完成内容交付。
          </p>
          <div className="relative mt-16">
            <div className="absolute top-[7px] right-0 left-0 h-px bg-black/15" />
            <div data-method-line className="absolute top-[7px] right-0 left-0 h-px origin-left bg-[#1c1c1c]" />
            <ol className="relative flex justify-between gap-3">
              {method.map((step, index) => (
                <li key={step} data-step className="flex min-w-0 flex-1 flex-col items-start gap-4">
                  <span className="size-[15px] rounded-full border border-black/30 bg-[#f3f1ec]" />
                  <span className="text-[14px] leading-[1.45]">
                    <span className="mb-1 block text-[11px] tracking-[0.16em] text-black/40">0{index + 1}</span>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-8 pt-8 pb-32">
        <p className="text-[12px] tracking-[0.28em] text-black/45">四、这段经历证明了什么</p>
        <p data-proof className="mt-6 text-[clamp(26px,3.2vw,44px)] leading-[1.4]">
          具备将海外市场信息、产品资料和展会需求转化为传播方案与内容资产的能力，能够参与完成从信息整理、任务拆解到视觉交付的完整工作链路。
        </p>
        <p className="mt-8 max-w-2xl text-[14px] leading-[1.75] text-black/65">
          个人贡献边界：市场研究与展会资源清单为个人工作成果；企业介绍、产品资料和认证文件仅作为项目背景与内容依据使用。
        </p>
      </section>
    </div>
  )
}
