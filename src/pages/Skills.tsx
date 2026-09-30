import { useEffect, useRef, useState } from 'react'
import SiteHeader from '@/src/components/SiteHeader'
import { profile } from '@/src/content'

type Piece = {
  id: string
  index: string
  title: string
  image: string
  body: string
}

const pieces: Piece[] = [
  {
    id: 'language',
    index: '01',
    title: '语言和工程',
    image: '/photos/home-skills.jpg',
    body: '这一组放语言和工程方面的能力。具体条目之后写在这里。',
  },
  {
    id: 'tools',
    index: '02',
    title: '工具',
    image: '/photos/home-projects.jpg',
    body: '这一组放会用的工具。具体条目之后写在这里。',
  },
  {
    id: 'direction',
    index: '03',
    title: '方向',
    image: '/photos/home-about.jpg',
    body: '这一组放正在靠近的方向。具体内容之后写在这里。',
  },
]

const serif = '"Iowan Old Style", Palatino, "Palatino Linotype", "Songti SC", "Noto Serif SC", serif'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Skills() {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  if (reduced) return <SkillsReading />
  return <SkillsGallery />
}

function SkillsGallery() {
  const rootRef = useRef<HTMLDivElement>(null)
  const focus = useRef(0)
  const target = useRef(0)
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
      target.current = nextTarget
      focus.current += (nextTarget - focus.current) * 0.08
      look.current.x += (pointer.current.x - look.current.x) * 0.06
      look.current.y += (pointer.current.y - look.current.y) * 0.06
      const focusNow = focus.current
      slideRefs.current.forEach((slide, index) => {
        if (!slide) return
        const delta = index - focusNow
        const x = delta * 58 + look.current.x * 1.4
        const z = -Math.abs(delta) * 220
        const rot = delta * -14 + look.current.x * -1.5
        const lift = look.current.y * -8
        slide.style.transform = `translate3d(${x}vw, ${lift}px, ${z}px) rotateY(${rot}deg)`
        slide.style.opacity = String(Math.max(0.28, 1 - Math.abs(delta) * 0.42))
        slide.style.zIndex = String(20 - Math.round(Math.abs(delta) * 5))
      })
      const nearest = Math.min(pieces.length - 1, Math.max(0, Math.round(focusNow)))
      setActive((current) => (current === nearest ? current : nearest))
      setProgress((current) => (Math.abs(current - nextTarget / (pieces.length - 1)) < 0.004 ? current : nextTarget / (pieces.length - 1)))
      frame.current = requestAnimationFrame(paint)
    }

    frame.current = requestAnimationFrame(paint)
    const onPointerMove = (event: PointerEvent) => {
      pointer.current = {
        x: event.clientX / window.innerWidth * 2 - 1,
        y: event.clientY / window.innerHeight * 2 - 1,
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
    const top = root.offsetTop + (total * next) / (pieces.length - 1)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const opened = pieces.find((piece) => piece.id === openId) ?? null
  const current = pieces[active]
  const intro = progress < 0.08

  return (
    <div ref={rootRef} className="bg-[#f7f5f2] text-[#1a1a1a]" style={{ height: `${(pieces.length + 1) * 100}vh` }}>
      <div className="sticky top-0 h-dvh overflow-hidden">
        <SiteHeader />
        <p className="pointer-events-none absolute top-28 right-6 z-20 text-xs tracking-[0.22em] text-black/45" style={{ fontFamily: serif }}>
          {current.index} / {pieces[pieces.length - 1].index}
        </p>
        <div
          className="pointer-events-none absolute inset-x-0 top-[38%] z-20 text-center transition-opacity duration-700"
          style={{ opacity: intro ? 1 : 0, fontFamily: serif }}
        >
          <p className="text-5xl font-normal tracking-tight sm:text-7xl">{profile.name}</p>
          <p className="mt-3 text-sm tracking-[0.28em] text-black/55">个人能力</p>
        </div>
        <div className="absolute inset-0" style={{ perspective: '1400px', perspectiveOrigin: '50% 58%' }}>
          <div
            className="absolute top-[18%] left-1/2 h-[58vh] w-[min(68vw,760px)]"
            style={{ marginLeft: 'calc(min(68vw, 760px) / -2)', transformStyle: 'preserve-3d' }}
          >
            {pieces.map((piece, index) => (
              <button
                key={piece.id}
                ref={(node) => {
                  slideRefs.current[index] = node
                }}
                type="button"
                aria-label={`${piece.title}，探索`}
                className="absolute top-0 left-0 h-full w-full overflow-hidden bg-[#e7e2dc] shadow-[0_30px_80px_rgba(0,0,0,0.12)]"
                style={{ transformStyle: 'preserve-3d' }}
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
                <span className="absolute bottom-4 left-4 text-left text-white" style={{ fontFamily: serif }}>
                  <span className="block text-[10px] tracking-[0.22em] text-white/80">{piece.index}</span>
                  <span className="mt-1 block text-2xl">{piece.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          aria-label="上一件"
          className="absolute top-1/2 left-5 z-20 hidden size-8 -translate-y-1/2 text-xl text-black/50 sm:block"
          onClick={() => scrollToIndex(active - 1)}
        >
          +
        </button>
        <button
          type="button"
          aria-label="下一件"
          className="absolute top-1/2 right-5 z-20 hidden size-8 -translate-y-1/2 text-xl text-black/50 sm:block"
          onClick={() => scrollToIndex(active + 1)}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setOpenId(current.id)}
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] tracking-[0.32em] text-black/70"
        >
          <span className="block size-2.5 rotate-45 border border-black/70" />
          {hovering ? '探索' : '发现'}
        </button>
        {opened ? <PieceDetail piece={opened} onClose={() => setOpenId(null)} /> : null}
      </div>
    </div>
  )
}

function PieceDetail({ piece, onClose }: { piece: Piece; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-[#f7f5f2]">
      <div className="mx-auto grid min-h-dvh max-w-6xl items-center gap-8 px-5 py-24 md:grid-cols-[1.2fr_0.8fr]">
        <img src={piece.image} alt="" className="aspect-[4/3] w-full object-cover" />
        <div style={{ fontFamily: serif }}>
          <p className="text-xs tracking-[0.22em] text-black/45">{piece.index}</p>
          <h2 className="mt-3 text-5xl">{piece.title}</h2>
          <p className="mt-6 max-w-md text-base leading-8 text-black/75">{piece.body}</p>
          <button type="button" onClick={onClose} className="mt-8 text-sm tracking-[0.18em] underline underline-offset-4">
            返回
          </button>
        </div>
      </div>
    </div>
  )
}

function SkillsReading() {
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <div className="min-h-dvh bg-[#f7f5f2] text-[#1a1a1a]">
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-5 py-16" style={{ fontFamily: serif }}>
        <p className="text-xs tracking-[0.22em] text-black/45">个人能力</p>
        <h1 className="text-5xl">{profile.name}</h1>
        {pieces.map((piece) => {
          const open = openId === piece.id
          return (
            <section key={piece.id} className="border-t border-black/10 pt-6">
              <button type="button" className="text-left text-3xl" aria-expanded={open} onClick={() => setOpenId(open ? null : piece.id)}>
                {piece.index} {piece.title}
              </button>
              {open ? (
                <div className="mt-4">
                  <img src={piece.image} alt="" className="mb-4 aspect-[4/3] w-full max-w-md object-cover" />
                  <p className="max-w-xl text-sm leading-7 text-black/75">{piece.body}</p>
                </div>
              ) : null}
            </section>
          )
        })}
      </main>
    </div>
  )
}
