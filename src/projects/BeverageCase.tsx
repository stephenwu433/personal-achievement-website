import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  beverageBoundary,
  beverageClose,
  beverageEvolution,
  beverageHero,
  beverageJudgment,
  beveragePath,
  beveragePilot,
  beverageProblem,
  beverageScenario,
  beverageSystem,
  type HeroStat,
} from '@/src/projects/beverageCase.data'

const song = '"Noto Serif SC", "Source Han Serif SC", "STZhongsong", "华文中宋", "Songti SC", "SimSun", serif'
const sans = '"Noto Sans SC", "Geist Variable", sans-serif'
const mono = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace'

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reducedMotion()) {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { threshold: 0.22 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, shown }
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, shown } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`beverage-reveal ${shown ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function CountText({ stat, active }: { stat: HeroStat; active: boolean }) {
  const count = stat.count
  const [text, setText] = useState(count && !reducedMotion() ? (count.decimals ? (0).toFixed(count.decimals) + count.suffix : `0${count.suffix}`) : stat.display)

  useEffect(() => {
    if (!count) {
      setText(stat.display)
      return
    }
    if (!active || reducedMotion()) {
      setText(stat.display)
      return
    }
    const started = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / 880)
      const eased = 1 - (1 - progress) ** 3
      const value = count.to * eased
      const body = count.decimals ? value.toFixed(count.decimals) : String(Math.round(value))
      setText(`${body}${count.suffix}`)
      if (progress < 1) frame = requestAnimationFrame(tick)
      else setText(stat.display)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, count, stat.display])

  return <>{text}</>
}

function StatBox({ stat }: { stat: HeroStat }) {
  const { ref, shown } = useInView<HTMLElement>()
  return (
    <article ref={ref} className={`beverage-reveal border border-[#1A1916]/15 bg-[#F5F3EE] px-4 py-5 sm:px-5 sm:py-6 ${shown ? 'is-in' : ''}`}>
      <p className={`text-[clamp(28px,3vw,40px)] leading-none text-[#6B1F2A] ${shown ? 'is-in' : ''}`} style={{ fontFamily: mono }}>
        <CountText stat={stat} active={shown} />
      </p>
      <p className="mt-4 text-[13px] tracking-[0.18em] text-[#1A1916]" style={{ fontFamily: mono }}>
        {stat.label}
      </p>
      <p className="mt-2 text-[14px] leading-7 text-[#1A1916]/75" style={{ fontFamily: sans }}>
        {stat.note}
      </p>
    </article>
  )
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 text-[12px] tracking-[0.22em] text-[#6B1F2A]" style={{ fontFamily: mono }}>
      {children}
    </p>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  const { ref, shown } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`beverage-reveal ${shown ? 'is-in' : ''}`}>
      <h2 className="m-0 max-w-[18em] text-[clamp(18px,3.4vw,44px)] leading-[1.28] font-medium text-[#1A1916]" style={{ fontFamily: song }}>
        {typeof children === 'string'
          ? children.split('\n').map((line, index) => (
              <span key={`${index}-${line}`} className="block">
                {line}
              </span>
            ))
          : children}
      </h2>
      <span className={`mt-4 block h-px w-16 origin-left bg-[#6B1F2A] ${shown ? 'beverage-line is-in' : 'beverage-line'}`} />
    </div>
  )
}

export default function BeverageCase({ onClose, embedded = false }: { onClose?: () => void; embedded?: boolean }) {
  return (
    <article className="beverage-case text-[#1A1916]" style={{ fontFamily: sans, background: '#F5F3EE' }}>
      {embedded ? null : (
        <div className="mx-auto w-full max-w-[1120px] px-5 pt-8 sm:px-8">
          <button type="button" onClick={onClose} className="text-[12px] tracking-[0.18em] underline underline-offset-4" style={{ fontFamily: mono }}>
            返回
          </button>
        </div>
      )}

      <header className={`mx-auto w-full max-w-[1120px] px-5 pb-16 sm:px-8 ${embedded ? 'pt-16' : 'pt-10'}`}>
        <Reveal>
          <Kicker>01 / 品牌决策产品</Kicker>
          <h1 className="mt-4 max-w-[12em] text-[clamp(36px,5vw,64px)] leading-[1.15] font-medium break-keep" style={{ fontFamily: song }}>
            {beverageHero.title.slice(0, 8)}
            <br className="sm:hidden" />
            {beverageHero.title.slice(8)}
          </h1>
          <p className="mt-4 text-[18px] leading-8" style={{ fontFamily: song }}>
            {beverageHero.subtitle}
          </p>
          <p className="mt-6 text-[12px] tracking-[0.22em] text-[#6B1F2A]" style={{ fontFamily: mono }}>
            项目背景
          </p>
          <p className="mt-3 max-w-[40rem] text-[16px] leading-8 text-[#1A1916]/80">{beverageHero.background}</p>
        </Reveal>
        <div className="mt-12 grid gap-px bg-[#1A1916]/15 sm:grid-cols-2 lg:grid-cols-3">
          {beverageHero.stats.map((stat) => (
            <StatBox key={stat.id} stat={stat} />
          ))}
        </div>
        <Reveal className="mt-8 border-t border-[#6B1F2A] pt-5">
          <p className="max-w-[46rem] text-[18px] leading-9" style={{ fontFamily: song }}>
            {beverageHero.conclusion}
          </p>
        </Reveal>
      </header>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <SectionTitle>{beverageProblem.title}</SectionTitle>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {beverageProblem.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 80}>
                <p className="text-[15px] leading-8">{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <ol className="grid list-none gap-3 p-0 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
              {beverageProblem.flow.map((step, index) => (
                <li key={step} className="contents">
                  {index > 0 ? (
                    <span className="hidden items-center text-[#6B1F2A] md:flex" aria-hidden="true" style={{ fontFamily: mono }}>
                      →
                    </span>
                  ) : null}
                  <span className="flex items-center border border-[#1A1916]/15 px-4 py-4 text-[15px] leading-7">
                    <i className="mt-1.5 mr-3 inline-block size-1.5 shrink-0 bg-[#7E8C74]" aria-hidden="true" />
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <SectionTitle>{beverageJudgment.title}</SectionTitle>
          <Reveal>
            <p className="mt-8 max-w-[42rem] text-[16px] leading-8">{beverageJudgment.body}</p>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {beverageJudgment.states.map((state, index) => (
              <Reveal key={state.code} delay={index * 90}>
                <div className="h-full border border-[#1A1916]/15 px-4 py-4">
                  <p className="flex items-center gap-2 text-[13px] tracking-[0.16em]" style={{ fontFamily: mono }}>
                    <i className="inline-block size-1.5 bg-[#7E8C74]" aria-hidden="true" />
                    {state.code}
                  </p>
                  <p className="mt-3 text-[14px] leading-7">{state.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto grid w-full max-w-[1120px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionTitle>{beverageSystem.title}</SectionTitle>
            <ol className="mt-8 list-none space-y-0 p-0">
              {beverageSystem.steps.map((step, index) => (
                <li key={step}>
                  {index > 0 ? <span className="mx-4 block h-6 w-px bg-[#6B1F2A]" aria-hidden="true" /> : null}
                  <Reveal>
                    <p className="border border-[#1A1916]/15 px-4 py-3 text-[15px] leading-7">{step}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
          <Reveal>
            <div className="grid gap-px bg-[#1A1916]/15">
              <div className="bg-[#F5F3EE] px-5 py-5">
                <Kicker>AI 负责</Kicker>
                <ul className="mt-4 list-none space-y-2 p-0 text-[15px] leading-7">
                  {beverageSystem.ai.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#F5F3EE] px-5 py-5">
                <Kicker>人工负责</Kicker>
                <ul className="mt-4 list-none space-y-2 p-0 text-[15px] leading-7">
                  {beverageSystem.human.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-5 text-[13px] leading-7 text-[#1A1916]/70">{beverageSystem.boundary}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <SectionTitle>{beverageEvolution.title}</SectionTitle>
          <Reveal className="mt-8">
            <p className="text-[12px] tracking-[0.18em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
              初始候选方向
            </p>
            <ol className="mt-3 grid list-none gap-2 p-0 sm:grid-cols-5">
              {beverageEvolution.candidates.map((name, index) => (
                <li key={name} className="border border-[#1A1916]/15 px-3 py-3 text-[14px] leading-6">
                  <span className="block text-[12px] text-[#6B1F2A]" style={{ fontFamily: mono }}>
                    0{index + 1}
                  </span>
                  {name}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="mt-6">
            <p className="flex flex-wrap gap-x-3 gap-y-2 text-[13px] tracking-[0.08em]" style={{ fontFamily: mono }}>
              {beverageEvolution.checks.map((check, index) => (
                <span key={check}>
                  {index > 0 ? <span className="mr-3 text-[#6B1F2A]">→</span> : null}
                  {check}
                </span>
              ))}
            </p>
          </Reveal>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {beverageEvolution.kept.map((item) => (
              <Reveal key={item.name}>
                <article className="h-full border border-[#6B1F2A]/40 px-4 py-4">
                  <h3 className="m-0 text-[22px] leading-snug font-medium" style={{ fontFamily: song }}>
                    {item.name}
                  </h3>
                  <p className="mt-3 text-[15px] leading-7">{item.question}</p>
                  <p className="mt-2 text-[13px] tracking-[0.12em] text-[#6B1F2A]" style={{ fontFamily: mono }}>
                    {item.role}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 border-t border-[#1A1916]/15 pt-6">
            <p className="text-[12px] tracking-[0.18em] text-[#1A1916]/55" style={{ fontFamily: mono }}>
              最终品牌母题
            </p>
            <p className="mt-2 text-[28px] leading-snug" style={{ fontFamily: song }}>
              {beverageEvolution.theme}
            </p>
            <p className="mt-4 text-[18px] leading-8" style={{ fontFamily: song }}>
              {beverageEvolution.expression}
            </p>
            <p className="mt-4 max-w-[42rem] text-[14px] leading-7 text-[#1A1916]/70">{beverageEvolution.note}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <SectionTitle>{beveragePath.title}</SectionTitle>
          <div className="mt-10 grid items-end gap-3 md:grid-cols-3">
            {beveragePath.stages.map((stage, index) => (
              <Reveal key={stage.phase} delay={index * 100}>
                <article className="border border-[#1A1916]/15 px-4 py-5" style={{ minHeight: `${148 + index * 36}px` }}>
                  <p className="text-[12px] tracking-[0.16em] text-[#6B1F2A]" style={{ fontFamily: mono }}>
                    {stage.phase}
                  </p>
                  <h3 className="mt-3 text-[clamp(20px,2vw,28px)] leading-snug font-medium" style={{ fontFamily: song }}>
                    {stage.name}
                  </h3>
                  <p className="mt-3 flex items-center gap-2 text-[13px]">
                    <i className="inline-block size-1.5 bg-[#7E8C74]" aria-hidden="true" />
                    {stage.role}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <p className="text-[14px] leading-7">每一个场景持续回答同样三个问题：</p>
            <ol className="mt-3 list-none space-y-2 p-0">
              {beveragePath.questions.map((question, index) => (
                <li key={question} className="text-[16px] leading-8" style={{ fontFamily: song }}>
                  <span className="mr-3 text-[12px] text-[#6B1F2A]" style={{ fontFamily: mono }}>
                    0{index + 1}
                  </span>
                  {question}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[14px] leading-7 text-[#1A1916]/70">{beveragePath.aside}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1A1916]/15">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <SectionTitle>{beverageBoundary.title}</SectionTitle>
          <div className="mt-8 grid gap-px bg-[#1A1916]/15 md:grid-cols-2">
            <div className="bg-[#F5F3EE] px-5 py-6">
              <h3 className="m-0 text-[18px] font-medium" style={{ fontFamily: song }}>
                {beverageBoundary.knownTitle}
              </h3>
              <ul className="mt-4 list-none space-y-3 p-0">
                {beverageBoundary.known.map((item) => (
                  <li key={item.text} className="text-[15px] leading-7">
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#F5F3EE] px-5 py-6">
              <h3 className="m-0 flex items-center gap-2 text-[18px] font-medium" style={{ fontFamily: song }}>
                {beverageBoundary.nextTitle}
                <span className="border border-[#1A1916]/25 px-1.5 py-0.5 text-[10px] tracking-[0.14em]" style={{ fontFamily: mono }}>
                  pending
                </span>
              </h3>
              <ul className="mt-4 list-none space-y-3 p-0">
                {beverageBoundary.next.map((item) => (
                  <li key={item} className="text-[15px] leading-7">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Reveal className="mt-8 border border-[#1A1916]/15 px-5 py-5">
            <p className="text-[12px] tracking-[0.16em] text-[#6B1F2A]" style={{ fontFamily: mono }}>
              {beverageScenario.label}
            </p>
            <p className="mt-3 text-[13px] tracking-[0.14em]" style={{ fontFamily: mono }}>
              {beverageScenario.title}
            </p>
            <p className="mt-2 text-[15px] leading-7">
              {beverageScenario.costName}：{beverageScenario.cost}
            </p>
            <p className="mt-1 text-[13px] leading-7 text-[#1A1916]/70">{beverageScenario.basis}</p>
            <p className="mt-2 text-[13px] leading-7 text-[#1A1916]/70">{beverageScenario.condition}</p>
          </Reveal>

          <Reveal className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="m-0 text-[18px] font-medium" style={{ fontFamily: song }}>
                {beveragePilot.title}
              </h3>
              <span className="border border-[#6B1F2A] px-1.5 py-0.5 text-[10px] tracking-[0.14em] text-[#6B1F2A]" style={{ fontFamily: mono }}>
                {beveragePilot.tag}
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {beveragePilot.rows.map((row) => (
                <div key={row.name} className="border border-[#1A1916]/15 px-4 py-4">
                  <p className="flex flex-wrap items-center gap-2 text-[15px]">
                    {row.name}
                    <span className="border border-[#1A1916]/25 px-1.5 py-0.5 text-[10px] tracking-[0.14em]" style={{ fontFamily: mono }}>
                      {row.tag}
                    </span>
                  </p>
                  <p className="mt-2 text-[14px] leading-7" style={{ fontFamily: mono }}>
                    {row.from} → {row.mid} → {row.end}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-12 border-t border-[#6B1F2A] pt-6 pb-6">
            <p className="max-w-[40rem] text-[20px] leading-9" style={{ fontFamily: song }}>
              {beverageClose}
            </p>
          </Reveal>
        </div>
      </section>
    </article>
  )
}
