import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import MuseVisualArchive from './MuseVisualArchive'
import { museDirections, museHero, museJudgment, museMethod, museSignals, museWork } from './museCase.data'

const ink = '#181715'
const paper = '#F5F2EC'
const wine = '#9B293C'
const silver = '#AAA59E'
const line = 'rgba(24, 23, 21, 0.22)'
const song = '"Songti SC", "Noto Serif SC", serif'

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useInView<T extends HTMLElement>(threshold = 0.02) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reducedMotion()) {
      setShown(true)
      return
    }
    const scroller = node.closest('[data-project-sheet]')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { root: scroller instanceof HTMLElement ? scroller : null, threshold, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, shown }
}

function useFlowPhase(count: number) {
  const ref = useRef<HTMLOListElement>(null)
  const [phase, setPhase] = useState(-1)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reducedMotion()) {
      setPhase(count - 1)
      return
    }
    const scroller = node.closest('[data-project-sheet]')
    const scrolling: HTMLElement | Window = scroller instanceof HTMLElement ? scroller : window
    const onScroll = () => {
      const viewTop = scroller instanceof HTMLElement ? scroller.getBoundingClientRect().top : 0
      const viewBottom = scroller instanceof HTMLElement ? scroller.getBoundingClientRect().bottom : window.innerHeight
      const rect = node.getBoundingClientRect()
      const start = viewBottom - 48
      const end = viewTop + 160
      if (rect.top > start) {
        setPhase((current) => (current === -1 ? current : -1))
        return
      }
      const progress = Math.min(1, Math.max(0, (start - rect.top) / Math.max(1, start - end)))
      const next = Math.min(count - 1, Math.floor(progress * count))
      setPhase((current) => (current === next ? current : next))
    }
    onScroll()
    scrolling.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      scrolling.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [count])

  return { ref, phase }
}

function parseFigure(value: string) {
  const match = /^(\+?)([\d,]+)(.*)$/.exec(value)
  if (!match) return null
  return { prefix: match[1], digits: match[2], suffix: match[3], target: Number(match[2].replace(/,/g, '')) }
}

function formatFigure(value: string, current: number) {
  const parsed = parseFigure(value)
  if (!parsed) return value
  const commas = parsed.digits.includes(',')
  const digits = commas ? Math.round(current).toLocaleString('en-US') : String(Math.round(current))
  return `${parsed.prefix}${digits}${parsed.suffix}`
}

function CountFigure({ value, active, delay = 0, className = '', style }: { value: string; active: boolean; delay?: number; className?: string; style?: CSSProperties }) {
  const [text, setText] = useState(parseFigure(value) && !reducedMotion() ? formatFigure(value, 0) : value)

  useEffect(() => {
    if (!parseFigure(value) || reducedMotion()) {
      setText(value)
      return
    }
    if (!active) {
      setText(formatFigure(value, 0))
      return
    }
    const target = parseFigure(value)?.target ?? 0
    let frame = 0
    setText(formatFigure(value, 0))
    const timer = window.setTimeout(() => {
      const started = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / 880)
        const eased = 1 - (1 - progress) ** 3
        setText(formatFigure(value, target * eased))
        if (progress < 1) frame = requestAnimationFrame(tick)
        else setText(value)
      }
      frame = requestAnimationFrame(tick)
    }, delay)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [active, delay, value])

  return (
    <p className={className} style={style}>
      {text}
    </p>
  )
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, shown } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`muse-reveal ${shown ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  const { ref, shown } = useInView<HTMLDivElement>(0.2)
  const lines = title.split('\n')
  return (
    <div>
      <p className="text-[11px] tracking-[0.22em]" style={{ color: silver }}>
        {kicker}
      </p>
      <div ref={ref} className={`muse-reveal ${shown ? 'is-in' : ''}`}>
        <h2 className="mt-4 max-w-[16em] text-[clamp(18px,3.6vw,46px)] leading-[1.22] font-medium" style={{ fontFamily: song, color: ink }}>
          {lines.map((lineText) => (
            <span key={lineText} className="block">
              {lineText}
            </span>
          ))}
        </h2>
        <span className="muse-line mt-4 block h-px w-16" style={{ background: ink }} />
      </div>
    </div>
  )
}

function StatCard({ value, label, delay, wide }: { value: string; label: string; delay: number; wide: boolean }) {
  const { ref, shown } = useInView<HTMLElement>(0.2)
  return (
    <article
      ref={ref}
      className={`muse-reveal muse-stat border px-4 py-6 ${shown ? 'is-in' : ''} ${wide ? 'col-span-2 lg:col-span-1' : ''}`}
      style={{ borderColor: line, background: paper, transitionDelay: `${delay}ms` }}
    >
      <CountFigure value={value} active={shown} delay={delay} className="text-[clamp(36px,4vw,56px)] leading-none tabular-nums" style={{ fontFamily: song }} />
      <p className="mt-3 text-[13px]" style={{ color: silver }}>
        {label}
      </p>
    </article>
  )
}

function ChoiceRows() {
  const { ref, phase } = useFlowPhase(museJudgment.items.length)
  return (
    <ol ref={ref} className="mt-8 border-t" style={{ borderColor: line }}>
      {museJudgment.items.map((item, index) => {
        const lit = index <= phase
        const waiting = index > phase
        return (
          <li
            key={item.index}
            className={`muse-row grid gap-2 border-b py-5 md:grid-cols-[9rem_minmax(0,1fr)] md:items-baseline ${lit ? 'is-lit' : ''} ${waiting ? 'is-wait' : ''}`}
            style={{ borderColor: line }}
          >
            <span className="text-[12px] tracking-[0.16em]" style={{ color: wine }}>
              {item.index} / {item.title}
            </span>
            <span className="text-[15px] leading-7">{item.body}</span>
          </li>
        )
      })}
    </ol>
  )
}

function MethodChain() {
  const { ref, phase } = useFlowPhase(museMethod.flow.length)
  return (
    <ol ref={ref} className="mt-8 grid gap-px lg:grid-cols-5" style={{ background: line }}>
      {museMethod.flow.map((step, index) => {
        const lit = index <= phase
        const waiting = index > phase
        return (
          <li key={step} className={`muse-step px-4 py-5 ${lit ? 'is-lit' : ''} ${waiting ? 'is-wait' : ''}`}>
            <p className="text-[11px] tabular-nums tracking-[0.16em]" style={{ color: '#214C98' }}>
              {String(index + 1).padStart(2, '0')}
            </p>
            <p className="mt-4 text-[15px] leading-6">{step}</p>
          </li>
        )
      })}
    </ol>
  )
}

function DirectionRows() {
  const { ref, phase } = useFlowPhase(museDirections.items.length)
  return (
    <ol ref={ref} className="mt-8 border-t" style={{ borderColor: line }}>
      {museDirections.items.map((item, index) => {
        const lit = index <= phase
        const waiting = index > phase
        return (
          <li key={item} className={`muse-direction muse-row border-b py-4 ${lit ? 'is-lit' : ''} ${waiting ? 'is-wait' : ''}`} style={{ borderColor: line }}>
            <p className="text-[16px]">
              <span className="mr-3 text-[12px] tracking-[0.14em]" style={{ color: silver }}>
                {String(index + 1).padStart(2, '0')} /
              </span>
              {item}
            </p>
            <p className="muse-note text-[13px] leading-6" style={{ color: silver }}>
              {museDirections.note}
            </p>
          </li>
        )
      })}
    </ol>
  )
}

export default function MuseCase({ embedded = false }: { embedded?: boolean }) {
  return (
    <article className={embedded ? 'mt-16 border-t pt-16' : 'min-h-screen px-5 py-16 md:px-10'} style={{ background: paper, color: ink, borderColor: line }}>
      <div className={embedded ? '' : 'mx-auto max-w-6xl'}>
        <header className="grid items-end gap-10 border-b pb-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)]" style={{ borderColor: line }}>
          <Reveal>
            <p className="text-[11px] tracking-[0.22em]" style={{ color: silver }}>
              {museHero.index} / {museHero.kicker}
            </p>
            <h1 className="mt-5 text-[clamp(40px,6vw,72px)] leading-[1.02] font-medium" style={{ fontFamily: song }}>
              {museHero.title[0]}
              <span className="block">{museHero.title[1]}</span>
            </h1>
            <p className="mt-4 text-[12px] tracking-[0.16em]" style={{ color: silver }}>
              {museHero.english}
            </p>
            <p className="mt-5 max-w-[16em] text-[clamp(20px,2.4vw,30px)] leading-[1.35]" style={{ fontFamily: song }}>
              {museHero.lead[0]}
              <span className="block">{museHero.lead[1]}</span>
            </p>
            {museHero.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 max-w-xl text-[15px] leading-7">
                {paragraph}
              </p>
            ))}
            <p className="mt-4 text-[13px] tracking-[0.08em]" style={{ color: silver }}>
              {museHero.period} · {museHero.type}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="border px-6 py-8" style={{ borderColor: line }}>
              <p className="text-[12px] tracking-[0.18em]" style={{ color: wine }}>
                {museHero.panel[0]}
              </p>
              <p className="mt-8 text-[clamp(28px,3.4vw,44px)] leading-[1.05] font-medium" style={{ fontFamily: song }}>
                {museHero.panel[1]}
                <span className="mt-2 block text-[0.62em] tracking-[0.04em]" style={{ color: '#214C98' }}>
                  {museHero.panel[2]}
                </span>
              </p>
              <div className="mt-8 h-px w-full" style={{ background: line }} />
              <div className="mt-5">
                <p className="text-[11px] tracking-[0.18em]" style={{ color: silver }}>
                  ROLE
                </p>
                <p className="mt-2 text-[15px]">{museHero.role}</p>
              </div>
            </div>
          </Reveal>
        </header>

        <section className="mt-16">
          <SectionTitle kicker={museSignals.kicker} title={museSignals.title} />
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {museSignals.stats.map((item, index) => (
              <StatCard key={item.label} value={item.value} label={item.label} delay={index * 90} wide={index === museSignals.stats.length - 1} />
            ))}
          </div>
          <Reveal className="mt-4" delay={80}>
            <p className="text-[12px] leading-6" style={{ color: silver }}>
              {museSignals.note}
            </p>
          </Reveal>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={museJudgment.kicker} title={museJudgment.title} />
          <ChoiceRows />
          <Reveal>
            <p className="mt-6 max-w-3xl text-[clamp(18px,2vw,24px)] leading-8" style={{ fontFamily: song }}>
              {museJudgment.close}
            </p>
          </Reveal>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <MuseVisualArchive />
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={museMethod.kicker} title={museMethod.title} />
          <MethodChain />
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {museMethod.cards.map((card, index) => (
              <Reveal key={card.index} delay={index * 90}>
                <div className="h-full border px-5 py-5" style={{ borderColor: line }}>
                  <p className="text-[12px] tracking-[0.14em]" style={{ color: wine }}>
                    {card.index} / {card.title}
                  </p>
                  <p className="mt-3 text-[15px] leading-7">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={museDirections.kicker} title={museDirections.title} />
          <DirectionRows />
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={museWork.kicker} title={museWork.title} />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {museWork.items.map((item, index) => (
              <Reveal key={item.index} delay={index * 90}>
                <article className="h-full border px-5 py-5" style={{ borderColor: line }}>
                  <p className="text-[12px] tabular-nums tracking-[0.16em]" style={{ color: wine }}>
                    {item.index}
                  </p>
                  <p className="mt-3 text-[16px]">{item.title}</p>
                  <p className="mt-3 text-[15px] leading-7">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-6 max-w-3xl text-[clamp(18px,2vw,24px)] leading-8" style={{ fontFamily: song }}>
              {museWork.close}
            </p>
          </Reveal>
        </section>
      </div>
    </article>
  )
}
