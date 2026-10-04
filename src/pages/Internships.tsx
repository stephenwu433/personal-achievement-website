import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SiteHeader from '@/src/components/SiteHeader'

gsap.registerPlugin(ScrollTrigger, useGSAP)

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

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Internships() {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const discRefs = useRef<Array<HTMLDivElement | null>>([])
  const progress = useRef(0)
  const tilt = useRef({ x: 0, y: 0 })
  const [active, setActive] = useState(0)
  const [reduced] = useState(prefersReducedMotion)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || reduced) return
      const playhead = { value: 0 }
      const tween = gsap.to(playhead, {
        value: places.length - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.65,
        },
        onUpdate: () => {
          progress.current = playhead.value
          paintDiscs(discRefs.current, playhead.value, tilt.current)
          const next = Math.min(places.length - 1, Math.max(0, Math.round(playhead.value)))
          setActive((current) => (current === next ? current : next))
        },
      })
      paintDiscs(discRefs.current, 0, tilt.current)
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
    { scope: rootRef, dependencies: [reduced] },
  )

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return
    const bounds = event.currentTarget.getBoundingClientRect()
    tilt.current = {
      x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -10,
      y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 14,
    }
    paintDiscs(discRefs.current, progress.current, tilt.current)
  }

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
    <div ref={rootRef} className="bg-[#f4f1ea] text-[#1a1a1a]" style={{ height: `${places.length * 100}vh` }}>
      <div
        className="sticky top-0 h-dvh overflow-hidden"
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          tilt.current = { x: 0, y: 0 }
          paintDiscs(discRefs.current, progress.current, tilt.current)
        }}
      >
        <SiteHeader overlay />
        <div className="pointer-events-none absolute top-[16vh] left-[6vw] z-10 w-[min(34vw,420px)]">
          <div className="overflow-hidden">
            <h1
              key={current.id}
              className="text-[clamp(32px,4.2vw,68px)] leading-[1.05] font-normal"
              style={{ fontFamily: serif, animation: 'projects-line-in 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both' }}
            >
              {current.name}
            </h1>
          </div>
          <div className="mt-6 border-t border-black/20">
            <Credit label="岗位" />
            <Credit label="时间" />
          </div>
        </div>
        <div ref={stageRef} className="absolute inset-0" style={{ perspective: '1200px' }}>
          {places.map((place, index) => (
            <div
              key={place.id}
              ref={(node) => {
                discRefs.current[index] = node
              }}
              className="absolute top-[58%] left-1/2 size-[min(36vh,340px)] overflow-hidden rounded-full bg-[#e7e1d6] will-change-transform"
            >
              <img src={place.image} alt="" className="size-full object-cover" draggable={false} />
            </div>
          ))}
        </div>
        <p
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.22em] text-black/45"
          style={{ fontFamily: serif }}
        >
          {String(active + 1).padStart(2, '0')} / {String(places.length).padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}

function Credit({ label }: { label: string }) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-baseline gap-4 border-b border-black/20 py-3">
      <p className="text-[11px] tracking-[0.16em] text-black/45">{label}</p>
      <p className="text-right text-sm text-black/35" style={{ fontFamily: serif }}>
        待填
      </p>
    </div>
  )
}

function paintDiscs(discs: Array<HTMLDivElement | null>, value: number, tilt: { x: number; y: number }) {
  discs.forEach((disc, index) => {
    if (!disc) return
    const delta = index - value
    const distance = Math.abs(delta)
    const x = delta * Math.min(window.innerWidth * 0.28, 400) + window.innerWidth * 0.12
    const scale = Math.max(0.55, 1 - distance * 0.38)
    const opacity = distance > 1.35 ? 0 : Math.max(0, 1 - distance * 0.45)
    const spin = delta * -16
    disc.style.opacity = String(opacity)
    disc.style.zIndex = String(20 - Math.round(distance))
    disc.style.transform = `translate3d(calc(-50% + ${x}px), -50%, 0) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotate(${spin}deg) scale(${scale})`
  })
}
