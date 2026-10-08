import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import {
  planflowArchitecture,
  planflowDaily,
  planflowHero,
  planflowLinks,
  planflowLoop,
  planflowProblem,
  planflowSchedule,
  planflowTeam,
  planflowValue,
  planflowWork,
} from './planflowCase.data'

const ink = '#1A1916'
const paper = '#F5F3EE'
const blue = '#1B3A4B'
const green = '#1C3329'
const orange = '#C4624A'

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShown(true)
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return { ref, shown }
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, shown } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`planflow-reveal ${shown ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function CountFigure({ value, className = '', style }: { value: string; className?: string; style?: CSSProperties }) {
  const { ref, shown } = useInView<HTMLParagraphElement>()
  const [text, setText] = useState(value)
  useEffect(() => {
    const match = value.match(/^([+-]?)(\d+(?:\.\d+)?)(.*)$/)
    if (!match) return
    const sign = match[1]
    const target = Number(match[2])
    const suffix = match[3]
    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0
    const pad = match[2].startsWith('0') && match[2].length > 1 ? match[2].length : 0
    if (!shown) {
      const start = pad ? '0'.repeat(pad) : decimals ? (0).toFixed(decimals) : '0'
      setText(`${sign}${start}${suffix}`)
      return
    }
    let frame = 0
    const frames = 42
    const tick = () => {
      frame += 1
      const progress = 1 - (1 - frame / frames) ** 3
      const current = target * Math.min(progress, 1)
      const digits = decimals ? current.toFixed(decimals) : String(Math.round(current))
      const padded = pad ? digits.padStart(pad, '0') : digits
      setText(`${sign}${padded}${suffix}`)
      if (frame < frames) requestAnimationFrame(tick)
    }
    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [shown, value])
  return (
    <p ref={ref} className={className} style={style}>
      {text}
    </p>
  )
}

function SectionTitle({ index, kicker, title }: { index?: string; kicker: string; title: string }) {
  const lines = title.split('\n')
  return (
    <div>
      <p className="text-[11px] tracking-[0.22em]" style={{ color: 'rgba(26,25,22,0.42)' }}>
        {index ? `${index} / ${kicker}` : kicker}
      </p>
      <h2 className="mt-4 max-w-[18em] text-[clamp(18px,3.6vw,46px)] leading-[1.22] font-medium" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif', color: ink }}>
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
    </div>
  )
}

export default function PlanFlowCase({ embedded = false }: { embedded?: boolean }) {
  return (
    <article className={embedded ? 'mt-16 border-t border-black/10 pt-16 text-[#1A1916]' : 'min-h-screen px-5 py-16 md:px-10'} style={{ background: paper, color: ink }}>
      <div className={embedded ? '' : 'mx-auto max-w-6xl'}>
        <Reveal>
          <header className="grid items-end gap-10 border-b border-black/10 pb-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <p className="text-[11px] tracking-[0.28em]" style={{ color: 'rgba(26,25,22,0.42)' }}>
                01 / {planflowHero.english}
              </p>
              <h1 className="mt-5 text-[clamp(56px,8vw,108px)] leading-[0.88] font-medium tracking-tight" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif', color: blue }}>
                {planflowHero.mark[0]}
                <span className="block">{planflowHero.mark[1]}</span>
              </h1>
              <p className="mt-6 max-w-[16em] text-[clamp(20px,2.4vw,32px)] leading-[1.35]" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif' }}>
                {planflowHero.title[0]}
                <span className="block">{planflowHero.title[1]}</span>
              </p>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-black/70">{planflowHero.body}</p>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-black/70">{planflowHero.positioning}</p>
            </div>
            <div className="grid gap-px bg-black/10 sm:grid-cols-2">
              {planflowHero.stats.map((item) => (
                <div key={item.label} className="bg-[#F5F3EE] px-4 py-5">
                  <CountFigure value={item.value} className="text-[clamp(36px,4vw,52px)] leading-none tabular-nums" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif', color: blue }} />
                  <p className="mt-3 text-sm">{item.label}</p>
                  <p className="mt-1 text-[12px] leading-5 text-black/55">{item.note}</p>
                </div>
              ))}
            </div>
          </header>
        </Reveal>
        <p className="mt-4 text-[11px] tracking-[0.16em] text-black/45">{planflowHero.stack.join(' · ')}</p>

        <section className="mt-20 border-t border-black/10 pt-8">
          <SectionTitle index={planflowProblem.index} kicker={planflowProblem.kicker} title={planflowProblem.title} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="space-y-4">
              {planflowProblem.paragraphs.map((paragraph) => (
                <Reveal key={paragraph}>
                  <p className="text-[15px] leading-8 text-black/75">{paragraph}</p>
                </Reveal>
              ))}
            </div>
            <div className="grid gap-px bg-black/10">
              {planflowProblem.cards.map((card, index) => (
                <Reveal key={card.title} delay={index * 70}>
                  <div className="grid gap-3 bg-[#F5F3EE] px-5 py-5 sm:grid-cols-[7rem_minmax(0,1fr)]">
                    <p className="text-sm" style={{ color: index === 2 ? orange : green }}>{card.title}</p>
                    <p className="text-[15px] leading-7 text-black/75">{card.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-black/10 pt-8">
          <SectionTitle index={planflowLoop.index} kicker={planflowLoop.kicker} title={planflowLoop.title} />
          <ol className="mt-8 border-l border-black/15">
            {planflowLoop.steps.map((step, index) => (
              <Reveal key={step} delay={index * 40}>
                <li className="grid grid-cols-[4.5rem_minmax(0,1fr)] border-b border-black/10 py-4">
                  <span className="text-[12px] tabular-nums tracking-[0.16em]" style={{ color: blue }}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-[15px] leading-7">{step}</span>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="mt-8 grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-5">
            {planflowLoop.notes.map((note) => (
              <Reveal key={note.name}>
                <div className="h-full bg-[#F5F3EE] px-4 py-5">
                  <p className="text-sm" style={{ color: green }}>{note.name}</p>
                  <p className="mt-3 text-[14px] leading-6 text-black/70">{note.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-black/10 pt-8">
          <SectionTitle index={planflowSchedule.index} kicker={planflowSchedule.kicker} title={planflowSchedule.title} />
          <Reveal>
            <p className="mt-6 max-w-3xl text-[15px] leading-8 text-black/75">{planflowSchedule.body}</p>
          </Reveal>
          <Reveal className="mt-8">
            <div className="planflow-line mb-3 h-px w-full bg-[#1B3A4B]" />
            <ol className="grid gap-px bg-black/10 md:grid-cols-5">
              {planflowSchedule.phases.map((phase) => (
                <li key={phase.index} className="bg-[#F5F3EE] px-4 py-5">
                  <p className="text-[12px] tabular-nums tracking-[0.16em]" style={{ color: blue }}>{phase.index}</p>
                  <p className="mt-6 text-[15px] leading-6">{phase.name}</p>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal>
            <p className="mt-6 max-w-3xl border-l-2 pl-4 text-[15px] leading-7" style={{ borderColor: orange }}>{planflowSchedule.close}</p>
          </Reveal>

          <div className="mt-16 border-t border-black/10 pt-8">
            <SectionTitle kicker={planflowTeam.kicker} title={planflowTeam.title} />
            <Reveal>
              <p className="mt-6 max-w-3xl text-[15px] leading-8 text-black/75">{planflowTeam.body}</p>
            </Reveal>
            <ul className="mt-6 flex flex-wrap gap-2">
              {planflowTeam.tags.map((tag) => (
                <li key={tag} className="border border-black/15 px-3 py-2 text-[13px] tracking-[0.04em]">
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 border-t border-black/10 pt-8">
            <SectionTitle kicker={planflowDaily.kicker} title={planflowDaily.title} />
            <ol className="mt-8 grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-6">
              {planflowDaily.cycle.map((item, index) => (
                <li key={item} className="bg-[#F5F3EE] px-4 py-5">
                  <p className="text-[11px] tabular-nums tracking-[0.16em]" style={{ color: blue }}>{String(index + 1).padStart(2, '0')}</p>
                  <p className="mt-4 text-[15px] leading-6">{item}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6 grid gap-px bg-black/10 sm:grid-cols-5">
              {planflowDaily.fields.map((field) => (
                <div key={field} className="bg-[#F5F3EE] px-4 py-4 text-[14px]">
                  {field}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-black/10 pt-8">
          <SectionTitle index={planflowValue.index} kicker={planflowValue.kicker} title={planflowValue.title} />
          <p className="mt-4 text-[13px] tracking-[0.04em]" style={{ color: green }}>{planflowValue.basis}</p>
          <div className="mt-8 grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-5">
            {planflowValue.stats.map((item) => (
              <div key={item.label} className="bg-[#F5F3EE] px-4 py-5">
                <CountFigure value={item.value} className="text-[clamp(28px,3vw,40px)] leading-none tabular-nums" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif', color: blue }} />
                <p className="mt-3 text-[13px] leading-5 text-black/65">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-px bg-black/10 lg:grid-cols-2">
            {planflowValue.formulas.map((formula) => (
              <Reveal key={formula.name}>
                <div className="h-full bg-[#F5F3EE] px-5 py-6">
                  <p className="text-[12px] tracking-[0.16em] text-black/45">{formula.name}</p>
                  <div className="mt-4 space-y-1 text-[15px] leading-7">
                    {formula.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  <p className="mt-4 text-[12px] tracking-[0.16em] text-black/40">=</p>
                  <CountFigure value={formula.result} className="mt-2 text-[clamp(36px,4vw,56px)] leading-none tabular-nums" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif', color: orange }} />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 grid gap-px bg-black/10 lg:grid-cols-3">
            {planflowValue.values.map((item) => (
              <Reveal key={item.title}>
                <div className="h-full bg-[#F5F3EE] px-5 py-5">
                  <p className="text-sm" style={{ color: green }}>{item.title}</p>
                  <p className="mt-3 text-[15px] leading-7 text-black/75">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-[12px] leading-6 text-black/45">{planflowValue.note}</p>
        </section>

        <section className="mt-20 border-t border-black/10 pt-8">
          <SectionTitle index={planflowArchitecture.index} kicker={planflowArchitecture.kicker} title={planflowArchitecture.title} />
          <ol className="mt-8">
            {planflowArchitecture.layers.map((layer, index) => (
              <Reveal key={layer.name} delay={index * 60}>
                <li className="border-b border-black/10 py-5">
                  <div className="grid gap-2 md:grid-cols-[14rem_minmax(0,1fr)] md:items-baseline">
                    <p className="text-[18px]" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif', color: blue }}>{layer.name}</p>
                    <p className="text-[15px] leading-7 text-black/70">{layer.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <p className="mt-6 max-w-3xl text-[15px] leading-7 text-black/70">{planflowArchitecture.note}</p>
          </Reveal>
        </section>

        <section className="mt-20 border-t border-black/10 pt-8">
          <SectionTitle index={planflowWork.index} kicker={planflowWork.kicker} title={planflowWork.title} />
          <div className="mt-8 grid gap-px bg-black/10 sm:grid-cols-2">
            {planflowWork.items.map((item) => (
              <Reveal key={item.title}>
                <div className="h-full bg-[#F5F3EE] px-5 py-5">
                  <p className="text-sm" style={{ color: green }}>{item.title}</p>
                  <p className="mt-3 text-[15px] leading-7 text-black/75">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 max-w-3xl text-[clamp(18px,2vw,24px)] leading-8" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif' }}>
              {planflowWork.close}
            </p>
          </Reveal>
        </section>

        {embedded ? null : (
          <div className="mt-16 flex flex-wrap gap-6 border-t border-black/10 pt-6 text-sm">
            {planflowLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
