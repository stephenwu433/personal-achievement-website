import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SiteHeader from '@/src/components/SiteHeader'
import { projects } from '@/src/content'

export default function Projects() {
  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState(0)
  const start = useRef<number | null>(null)
  const project = projects[index]

  const settle = (distance: number) => {
    if (distance < -70) setIndex((current) => Math.min(projects.length - 1, current + 1))
    if (distance > 70) setIndex((current) => Math.max(0, current - 1))
    setDrag(0)
    start.current = null
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#1c2620] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#3d5a49,transparent_46%)]" />
      <SiteHeader overlay />
      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 pt-36 pb-10">
          <p className="text-xs tracking-[0.22em] text-white/65 uppercase">项目列表</p>
        <h2 className="mt-2 text-3xl font-semibold">左右滑动翻开下一件</h2>
        <div
          className="mt-8 w-[min(88vw,420px)] [perspective:1000px]"
          onPointerDown={(event) => {
            start.current = event.clientX
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            if (start.current === null) return
            setDrag(event.clientX - start.current)
          }}
          onPointerUp={() => settle(drag)}
          onPointerCancel={() => settle(0)}
        >
          <article
            className="min-h-[380px] rounded-[28px] border border-white/15 bg-[#101612]/80 p-6 shadow-2xl transition-transform duration-200"
            style={{ transform: `translateX(${drag}px) rotateY(${drag / 18}deg)` }}
          >
            <p className="text-xs tracking-[0.16em] text-white/50">
              {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </p>
            <div className="mt-5 grid h-36 place-items-center rounded-2xl border border-dashed border-white/20 text-sm text-white/60">
              封面之后换上
            </div>
            <h3 className="mt-6 text-3xl font-semibold tracking-tight">{project.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/75">{project.summary}</p>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1 text-sm text-white hover:underline"
            >
              查看仓库
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </article>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-2 text-sm disabled:opacity-40"
            disabled={index === 0}
            onClick={() => setIndex((current) => Math.max(0, current - 1))}
          >
            上一件
          </button>
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-2 text-sm disabled:opacity-40"
            disabled={index === projects.length - 1}
            onClick={() => setIndex((current) => Math.min(projects.length - 1, current + 1))}
          >
            下一件
          </button>
        </div>
      </main>
    </div>
  )
}
