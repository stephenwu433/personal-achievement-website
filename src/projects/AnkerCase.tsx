import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ankerAcceptance,
  ankerArchitecture,
  ankerFact,
  ankerGoals,
  ankerHero,
  ankerLinks,
  ankerOverview,
  ankerProblem,
  ankerRisk,
  ankerStep,
  ankerValue,
  ankerWork,
} from '@/src/projects/ankerCase.data'

const song = '"Noto Serif SC", "Source Han Serif SC", "STZhongsong", "华文中宋", "Songti SC", "SimSun", serif'
const sans = '"Noto Sans SC", "Geist Variable", sans-serif'
const mono = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace'

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useInView<T extends HTMLElement>(threshold = 0.22) {
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
      { root: scroller instanceof HTMLElement ? scroller : null, threshold },
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
    const scroller = node?.closest('[data-project-sheet]')
    if (!node || !(scroller instanceof HTMLElement)) return
    if (reducedMotion()) {
      setPhase(count - 1)
      return
    }
    const onScroll = () => {
      const view = scroller.getBoundingClientRect()
      const rect = node.getBoundingClientRect()
      const start = view.bottom - 48
      const end = view.top + 160
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

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 text-[12px] tracking-[0.18em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
      {children}
    </p>
  )
}

function SectionTitle({ children }: { children: string }) {
  const { ref, shown } = useInView<HTMLDivElement>()
  const lines = children.split('\n')
  return (
    <div ref={ref} className={`anker-reveal max-w-[18em] ${shown ? 'is-in' : ''}`}>
      <h2 className="m-0 text-[clamp(28px,3.6vw,46px)] leading-[1.28] font-medium text-[#1A1916]" style={{ fontFamily: song }}>
        {lines.map((line, index) => (
          <span key={line}>
            {index > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </h2>
      <span className="mt-4 block h-px w-16 bg-[#1A1916]" />
    </div>
  )
}

const Chain = forwardRef<HTMLOListElement, { steps: readonly string[]; phase?: number; wide?: boolean }>(function Chain({ steps, phase, wide = false }, ref) {
  return (
    <ol ref={ref} className={`grid list-none gap-2 p-0 md:grid-cols-2 ${wide ? 'xl:grid-cols-6' : 'xl:grid-cols-3'}`}>
      {steps.map((step, index) => {
        const lit = phase === undefined || index <= phase
        const waiting = phase !== undefined && index > phase
        return (
          <li key={step} className={`anker-step border px-3 py-3 text-[14px] leading-7 ${lit ? 'is-lit' : ''} ${waiting ? 'is-wait' : ''}`}>
            <span className="mr-2 text-[12px]" style={{ fontFamily: mono }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            {step}
          </li>
        )
      })}
    </ol>
  )
})

export default function AnkerCase({ onClose }: { onClose: () => void }) {
  const { ref: flowRef, phase } = useFlowPhase(ankerOverview.steps.length)

  return (
    <article className="anker-case text-[#1A1916]" style={{ fontFamily: sans, background: '#F5F3EE' }}>
      <div className="mx-auto w-full max-w-[1120px] px-5 pt-8 sm:px-8">
        <button type="button" onClick={onClose} className="text-[12px] tracking-[0.18em] underline underline-offset-4" style={{ fontFamily: mono }}>
          返回
        </button>
      </div>

      <header className="mx-auto w-full max-w-[1120px] px-5 pt-8 pb-16 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <Kicker>01 / {ankerHero.tag}</Kicker>
            <p className="mt-4 mb-0 text-[20px] leading-8" style={{ fontFamily: song }}>
              {ankerHero.name}
            </p>
            <h1 className="mt-4 text-[clamp(30px,3.1vw,40px)] leading-[1.25] font-medium" style={{ fontFamily: song }}>
              <span className="block">{ankerHero.title[0]}</span>
              <span className="block">{ankerHero.title[1]}</span>
            </h1>
            <p className="mt-6 max-w-[38rem] text-[16px] leading-8 text-[#1A1916]/80">{ankerHero.subtitle}</p>
            <dl className="mt-6 border-t border-[#1A1916]/15 pt-4">
              <dt className="text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
                我的职责
              </dt>
              <dd className="mt-2 mb-0 text-[16px] leading-7">
                {ankerHero.role}
                <span className="mt-1 block text-[14px] text-[#1A1916]/70">{ankerHero.roleNote}</span>
              </dd>
            </dl>
            <ul className="mt-6 grid list-none gap-3 p-0">
              {ankerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block border border-[#1A1916]/15 px-4 py-4 transition-colors hover:border-[#1A1916]"
                  >
                    <span className="text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
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
          </div>
          <aside className="border border-[#1A1916]/15">
            <p className="m-0 border-b border-[#1A1916]/15 px-4 py-3 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
              {ankerHero.boardLabel}
            </p>
            <ol className="m-0 list-none p-0">
              {ankerHero.stats.map((stat) => (
                <li key={stat.value} className="grid grid-cols-[4.6rem_1fr] gap-3 border-t border-[#1A1916]/15 px-4 py-4 first:border-t-0">
                  <span className="text-[clamp(28px,3vw,40px)] leading-none" style={{ fontFamily: mono }}>
                    {stat.value}
                  </span>
                  <span>
                    <span className="block text-[15px] leading-7">{stat.label}</span>
                    <span className="mt-1 block text-[13px] leading-6 text-[#1A1916]/70">{stat.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
        <p className="mt-8 mb-0 max-w-[46rem] border-t border-[#1A1916] pt-4 text-[14px] leading-7 text-[#1A1916]/70">{ankerHero.footnote}</p>
      </header>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {ankerProblem.index} / {ankerProblem.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{ankerProblem.title}</SectionTitle>
          </div>
          <Reveal>
            <p className="mt-8 text-[18px] leading-8" style={{ fontFamily: song }}>
              {ankerProblem.lead}
            </p>
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              {ankerProblem.paragraphs.map((paragraph) => (
                <p key={paragraph} className="m-0 text-[16px] leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border border-[#1A1916]/15 px-4 py-5">
              <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                {ankerProblem.chainLabel}
              </p>
              <ol className="mt-4 grid list-none gap-3 p-0">
                {ankerProblem.chain.map((step, index) => (
                  <li key={step} className="grid grid-cols-[1.5rem_1fr] gap-2 text-[15px] leading-7">
                    <span style={{ fontFamily: mono }}>{index === 0 ? '·' : '↓'}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                {ankerProblem.impactLabel}
              </p>
              <div className="mt-4 grid gap-3">
                {ankerProblem.impacts.map((impact) => (
                  <article key={impact.title} className="border border-[#1A1916]/15 px-4 py-4">
                    <h3 className="m-0 text-[16px] leading-7 font-medium">{impact.title}</h3>
                    <p className="mt-2 mb-0 text-[15px] leading-7 text-[#1A1916]/80">{impact.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {ankerGoals.index} / {ankerGoals.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{ankerGoals.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {ankerGoals.goals.map((goal) => (
              <article key={goal.index} className="border border-[#1A1916]/15 px-4 py-5">
                <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                  {goal.index}｜{goal.title}
                </p>
                <p className="mt-3 mb-0 text-[15px] leading-8">{goal.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-[40rem] border-t border-[#1A1916] pt-4 text-[20px] leading-9" style={{ fontFamily: song }}>
            {ankerGoals.close}
          </p>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {ankerOverview.index} / {ankerOverview.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{ankerOverview.title}</SectionTitle>
          </div>
          <div className="mt-8">
            <Chain ref={flowRef} steps={ankerOverview.steps} phase={phase} wide />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {ankerOverview.outcomes.map((outcome) => (
              <article key={outcome.code} className="border border-[#1A1916]/15 px-4 py-4">
                <p className="m-0 text-[13px] tracking-[0.14em]" style={{ fontFamily: mono }}>
                  {outcome.code}
                </p>
                <p className="mt-2 mb-0 text-[15px] leading-7">{outcome.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {ankerFact.index} / {ankerFact.code}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{ankerFact.title}</SectionTitle>
          </div>
          <p className="mt-6 max-w-[40rem] text-[16px] leading-8">
            <span className="mr-2 text-[12px] tracking-[0.14em]" style={{ fontFamily: mono }}>
              {ankerFact.sceneLabel}
            </span>
            {ankerFact.scene}
          </p>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {ankerFact.columns.map((column) => (
              <article key={column.index} className="border border-[#1A1916]/15 px-4 py-5">
                <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                  {column.index}. {column.title}
                </p>
                <p className="mt-3 mb-0 text-[15px] leading-8">{column.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <Chain steps={ankerFact.chain} />
          </div>
          <p className="mt-4 mb-0 max-w-[40rem] text-[14px] leading-7 text-[#1A1916]/70">{ankerFact.note}</p>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {ankerStep.index} / {ankerStep.code}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{ankerStep.title}</SectionTitle>
          </div>
          <p className="mt-6 max-w-[40rem] text-[16px] leading-8">
            <span className="mr-2 text-[12px] tracking-[0.14em]" style={{ fontFamily: mono }}>
              {ankerStep.sceneLabel}
            </span>
            {ankerStep.scene}
          </p>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <ol className="grid list-none gap-3 p-0">
              {ankerStep.states.map((state, index) => (
                <li key={state.code} className="border border-[#1A1916]/15 px-4 py-4">
                  <p className="m-0 text-[13px] tracking-[0.14em]" style={{ fontFamily: mono }}>
                    0{index + 1} {state.code}
                  </p>
                  <p className="mt-2 mb-0 text-[15px] leading-7">{state.body}</p>
                </li>
              ))}
            </ol>
            <div className="border border-[#1A1916]/15 px-4 py-4">
              <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                {ankerStep.fieldsLabel}
              </p>
              <ul className="mt-3 mb-0 grid list-none gap-2 p-0">
                {ankerStep.fields.map((field) => (
                  <li key={field} className="border-t border-[#1A1916]/15 pt-2 text-[15px] leading-7">
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-8 max-w-[40rem] border-t border-[#1A1916] pt-4 text-[18px] leading-8" style={{ fontFamily: song }}>
            {ankerStep.close}
          </p>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {ankerRisk.index} / {ankerRisk.code}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{ankerRisk.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <article className="border border-[#1A1916] px-4 py-5">
              <h3 className="m-0 text-[20px] leading-8 font-medium" style={{ fontFamily: song }}>
                {ankerRisk.block.title}
              </h3>
              <p className="mt-4 mb-2 text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
                {ankerRisk.block.triggerLabel}
              </p>
              <p className="m-0 text-[16px] leading-8">{ankerRisk.block.triggers.join('｜')}</p>
              <p className="mt-4 mb-2 text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
                {ankerRisk.block.actionLabel}
              </p>
              <ul className="m-0 grid list-none gap-2 p-0">
                {ankerRisk.block.actions.map((action) => (
                  <li key={action} className="border-t border-[#1A1916]/15 pt-2 text-[15px] leading-7">
                    {action}
                  </li>
                ))}
              </ul>
            </article>
            <article className="border border-[#1A1916]/15 px-4 py-5">
              <h3 className="m-0 text-[20px] leading-8 font-medium" style={{ fontFamily: song }}>
                {ankerRisk.handoff.title}
              </h3>
              <p className="mt-4 mb-2 text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
                {ankerRisk.handoff.triggerLabel}
              </p>
              <ul className="m-0 grid list-none gap-2 p-0">
                {ankerRisk.handoff.triggers.map((trigger) => (
                  <li key={trigger} className="text-[15px] leading-7">
                    {trigger}
                  </li>
                ))}
              </ul>
              <p className="mt-4 mb-2 text-[12px] tracking-[0.16em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
                {ankerRisk.handoff.packetLabel}
              </p>
              <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
                {ankerRisk.handoff.packet.map((item) => (
                  <li key={item} className="border-t border-[#1A1916]/15 pt-2 text-[15px] leading-7">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <p className="mt-8 max-w-[40rem] border-t border-[#1A1916] pt-4 text-[20px] leading-9" style={{ fontFamily: song }}>
            {ankerRisk.close}
          </p>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {ankerArchitecture.index} / {ankerArchitecture.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{ankerArchitecture.title}</SectionTitle>
          </div>
          <ol className="mt-8 grid list-none gap-px bg-[#1A1916]/15 p-0">
            {ankerArchitecture.layers.map((layer) => (
              <li key={layer.index} className="grid gap-2 bg-[#F5F3EE] px-4 py-5 sm:grid-cols-[16rem_1fr] sm:items-baseline">
                <p className="m-0 text-[14px] tracking-[0.08em]" style={{ fontFamily: mono }}>
                  {layer.index}｜{layer.name}
                </p>
                <p className="m-0 text-[15px] leading-7">{layer.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ankerArchitecture.split.map((side) => (
              <article key={side.title} className="border border-[#1A1916]/15 px-4 py-4">
                <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                  {side.title}
                </p>
                <p className="mt-3 mb-0 text-[16px] leading-8">{side.items.join('｜')}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {ankerAcceptance.index} / {ankerAcceptance.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{ankerAcceptance.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-px bg-[#1A1916]/15 sm:grid-cols-2 xl:grid-cols-4">
            {ankerAcceptance.board.map((item) => (
              <article key={item.value} className="bg-[#F5F3EE] px-4 py-5">
                <p className="m-0 text-[clamp(28px,3vw,40px)] leading-none" style={{ fontFamily: mono }}>
                  {item.value}
                </p>
                <p className="mt-4 mb-0 text-[15px] leading-7">{item.label}</p>
                <p className="mt-2 mb-0 text-[13px] leading-6 text-[#1A1916]/70">{item.note}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {ankerAcceptance.paragraphs.map((paragraph) => (
              <p key={paragraph} className="m-0 text-[16px] leading-8">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 border border-[#1A1916]/15">
            <div className="grid border-b border-[#1A1916]/15 sm:grid-cols-[12rem_1fr]">
              {ankerAcceptance.columns.map((column) => (
                <p key={column} className="m-0 px-4 py-3 text-[12px] tracking-[0.14em]" style={{ fontFamily: mono }}>
                  {column}
                </p>
              ))}
            </div>
            {ankerAcceptance.rows.map((row) => (
              <div key={row.item} className="grid border-t border-[#1A1916]/15 sm:grid-cols-[12rem_1fr]">
                <p className="m-0 px-4 py-3 text-[15px] leading-7">{row.item}</p>
                <p className="m-0 px-4 py-3 text-[15px] leading-7 text-[#1A1916]/80">{row.check}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[40rem] border-t border-[#1A1916] pt-4 text-[20px] leading-9" style={{ fontFamily: song }}>
            {ankerAcceptance.close}
          </p>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {ankerValue.index} / {ankerValue.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{ankerValue.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {ankerValue.cards.map((card) => (
              <article key={card.title} className="border border-[#1A1916]/15 px-4 py-5">
                <h3 className="m-0 text-[20px] leading-8 font-medium" style={{ fontFamily: song }}>
                  {card.title}
                </h3>
                {card.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 mb-0 text-[15px] leading-8">
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}
          </div>
          <ol className="mt-8 grid list-none gap-px bg-[#1A1916]/15 p-0 sm:grid-cols-2 xl:grid-cols-5">
            {ankerValue.summary.map((item) => (
              <li key={item.text} className="bg-[#F5F3EE] px-4 py-5">
                <p className="m-0 text-[clamp(28px,3vw,40px)] leading-none" style={{ fontFamily: mono }}>
                  {item.value}
                </p>
                <p className="mt-3 mb-0 text-[14px] leading-7">{item.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[42rem] border-t border-[#1A1916] pt-4 text-[20px] leading-9" style={{ fontFamily: song }}>
            {ankerValue.close}
          </p>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <Kicker>
            {ankerWork.index} / {ankerWork.kicker}
          </Kicker>
          <div className="mt-4">
            <SectionTitle>{ankerWork.title}</SectionTitle>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {ankerWork.items.map((item, index) => (
              <article key={item.title} className="border border-[#1A1916]/15 px-4 py-5">
                <p className="m-0 text-[12px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                  0{index + 1}
                </p>
                <h3 className="mt-3 mb-0 text-[22px] leading-8 font-medium" style={{ fontFamily: song }}>
                  {item.title}
                </h3>
                <p className="mt-3 mb-0 text-[15px] leading-8">{item.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-[42rem] border-t border-[#1A1916] pt-5 text-[20px] leading-9" style={{ fontFamily: song }}>
            {ankerWork.close}
          </p>
        </div>
      </section>
    </article>
  )
}
