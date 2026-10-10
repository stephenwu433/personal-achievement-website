import { useEffect, useState } from 'react'

const SEEN_KEY = 'skills-intro-seen'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** 首次等主图可显示再揭开；再次访问从过半进度短收。失败也会退出，不把页面留白。 */
export default function SkillsIntro({ src }: { src: string }) {
  const [phase, setPhase] = useState<'full' | 'short' | 'off'>(() => {
    if (prefersReducedMotion()) return 'off'
    return sessionStorage.getItem(SEEN_KEY) === '1' ? 'short' : 'full'
  })
  const [percent, setPercent] = useState(phase === 'short' ? 53 : 0)

  useEffect(() => {
    if (phase === 'off') return
    let cancelled = false
    const image = new Image()
    let loaded = false
    image.onload = () => {
      loaded = true
    }
    image.onerror = () => {
      loaded = true
    }
    image.src = src

    const steps = phase === 'short' ? [53, 78, 100] : [0, 24, 57, 100]
    let index = 0
    const tick = () => {
      if (cancelled) return
      const next = steps[Math.min(index, steps.length - 1)]
      if (next === 100 && !loaded) {
        window.setTimeout(tick, 80)
        return
      }
      setPercent(next)
      index += 1
      if (next >= 100) {
        sessionStorage.setItem(SEEN_KEY, '1')
        window.setTimeout(() => {
          if (!cancelled) setPhase('off')
        }, phase === 'short' ? 180 : 280)
        return
      }
      window.setTimeout(tick, phase === 'short' ? 90 : 220)
    }
    const start = window.setTimeout(tick, 40)
    return () => {
      cancelled = true
      window.clearTimeout(start)
    }
  }, [phase, src])

  if (phase === 'off') return null

  return (
    <div className="skills-intro fixed inset-0 z-[70] flex items-end bg-[#1a1a1a] text-[#f4efe6]" role="status" aria-live="polite">
      <p className="px-6 py-8 text-5xl tabular-nums" style={{ fontFamily: '"Noto Serif SC", serif' }}>
        {percent}%
      </p>
    </div>
  )
}
