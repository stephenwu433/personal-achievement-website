import { useEffect, useState } from 'react'
import { CircularGallery } from '@/components/ui/circular-gallery'
import SiteHeader from '@/src/components/SiteHeader'
import { homeGallery, profile } from '@/src/content'

function useGalleryRadius() {
  const [radius, setRadius] = useState(480)

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      if (width < 640) setRadius(210)
      else if (width < 1024) setRadius(300)
      else setRadius(380)
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
    document.title = 'Stephen舞 — 个人网站'
  }, [])

  return (
    <div className="bg-background text-foreground" style={{ height: '420vh' }}>
      <div className="sticky top-0 h-screen">
        <h1 className="sr-only">{profile.name}的个人网站</h1>
        <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
        <div className="relative z-30">
          <SiteHeader />
        </div>
        <div className="relative z-0 min-h-0">
          <div className="absolute inset-0">
            <CircularGallery items={homeGallery} radius={radius} autoRotateSpeed={0.03} />
          </div>
        </div>
        <p className="relative z-30 bg-background px-6 py-4 text-center text-sm text-muted-foreground">
          滚动页面，{profile.name} 的四张封面会转起来。点上方入口进入对应介绍。
        </p>
        </div>
      </div>
    </div>
  )
}
