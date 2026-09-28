import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import SiteHeader from '@/src/components/SiteHeader'
import Space from '@/src/scene/Space'
import { profile } from '@/src/content'

export default function Home() {
  useEffect(() => {
    document.title = `${profile.name} — 个人网站`
  }, [])

  return (
    <div className="relative h-dvh overflow-hidden bg-[#6a5344] text-white">
      <h1 className="sr-only">{profile.name}的个人网站</h1>
      <Canvas
        className="absolute inset-0"
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.15, 5.6], fov: 42, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Space />
      </Canvas>
      <SiteHeader overlay />
      <p className="pointer-events-none absolute inset-x-0 bottom-6 z-20 px-6 text-center text-sm text-white/85">
        拖动背景，转动这个空间。点上方入口，再进入对应的页面。
      </p>
    </div>
  )
}
