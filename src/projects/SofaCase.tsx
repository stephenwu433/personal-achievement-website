import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import TikTokEvidenceFolder from './TikTokEvidenceFolder'
import { sofaDecisions, sofaEvidence, sofaHero, sofaScripts, sofaSignals, sofaSystem, sofaWork } from './sofaCase.data'
import { readDocxText } from './readDocx'

const ink = '#1C1C1A'
const paper = '#F5F3EE'
const muted = '#77746E'
const line = 'rgba(28, 28, 26, 0.22)'

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
    <div ref={ref} className={`sofa-reveal ${shown ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
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
    const commas = match[2].includes(',')
    const format = (current: number) => {
      const digits = commas ? Math.round(current).toLocaleString('en-US') : String(Math.round(current))
      return `${prefix}${digits}${suffix}`
    }
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
      <button
        type="button"
        onClick={openScript}
        className="sofa-file block w-full border px-5 py-5 text-left"
        style={{ borderColor: line }}
      >
        <p className="text-[11px] tracking-[0.18em]" style={{ color: muted }}>
          {file.kind}
        </p>
        <p className="mt-3 text-[18px]" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif' }}>
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

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  const lines = title.split('\n')
  return (
    <div>
      <p className="text-[11px] tracking-[0.22em]" style={{ color: muted }}>
        {kicker}
      </p>
      <h2 className="mt-4 max-w-[18em] text-[clamp(18px,3.6vw,46px)] leading-[1.22] font-medium" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif', color: ink }}>
        {lines.map((lineText) => (
          <span key={lineText} className="block">
            {lineText}
          </span>
        ))}
      </h2>
    </div>
  )
}

export default function SofaCase({ embedded = false }: { embedded?: boolean }) {
  return (
    <article className={embedded ? 'mt-16 border-t pt-16' : 'min-h-screen px-5 py-16 md:px-10'} style={{ background: paper, color: ink, borderColor: line }}>
      <div className={embedded ? '' : 'mx-auto max-w-6xl'}>
        <Reveal>
          <header className="grid items-end gap-10 border-b pb-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]" style={{ borderColor: line }}>
            <div>
              <p className="text-[11px] tracking-[0.22em]" style={{ color: muted }}>
                {sofaHero.index} / {sofaHero.kicker}
              </p>
              <h1 className="mt-5 text-[clamp(40px,6vw,72px)] leading-[1.05] font-medium" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif' }}>
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
            </div>
            <div className="border px-6 py-8" style={{ borderColor: line }}>
              <p className="text-[12px] tracking-[0.2em]" style={{ color: muted }}>
                {sofaHero.panel[0]}
              </p>
              <p className="mt-6 text-[clamp(22px,3vw,34px)] leading-snug" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif' }}>
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
          </header>
        </Reveal>

        <section className="mt-16">
          <SectionTitle kicker={sofaSignals.kicker} title={sofaSignals.title} />
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {sofaSignals.stats.map((item, index) => (
              <div
                key={item.label}
                className={`sofa-stat border px-4 py-6 ${index === sofaSignals.stats.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`}
                style={{ borderColor: line, background: paper }}
              >
                <CountFigure value={item.value} className="text-[clamp(36px,4vw,56px)] leading-none tabular-nums" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif', color: ink }} />
                <p className="mt-3 text-[13px]" style={{ color: muted }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] leading-6" style={{ color: muted }}>
            {sofaSignals.note}
          </p>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={sofaDecisions.kicker} title={sofaDecisions.title} />
          <ol className="mt-8 border-t" style={{ borderColor: line }}>
            {sofaDecisions.items.map((item) => (
              <li key={item.index} className="grid gap-2 border-b py-5 md:grid-cols-[7rem_10rem_minmax(0,1fr)] md:items-baseline" style={{ borderColor: line }}>
                <span className="text-[12px] tabular-nums tracking-[0.16em]" style={{ color: muted }}>
                  {item.index}
                </span>
                <span className="text-[16px]">{item.title}</span>
                <span className="text-[15px] leading-7" style={{ color: 'rgba(28,28,26,0.78)' }}>
                  {item.body}
                </span>
              </li>
            ))}
          </ol>
          <Reveal>
            <p className="mt-6 max-w-3xl text-[clamp(18px,2vw,24px)] leading-8" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif' }}>
              {sofaDecisions.close}
            </p>
          </Reveal>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={sofaSystem.kicker} title={sofaSystem.title} />
          <ol className="mt-8 grid gap-px lg:grid-cols-5" style={{ background: line }}>
            {sofaSystem.flow.map((step, index) => (
              <li key={step} className="px-4 py-5" style={{ background: paper }}>
                <p className="text-[11px] tabular-nums tracking-[0.16em]" style={{ color: muted }}>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="mt-4 text-[15px] leading-6">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-px lg:grid-cols-3" style={{ background: line }}>
            {sofaSystem.tracks.map((track) => (
              <Reveal key={track.index}>
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
          <div className="mt-8">
            <TikTokEvidenceFolder />
          </div>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={sofaScripts.kicker} title={sofaScripts.title} />
          <Reveal>
            <p className="mt-6 max-w-3xl text-[15px] leading-7" style={{ color: 'rgba(28,28,26,0.78)' }}>
              {sofaScripts.body}
            </p>
          </Reveal>
          <ScriptReader />
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: line }}>
          <SectionTitle kicker={sofaWork.kicker} title={sofaWork.title} />
          <ol className="mt-8 grid gap-px sm:grid-cols-2" style={{ background: line }}>
            {sofaWork.items.map((item) => (
              <li key={item.index} className="px-5 py-5" style={{ background: paper }}>
                <p className="text-[12px] tabular-nums tracking-[0.16em]" style={{ color: muted }}>
                  {item.index}
                </p>
                <p className="mt-3 text-[16px]">{item.title}</p>
                <p className="mt-3 text-[15px] leading-7" style={{ color: 'rgba(28,28,26,0.78)' }}>
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[12px] leading-6" style={{ color: muted }}>
            {sofaWork.close}
          </p>
        </section>
      </div>
    </article>
  )
}
