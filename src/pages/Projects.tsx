import { useEffect, useRef, useState } from 'react'
import SiteHeader from '@/src/components/SiteHeader'

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
  return <ProjectGallery />
}

function ProjectGallery() {
  const rootRef = useRef<HTMLDivElement>(null)
  const focus = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const look = useRef({ x: 0, y: 0 })
  const frame = useRef(0)
  const slideRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    const read = () => {
      const root = rootRef.current
      if (!root) return 0
      const total = root.offsetHeight - window.innerHeight
      if (total <= 0) return 0
      const scrolled = Math.min(total, Math.max(0, -root.getBoundingClientRect().top))
      return scrolled / total
    }

    const paint = () => {
      const nextTarget = read() * (pieces.length - 1)
      focus.current += (nextTarget - focus.current) * 0.08
      look.current.x += (pointer.current.x - look.current.x) * 0.06
      look.current.y += (pointer.current.y - look.current.y) * 0.06
      const focusNow = focus.current
      slideRefs.current.forEach((slide, index) => {
        if (!slide) return
        const delta = index - focusNow
        const x = delta * 54 + look.current.x * 1.2
        const z = -Math.abs(delta) * 240
        const rot = delta * -16 + look.current.x * -1.4
        const lift = look.current.y * -8
        slide.style.transform = `translate3d(${x}vw, ${lift}px, ${z}px) rotateY(${rot}deg)`
        slide.style.opacity = String(Math.max(0.22, 1 - Math.abs(delta) * 0.38))
        slide.style.zIndex = String(30 - Math.round(Math.abs(delta) * 4))
      })
      const nearest = Math.min(pieces.length - 1, Math.max(0, Math.round(focusNow)))
      setActive((current) => (current === nearest ? current : nearest))
      const nextProgress = nextTarget / (pieces.length - 1)
      setProgress((current) => (Math.abs(current - nextProgress) < 0.004 ? current : nextProgress))
      frame.current = requestAnimationFrame(paint)
    }

    frame.current = requestAnimationFrame(paint)
    const onPointerMove = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      }
    }
    const onLeave = () => {
      pointer.current = { x: 0, y: 0 }
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [])

  const scrollToIndex = (index: number) => {
    const root = rootRef.current
    if (!root) return
    const total = root.offsetHeight - window.innerHeight
    const next = Math.min(pieces.length - 1, Math.max(0, index))
    window.scrollTo({ top: root.offsetTop + (total * next) / (pieces.length - 1), behavior: 'smooth' })
  }

  const opened = pieces.find((piece) => piece.id === openId) ?? null
  const current = pieces[active]

  return (
    <div ref={rootRef} className="bg-[#f7f5f2] text-[#1a1a1a]" style={{ height: `${(pieces.length + 1) * 100}vh` }}>
      <div className="sticky top-0 h-dvh overflow-hidden">
        <SiteHeader />
        <p className="pointer-events-none absolute top-28 right-6 z-30 text-xs tracking-[0.22em] text-black/45" style={{ fontFamily: serif }}>
          {current.index} / {pieces[pieces.length - 1].index}
        </p>
        <div className="absolute inset-0" style={{ perspective: '1400px', perspectiveOrigin: '50% 54%' }}>
          <div
            className="absolute top-[16%] left-1/2 h-[62vh] w-[min(72vw,820px)]"
            style={{ marginLeft: 'calc(min(72vw, 820px) / -2)', transformStyle: 'preserve-3d' }}
          >
            {pieces.map((piece, index) => (
              <button
                key={piece.id}
                ref={(node) => {
                  slideRefs.current[index] = node
                }}
                type="button"
                aria-label={`${piece.title}，探索`}
                className="absolute top-0 left-0 h-full w-full overflow-hidden bg-[#e7e2dc] shadow-[0_30px_80px_rgba(0,0,0,0.14)]"
                onMouseEnter={() => {
                  if (index === active) setHovering(true)
                }}
                onMouseLeave={() => setHovering(false)}
                onClick={() => {
                  if (Math.abs(index - focus.current) > 0.45) scrollToIndex(index)
                  else setOpenId(piece.id)
                }}
              >
                <img src={piece.image} alt="" className="size-full object-cover" draggable={false} />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-5 pt-16 pb-5 text-left text-white" style={{ fontFamily: serif }}>
                  <span className="block text-[10px] tracking-[0.22em] text-white/75">{piece.index}</span>
                  <span className="mt-1 block text-3xl">{piece.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          aria-label="上一件"
          className="absolute top-1/2 left-5 z-30 hidden size-8 -translate-y-1/2 text-xl text-black/45 sm:block"
          onClick={() => scrollToIndex(active - 1)}
        >
          +
        </button>
        <button
          type="button"
          aria-label="下一件"
          className="absolute top-1/2 right-5 z-30 hidden size-8 -translate-y-1/2 text-xl text-black/45 sm:block"
          onClick={() => scrollToIndex(active + 1)}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setOpenId(current.id)}
          className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] tracking-[0.32em] text-black/70"
        >
          <span className="block size-2.5 rotate-45 border border-black/70" />
          {hovering && progress > 0.02 ? '探索' : '发现'}
        </button>
        {opened ? <PieceDetail piece={opened} onClose={() => setOpenId(null)} /> : null}
      </div>
    </div>
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
      <main className="mx-auto grid max-w-5xl gap-8 px-5 py-16 sm:grid-cols-2">
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
