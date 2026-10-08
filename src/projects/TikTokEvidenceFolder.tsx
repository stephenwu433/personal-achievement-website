import { useEffect, useState } from 'react'
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
        <button
          type="button"
          aria-label="打开账号资料"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          className="sofa-folder relative mx-auto block h-[250px] w-full max-w-[360px]"
          style={{
            perspective: '900px',
            transform: hover && !reduced ? 'translateY(-6px)' : undefined,
            transition: reduced ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onClick={() => {
            if (reduced) {
              setOpen(true)
              return
            }
            setOpening(true)
            window.setTimeout(() => setOpen(true), 420)
          }}
        >
          <span className="absolute top-3 right-8 left-8 h-[168px] rounded-xl border border-[#D1D1D1] bg-[#E6E6E6]" />
          {shots.map((shot, index) => {
            const lift = reduced ? 0 : opening ? 36 + index * 8 : hover ? 10 + index * 2 : 0
            const place = [
              { left: '18%', rotate: -6 },
              { left: '30%', rotate: -2 },
              { left: '42%', rotate: 2 },
              { left: '54%', rotate: 6 },
            ][index]
            return (
              <img
                key={shot.src}
                src={shot.src}
                alt=""
                loading="lazy"
                className="absolute top-6 h-[92px] w-[42%] rounded-md border border-black/10 object-cover object-top shadow-md"
                style={{
                  left: place.left,
                  transform: `translateY(${-lift}px) rotate(${place.rotate}deg)`,
                  transition: reduced ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 4 + index,
                }}
              />
            )
          })}
          <span
            className="absolute inset-x-0 bottom-0 z-20 flex h-[168px] flex-col items-center justify-center rounded-[22px] border border-[#D1D1D1] bg-[#F2F2F2] shadow-[0_10px_24px_rgba(28,28,26,0.08)]"
            style={{
              transformOrigin: 'center bottom',
              transform: opening && !reduced ? 'rotateX(-42deg)' : undefined,
              transition: reduced ? 'none' : 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="mb-3 flex gap-8">
              <span className="size-2 rounded-full bg-neutral-600/40" />
              <span className="size-2 rounded-full bg-neutral-600/40" />
            </span>
            <span className="mb-4 h-1 w-8 rounded-full bg-neutral-600/40" />
            <span className="text-[11px] tracking-[0.16em] text-[#1C1C1A]">TIKTOK ACCOUNT ARCHIVE</span>
            <span className="mt-1 text-[11px] tracking-[0.16em] text-[#77746E]">04 SCREEN RECORDS</span>
            <span className="mt-2 text-[11px] tracking-[0.16em] text-[#77746E]">CLICK TO OPEN</span>
          </span>
        </button>
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
