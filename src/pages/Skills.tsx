import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button'
import SiteHeader from '@/src/components/SiteHeader'
import { projectCells } from '@/src/content'
import { capabilities } from '@/src/pages/capability.data'
import { openCapability } from '@/src/pages/openCapability'
import SkillsIntro from '@/src/pages/SkillsIntro'

const BOARD_VIDEO = '/projects/project-gallery-natural-motion-loop.webm'
const BOARD_POSTER = '/projects/project-board.jpg'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Skills() {
  const navigate = useNavigate()
  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [videoReady, setVideoReady] = useState(false)
  const [hot, setHot] = useState<string | null>(null)
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 767px)').matches)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    const narrowMedia = window.matchMedia('(max-width: 767px)')
    const onNarrow = () => setNarrow(narrowMedia.matches)
    onNarrow()
    narrowMedia.addEventListener('change', onNarrow)
    return () => {
      media.removeEventListener('change', onChange)
      narrowMedia.removeEventListener('change', onNarrow)
    }
  }, [])

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#e7c49a] text-white">
      <SkillsIntro src={BOARD_POSTER} />
      <SiteHeader />
      <main className="grid min-h-0 flex-1 place-items-center px-3 pb-3 [container-type:size]">
        <div
          className="relative max-h-full max-w-full"
          style={{
            aspectRatio: '1672 / 941',
            width: 'min(100cqw, calc(100cqh * 1672 / 941))',
          }}
        >
          <img
            src={BOARD_POSTER}
            alt=""
            className="absolute inset-0 size-full object-cover"
            style={{ filter: hot && !reduced ? 'brightness(1.05)' : 'none', transition: reduced ? 'none' : 'filter 0.35s ease' }}
          />
          {reduced ? null : (
            <video
              className={`absolute inset-0 size-full object-cover ${videoReady ? 'opacity-100' : 'opacity-0'}`}
              style={{ filter: hot ? 'brightness(1.05)' : 'none', transition: 'filter 0.35s ease' }}
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
          {projectCells.map((cell) => {
            const capability = capabilities.find((entry) => entry.id === cell.id)
            const active = hot === cell.id
            return (
              <div
                key={cell.id}
                className="skills-hotspot absolute z-10 flex items-start justify-end"
                style={{
                  left: `${cell.x}%`,
                  top: `${cell.y}%`,
                  width: `${cell.width}%`,
                  height: `${cell.height}%`,
                }}
                onMouseEnter={() => setHot(cell.id)}
                onMouseLeave={() => setHot(null)}
              >
                <span
                  className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                  style={{ background: capability?.paper ?? '#fff', opacity: active ? 0.28 : 0 }}
                />
                <span
                  className="relative"
                  style={{
                    borderRadius: 999,
                    boxShadow: active && capability ? `0 0 0 2px ${capability.ink}` : 'none',
                    transition: reduced ? 'none' : 'box-shadow 0.3s ease',
                  }}
                >
                  <LiquidMetalButton
                    tone="sunset"
                    width={narrow ? 112 : 168}
                    label={cell.label}
                    onClick={() => openCapability(navigate, `/skills/${cell.id}`)}
                  />
                </span>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
