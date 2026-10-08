import { useEffect, useMemo, useState } from 'react'
import { museArchive, visualTopics } from './museCase.data'
import { coverSources, loadMuseAssets, type MuseAsset } from './museArchive'
import PurplePocket from './PurplePocket'

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
          <span onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <PurplePocket
              ariaLabel="打开视觉档案"
              caption="CLICK TO OPEN · 10 TOPICS"
              hover={hover}
              opening={opening}
              reduced={reduced}
              onClick={openArchive}
              cards={covers.map((cover, index) => ({
                src: failed[cover.path] ? undefined : cover.src,
                alt: cover.alt,
                tint: ['#8EB7F5', '#F3B4C8', '#C7B0F4', '#F7D48A', '#F2C56B'][index] ?? '#C7B0F4',
              }))}
            />
          </span>
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
