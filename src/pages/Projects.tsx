import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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

function paintStack(slides: Array<HTMLButtonElement | null>, focusNow: number) {
  slides.forEach((slide, index) => {
    if (!slide) return
    const delta = index - focusNow
    const distance = Math.abs(delta)
    slide.style.width = ''
    slide.style.height = ''
    slide.style.transform = `translate3d(-50%, calc(-50% + ${delta * 118}%), 0)`
    slide.style.opacity = distance > 1.65 ? '0' : String(Math.max(0.35, 1 - distance * 0.28))
    slide.style.zIndex = String(10 - Math.round(distance))
  })
}

function ProjectStage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const focus = useRef(0)
  const frame = useRef(0)
  const slideRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [active, setActive] = useState(0)
  const [mode, setMode] = useState<'slider' | 'grid'>('slider')
  const [openId, setOpenId] = useState<string | null>(null)
  const [phase, setPhase] = useState<'opening' | 'ready'>('opening')
  const [titlePhase, setTitlePhase] = useState<'in' | 'out' | 'gone'>('in')

  useLayoutEffect(() => {
    slideRefs.current.forEach((slide) => {
      if (slide) slide.style.opacity = '0'
    })
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
    const textExit = 2.35
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
        paintStack(slideRefs.current, 0)
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

  useEffect(() => {
    if (mode !== 'slider' || phase !== 'ready') return
    const read = () => {
      const root = rootRef.current
      if (!root) return 0
      const total = root.offsetHeight - window.innerHeight
      if (total <= 0) return 0
      const scrolled = Math.min(total, Math.max(0, -root.getBoundingClientRect().top))
      return scrolled / total
    }
    const paint = () => {
      const next = read() * (pieces.length - 1)
      focus.current += (next - focus.current) * 0.1
      paintStack(slideRefs.current, focus.current)
      const nearest = Math.min(pieces.length - 1, Math.max(0, Math.round(focus.current)))
      setActive((current) => (current === nearest ? current : nearest))
      frame.current = requestAnimationFrame(paint)
    }
    frame.current = requestAnimationFrame(paint)
    return () => cancelAnimationFrame(frame.current)
  }, [mode, phase])

  const scrollToIndex = (index: number) => {
    const root = rootRef.current
    if (!root) return
    const total = root.offsetHeight - window.innerHeight
    const next = Math.min(pieces.length - 1, Math.max(0, index))
    window.scrollTo({ top: root.offsetTop + (total * next) / (pieces.length - 1), behavior: 'smooth' })
  }

  const current = pieces[active]
  const opened = pieces.find((piece) => piece.id === openId) ?? null

  if (mode === 'grid') {
    return (
      <div className="min-h-dvh bg-[#f7f5f2] text-[#1a1a1a]">
        <SiteHeader />
        <ProjectChrome
          current={current}
          mode={mode}
          onMode={setMode}
          onPick={(index) => {
            setMode('slider')
            window.setTimeout(() => scrollToIndex(index), 40)
          }}
        />
        <main className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 pt-36 pb-16 md:grid-cols-3">
          {pieces.map((piece) => (
            <button key={piece.id} type="button" className="text-left" onClick={() => setOpenId(piece.id)}>
              <img src={piece.image} alt="" className="aspect-[4/5] w-full object-cover" />
              <span className="mt-2 block text-sm" style={{ fontFamily: serif }}>
                {piece.index} {piece.title}
              </span>
            </button>
          ))}
        </main>
        {opened ? <PieceDetail piece={opened} onClose={() => setOpenId(null)} /> : null}
      </div>
    )
  }

  return (
    <div ref={rootRef} className="bg-[#f7f5f2] text-[#1a1a1a]" style={{ height: `${pieces.length * 70 + 100}vh` }}>
      <div className="sticky top-0 h-dvh overflow-hidden">
        {phase === 'ready' ? <SiteHeader /> : null}
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
                if (Math.abs(index - focus.current) > 0.4) scrollToIndex(index)
                else setOpenId(piece.id)
              }}
            >
              <img src={piece.image} alt="" className="size-full object-cover" draggable={false} />
              {phase === 'ready' && index === active ? (
                <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white" />
              ) : null}
            </button>
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 top-28 bottom-8 z-20 grid grid-cols-[1fr_minmax(180px,280px)_1fr] items-center px-6 sm:px-10"
          style={{ opacity: phase === 'ready' ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <div className="flex items-center gap-4 pr-4">
            <p className="text-4xl italic sm:text-5xl" style={{ fontFamily: serif }}>
              {current.index}
              <span className="text-2xl not-italic text-black/35"> / {pieces[pieces.length - 1].index}</span>
            </p>
            <span className="hidden h-px min-w-8 flex-1 bg-black/25 sm:block" />
          </div>
          <div />
          <div className={`${phase === 'ready' ? 'pointer-events-auto' : 'pointer-events-none'} flex items-center gap-4 pl-4`}>
            <span className="hidden h-px min-w-8 flex-1 bg-black/25 sm:block" />
            <Link to="/about" className="text-xs tracking-[0.22em]">
              关于
            </Link>
          </div>
        </div>
        <div
          className={phase === 'ready' ? undefined : 'pointer-events-none'}
          style={{ opacity: phase === 'ready' ? 1 : 0, transition: 'opacity 0.8s ease 0.15s' }}
        >
          <ProjectChrome current={current} mode={mode} onMode={setMode} onPick={scrollToIndex} />
        </div>
        <p
          className="absolute bottom-6 left-8 text-[11px] tracking-[0.18em] text-black/55"
          style={{ fontFamily: serif, opacity: phase === 'ready' ? 1 : 0, transition: 'opacity 0.8s ease 0.15s' }}
        >
          {current.title}
        </p>
        {opened ? <PieceDetail piece={opened} onClose={() => setOpenId(null)} /> : null}
      </div>
    </div>
  )
}

function ProjectChrome({
  current,
  mode,
  onMode,
  onPick,
}: {
  current: Piece
  mode: 'slider' | 'grid'
  onMode: (mode: 'slider' | 'grid') => void
  onPick: (index: number) => void
}) {
  return (
    <>
      <div className="absolute top-28 right-6 z-30 hidden text-right sm:block" style={{ fontFamily: serif }}>
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

function PieceDetail({ piece, onClose }: { piece: Piece; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-[#f7f5f2]">
      <div className="mx-auto grid min-h-dvh max-w-6xl items-center gap-8 px-5 py-24 md:grid-cols-[1.3fr_0.7fr]">
        <img src={piece.image} alt="" className="w-full object-cover" />
        <div style={{ fontFamily: serif }}>
          <p className="text-xs tracking-[0.22em] text-black/45">{piece.index}</p>
          <h2 className="mt-3 text-5xl">{piece.title}</h2>
          <button type="button" onClick={onClose} className="mt-8 text-sm tracking-[0.18em] underline underline-offset-4">
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
