import { useEffect, useRef, useState } from 'react'

type DetailLink = {
  id: string
  index: string
  title: string
  note?: string
  image?: string
  tone?: string
}

function inkOn(hex: string) {
  const value = Number.parseInt(hex.replace('#', ''), 16)
  if (!Number.isFinite(value)) return '#1c1c1c'
  const channel = (shift: number) => (value >> shift) & 255
  const luma = (channel(16) * 299 + channel(8) * 587 + channel(0) * 114) / 1000
  return luma > 168 ? '#1c1c1c' : '#fff6ee'
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const apply = () => setNarrow(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])
  return narrow
}

export default function DetailEnd({
  className = '',
  backLabel,
  onBack,
  othersLabel,
  others,
  onOpen,
  onPrefetch,
}: {
  className?: string
  backLabel: string
  onBack: () => void
  othersLabel: string
  others: DetailLink[]
  onOpen: (id: string) => void
  onPrefetch?: (id: string) => void
}) {
  const narrow = useNarrow()
  const rootRef = useRef<HTMLElement>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const frontId = others.some((item) => item.id === picked) ? picked : others[0]?.id
  const frontAt = Math.max(0, others.findIndex((item) => item.id === frontId))
  const ordered = [...others.slice(frontAt), ...others.slice(0, frontAt)]
  const cardHeight = narrow ? 156 : 206
  const yStep = narrow ? 14 : 18
  const tilt = narrow ? 2.15 : 3.2
  const xStep = narrow ? 4 : 14
  const mid = Math.max(0, ordered.length - 1) / 2
  const maxAngle = mid * tilt
  const bleed = Math.ceil(Math.sin((maxAngle * Math.PI) / 180) * (narrow ? 150 : 280)) + (narrow ? 8 : 14)
  const pileHeight = ordered.length ? bleed + cardHeight + (ordered.length - 1) * yStep + bleed : 0

  useEffect(() => {
    const node = rootRef.current
    if (!node || !onPrefetch) return
    const sheet = node.closest('[data-project-sheet]')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        others.forEach((item) => onPrefetch(item.id))
        observer.disconnect()
      },
      { root: sheet instanceof HTMLElement ? sheet : null, rootMargin: '400px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [onPrefetch, others])

  return (
    <section ref={rootRef} className={className} data-detail-end>
      <div className="border-t border-black/20 pt-8">
        <button
          type="button"
          onClick={onBack}
          className="border border-[#1c1c1c] bg-[#1c1c1c] px-6 py-3 text-[14px] tracking-[0.18em] text-[#f7f5f2] hover:bg-[#2a2a2a]"
        >
          {backLabel}
        </button>
        {ordered.length > 0 ? (
          <div className="detail-end-others">
            <p className="detail-end-label">{othersLabel}</p>
            <div className="detail-end-pile" style={{ height: pileHeight }}>
              {ordered.map((item, index) => {
                const tone = item.tone || '#b9673f'
                const shift = index - mid
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="detail-end-card"
                    style={{
                      background: tone,
                      color: inkOn(tone),
                      height: cardHeight,
                      top: bleed,
                      transform: `translate(${shift * xStep}px, ${index * yStep}px) rotate(${shift * tilt}deg)`,
                      zIndex: ordered.length - index,
                    }}
                    aria-label={index === 0 ? `打开${item.title}` : `把${item.title}拿到前面`}
                    onPointerEnter={() => onPrefetch?.(item.id)}
                    onFocus={() => onPrefetch?.(item.id)}
                    onClick={() => {
                      if (index === 0) onOpen(item.id)
                      else setPicked(item.id)
                    }}
                  >
                    {item.image ? (
                      <img src={item.image} alt="" decoding="async" />
                    ) : (
                      <span className="detail-end-photo" />
                    )}
                    <span className="detail-end-copy">
                      <strong>{item.title}</strong>
                      {item.note ? <small>{item.note}</small> : <small>{item.index}</small>}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
