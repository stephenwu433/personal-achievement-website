import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import MuseVisualArchive from './MuseVisualArchive'
import { museDirections, museHero, museJudgment, museMethod, museSignals, museWork } from './museCase.data'

const ink = '#181715'
const paper = '#F5F2EC'
const wine = '#9B293C'
const silver = '#AAA59E'
const line = 'rgba(24, 23, 21, 0.22)'

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
    <div ref={ref} className={`muse-reveal ${shown ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function CountFigure({ value, className = '', style }: { value: string; className?: string; style?: CSSProperties }) {
  const { ref, shown } = useInView<HTMLParagraphElement>()
  const [text, setText] = useState(value)
  useEffect(() => {
    const match = value.match(/^(\+?)([\d,]+)(.*)$/)
    if (!match) return
    const prefix = match[1]
    const target = Number(match[2].replace(/,/g, ''))
    const suffix = match[3]
    const format = (current: number) => `${prefix}${Math.round(current)}${suffix}`
    if (!shown) {
      setText(format(0))
      return
    }
    let frame = 0
    const frames = 42
    const tick = () => {
      frame += 1
      const progress = 1 - (1 - frame / frames) ** 3
      setText(format(target * Math.min(progress, 1)))
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

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  const lines = title.split('\n')
  return (
    <div>
      <p className="text-[11px] tracking-[0.22em]" style={{ color: silver }}>
        {kicker}
      </p>
      <h2 className="mt-4 max-w-[16em] text-[clamp(18px,3.6vw,46px)] leading-[1.22] font-medium" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif', color: ink }}>
        {lines.map((lineText) => (
          <span key={lineText} className="block">
            {lineText}
          </span>
        ))}
      </h2>
    </div>
  )
}

export default function MuseCase({ embedded = false }: { embedded?: boolean }) {
  return (
    <article className={embedded ? 'mt-16 border-t pt-16' : 'min-h-screen px-5 py-16 md:px-10'} style={{ background: paper, color: ink, borderColor: line }}>
      <div className={embedded ? '' : 'mx-auto max-w-6xl'}>
        <Reveal>
          <header className="grid items-end gap-10 border-b pb-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)]" style={{ borderColor: line }}>
            <div>
              <p className="text-[11px] tracking-[0.22em]" style={{ color: silver }}>
                {museHero.index} / {museHero.kicker}
              </p>
              <h1 className="mt-5 text-[clamp(40px,6vw,72px)] leading-[1.02] font-medium" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif' }}>
                {museHero.title[0]}
                <span className="block">{museHero.title[1]}</span>
              </h1>
              <p className="mt-4 text-[12px] tracking-[0.16em]" style={{ color: silver }}>
                {museHero.english}
              </p>
              <p className="mt-5 max-w-[16em] text-[clamp(20px,2.4vw,30px)] leading-[1.35]" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif' }}>
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
            </div>
            <div className="border px-6 py-8" style={{ borderColor: line }}>
              <p className="text-[12px] tracking-[0.18em]" style={{ color: wine }}>
                {museHero.panel[0]}
              </p>
              <p className="mt-8 text-[clamp(28px,3.4vw,44px)] leading-[1.05] font-medium" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif' }}>
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
          </header>
        </Reveal>

        <section className="mt-16">
          <SectionTitle kicker={museSignals.kicker} title={museSignals.title} />
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {museSignals.stats.map((item, index) => (
              <div
                key={item.label}
                className={`muse-stat border px-4 py-6 ${index === museSignals.stats.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`}
                style={{ borderColor: line, background: paper }}
              >
                <CountFigure value={item.value} className="text-[clamp(36px,4vw,56px)] leading-none tabular-nums" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif' }} />
                <p className="mt-3 text-[13px]" style={{ color: silver }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] leading-6" style={{ color: silver }}>
            {museSignals.note}
          </p>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={museJudgment.kicker} title={museJudgment.title} />
          <ol className="mt-8 border-t" style={{ borderColor: line }}>
            {museJudgment.items.map((item) => (
              <li key={item.index} className="grid gap-2 border-b py-5 md:grid-cols-[9rem_minmax(0,1fr)] md:items-baseline" style={{ borderColor: line }}>
                <span className="text-[12px] tracking-[0.16em]" style={{ color: wine }}>
                  {item.index} / {item.title}
                </span>
                <span className="text-[15px] leading-7">{item.body}</span>
              </li>
            ))}
          </ol>
          <Reveal>
            <p className="mt-6 max-w-3xl text-[clamp(18px,2vw,24px)] leading-8" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif' }}>
              {museJudgment.close}
            </p>
          </Reveal>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <MuseVisualArchive />
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={museMethod.kicker} title={museMethod.title} />
          <ol className="mt-8 grid gap-px lg:grid-cols-5" style={{ background: line }}>
            {museMethod.flow.map((step, index) => (
              <li key={step} className="px-4 py-5" style={{ background: paper }}>
                <p className="text-[11px] tabular-nums tracking-[0.16em]" style={{ color: '#214C98' }}>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="mt-4 text-[15px] leading-6">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {museMethod.cards.map((card) => (
              <div key={card.index} className="border px-5 py-5" style={{ borderColor: line }}>
                <p className="text-[12px] tracking-[0.14em]" style={{ color: wine }}>
                  {card.index} / {card.title}
                </p>
                <p className="mt-3 text-[15px] leading-7">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={museDirections.kicker} title={museDirections.title} />
          <ol className="mt-8 border-t" style={{ borderColor: line }}>
            {museDirections.items.map((item, index) => (
              <li key={item} className="muse-direction border-b py-4" style={{ borderColor: line }}>
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
            ))}
          </ol>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={museWork.kicker} title={museWork.title} />
          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {museWork.items.map((item) => (
              <li key={item.index} className="border px-5 py-5" style={{ borderColor: line }}>
                <p className="text-[12px] tabular-nums tracking-[0.16em]" style={{ color: wine }}>
                  {item.index}
                </p>
                <p className="mt-3 text-[16px]">{item.title}</p>
                <p className="mt-3 text-[15px] leading-7">{item.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-3xl text-[clamp(18px,2vw,24px)] leading-8" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif' }}>
            {museWork.close}
          </p>
        </section>
      </div>
    </article>
  )
}
