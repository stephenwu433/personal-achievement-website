import { useEffect, useState } from 'react'
import gsap from 'gsap'

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
    let live = true
    let loaded = false
    let resume: (() => void) | null = null
    const image = new Image()
    const markLoaded = () => {
      loaded = true
      resume?.()
    }
    image.onload = markLoaded
    image.onerror = markLoaded
    image.src = src

    const counter = { value: phase === 'short' ? 53 : 0 }
    const steps = phase === 'short' ? [78, 100] : [24, 57, 100]
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(SEEN_KEY, '1')
        window.setTimeout(() => {
          if (live) setPhase('off')
        }, phase === 'short' ? 160 : 240)
      },
    })
    steps.forEach((target, index) => {
      tl.to(counter, {
        value: target,
        duration: phase === 'short' ? 0.16 : 0.26,
        ease: 'power1.inOut',
        onStart: () => {
          if (target === 100 && !loaded) tl.pause()
        },
        onUpdate: () => setPercent(Math.round(counter.value)),
      })
      if (index < steps.length - 1) tl.to({}, { duration: phase === 'short' ? 0.08 : 0.14 })
    })
    resume = () => {
      if (tl.paused()) tl.resume()
    }
    if (image.complete) markLoaded()
    return () => {
      live = false
      tl.kill()
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
