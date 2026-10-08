import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ankerFeatures,
  ankerFlow,
  ankerHero,
  ankerJudgment,
  ankerMeta,
  ankerProblem,
  ankerValue,
} from '@/src/projects/ankerCase.data'

const song = '"Noto Serif SC", "Source Han Serif SC", "STZhongsong", "华文中宋", "Songti SC", "SimSun", serif'
const sans = '"Noto Sans SC", "Geist Variable", sans-serif'
const mono = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace'

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function sheetOf(node: HTMLElement | null) {
  const scroller = node?.closest('[data-project-sheet]')
  return scroller instanceof HTMLElement ? scroller : null
}

function useInView<T extends HTMLElement>(threshold = 0.28) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reducedMotion()) {
      setShown(true)
      return
    }
    const scroller = sheetOf(node)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { root: scroller, threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, shown }
}

function useFlowPhase(count: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(-1)

  useEffect(() => {
    const node = ref.current
    const scroller = sheetOf(node)
    if (!node || !scroller) return
    if (reducedMotion()) {
      setPhase(count - 1)
      return
    }
    const onScroll = () => {
      const view = scroller.getBoundingClientRect()
      const rect = node.getBoundingClientRect()
      const start = view.bottom - 48
      const end = view.top + 140
      if (rect.top > start) {
        setPhase(-1)
        return
      }
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      setPhase(Math.min(count - 1, Math.floor(progress * count)))
    }
    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [count])

  return { ref, phase }
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, shown } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`anker-reveal ${shown ? 'is-in' : ''} ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <div className="max-w-[16em]">
      {index ? (
        <p className="m-0 text-[12px] tracking-[0.2em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
          {index}
        </p>
      ) : null}
      <h2 className="m-0 mt-3 text-[clamp(28px,3.4vw,44px)] leading-[1.28] font-medium break-keep text-[#1A1916]" style={{ fontFamily: song }}>
        {children}
      </h2>
      <span className="anker-line mt-4 block h-px w-16 bg-[#1A1916]" />
    </div>
  )
}

function Track({ label, steps, quiet = false }: { label: string; steps: readonly string[]; quiet?: boolean }) {
  return (
    <div className={`border px-4 py-5 sm:px-5 ${quiet ? 'border-[#1A1916]/15' : 'border-[#1A1916]'}`}>
      <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
        {label}
      </p>
      <ol className="mt-4 grid list-none gap-2 p-0">
        {steps.map((step, index) => (
          <li key={step} className="grid grid-cols-[auto_1fr] items-start gap-3">
            <span className="pt-0.5 text-[12px] text-[#1A1916]/45" style={{ fontFamily: mono }}>
              {index === 0 ? '·' : '↓'}
            </span>
            <span className="text-[15px] leading-7">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function FeatureDiagram({ id, active }: { id: string; active: boolean }) {
  const feature = ankerFeatures.find((item) => item.id === id)
  if (!feature) return null
  const frame = `anker-diagram border bg-[#F5F3EE] p-4 sm:p-5 ${active ? 'is-current' : ''}`

  if (feature.id === 'rollback') {
    return (
      <div className={frame}>
        <p className="m-0 text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
          局部回退
        </p>
        <div className="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <p className="m-0 border border-[#1A1916]/15 px-3 py-3 text-[15px]">{feature.diagram.before}</p>
          <span className="text-[12px] tracking-[0.14em]" style={{ fontFamily: mono }}>
            更正为
          </span>
          <p className="m-0 border border-[#1A1916] px-3 py-3 text-[15px]">{feature.diagram.after}</p>
        </div>
        <p className="mt-3 mb-0 text-[14px] leading-7 text-[#1A1916]/75">{feature.diagram.drop}</p>
        <ul className="mt-4 grid list-none gap-2 p-0 sm:grid-cols-3">
          {feature.diagram.keep.map((item) => (
            <li key={item} className="border border-[#1A1916]/15 px-3 py-2 text-[13px] leading-6">
              保留 · {item}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (feature.id === 'step') {
    return (
      <div className={frame}>
        <p className="m-0 text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
          单步闭环
        </p>
        <ol className="mt-4 grid list-none gap-3 p-0 md:grid-cols-3">
          {feature.states.map((state, index) => (
            <li key={state.name} className="border border-[#1A1916]/15 px-3 py-3">
              <p className="m-0 text-[12px] tracking-[0.14em]" style={{ fontFamily: mono }}>
                0{index + 1} {state.name}
              </p>
              <p className="mt-2 mb-0 text-[14px] leading-7">{state.note}</p>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return null
}

function BranchPanel({
  title,
  triggers,
  details,
  detailLabel,
}: {
  title: string
  triggers: readonly string[]
  details: readonly string[]
  detailLabel: string
}) {
  const { ref, shown } = useInView<HTMLElement>(0.35)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!shown) return
    if (reducedMotion()) {
      setOpen(true)
      return
    }
    const timer = window.setTimeout(() => setOpen(true), 360)
    return () => window.clearTimeout(timer)
  }, [shown])

  return (
    <article ref={ref} className="border border-[#1A1916]/15 px-4 py-5 sm:px-5">
      <h3 className="m-0 text-[18px] leading-8 font-medium" style={{ fontFamily: song }}>
        {title}
      </h3>
      <p className="mt-4 mb-2 text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
        触发条件
      </p>
      <ul className="m-0 grid list-none gap-2 p-0">
        {triggers.map((word) => (
          <li key={word} className={`anker-word text-[15px] leading-7 ${shown ? 'is-on' : ''}`}>
            {word}
          </li>
        ))}
      </ul>
      <div className={`anker-detail mt-5 ${open ? 'is-open' : ''}`}>
        <p className="m-0 text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
          {detailLabel}
        </p>
        <ul className="mt-2 mb-0 grid list-none gap-2 p-0">
          {details.map((item) => (
            <li key={item} className="border-t border-[#1A1916]/15 pt-2 text-[14px] leading-7">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default function AnkerCase({ onClose }: { onClose: () => void }) {
  const { ref: flowRef, phase } = useFlowPhase(ankerFlow.marks.length)
  const featureRefs = useRef<Array<HTMLElement | null>>([])
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const nodes = featureRefs.current.filter((node): node is HTMLElement => node instanceof HTMLElement)
    const scroller = sheetOf(nodes[0] ?? null)
    if (!nodes.length || !scroller) return
    if (reducedMotion()) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = nodes.indexOf(visible.target as HTMLElement)
        if (index >= 0) setActiveFeature(index)
      },
      { root: scroller, threshold: [0.35, 0.6] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const openFeature = (index: number) => {
    const node = featureRefs.current[index]
    const scroller = sheetOf(node ?? null)
    if (!node || !scroller) return
    const top = node.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 72
    scroller.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' })
    setActiveFeature(index)
  }

  return (
    <article className="anker-case text-[#1A1916]" style={{ fontFamily: sans, background: '#F5F3EE' }}>
      <div className="mx-auto w-full max-w-[1120px] px-5 pt-8 sm:px-8">
        <button type="button" onClick={onClose} className="text-[12px] tracking-[0.18em] underline underline-offset-4" style={{ fontFamily: mono }}>
          返回
        </button>
      </div>

      <header className="mx-auto w-full max-w-[1120px] px-5 pt-8 pb-16 sm:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="m-0 text-[12px] tracking-[0.2em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
              02 / {ankerMeta.name}
            </p>
            <p className="mt-3 mb-0 max-w-[16em] text-[18px] leading-8" style={{ fontFamily: song }}>
              {ankerMeta.subtitle}
            </p>
            <h1 className="mt-5 text-[clamp(26px,3.5vw,52px)] leading-[0.98] font-medium" style={{ fontFamily: song }}>
              {ankerHero.lines.map((line) => (
                <span key={line} className="block tracking-[0.03em] whitespace-nowrap">
                  {line}
                </span>
              ))}
            </h1>
          </div>
          <div>
            {ankerHero.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 mb-0 text-[16px] leading-8 text-[#1A1916]/85 first:mt-0">
                {paragraph}
              </p>
            ))}
            <p className="mt-6 mb-0 text-[14px] leading-7 text-[#1A1916]/75">{ankerMeta.summary}</p>
            <dl className="mt-6 grid gap-4 border-t border-[#1A1916]/15 pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
                  我的角色
                </dt>
                <dd className="mt-2 mb-0 text-[15px] leading-7">
                  {ankerMeta.role}
                  <span className="mt-1 block text-[14px] text-[#1A1916]/70">{ankerMeta.roleNote}</span>
                </dd>
              </div>
              <div>
                <dt className="text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
                  项目类型
                </dt>
                <dd className="mt-2 mb-0 text-[15px] leading-7">{ankerMeta.type}</dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="mt-12 mb-3 text-[12px] tracking-[0.18em]" style={{ fontFamily: mono }}>
          {ankerHero.scopeLabel}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ankerHero.stats.map((stat) => (
            <article key={stat.label} className="anker-stat bg-[#F5F3EE] px-4 py-5">
              <p className="m-0 text-[clamp(32px,4vw,48px)] leading-none" style={{ fontFamily: mono }}>
                {stat.value}
              </p>
              <p className="mt-4 mb-0 text-[14px] tracking-[0.08em]" style={{ fontFamily: mono }}>
                {stat.label}
              </p>
              <p className="mt-2 mb-0 text-[14px] leading-7 text-[#1A1916]/75">{stat.note}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 mb-0 text-[12px] leading-6 tracking-[0.08em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
          {ankerHero.footnoteEn}
          <span className="mt-1 block tracking-normal">{ankerHero.footnoteZh}</span>
        </p>
      </header>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Reveal>
            <SectionTitle>{ankerProblem.title}</SectionTitle>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {ankerProblem.paragraphs.map((paragraph) => (
                <p key={paragraph} className="m-0 text-[16px] leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <Track label={ankerProblem.usual.label} steps={ankerProblem.usual.steps} quiet />
            <Track label={ankerProblem.proposed.label} steps={ankerProblem.proposed.steps} />
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Reveal>
            <SectionTitle>{ankerJudgment.title}</SectionTitle>
          </Reveal>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {ankerJudgment.cards.map((card) => (
              <Reveal key={card.index}>
                <article className="h-full border border-[#1A1916]/15 px-4 py-5">
                  <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                    {card.index}
                  </p>
                  <h3 className="mt-3 mb-0 text-[22px] leading-8 font-medium" style={{ fontFamily: song }}>
                    {card.title}
                  </h3>
                  <p className="mt-3 mb-0 text-[15px] leading-8 text-[#1A1916]/80">{card.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <SectionTitle>{ankerFlow.title}</SectionTitle>
          <div ref={flowRef} className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <ol className="m-0 grid list-none gap-2 p-0">
              {ankerFlow.steps.map((step) => {
                const lit = step.phase !== null && phase >= step.phase
                const waiting = step.phase !== null && phase < step.phase
                return (
                  <li key={step.id} className={`anker-step border px-4 py-3 text-[15px] leading-7 ${lit ? 'is-lit' : ''} ${waiting ? 'is-wait' : ''}`}>
                    {step.text}
                  </li>
                )
              })}
            </ol>
            <ol className="m-0 grid list-none gap-px bg-[#1A1916]/15 p-0">
              {ankerFlow.layers.map((layer) => (
                <li key={layer.index} className="bg-[#F5F3EE] px-4 py-4">
                  <p className="m-0 text-[12px] tracking-[0.14em]" style={{ fontFamily: mono }}>
                    {layer.index} {layer.name}
                  </p>
                  <p className="mt-2 mb-0 text-[14px] leading-7 text-[#1A1916]/75">{layer.note}</p>
                </li>
              ))}
            </ol>
          </div>
          <ol className="mt-4 mb-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 text-[12px] tracking-[0.14em]" style={{ fontFamily: mono }}>
            {ankerFlow.marks.map((mark, index) => (
              <li key={mark} className={index <= phase ? 'text-[#1A1916]' : 'text-[#1A1916]/35'}>
                {index > 0 ? <span className="mr-3">→</span> : null}
                {mark}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="sticky top-0 z-20 border-y border-[#1A1916]/15 bg-[#F5F3EE]">
        <div className="mx-auto flex w-full max-w-[1120px] gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          {ankerFeatures.map((feature, index) => (
            <button
              key={feature.id}
              type="button"
              onClick={() => openFeature(index)}
              className={`shrink-0 border px-3 py-2 text-left text-[13px] leading-6 ${index === activeFeature ? 'border-[#1A1916]' : 'border-[#1A1916]/15 text-[#1A1916]/60'}`}
            >
              <span style={{ fontFamily: mono }}>{feature.index}</span> {feature.title}
            </button>
          ))}
        </div>
      </div>

      {ankerFeatures.map((feature, index) => (
        <section
          key={feature.id}
          ref={(node) => {
            featureRefs.current[index] = node
          }}
          className="border-b border-[#1A1916]/15"
        >
          <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
            <SectionTitle index={`${feature.index} /`}>
              {feature.title}
            </SectionTitle>
            <p className="mt-6 max-w-[44rem] text-[16px] leading-8">{feature.scene}</p>
            {feature.id === 'handoff' ? null : (
              <div className="mt-8">
                <FeatureDiagram id={feature.id} active={activeFeature === index} />
              </div>
            )}
            {feature.id === 'handoff' ? (
              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <BranchPanel title={feature.block.title} triggers={feature.block.triggers} details={feature.block.actions} detailLabel="系统动作" />
                <BranchPanel title={feature.handoff.title} triggers={feature.handoff.triggers} details={feature.handoff.packet} detailLabel="人工接管包" />
              </div>
            ) : null}
            {'columns' in feature ? (
              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {feature.columns.map((column) => (
                  <article key={column.title} className="border border-[#1A1916]/15 px-4 py-5">
                    <h3 className="m-0 text-[16px] leading-7 font-medium">{column.title}</h3>
                    <p className="mt-3 mb-0 text-[15px] leading-8 text-[#1A1916]/80">{column.body}</p>
                  </article>
                ))}
              </div>
            ) : null}
            {'rules' in feature ? (
              <ul className="mt-8 grid list-none gap-3 p-0">
                {feature.rules.map((rule) => (
                  <li key={rule} className="border-t border-[#1A1916]/15 pt-3 text-[15px] leading-7">
                    {rule}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-8 max-w-[36rem] border-t border-[#1A1916] pt-4 text-[20px] leading-9" style={{ fontFamily: song }}>
              {feature.close}
            </p>
          </div>
        </section>
      ))}

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <SectionTitle>{ankerValue.title}</SectionTitle>
          <p className="mt-6 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
            {ankerValue.tag}
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {ankerValue.items.map((item) => (
              <article key={item.title} className="border border-[#1A1916]/15 px-4 py-5">
                <p className="m-0 text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
                  预期
                </p>
                <h3 className="mt-3 mb-0 text-[20px] leading-8 font-medium" style={{ fontFamily: song }}>
                  {item.title}
                </h3>
                <p className="mt-3 mb-0 text-[15px] leading-8">{item.body}</p>
              </article>
            ))}
          </div>
          <article className="mt-8 border border-[#1A1916]/20 bg-[#EFEDE8] px-4 py-5 sm:px-5">
            <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
              {ankerValue.boundary.title}
            </p>
            <p className="mt-2 mb-0 text-[18px] leading-8" style={{ fontFamily: song }}>
              {ankerValue.boundary.state}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="m-0 text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
                  {ankerValue.boundary.definedLabel}
                </p>
                <p className="mt-2 mb-0 text-[15px] leading-7">{ankerValue.boundary.defined}</p>
              </div>
              <div>
                <p className="m-0 text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
                  {ankerValue.boundary.pendingLabel}
                </p>
                <p className="mt-2 mb-0 text-[15px] leading-7">{ankerValue.boundary.pending}</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </article>
  )
}
