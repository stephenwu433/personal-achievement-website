import { useEffect, useRef, useState } from 'react'

const VIDEO_SRC = '/backgrounds/gallery-background.mp4'
const POSTER_SRC = '/backgrounds/meadow.jpg'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function playVideo(video: HTMLVideoElement) {
  video.muted = true
  return video.play().catch((error: unknown) => {
    if (error instanceof DOMException && error.name === 'AbortError') return
  })
}

export default function GalleryVideoBackground() {
  const firstRef = useRef<HTMLVideoElement>(null)
  const secondRef = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const first = firstRef.current
    const second = secondRef.current
    if (!first || !second || reduced || failed) return

    const videos = [first, second]
    let active = 0
    let startedNext = false
    let frame = 0

    for (const video of videos) {
      video.muted = true
      video.loop = false
    }
    first.style.opacity = '1'
    second.style.opacity = '0'
    void playVideo(first)
    void playVideo(second).then(() => {
      if (active === 0 && !startedNext) {
        second.pause()
        second.currentTime = 0
      }
    })

    const tick = () => {
      const current = videos[active]
      const next = videos[1 - active]
      const duration = current.duration
      if (Number.isFinite(duration) && duration > 0.4) {
        const fade = Math.min(0.55, duration * 0.2)
        const remain = duration - current.currentTime
        if (remain <= fade) {
          if (!startedNext) {
            startedNext = true
            next.currentTime = 0
            void playVideo(next)
          }
          if (next.readyState >= 2 && !next.paused && next.currentTime > 0) {
            const progress = Math.min(1, Math.max(0, (fade - remain) / fade))
            next.style.opacity = String(progress)
            current.style.opacity = String(1 - progress)
          }
          if ((current.ended || remain <= 0.03) && next.readyState >= 2 && !next.paused) {
            current.pause()
            current.style.opacity = '0'
            next.style.opacity = '1'
            active = 1 - active
            startedNext = false
          }
        }
      }
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [reduced, failed])

  const clipClass = 'absolute inset-0 size-full object-cover'

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <img
        src={POSTER_SRC}
        alt=""
        className={clipClass}
        style={{ objectPosition: '72% 42%' }}
        fetchPriority="high"
        decoding="async"
      />
      {reduced || failed ? null : (
        <>
          <video
            ref={firstRef}
            className={clipClass}
            style={{ objectPosition: '72% 42%' }}
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            muted
            playsInline
            preload="auto"
            onError={() => setFailed(true)}
          />
          <video
            ref={secondRef}
            className={clipClass}
            style={{ objectPosition: '72% 42%', opacity: 0 }}
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            muted
            playsInline
            preload="auto"
            onError={() => setFailed(true)}
          />
        </>
      )}
    </div>
  )
}
