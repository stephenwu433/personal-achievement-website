import { useRef, useState } from 'react'
import SiteHeader from '@/src/components/SiteHeader'
import { profile } from '@/src/content'

export default function About() {
  const frame = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [light, setLight] = useState({ x: 50, y: 40 })

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - bounds.left) / bounds.width - 0.5
    const py = (event.clientY - bounds.top) / bounds.height - 0.5
    setTilt({ x: py * -16, y: px * 20 })
    setLight({ x: (px + 0.5) * 100, y: (py + 0.5) * 100 })
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#2b241f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,#8d6b52,transparent_42%),radial-gradient(circle_at_85%_80%,#3e5160,transparent_38%)]" />
      <SiteHeader overlay />
      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 pt-40 pb-12">
        <p className="mb-5 text-xs tracking-[0.22em] text-white/70 uppercase">个人介绍</p>
        <div
          ref={frame}
          className="relative [perspective:1200px]"
          onPointerMove={onMove}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        >
          <img
            src={profile.portrait}
            alt={profile.name}
            draggable={false}
            className="w-[min(78vw,380px)] rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-out"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle: 'preserve-3d',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{
              background: `radial-gradient(circle at ${light.x}% ${light.y}%, rgba(255,255,255,0.28), transparent 36%)`,
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
          移动光标，肖像会跟着倾斜。更长的自我介绍可以之后补在这里。
        </p>
      </main>
    </div>
  )
}
