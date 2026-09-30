import { useEffect, useRef, useState } from 'react'
import SiteHeader from '@/src/components/SiteHeader'
import { profile } from '@/src/content'

type Piece = {
  id: string
  index: string
  title: string
  image: string
  line: string
  body: string
}

const pieces: Piece[] = [
  {
    id: 'language',
    index: '01',
    title: '语言和工程',
    image: '/photos/home-skills.jpg',
    line: '这一组放语言和工程方面的能力。',
    body: '具体条目之后写在这里。',
  },
  {
    id: 'tools',
    index: '02',
    title: '工具',
    image: '/photos/home-projects.jpg',
    line: '这一组放会用的工具。',
    body: '具体条目之后写在这里。',
  },
  {
    id: 'direction',
    index: '03',
    title: '方向',
    image: '/photos/home-about.jpg',
    line: '这一组放正在靠近的方向。',
    body: '具体内容之后写在这里。',
  },
]

const serif = '"Iowan Old Style", Palatino, "Palatino Linotype", "Songti SC", "Noto Serif SC", serif'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Skills() {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [openId, setOpenId] = useState<string | null>(null)
  const opened = pieces.find((piece) => piece.id === openId) ?? null

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <div className="bg-[#111] text-white">
      {reduced ? (
        <SkillsReading onOpen={setOpenId} />
      ) : (
        pieces.map((piece) => <Chapter key={piece.id} piece={piece} onOpen={() => setOpenId(piece.id)} />)
      )}
      {opened ? <PieceDetail piece={opened} onClose={() => setOpenId(null)} /> : null}
    </div>
  )
}

function Chapter({ piece, onOpen }: { piece: Piece; onOpen: () => void }) {
  const rootRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const read = () => {
      const root = rootRef.current
      if (!root) return
      const total = root.offsetHeight - window.innerHeight
      if (total <= 0) {
        setProgress(0)
        return
      }
      const scrolled = Math.min(total, Math.max(0, -root.getBoundingClientRect().top))
      const next = scrolled / total
      setProgress((current) => (Math.abs(current - next) < 0.004 ? current : next))
    }
    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    return () => {
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [])

  const fade = progress < 0.72 ? 1 : Math.max(0, 1 - (progress - 0.72) / 0.28)

  return (
    <section ref={rootRef} className="relative h-[190vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <img
          src={piece.image}
          alt=""
          className="absolute inset-x-0 top-[-12%] h-[124%] w-full object-cover"
          style={{ transform: `translate3d(0, ${(progress - 0.5) * 8}%, 0)` }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/55 to-transparent" />
        <SiteHeader overlay />
        <div
          className="absolute inset-0 flex items-center justify-center px-6 transition-opacity duration-500"
          style={{ opacity: fade, fontFamily: serif }}
        >
          <div className="w-full max-w-3xl text-center">
            <p className="text-[11px] tracking-[0.28em] text-white/70">{piece.index} 个人能力</p>
            <h2 className="mt-4 text-5xl sm:text-7xl">{piece.title}</h2>
            <div className="mx-auto mt-6 h-px w-full max-w-xl bg-white/50" />
            <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-white/90">{piece.line}</p>
            <div className="mx-auto mt-6 h-px w-full max-w-xl bg-white/50" />
            <button
              type="button"
              onClick={onOpen}
              className="mt-8 text-sm tracking-[0.22em] underline underline-offset-8"
            >
              进入这一段
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function PieceDetail({ piece, onClose }: { piece: Piece; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 text-white backdrop-blur-sm">
      <div className="mx-auto grid min-h-dvh max-w-5xl items-center gap-8 px-5 py-20 md:grid-cols-[1.1fr_0.9fr]">
        <img src={piece.image} alt="" className="aspect-[4/3] w-full object-cover" />
        <div style={{ fontFamily: serif }}>
          <p className="text-[11px] tracking-[0.28em] text-white/60">{piece.index}</p>
          <h2 className="mt-3 text-5xl">{piece.title}</h2>
          <div className="mt-6 h-px w-full bg-white/40" />
          <p className="mt-6 text-lg leading-8">{piece.line}</p>
          <p className="mt-3 text-base leading-8 text-white/75">{piece.body}</p>
          <button type="button" onClick={onClose} className="mt-8 text-sm tracking-[0.2em] underline underline-offset-8">
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

function SkillsReading({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="min-h-dvh bg-[#111] text-white">
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-16" style={{ fontFamily: serif }}>
        <p className="text-[11px] tracking-[0.28em] text-white/50">个人能力</p>
        <h1 className="text-5xl">{profile.name}</h1>
        {pieces.map((piece) => (
          <section key={piece.id} className="border-t border-white/15 pt-6">
            <h2 className="text-3xl">{piece.title}</h2>
            <p className="mt-3 text-white/75">{piece.line}</p>
            <button type="button" onClick={() => onOpen(piece.id)} className="mt-4 text-sm tracking-[0.16em] underline underline-offset-4">
              进入这一段
            </button>
          </section>
        ))}
      </main>
    </div>
  )
}
