import { useEffect, useRef, useState, type CSSProperties } from 'react'
import SiteHeader from '@/src/components/SiteHeader'
import { profile } from '@/src/content'

const SEGMENT = 1100
const BASE = 420
const HALL_W = 1480
const HALL_H = 860

type Side = 'left' | 'right' | 'end'

type Station = {
  id: string
  kicker: string
  title: string
  side: Side
}

const stations: Station[] = [
  { id: 'portrait', kicker: '入口', title: '个人能力', side: 'right' },
  { id: 'language', kicker: '01', title: '语言和工程', side: 'left' },
  { id: 'tools', kicker: '02', title: '工具', side: 'right' },
  { id: 'direction', kicker: '03', title: '方向', side: 'left' },
  { id: 'end', kicker: '尽头', title: profile.name, side: 'end' },
]

const face: CSSProperties = {
  position: 'absolute',
  backfaceVisibility: 'hidden',
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function stationAt(progress: number) {
  const index = Math.min(stations.length - 1, Math.max(0, Math.round(progress * (stations.length - 1))))
  return stations[index]
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
  return <SkillsCorridor />
}

function SkillsCorridor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const rigRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const pointer = useRef({ x: 0, y: 0, active: false })
  const look = useRef({ yaw: 0, pitch: 0, strafe: 0, lift: 0 })
  const frame = useRef(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const readProgress = () => {
      const root = rootRef.current
      if (!root) return 0
      const total = root.offsetHeight - window.innerHeight
      if (total <= 0) return 0
      const scrolled = Math.min(total, Math.max(0, -root.getBoundingClientRect().top))
      return scrolled / total
    }

    const paint = () => {
      const rig = rigRef.current
      const stage = stageRef.current
      if (!rig || !stage) return
      const width = stage.clientWidth || 1
      const height = stage.clientHeight || 1
      const nx = pointer.current.active ? (pointer.current.x / width) * 2 - 1 : 0
      const ny = pointer.current.active ? (pointer.current.y / height) * 2 - 1 : 0
      const aim = look.current
      aim.yaw += (-nx * 28 - aim.yaw) * 0.08
      aim.pitch += (ny * 8 - aim.pitch) * 0.08
      aim.strafe += (nx * 70 - aim.strafe) * 0.08
      aim.lift += (ny * 18 - aim.lift) * 0.08
      const travel = progressRef.current * stations.length * SEGMENT
      rig.style.transform = `translate3d(${aim.strafe}px, ${aim.lift}px, 0) rotateX(${-aim.pitch}deg) rotateY(${aim.yaw}deg) translateZ(${travel}px)`
    }

    const tick = () => {
      paint()
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)

    const onScroll = () => {
      const next = readProgress()
      progressRef.current = next
      setProgress((current) => (Math.abs(current - next) < 0.004 ? current : next))
    }
    const onPointerMove = (event: PointerEvent) => {
      const stage = stageRef.current
      if (!stage) return
      const box = stage.getBoundingClientRect()
      pointer.current = { x: event.clientX - box.left, y: event.clientY - box.top, active: true }
    }
    const onPointerLeave = () => {
      pointer.current = { ...pointer.current, active: false }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('blur', onPointerLeave)

    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('blur', onPointerLeave)
    }
  }, [])

  const station = stationAt(progress)

  return (
    <div ref={rootRef} style={{ height: `${(stations.length + 1) * 100}vh` }}>
      <div ref={stageRef} className="sticky top-0 h-dvh overflow-hidden bg-[#140e0b] text-white">
        <div
          className="absolute inset-0"
          style={{ perspective: '680px', perspectiveOrigin: '50% 48%' }}
        >
          <div ref={rigRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {stations.map((item, index) => (
              <HallSegment key={item.id} station={item} index={index} />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(8,5,3,0.45)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/55 to-transparent" />
        <SiteHeader overlay />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-4 pb-5 text-center">
          <p className="text-sm text-white/90">
            {station.kicker} {station.title}
          </p>
          <div className="mx-auto mt-2 h-1 w-36 overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-[#e6b15c]" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/70">
            向下滚动，沿走廊往前走。移动鼠标，看向两侧。
          </p>
        </div>
      </div>
    </div>
  )
}

function HallSegment({ station, index }: { station: Station; index: number }) {
  const shell: CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: HALL_W,
    height: HALL_H,
    marginLeft: -HALL_W / 2,
    marginTop: -HALL_H / 2,
    transform: `translateZ(${-(BASE + index * SEGMENT)}px)`,
    transformStyle: 'preserve-3d',
  }

  return (
    <div style={shell}>
      <div
        style={{
          ...face,
          left: 0,
          width: '100%',
          height: SEGMENT,
          bottom: 0,
          transformOrigin: 'bottom center',
          transform: 'rotateX(90deg)',
          background:
            'linear-gradient(90deg, #3a2416 0%, #8a5a38 20%, #c4845a 50%, #8a5a38 80%, #3a2416 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '36%',
            width: '28%',
            top: 0,
            bottom: 0,
            background: 'rgba(232, 196, 150, 0.16)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(to bottom, transparent 0 70px, rgba(0,0,0,0.22) 70px 74px)',
          }}
        />
      </div>
      <div
        style={{
          ...face,
          left: 0,
          width: '100%',
          height: SEGMENT,
          top: 0,
          transformOrigin: 'top center',
          transform: 'rotateX(-90deg)',
          background: 'linear-gradient(#2a2118, #4a3a2c)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '42%',
            width: 92,
            height: 16,
            transform: 'translate(-50%, -50%)',
            borderRadius: 999,
            background: '#f3d7a1',
            boxShadow: '0 0 36px 10px rgba(243,215,161,0.55)',
          }}
        />
      </div>
      <div
        style={{
          ...face,
          top: 0,
          height: '100%',
          width: SEGMENT,
          left: 0,
          transformOrigin: 'left center',
          transform: 'rotateY(90deg)',
          background: 'linear-gradient(#8a6848 0%, #f6ead8 12%, #fff6ea 62%, #a87858 62%, #5c4030 100%)',
        }}
      >
        {station.side === 'left' ? <WallCard station={station} align="near" /> : <WallWindow />}
      </div>
      <div
        style={{
          ...face,
          top: 0,
          height: '100%',
          width: SEGMENT,
          right: 0,
          transformOrigin: 'right center',
          transform: 'rotateY(-90deg)',
          background: 'linear-gradient(#8a6848 0%, #f6ead8 12%, #fff6ea 62%, #a87858 62%, #5c4030 100%)',
        }}
      >
        {station.side === 'right' ? <WallCard station={station} align="far" /> : station.side === 'end' ? null : <WallWindow />}
      </div>
      <div
        style={{
          ...face,
          inset: 0,
          border: '26px solid #241810',
          boxShadow: 'inset 0 0 0 3px rgba(230,177,92,0.35)',
          pointerEvents: 'none',
        }}
      />
      {station.side === 'end' ? (
        <div
          style={{
            ...face,
            inset: 0,
            transform: `translateZ(${-SEGMENT}px)`,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(#3a2a1c, #1a120e)',
          }}
        >
          <div className="w-[min(78%,420px)] rounded-3xl border border-white/15 bg-black/45 px-6 py-7 text-center shadow-2xl">
            <p className="text-xs tracking-[0.22em] text-[#e6b15c]">{station.kicker}</p>
            <h2 className="mt-3 text-4xl font-semibold">{station.title}</h2>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm text-white/80 underline underline-offset-4"
            >
              github.com/{profile.githubHandle}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function WallCard({ station, align }: { station: Station; align: 'near' | 'far' }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'near' ? '34%' : '30%',
        top: '46%',
        width: 340,
        transform: 'translate(-50%, -50%)',
        borderRadius: 22,
        padding: 16,
        background: 'rgba(22, 14, 10, 0.78)',
        border: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 18px 40px rgba(0,0,0,0.28)',
        color: 'white',
      }}
    >
      {station.id === 'portrait' ? (
        <img
          src="/photos/home-skills.jpg"
          alt="个人能力"
          draggable={false}
          style={{
            width: '100%',
            height: 210,
            objectFit: 'cover',
            objectPosition: '70% 42%',
            borderRadius: 16,
          }}
        />
      ) : null}
      <p className="mt-3 text-xs tracking-[0.2em] text-[#e6b15c]">{station.kicker}</p>
      <p className="mt-1 text-3xl font-semibold leading-tight">{station.title}</p>
    </div>
  )
}

function WallWindow() {
  return (
    <div
      style={{
        position: 'absolute',
        left: '62%',
        top: '38%',
        width: 150,
        height: 200,
        transform: 'translate(-50%, -50%)',
        borderRadius: 8,
        border: '10px solid #5c4030',
        background:
          'linear-gradient(160deg, rgba(186,214,224,0.55), rgba(92,122,138,0.35) 46%, rgba(40,24,16,0.15))',
        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.25), inset 0 0 28px rgba(40,70,90,0.35)',
      }}
    >
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 8, transform: 'translateX(-50%)', background: '#5c4030' }} />
      <div style={{ position: 'absolute', top: '46%', left: 0, right: 0, height: 8, background: '#5c4030' }} />
    </div>
  )
}

function SkillsReading() {
  return (
    <div className="min-h-dvh bg-[#1a120e] text-white">
      <SiteHeader overlay />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-5 pt-40 pb-16">
        <p className="text-xs tracking-[0.22em] text-[#e6b15c]">个人能力</p>
        <img
          src="/photos/home-skills.jpg"
          alt="个人能力"
          className="aspect-[4/3] w-full max-w-md rounded-3xl object-cover"
          style={{ objectPosition: '70% 42%' }}
        />
        {stations
          .filter((station) => station.side !== 'end' && station.id !== 'portrait')
          .map((station) => (
            <section key={station.id}>
              <h2 className="text-3xl font-semibold">{station.title}</h2>
            </section>
          ))}
        <section>
          <h2 className="text-4xl font-semibold">{profile.name}</h2>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm text-white/75 underline underline-offset-4"
          >
            github.com/{profile.githubHandle}
          </a>
        </section>
      </main>
    </div>
  )
}
