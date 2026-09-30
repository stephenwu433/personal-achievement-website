import { useEffect, useRef, useState } from 'react'
import SiteHeader from '@/src/components/SiteHeader'
import { projects } from '@/src/content'

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

  if (reduced) return <ProjectList />
  return <ProjectSwitch />
}

function ProjectSwitch() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [shift, setShift] = useState(0)

  useEffect(() => {
    const read = () => {
      const root = rootRef.current
      if (!root) return
      const total = root.offsetHeight - window.innerHeight
      const scrolled = total <= 0 ? 0 : Math.min(total, Math.max(0, -root.getBoundingClientRect().top))
      const next = Math.min(projects.length - 1, Math.max(0, Math.round((scrolled / (total || 1)) * (projects.length - 1))))
      setIndex((current) => (current === next ? current : next))
    }
    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    return () => {
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [])

  const scrollTo = (next: number) => {
    const root = rootRef.current
    if (!root) return
    const total = root.offsetHeight - window.innerHeight
    const top = root.offsetTop + (total * next) / Math.max(1, projects.length - 1)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const project = projects[index]

  return (
    <div ref={rootRef} style={{ height: `${(projects.length + 1) * 100}vh` }}>
      <div
        className="sticky top-0 flex h-dvh flex-col overflow-hidden bg-[#12151c] text-white"
        onPointerMove={(event) => {
          const box = event.currentTarget.getBoundingClientRect()
          setShift((event.clientX - box.left) / box.width - 0.5)
        }}
        onPointerLeave={() => setShift(0)}
      >
        <SiteHeader />
        <main className="grid min-h-0 flex-1 gap-8 px-6 pb-10 md:grid-cols-[16rem_1fr] md:px-10">
          <ol className="flex gap-3 md:flex-col md:justify-center" aria-label="项目">
            {projects.map((item, itemIndex) => {
              const current = itemIndex === index
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    aria-current={current ? 'true' : undefined}
                    onClick={() => scrollTo(itemIndex)}
                    className={`text-left text-sm tracking-wide ${current ? 'text-white' : 'text-white/40'}`}
                  >
                    0{itemIndex + 1} {item.title}
                  </button>
                </li>
              )
            })}
          </ol>
          <article className="flex min-h-0 flex-col justify-center">
            <p className="text-xs tracking-[0.28em] text-white/45">0{index + 1} / 0{projects.length}</p>
            <h1
              className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight transition-transform duration-500 sm:text-7xl"
              style={{ transform: `translateX(${shift * 18}px)` }}
            >
              {project.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/75">{project.summary}</p>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex w-fit text-sm text-[#e6b15c] underline underline-offset-4"
            >
              打开仓库
            </a>
          </article>
        </main>
        <p className="px-6 pb-4 text-center text-xs text-white/45 md:px-10">向下滚动切换项目，也可以点左边的名字</p>
      </div>
    </div>
  )
}

function ProjectList() {
  return (
    <div className="min-h-dvh bg-[#12151c] text-white">
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
        {projects.map((project, index) => (
          <article key={project.href} className="border-t border-white/15 pt-6">
            <p className="text-xs tracking-[0.22em] text-white/45">0{index + 1}</p>
            <h1 className="mt-2 text-4xl font-semibold">{project.title}</h1>
            <p className="mt-3 text-sm leading-7 text-white/75">{project.summary}</p>
            <a href={project.href} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-[#e6b15c] underline underline-offset-4">
              打开仓库
            </a>
          </article>
        ))}
      </main>
    </div>
  )
}
