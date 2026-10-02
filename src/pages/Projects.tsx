import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '@/src/components/SiteHeader'
import { profile } from '@/src/content'

type Piece = {
  id: string
  index: string
  title: string
  image: string
}

const pieces: Piece[] = [
  { id: 'meijian', index: '01', title: '梅见', image: '/projects/meijian.png' },
  { id: 'anker', index: '02', title: '安克创新', image: '/projects/anker.png' },
  { id: 'loreal', index: '03', title: '欧莱雅', image: '/projects/loreal.png' },
  { id: 'hr', index: '04', title: 'HR 招聘', image: '/projects/hr.png' },
  { id: 'sofa', index: '05', title: '海外压缩沙发', image: '/projects/sofa.png' },
  { id: 'muse', index: '06', title: 'Muse Select', image: '/projects/muse-select.png' },
  { id: 'planflow', index: '07', title: 'PlanFlow', image: '/projects/planflow.png' },
]

const serif = '"Iowan Old Style", Palatino, "Palatino Linotype", "Songti SC", "Noto Serif SC", serif'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Projects() {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  if (reduced) return <ProjectReading />

  return <ProjectStage />
}

function ProjectIntro({ leaving }: { leaving: boolean }) {
  const motion = leaving
    ? 'projects-line-out 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) both'
    : 'projects-line-in 1s cubic-bezier(0.215, 0.61, 0.355, 1) both'

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center px-[7vw]">
      <div style={{ mixBlendMode: 'difference', color: '#000' }}>
        <div className="overflow-hidden">
          <h1
            className="m-0 text-[clamp(40px,4vw,64px)] leading-[1.1] font-normal"
            style={{ fontFamily: serif, animation: motion }}
          >
            {profile.name}
          </h1>
        </div>
        <div className="overflow-hidden">
          <p
            className="m-0 mt-2 text-[clamp(14px,1.25vw,18px)] leading-snug font-light text-black/50"
            style={{ fontFamily: serif, animation: motion, animationDelay: leaving ? '0s' : '0.1s' }}
          >
            项目实践
          </p>
        </div>
      </div>
    </div>
  )
}

type OpeningSpot = {
  x: number
  y: number
  fromX: number
  delay: number
  duration: number
  dir: number
}

const diamondCells = [
  [0, 0],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [0, -2],
  [0, 2],
]

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function easeInOutCubic(value: number) {
  const t = clamp01(value)
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function glide(value: number) {
  return 1 - (1 - clamp01(value)) ** 3
}

function openingLayout(width: number, height: number) {
  const cardW = Math.min(width * 0.26, 250)
  const cardH = height * 0.34
  const narrow = width < 720
  const scale = narrow ? 0.42 : 0.62
  const maxRadius = Math.min(width, height) / 2 - 10
  const halfBox = (cardW + cardH) * scale * 0.38
  const fittedGap = Math.max(32, (maxRadius - halfBox) / Math.SQRT2)
  const gap = narrow ? fittedGap : Math.min(width, height) * 0.2
  return { scale, spots: buildOpening(gap, width) }
}

function buildOpening(gap: number, width: number): OpeningSpot[] {
  const reach = Math.max(...diamondCells.map(([x, y]) => Math.hypot(x, y)), 1)
  return diamondCells.slice(0, pieces.length).map(([col, row]) => {
    const x = col * gap
    const y = row * gap
    const dir = col === 0 ? (row < 0 ? -1 : 1) : Math.sign(col)
    const distance = Math.hypot(col, row) / reach
    return {
      x,
      y,
      fromX: col === 0 && row === 0 ? 0 : x - dir * width * 0.78,
      delay: distance * 0.22,
      duration: col === 0 && row === 0 ? 0.7 : 0.98,
      dir,
    }
  })
}

function stackLook(distance: number) {
  const opacity = distance >= 2.35 ? 0 : Math.max(0, 1 - Math.max(0, distance - 0.15) * 0.46)
  const scale = 1 - Math.min(distance, 1.15) * 0.055
  return { opacity, scale }
}

type GridCell = { x: number; y: number; w: number; h: number }

function fittedGrid(width: number, height: number): GridCell[] {
  const cols = width < 640 ? 2 : 3
  const rows = Math.ceil(pieces.length / cols)
  const top = width < 640 ? 108 : 128
  const bottom = 68
  const side = width < 640 ? 20 : 72
  const gap = 16
  const maxW = (width - side * 2 - gap * (cols - 1)) / cols
  const maxH = (height - top - bottom - gap * (rows - 1)) / rows
  let cellH = maxW * 1.18
  let cellW = maxW
  if (cellH > maxH) {
    cellH = maxH
    cellW = cellH / 1.18
  }
  const gridW = cols * cellW + (cols - 1) * gap
  const originX = (width - gridW) / 2
  return pieces.map((_, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    return {
      x: originX + col * (cellW + gap) + cellW / 2 - width / 2,
      y: top + row * (cellH + gap) + cellH / 2 - height / 2,
      w: cellW,
      h: cellH,
    }
  })
}

function ProjectStage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const focus = useRef(0)
  const frame = useRef(0)
  const slideRefs = useRef<Array<HTMLButtonElement | null>>([])
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([])
  const sliderSize = useRef({ w: 250, h: 360 })
  const layoutTarget = useRef(0)
  const layoutBlend = useRef(0)
  const drive = useRef<'scroll' | 'glide'>('scroll')
  const glideFrom = useRef(0)
  const glideToIndex = useRef(0)
  const glideStart = useRef(0)
  const readyAt = useRef(0)
  const chromeRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [mode, setMode] = useState<'slider' | 'grid'>('slider')
  const [compact, setCompact] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [origin, setOrigin] = useState<DOMRect | null>(null)
  const [phase, setPhase] = useState<'opening' | 'ready'>('opening')
  const [titlePhase, setTitlePhase] = useState<'in' | 'out' | 'gone'>('in')

  useLayoutEffect(() => {
    slideRefs.current.forEach((slide) => {
      if (slide) slide.style.opacity = '0'
    })
    if (headerRef.current) headerRef.current.style.opacity = '0'
    if (metaRef.current) metaRef.current.style.opacity = '0'
    if (titleRef.current) titleRef.current.style.opacity = '0'
    if (chromeRef.current) chromeRef.current.style.opacity = '0'
  }, [])

  useEffect(() => {
    if (phase !== 'opening') return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    const { spots, scale } = openingLayout(window.innerWidth, window.innerHeight)
    const angle = Math.PI / 4
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const lastArrival = Math.max(...spots.map((spot) => spot.delay + spot.duration))
    const hold = 0.9
    const foldAt = lastArrival + hold
    const foldDuration = 1.25
    const textExit = 1.45
    let titleLeft = false
    let titleGone = false
    let raf = 0
    const started = performance.now()

    const tick = (now: number) => {
      const elapsed = (now - started) / 1000
      if (!titleLeft && elapsed >= textExit) {
        titleLeft = true
        setTitlePhase('out')
      }
      if (!titleGone && elapsed >= textExit + 0.85) {
        titleGone = true
        setTitlePhase('gone')
      }

      const imageTime = elapsed - textExit
      if (imageTime < 0) {
        slideRefs.current.forEach((slide) => {
          if (!slide) return
          slide.style.opacity = '0'
        })
        raf = requestAnimationFrame(tick)
        return
      }

      const card = slideRefs.current[0]
      const cardHeight = card?.offsetHeight || window.innerHeight * 0.34
      const folding = imageTime >= foldAt
      const foldT = folding ? clamp01((imageTime - foldAt) / foldDuration) : 0
      const yBlend = easeInOutCubic(foldT / 0.92)
      const spin = easeInOutCubic(clamp01((foldT - 0.05) / 0.55))
      const scaleNow = scale + (1 - scale) * yBlend

      slideRefs.current.forEach((slide, index) => {
        if (!slide || !spots[index]) return
        const spot = spots[index]
        const flight = glide((imageTime - spot.delay) / spot.duration)
        const localX = spot.fromX + (spot.x - spot.fromX) * flight
        const localY = spot.y
        const worldX = localX * cos - localY * sin
        const worldY = localX * sin + localY * cos
        const lag = 0.08 + Math.min(index, 4) * 0.045
        const xBlend = easeInOutCubic(clamp01((imageTime - foldAt - lag) / (foldDuration * 0.72)))
        const stackY = index * cardHeight * 1.18
        const x = folding ? worldX * (1 - xBlend) : worldX
        const y = folding ? worldY + (stackY - worldY) * yBlend : worldY
        const rotation = 45 * (1 - (folding ? spin : 0))
        const wind = folding ? 0 : Math.sin(flight * Math.PI) * spot.dir * 7
        const opacity = folding
          ? 1 + ((index > 1.65 ? 0 : Math.max(0.35, 1 - index * 0.28)) - 1) * clamp01((foldT - 0.45) / 0.5)
          : Math.min(1, Math.max(0, (imageTime - spot.delay) / 0.35))
        slide.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotate(${rotation}deg) skewX(${wind}deg) scale(${scaleNow})`
        slide.style.opacity = String(opacity)
        slide.style.zIndex = String(30 - Math.round(Math.hypot(spot.x, spot.y)))
      })

      if (imageTime < foldAt + foldDuration) raf = requestAnimationFrame(tick)
      else {
        document.body.style.overflow = previousOverflow
        setPhase('ready')
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = previousOverflow
    }
  }, [phase])

  useLayoutEffect(() => {
    if (phase !== 'ready') return
    readyAt.current = performance.now()
    let last = performance.now()
    let locked = false
    const release = () => {
      if (drive.current === 'glide') drive.current = 'scroll'
    }
    window.addEventListener('wheel', release, { passive: true })
    window.addEventListener('touchstart', release, { passive: true })

    const paint = (now: number) => {
      const dt = Math.min(0.048, (now - last) / 1000)
      last = now
      const root = rootRef.current
      const width = window.innerWidth
      const height = window.innerHeight
      layoutBlend.current += (layoutTarget.current - layoutBlend.current) * (1 - Math.exp(-dt / 0.42))
      const blend = layoutBlend.current
      const spread = easeInOutCubic(blend)

      if (drive.current === 'glide') {
        const raw = clamp01((now - glideStart.current) / 780)
        focus.current = glideFrom.current + (glideToIndex.current - glideFrom.current) * easeInOutCubic(raw)
        if (raw === 1) drive.current = 'scroll'
        if (root && spread < 0.04) {
          const total = root.offsetHeight - height
          window.scrollTo(0, root.offsetTop + (total * focus.current) / (pieces.length - 1))
        }
      } else if (root && spread < 0.04 && layoutTarget.current < 0.5) {
        const total = root.offsetHeight - height
        if (total > 0) {
          const scrolled = Math.min(total, Math.max(0, -root.getBoundingClientRect().top))
          const target = (scrolled / total) * (pieces.length - 1)
          const follow = 1 - Math.exp(-dt / 0.16)
          focus.current += (target - focus.current) * follow
        }
      }

      const wantLock = spread > 0.9 && layoutTarget.current > 0.5
      if (wantLock && !locked) {
        locked = true
        setCompact(true)
      } else if (!wantLock && locked && layoutTarget.current < 0.5) {
        locked = false
        setCompact(false)
      }

      const base = sliderSize.current
      const cells = fittedGrid(width, height)
      const reveal = clamp01((now - readyAt.current) / 720)

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return
        const distance = Math.abs(index - focus.current)
        const look = stackLook(distance)
        const sw = base.w * look.scale
        const sh = base.h * look.scale
        const cell = cells[index]
        const x = (cell?.x ?? 0) * spread
        const y = (index - focus.current) * base.h * 1.18 * (1 - spread) + (cell?.y ?? 0) * spread
        const w = sw + ((cell?.w ?? sw) - sw) * spread
        const h = sh + ((cell?.h ?? sh) - sh) * spread
        if (spread < 0.012) {
          slide.style.width = ''
          slide.style.height = ''
          slide.style.transform = `translate3d(-50%, calc(-50% + ${(index - focus.current) * 118}%), 0) scale(${look.scale})`
        } else {
          slide.style.width = `${w}px`
          slide.style.height = `${h}px`
          slide.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`
        }
        const hidden = openIdRef.current === pieces[index]?.id
        slide.style.opacity = hidden ? '0' : String(look.opacity + (1 - look.opacity) * spread)
        slide.style.zIndex = String(20 - Math.round(distance))
        const label = labelRefs.current[index]
        if (label) {
          label.style.opacity = String(hidden ? 0 : Math.max(0, (spread - 0.4) / 0.6))
          label.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y + h / 2 + 14}px), 0)`
        }
      })

      if (spread < 0.012) {
        const resting = slideRefs.current[0]
        if (resting) sliderSize.current = { w: resting.offsetWidth, h: resting.offsetHeight }
      }

      const chromeOpacity = String(reveal * (1 - spread))
      if (chromeRef.current) {
        chromeRef.current.style.opacity = chromeOpacity
        chromeRef.current.style.pointerEvents = spread > 0.35 ? 'none' : 'auto'
      }
      if (metaRef.current) metaRef.current.style.opacity = chromeOpacity
      if (aboutRef.current) aboutRef.current.style.pointerEvents = reveal * (1 - spread) > 0.65 ? 'auto' : 'none'
      if (titleRef.current) titleRef.current.style.opacity = chromeOpacity
      if (headerRef.current) {
        headerRef.current.style.opacity = String(reveal)
        headerRef.current.style.transform = `translateY(${(1 - reveal) * -10}px)`
      }

      const nearest = Math.min(pieces.length - 1, Math.max(0, Math.round(focus.current)))
      setActive((current) => (current === nearest ? current : nearest))
      frame.current = requestAnimationFrame(paint)
    }

    frame.current = requestAnimationFrame(paint)
    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener('wheel', release)
      window.removeEventListener('touchstart', release)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'ready') return
    if (compact) {
      window.scrollTo(0, 0)
      const previous = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previous
      }
    }
    const root = rootRef.current
    if (!root) return
    const total = root.offsetHeight - window.innerHeight
    window.scrollTo(0, root.offsetTop + (total * focus.current) / (pieces.length - 1))
  }, [compact, phase])

  const glideTo = (index: number) => {
    const next = Math.min(pieces.length - 1, Math.max(0, index))
    glideFrom.current = focus.current
    glideToIndex.current = next
    glideStart.current = performance.now()
    drive.current = 'glide'
  }

  const openIdRef = useRef<string | null>(null)
  openIdRef.current = openId

  const current = pieces[active]
  const opened = pieces.find((piece) => piece.id === openId) ?? null

  const chooseMode = (next: 'slider' | 'grid') => {
    if (next === 'grid' && mode === 'grid') return
    if (next === 'slider' && mode === 'slider') return
    layoutTarget.current = next === 'grid' ? 1 : 0
    setMode(next)
  }

  return (
    <div
      ref={rootRef}
      className="bg-[#f7f5f2] text-[#1a1a1a]"
      style={{ height: compact ? '100vh' : `${pieces.length * 70 + 100}vh` }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div
          ref={headerRef}
          className={`relative z-30 ${phase === 'ready' ? '' : 'pointer-events-none'}`}
        >
          <SiteHeader />
        </div>
        {titlePhase !== 'gone' ? <ProjectIntro leaving={titlePhase === 'out'} /> : null}
        <div className="pointer-events-none absolute inset-0 z-10">
          {pieces.map((piece, index) => (
            <button
              key={piece.id}
              ref={(node) => {
                slideRefs.current[index] = node
              }}
              type="button"
              aria-label={piece.title}
              className="pointer-events-auto absolute top-1/2 left-1/2 h-[34vh] w-[min(26vw,250px)] overflow-hidden bg-[#ddd8d0]"
              style={{ pointerEvents: phase === 'ready' ? undefined : 'none' }}
              onClick={() => {
                if (phase !== 'ready') return
                const spreadNow = easeInOutCubic(layoutBlend.current)
                const centered = spreadNow > 0.85 || Math.abs(index - focus.current) < 0.42
                if (!centered) {
                  glideTo(index)
                  return
                }
                const slide = slideRefs.current[index]
                if (slide) slide.style.opacity = '0'
                setOrigin(slide?.getBoundingClientRect() ?? null)
                setOpenId(piece.id)
              }}
            >
              <img src={piece.image} alt="" className="size-full object-cover" draggable={false} />
              {phase === 'ready' && mode === 'slider' && index === active ? (
                <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white" />
              ) : null}
            </button>
          ))}
          {pieces.map((piece, index) => (
            <span
              key={`${piece.id}-label`}
              ref={(node) => {
                labelRefs.current[index] = node
              }}
              className="pointer-events-none absolute top-1/2 left-1/2 text-sm text-[#1a1a1a] opacity-0"
              style={{ fontFamily: serif }}
            >
              {piece.index} {piece.title}
            </span>
          ))}
        </div>
        <div
          ref={metaRef}
          className="pointer-events-none absolute inset-x-0 top-28 bottom-8 z-20 grid grid-cols-[1fr_minmax(180px,280px)_1fr] items-center px-6 sm:px-10"
        >
          <div className="flex items-center gap-4 pr-4">
            <p key={current.index} className="text-4xl italic sm:text-5xl" style={{ fontFamily: serif, animation: 'projects-meta-in 0.45s cubic-bezier(0.22, 1, 0.36, 1)' }}>
              {current.index}
              <span className="text-2xl not-italic text-black/35"> / {pieces[pieces.length - 1].index}</span>
            </p>
            <span className="hidden h-px min-w-8 flex-1 bg-black/25 sm:block" />
          </div>
          <div />
          <div ref={aboutRef} className="pointer-events-none flex items-center gap-4 pl-4">
            <span className="hidden h-px min-w-8 flex-1 bg-black/25 sm:block" />
            <Link to="/about" className="text-xs tracking-[0.22em]">
              关于
            </Link>
          </div>
        </div>
        <div className={phase === 'ready' ? undefined : 'pointer-events-none'}>
          <ProjectChrome
            current={current}
            mode={mode}
            categoryRef={chromeRef}
            onMode={chooseMode}
            onPick={(index) => {
              if (mode === 'grid') {
                focus.current = index
                drive.current = 'scroll'
                chooseMode('slider')
                return
              }
              glideTo(index)
            }}
          />
        </div>
        <p
          ref={titleRef}
          className="absolute bottom-6 left-8 text-[11px] tracking-[0.18em] text-black/55"
          style={{ fontFamily: serif }}
        >
          {current.title}
        </p>
        {opened ? (
          <PieceDetail
            piece={opened}
            origin={origin}
            onClose={() => {
              setOpenId(null)
              setOrigin(null)
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

function ProjectChrome({
  current,
  mode,
  categoryRef,
  onMode,
  onPick,
}: {
  current: Piece
  mode: 'slider' | 'grid'
  categoryRef: RefObject<HTMLDivElement | null>
  onMode: (mode: 'slider' | 'grid') => void
  onPick: (index: number) => void
}) {
  return (
    <>
      <div ref={categoryRef} className="absolute top-28 right-6 z-30 hidden text-right opacity-0 sm:block" style={{ fontFamily: serif }}>
        <p className="text-sm tracking-[0.14em] underline decoration-black/70 underline-offset-4">项目</p>
        <ul className="mt-3 space-y-1 text-xs text-black/55">
          {pieces.map((piece, index) => (
            <li key={piece.id}>
              <button
                type="button"
                className={piece.id === current.id ? 'text-black' : ''}
                onClick={() => onPick(index)}
              >
                {piece.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute right-6 bottom-6 z-30 text-right" style={{ fontFamily: serif }}>
        <p className="text-sm tracking-[0.14em] underline decoration-black/70 underline-offset-4">展示</p>
        <p className="mt-2 text-xs">
          <button type="button" className={mode === 'slider' ? 'text-black' : 'text-black/40'} onClick={() => onMode('slider')}>
            滑动
          </button>
          <span className="px-1 text-black/30">/</span>
          <button type="button" className={mode === 'grid' ? 'text-black' : 'text-black/40'} onClick={() => onMode('grid')}>
            网格
          </button>
        </p>
      </div>
    </>
  )
}

function PieceDetail({ piece, origin, onClose }: { piece: Piece; origin: DOMRect | null; onClose: () => void }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const closing = useRef(false)
  const [veil, setVeil] = useState(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVeil(1))
    return () => cancelAnimationFrame(id)
  }, [])

  useLayoutEffect(() => {
    const img = imgRef.current
    if (!img || !origin) return
    const next = img.getBoundingClientRect()
    if (next.width < 2) return
    const scale = origin.width / next.width
    img.style.transition = 'none'
    img.style.transformOrigin = 'top left'
    img.style.transform = `translate(${origin.left - next.left}px, ${origin.top - next.top}px) scale(${scale})`
    const id = requestAnimationFrame(() => {
      img.style.transition = 'transform 0.72s cubic-bezier(0.77, 0, 0.175, 1)'
      img.style.transform = 'translate(0px, 0px) scale(1)'
    })
    return () => cancelAnimationFrame(id)
  }, [origin, piece.id])

  const requestClose = () => {
    const img = imgRef.current
    if (!img || !origin || closing.current) {
      onClose()
      return
    }
    closing.current = true
    setVeil(0)
    const next = img.getBoundingClientRect()
    if (next.width < 2) {
      onClose()
      return
    }
    const scale = origin.width / next.width
    img.style.transition = 'transform 0.52s cubic-bezier(0.77, 0, 0.175, 1)'
    img.style.transformOrigin = 'top left'
    img.style.transform = `translate(${origin.left - next.left}px, ${origin.top - next.top}px) scale(${scale})`
    window.setTimeout(onClose, 500)
  }

  return (
    <div
      className="absolute inset-0 z-50 overflow-y-auto bg-[#f7f5f2]"
      style={{ opacity: veil, transition: 'opacity 0.32s ease' }}
    >
      <div className="mx-auto grid min-h-dvh max-w-6xl items-center gap-8 px-5 py-24 md:grid-cols-[1.3fr_0.7fr]">
        <img ref={imgRef} src={piece.image} alt="" className="w-full object-cover" />
        <div style={{ fontFamily: serif, opacity: veil, transform: `translateY(${(1 - veil) * 12}px)`, transition: 'opacity 0.45s ease, transform 0.45s ease' }}>
          <p className="text-xs tracking-[0.22em] text-black/45">{piece.index}</p>
          <h2 className="mt-3 text-5xl">{piece.title}</h2>
          <button type="button" onClick={requestClose} className="mt-8 text-sm tracking-[0.18em] underline underline-offset-4">
            返回
          </button>
        </div>
      </div>
    </div>
  )
}

function ProjectReading() {
  return (
    <div className="min-h-dvh bg-[#f7f5f2] text-[#1a1a1a]">
      <SiteHeader />
      <main className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 py-16 md:grid-cols-3">
        {pieces.map((piece) => (
          <article key={piece.id}>
            <img src={piece.image} alt="" className="aspect-[4/5] w-full object-cover" />
            <h2 className="mt-3 text-2xl" style={{ fontFamily: serif }}>
              {piece.index} {piece.title}
            </h2>
          </article>
        ))}
      </main>
    </div>
  )
}
