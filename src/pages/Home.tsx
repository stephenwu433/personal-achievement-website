import { useEffect, useState } from 'react'
import { CircularGallery } from '@/components/ui/circular-gallery'
import MeadowBackground from '@/src/components/MeadowBackground'
import SiteHeader from '@/src/components/SiteHeader'
import { homeGallery, profile } from '@/src/content'

function useGalleryFrame() {
  const [frame, setFrame] = useState({ radius: 320, cardWidth: 406, cardHeight: 441 })

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      const stage = Math.max(320, window.innerHeight - 128)
      const perspective = 2000
      const aspect = 0.92
      const visualHeight = Math.min(stage * (width < 640 ? 0.58 : 0.68), width < 640 ? 460 : 560)
      const visualWidth = Math.min(visualHeight * aspect, width * (width < 640 ? 0.84 : 0.46))
      const gap = width < 640 ? 22 : Math.min(72, width * 0.05)
      const radius = Math.round(Math.min(420, Math.max(150, visualWidth / 2 + gap)))
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

  useEffect(() => {
    document.title = `${profile.name} — 个人网站`
  }, [])

  return (
    <div className="text-foreground" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-dvh overflow-hidden bg-[#2c7ed8]">
        <h1 className="sr-only">{profile.name}的个人网站</h1>
        <MeadowBackground />
        <div className="pointer-events-none absolute inset-0 z-10">
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
        <div className="relative z-20 grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
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
