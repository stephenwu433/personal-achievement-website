import { useEffect, useRef, useState } from 'react'
import { CircularGallery } from '@/components/ui/circular-gallery'
import GalleryVideoBackground from '@/src/components/GalleryVideoBackground'
import HomeArchive from '@/src/components/HomeArchive'
import SiteHeader from '@/src/components/SiteHeader'
import { homeGallery, profile } from '@/src/content'

function useGalleryFrame() {
  const [frame, setFrame] = useState({ radius: 480, cardWidth: 444, cardHeight: 482 })

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      const stage = Math.max(320, window.innerHeight - 128)
      const perspective = 2000
      const aspect = 0.92
      const visualHeight = Math.min(stage * (width < 640 ? 0.72 : 0.82), width < 640 ? 560 : 700)
      const visualWidth = Math.min(visualHeight * aspect, width * (width < 640 ? 0.88 : 0.5))
      const radius = Math.round(Math.min(perspective * 0.32, Math.max(width < 640 ? 240 : 460, visualWidth * 0.84)))
      const depth = (perspective - radius) / perspective
      const cardHeight = Math.round(visualHeight * depth)
      const cardWidth = Math.round(visualWidth * depth)
      setFrame({ radius, cardWidth, cardHeight })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return frame
}

export default function Home() {
  const { radius, cardWidth, cardHeight } = useGalleryFrame()
  const rootRef = useRef<HTMLDivElement>(null)
  const [blend, setBlend] = useState(0)

  useEffect(() => {
    document.title = `${profile.name} — 个人网站`
  }, [])

  useEffect(() => {
    const read = () => {
      const root = rootRef.current
      if (!root) return
      const total = root.offsetHeight - window.innerHeight
      const scrolled = total <= 0 ? 0 : Math.min(total, Math.max(0, -root.getBoundingClientRect().top))
      const progress = total <= 0 ? 0 : scrolled / total
      const fade = Math.min(1, Math.max(0, (progress - 0.035) / 0.16))
      const eased = fade * fade * (3 - 2 * fade)
      setBlend((current) => (Math.abs(current - eased) < 0.008 ? current : eased))
    }
    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    return () => {
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [])

  return (
    <div ref={rootRef} className="relative text-foreground" style={{ height: '640vh' }}>
      <div id="gallery" className="pointer-events-none absolute left-0 w-full" style={{ top: '22%' }} />
      <div className="sticky top-0 h-dvh overflow-hidden bg-[#2c7ed8]">
        <h1 className="sr-only">{profile.name}的个人网站</h1>
        <GalleryVideoBackground />
        <div className="pointer-events-none absolute inset-0 z-10" style={{ opacity: blend }}>
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 54% 50% at 50% 48%, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.3) 46%, rgba(0,0,0,0) 72%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div
          className="absolute inset-0 z-20"
          style={{
            opacity: 1 - blend,
            transform: `translateY(${blend * -28}px)`,
            pointerEvents: blend > 0.55 ? 'none' : 'auto',
          }}
        >
          <HomeArchive />
        </div>
        <div
          className="relative z-20 grid h-full grid-rows-[auto_minmax(0,1fr)_auto]"
          style={{
            opacity: blend,
            transform: `translateY(${(1 - blend) * 28}px)`,
            pointerEvents: blend < 0.45 ? 'none' : 'auto',
          }}
        >
          <SiteHeader onPhoto />
          <div className="relative min-h-0">
            <div className="absolute inset-0">
              <CircularGallery
                items={homeGallery}
                radius={radius}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                autoRotateSpeed={0.08}
              />
            </div>
          </div>
          <p className="px-6 py-3 text-center text-sm text-white/85">滚动让照片转动，点击照片进入</p>
        </div>
      </div>
    </div>
  )
}
