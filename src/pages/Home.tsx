import { useEffect, useState } from 'react'
import { CircularGallery } from '@/components/ui/circular-gallery'
import MeadowBackground from '@/src/components/MeadowBackground'
import SiteHeader from '@/src/components/SiteHeader'
import { homeGallery, profile } from '@/src/content'

function useGalleryRadius() {
  const [radius, setRadius] = useState(460)

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      if (width < 640) setRadius(250)
      else if (width < 1024) setRadius(340)
      else setRadius(460)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return radius
}

export default function Home() {
  const radius = useGalleryRadius()

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
            <div className="absolute inset-0 max-sm:[zoom:0.78]">
              <CircularGallery items={homeGallery} radius={radius} autoRotateSpeed={0.03} />
            </div>
          </div>
          <p className="px-6 py-3 text-center text-sm text-white/85">滚动让照片转动，点击照片进入</p>
        </div>
      </div>
    </div>
  )
}
