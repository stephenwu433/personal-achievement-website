import { useEffect, useRef, useState, type CSSProperties } from 'react'
import SiteHeader from '@/src/components/SiteHeader'
import { capabilities, personRegion, type Capability, type CollageRegion } from '@/src/pages/skillsCollage.data'

const board = '/projects/project-board.jpg'

function cropStyle(region: CollageRegion): CSSProperties {
  return {
    width: `${(100 / region.w) * 100}%`,
    height: `${(100 / region.h) * 100}%`,
    left: `${(-region.x / region.w) * 100}%`,
    top: `${(-region.y / region.h) * 100}%`,
  }
}

function Crop({ region, className = '' }: { region: CollageRegion; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={board} alt="" className="pointer-events-none absolute max-w-none select-none" style={cropStyle(region)} />
    </div>
  )
}

export default function Skills() {
  const [reduced, setReduced] = useState(false)
  const [hot, setHot] = useState<string | null>(null)
  const [open, setOpen] = useState<Capability | null>(null)
  const [from, setFrom] = useState<DOMRect | null>(null)
  const [entered, setEntered] = useState(false)
  const closeTimer = useRef(0)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open || !from || reduced) return
    const frame = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(frame)
  }, [open, from, reduced])

  function visibleCell(id: string) {
    const nodes = document.querySelectorAll(`[data-skill-cell="${id}"]`)
    for (const node of nodes) {
      if (node instanceof HTMLElement && node.getClientRects().length > 0) return node
    }
    return null
  }

  function openCapability(item: Capability) {
    window.clearTimeout(closeTimer.current)
    const node = visibleCell(item.id)
    const rect = node?.getBoundingClientRect()
    if (!rect || reduced) {
      setFrom(null)
      setOpen(item)
      setEntered(true)
      return
    }
    setFrom(rect)
    setEntered(false)
    setOpen(item)
  }

  function closePanel() {
    if (!open) return
    if (reduced || !from) {
      setOpen(null)
      setEntered(false)
      setFrom(null)
      return
    }
    setEntered(false)
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setOpen(null)
      setFrom(null)
    }, 520)
  }

  const dim = hot !== null && !open

  return (
    <div className="min-h-dvh bg-[#e4b27a] text-[#3a2a1a]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pt-2 pb-10 sm:px-6">
        <div className="skill-stage mx-auto hidden w-full md:block" style={{ perspective: '1600px' }}>
          <div className={`skill-board relative mx-auto aspect-[1672/941] w-full max-w-[1080px] ${dim ? 'is-dim' : ''}`}>
            <div
              className="skill-person absolute overflow-hidden"
              style={{ left: '0%', top: '35.5%', width: '66.5%', height: '64.5%' }}
            >
              <img src={board} alt="Stephen 在夕阳拼贴前递出一张照片卡" className="pointer-events-none absolute max-w-none" style={cropStyle(personRegion)} />
            </div>
            {capabilities.map((item) => (
              <button
                key={item.id}
                type="button"
                data-skill-cell={item.id}
                aria-label={item.label}
                aria-expanded={open?.id === item.id}
                className={`skill-cell absolute overflow-hidden ${hot === item.id ? 'is-hot' : ''}`}
                style={{ left: `${item.region.x}%`, top: `${item.region.y}%`, width: `${item.region.w}%`, height: `${item.region.h}%` }}
                onMouseEnter={() => setHot(item.id)}
                onMouseLeave={() => setHot((current) => (current === item.id ? null : current))}
                onFocus={() => setHot(item.id)}
                onBlur={() => setHot((current) => (current === item.id ? null : current))}
                onClick={() => openCapability(item)}
              >
                <img src={board} alt="" className="pointer-events-none absolute max-w-none" style={cropStyle(item.region)} />
              </button>
            ))}
            {capabilities.map((item) => (
              <button
                key={`${item.id}-pill`}
                type="button"
                className={`skill-capsule absolute z-10 ${hot === item.id ? 'is-hot' : ''}`}
                style={item.place}
                aria-expanded={open?.id === item.id}
                onMouseEnter={() => setHot(item.id)}
                onMouseLeave={() => setHot((current) => (current === item.id ? null : current))}
                onFocus={() => setHot(item.id)}
                onBlur={() => setHot((current) => (current === item.id ? null : current))}
                onClick={() => openCapability(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-col gap-3 md:hidden">
          <Crop region={personRegion} className="aspect-[4/5] w-full shadow-[0_16px_40px_rgba(80,40,10,0.22)]" />
          {capabilities.map((item) => (
            <button
              key={item.id}
              type="button"
              data-skill-cell={item.id}
              className="block w-full text-left"
              onClick={() => openCapability(item)}
            >
              <Crop region={item.region} className="aspect-[16/9] w-full" />
            </button>
          ))}
          <div className="mt-1 flex flex-col gap-2">
            {capabilities.map((item) => (
              <button key={`${item.id}-mobile`} type="button" className="skill-capsule w-full" onClick={() => openCapability(item)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </main>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-open-title"
          className="fixed z-50 overflow-hidden bg-[#f7f1e6] shadow-[0_24px_70px_rgba(60,30,8,0.35)]"
          style={{
            left: entered || !from ? 12 : from.left,
            top: entered || !from ? 12 : from.top,
            width: entered || !from ? 'calc(100vw - 24px)' : from.width,
            height: entered || !from ? 'calc(100dvh - 24px)' : from.height,
            borderRadius: entered || !from ? 18 : 2,
            transition: reduced ? 'none' : 'left 0.52s cubic-bezier(0.16, 1, 0.3, 1), top 0.52s cubic-bezier(0.16, 1, 0.3, 1), width 0.52s cubic-bezier(0.16, 1, 0.3, 1), height 0.52s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.52s ease',
          }}
        >
          <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: entered ? '32%' : '100%', transition: reduced ? 'none' : 'height 0.52s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <Crop region={open.region} className="size-full" />
          </div>
          <button type="button" onClick={closePanel} className="skill-capsule absolute top-4 right-4 z-10">
            返回能力总览
          </button>
          <article
            className="absolute inset-x-0 bottom-0 overflow-y-auto px-5 pt-5 pb-8 sm:px-10"
            style={{
              top: entered ? '32%' : '100%',
              opacity: entered ? 1 : 0,
              transition: reduced ? 'none' : 'opacity 0.35s ease 0.18s',
            }}
          >
            <p className="text-[12px] tracking-[0.22em] text-[#9a6230]">{open.frame}</p>
            <h1 id="skill-open-title" className="mt-2 text-[clamp(28px,4vw,44px)] leading-tight font-medium" style={{ fontFamily: '"Noto Serif SC", "Songti SC", serif' }}>
              {open.label}
            </h1>
            <p className="mt-3 max-w-2xl text-[16px] leading-8">{open.lead}</p>
            <ul className="mt-6 grid max-w-3xl list-none gap-3 p-0">
              {open.evidence.map((item) => (
                <li key={item.project} className="border-l-2 border-[#d7a15a] bg-white/55 px-4 py-3">
                  <p className="text-[13px] tracking-[0.14em] text-[#9a6230]">{item.project}</p>
                  <p className="mt-1 text-[15px] leading-7">{item.text}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      ) : null}
    </div>
  )
}
