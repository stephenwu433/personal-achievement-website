import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import {
  pauseTimes,
  segmentDuration,
  storyStations,
  videoSources,
  type StoryHotspot,
  type StoryStation,
  type VideoSource,
} from '@/src/about/story'
import { profile } from '@/src/content'

export type StoryPlayback = 'preview' | 'video'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

async function sourcePlays(source: VideoSource) {
  const urls = [source.webm, source.mp4].filter((url): url is string => Boolean(url))
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      const type = response.headers.get('content-type') ?? ''
      if (response.ok && type.startsWith('video/')) return true
    } catch {
      /* 文件还不存在时保持预览模式 */
    }
  }
  return false
}

function useStoryPlayback(reduced: boolean) {
  const [playback, setPlayback] = useState<StoryPlayback>('preview')

  useEffect(() => {
    const configured = videoSources.every((source) => source !== null)
    if (reduced || !configured) return
    let cancel = false
    Promise.all(videoSources.map((source) => sourcePlays(source as VideoSource))).then((ready) => {
      if (!cancel && ready.every(Boolean)) setPlayback('video')
    })
    return () => {
      cancel = true
    }
  }, [reduced])

  return playback
}

export default function About() {
  const [reduced] = useState(prefersReducedMotion)
  const playback = useStoryPlayback(reduced)
  const [mode, setMode] = useState<'film' | 'read'>(reduced ? 'read' : 'film')
  const [index, setIndex] = useState(0)

  if (mode === 'read') {
    return (
      <Reading
        reduced={reduced}
        playback={playback}
        onReturn={
          reduced
            ? undefined
            : () => {
                setMode('film')
              }
        }
      />
    )
  }

  return (
    <Film
      index={index}
      playback={playback}
      onIndex={setIndex}
      onRead={() => setMode('read')}
    />
  )
}

function Film({
  index,
  playback,
  onIndex,
  onRead,
}: {
  index: number
  playback: StoryPlayback
  onIndex: (index: number) => void
  onRead: () => void
}) {
  const station = storyStations[index]
  return (
    <FilmFrame
      key={station.id}
      station={station}
      index={index}
      playback={playback}
      onIndex={onIndex}
      onRead={onRead}
    />
  )
}

function FilmFrame({
  station,
  index,
  playback,
  onIndex,
  onRead,
}: {
  station: StoryStation
  index: number
  playback: StoryPlayback
  onIndex: (index: number) => void
  onRead: () => void
}) {
  const source = playback === 'video' ? videoSources[index] : null
  const [openId, setOpenId] = useState<string | null>(null)
  const [playing, setPlaying] = useState(playback === 'video')
  const videoRef = useRef<HTMLVideoElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const titleId = useId()
  const open = station.hotspots.find((hotspot) => hotspot.id === openId) ?? null
  const last = index === storyStations.length - 1
  const paused = !playing

  const holdAtPause = () => {
    const video = videoRef.current
    if (!video) return
    const limit = segmentDuration(index)
    if (video.currentTime > limit) video.currentTime = limit
    video.pause()
    setPlaying(false)
  }

  const openHotspot = (id: string) => {
    if (playback === 'video') holdAtPause()
    setOpenId(id)
  }

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (next: number) => {
    onIndex(next)
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#17202b] text-white" data-playback={playback}>
      <div className="relative min-h-0 flex-1">
      <div className="absolute inset-0 flex items-center justify-center [container-type:size]">
      <div className="relative aspect-video w-[min(100cqw,calc(100cqh*16/9))]">
      <img src={station.still} alt="" className="absolute inset-0 size-full object-cover transition-none" />
      {source ? (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={station.still}
          onPlaying={() => setPlaying(true)}
          onTimeUpdate={() => {
            const video = videoRef.current
            if (video && video.currentTime >= segmentDuration(index)) holdAtPause()
          }}
          onEnded={holdAtPause}
          onError={() => setPlaying(false)}
        >
          {source.webm ? <source src={source.webm} type="video/webm" /> : null}
          <source src={source.mp4} type="video/mp4" />
        </video>
      ) : null}
      <div className={`pointer-events-none absolute inset-0 ${paused ? 'bg-black/12' : 'bg-transparent'}`} />
      {playing
        ? null
        : station.hotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              aria-label={hotspot.label}
              aria-expanded={openId === hotspot.id}
              onClick={() => openHotspot(hotspot.id)}
              className="absolute z-20 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            >
              <span
                className={`size-3.5 rounded-full border border-white/90 bg-white/25 shadow-[0_0_0_6px_rgba(255,255,255,0.16)] ${
                  openId === hotspot.id ? 'scale-125 bg-white' : 'motion-safe:animate-pulse'
                }`}
              />
            </button>
          ))}
      </div>
      </div>
      <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 px-4 pt-4 sm:px-6">
        <Link to="/" className="shrink-0 rounded-full bg-black/35 px-3 py-2 text-sm backdrop-blur-md">
          返回首页
        </Link>
        <p className="rounded-2xl bg-black/35 px-3 py-2 text-right text-sm backdrop-blur-md">
          <span className="text-white/70">{station.index}</span> {station.title}
          <span className="mt-0.5 block text-xs text-white/75">{station.place}</span>
          {playback === 'preview' ? (
            <span className="mt-0.5 block text-xs text-amber-100/90">关键帧交互预览</span>
          ) : null}
        </p>
      </header>

      <p className="sr-only" aria-live="polite">
        {playback === 'preview'
          ? `关键帧交互预览。已停在第 ${station.index} 站，${station.place}。这不是最终动画。`
          : playing
            ? `正在播放第 ${station.index} 站，将在 ${pauseTimes[index]} 秒处暂停。`
            : `已停在第 ${station.index} 站，${station.title}。点场景或下方按钮阅读。`}
      </p>

      {open ? (
        <StoryPanel
          hotspot={open}
          titleId={titleId}
          panelRef={panelRef}
          onClose={() => setOpenId(null)}
        />
      ) : null}
      </div>

      <div className="relative z-40 shrink-0 px-3 py-3 sm:px-5">
        <div className="rounded-2xl border border-white/15 bg-black/40 px-3 py-3 backdrop-blur-md sm:px-4">
          {playback === 'preview' ? (
            <p className="mb-3 text-xs leading-5 text-white/75">
              关键帧交互预览。正式城市短片还没有接入，画面停在暂停帧上，不是最终动画。
            </p>
          ) : null}
          {playing ? (
            <p className="mb-3 text-sm text-white/80">这一段会在暂停点停住，再点场景阅读。</p>
          ) : (
            <div className="mb-3 flex flex-wrap gap-2">
              {station.hotspots.map((hotspot) => (
                <button
                  key={hotspot.id}
                  type="button"
                  aria-expanded={openId === hotspot.id}
                  onClick={() => openHotspot(hotspot.id)}
                  className={`rounded-full px-3 py-2 text-sm ${
                    openId === hotspot.id ? 'bg-white text-[#17202b]' : 'bg-white/15 text-white'
                  }`}
                >
                  {hotspot.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => go(index - 1)}
              className="shrink-0 rounded-full bg-white/15 px-3 py-2 text-sm whitespace-nowrap disabled:opacity-40"
            >
              上一站
            </button>
            <ol className="order-last flex w-full justify-center gap-1 sm:order-none sm:w-auto sm:flex-1 sm:gap-2" aria-label="六站进度">
              {storyStations.map((item, itemIndex) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-label={`${item.index} ${item.title}`}
                    aria-current={itemIndex === index ? 'step' : undefined}
                    onClick={() => go(itemIndex)}
                    className="flex size-8 items-center justify-center"
                  >
                    <span
                      className={`block size-2.5 rounded-full ${
                        itemIndex === index ? 'bg-white' : 'bg-white/35'
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ol>
            <button
              type="button"
              disabled={last}
              onClick={() => go(index + 1)}
              className="shrink-0 rounded-full bg-white px-3 py-2 text-sm whitespace-nowrap text-[#17202b] disabled:opacity-40"
            >
              继续探索
            </button>
          </div>
          <button type="button" onClick={onRead} className="mt-2 text-xs text-white/75 underline-offset-4 hover:underline">
            跳过动画直接阅读
          </button>
        </div>
      </div>
    </div>
  )
}

function StoryPanel({
  hotspot,
  titleId,
  panelRef,
  onClose,
}: {
  hotspot: StoryHotspot
  titleId: string
  panelRef: RefObject<HTMLElement | null>
  onClose: () => void
}) {
  const body = (
    <>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 id={titleId} className="text-lg font-semibold">
          {hotspot.label}
        </h2>
        <button type="button" onClick={onClose} className="rounded-full bg-white/15 px-3 py-1.5 text-sm">
          关闭
        </button>
      </div>
      <div className="space-y-3 text-sm leading-7 text-white/90 select-text">
        {hotspot.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {hotspot.link ? (
          <a href={hotspot.link.href} target="_blank" rel="noreferrer" className="inline-block underline underline-offset-4">
            {hotspot.link.label}
          </a>
        ) : null}
      </div>
    </>
  )

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-labelledby={titleId}
      className="absolute z-40 overflow-y-auto border border-white/15 bg-black/55 p-4 text-white shadow-2xl backdrop-blur-md outline-none inset-x-3 bottom-3 max-h-[62%] rounded-3xl md:inset-x-auto md:top-16 md:bottom-4 md:left-4 md:max-h-none md:w-[min(24rem,36vw)]"
    >
      {body}
    </aside>
  )
}

function Reading({
  reduced,
  playback,
  onReturn,
}: {
  reduced: boolean
  playback: StoryPlayback
  onReturn?: () => void
}) {
  return (
    <div className="min-h-dvh bg-[#17202b] text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-[#17202b]/90 px-4 py-3 backdrop-blur-md sm:px-6">
        <Link to="/" className="text-sm">
          Stephen<span className="text-white/70">舞</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {onReturn ? (
            <button type="button" onClick={onReturn} className="text-white/80">
              返回场景
            </button>
          ) : null}
          <a href={profile.github} target="_blank" rel="noreferrer" className="text-white/80">
            GitHub
          </a>
        </div>
      </header>
      <main className="mx-auto flex max-w-3xl flex-col gap-14 px-4 py-10 sm:px-6">
        <div>
          <h1 className="text-3xl font-semibold">个人介绍</h1>
          {playback === 'preview' ? (
            <p className="mt-3 text-sm leading-6 text-white/70">
              关键帧交互预览。下面是六站暂停帧和全部文字，不是最终动画。
            </p>
          ) : null}
          {reduced ? (
            <p className="mt-3 text-sm leading-6 text-white/70">已按减少动态的设置，直接展示六站关键帧和全部文字。</p>
          ) : null}
        </div>
        {storyStations.map((station) => (
          <article key={station.id} className="space-y-5">
            <img
              src={station.still}
              alt={`${station.index} ${station.title}，${station.place}`}
              className="aspect-video w-full rounded-3xl object-cover"
            />
            <header>
              <p className="text-sm text-white/60">
                {station.index} {station.place}
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{station.title}</h2>
            </header>
            {station.hotspots.map((hotspot) => (
              <section key={hotspot.id} className="space-y-3 text-[15px] leading-7 text-white/90 select-text">
                <h3 className="text-base font-semibold text-white">{hotspot.label}</h3>
                {hotspot.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {hotspot.link ? (
                  <a href={hotspot.link.href} target="_blank" rel="noreferrer" className="inline-block underline underline-offset-4">
                    {hotspot.link.label}
                  </a>
                ) : null}
              </section>
            ))}
          </article>
        ))}
      </main>
    </div>
  )
}
