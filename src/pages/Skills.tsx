import { useEffect, useState } from 'react'
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button'
import SiteHeader from '@/src/components/SiteHeader'
import { projectCells } from '@/src/content'

const BOARD_VIDEO = '/projects/project-gallery-natural-motion-loop.webm'
const BOARD_POSTER = '/projects/project-board.jpg'

const abilities = [
  {
    id: 'language',
    title: '语言和工程',
    body: '这一组放语言和工程方面的能力。具体条目之后写在这里。',
  },
  {
    id: 'tools',
    title: '工具',
    body: '这一组放会用的工具。具体条目之后写在这里。',
  },
  {
    id: 'direction',
    title: '方向',
    body: '这一组放正在靠近的方向。具体内容之后写在这里。',
  },
]

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Skills() {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [videoReady, setVideoReady] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const opened = abilities.find((ability) => ability.id === openId) ?? null

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
          {projectCells.map((cell, index) => {
            const ability = abilities[index]
            return (
              <div
                key={cell.id}
                className="absolute flex items-start justify-end"
                style={{
                  left: `${cell.x}%`,
                  top: `${cell.y}%`,
                  width: `${cell.width}%`,
                  height: `${cell.height}%`,
                }}
              >
                <LiquidMetalButton
                  tone="sunset"
                  width={208}
                  label={ability?.title ?? ''}
                  ariaLabel={ability?.title ?? `第 ${index + 1} 个能力位置`}
                  onClick={ability ? () => setOpenId(ability.id) : undefined}
                />
              </div>
            )
          })}
          {opened ? (
            <section className="absolute bottom-4 left-4 z-20 max-w-sm rounded-3xl border border-white/30 bg-[#3a2416]/80 p-4 text-white shadow-2xl backdrop-blur-md">
              <h2 className="text-xl font-semibold">{opened.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/85">{opened.body}</p>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="mt-3 text-sm text-[#f3d7a1] underline underline-offset-4"
              >
                收起
              </button>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  )
}
