import { useEffect, useState } from 'react'
import SiteHeader from '@/src/components/SiteHeader'
import { projectCells } from '@/src/content'

const BOARD_VIDEO = '/projects/project-gallery-natural-motion-loop.webm'
const BOARD_POSTER = '/projects/project-board.jpg'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Projects() {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#e7c49a] text-white">
      <SiteHeader />
      <main className="grid min-h-0 flex-1 place-items-center px-3 pb-3 [container-type:size]">
        <div
          className="relative max-h-full max-w-full"
          style={{
            aspectRatio: '1672 / 941',
            width: 'min(100cqw, calc(100cqh * 1672 / 941))',
          }}
        >
          <img src={BOARD_POSTER} alt="" className="absolute inset-0 size-full object-cover" />
          {reduced ? null : (
            <video
              className={`absolute inset-0 size-full object-cover ${videoReady ? 'opacity-100' : 'opacity-0'}`}
              src={BOARD_VIDEO}
              poster={BOARD_POSTER}
              muted
              loop
              autoPlay
              playsInline
              preload="auto"
              onPlaying={() => setVideoReady(true)}
            />
          )}
          {projectCells.map((cell, index) => (
            <button
              key={cell.id}
              type="button"
              aria-label={`第 ${index + 1} 个项目`}
              className="absolute rounded-md border border-white/0 bg-transparent transition hover:border-white/80 hover:bg-white/10 focus-visible:border-white focus-visible:bg-white/15 focus-visible:outline-none"
              style={{
                left: `${cell.x}%`,
                top: `${cell.y}%`,
                width: `${cell.width}%`,
                height: `${cell.height}%`,
              }}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
