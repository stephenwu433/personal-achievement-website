import { useEffect, useMemo, useState } from 'react'
import { museArchive, visualTopics } from './museCase.data'
import { coverSources, loadMuseAssets, type MuseAsset } from './museArchive'

const assets = loadMuseAssets()
const covers = coverSources(assets)

export default function MuseVisualArchive() {
  const [open, setOpen] = useState(false)
  const [opening, setOpening] = useState(false)
  const [hover, setHover] = useState(false)
  const [topic, setTopic] = useState<string>('all')
  const [preview, setPreview] = useState<number | null>(null)
  const [reduced, setReduced] = useState(false)
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const visible = useMemo(
    () => (topic === 'all' ? assets : assets.filter((asset) => asset.topicId === topic)),
    [topic],
  )

  useEffect(() => {
    if (preview === null) return
    const sheet = document.querySelector('[data-project-sheet]') as HTMLElement | null
    const previous = sheet?.style.overflow ?? ''
    if (sheet) sheet.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreview(null)
      if (event.key === 'ArrowRight') setPreview((current) => (current === null ? current : (current + 1) % visible.length))
      if (event.key === 'ArrowLeft') setPreview((current) => (current === null ? current : (current + visible.length - 1) % visible.length))
    }
    window.addEventListener('keydown', onKey)
    return () => {
      if (sheet) sheet.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [preview, visible.length])

  const current = preview === null ? null : visible[preview]

  function openArchive() {
    if (reduced) {
      setOpen(true)
      return
    }
    setOpening(true)
    window.setTimeout(() => setOpen(true), 420)
  }

  function closeArchive() {
    setOpen(false)
    setOpening(false)
    setTopic('all')
    setPreview(null)
  }

  return (
    <div>
      <div className={`grid items-center gap-8 ${open ? '' : 'lg:grid-cols-[minmax(0,1.05fr)_minmax(240px,0.78fr)]'}`}>
        <div>
          <p className="text-[11px] tracking-[0.22em] text-[#AAA59E]">{museArchive.kicker}</p>
          <h2 className="mt-4 max-w-[16em] text-[clamp(18px,3.6vw,46px)] leading-[1.22] font-medium" style={{ fontFamily: '"Songti SC", "Noto Serif SC", serif', color: '#181715' }}>
            {museArchive.title}
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-7">{museArchive.lead}</p>
        </div>
        {open ? null : (
        <button
          type="button"
          aria-label="打开视觉档案"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          onClick={openArchive}
          className="relative mx-auto block h-[230px] w-full max-w-[420px] lg:mx-0 lg:max-w-none"
          style={{
            perspective: '900px',
            transform: hover && !reduced ? 'translateY(-6px)' : undefined,
            transition: reduced ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="absolute top-4 right-6 left-6 h-[150px] rounded-xl border border-[#D9D3C8] bg-[#E7E2D8]" />
          {covers.map((cover, index) => {
            const lift = reduced ? 0 : opening ? 28 + index * 6 : hover ? 8 + index * 2 : 0
            const place = [
              { left: '8%', rotate: -7 },
              { left: '20%', rotate: -3 },
              { left: '32%', rotate: 0 },
              { left: '44%', rotate: 3 },
              { left: '56%', rotate: 6 },
            ][index]
            return (
              <span
                key={cover.path}
                className="absolute top-7 h-[78px] w-[34%] overflow-hidden rounded-md border border-black/10 bg-[#F7F4EE] shadow-sm"
                style={{
                  left: place.left,
                  zIndex: 4 + index,
                  transform: `translateY(${-lift}px) rotate(${place.rotate}deg)`,
                  transition: reduced ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {failed[cover.path] ? null : (
                  <img
                    src={cover.src}
                    alt={cover.alt}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                    onError={() => setFailed((current) => ({ ...current, [cover.path]: true }))}
                  />
                )}
                <span className="absolute top-1 left-1 bg-[#F5F2EC]/90 px-1 text-[9px] tracking-[0.12em] text-[#181715]">{String(index + 1).padStart(2, '0')}</span>
              </span>
            )
          })}
          <span
            className="absolute inset-x-0 bottom-0 z-20 flex h-[148px] origin-bottom flex-col items-center justify-center rounded-[22px] border border-[#D4CFC6] bg-[#F3EFE8] shadow-[0_10px_22px_rgba(24,23,21,0.08)]"
            style={{
              transform: opening && !reduced ? 'rotateX(-42deg)' : undefined,
              transition: reduced ? 'none' : 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="mb-2 flex gap-7">
              <span className="size-1.5 rounded-full bg-[#AAA59E]" />
              <span className="size-1.5 rounded-full bg-[#AAA59E]" />
            </span>
            <span className="mb-3 h-0.5 w-7 rounded-full bg-[#AAA59E]" />
            <span className="text-[11px] tracking-[0.18em] text-[#181715]">MUSESELECT</span>
            <span className="text-[11px] tracking-[0.16em] text-[#181715]">VISUAL ARCHIVE</span>
            <span className="mt-2 text-[10px] tracking-[0.14em] text-[#AAA59E]">10 TOPICS · 62 ASSETS</span>
            <span className="mt-1 text-[10px] tracking-[0.14em] text-[#9B293C]">CLICK TO OPEN</span>
          </span>
        </button>
        )}
      </div>
      {open ? (
        <div className="mt-8">
          <div className="flex flex-wrap gap-2">
            <TopicChip active={topic === 'all'} onClick={() => setTopic('all')} label="全部" />
            {visualTopics.map((item) => (
              <TopicChip key={item.id} active={topic === item.id} onClick={() => { setTopic(item.id); setPreview(null) }} label={item.label} />
            ))}
          </div>
          <div className="mt-6 columns-2 gap-3 md:columns-3">
            {visible.map((asset, index) => (
              <ArchiveCard key={`${asset.topicId}-${asset.file}`} asset={asset} index={index} reduced={reduced} onOpen={() => setPreview(index)} />
            ))}
          </div>
          <button type="button" onClick={closeArchive} className="mt-6 text-[13px] tracking-[0.12em] underline underline-offset-4">
            收起档案 ↑
          </button>
        </div>
      ) : null}

      {current && preview !== null ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(24,23,21,0.82)] p-4" onClick={() => setPreview(null)}>
          <div className="flex w-full max-w-5xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <p className="mb-3 text-[12px] tracking-[0.16em] text-white">
              {String(preview + 1).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}
            </p>
            <img src={current.src} alt={current.alt} className="max-h-[78vh] w-auto max-w-full object-contain" />
            <div className="mt-4 flex gap-6 text-[13px] tracking-[0.12em] text-white">
              <button type="button" onClick={() => setPreview((preview + visible.length - 1) % visible.length)}>上一张</button>
              <button type="button" onClick={() => setPreview(null)}>关闭</button>
              <button type="button" onClick={() => setPreview((preview + 1) % visible.length)}>下一张</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function TopicChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border px-3 py-2 text-[13px]"
      style={{
        borderColor: active ? '#9B293C' : 'rgba(24,23,21,0.22)',
        color: active ? '#9B293C' : '#181715',
        background: active ? '#F8F1F2' : '#F5F2EC',
      }}
    >
      {label}
    </button>
  )
}

function ArchiveCard({ asset, index, reduced, onOpen }: { asset: MuseAsset; index: number; reduced: boolean; onOpen: () => void }) {
  const wide = index % 5 === 0
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`mb-3 block w-full break-inside-avoid border border-[rgba(24,23,21,0.18)] bg-[#F5F2EC] p-2 text-left ${reduced ? '' : 'muse-draw'} ${wide ? 'md:px-3 md:py-3' : ''}`}
      style={{ animationDelay: reduced ? undefined : `${Math.min(index, 12) * 30}ms` }}
    >
      <img src={asset.src} alt={asset.alt} loading="lazy" className="h-auto w-full object-contain" />
    </button>
  )
}
