import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  hrCaseStudy,
  hrEval,
  hrHero,
  hrInnovation,
  hrLinks,
  hrPosition,
  hrPrinciples,
  hrProblem,
  hrResults,
  hrSystem,
  hrWork,
} from '@/src/projects/hrCase.data'

const song = '"Noto Serif SC", "Source Han Serif SC", "STZhongsong", "华文中宋", "Songti SC", "SimSun", serif'
const sans = '"Noto Sans SC", "Geist Variable", sans-serif'
const mono = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace'
const ink = '#1E3A2F'

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

function CountFigure({ display, active, delay = 0 }: { display: string; active: boolean; delay?: number }) {
  const match = /^([+-]?)(\d+(?:\.\d+)?)(.*)$/.exec(display)
  const format = (value: number) => {
    if (!match) return display
    const [, sign, digits, suffix] = match
    const decimals = digits.includes('.') ? digits.split('.')[1].length : 0
    const numeric = Number(digits)
    const pad = !decimals && digits.length > String(numeric).length ? digits.length : 0
    const shown = decimals ? value.toFixed(decimals) : pad ? String(Math.round(value)).padStart(pad, '0') : String(Math.round(value))
    return `${sign}${shown}${suffix}`
  }
  const [text, setText] = useState(match && !reducedMotion() ? format(0) : display)

  useEffect(() => {
    if (!match || reducedMotion()) {
      setText(display)
      return
    }
    if (!active) {
      setText(format(0))
      return
    }
    const to = Number(match[2])
    let frame = 0
    setText(format(0))
    const timer = window.setTimeout(() => {
      const started = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / 880)
        const eased = 1 - (1 - progress) ** 3
        setText(format(to * eased))
        if (progress < 1) frame = requestAnimationFrame(tick)
        else setText(display)
      }
      frame = requestAnimationFrame(tick)
    }, delay)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [active, delay, display])

  return <>{text}</>
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, shown } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`hr-reveal ${shown ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 text-[12px] tracking-[0.18em]" style={{ fontFamily: mono, color: ink }}>
      {children}
    </p>
  )
}

function SectionTitle({ children }: { children: string }) {
  const { ref, shown } = useInView<HTMLDivElement>(0.2)
  return (
    <div ref={ref} className={`hr-reveal ${shown ? 'is-in' : ''}`}>
      <h2 className="m-0 max-w-[18em] text-[clamp(18px,3.6vw,46px)] leading-[1.28] font-medium text-[#1A1916]" style={{ fontFamily: song }}>
        {children.split('\n').map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      <span className="hr-line mt-4 block h-px w-16" style={{ background: ink }} />
    </div>
  )
}

function Stat({ value, label, note, delay = 0 }: { value: string; label: string; note?: string; delay?: number }) {
  const { ref, shown } = useInView<HTMLElement>(0.2)
  return (
    <article ref={ref} className={`hr-reveal border border-[#1A1916]/15 bg-[#F5F3EE] px-4 py-5 ${shown ? 'is-in' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <p className="m-0 text-[clamp(32px,4vw,52px)] leading-none" style={{ fontFamily: mono, color: ink }}>
        <CountFigure display={value} active={shown} delay={delay} />
      </p>
      <p className="mt-4 mb-0 text-[14px] leading-6" style={{ fontFamily: mono }}>
        {label}
      </p>
      {note ? <p className="mt-2 mb-0 text-[13px] leading-6 text-[#1A1916]/70">{note}</p> : null}
    </article>
  )
}

function ResultsBoard() {
  const { ref, shown } = useInView<HTMLDivElement>(0.05)
  return (
    <div ref={ref} className={`hr-reveal mt-8 border border-[#1A1916]/15 ${shown ? 'is-in' : ''}`}>
      <div className="hidden border-b border-[#1A1916]/15 md:grid md:grid-cols-[1.3fr_repeat(3,1fr)]">
        {hrResults.columns.map((column) => (
          <p key={column} className="m-0 px-3 py-3 text-[12px] leading-5 tracking-[0.06em]" style={{ fontFamily: mono }}>
            {column}
          </p>
        ))}
      </div>
      {hrResults.rows.map((row, rowIndex) => (
        <div key={row.metric} className="grid border-t border-[#1A1916]/15 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <p className="m-0 px-3 py-3 text-[14px] leading-6">{row.metric}</p>
          {row.values.map((value, index) => (
            <p key={`${row.metric}-${index}`} className="m-0 px-3 py-3 text-[16px] leading-6" style={{ fontFamily: mono, color: index === 2 ? ink : '#1A1916' }}>
              <span className="mr-2 text-[11px] tracking-[0.08em] text-[#1A1916]/45 md:hidden">{hrResults.columns[index + 1]}</span>
              <CountFigure display={value} active={shown} delay={rowIndex * 50} />
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}

function ContrastCard({ contrast, delay }: { contrast: (typeof hrResults.contrasts)[number]; delay: number }) {
  const { ref, shown } = useInView<HTMLElement>(0.2)
  return (
    <article ref={ref} className={`hr-reveal border border-[#1A1916]/15 px-4 py-5 ${shown ? 'is-in' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <p className="m-0 text-[12px] tracking-[0.12em]" style={{ fontFamily: mono }}>
        {contrast.title}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {contrast.items.map((item, index) => (
          <div key={item.label}>
            <p className="m-0 text-[clamp(32px,4vw,48px)] leading-none" style={{ fontFamily: mono, color: ink }}>
              <CountFigure display={item.value} active={shown} delay={delay + index * 80} />
            </p>
            <p className="mt-2 mb-0 text-[14px] leading-6">{item.label}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

export default function HrCase({ onClose, embedded = false }: { onClose?: () => void; embedded?: boolean }) {
  return (
    <article className="hr-case text-[#1A1916]" style={{ fontFamily: sans, background: '#F5F3EE' }}>
      {embedded ? null : (
        <div className="mx-auto w-full max-w-[1120px] px-5 pt-8 sm:px-8">
          <button type="button" onClick={onClose} className="text-[12px] tracking-[0.18em] underline underline-offset-4" style={{ fontFamily: mono }}>
            返回
          </button>
        </div>
      )}

      <header className={`mx-auto w-full max-w-[1120px] px-5 pb-16 sm:px-8 ${embedded ? 'pt-16' : 'pt-8'}`}>
        <Kicker>01 / {hrHero.tag}</Kicker>
        <p className="mt-4 mb-0 text-[13px] tracking-[0.14em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
          {hrHero.english}
        </p>
        <h1 className="mt-3 text-[clamp(40px,6vw,72px)] leading-none font-medium" style={{ fontFamily: song }}>
          {hrHero.name}
        </h1>
        <p className="mt-4 max-w-[16em] text-[clamp(28px,3.4vw,42px)] leading-[1.25] font-medium" style={{ fontFamily: song }}>
          {hrHero.title[0]}
          <br />
          {hrHero.title[1]}
        </p>
        <p className="mt-6 max-w-[42rem] text-[16px] leading-8 text-[#1A1916]/80">{hrHero.body}</p>
        <dl className="mt-6 max-w-[36rem] border-t border-[#1A1916]/15 pt-4">
          <dt className="text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
            我的职责
          </dt>
          <dd className="mt-2 mb-0 text-[16px] leading-7">
            {hrHero.role}
            <span className="mt-1 block text-[14px] text-[#1A1916]/70">{hrHero.roleNote}</span>
          </dd>
        </dl>
        {embedded ? null : (
          <ul className="mt-6 grid max-w-[40rem] list-none gap-3 p-0 sm:grid-cols-2">
            {hrLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer" className="block h-full border border-[#1A1916]/15 px-4 py-4 hover:border-[#1A1916]">
                  <span className="text-[12px] tracking-[0.16em]" style={{ fontFamily: mono, color: ink }}>
                    {link.label}
                  </span>
                  <span className="mt-2 block text-[14px] leading-7">{link.note}</span>
                  <span className="mt-2 block text-[12px] leading-5 break-all underline underline-offset-4" style={{ fontFamily: mono }}>
                    {link.href}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {hrHero.stats.map((stat, index) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} note={stat.note} delay={index * 70} />
          ))}
        </div>
        <Reveal className="mt-6" delay={80}>
          <p className="mb-0 max-w-[48rem] border-t pt-4 text-[14px] leading-7 text-[#1A1916]/75" style={{ borderColor: ink }}>
            <span className="mr-2 text-[12px] tracking-[0.14em]" style={{ fontFamily: mono }}>
              实验设置
            </span>
            {hrHero.setup}
          </p>
        </Reveal>
      </header>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {hrProblem.index} / {hrProblem.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{hrProblem.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {hrProblem.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 80}>
                <p className="m-0 text-[15px] leading-8">{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {hrProblem.figures.map((figure, index) => (
              <Stat key={figure.value} value={figure.value} label={figure.label} delay={index * 80} />
            ))}
          </div>
          <Reveal className="mt-4">
            <p className="mb-0 text-[13px] leading-7 text-[#1A1916]/65">{hrProblem.note}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {hrPosition.index} / {hrPosition.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{hrPosition.title}</SectionTitle>
          </div>
          <Reveal className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <ol className="m-0 grid list-none gap-2 p-0">
              {hrPosition.flow.map((step, index) => (
                <li key={step} className="border border-[#1A1916]/15 px-4 py-3 text-[15px] leading-7">
                  <span className="mr-2 text-[12px]" style={{ fontFamily: mono, color: ink }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="grid gap-3">
              <article className="border border-[#1A1916] px-4 py-5">
                <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                  系统负责
                </p>
                <ul className="mt-3 mb-0 grid list-none gap-2 p-0">
                  {hrPosition.does.map((item) => (
                    <li key={item} className="border-t border-[#1A1916]/15 pt-2 text-[15px] leading-7">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="border border-[#1A1916]/15 px-4 py-5">
                <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                  系统不负责
                </p>
                <ul className="mt-3 mb-0 grid list-none gap-2 p-0">
                  {hrPosition.doesNot.map((item) => (
                    <li key={item} className="border-t border-[#1A1916]/15 pt-2 text-[15px] leading-7">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </Reveal>
          <Reveal className="mt-8">
            <p className="max-w-[40rem] border-t pt-4 text-[20px] leading-9" style={{ fontFamily: song, borderColor: ink }}>
              {hrPosition.close}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {hrPrinciples.index} / {hrPrinciples.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{hrPrinciples.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {hrPrinciples.cards.map((card, index) => (
              <Reveal key={card.index} delay={index * 80}>
                <article className="h-full border border-[#1A1916]/15 px-4 py-5">
                  <p className="m-0 text-[12px] tracking-[0.14em]" style={{ fontFamily: mono, color: ink }}>
                    {card.index} / {card.title}
                  </p>
                  <p className="mt-3 mb-0 text-[15px] leading-8">{card.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {hrSystem.index} / {hrSystem.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{hrSystem.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {hrSystem.layers.map((layer, index) => (
              <Reveal key={layer.name} delay={index * 80}>
              <article className="h-full border border-[#1A1916]/15 px-4 py-5">
                <h3 className="m-0 text-[22px] leading-8 font-medium" style={{ fontFamily: song }}>
                  {layer.name}
                </h3>
                <ul className="mt-4 mb-0 grid list-none gap-2 p-0">
                  {layer.items.map((item) => (
                    <li key={item} className="border-t border-[#1A1916]/15 pt-2 text-[14px] leading-7">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-4">
          <ul className="grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {hrSystem.stack.map((item) => (
              <li key={item} className="border border-[#1A1916]/15 px-3 py-3 text-[14px] leading-6" style={{ fontFamily: mono }}>
                {item}
              </li>
            ))}
          </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {hrEval.index} / {hrEval.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{hrEval.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hrEval.figures.map((figure, index) => (
              <Stat key={figure.label} value={figure.value} label={figure.label} note={'note' in figure ? figure.note : undefined} delay={index * 60} />
            ))}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {hrEval.rubric.map((item, index) => (
              <Reveal key={item.code} delay={index * 50}>
              <article className="h-full border border-[#1A1916]/15 px-3 py-4">
                <p className="m-0 text-[13px] tracking-[0.12em]" style={{ fontFamily: mono, color: ink }}>
                  {item.code}
                </p>
                <p className="mt-2 mb-0 text-[14px] leading-6">{item.name}</p>
              </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6">
          <ul className="grid list-none gap-2 p-0">
            {hrEval.notes.map((note) => (
              <li key={note} className="border-t border-[#1A1916]/15 pt-2 text-[14px] leading-7 text-[#1A1916]/80">
                {note}
              </li>
            ))}
          </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {hrResults.index} / {hrResults.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{hrResults.title}</SectionTitle>
          </div>
          <ResultsBoard />
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {hrResults.contrasts.map((contrast, index) => (
              <ContrastCard key={contrast.title} contrast={contrast} delay={index * 80} />
            ))}
          </div>
          <Reveal className="mt-6 grid gap-3 md:grid-cols-2">
            {hrResults.definitions.map((item) => (
              <p key={item.name} className="m-0 border-t border-[#1A1916]/15 pt-3 text-[14px] leading-7">
                <span className="mr-2" style={{ fontFamily: mono, color: ink }}>
                  {item.name}
                </span>
                {item.body}
              </p>
            ))}
          </Reveal>
          <Reveal className="mt-4">
            <p className="mb-0 text-[13px] leading-7 text-[#1A1916]/70">所有实验组使用：{hrResults.same}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {hrCaseStudy.index} / {hrCaseStudy.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{hrCaseStudy.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 lg:grid-cols-2">
            <Reveal>
            <article className="h-full border border-[#1A1916]/15 px-4 py-5">
              <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                关键词筛选
              </p>
              <p className="mt-3 mb-0 text-[16px] leading-8">{hrCaseStudy.keyword}</p>
            </article>
            </Reveal>
            <Reveal delay={90}>
            <article className="h-full border border-[#1A1916] px-4 py-5">
              <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono, color: ink }}>
                完整系统的证据链
              </p>
              <ul className="mt-3 mb-0 grid list-none gap-2 p-0">
                {hrCaseStudy.evidence.map((item) => (
                  <li key={item} className="border-t border-[#1A1916]/15 pt-2 text-[15px] leading-7">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-3 mb-0 text-[15px] leading-7">{hrCaseStudy.bridge}</p>
            </article>
            </Reveal>
          </div>
          <Reveal className="mt-8">
            <p className="max-w-[42rem] border-t pt-4 text-[18px] leading-8" style={{ fontFamily: song, borderColor: ink }}>
              {hrCaseStudy.close}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {hrInnovation.index} / {hrInnovation.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{hrInnovation.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {hrInnovation.cards.map((card, index) => (
              <Reveal key={card.index} delay={index * 80}>
              <article className="h-full border border-[#1A1916]/15 px-4 py-5">
                <p className="m-0 text-[12px] tracking-[0.14em]" style={{ fontFamily: mono, color: ink }}>
                  {card.index} / {card.title}
                </p>
                <h3 className="mt-3 mb-0 text-[22px] leading-8 font-medium" style={{ fontFamily: song }}>
                  {card.name}
                </h3>
                <p className="mt-3 mb-0 text-[15px] leading-8">{card.body}</p>
              </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {hrWork.index} / {hrWork.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{hrWork.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {hrWork.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
              <article className="h-full border border-[#1A1916]/15 px-4 py-5">
                <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono, color: ink }}>
                  0{index + 1}
                </p>
                <h3 className="mt-3 mb-0 text-[22px] leading-8 font-medium" style={{ fontFamily: song }}>
                  {item.title}
                </h3>
                <p className="mt-3 mb-0 text-[15px] leading-8">{item.body}</p>
              </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <p className="max-w-[42rem] border-t pt-5 text-[20px] leading-9" style={{ fontFamily: song, borderColor: ink }}>
              {hrWork.close}
            </p>
          </Reveal>
        </div>
      </section>
    </article>
  )
}
