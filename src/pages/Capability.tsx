import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import SiteHeader from '@/src/components/SiteHeader'
import {
  capabilities,
  capabilityById,
  rememberCapabilityReturn,
  splitFigure,
  takeCapabilityReturn,
  type Capability as CapabilityItem,
  type CapabilityProject,
} from '@/src/pages/capability.data'
import { openCapability } from '@/src/pages/openCapability'
import SkillsIntro from '@/src/pages/SkillsIntro'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const serif = '"Noto Serif SC", "Songti SC", serif'

let pendingRestore: { id: string; scroll: number } | null = null

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [query])
  return matches
}

function stageScroll(section: HTMLElement, index: number, total: number) {
  const span = section.offsetHeight - window.innerHeight
  return section.offsetTop + (span * (index + 0.45)) / total
}

function HeroMedia({ item }: { item: CapabilityItem }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoOn, setVideoOn] = useState(false)
  const frames = useMedia('(max-width: 767px)') ? item.mobileFrameSources : item.desktopFrameSources
  const framesReady = frames.length > 0 && item.scrollFrameEnd > item.scrollFrameStart

  useEffect(() => {
    const video = videoRef.current
    if (!video || !item.videoSrc) return
    const hold = () => {
      if (document.hidden) video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || document.hidden) video.pause()
      else void video.play().catch(() => setVideoOn(false))
    })
    observer.observe(video)
    document.addEventListener('visibilitychange', hold)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', hold)
    }
  }, [item.videoSrc])

  return (
    <div className="cap-hero absolute inset-0">
      <img src={item.image} alt="" className="cap-photo absolute inset-0 size-full object-cover" style={{ objectPosition: item.focus }} />
      <span className="sr-only">{framesReady ? '逐帧序列已接入' : '逐帧序列未启用'}</span>
      {item.videoSrc ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 size-full object-cover ${videoOn ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectPosition: item.focus }}
          src={item.videoSrc}
          poster={item.posterSrc || item.image}
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoOn(true)}
          onError={() => setVideoOn(false)}
        />
      ) : null}
    </div>
  )
}

function ProjectSwitch({
  item,
  index,
  selected,
  phase,
  onPick,
  hideTabs = false,
}: {
  item: CapabilityItem
  index: number
  selected: number
  phase: 'in' | 'out'
  onPick: (index: number) => void
  hideTabs?: boolean
}) {
  const [metricOpen, setMetricOpen] = useState(false)
  const project = item.projects[index]
  if (!project) return <p className="mt-4 text-sm">项目证据待填。</p>
  const figure = splitFigure(project.figure)
  return (
    <div key={`${project.name}-${project.figure}`} className={`cap-project is-${phase} mt-4`} aria-live="polite">
      <p className="text-[13px] tracking-[0.08em]">{project.name}</p>
      <p className="mt-2 text-[14px] leading-6">{project.text}</p>
      <button
        type="button"
        className={`cap-figure mt-3 block text-left ${metricOpen ? 'is-open' : ''}`}
        aria-expanded={metricOpen}
        aria-describedby={figure.unit ? `cap-metric-${index}` : undefined}
        onClick={() => setMetricOpen((open) => !open)}
      >
        <span className="text-[32px] leading-none" style={{ fontFamily: serif }}>
          {figure.value}
        </span>
        {figure.unit ? <span className="ml-2 text-[12px] tracking-[0.08em]">{figure.unit}</span> : null}
        {figure.unit ? (
          <span id={`cap-metric-${index}`} className="cap-metric mt-1 block text-[12px] tracking-[0.12em]">
            {figure.unit}
          </span>
        ) : null}
      </button>
      {project.pieceId ? <ViewProject item={item} project={project} index={index} /> : null}
      {hideTabs ? null : (
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="项目">
          {item.projects.map((entry, entryIndex) => (
            <button
              key={`${entry.name}-${entry.figure}`}
              type="button"
              role="tab"
              aria-selected={entryIndex === selected}
              onClick={() => onPick(entryIndex)}
              className="rounded-full border px-3 py-1 text-[12px]"
              style={{
                borderColor: `${item.paper}99`,
                background: entryIndex === selected ? item.paper : 'transparent',
                color: entryIndex === selected ? item.ink : item.text,
              }}
            >
              {entry.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ViewProject({ item, project, index }: { item: CapabilityItem; project: CapabilityProject; index: number }) {
  const navigate = useNavigate()
  if (!project.pieceId) return null
  return (
    <button
      type="button"
      className="cap-view mt-4"
      style={{ '--cap-paper': item.paper, '--cap-ink': item.ink, color: item.text } as CSSProperties}
      onClick={() => {
        rememberCapabilityReturn(item.id, index, window.scrollY)
        openCapability(navigate, `/projects?work=${project.pieceId}`)
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.background = item.paper
        event.currentTarget.style.color = item.ink
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background = 'transparent'
        event.currentTarget.style.color = item.text
      }}
      onFocus={(event) => {
        event.currentTarget.style.background = item.paper
        event.currentTarget.style.color = item.ink
      }}
      onBlur={(event) => {
        event.currentTarget.style.background = 'transparent'
        event.currentTarget.style.color = item.text
      }}
    >
      <span className="cap-view-ring" style={{ borderColor: item.paper }} />
      <span className="cap-view-label">查看项目</span>
    </button>
  )
}

export default function Capability() {
  const { id } = useParams()
  const item = capabilityById(id)
  const navigate = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const pinRef = useRef<HTMLElement>(null)
  const seeking = useRef<number | null>(null)
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const narrow = useMedia('(max-width: 767px)')
  const fine = useMedia('(hover: hover) and (pointer: fine)')
  const count = Math.max(item?.projects.length ?? 1, 1)
  const initial = Math.min(count - 1, Math.max(0, Number(params.get('item') ?? '0') || 0))
  const [index, setIndex] = useState(initial)
  const [shown, setShown] = useState(initial)
  const [phase, setPhase] = useState<'in' | 'out'>('in')
  const indexRef = useRef(index)
  indexRef.current = index
  const restoreState = useRef(location.state)
  restoreState.current = location.state
  const stacked = narrow || reduced

  useEffect(() => {
    const header = document.querySelector('.site-chrome')
    if (!header) return
    const apply = () => {
      document.documentElement.style.setProperty('--cap-header', `${header.getBoundingClientRect().height}px`)
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!item) return
    const fromState = (restoreState.current as { restoreScroll?: number } | null)?.restoreScroll
    let top = typeof fromState === 'number' ? fromState : undefined
    if (pendingRestore?.id === item.id) top = pendingRestore.scroll
    else {
      const saved = takeCapabilityReturn(item.id)
      if (saved && typeof top !== 'number') top = saved.scroll
      if (typeof top === 'number') pendingRestore = { id: item.id, scroll: top }
    }
    const reducedNow = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (typeof top !== 'number') {
      const itemIndex = Math.min(item.projects.length - 1, Math.max(0, Number(new URLSearchParams(window.location.search).get('item') ?? '0') || 0))
      const section = pinRef.current
      if (itemIndex > 0 && section && !reducedNow && item.projects.length > 1) {
        top = stageScroll(section, itemIndex, item.projects.length)
      }
    }
    window.scrollTo(0, typeof top === 'number' ? top : 0)
    const timer = window.setTimeout(() => {
      if (pendingRestore?.id === item.id) pendingRestore = null
    }, 600)
    return () => window.clearTimeout(timer)
  }, [item])

  useEffect(() => {
    if (reduced) {
      setShown(index)
      setPhase('in')
      return
    }
    if (index === shown) return
    setPhase('out')
    const timer = window.setTimeout(() => {
      setShown(index)
      setPhase('in')
    }, 260)
    return () => window.clearTimeout(timer)
  }, [index, reduced, shown])

  const writeItem = (next: number) => {
    if (new URLSearchParams(window.location.search).get('item') === String(next)) return
    setParams({ item: String(next) }, { replace: true, preventScrollReset: true })
  }
  const writeItemRef = useRef(writeItem)
  writeItemRef.current = writeItem

  const pick = (next: number) => {
    if (!item) return
    const clamped = Math.min(item.projects.length - 1, Math.max(0, next))
    seeking.current = clamped
    setIndex(clamped)
    writeItem(clamped)
    const section = pinRef.current
    if (!section || reduced || item.projects.length < 2) return
    window.scrollTo({ top: stageScroll(section, clamped, item.projects.length), behavior: 'smooth' })
  }

  useGSAP(
    () => {
      if (!item || reduced || item.projects.length < 2) return
      const total = item.projects.length
      const trigger = ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate(self) {
          pinRef.current?.style.setProperty('--cap-p', self.progress.toFixed(4))
          const next = Math.min(total - 1, Math.floor(self.progress * total))
          if (seeking.current !== null) {
            if (next === seeking.current) seeking.current = null
            return
          }
          if (next !== indexRef.current) {
            indexRef.current = next
            setIndex(next)
            writeItemRef.current(next)
          }
        },
      })
      return () => trigger.kill()
    },
    { dependencies: [item?.id, reduced, item?.projects.length], scope: pinRef },
  )

  if (!item) return <Navigate to="/skills" replace />

  const others = capabilities.filter((entry) => entry.id !== item.id)
  const pinned = !reduced && item.projects.length > 1

  return (
    <div className="cap-page bg-background text-foreground">
      <SkillsIntro src={item.image} />
      <SiteHeader />
      <main>
        <section
          ref={pinRef}
          style={{ height: pinned ? `${(item.projects.length + 1) * 100}vh` : 'auto', background: item.ink }}
        >
          <div
            className={
              pinned
                ? `sticky top-[var(--cap-header,6.75rem)] h-[calc(100dvh-var(--cap-header,6.75rem))] overflow-hidden ${stacked ? 'flex flex-col' : ''}`
                : stacked
                  ? 'relative'
                  : 'relative min-h-[calc(100dvh-var(--cap-header,6.75rem))]'
            }
          >
            <div className={stacked ? `relative w-full shrink-0 overflow-hidden ${pinned ? 'h-[min(32vh,220px)]' : 'h-[min(48vh,420px)]'}` : 'absolute inset-0'}>
              {reduced ? (
                <img src={item.image} alt="" className="size-full object-cover" style={{ objectPosition: item.focus }} />
              ) : (
                <HeroMedia item={item} />
              )}
            </div>
            <div
              className={`${stacked ? 'relative z-10 min-h-0 flex-1 overflow-y-auto p-4' : `absolute z-10 max-h-[calc(100%-1.5rem)] overflow-y-auto p-4 sm:p-5 ${item.place}`}`}
              style={{ background: item.ink, color: item.text }}
            >
              <h1 className="overflow-hidden text-[clamp(32px,4vw,48px)] leading-none font-medium" style={{ fontFamily: serif }}>
                {item.label.split('').map((char, charIndex) => (
                  <span key={`${char}-${charIndex}`} className="cap-char" style={{ animationDelay: `${charIndex * 45}ms` }}>
                    {char === ' ' ? '\u00a0' : char}
                  </span>
                ))}
              </h1>
              {item.intro ? <p className="mt-3 text-[14px] leading-6">{item.intro}</p> : null}
              {reduced ? (
                <div className="mt-2 flex flex-col gap-2">
                  {item.projects.map((project, projectIndex) => (
                    <ProjectSwitch
                      key={`${project.name}-${project.figure}`}
                      item={item}
                      index={projectIndex}
                      selected={projectIndex}
                      phase="in"
                      onPick={pick}
                      hideTabs
                    />
                  ))}
                </div>
              ) : (
                <ProjectSwitch item={item} index={shown} selected={index} phase={phase} onPick={pick} />
              )}
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((entry) => (
            <Link
              key={entry.id}
              to={`/skills/${entry.id}`}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
                event.preventDefault()
                openCapability(navigate, `/skills/${entry.id}`)
              }}
              className="cap-related relative block min-h-[42vh] overflow-hidden"
              style={{ background: entry.ink }}
              onPointerMove={(event) => {
                if (!fine || reduced) return
                const rect = event.currentTarget.getBoundingClientRect()
                const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16
                const y = ((event.clientY - rect.top) / rect.height - 0.5) * 16
                event.currentTarget.style.setProperty('--mx', `${x}px`)
                event.currentTarget.style.setProperty('--my', `${y}px`)
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.setProperty('--mx', '0px')
                event.currentTarget.style.setProperty('--my', '0px')
              }}
            >
              <img src={entry.image} alt="" className="cap-related-photo absolute inset-0 size-full object-cover" style={{ objectPosition: entry.focus }} />
              <span className="cap-related-wash pointer-events-none absolute inset-0" style={{ background: entry.paper }} />
              <span className="absolute inset-x-0 bottom-0 h-28" style={{ background: `linear-gradient(transparent, ${entry.ink})` }} />
              <span className="absolute bottom-5 left-5 text-[clamp(26px,3vw,40px)] leading-none" style={{ color: entry.text, fontFamily: serif }}>
                {entry.label}
              </span>
            </Link>
          ))}
        </section>
        <p className="px-5 py-8" style={{ background: item.ink }}>
          <Link
            to="/skills"
            className="text-sm underline underline-offset-4"
            style={{ color: item.text }}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
              event.preventDefault()
              openCapability(navigate, '/skills')
            }}
          >
            返回能力总览
          </Link>
        </p>
      </main>
    </div>
  )
}
