import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  lorealAcceptance,
  lorealArchitecture,
  lorealEvidence,
  lorealFailure,
  lorealHandoff,
  lorealHero,
  lorealJourney,
  lorealPrinciples,
  lorealProblem,
  lorealStates,
  lorealWork,
} from '@/src/projects/lorealCase.data'

const song = '"Noto Serif SC", "Source Han Serif SC", "STZhongsong", "华文中宋", "Songti SC", "SimSun", serif'
const sans = '"Noto Sans SC", "Geist Variable", sans-serif'
const mono = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace'
const ink = '#1C3329'
const gold = '#8A6840'
const risk = '#7A2E2E'

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
    <div ref={ref} className={`loreal-reveal ${shown ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 text-[12px] tracking-[0.18em]" style={{ fontFamily: mono, color: gold }}>
      {children}
    </p>
  )
}

function SectionTitle({ children }: { children: string }) {
  const { ref, shown } = useInView<HTMLDivElement>(0.2)
  return (
    <div ref={ref} className={`loreal-reveal ${shown ? 'is-in' : ''}`}>
      <h2 className="m-0 max-w-[18em] text-[clamp(18px,3.6vw,46px)] leading-[1.28] font-medium text-[#1A1916]" style={{ fontFamily: song }}>
        {children.split('\n').map((line, index) => (
          <span key={`${index}-${line}`} className="block">
            {line}
          </span>
        ))}
      </h2>
      <span className="loreal-line mt-4 block h-px w-16" style={{ background: ink }} />
    </div>
  )
}

function Stat({ value, label, note, delay = 0 }: { value: string; label: string; note?: string; delay?: number }) {
  const { ref, shown } = useInView<HTMLElement>(0.2)
  return (
    <article ref={ref} className={`loreal-reveal border border-[#1A1916]/15 bg-[#F5F3EE] px-4 py-5 ${shown ? 'is-in' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
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

export default function LorealCase({ onClose, embedded = false }: { onClose?: () => void; embedded?: boolean }) {
  return (
    <article className="loreal-case text-[#1A1916]" style={{ fontFamily: sans, background: '#F5F3EE' }}>
      {embedded ? null : (
        <div className="mx-auto w-full max-w-[1120px] px-5 pt-8 sm:px-8">
          <button type="button" onClick={onClose} className="text-[12px] tracking-[0.18em] underline underline-offset-4" style={{ fontFamily: mono }}>
            返回
          </button>
        </div>
      )}

      <header className={`mx-auto w-full max-w-[1120px] px-5 pb-16 sm:px-8 ${embedded ? 'pt-16' : 'pt-8'}`}>
        <Kicker>01 / {lorealHero.tag}</Kicker>
        <p className="mt-3 mb-0 text-[14px] leading-7 text-[#1A1916]/70">{lorealHero.contest}</p>
        <p className="mt-4 mb-0 text-[13px] tracking-[0.14em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
          {lorealHero.english}
        </p>
        <h1 className="mt-3 text-[clamp(48px,7vw,84px)] leading-[0.9] font-medium" style={{ fontFamily: song }}>
          {lorealHero.mark.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-4 mb-0 text-[clamp(20px,2.4vw,28px)] leading-8 font-medium" style={{ fontFamily: song }}>
          {lorealHero.name}
        </p>
        <p className="mt-4 max-w-[16em] text-[clamp(22px,3vw,36px)] leading-[1.3] font-medium" style={{ fontFamily: song }}>
          {lorealHero.title[0]}
          <br />
          {lorealHero.title[1]}
        </p>
        <p className="mt-6 max-w-[42rem] text-[16px] leading-8 text-[#1A1916]/80">{lorealHero.body}</p>
        <dl className="mt-6 max-w-[40rem] border-t border-[#1A1916]/15 pt-4">
          <dt className="text-[12px] tracking-[0.16em]" style={{ fontFamily: mono, color: gold }}>
            我的角色
          </dt>
          <dd className="mt-2 mb-0 text-[16px] leading-7">
            {lorealHero.role}
            <span className="mt-1 block text-[14px] text-[#1A1916]/70">{lorealHero.roleNote}</span>
          </dd>
        </dl>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {lorealHero.stats.map((stat, index) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} note={stat.note} delay={index * 70} />
          ))}
        </div>
        <Reveal className="mt-8">
          <p className="max-w-[28em] border-t pt-4 text-[clamp(20px,2.4vw,28px)] leading-[1.45] font-medium" style={{ fontFamily: song, borderColor: ink }}>
            {lorealHero.close}
          </p>
        </Reveal>
      </header>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {lorealProblem.index} / {lorealProblem.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{lorealProblem.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {lorealProblem.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 80}>
                <p className="m-0 text-[16px] leading-8">{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {lorealProblem.misses.map((item, index) => (
              <Reveal key={item.index} delay={index * 80}>
                <article className="h-full border border-[#1A1916]/15 px-4 py-5">
                  <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono, color: ink }}>
                    {item.index}
                  </p>
                  <p className="mt-3 mb-0 text-[16px] leading-8">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <blockquote className="m-0 max-w-[24em] border-t pt-5 text-[clamp(20px,2.6vw,30px)] leading-[1.45] font-medium" style={{ fontFamily: song, borderColor: gold }}>
              {lorealProblem.quote.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {lorealPrinciples.index} / {lorealPrinciples.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{lorealPrinciples.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {lorealPrinciples.cards.map((card, index) => (
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
            {lorealJourney.index} / {lorealJourney.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{lorealJourney.title}</SectionTitle>
          </div>
          <Reveal className="mt-8">
          <ol className="grid list-none gap-2 p-0 md:grid-cols-2 xl:grid-cols-4">
            {lorealJourney.steps.map((step, index) => (
              <li key={step} className="border border-[#1A1916]/15 px-3 py-3 text-[14px] leading-7">
                <span className="mr-2 text-[12px]" style={{ fontFamily: mono, color: gold }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step}
              </li>
            ))}
          </ol>
          </Reveal>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {lorealJourney.records.map((record, index) => (
              <Reveal key={record.name} delay={index * 60}>
                <article className="h-full border border-[#1A1916] px-4 py-4">
                  <p className="m-0 text-[12px] tracking-[0.14em]" style={{ fontFamily: mono, color: ink }}>
                    {record.name}
                  </p>
                  <p className="mt-2 mb-0 text-[14px] leading-7">{record.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {lorealStates.index} / {lorealStates.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{lorealStates.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {lorealStates.states.map((state, index) => (
              <Reveal key={state.code} delay={index * 80}>
                <article className="h-full border px-4 py-5" style={{ borderColor: state.risk ? risk : 'rgba(26,25,22,0.15)' }}>
                  <p className="m-0 text-[13px] tracking-[0.14em]" style={{ fontFamily: mono, color: state.risk ? risk : ink }}>
                    {state.code} / {state.name}
                  </p>
                  <p className="mt-3 mb-0 text-[15px] leading-8">{state.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <p className="max-w-[28em] border-t pt-4 text-[20px] leading-9 font-medium" style={{ fontFamily: song, borderColor: ink }}>
              {lorealStates.close}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {lorealFailure.index} / {lorealFailure.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{lorealFailure.title}</SectionTitle>
          </div>
          <Reveal className="mt-6">
            <p className="max-w-[40rem] text-[16px] leading-8">{lorealFailure.scene}</p>
          </Reveal>
          <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <article className="h-full border border-[#1A1916]/15 px-4 py-5">
                <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                  系统需要记录
                </p>
                <ul className="mt-3 mb-0 grid list-none gap-2 p-0">
                  {lorealFailure.records.map((item) => (
                    <li key={item} className="border-t border-[#1A1916]/15 pt-2 text-[15px] leading-7">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="h-full border border-[#1A1916] px-4 py-5">
                <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono, color: ink }}>
                  核心规则
                </p>
                {lorealFailure.rules.map((rule) => (
                  <p key={rule} className="mt-3 mb-0 text-[16px] leading-8">
                    {rule}
                  </p>
                ))}
              </article>
            </Reveal>
          </div>
          <ul className="mt-4 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {lorealFailure.fields.map((field) => (
              <li key={field} className="border border-[#1A1916]/15 px-3 py-3 text-[14px] leading-6" style={{ fontFamily: mono }}>
                {field}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {lorealEvidence.index} / {lorealEvidence.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{lorealEvidence.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <article className="border border-[#1A1916] px-4 py-5">
              <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono, color: gold }}>
                KnowledgeItem
              </p>
              <ul className="mt-3 mb-0 grid list-none gap-2 p-0">
                {lorealEvidence.fields.map((field) => (
                  <li key={field} className="border-t border-[#1A1916]/15 pt-2 text-[15px] leading-7">
                    {field}
                  </li>
                ))}
              </ul>
            </article>
            <div>
              <ul className="m-0 grid list-none gap-2 p-0">
                {lorealEvidence.rules.map((rule) => (
                  <li key={rule} className="border-t border-[#1A1916]/15 pt-2 text-[15px] leading-7">
                    {rule}
                  </li>
                ))}
              </ul>
              <p className="mt-6 mb-0 max-w-[18em] text-[22px] leading-9 font-medium" style={{ fontFamily: song, color: ink }}>
                {lorealEvidence.close}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {lorealHandoff.index} / {lorealHandoff.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{lorealHandoff.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <article className="border border-[#1A1916]/15 px-4 py-5">
              <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                人工接管包
              </p>
              <ul className="mt-3 mb-0 grid list-none gap-2 p-0 sm:grid-cols-2">
                {lorealHandoff.packet.map((item) => (
                  <li key={item} className="border-t border-[#1A1916]/15 pt-2 text-[15px] leading-7">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="border border-[#1A1916] px-4 py-5">
              <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono, color: ink }}>
                人工客服工作台
              </p>
              <ul className="mt-3 mb-0 grid list-none gap-2 p-0">
                {lorealHandoff.desk.map((item) => (
                  <li key={item} className="border-t border-[#1A1916]/15 pt-2 text-[15px] leading-7">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 mb-2 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono, color: gold }}>
                结果确认
              </p>
              <p className="m-0 text-[15px] leading-7">{lorealHandoff.results.join('｜')}</p>
            </article>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {lorealHandoff.rules.map((rule) => (
              <p key={rule} className="m-0 border-t pt-3 text-[16px] leading-8" style={{ fontFamily: song, borderColor: ink }}>
                {rule}
              </p>
            ))}
          </div>
          <p className="mt-4 mb-0 text-[14px] leading-7 text-[#1A1916]/70">{lorealHandoff.boundary}</p>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {lorealArchitecture.index} / {lorealArchitecture.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{lorealArchitecture.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {lorealArchitecture.layers.map((layer, index) => (
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
          <ul className="mt-4 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {lorealArchitecture.stack.map((item) => (
              <li key={item} className="border border-[#1A1916]/15 px-3 py-3 text-[14px] leading-6" style={{ fontFamily: mono }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {lorealAcceptance.index} / {lorealAcceptance.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{lorealAcceptance.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {lorealAcceptance.groups.map((group, index) => (
              <Reveal key={group.range} delay={index * 60}>
                <article className="h-full border border-[#1A1916]/15 px-4 py-5">
                  <p className="m-0 text-[12px] tracking-[0.12em]" style={{ fontFamily: mono, color: gold }}>
                    {group.range}
                  </p>
                  <h3 className="mt-3 mb-0 text-[20px] leading-8 font-medium" style={{ fontFamily: song }}>
                    {group.name}
                  </h3>
                  <p className="mt-3 mb-0 text-[15px] leading-8">{group.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {lorealWork.index} / {lorealWork.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{lorealWork.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {lorealWork.items.map((item, index) => (
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
            <p className="max-w-[28em] border-t pt-5 text-[clamp(20px,2.4vw,28px)] leading-[1.5] font-medium" style={{ fontFamily: song, borderColor: ink }}>
              {lorealWork.close}
            </p>
          </Reveal>
        </div>
      </section>
    </article>
  )
}
