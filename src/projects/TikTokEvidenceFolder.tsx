import { useEffect, useState } from 'react'
import PurplePocket from './PurplePocket'
import { sofaEvidence } from './sofaCase.data'

const shots = sofaEvidence.shots

export default function TikTokEvidenceFolder() {
  const [open, setOpen] = useState(false)
  const [opening, setOpening] = useState(false)
  const [hover, setHover] = useState(false)
  const [preview, setPreview] = useState<number | null>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (preview === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreview(null)
      if (event.key === 'ArrowRight') setPreview((current) => (current === null ? current : (current + 1) % shots.length))
      if (event.key === 'ArrowLeft') setPreview((current) => (current === null ? current : (current + shots.length - 1) % shots.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preview])

  const current = preview === null ? null : shots[preview]

  return (
    <div>
      {open ? (
        <div>
          <ol className="grid grid-cols-2 gap-3 sm:gap-4">
            {shots.map((shot, index) => (
              <li key={shot.src} className={reduced ? '' : 'sofa-draw'} style={{ animationDelay: `${index * 70}ms` }}>
                <button
                  type="button"
                  onClick={() => setPreview(index)}
                  className="block h-full w-full border border-[rgba(28,28,26,0.22)] bg-[#F5F3EE] p-3 text-left transition-transform duration-300 hover:-translate-y-1"
                >
                  <p className="text-[11px] tracking-[0.16em] text-[#77746E]">
                    {shot.index} / {shot.title}
                  </p>
                  <img src={shot.src} alt="" loading="lazy" className="mt-3 w-full bg-[#1C1C1A] object-contain" />
                  <p className="mt-3 text-[14px] leading-6 text-[#1C1C1A]">{shot.body}</p>
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              setOpening(false)
            }}
            className="mt-5 text-[13px] tracking-[0.12em] underline underline-offset-4"
          >
            收起档案 ↑
          </button>
        </div>
      ) : (
        <span onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <PurplePocket
            ariaLabel="打开账号资料"
            caption="CLICK TO OPEN · 04 SCREEN RECORDS"
            hover={hover}
            opening={opening}
            reduced={reduced}
            cards={shots.map((shot, index) => ({
              src: shot.src,
              alt: shot.title,
              tint: ['#8EB7F5', '#F3B4C8', '#C7B0F4', '#F2C56B'][index] ?? '#C7B0F4',
            }))}
            onClick={() => {
              if (reduced) {
                setOpen(true)
                return
              }
              setOpening(true)
              window.setTimeout(() => setOpen(true), 420)
            }}
          />
        </span>
      )}

      {current && preview !== null ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(28,28,26,0.78)] p-4"
          onClick={() => setPreview(null)}
        >
          <div className="flex w-full max-w-5xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <p className="mb-3 text-[12px] tracking-[0.18em] text-white">
              {current.index} / 04
            </p>
            <img src={current.src} alt="" className="max-h-[78vh] w-auto max-w-full object-contain" />
            <div className="mt-4 flex items-center gap-6 text-[13px] tracking-[0.12em] text-white">
              <button type="button" onClick={() => setPreview((preview + shots.length - 1) % shots.length)}>
                上一张
              </button>
              <button type="button" onClick={() => setPreview(null)}>
                关闭
              </button>
              <button type="button" onClick={() => setPreview((preview + 1) % shots.length)}>
                下一张
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
