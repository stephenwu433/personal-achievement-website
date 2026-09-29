import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { storyStations, type StoryHotspot, type StoryStation } from '@/src/about/story'
import { profile } from '@/src/content'

type Phase = 'intro' | 'playing' | 'pausedAtStation' | 'contentExpanded' | 'playingNext' | 'final'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function useNarrowScreen() {
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const onChange = () => setNarrow(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return narrow
}

function placeCoverFrame(stage: HTMLDivElement, frame: HTMLDivElement, anchor: 'center' | 'right') {
  const stageW = stage.clientWidth
  const stageH = stage.clientHeight
  if (stageW === 0 || stageH === 0) return
  const ratio = 16 / 9
  let width = stageW
  let height = width / ratio
  if (height < stageH) {
    height = stageH
    width = height * ratio
  }
  const top = (stageH - height) / 2
  const left = anchor === 'right' ? stageW - width : (stageW - width) / 2
  frame.style.right = 'auto'
  frame.style.bottom = 'auto'
  frame.style.width = `${width}px`
  frame.style.height = `${height}px`
  frame.style.left = `${left}px`
  frame.style.top = `${top}px`
}

function holdLastFrame(video: HTMLVideoElement) {
  video.pause()
  const duration = video.duration
  if (!Number.isFinite(duration) || duration <= 0.2) return
  if (video.currentTime < duration - 0.2) {
    video.currentTime = Math.max(0, duration - 0.04)
  }
}

export default function About() {
  const reduced = useReducedMotion()
  const narrow = useNarrowScreen()
  const lastIndex = storyStations.length - 1
  const [stationIndex, setStationIndex] = useState(0)
  const [furthest, setFurthest] = useState(0)
  const [phase, setPhase] = useState<Phase>('intro')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [muted, setMuted] = useState(true)
  const [clipMissing, setClipMissing] = useState(false)
  const [visibleSlot, setVisibleSlot] = useState<0 | 1 | null>(null)
  const stationRef = useRef(0)
  const furthestRef = useRef(0)
  const phaseRef = useRef<Phase>('intro')
  const mutedRef = useRef(true)
  const playingRef = useRef(false)
  const arrivalLock = useRef(false)
  const activeSlotRef = useRef<0 | 1 | null>(null)
  const visibleSlotRef = useRef<0 | 1 | null>(null)
  const missingRef = useRef(new Set<string>())
  const frontRef = useRef<HTMLVideoElement>(null)
  const backRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  const station = storyStations[stationIndex]
  const playing = phase === 'playing' || phase === 'playingNext'
  const anchor = playing && narrow ? 'right' : 'center'

  useLayoutEffect(() => {
    const stage = stageRef.current
    const frame = frameRef.current
    if (!stage || !frame) return
    const measure = () => placeCoverFrame(stage, frame, anchor)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [anchor])

  useEffect(() => {
    const video = frontRef.current
    const first = storyStations[0].departVideo
    if (!video || !first) return
    video.preload = 'auto'
    video.muted = true
    video.dataset.clip = first
    video.src = first
    video.load()
  }, [])

  useEffect(() => {
    if (!expanded) return
    dialogRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setExpanded(null)
      if (phaseRef.current !== 'contentExpanded') return
      phaseRef.current = 'pausedAtStation'
      setPhase('pausedAtStation')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  const videoAt = (slot: 0 | 1) => (slot === 0 ? frontRef.current : backRef.current)

  const rememberStation = (index: number) => {
    stationRef.current = index
    setStationIndex(index)
  }

  const rememberFurthest = (index: number) => {
    const next = Math.max(furthestRef.current, index)
    furthestRef.current = next
    setFurthest(next)
  }

  const loadSlot = (slot: 0 | 1, url: string) => {
    const video = videoAt(slot)
    if (!video || video.dataset.clip === url) return
    video.preload = 'auto'
    video.muted = true
    video.dataset.clip = url
    video.src = url
    video.load()
  }

  const preloadUpcoming = (index: number, holdingSlot: 0 | 1 | null) => {
    const url = storyStations[index]?.departVideo
    if (!url) return
    const idle: 0 | 1 = holdingSlot === 0 ? 1 : 0
    loadSlot(idle, url)
  }

  const arrive = (index: number, holding: boolean, slot: 0 | 1 | null) => {
    const next = Math.min(Math.max(index, 0), lastIndex)
    rememberStation(next)
    rememberFurthest(next)
    setExpanded(null)
    const nextPhase: Phase = next === lastIndex ? 'final' : 'pausedAtStation'
    phaseRef.current = nextPhase
    setPhase(nextPhase)
    if (holding && slot !== null) {
      visibleSlotRef.current = slot
      setVisibleSlot(slot)
    } else {
      visibleSlotRef.current = null
      setVisibleSlot(null)
    }
    preloadUpcoming(next, holding ? slot : null)
  }

  const openContent = (id: string) => {
    setExpanded(id)
    if (phaseRef.current === 'playing' || phaseRef.current === 'playingNext') return
    if (phaseRef.current === 'intro' || phaseRef.current === 'final') return
    phaseRef.current = 'contentExpanded'
    setPhase('contentExpanded')
  }

  const closeContent = () => {
    setExpanded(null)
    if (phaseRef.current !== 'contentExpanded') return
    phaseRef.current = 'pausedAtStation'
    setPhase('pausedAtStation')
  }

  const review = (index: number) => {
    if (index > furthestRef.current) return
    playingRef.current = false
    arrivalLock.current = true
    activeSlotRef.current = null
    frontRef.current?.pause()
    backRef.current?.pause()
    visibleSlotRef.current = null
    setVisibleSlot(null)
    setClipMissing(false)
    setExpanded(null)
    rememberStation(index)
    const nextPhase: Phase =
      index === lastIndex ? 'final' : furthestRef.current === 0 && index === 0 ? 'intro' : 'pausedAtStation'
    phaseRef.current = nextPhase
    setPhase(nextPhase)
    preloadUpcoming(index, null)
  }

  const depart = async () => {
    const origin = stationRef.current
    const url = storyStations[origin].departVideo
    if (!url || playingRef.current) return
    setExpanded(null)
    if (phaseRef.current === 'contentExpanded') {
      phaseRef.current = 'pausedAtStation'
    }
    if (reduced) {
      setClipMissing(false)
      arrive(origin + 1, false, null)
      return
    }
    const nextPhase: Phase = origin === 0 && furthestRef.current === 0 ? 'playing' : 'playingNext'
    phaseRef.current = nextPhase
    setPhase(nextPhase)
    if (missingRef.current.has(url)) {
      setClipMissing(true)
      arrive(origin + 1, false, null)
      return
    }
    const front = frontRef.current
    const back = backRef.current
    const slot: 0 | 1 = front?.dataset.clip === url ? 0 : 1
    const video = slot === 0 ? front : back
    if (!video) {
      setClipMissing(true)
      arrive(origin + 1, false, null)
      return
    }
    if (video.dataset.clip !== url) {
      video.preload = 'auto'
      video.dataset.clip = url
      video.src = url
      video.load()
    }
    activeSlotRef.current = slot
    arrivalLock.current = false
    playingRef.current = true
    video.muted = mutedRef.current
    try {
      if (video.readyState >= 1 && video.currentTime > 0.05) video.currentTime = 0
      await video.play()
    } catch {
      if (arrivalLock.current) return
      arrivalLock.current = true
      playingRef.current = false
      activeSlotRef.current = null
      missingRef.current.add(url)
      setClipMissing(true)
      arrive(origin + 1, false, null)
    }
  }

  const handlePlaying = (slot: 0 | 1) => {
    if (activeSlotRef.current !== slot || !playingRef.current) return
    visibleSlotRef.current = slot
    setVisibleSlot(slot)
  }

  const handleEnded = (slot: 0 | 1) => {
    if (activeSlotRef.current !== slot || arrivalLock.current) return
    const video = videoAt(slot)
    if (!video) return
    arrivalLock.current = true
    playingRef.current = false
    holdLastFrame(video)
    setClipMissing(false)
    arrive(stationRef.current + 1, true, slot)
  }

  const handleError = (slot: 0 | 1) => {
    const video = videoAt(slot)
    const src = video?.dataset.clip
    if (src) missingRef.current.add(src)
    if (activeSlotRef.current !== slot || !playingRef.current || arrivalLock.current) return
    arrivalLock.current = true
    playingRef.current = false
    activeSlotRef.current = null
    setClipMissing(true)
    arrive(stationRef.current + 1, false, null)
  }

  const handleTimeUpdate = (slot: 0 | 1) => {
    const video = videoAt(slot)
    if (!video?.ended || visibleSlotRef.current !== slot) return
    const duration = video.duration
    if (!Number.isFinite(duration) || duration < 0.2) return
    if (video.currentTime < 0.12) video.currentTime = Math.max(0, duration - 0.04)
  }

  const toggleSound = () => {
    const next = !mutedRef.current
    mutedRef.current = next
    setMuted(next)
    if (frontRef.current) frontRef.current.muted = next
    if (backRef.current) backRef.current.muted = next
  }

  const toggleHotspot = (id: string) => {
    if (expanded === id) closeContent()
    else openContent(id)
  }

  const primaryLabel = stationIndex === lastIndex ? null : furthest === 0 && stationIndex === 0 ? '开始探索' : '继续探索'
  const announcement = playing
    ? '正在播放这一段。播完会停在下一站。'
    : `第 ${station.index} 站，${station.title}。${station.place}。`

  return (
    <div
      className="relative flex h-dvh flex-col overflow-hidden bg-[#1a2433] text-white md:block"
      data-phase={phase}
      data-station={station.index}
    >
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <div
        ref={stageRef}
        className={`relative overflow-hidden bg-[#1a2433] ${
          playing ? 'min-h-0 flex-1' : 'aspect-video w-full shrink-0'
        } md:absolute md:inset-0 md:aspect-auto md:h-auto md:w-auto`}
      >
        <div ref={frameRef} className="absolute inset-0">
            <img src={station.still} alt="" className="absolute inset-0 size-full object-cover" />
            <video
              ref={frontRef}
              className={`pointer-events-none absolute inset-0 size-full object-cover ${visibleSlot === 0 ? 'opacity-100' : 'opacity-0'}`}
              poster={station.still}
              playsInline
              preload="auto"
              muted={muted}
              aria-hidden="true"
              onPlaying={() => handlePlaying(0)}
              onEnded={() => handleEnded(0)}
              onError={() => handleError(0)}
              onTimeUpdate={() => handleTimeUpdate(0)}
            />
            <video
              ref={backRef}
              className={`pointer-events-none absolute inset-0 size-full object-cover ${visibleSlot === 1 ? 'opacity-100' : 'opacity-0'}`}
              poster={station.still}
              playsInline
              preload="auto"
              muted={muted}
              aria-hidden="true"
              onPlaying={() => handlePlaying(1)}
              onEnded={() => handleEnded(1)}
              onError={() => handleError(1)}
              onTimeUpdate={() => handleTimeUpdate(1)}
            />
            {playing
              ? null
              : station.hotspots.map((hotspot) => (
                  <HotspotButton
                    key={hotspot.id}
                    hotspot={hotspot}
                    pressed={expanded === hotspot.id || expanded === 'all'}
                    onClick={() => toggleHotspot(hotspot.id)}
                  />
                ))}
        </div>
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-3 pt-3 sm:px-5">
        <Link to="/" className="pointer-events-auto rounded-full px-2 py-1 text-sm text-white/80 hover:text-white">
          首页
        </Link>
        <nav aria-label="六站进度" className="pointer-events-auto">
          <ol className="flex items-center gap-1.5">
            {storyStations.map((item, index) => {
              const locked = index > furthest
              const current = index === stationIndex
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={locked}
                    aria-current={current ? 'step' : undefined}
                    aria-label={`${item.index} ${item.title}${locked ? '，尚未到达' : ''}`}
                    onClick={() => review(index)}
                    className={`rounded-full px-2 py-1 text-[11px] tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b15c] disabled:cursor-default ${
                      current
                        ? 'bg-[#e6b15c] text-[#1b2430]'
                        : locked
                          ? 'text-white/30'
                          : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.index}
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
        <button
          type="button"
          aria-pressed={!muted}
          aria-label={muted ? '打开声音' : '关闭声音'}
          onClick={toggleSound}
          className="pointer-events-auto rounded-full px-2 py-1 text-sm text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b15c]"
        >
          {muted ? '声音关' : '声音开'}
        </button>
      </header>

      {playing ? null : (
        <div className="relative z-30 flex min-h-0 flex-1 flex-col p-3 md:absolute md:inset-x-auto md:top-auto md:bottom-5 md:left-5 md:max-h-[calc(100dvh-6.5rem)] md:w-[min(22rem,34vw)] md:p-0">
          <StoryPanel
            station={station}
            titleId={titleId}
            expanded={expanded}
            clipMissing={clipMissing}
            primaryLabel={primaryLabel}
            dialogRef={dialogRef}
            reduced={reduced}
            onHotspot={toggleHotspot}
            onToggleAll={() => (expanded === 'all' ? closeContent() : openContent('all'))}
            onClose={closeContent}
            onDepart={() => void depart()}
          />
        </div>
      )}
    </div>
  )
}

function HotspotButton({
  hotspot,
  pressed,
  onClick,
}: {
  hotspot: StoryHotspot
  pressed: boolean
  onClick: () => void
}) {
  const labelLeft = hotspot.x > 58
  return (
    <button
      type="button"
      aria-label={hotspot.label}
      aria-expanded={pressed}
      onClick={onClick}
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      className="absolute z-20 size-11 -translate-x-1/2 -translate-y-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b15c]"
    >
      <span
        className={`absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90 bg-[#e6b15c] shadow-[0_0_0_6px_rgba(230,177,92,0.28)] ${
          pressed ? '' : 'motion-safe:animate-pulse'
        }`}
      />
      <span
        className={`absolute top-1/2 hidden max-w-40 -translate-y-1/2 rounded-full bg-[#243244]/85 px-2.5 py-1 text-left text-xs leading-4 text-white backdrop-blur-sm md:block ${
          labelLeft ? 'right-full mr-3' : 'left-full ml-3'
        }`}
      >
        {hotspot.label}
      </span>
    </button>
  )
}

function StoryPanel({
  station,
  titleId,
  expanded,
  clipMissing,
  primaryLabel,
  dialogRef,
  reduced,
  onHotspot,
  onToggleAll,
  onClose,
  onDepart,
}: {
  station: StoryStation
  titleId: string
  expanded: string | null
  clipMissing: boolean
  primaryLabel: string | null
  dialogRef: RefObject<HTMLDivElement | null>
  reduced: boolean
  onHotspot: (id: string) => void
  onToggleAll: () => void
  onClose: () => void
  onDepart: () => void
}) {
  const sections = expanded === 'all' ? station.hotspots : station.hotspots.filter((hotspot) => hotspot.id === expanded)
  return (
    <section
      key={reduced ? station.id : undefined}
      aria-labelledby={titleId}
      style={reduced ? { animation: 'intro-panel-in 480ms ease' } : undefined}
      className="flex min-h-0 flex-1 flex-col rounded-t-3xl border border-white/15 bg-[#2a3648]/80 p-4 shadow-2xl backdrop-blur-md md:flex-none md:rounded-3xl md:max-h-full"
    >
      <div className="shrink-0">
        <p className="text-xs tracking-wide text-[#e6b15c]">
          {station.index} {station.place}
        </p>
        <h1 id={titleId} className="mt-1 text-xl font-semibold leading-snug">
          {station.title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-white/85 select-text">{station.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {station.hotspots.map((hotspot) => {
            const open = expanded === hotspot.id || expanded === 'all'
            return (
              <button
                key={hotspot.id}
                type="button"
                aria-expanded={open}
                onClick={() => onHotspot(hotspot.id)}
                className={`rounded-full px-3 py-1.5 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b15c] ${
                  open ? 'bg-[#e6b15c] text-[#1b2430]' : 'bg-white/10 text-white'
                }`}
              >
                {hotspot.label}
              </button>
            )
          })}
        </div>
      </div>
      {expanded ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 outline-none md:max-h-[42vh]"
        >
          <div className="space-y-4 text-sm leading-7 text-white/90 select-text">
            {sections.map((hotspot) => (
              <article key={hotspot.id} className="space-y-3">
                {expanded === 'all' ? <h2 className="text-sm font-semibold text-white">{hotspot.label}</h2> : null}
                {hotspot.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {hotspot.link ? (
                  <a
                    href={hotspot.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-[#e6b15c] underline underline-offset-4"
                  >
                    {hotspot.link.label}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}
      {clipMissing ? (
        <p className="mt-3 shrink-0 text-xs leading-5 text-white/70">这一段城市短片还没有放进页面，先停在这一站的画面。</p>
      ) : null}
      <div className="mt-3 flex shrink-0 flex-wrap gap-2">
        <button
          type="button"
          aria-expanded={expanded === 'all'}
          onClick={onToggleAll}
          className="rounded-full border border-white/20 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b15c]"
        >
          {expanded === 'all' ? '收起' : '展开了解'}
        </button>
        {expanded && expanded !== 'all' ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b15c]"
          >
            收起
          </button>
        ) : null}
        {primaryLabel ? (
          <button
            type="button"
            onClick={onDepart}
            className="rounded-full bg-[#e6b15c] px-3 py-2 text-sm font-medium text-[#1b2430] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {primaryLabel}
          </button>
        ) : (
          <>
            <Link
              to="/projects"
              className="rounded-full bg-[#e6b15c] px-3 py-2 text-sm font-medium text-[#1b2430] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              查看我的作品
            </Link>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#e6b15c] px-3 py-2 text-sm font-medium text-[#1b2430] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              联系我
            </a>
            <Link
              to="/"
              className="rounded-full border border-white/20 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b15c]"
            >
              回到首页
            </Link>
          </>
        )}
      </div>
    </section>
  )
}
