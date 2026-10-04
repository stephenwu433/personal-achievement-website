import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import InternshipDisc from '@/src/components/InternshipDisc'
import { internships, profile } from '@/src/content'

const pageBg = '#e6e3dc'
const ink = '#1a1a1a'
const serif = { fontFamily: '"Noto Serif SC", "Noto Sans SC", serif' }

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function useNarrowScreen() {
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const onChange = () => setNarrow(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return narrow
}

function useStageSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 1, h: 1 })
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () => setSize({ w: element.clientWidth, h: element.clientHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return size
}

function stageLayout(w: number, h: number, narrow: boolean) {
  const disc = clamp(Math.min(w * (narrow ? 0.72 : 0.36), h * (narrow ? 0.42 : 0.54)), 200, 520)
  const gap = disc * (narrow ? 0.78 : 0.98)
  const anchorX = w * (narrow ? 0.5 : 0.5)
  const anchorY = narrow ? h * 0.58 : h * 0.5
  const scaleStep = narrow ? 0.16 : 0.48
  return { disc, gap, anchorX, anchorY, scaleStep }
}

function wobble(radius: number, seed: number) {
  const points = 56
  let path = ''
  for (let i = 0; i <= points; i += 1) {
    const turn = (i / points) * Math.PI * 2
    const wave =
      Math.sin(turn * 2 + seed) * 1.7 +
      Math.sin(turn * 5 + seed * 1.6) * 0.9 +
      Math.sin(turn * 9 + seed * 0.4) * 0.45
    const x = 50 + Math.cos(turn) * (radius + wave)
    const y = 46 + Math.sin(turn) * (radius * 0.9 + wave * 0.85)
    path += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)} `
  }
  return `${path}Z`
}

const ringPaths = [wobble(40, 0.4), wobble(36.2, 1.3)]

export default function Internships() {
  const narrow = useNarrowScreen()
  const stageRef = useRef<HTMLDivElement>(null)
  const { w, h } = useStageSize(stageRef)
  const { disc, gap, anchorX, anchorY, scaleStep } = stageLayout(w, h, narrow)
  const count = internships.length
  const progressRef = useRef(0)
  const velocityRef = useRef(0)
  const targetRef = useRef<number | null>(null)
  const draggingRef = useRef(false)
  const reducedRef = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const detailRef = useRef<number | null>(null)
  const goToRef = useRef<(index: number) => void>(() => {})
  const showDetailRef = useRef<(index: number) => void>(() => {})
  const dragOrigin = useRef({ x: 0, y: 0, progress: 0, pointer: 0, moved: 0, last: 0, time: 0, hit: null as number | null })
  const loopRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [detail, setDetail] = useState<number | null>(null)
  const [indexOpen, setIndexOpen] = useState(false)
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const previousTitle = document.title
    const previousBg = document.body.style.backgroundColor
    document.title = `实习目录 — ${profile.name}`
    document.body.style.backgroundColor = pageBg
    return () => {
      document.title = previousTitle
      document.body.style.backgroundColor = previousBg
    }
  }, [])

  const kick = () => {
    if (loopRef.current) return
    let last = performance.now()
    const tick = (now: number) => {
      const dt = clamp((now - last) / 16.67, 0.4, 2)
      last = now
      const max = count - 1
      let next = progressRef.current
      let velocity = velocityRef.current
      if (!draggingRef.current && !reducedRef.current) {
        const target = targetRef.current
        if (target !== null) {
          const delta = target - next
          if (Math.abs(delta) < 0.0015) {
            next = target
            velocity = 0
            targetRef.current = null
          } else {
            next += delta * (1 - Math.pow(0.8, dt))
            velocity = 0
          }
        } else if (
          Math.abs(velocity) > 0.0008 ||
          next < -0.001 ||
          next > max + 0.001 ||
          Math.abs(next - Math.round(next)) > 0.0015
        ) {
          next += velocity * dt
          velocity *= Math.pow(0.86, dt)
          if (next < 0 || next > max) {
            const edge = next < 0 ? 0 : max
            next += (edge - next) * (1 - Math.pow(0.72, dt))
            velocity *= 0.6
          }
          if (Math.abs(velocity) < 0.01) {
            const snap = clamp(Math.round(next), 0, max)
            const delta = snap - next
            if (Math.abs(delta) < 0.0015) {
              next = snap
              velocity = 0
            } else {
              next += delta * (1 - Math.pow(0.75, dt))
            }
          }
        }
        velocityRef.current = velocity
        if (Math.abs(next - progressRef.current) > 0.0004) {
          progressRef.current = next
          setProgress(next)
        } else {
          progressRef.current = next
        }
      }
      const busy =
        draggingRef.current ||
        targetRef.current !== null ||
        Math.abs(velocityRef.current) > 0.0008 ||
        next < -0.001 ||
        next > max + 0.001 ||
        Math.abs(next - Math.round(next)) > 0.0015
      loopRef.current = busy ? requestAnimationFrame(tick) : 0
    }
    loopRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(loopRef.current)
      loopRef.current = 0
    }
  }, [])

  const goTo = (index: number) => {
    const next = clamp(index, 0, count - 1)
    velocityRef.current = 0
    if (reduced) {
      targetRef.current = null
      progressRef.current = next
      setProgress(next)
      return
    }
    targetRef.current = next
    kick()
  }

  const showDetail = (index: number) => {
    const next = clamp(index, 0, count - 1)
    progressRef.current = next
    targetRef.current = null
    velocityRef.current = 0
    setProgress(next)
    setDetail(next)
    setIndexOpen(false)
  }

  useEffect(() => {
    detailRef.current = detail
    goToRef.current = goTo
    reducedRef.current = reduced
    showDetailRef.current = showDetail
  })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let pending = 0
    let lockedUntil = 0
    const onWheel = (event: WheelEvent) => {
      if (detailRef.current !== null) return
      event.preventDefault()
      const now = performance.now()
      if (now < lockedUntil) return
      const dominant = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      pending += dominant
      if (Math.abs(pending) < 48) return
      const direction = pending > 0 ? 1 : -1
      pending = 0
      lockedUntil = now + 340
      const current = targetRef.current ?? Math.round(progressRef.current)
      goToRef.current(current + direction)
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIndexOpen(false)
        setDetail(null)
        return
      }
      if (indexOpen) return
      const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
      const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
      if (!forward && !backward) return
      event.preventDefault()
      const step = forward ? 1 : -1
      if (detailRef.current !== null) {
        showDetailRef.current(detailRef.current + step)
        return
      }
      const current = targetRef.current ?? Math.round(progressRef.current)
      goToRef.current(current + step)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [count, indexOpen])

  const active = clamp(Math.round(progress), 0, count - 1)
  const current = internships[active]

  const poseFor = (index: number) => {
    const delta = index - progress
    const scale = clamp(1 + delta * scaleStep, 0.4, 1.72)
    return {
      x: anchorX + delta * gap,
      y: anchorY,
      scale,
    }
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || detail !== null) return
    draggingRef.current = true
    targetRef.current = null
    velocityRef.current = 0
    dragOrigin.current = {
      x: event.clientX,
      y: event.clientY,
      progress: progressRef.current,
      pointer: event.pointerId,
      moved: 0,
      last: event.clientX,
      time: performance.now(),
      hit: discIndexAt(event.clientX, event.clientY),
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || event.pointerId !== dragOrigin.current.pointer) return
    const dx = event.clientX - dragOrigin.current.x
    const dy = event.clientY - dragOrigin.current.y
    const vertical = Math.abs(dy) > Math.abs(dx)
    const along = vertical ? dy : dx
    dragOrigin.current.moved = Math.max(dragOrigin.current.moved, Math.hypot(dx, dy))
    const next = dragOrigin.current.progress - along / Math.max(gap, 1)
    progressRef.current = next
    setProgress(next)
    const now = performance.now()
    const elapsed = now - dragOrigin.current.time
    const pointer = vertical ? event.clientY : event.clientX
    if (elapsed > 0) {
      velocityRef.current = clamp(
        -(pointer - dragOrigin.current.last) / Math.max(gap, 1) / (elapsed / 16.67),
        -0.22,
        0.22,
      )
    }
    dragOrigin.current.last = pointer
    dragOrigin.current.time = now
  }

  const onPointerUp = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    const moved = dragOrigin.current.moved
    if (moved < 8) {
      velocityRef.current = 0
      const index = dragOrigin.current.hit
      if (index !== null) {
        showDetail(index)
        return
      }
      goToRef.current(Math.round(progressRef.current))
      return
    }
    if (reducedRef.current) goToRef.current(Math.round(progressRef.current))
    else kick()
  }

  const quoteWidth = narrow ? Math.min(280, w - 48) : Math.min(220, gap * 0.68)
  const quoteIndexes = narrow ? [active] : [active, active + 1].filter((index) => index >= 0 && index < count)

  return (
    <div className="fixed inset-0 overflow-hidden text-[#1a1a1a]" style={{ background: pageBg }}>
      <CatalogNav
        indexOpen={indexOpen}
        showIndex={detail === null}
        narrow={narrow}
        active={active}
        onToggleIndex={() => setIndexOpen((open) => !open)}
        onCatalog={() => {
          setDetail(null)
          setIndexOpen(false)
        }}
        onPick={(index) => {
          setDetail(null)
          setIndexOpen(false)
          goTo(index)
        }}
      />
      {indexOpen ? (
        <button
          type="button"
          aria-label="关闭目录"
          className="absolute inset-0 z-20 bg-black/25"
          onClick={() => setIndexOpen(false)}
        />
      ) : null}

      <div
        ref={stageRef}
        className={`absolute inset-0 ${detail === null ? 'cursor-grab active:cursor-grabbing' : ''}`}
        style={{ touchAction: 'none', perspective: '1500px' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {detail === null ? (
          <>
            <p className="sr-only" aria-live="polite">
              {current.title}，{current.organization}，{current.role}
            </p>
            {internships.map((item, index) => {
              const pose = poseFor(index)
              return (
                <div key={item.slug}>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute"
                    style={{
                      left: pose.x,
                      top: pose.y + disc * pose.scale * 0.36,
                      width: disc * pose.scale * 0.72,
                      height: disc * pose.scale * 0.14,
                      transform: 'translate(-50%, -50%)',
                      background: 'radial-gradient(ellipse, rgba(0,0,0,0.28), rgba(0,0,0,0) 70%)',
                      zIndex: 1,
                    }}
                  />
                  <button
                    type="button"
                    data-index={index}
                    aria-label={`查看${item.title}`}
                    aria-current={index === active ? 'true' : undefined}
                    className="absolute border-0 bg-transparent p-0 outline-none"
                    style={{
                      left: pose.x,
                      top: pose.y,
                      width: disc,
                      height: disc,
                      zIndex: 2 + index,
                      transform: `translate(-50%, -50%) rotateX(12deg) rotateY(-26deg) scale(${pose.scale})`,
                      transformStyle: 'preserve-3d',
                      containerType: 'inline-size',
                    }}
                  >
                    <InternshipDisc item={item} />
                  </button>
                </div>
              )
            })}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute"
              style={{
                left: anchorX,
                top: anchorY,
                width: disc * 1.22,
                height: disc * 1.08,
                transform: 'translate(-50%, -52%)',
                zIndex: 30,
              }}
            >
              <svg viewBox="0 0 100 92" className="pointer-events-none size-full overflow-visible">
                <path d={ringPaths[0]} fill="none" stroke={ink} strokeWidth="0.9" />
                <path d={ringPaths[1]} fill="none" stroke={ink} strokeWidth="0.75" />
              </svg>
            </div>
            {quoteIndexes.map((index) => {
              const pose = poseFor(index)
              if (pose.x < quoteWidth * 0.4 || pose.x > w - quoteWidth * 0.4) return null
              const item = internships[index]
              return (
                <figure
                  key={item.slug}
                  className="pointer-events-none absolute text-center"
                  style={{
                    left: pose.x,
                    top: pose.y + (disc * pose.scale) / 2 + (narrow ? 18 : 28),
                    width: quoteWidth,
                    transform: 'translateX(-50%)',
                    zIndex: 12,
                  }}
                >
                  <figcaption className="text-[10px] tracking-[0.2em]">{item.note.source}</figcaption>
                  <blockquote className="mt-2 text-lg leading-snug" style={serif}>
                    “{item.note.quote}”
                  </blockquote>
                </figure>
              )
            })}
          </>
        ) : null}
      </div>

      {detail === null ? (
        <aside
          key={current.slug}
          className={`absolute z-16 ${narrow ? 'inset-x-5 top-16' : 'top-20 left-8 w-[250px]'}`}
          style={reduced ? undefined : { animation: 'internship-credit-in 460ms ease' }}
        >
          <h1 className="text-[2.6rem] leading-none font-medium" style={serif}>
            {current.title}
          </h1>
          <dl className="mt-4">
            <CreditRow label="机构">{current.organization}</CreditRow>
            <CreditRow label="岗位">{current.role}</CreditRow>
            <CreditRow label="时间">{current.period}</CreditRow>
            <CreditRow label="工作">
              {current.work.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </CreditRow>
          </dl>
        </aside>
      ) : (
        <DetailView
          index={detail}
          onStep={showDetail}
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40 opacity-[0.16] mix-blend-multiply"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.55%22/%3E%3C/svg%3E")',
        }}
      />
    </div>
  )
}

function discIndexAt(x: number, y: number) {
  const elements = document.elementsFromPoint(x, y)
  for (const element of elements) {
    const index = element.closest('[data-index]')?.getAttribute('data-index')
    if (index !== null && index !== undefined) return Number(index)
  }
  return null
}

function CreditRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[4.2rem_1fr] items-start gap-3 border-t border-[#1a1a1a] py-1.5">
      <dt className="pt-0.5 text-[10px] tracking-[0.18em]">{label}</dt>
      <dd className="text-right text-[13px] leading-5">{children}</dd>
    </div>
  )
}

function CatalogNav({
  indexOpen,
  showIndex,
  narrow,
  active,
  onToggleIndex,
  onCatalog,
  onPick,
}: {
  indexOpen: boolean
  showIndex: boolean
  narrow: boolean
  active: number
  onToggleIndex: () => void
  onCatalog: () => void
  onPick: (index: number) => void
}) {
  return (
    <header className={`absolute inset-x-0 z-30 flex justify-center ${narrow ? 'bottom-4 px-4' : 'top-5'}`}>
      <nav
        aria-label="实习目录"
        className={`flex items-center gap-6 text-sm ${narrow ? 'rounded-md bg-white px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)]' : ''}`}
      >
        <Link to="/" className="tracking-tight">
          {profile.name}
        </Link>
        <button type="button" className="relative pb-1" onClick={onCatalog}>
          实习
          <span className="absolute right-0 -bottom-0.5 left-0 mx-auto size-1 rounded-full bg-[#1a1a1a]" />
        </button>
        {showIndex ? (
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-1"
              aria-expanded={indexOpen}
              onClick={onToggleIndex}
            >
              目录
              <svg viewBox="0 0 17 10" className={`size-3 ${indexOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                <path d="M1.5 1.5L8.5 8.5L15.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            {indexOpen ? <IndexMenu active={active} narrow={narrow} onPick={onPick} /> : null}
          </div>
        ) : null}
      </nav>
    </header>
  )
}

function IndexMenu({
  active,
  narrow,
  onPick,
}: {
  active: number
  narrow: boolean
  onPick: (index: number) => void
}) {
  return (
    <div
      className={`absolute z-40 max-h-80 w-72 overflow-auto bg-white py-2 shadow-[0_18px_40px_rgba(0,0,0,0.16)] ${
        narrow ? 'right-0 bottom-full mb-3' : 'top-full left-1/2 mt-3 -translate-x-1/2'
      }`}
    >
      {internships.map((item, index) => {
        const selected = index === active
        return (
          <button
            key={item.slug}
            type="button"
            className={`flex w-full items-baseline justify-between gap-4 px-4 py-2 text-left text-sm ${
              selected ? 'bg-[#1a1a1a] text-white' : 'hover:bg-black/5'
            }`}
            onClick={() => onPick(index)}
          >
            <span>{item.title}</span>
            <span className={selected ? 'text-white/75' : 'text-black/55'}>{item.period}</span>
          </button>
        )
      })}
    </div>
  )
}

function DetailView({ index, onStep }: { index: number; onStep: (index: number) => void }) {
  const item = internships[index]
  return (
    <article className="absolute inset-0 z-20 overflow-y-auto" style={{ background: pageBg }}>
      {index > 0 ? (
        <button
          type="button"
          className="fixed top-1/2 left-4 z-30 -translate-y-1/2 px-2 text-3xl leading-none"
          aria-label="上一段"
          onClick={() => onStep(index - 1)}
        >
          +
        </button>
      ) : null}
      {index < internships.length - 1 ? (
        <button
          type="button"
          className="fixed top-1/2 right-4 z-30 -translate-y-1/2 px-2 text-3xl leading-none"
          aria-label="下一段"
          onClick={() => onStep(index + 1)}
        >
          +
        </button>
      ) : null}
      <div className="mx-auto max-w-3xl px-8 pt-24 pb-20">
        <h1 className="text-center text-6xl leading-none font-medium sm:text-7xl" style={serif}>
          {item.title}
        </h1>
        <p className="mt-8 border-t border-[#1a1a1a] pt-3 text-center text-sm leading-6">
          <span className="mr-2 text-[10px] tracking-[0.16em]">机构</span>
          {item.organization}
          <span className="mx-3 text-[10px] tracking-[0.16em]">岗位</span>
          {item.role}
          <span className="mx-3 text-[10px] tracking-[0.16em]">时间</span>
          {item.period}
        </p>
        <dl className="mt-2">
          <DetailRow label="岗位">{item.role}</DetailRow>
          <DetailRow label="时间">{item.period}</DetailRow>
          <DetailRow label="机构">{item.organization}</DetailRow>
          <DetailRow label="工作">{item.work.join('、')}</DetailRow>
        </dl>
        <p className="mt-16 max-w-xl text-[15px] leading-7">{item.summary}</p>
      </div>
    </article>
  )
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-[#1a1a1a] py-2 text-sm">
      <dt className="text-[10px] tracking-[0.16em]">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
