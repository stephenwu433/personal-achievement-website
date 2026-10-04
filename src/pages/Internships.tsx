import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SiteHeader from '@/src/components/SiteHeader'

gsap.registerPlugin(useGSAP)

type Place = {
  id: string
  name: string
  image: string
}

const places: Place[] = [
  { id: 'dongpeng', name: '东鹏控股股份有限公司', image: '/internships/dongpeng.png' },
  { id: 'zhijunzhu', name: '知君竹科技传媒', image: '/internships/zhijunzhu.png' },
  { id: 'huigu', name: '慧谷科技', image: '/internships/huigu.png' },
  { id: 'gaodun', name: '高顿', image: '/internships/gaodun.png' },
]

const serif = '"Iowan Old Style", Palatino, "Songti SC", "Noto Serif SC", serif'

type Motion = {
  index: number
  lean: number
  intro: number
  spin: number
  tiltX: number
  tiltY: number
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Internships() {
  const rootRef = useRef<HTMLDivElement>(null)
  const discRefs = useRef<Array<HTMLButtonElement | null>>([])
  const motion = useRef<Motion>({ index: 0, lean: 0, intro: 0, spin: 0, tiltX: 0, tiltY: 0 })
  const lock = useRef(false)
  const drag = useRef<{ x: number; spin: number; moved: boolean; pointerId: number; target: HTMLDivElement } | null>(null)
  const [active, setActive] = useState(0)
  const [chrome, setChrome] = useState(false)
  const [open, setOpen] = useState(false)
  const [reduced] = useState(prefersReducedMotion)
  const openRef = useRef(false)
  openRef.current = open

  const syncActive = (index: number) => {
    const next = Math.min(places.length - 1, Math.max(0, Math.round(index)))
    setActive((current) => (current === next ? current : next))
  }

  useGSAP(
    () => {
      if (reduced) return
      const state = motion.current
      const intro = gsap.to(state, {
        intro: 1,
        duration: 1.25,
        delay: 0.35,
        ease: 'power3.inOut',
        onUpdate: () => {
          paintDiscs(discRefs.current, state)
          if (state.intro > 0.72) setChrome(true)
        },
        onComplete: () => setChrome(true),
      })
      const onWheel = (event: WheelEvent) => {
        if (openRef.current || state.intro < 0.98) return
        if (Math.abs(event.deltaY) < 12) return
        event.preventDefault()
        step(event.deltaY > 0 ? 1 : -1)
      }
      window.addEventListener('wheel', onWheel, { passive: false })
      paintDiscs(discRefs.current, state)
      return () => {
        intro.kill()
        window.removeEventListener('wheel', onWheel)
      }
    },
    { scope: rootRef, dependencies: [reduced] },
  )

  const step = (direction: number) => {
    const state = motion.current
    const next = Math.min(places.length - 1, Math.max(0, Math.round(state.index) + direction))
    if (lock.current || next === Math.round(state.index)) return
    lock.current = true
    gsap.to(state, {
      index: next,
      duration: 0.62,
      ease: 'power3.inOut',
      onUpdate: () => {
        paintDiscs(discRefs.current, state)
        syncActive(state.index)
      },
      onComplete: () => {
        lock.current = false
      },
    })
    gsap.fromTo(
      state,
      { lean: direction * 18 },
      {
        lean: 0,
        duration: 0.78,
        ease: 'power3.out',
        onUpdate: () => paintDiscs(discRefs.current, state),
      },
    )
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || open || motion.current.intro < 0.98) return
    drag.current = { x: event.clientX, spin: motion.current.spin, moved: false, pointerId: event.pointerId, target: event.currentTarget }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    motion.current.tiltX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8
    motion.current.tiltY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10
    if (drag.current) {
      const delta = event.clientX - drag.current.x
      if (Math.abs(delta) > 6) {
        drag.current.moved = true
        drag.current.target.setPointerCapture(drag.current.pointerId)
        motion.current.spin = drag.current.spin + delta * 0.35
      }
    }
    paintDiscs(discRefs.current, motion.current)
  }

  const onPointerUp = () => {
    const moved = drag.current?.moved
    drag.current = null
    if (moved) {
      gsap.to(motion.current, {
        spin: 0,
        duration: 1.1,
        ease: 'power3.out',
        onUpdate: () => paintDiscs(discRefs.current, motion.current),
      })
    }
  }

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const current = places[active]

  if (reduced) {
    return (
      <div className="min-h-dvh bg-[#f4f1ea] text-[#1a1a1a]">
        <SiteHeader />
        <main className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-2">
          {places.map((place) => (
            <article key={place.id}>
              <img src={place.image} alt="" className="aspect-square w-full rounded-full object-cover" />
              <h2 className="mt-4 text-3xl" style={{ fontFamily: serif }}>
                {place.name}
              </h2>
            </article>
          ))}
        </main>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="h-dvh overflow-hidden bg-[#f4f1ea] text-[#1a1a1a]">
      <div
        className="relative h-dvh"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <SiteHeader overlay />
        <div
          className="pointer-events-none absolute top-[15vh] left-[6vw] z-10 w-[min(36vw,460px)]"
          style={{ opacity: chrome ? 1 : 0, transition: 'opacity 0.6s ease' }}
        >
          <div className="overflow-hidden">
            <h1
              key={current.id}
              className="text-[clamp(32px,4vw,64px)] leading-[1.05]"
              style={{ fontFamily: serif, animation: 'projects-line-in 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both' }}
            >
              {current.name}
            </h1>
          </div>
          <div className="mt-6 border-t border-black/15">
            <Credit label="岗位" />
            <Credit label="时间" />
          </div>
        </div>
        <div className="absolute inset-0" style={{ perspective: '1100px' }}>
          {places.map((place, index) => (
            <button
              key={place.id}
              type="button"
              ref={(node) => {
                discRefs.current[index] = node
              }}
              className="absolute top-[58%] left-1/2 size-[min(38vh,380px)] overflow-hidden rounded-full border border-black/10 bg-[#ebe6dc] shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
              style={{ opacity: 0 }}
              onClick={() => {
                if (drag.current?.moved || motion.current.intro < 0.98) return
                if (Math.round(motion.current.index) !== index) {
                  step(index > motion.current.index ? 1 : -1)
                  return
                }
                setOpen(true)
              }}
            >
              <img src={place.image} alt="" className="size-full object-cover" draggable={false} />
              <span className="pointer-events-none absolute top-1/2 left-1/2 size-[15%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f4f1ea] shadow-[inset_0_0_0_5px_rgba(255,255,255,0.85)]" />
            </button>
          ))}
        </div>
        <p
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs tracking-[0.22em] text-black/45"
          style={{ fontFamily: serif, opacity: chrome ? 1 : 0 }}
        >
          {String(active + 1).padStart(2, '0')} / {String(places.length).padStart(2, '0')}
        </p>
      </div>
      {open ? <InternshipDetail place={current} onClose={() => setOpen(false)} /> : null}
    </div>
  )
}

function Credit({ label }: { label: string }) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-baseline gap-4 border-b border-black/15 py-3">
      <p className="text-[11px] tracking-[0.16em] text-black/45">{label}</p>
      <p className="text-right text-sm text-black/35" style={{ fontFamily: serif }}>
        待填
      </p>
    </div>
  )
}

function InternshipDetail({ place, onClose }: { place: Place; onClose: () => void }) {
  const imageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!imageRef.current) return
    gsap.fromTo(imageRef.current, { yPercent: 70, opacity: 0.4 }, { yPercent: 0, opacity: 1, duration: 1.05, ease: 'power3.out' })
  })

  return (
    <div className="fixed inset-0 z-[80] overflow-hidden bg-[#f4f1ea] text-[#1a1a1a]">
      <button type="button" onClick={onClose} className="absolute top-6 left-6 z-10 text-sm tracking-[0.16em] underline underline-offset-4">
        返回
      </button>
      <div className="mx-auto max-w-3xl px-6 pt-[16vh] text-center">
        <h2 className="text-[clamp(36px,5vw,72px)] leading-none" style={{ fontFamily: serif }}>
          {place.name}
        </h2>
        <div className="mx-auto mt-8 max-w-xl border-t border-black/20 text-left">
          <Credit label="岗位" />
          <Credit label="时间" />
        </div>
      </div>
      <div ref={imageRef} className="absolute inset-x-0 bottom-0 flex justify-center">
        <img src={place.image} alt="" className="size-[min(46vh,460px)] rounded-full object-cover" />
      </div>
    </div>
  )
}

function paintDiscs(discs: Array<HTMLButtonElement | null>, state: Motion) {
  const width = window.innerWidth
  const spacing = Math.min(width * 0.34, 460)
  discs.forEach((disc, index) => {
    if (!disc) return
    const delta = index - state.index
    const distance = Math.abs(delta)
    const opened = state.intro
    const x = delta * spacing * opened + width * 0.1 * opened
    const scale = distance < 0.45 ? 1 : 0.78
    const opacity = index === 0 || opened > 0.45 ? (distance > 1.15 ? 0 : 1) : 0
    const face = (1 - opened) * 86
    const restY = opened * (index === Math.round(state.index) ? -18 : -10)
    const spin = index === Math.round(state.index) ? state.spin + state.lean : state.lean * 0.35
    disc.style.opacity = String(opacity)
    disc.style.zIndex = String(30 - Math.round(distance * 10))
    disc.style.transform = `translate3d(calc(-50% + ${x}px), -50%, 0) rotateX(${restY + state.tiltX}deg) rotateY(${face + state.tiltY * (index === Math.round(state.index) ? 1 : 0.4)}deg) rotateZ(${spin}deg) scale(${scale})`
  })
}
