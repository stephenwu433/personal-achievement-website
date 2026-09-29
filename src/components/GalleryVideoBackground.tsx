import { useEffect, useRef, useState } from 'react'

const VIDEO_SRC = '/backgrounds/gallery-background.mp4'
const POSTER_SRC = '/backgrounds/meadow.jpg'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function GalleryVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduced || failed) return
    video.muted = true
    const play = () => {
      void video.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
      })
    }
    if (video.readyState >= 2) play()
    else video.addEventListener('canplay', play, { once: true })
    return () => video.removeEventListener('canplay', play)
  }, [reduced, failed])

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <img
        src={POSTER_SRC}
        alt=""
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: '72% 42%' }}
        fetchPriority="high"
        decoding="async"
      />
      {reduced || failed ? null : (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: '72% 42%' }}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
