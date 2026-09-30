import { useEffect, useRef, useState, type CSSProperties } from 'react'
import SiteHeader from '@/src/components/SiteHeader'
import { profile } from '@/src/content'

const SEGMENT = 1100
const BASE = 420
const HALL_W = 1480
const HALL_H = 860
const HALL_COUNT = 7

type Side = 'left' | 'right'
type Pose = 'wave' | 'walk' | 'point'

type Ability = {
  id: string
  title: string
  item: string
  side: Side
  body: string
}

type Beat = {
  at: number
  travel: number
  pose: Pose
  stop: string | null
}

const abilities: Ability[] = [
  {
    id: 'language',
    title: '语言和工程',
    item: '笔记本',
    side: 'left',
    body: '这一组放语言和工程方面的能力。具体条目之后写在这里。',
  },
  {
    id: 'tools',
    title: '工具',
    item: '工具盒',
    side: 'right',
    body: '这一组放会用的工具。具体条目之后写在这里。',
  },
  {
    id: 'direction',
    title: '方向',
    item: '路牌',
    side: 'left',
    body: '这一组放正在靠近的方向。具体内容之后写在这里。',
  },
]

const beats: Beat[] = [
  { at: 0, travel: 0, pose: 'wave', stop: null },
  { at: 0.1, travel: 80, pose: 'wave', stop: null },
  { at: 0.26, travel: 1400, pose: 'walk', stop: null },
  { at: 0.4, travel: 1480, pose: 'point', stop: 'language' },
  { at: 0.54, travel: 2800, pose: 'walk', stop: null },
  { at: 0.66, travel: 2880, pose: 'point', stop: 'tools' },
  { at: 0.8, travel: 4200, pose: 'walk', stop: null },
  { at: 0.9, travel: 4280, pose: 'point', stop: 'direction' },
  { at: 1, travel: 5400, pose: 'wave', stop: null },
]

const face: CSSProperties = {
  position: 'absolute',
  backfaceVisibility: 'hidden',
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function sampleScene(progress: number) {
  const p = Math.min(1, Math.max(0, progress))
  for (let index = 0; index < beats.length - 1; index += 1) {
    const from = beats[index]
    const to = beats[index + 1]
    const last = index === beats.length - 2
    if (p <= to.at || last) {
      const span = to.at - from.at || 1
      const t = Math.min(1, Math.max(0, (p - from.at) / span))
      const travel = from.travel + (to.travel - from.travel) * t
      const moving = Math.abs(to.travel - from.travel) > 220 && t < 0.9
      return {
        travel,
        pose: moving ? 'walk' : to.pose,
        stop: !moving ? to.stop : null,
      }
    }
  }
  const end = beats[beats.length - 1]
  return { travel: end.travel, pose: end.pose, stop: end.stop }
}

function cueFor(pose: Pose, stop: Ability | null, progress: number) {
  if (pose === 'point' && stop) return `他停下来，指向${stop.item}。点开它，看这一段能力。`
  if (pose === 'walk') return '跟着他往前走。移动鼠标，可以看向两侧。'
  if (progress > 0.92) return '走到尽头了。'
  return '他在前面挥手。向下滚动，跟着他往前走。'
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
  const [scene, setScene] = useState(() => sampleScene(0))
  const [progress, setProgress] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)

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
      aim.yaw += (-nx * 22 - aim.yaw) * 0.08
      aim.pitch += (ny * 6 - aim.pitch) * 0.08
      aim.strafe += (nx * 48 - aim.strafe) * 0.08
      aim.lift += (ny * 12 - aim.lift) * 0.08
      const next = sampleScene(progressRef.current)
      rig.style.transform = `translate3d(${aim.strafe}px, ${aim.lift}px, 0) rotateX(${-aim.pitch}deg) rotateY(${aim.yaw}deg) translateZ(${next.travel}px)`
    }

    const tick = () => {
      paint()
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)

    const onScroll = () => {
      const nextProgress = readProgress()
      progressRef.current = nextProgress
      const next = sampleScene(nextProgress)
      setProgress((current) => (Math.abs(current - nextProgress) < 0.004 ? current : nextProgress))
      setScene((current) =>
        current.pose === next.pose && current.stop === next.stop ? current : next,
      )
      setOpenId((current) => (current && current !== next.stop ? null : current))
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

  const active = abilities.find((ability) => ability.id === scene.stop) ?? null
  const opened = abilities.find((ability) => ability.id === openId) ?? null

  return (
    <div ref={rootRef} style={{ height: '820vh' }}>
      <div ref={stageRef} className="sticky top-0 h-dvh overflow-hidden bg-[#140e0b] text-white">
        <div className="absolute inset-0" style={{ perspective: '680px', perspectiveOrigin: '50% 46%' }}>
          <div ref={rigRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {Array.from({ length: HALL_COUNT }, (_, index) => (
              <HallSegment key={index} index={index} end={index === HALL_COUNT - 1} />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(8,5,3,0.5)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/55 to-transparent" />
        <Guide pose={scene.pose} side={active?.side ?? 'right'} />
        {active ? <ItemButton ability={active} onOpen={() => setOpenId(active.id)} /> : null}
        {opened ? <AbilityCard ability={opened} onClose={() => setOpenId(null)} /> : null}
        <SiteHeader overlay />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-4 pb-5 text-center">
          <p className="text-sm text-white/90">{active ? active.title : progress > 0.92 ? '尽头' : '跟着他走'}</p>
          <div className="mx-auto mt-2 h-1 w-36 overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-[#e6b15c]" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/75">{cueFor(scene.pose, active, progress)}</p>
        </div>
      </div>
    </div>
  )
}

function Guide({ pose, side }: { pose: Pose; side: Side }) {
  const poseClass = pose === 'walk' ? 'guide-walk' : pose === 'wave' ? 'guide-wave' : 'guide-point'
  return (
    <div className={`guide ${poseClass} ${side === 'left' ? 'point-left' : 'point-right'}`} aria-hidden="true">
      <div className="guide-bob">
        <img className="guide-head" src="/photos/home-skills.jpg" alt="" draggable={false} />
        <div className="guide-torso" />
        <div className="guide-arm left" />
        <div className="guide-arm right" />
        <div className="guide-leg left" />
        <div className="guide-leg right" />
      </div>
    </div>
  )
}

function ItemButton({ ability, onOpen }: { ability: Ability; onOpen: () => void }) {
  const place = ability.side === 'left' ? 'left-[7%] sm:left-[16%]' : 'right-[7%] sm:right-[16%]'
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`absolute bottom-[24%] z-30 flex w-28 flex-col items-center gap-2 rounded-2xl border border-[#e6b15c]/70 bg-[#1c140f]/80 px-3 py-3 text-white backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b15c] ${place}`}
      style={{ animation: 'guide-item-pulse 1.6s ease-in-out infinite' }}
    >
      <ItemGlyph id={ability.id} />
      <span className="text-xs leading-4">点开{ability.item}</span>
    </button>
  )
}

function ItemGlyph({ id }: { id: string }) {
  if (id === 'tools') {
    return <span className="block h-10 w-12 rounded-md border-2 border-[#e6b15c] bg-[#8a5a38]" />
  }
  if (id === 'direction') {
    return (
      <span className="relative block h-10 w-10">
        <span className="absolute top-0 left-1/2 h-10 w-1 -translate-x-1/2 bg-[#e6b15c]" />
        <span className="absolute top-1 left-1/2 h-4 w-6 -translate-x-1 rounded-sm bg-[#f3e6d2]" />
      </span>
    )
  }
  return (
    <span className="flex h-10 w-9 flex-col justify-center gap-1 rounded-sm bg-[#f3e6d2] px-1.5">
      <span className="h-0.5 bg-[#1c140f]/50" />
      <span className="h-0.5 bg-[#1c140f]/50" />
      <span className="h-0.5 w-2/3 bg-[#1c140f]/50" />
    </span>
  )
}

function AbilityCard({ ability, onClose }: { ability: Ability; onClose: () => void }) {
  return (
    <section
      role="dialog"
      aria-labelledby="ability-title"
      className="absolute top-1/2 left-1/2 z-40 w-[min(92vw,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/15 bg-[#1c140f]/90 p-5 text-white shadow-2xl backdrop-blur-md"
    >
      <p className="text-xs tracking-[0.18em] text-[#e6b15c]">{ability.item}</p>
      <h2 id="ability-title" className="mt-2 text-3xl font-semibold">
        {ability.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-white/85">{ability.body}</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-5 rounded-full bg-[#e6b15c] px-4 py-2 text-sm font-medium text-[#1b2430]"
      >
        继续跟着他走
      </button>
    </section>
  )
}

function HallSegment({ index, end }: { index: number; end: boolean }) {
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
          background: 'linear-gradient(90deg, #3a2416 0%, #8a5a38 20%, #c4845a 50%, #8a5a38 80%, #3a2416 100%)',
        }}
      >
        <div style={{ position: 'absolute', left: '36%', width: '28%', top: 0, bottom: 0, background: 'rgba(232, 196, 150, 0.16)' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(to bottom, transparent 0 70px, rgba(0,0,0,0.22) 70px 74px)',
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
        <WallWindow />
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
        {end ? null : <WallWindow />}
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
      {end ? (
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
            <p className="text-xs tracking-[0.22em] text-[#e6b15c]">尽头</p>
            <h2 className="mt-3 text-4xl font-semibold">{profile.name}</h2>
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
        background: 'linear-gradient(160deg, rgba(186,214,224,0.55), rgba(92,122,138,0.35) 46%, rgba(40,24,16,0.15))',
        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.25), inset 0 0 28px rgba(40,70,90,0.35)',
      }}
    >
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 8, transform: 'translateX(-50%)', background: '#5c4030' }} />
      <div style={{ position: 'absolute', top: '46%', left: 0, right: 0, height: 8, background: '#5c4030' }} />
    </div>
  )
}

function SkillsReading() {
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <div className="min-h-dvh bg-[#1a120e] text-white">
      <SiteHeader overlay />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-5 pt-40 pb-16">
        <p className="text-xs tracking-[0.22em] text-[#e6b15c]">个人能力</p>
        <img
          src="/photos/home-skills.jpg"
          alt="个人能力"
          className="aspect-[4/3] w-full max-w-md rounded-3xl object-cover"
          style={{ objectPosition: '70% 42%' }}
        />
        {abilities.map((ability) => {
          const open = openId === ability.id
          return (
            <section key={ability.id}>
              <button type="button" className="text-left text-3xl font-semibold" aria-expanded={open} onClick={() => setOpenId(open ? null : ability.id)}>
                {ability.title}
              </button>
              {open ? <p className="mt-2 max-w-xl text-sm leading-7 text-white/80">{ability.body}</p> : null}
            </section>
          )
        })}
        <section>
          <h2 className="text-4xl font-semibold">{profile.name}</h2>
          <a href={profile.github} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-white/75 underline underline-offset-4">
            github.com/{profile.githubHandle}
          </a>
        </section>
      </main>
    </div>
  )
}
