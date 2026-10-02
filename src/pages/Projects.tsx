import { useEffect, useRef, useState } from 'react'
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
  const [introDone, setIntroDone] = useState(prefersReducedMotion)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      setReduced(media.matches)
      if (media.matches) setIntroDone(true)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  if (reduced) return <ProjectReading />

  return (
    <>
      <ProjectStage />
      {introDone ? null : <ProjectIntro onDone={() => setIntroDone(true)} />}
    </>
  )
}

function ProjectIntro({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const hold = window.setTimeout(() => setLeaving(true), 2300)
    const done = window.setTimeout(onDone, 3100)
    return () => {
      window.clearTimeout(hold)
      window.clearTimeout(done)
    }
  }, [onDone])

  const motion = leaving ? 'projects-line-out 0.7s ease both' : 'projects-line-in 1s cubic-bezier(0.22, 1, 0.36, 1) both'

  return (
    <div className="fixed inset-0 z-50 flex items-center bg-[#f7f5f2] px-[8vw] text-[#111]">
      <div>
        <div className="overflow-hidden">
          <h1 className="text-[8vw] leading-none font-light sm:text-6xl" style={{ fontFamily: serif, animation: motion }}>
            {profile.name}
          </h1>
        </div>
        <div className="mt-3 overflow-hidden">
          <p
            className="text-sm tracking-[0.28em] text-black/50"
            style={{ fontFamily: serif, animation: motion, animationDelay: leaving ? '0s' : '0.12s' }}
          >
            项目
          </p>
        </div>
      </div>
    </div>
  )
}

function ProjectStage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const focus = useRef(0)
  const frame = useRef(0)
  const slideRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [active, setActive] = useState(0)
  const [mode, setMode] = useState<'slider' | 'grid'>('slider')
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    if (mode !== 'slider') return
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
      const focusNow = focus.current
      slideRefs.current.forEach((slide, index) => {
        if (!slide) return
        const delta = index - focusNow
        const distance = Math.abs(delta)
        slide.style.transform = `translate3d(-50%, calc(-50% + ${delta * 118}%), 0)`
        slide.style.opacity = distance > 1.65 ? '0' : String(Math.max(0.35, 1 - distance * 0.28))
        slide.style.zIndex = String(10 - Math.round(distance))
      })
      const nearest = Math.min(pieces.length - 1, Math.max(0, Math.round(focusNow)))
      setActive((current) => (current === nearest ? current : nearest))
      frame.current = requestAnimationFrame(paint)
    }
    frame.current = requestAnimationFrame(paint)
    return () => cancelAnimationFrame(frame.current)
  }, [mode])

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
        <SiteHeader />
        <div className="absolute inset-x-0 top-28 bottom-8 grid grid-cols-[1fr_minmax(180px,280px)_1fr] items-center px-6 sm:px-10">
          <div className="flex items-center gap-4 pr-4">
            <p className="text-4xl italic sm:text-5xl" style={{ fontFamily: serif }}>
              {current.index}
              <span className="text-2xl not-italic text-black/35"> / {pieces[pieces.length - 1].index}</span>
            </p>
            <span className="hidden h-px min-w-8 flex-1 bg-black/25 sm:block" />
          </div>
          <div className="relative h-full">
            {pieces.map((piece, index) => (
              <button
                key={piece.id}
                ref={(node) => {
                  slideRefs.current[index] = node
                }}
                type="button"
                aria-label={piece.title}
                className="absolute top-1/2 left-1/2 h-[34vh] w-[min(26vw,250px)] overflow-hidden bg-[#ddd8d0]"
                onClick={() => {
                  if (Math.abs(index - focus.current) > 0.4) scrollToIndex(index)
                  else setOpenId(piece.id)
                }}
              >
                <img src={piece.image} alt="" className="size-full object-cover" draggable={false} />
                {index === active ? (
                  <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white" />
                ) : null}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 pl-4">
            <span className="hidden h-px min-w-8 flex-1 bg-black/25 sm:block" />
            <Link to="/about" className="text-xs tracking-[0.22em]">
              关于
            </Link>
          </div>
        </div>
        <ProjectChrome current={current} mode={mode} onMode={setMode} onPick={scrollToIndex} />
        <p className="absolute bottom-6 left-8 text-[11px] tracking-[0.18em] text-black/55" style={{ fontFamily: serif }}>
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
