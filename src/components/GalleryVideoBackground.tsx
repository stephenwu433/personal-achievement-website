import { useEffect, useRef, useState } from 'react'

const DEFAULT_VIDEO_SRC = '/backgrounds/gallery-background.mp4'
const DEFAULT_POSTER_SRC = '/backgrounds/meadow.webp'

export default function GalleryVideoBackground({
  videoSrc = DEFAULT_VIDEO_SRC,
  posterSrc = DEFAULT_POSTER_SRC,
}: {
  videoSrc?: string
  posterSrc?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onVisibility = () => {
      if (document.hidden) video.pause()
      else void video.play().catch(() => setFailed(true))
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [reduced, failed])

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <img
        src={posterSrc}
        alt=""
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: '72% 42%' }}
        fetchPriority="high"
        decoding="async"
      />
      {!reduced && !failed ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          className="absolute inset-0 size-full object-cover transition-opacity duration-300"
          style={{ objectPosition: '72% 42%', opacity: playing ? 1 : 0 }}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          onPlaying={() => setPlaying(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  )
}
