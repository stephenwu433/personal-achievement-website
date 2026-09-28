import { useEffect, useState } from 'react'
import { CircularGallery } from '@/components/ui/circular-gallery'
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
    <div className="bg-background text-foreground" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-dvh">
        <h1 className="sr-only">{profile.name}的个人网站</h1>
        <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
          <SiteHeader />
          <div className="relative min-h-0">
            <div className="absolute inset-0 max-sm:[zoom:0.78]">
              <CircularGallery items={homeGallery} radius={radius} autoRotateSpeed={0.03} />
            </div>
          </div>
          <p className="bg-background px-6 py-3 text-center text-sm text-muted-foreground">
            滚动页面，四张照片会转起来
          </p>
        </div>
      </div>
    </div>
  )
}
