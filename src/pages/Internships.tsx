import { useRef, useState } from 'react'
import SiteHeader from '@/src/components/SiteHeader'

const frames = [
  { id: '01', label: '第一段' },
  { id: '02', label: '第二段' },
  { id: '03', label: '第三段' },
  { id: '04', label: '第四段' },
]

export default function Internships() {
  const [offset, setOffset] = useState(0)
  const drag = useRef<{ x: number; origin: number } | null>(null)

  const onDown = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, origin: offset }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const next = drag.current.origin + event.clientX - drag.current.x
    setOffset(Math.max(-720, Math.min(80, next)))
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#17202b] text-white">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,#0e141c,transparent)]" />
      <SiteHeader overlay />
      <main className="relative z-10 flex min-h-dvh flex-col justify-center pt-36">
        <div className="px-6 pb-6 text-center">
          <p className="text-xs tracking-[0.22em] text-white/65 uppercase">实习目录</p>
          <h2 className="mt-2 text-3xl font-semibold">左右拖动这条目录</h2>
        </div>
        <div
          className="cursor-grab overflow-hidden px-6 active:cursor-grabbing"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={() => {
            drag.current = null
          }}
          onPointerCancel={() => {
            drag.current = null
          }}
        >
          <div
            className="flex gap-5 transition-transform"
            style={{ transform: `translateX(${offset}px)`, perspective: '900px' }}
          >
            {frames.map((frame, index) => {
              const center = offset / 220 + index
              const rotate = Math.max(-28, Math.min(28, (index - 1.2) * 12 + offset / 40))
              return (
                <article
                  key={frame.id}
                  className="grid h-[340px] w-[240px] shrink-0 place-items-center rounded-3xl border border-white/15 bg-white/8"
                  style={{ transform: `rotateY(${rotate}deg) translateZ(${Math.abs(center) * -4}px)` }}
                >
                  <div className="text-center">
                    <p className="text-xs tracking-[0.18em] text-white/50">{frame.id}</p>
                    <h3 className="mt-3 text-xl">{frame.label}</h3>
                    <p className="mt-3 text-sm text-white/60">照片和经历待放入</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
