import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import TikTokEvidenceFolder from './TikTokEvidenceFolder'
import { sofaDecisions, sofaEvidence, sofaHero, sofaScripts, sofaSignals, sofaSystem, sofaWork } from './sofaCase.data'
import { readDocxText } from './readDocx'

const ink = '#1C1C1A'
const paper = '#F5F3EE'
const muted = '#77746E'
const line = 'rgba(28, 28, 26, 0.22)'
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
    <div ref={ref} className={`sofa-reveal ${shown ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  const { ref, shown } = useInView<HTMLDivElement>(0.2)
  const lines = title.split('\n')
  return (
    <div>
      <p className="text-[11px] tracking-[0.22em]" style={{ color: muted }}>
        {kicker}
      </p>
      <div ref={ref} className={`sofa-reveal ${shown ? 'is-in' : ''}`}>
        <h2 className="mt-4 max-w-[18em] text-[clamp(18px,3.6vw,46px)] leading-[1.22] font-medium" style={{ fontFamily: song, color: ink }}>
          {lines.map((lineText) => (
            <span key={lineText} className="block">
              {lineText}
            </span>
          ))}
        </h2>
        <span className="sofa-line mt-4 block h-px w-16" style={{ background: ink }} />
      </div>
    </div>
  )
}

function StatCard({ value, label, delay, wide }: { value: string; label: string; delay: number; wide: boolean }) {
  const { ref, shown } = useInView<HTMLElement>(0.2)
  return (
    <article
      ref={ref}
      className={`sofa-reveal sofa-stat border px-4 py-6 ${shown ? 'is-in' : ''} ${wide ? 'col-span-2 lg:col-span-1' : ''}`}
      style={{ borderColor: line, background: paper, transitionDelay: `${delay}ms` }}
    >
      <CountFigure value={value} active={shown} delay={delay} className="text-[clamp(36px,4vw,56px)] leading-none tabular-nums" style={{ fontFamily: song, color: ink }} />
      <p className="mt-3 text-[13px]" style={{ color: muted }}>
        {label}
      </p>
    </article>
  )
}

function DecisionRows() {
  const { ref, phase } = useFlowPhase(sofaDecisions.items.length)
  return (
    <ol ref={ref} className="mt-8 border-t" style={{ borderColor: line }}>
      {sofaDecisions.items.map((item, index) => {
        const lit = index <= phase
        const waiting = index > phase
        return (
          <li
            key={item.index}
            className={`sofa-row grid gap-2 border-b py-5 md:grid-cols-[7rem_10rem_minmax(0,1fr)] md:items-baseline ${lit ? 'is-lit' : ''} ${waiting ? 'is-wait' : ''}`}
            style={{ borderColor: line }}
          >
            <span className="text-[12px] tabular-nums tracking-[0.16em]" style={{ color: muted }}>
              {item.index}
            </span>
            <span className="text-[16px]">{item.title}</span>
            <span className="text-[15px] leading-7" style={{ color: 'rgba(28,28,26,0.78)' }}>
              {item.body}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function SystemChain() {
  const { ref, phase } = useFlowPhase(sofaSystem.flow.length)
  return (
    <ol ref={ref} className="mt-8 grid gap-px lg:grid-cols-5" style={{ background: line }}>
      {sofaSystem.flow.map((step, index) => {
        const lit = index <= phase
        const waiting = index > phase
        return (
          <li key={step} className={`sofa-step px-4 py-5 ${lit ? 'is-lit' : ''} ${waiting ? 'is-wait' : ''}`}>
            <p className="text-[11px] tabular-nums tracking-[0.16em]" style={{ color: muted }}>
              {String(index + 1).padStart(2, '0')}
            </p>
            <p className="mt-4 text-[15px] leading-6">{step}</p>
          </li>
        )
      })}
    </ol>
  )
}

function ScriptReader() {
  const file = sofaScripts.file
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'missing'>('idle')
  const [text, setText] = useState('')

  async function openScript() {
    if (open) {
      setOpen(false)
      return
    }
    setOpen(true)
    if (status === 'ready' || status === 'loading') return
    setStatus('loading')
    try {
      setText(await readDocxText(file.href))
      setStatus('ready')
    } catch {
      setStatus('missing')
    }
  }

  return (
    <div className="mt-8 max-w-xl">
      <button type="button" onClick={openScript} className="sofa-file block w-full border px-5 py-5 text-left" style={{ borderColor: line }}>
        <p className="text-[11px] tracking-[0.18em]" style={{ color: muted }}>
          {file.kind}
        </p>
        <p className="mt-3 text-[18px]" style={{ fontFamily: song }}>
          {file.title}
        </p>
        <p className="mt-2 text-[13px]" style={{ color: muted }}>
          {file.note}
        </p>
        <p className="mt-5 text-[13px] tracking-[0.12em]">{open ? '收起 ↑' : '打开阅读 →'}</p>
      </button>
      {open ? (
        <div className="mt-4 max-h-[70vh] overflow-y-auto border px-5 py-5" style={{ borderColor: line, background: paper }}>
          {status === 'loading' ? <p className="text-[15px] leading-7">正在打开脚本…</p> : null}
          {status === 'missing' ? (
            <p className="text-[15px] leading-7" style={{ color: 'rgba(28,28,26,0.78)' }}>
              这份迭代版脚本还在本地电脑上，网站目录里没有对应的 Word 文件，所以正文暂时打不开。文件放进项目后，点这里就能直接阅读。
            </p>
          ) : null}
          {status === 'ready' ? (
            <pre className="font-sans text-[15px] leading-7 whitespace-pre-wrap" style={{ color: ink }}>
              {text}
            </pre>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default function SofaCase({ embedded = false }: { embedded?: boolean }) {
  return (
    <article className={embedded ? 'mt-16 border-t pt-16' : 'min-h-screen px-5 py-16 md:px-10'} style={{ background: paper, color: ink, borderColor: line }}>
      <div className={embedded ? '' : 'mx-auto max-w-6xl'}>
        <header className="grid items-end gap-10 border-b pb-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]" style={{ borderColor: line }}>
          <Reveal>
            <p className="text-[11px] tracking-[0.22em]" style={{ color: muted }}>
              {sofaHero.index} / {sofaHero.kicker}
            </p>
            <h1 className="mt-5 text-[clamp(40px,6vw,72px)] leading-[1.05] font-medium" style={{ fontFamily: song }}>
              {sofaHero.title[0]}
              <span className="block">{sofaHero.title[1]}</span>
            </h1>
            <p className="mt-4 text-[12px] tracking-[0.16em]" style={{ color: muted }}>
              {sofaHero.english}
            </p>
            <p className="mt-5 max-w-xl text-[15px] leading-7">{sofaHero.body}</p>
            <p className="mt-4 text-[13px] tracking-[0.08em]" style={{ color: muted }}>
              {sofaHero.period}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="border px-6 py-8" style={{ borderColor: line }}>
              <p className="text-[12px] tracking-[0.2em]" style={{ color: muted }}>
                {sofaHero.panel[0]}
              </p>
              <p className="mt-6 text-[clamp(22px,3vw,34px)] leading-snug" style={{ fontFamily: song }}>
                {sofaHero.panel[1]}
              </p>
              <div className="mt-8 h-px w-full" style={{ background: line }} />
              <p className="mt-4 text-[12px] tracking-[0.16em]" style={{ color: muted }}>
                {sofaHero.index} / COMPRESSED SOFA
              </p>
              <div className="mt-8 border-t pt-4" style={{ borderColor: line }}>
                <p className="text-[11px] tracking-[0.18em]" style={{ color: muted }}>
                  ROLE
                </p>
                <p className="mt-2 text-[15px]">{sofaHero.role}</p>
              </div>
            </div>
          </Reveal>
        </header>

        <section className="mt-16">
          <SectionTitle kicker={sofaSignals.kicker} title={sofaSignals.title} />
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {sofaSignals.stats.map((item, index) => (
              <StatCard key={item.label} value={item.value} label={item.label} delay={index * 90} wide={index === sofaSignals.stats.length - 1} />
            ))}
          </div>
          <Reveal className="mt-4" delay={80}>
            <p className="text-[12px] leading-6" style={{ color: muted }}>
              {sofaSignals.note}
            </p>
          </Reveal>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={sofaDecisions.kicker} title={sofaDecisions.title} />
          <DecisionRows />
          <Reveal>
            <p className="mt-6 max-w-3xl text-[clamp(18px,2vw,24px)] leading-8" style={{ fontFamily: song }}>
              {sofaDecisions.close}
            </p>
          </Reveal>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={sofaSystem.kicker} title={sofaSystem.title} />
          <SystemChain />
          <div className="mt-6 grid gap-px lg:grid-cols-3" style={{ background: line }}>
            {sofaSystem.tracks.map((track, index) => (
              <Reveal key={track.index} delay={index * 90}>
                <div className="h-full px-5 py-5" style={{ background: paper }}>
                  <p className="text-[12px] tracking-[0.14em]" style={{ color: muted }}>
                    {track.index} / {track.title}
                  </p>
                  <p className="mt-3 text-[15px] leading-7">{track.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={sofaEvidence.kicker} title={sofaEvidence.title} />
          <Reveal>
            <p className="mt-6 max-w-3xl text-[15px] leading-7" style={{ color: 'rgba(28,28,26,0.78)' }}>
              {sofaEvidence.lead}
            </p>
          </Reveal>
          <Reveal className="mt-8" delay={80}>
            <TikTokEvidenceFolder />
          </Reveal>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={sofaScripts.kicker} title={sofaScripts.title} />
          <Reveal>
            <p className="mt-6 max-w-3xl text-[15px] leading-7" style={{ color: 'rgba(28,28,26,0.78)' }}>
              {sofaScripts.body}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <ScriptReader />
          </Reveal>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={sofaWork.kicker} title={sofaWork.title} />
          <div className="mt-8 grid gap-px sm:grid-cols-2" style={{ background: line }}>
            {sofaWork.items.map((item, index) => (
              <Reveal key={item.index} delay={index * 90}>
                <article className="h-full px-5 py-5" style={{ background: paper }}>
                  <p className="text-[12px] tabular-nums tracking-[0.16em]" style={{ color: muted }}>
                    {item.index}
                  </p>
                  <p className="mt-3 text-[16px]">{item.title}</p>
                  <p className="mt-3 text-[15px] leading-7" style={{ color: 'rgba(28,28,26,0.78)' }}>
                    {item.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-6 text-[12px] leading-6" style={{ color: muted }}>
              {sofaWork.close}
            </p>
          </Reveal>
        </section>
      </div>
    </article>
  )
}
