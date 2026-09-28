import { useEffect, useRef, useState } from 'react'
import SiteHeader from '@/src/components/SiteHeader'
import { profile } from '@/src/content'

type Ability = {
  id: string
  label: string
  angle: number
}

type Pose = {
  x: number
  y: number
  fromX: number
  fromY: number
  opacity: number
}

const abilities: Ability[] = [
  { id: 'language', label: '语言和工程', angle: 158 },
  { id: 'tools', label: '工具', angle: -28 },
  { id: 'direction', label: '方向', angle: 212 },
]

const hiddenPose: Pose = { x: 0, y: 0, fromX: 0, fromY: 0, opacity: 0 }

function angleDifference(a: number, b: number) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b))
}

export default function Skills() {
  const stageRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLImageElement>(null)
  const pointer = useRef({ x: 0, y: 0, active: false })
  const drag = useRef<{ id: string; x: number; y: number } | null>(null)
  const reduced = useRef(false)
  const posesRef = useRef<Record<string, Pose>>({})
  const tiltRef = useRef({ x: 0, y: 0, lightX: 50, lightY: 40 })
  const frame = useRef(0)
  const [poses, setPoses] = useState<Record<string, Pose>>(() =>
    Object.fromEntries(abilities.map((ability) => [ability.id, hiddenPose])),
  )
  const [tilt, setTilt] = useState({ x: 0, y: 0, lightX: 50, lightY: 40 })

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      reduced.current = media.matches
    }
    sync()
    media.addEventListener('change', sync)

    let running = false

    const tick = () => {
      const stage = stageRef.current
      const photo = photoRef.current
      if (!stage || !photo) {
        running = false
        return
      }

      const stageBox = stage.getBoundingClientRect()
      const photoBox = photo.getBoundingClientRect()
      const originX = photoBox.left + photoBox.width / 2 - stageBox.left
      const originY = photoBox.top + photoBox.height / 2 - stageBox.top
      const pointerX = pointer.current.x - stageBox.left
      const pointerY = pointer.current.y - stageBox.top
      const pointerAngle = Math.atan2(pointerY - originY, pointerX - originX)
      const pointerDistance = Math.hypot(pointerX - originX, pointerY - originY)
      const spread = pointer.current.active
        ? Math.min(1, Math.max(0, (pointerDistance - photoBox.width * 0.28) / 260))
        : 0

      const px = (pointerX - originX) / photoBox.width
      const py = (pointerY - originY) / photoBox.height
      const clampedX = Math.max(-0.55, Math.min(0.55, px))
      const clampedY = Math.max(-0.55, Math.min(0.55, py))
      const targetTiltX = pointer.current.active && !reduced.current ? clampedY * -16 : 0
      const targetTiltY = pointer.current.active && !reduced.current ? clampedX * 20 : 0
      const targetLightX = pointer.current.active && !reduced.current ? (clampedX + 0.55) / 1.1 * 100 : 50
      const targetLightY = pointer.current.active && !reduced.current ? (clampedY + 0.55) / 1.1 * 100 : 40
      const tiltNow = tiltRef.current
      tiltNow.x += (targetTiltX - tiltNow.x) * 0.16
      tiltNow.y += (targetTiltY - tiltNow.y) * 0.16
      tiltNow.lightX += (targetLightX - tiltNow.lightX) * 0.16
      tiltNow.lightY += (targetLightY - tiltNow.lightY) * 0.16

      const next: Record<string, Pose> = {}
      let moving =
        Boolean(drag.current) ||
        Math.abs(tiltNow.x - targetTiltX) > 0.08 ||
        Math.abs(tiltNow.y - targetTiltY) > 0.08

      for (const ability of abilities) {
        const radians = (ability.angle * Math.PI) / 180
        const align = pointer.current.active
          ? Math.max(0, Math.cos(angleDifference(pointerAngle, radians)))
          : 0
        const reach = reduced.current ? 92 : 28 + spread * (110 + align * align * 170)
        let x = originX + Math.cos(radians) * (photoBox.width * 0.46 + reach)
        let y = originY + Math.sin(radians) * (photoBox.height * 0.46 + reach)
        if (drag.current?.id === ability.id) {
          x = drag.current.x - stageBox.left
          y = drag.current.y - stageBox.top
        }
        const halfWidth = 28 + ability.label.length * 15
        x = Math.min(stageBox.width - halfWidth, Math.max(halfWidth, x))
        y = Math.min(stageBox.height - 28, Math.max(120, y))
        const opacity = reduced.current ? 1 : Math.min(1, Math.max(0, (reach - 36) / 48))
        const previous = posesRef.current[ability.id] ?? {
          x: originX,
          y: originY,
          fromX: originX,
          fromY: originY,
          opacity: 0,
        }
        const pose = {
          x: previous.x + (x - previous.x) * 0.16,
          y: previous.y + (y - previous.y) * 0.16,
          fromX: originX + Math.cos(radians) * photoBox.width * 0.42,
          fromY: originY + Math.sin(radians) * photoBox.height * 0.42,
          opacity: previous.opacity + (opacity - previous.opacity) * 0.16,
        }
        if (Math.hypot(pose.x - x, pose.y - y) > 0.6 || Math.abs(pose.opacity - opacity) > 0.02) {
          moving = true
        }
        next[ability.id] = pose
      }

      posesRef.current = next
      setPoses(next)
      setTilt({ x: tiltNow.x, y: tiltNow.y, lightX: tiltNow.lightX, lightY: tiltNow.lightY })
      if (moving) frame.current = requestAnimationFrame(tick)
      else running = false
    }

    const wake = () => {
      if (running) return
      running = true
      frame.current = requestAnimationFrame(tick)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (drag.current) {
        drag.current = { ...drag.current, x: event.clientX, y: event.clientY }
      }
      pointer.current = { x: event.clientX, y: event.clientY, active: true }
      wake()
    }
    const onPointerUp = () => {
      drag.current = null
      wake()
    }
    const onPointerLeave = () => {
      pointer.current = { ...pointer.current, active: false }
      wake()
    }

    wake()
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('blur', onPointerLeave)

    return () => {
      running = false
      cancelAnimationFrame(frame.current)
      media.removeEventListener('change', sync)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('blur', onPointerLeave)
    }
  }, [])

  return (
    <div ref={stageRef} className="relative min-h-dvh overflow-hidden bg-[#2b241f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,#8d6b52,transparent_42%),radial-gradient(circle_at_85%_80%,#3e5160,transparent_38%)]" />
      <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" aria-hidden="true">
        {abilities.map((ability) => {
          const pose = poses[ability.id] ?? hiddenPose
          if (pose.opacity < 0.04) return null
          return (
            <line
              key={ability.id}
              x1={pose.fromX}
              y1={pose.fromY}
              x2={pose.x}
              y2={pose.y}
              stroke={`rgba(255,255,255,${0.45 * pose.opacity})`}
              strokeWidth="1.5"
            />
          )
        })}
      </svg>
      <SiteHeader overlay />
      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 pt-40 pb-12">
        <p className="mb-5 text-xs tracking-[0.22em] text-white/70">个人能力</p>
        <div ref={photoRef} className="relative w-[min(78vw,420px)] [perspective:1200px]">
          <img
            src="/photos/skills.png"
            alt="个人能力"
            draggable={false}
            className="aspect-[4/3] w-full rounded-[28px] object-cover shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
            style={{
              objectPosition: '70% 42%',
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle: 'preserve-3d',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{
              background: `radial-gradient(circle at ${tilt.lightX}% ${tilt.lightY}%, rgba(255,255,255,0.28), transparent 36%)`,
            }}
          />
        </div>
        <h2 className="mt-8 text-4xl font-semibold tracking-tight">{profile.name}</h2>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="mt-3 text-sm text-white/75 underline-offset-4 hover:underline"
        >
          github.com/{profile.githubHandle}
        </a>
        <p className="mt-6 max-w-md text-center text-sm leading-6 text-white/70">
          移动光标，肖像会跟着倾斜，能力也会散出来。拖住一项可以把它拉得更远。
        </p>
      </main>
      {abilities.map((ability) => {
        const pose = poses[ability.id] ?? hiddenPose
        return (
          <button
            key={ability.id}
            type="button"
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/50 px-4 py-2 text-sm whitespace-nowrap text-white shadow-lg backdrop-blur-md"
            style={{
              left: pose.x,
              top: pose.y,
              opacity: pose.opacity,
              pointerEvents: pose.opacity > 0.35 ? 'auto' : 'none',
            }}
            onPointerDown={(event) => {
              drag.current = { id: ability.id, x: event.clientX, y: event.clientY }
              event.currentTarget.setPointerCapture(event.pointerId)
              event.stopPropagation()
            }}
          >
            {ability.label}
          </button>
        )
      })}
    </div>
  )
}
