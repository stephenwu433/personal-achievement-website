import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger)
if (!CustomEase.get('type-in')) CustomEase.create('type-in', 'M0,0 C0.22,0.84 0.18,1 1,1')
import { CTASection } from '@/components/ui/cta-with-rectangle'
import AnkerCase from '@/src/projects/AnkerCase'
import HrCase from '@/src/projects/HrCase'
import LorealCase from '@/src/projects/LorealCase'
import MeijianCase from '@/src/projects/MeijianCase'
import PlanFlowCase from '@/src/projects/PlanFlowCase'
import SofaCase from '@/src/projects/SofaCase'
import MuseCase from '@/src/projects/MuseCase'
import { ankerLinks } from '@/src/projects/ankerCase.data'
import { hrLinks } from '@/src/projects/hrCase.data'
import { meijianLinks } from '@/src/projects/meijianCase.data'
import { planflowLinks } from '@/src/projects/planflowCase.data'
import SiteHeader from '@/src/components/SiteHeader'
import { profile } from '@/src/content'

type Piece = {
  id: string
  index: string
  title: string
  image: string
}

const pieces: Piece[] = [
  { id: 'meijian', index: '01', title: '梅见', image: '/projects/meijian.png' },
  { id: 'anker', index: '02', title: '安克创新', image: '/projects/anker.png' },
  { id: 'loreal', index: '03', title: '欧莱雅', image: '/projects/loreal.png' },
  { id: 'hr', index: '04', title: 'HR 招聘', image: '/projects/hr.png' },
  { id: 'sofa', index: '05', title: '海外压缩沙发', image: '/projects/sofa.png' },
  { id: 'muse', index: '06', title: 'Muse Select', image: '/projects/muse-select.png' },
  { id: 'planflow', index: '07', title: 'PlanFlow', image: '/projects/planflow.png' },
]

const serif = '"Iowan Old Style", Palatino, "Palatino Linotype", "Songti SC", "Noto Serif SC", serif'
const song = '"Noto Serif SC", "Source Han Serif SC", "STZhongsong", "华文中宋", "Songti SC", "SimSun", serif'

const flows: Record<string, { a: string; b: string; c: string }> = {
  meijian: { a: '#e7b7c4', b: '#8f3d4e', c: '#9eb7a4' },
  anker: { a: '#9eb6d8', b: '#2f5f9a', c: '#d5dde6' },
  loreal: { a: '#e7d7c4', b: '#c6a15a', c: '#9aaf96' },
  hr: { a: '#3f7a5e', b: '#c4a574', c: '#d9c7a4' },
  sofa: { a: '#6ea0d4', b: '#c4624a', c: '#d9c7a6' },
  muse: { a: '#1c1e24', b: '#3154c4', c: '#cfd3dc' },
  planflow: { a: '#3f6790', b: '#d07068', c: '#e4ddd4' },
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Projects() {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  if (reduced) return <ProjectReading />

  return <ProjectStage />
}

function ProjectIntro({ leaving }: { leaving: boolean }) {
  const motion = leaving
    ? 'projects-line-out 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) both'
    : 'projects-line-in 1s cubic-bezier(0.215, 0.61, 0.355, 1) both'

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center px-[7vw]">
      <div style={{ mixBlendMode: 'difference', color: '#000' }}>
        <div className="overflow-hidden">
          <h1
            className="m-0 text-[clamp(40px,4vw,64px)] leading-[1.1] font-normal"
            style={{ fontFamily: serif, animation: motion }}
          >
            {profile.name}
          </h1>
        </div>
        <div className="overflow-hidden">
          <p
            className="m-0 mt-2 text-[clamp(14px,1.25vw,18px)] leading-snug font-light text-black/50"
            style={{ fontFamily: serif, animation: motion, animationDelay: leaving ? '0s' : '0.1s' }}
          >
            项目实践
          </p>
        </div>
      </div>
    </div>
  )
}

type OpeningSpot = {
  x: number
  y: number
  fromX: number
  delay: number
  duration: number
  dir: number
}

const diamondCells = [
  [0, 0],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [0, -2],
  [0, 2],
]

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function easeInOutCubic(value: number) {
  const t = clamp01(value)
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function easeOutCubic(value: number) {
  return 1 - (1 - clamp01(value)) ** 3
}

function easeInCubic(value: number) {
  const t = clamp01(value)
  return t * t * t
}

type Pose = { x: number; y: number; w: number; h: number; opacity: number }

function bowedPoint(start: number, end: number, control: number, amount: number) {
  const t = clamp01(amount)
  const inverse = 1 - t
  return inverse * inverse * start + 2 * inverse * t * control + t * t * end
}

function glide(value: number) {
  return 1 - (1 - clamp01(value)) ** 3
}

function openingLayout(width: number, height: number) {
  const cardW = Math.min(width * 0.26, 250)
  const cardH = height * 0.34
  const narrow = width < 720
  const scale = narrow ? 0.42 : 0.62
  const maxRadius = Math.min(width, height) / 2 - 10
  const halfBox = (cardW + cardH) * scale * 0.38
  const fittedGap = Math.max(32, (maxRadius - halfBox) / Math.SQRT2)
  const gap = narrow ? fittedGap : Math.min(width, height) * 0.2
  return { scale, spots: buildOpening(gap, width) }
}

function buildOpening(gap: number, width: number): OpeningSpot[] {
  const reach = Math.max(...diamondCells.map(([x, y]) => Math.hypot(x, y)), 1)
  return diamondCells.slice(0, pieces.length).map(([col, row]) => {
    const x = col * gap
    const y = row * gap
    const dir = col === 0 ? (row < 0 ? -1 : 1) : Math.sign(col)
    const distance = Math.hypot(col, row) / reach
    return {
      x,
      y,
      fromX: col === 0 && row === 0 ? 0 : x - dir * width * 0.78,
      delay: distance * 0.22,
      duration: col === 0 && row === 0 ? 0.7 : 0.98,
      dir,
    }
  })
}

function stackLook(distance: number) {
  const opacity = distance >= 2.35 ? 0 : Math.max(0, 1 - Math.max(0, distance - 0.15) * 0.46)
  const scale = 1 - Math.min(distance, 1.15) * 0.055
  return { opacity, scale }
}

type GridCell = { x: number; y: number; w: number; h: number }

function fittedGrid(width: number, height: number): GridCell[] {
  const cols = width < 640 ? 2 : 3
  const rows = Math.ceil(pieces.length / cols)
  const top = width < 640 ? 108 : 128
  const bottom = 68
  const side = width < 640 ? 20 : 72
  const gap = 16
  const maxW = (width - side * 2 - gap * (cols - 1)) / cols
  const maxH = (height - top - bottom - gap * (rows - 1)) / rows
  let cellH = maxW * 1.18
  let cellW = maxW
  if (cellH > maxH) {
    cellH = maxH
    cellW = cellH / 1.18
  }
  const gridW = cols * cellW + (cols - 1) * gap
  const originX = (width - gridW) / 2
  return pieces.map((_, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    return {
      x: originX + col * (cellW + gap) + cellW / 2 - width / 2,
      y: top + row * (cellH + gap) + cellH / 2 - height / 2,
      w: cellW,
      h: cellH,
    }
  })
}

function ProjectStage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const focus = useRef(0)
  const frame = useRef(0)
  const slideRefs = useRef<Array<HTMLButtonElement | null>>([])
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([])
  const sliderSize = useRef({ w: 250, h: 360 })
  const layoutTarget = useRef(0)
  const scrollTween = useRef<gsap.core.Tween | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const morph = useRef<{ to: 0 | 1; start: number; poses: Pose[] } | null>(null)
  const focusPrev = useRef(0)
  const focusVel = useRef(0)
  const aboutExit = useRef(0)
  const counterRef = useRef<HTMLDivElement>(null)
  const counterWindowRef = useRef<HTMLDivElement>(null)
  const counterSlideRef = useRef<HTMLDivElement>(null)
  const aboutSlideRef = useRef<HTMLDivElement>(null)
  const categorySlideRef = useRef<HTMLDivElement>(null)
  const lineLeftRef = useRef<HTMLSpanElement>(null)
  const lineRightRef = useRef<HTMLSpanElement>(null)
  const wipeRefs = useRef<Array<HTMLSpanElement | null>>([])
  const readyAt = useRef(0)
  const chromeRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [mode, setMode] = useState<'slider' | 'grid'>('slider')
  const [compact, setCompact] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [origin, setOrigin] = useState<DOMRect | null>(null)
  const [phase, setPhase] = useState<'opening' | 'ready'>('opening')
  const [titlePhase, setTitlePhase] = useState<'in' | 'out' | 'gone'>('in')

  useLayoutEffect(() => {
    slideRefs.current.forEach((slide) => {
      if (slide) slide.style.opacity = '0'
    })
    if (headerRef.current) headerRef.current.style.opacity = '0'
    if (metaRef.current) metaRef.current.style.opacity = '0'
    if (titleRef.current) titleRef.current.style.opacity = '0'
    if (chromeRef.current) chromeRef.current.style.opacity = '0'
  }, [])

  useEffect(() => {
    if (phase !== 'opening') return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    const { spots, scale } = openingLayout(window.innerWidth, window.innerHeight)
    const angle = Math.PI / 4
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const lastArrival = Math.max(...spots.map((spot) => spot.delay + spot.duration))
    const hold = 0.9
    const foldAt = lastArrival + hold
    const foldDuration = 1.25
    const textExit = 1.45
    let titleLeft = false
    let titleGone = false
    let raf = 0
    const started = performance.now()

    const tick = (now: number) => {
      const elapsed = (now - started) / 1000
      if (!titleLeft && elapsed >= textExit) {
        titleLeft = true
        setTitlePhase('out')
      }
      if (!titleGone && elapsed >= textExit + 0.85) {
        titleGone = true
        setTitlePhase('gone')
      }

      const imageTime = elapsed - textExit
      if (imageTime < 0) {
        slideRefs.current.forEach((slide) => {
          if (!slide) return
          slide.style.opacity = '0'
        })
        raf = requestAnimationFrame(tick)
        return
      }

      const card = slideRefs.current[0]
      const cardHeight = card?.offsetHeight || window.innerHeight * 0.34
      const folding = imageTime >= foldAt
      const foldT = folding ? clamp01((imageTime - foldAt) / foldDuration) : 0
      const yBlend = easeInOutCubic(foldT / 0.92)
      const spin = easeInOutCubic(clamp01((foldT - 0.05) / 0.55))
      const scaleNow = scale + (1 - scale) * yBlend

      slideRefs.current.forEach((slide, index) => {
        if (!slide || !spots[index]) return
        const spot = spots[index]
        const flight = glide((imageTime - spot.delay) / spot.duration)
        const localX = spot.fromX + (spot.x - spot.fromX) * flight
        const localY = spot.y
        const worldX = localX * cos - localY * sin
        const worldY = localX * sin + localY * cos
        const lag = 0.08 + Math.min(index, 4) * 0.045
        const xBlend = easeInOutCubic(clamp01((imageTime - foldAt - lag) / (foldDuration * 0.72)))
        const stackY = index * cardHeight * 1.18
        const x = folding ? worldX * (1 - xBlend) : worldX
        const y = folding ? worldY + (stackY - worldY) * yBlend : worldY
        const rotation = 45 * (1 - (folding ? spin : 0))
        const wind = folding ? 0 : Math.sin(flight * Math.PI) * spot.dir * 7
        const opacity = folding
          ? 1 + ((index > 1.65 ? 0 : Math.max(0.35, 1 - index * 0.28)) - 1) * clamp01((foldT - 0.45) / 0.5)
          : Math.min(1, Math.max(0, (imageTime - spot.delay) / 0.35))
        slide.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotate(${rotation}deg) skewX(${wind}deg) scale(${scaleNow})`
        slide.style.opacity = String(opacity)
        slide.style.zIndex = String(30 - Math.round(Math.hypot(spot.x, spot.y)))
      })

      if (imageTime < foldAt + foldDuration) raf = requestAnimationFrame(tick)
      else {
        document.body.style.overflow = previousOverflow
        setPhase('ready')
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = previousOverflow
    }
  }, [phase])

  useLayoutEffect(() => {
    if (phase !== 'ready') return
    readyAt.current = performance.now()
    let last = performance.now()
    const release = () => {
      scrollTween.current?.kill()
    }
    window.addEventListener('wheel', release, { passive: true })
    window.addEventListener('touchstart', release, { passive: true })
    const ctx = gsap.context(() => {
      const root = rootRef.current
      if (!root) return
      const playhead = { p: 0 }
      const tween = gsap.to(playhead, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
        onUpdate: () => {
          if (morph.current || layoutTarget.current > 0.5) return
          focus.current = playhead.p * (pieces.length - 1)
        },
      })
      scrollTriggerRef.current = tween.scrollTrigger ?? null
    }, rootRef.current || undefined)

    const paint = (now: number) => {
      const dt = Math.min(0.048, (now - last) / 1000)
      last = now
      const width = window.innerWidth
      const height = window.innerHeight
      const motion = morph.current
      const elapsed = motion ? (now - motion.start) / 1000 : 0
      const morphDuration = motion?.to === 1 ? 1.42 : 1.95
      if (motion && elapsed >= morphDuration) {
        layoutTarget.current = motion.to
        morph.current = null
        if (motion.to === 1) scrollTriggerRef.current?.disable()
        else scrollTriggerRef.current?.enable()
        setMode(motion.to === 1 ? 'grid' : 'slider')
        setCompact(motion.to === 1)
      }
      const traveling = morph.current

      if (traveling) scrollTween.current?.kill()

      const focusDelta = focus.current - focusPrev.current
      focusVel.current += (focusDelta / Math.max(dt, 0.008) - focusVel.current) * 0.4
      focusPrev.current = focus.current
      const stretch = traveling || layoutTarget.current > 0.5 ? 0 : Math.min(0.1, Math.abs(focusVel.current) * 0.075)

      const base = sliderSize.current
      const cells = fittedGrid(width, height)
      const reveal = clamp01((now - readyAt.current) / 720)
      const leavingAbout = aboutExit.current > 0 ? clamp01((now - aboutExit.current) / 420) : 0
      if (aboutExit.current && now - aboutExit.current > 460) {
        aboutExit.current = 0
        navigate('/about')
      }

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return
        const distance = Math.abs(index - focus.current)
        const look = stackLook(distance)
        const cell = cells[index] ?? { x: 0, y: 0, w: base.w, h: base.h }
        const sliderPose = {
          x: 0,
          y: (index - focus.current) * base.h * 1.18,
          w: base.w * look.scale,
          h: base.h * look.scale,
          opacity: look.opacity,
        }
        const gridPose = { x: cell.x, y: cell.y, w: cell.w, h: cell.h, opacity: 1 }
        let pose = layoutTarget.current > 0.5 ? gridPose : sliderPose
        let spin = 0
        let squash = 1
        let bulge = 1
        const flight = morph.current
        if (flight) {
          const travelStart = flight.to === 1 ? 0.38 : 0
          const amount = easeInOutCubic((elapsed - travelStart) / 1)
          const from = flight.poses[index] ?? sliderPose
          const goal = flight.to === 1 ? gridPose : sliderPose
          const dx = goal.x - from.x
          const dy = goal.y - from.y
          const length = Math.hypot(dx, dy) || 1
          const midX = (from.x + goal.x) / 2
          const midY = (from.y + goal.y) / 2
          const outward = Math.hypot(midX, midY) || 1
          const controlX = midX + (midX / outward) * length * 0.2
          const controlY = midY + (midY / outward) * length * 0.2
          const sway = Math.sin(amount * Math.PI)
          pose = {
            x: bowedPoint(from.x, goal.x, controlX, amount),
            y: bowedPoint(from.y, goal.y, controlY, amount),
            w: from.w + (goal.w - from.w) * amount,
            h: from.h + (goal.h - from.h) * amount,
            opacity: from.opacity + (goal.opacity - from.opacity) * amount,
          }
          spin = (sway * Math.atan2(dy, dx) * 0.05 * 180) / Math.PI
          const horizontal = Math.abs(dx) > Math.abs(dy)
          squash = horizontal ? 1 - sway * 0.08 : 1 + sway * 0.04
          bulge = horizontal ? 1 + sway * 0.04 : 1 - sway * 0.08
        }
        const hidden = openIdRef.current === pieces[index]?.id
        const restingSlider = !flight && layoutTarget.current < 0.5
        if (restingSlider) {
          slide.style.width = ''
          slide.style.height = ''
          slide.style.transform = `translate3d(-50%, calc(-50% + ${(index - focus.current) * 118}%), 0) scale(${look.scale}, ${look.scale * (1 + stretch)})`
        } else {
          slide.style.width = `${pose.w}px`
          slide.style.height = `${pose.h}px`
          slide.style.transform = `translate3d(calc(-50% + ${pose.x}px), calc(-50% + ${pose.y}px), 0) rotate(${spin}deg) scale(${squash}, ${bulge})`
        }
        slide.style.opacity = hidden ? '0' : String(pose.opacity)
        slide.style.zIndex = String(20 - Math.round(distance))
        const label = labelRefs.current[index]
        if (label) {
          const labelAmount = flight?.to === 1 ? easeInOutCubic((elapsed - 0.7) / 0.6) : flight ? 1 - easeInOutCubic(elapsed / 0.35) : layoutTarget.current
          label.style.opacity = String(hidden ? 0 : labelAmount)
          label.style.transform = `translate3d(calc(-50% + ${pose.x}px), calc(-50% + ${pose.y + pose.h / 2 + 14}px), 0)`
        }
        const wipe = wipeRefs.current[index]
        if (wipe) {
          const cover = flight?.to === 0 && look.opacity < 0.15 ? easeInCubic(elapsed / 0.45) : 0
          wipe.style.transform = `scaleX(${cover})`
        }
      })

      if (!traveling && layoutTarget.current < 0.5) {
        const resting = slideRefs.current[0]
        if (resting && !resting.style.width) sliderSize.current = { w: resting.offsetWidth, h: resting.offsetHeight }
      }

      let lineScale = reveal
      let chromeShift = leavingAbout
      if (motion && elapsed < morphDuration) {
        if (motion.to === 1) {
          lineScale = 1 - easeOutCubic(elapsed / 0.6)
          chromeShift = Math.max(chromeShift, easeOutCubic(elapsed / 0.35))
        } else {
          lineScale = easeOutCubic((elapsed - 1.3) / 0.6)
          chromeShift = Math.max(chromeShift, 1 - easeOutCubic((elapsed - 1.15) / 0.45))
        }
      } else if (layoutTarget.current > 0.5) {
        lineScale = 0
        chromeShift = 1
      }
      const shift = `translateY(${-chromeShift * 110}%)`
      if (lineLeftRef.current) lineLeftRef.current.style.transform = `scaleX(${lineScale})`
      if (lineRightRef.current) lineRightRef.current.style.transform = `scaleX(${lineScale})`
      if (counterSlideRef.current) counterSlideRef.current.style.transform = shift
      if (aboutSlideRef.current) aboutSlideRef.current.style.transform = shift
      if (categorySlideRef.current) categorySlideRef.current.style.transform = shift
      if (titleRef.current) titleRef.current.style.transform = shift
      const counterRow = counterRef.current?.querySelector('p')
      if (counterRef.current && counterWindowRef.current && counterRow) {
        const rowHeight = counterRow.getBoundingClientRect().height
        counterWindowRef.current.style.height = `${rowHeight}px`
        counterRef.current.style.transform = `translateY(${-focus.current * rowHeight}px)`
      }
      if (chromeRef.current) {
        chromeRef.current.style.opacity = String(reveal)
        chromeRef.current.style.pointerEvents = chromeShift > 0.45 ? 'none' : 'auto'
      }
      if (metaRef.current) metaRef.current.style.opacity = String(reveal)
      if (aboutRef.current) aboutRef.current.style.pointerEvents = chromeShift < 0.2 && reveal > 0.65 ? 'auto' : 'none'
      if (titleRef.current) titleRef.current.style.opacity = String(reveal)
      if (headerRef.current) {
        headerRef.current.style.opacity = String(reveal)
        headerRef.current.style.transform = `translateY(${(1 - reveal) * -10}px)`
      }

      const nearest = Math.min(pieces.length - 1, Math.max(0, Math.round(focus.current)))
      setActive((current) => (current === nearest ? current : nearest))
      frame.current = requestAnimationFrame(paint)
    }

    frame.current = requestAnimationFrame(paint)
    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener('wheel', release)
      window.removeEventListener('touchstart', release)
      ctx.revert()
      scrollTriggerRef.current = null
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'ready') return
    if (compact) {
      window.scrollTo(0, 0)
      const previous = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previous
      }
    }
    const root = rootRef.current
    if (!root) return
    const total = root.offsetHeight - window.innerHeight
    window.scrollTo(0, root.offsetTop + (total * focus.current) / (pieces.length - 1))
    ScrollTrigger.refresh()
  }, [compact, phase])

  const glideTo = (index: number) => {
    const root = rootRef.current
    if (!root || morph.current) return
    const next = Math.min(pieces.length - 1, Math.max(0, index))
    const total = root.offsetHeight - window.innerHeight
    const dest = root.offsetTop + (total * next) / (pieces.length - 1)
    scrollTween.current?.kill()
    const proxy = { y: window.scrollY }
    scrollTween.current = gsap.to(proxy, {
      y: dest,
      duration: 0.9,
      ease: 'power3.inOut',
      overwrite: true,
      onUpdate: () => window.scrollTo(0, proxy.y),
    })
  }

  const openIdRef = useRef<string | null>(null)
  openIdRef.current = openId

  const current = pieces[active]
  const opened = pieces.find((piece) => piece.id === openId) ?? null

  const beginMorph = (to: 0 | 1) => {
    if (morph.current || to === layoutTarget.current) return
    const width = window.innerWidth
    const height = window.innerHeight
    const cells = fittedGrid(width, height)
    const poses = slideRefs.current.map((slide, index) => {
      const rect = slide?.getBoundingClientRect()
      const pose = rect
        ? {
            x: rect.left + rect.width / 2 - width / 2,
            y: rect.top + rect.height / 2 - height / 2,
            w: rect.width,
            h: rect.height,
            opacity: Number.parseFloat(slide?.style.opacity || '1'),
          }
        : { x: 0, y: 0, w: sliderSize.current.w, h: sliderSize.current.h, opacity: 1 }
      if (to !== 1 || pose.opacity >= 0.08) return pose
      const cell = cells[index]
      if (!cell) return pose
      const reach = Math.hypot(cell.x, cell.y) || 1
      return {
        x: cell.x + (cell.x / reach) * width * 0.62,
        y: cell.y + (cell.y / reach) * height * 0.42,
        w: cell.w,
        h: cell.h,
        opacity: 0,
      }
    })
    morph.current = { to, start: performance.now(), poses }
    layoutTarget.current = to
  }

  const chooseMode = (next: 'slider' | 'grid') => beginMorph(next === 'grid' ? 1 : 0)

  return (
    <div
      ref={rootRef}
      className="bg-[#f7f5f2] text-[#1a1a1a]"
      style={{ height: compact ? '100vh' : `${pieces.length * 70 + 100}vh` }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div
          ref={headerRef}
          className={`relative z-30 ${phase === 'ready' ? '' : 'pointer-events-none'}`}
        >
          <SiteHeader />
        </div>
        {titlePhase !== 'gone' ? <ProjectIntro leaving={titlePhase === 'out'} /> : null}
        <div className="pointer-events-none absolute inset-0 z-10" style={{ visibility: openId ? 'hidden' : 'visible' }}>
          {pieces.map((piece, index) => (
            <button
              key={piece.id}
              ref={(node) => {
                slideRefs.current[index] = node
              }}
              type="button"
              aria-label={piece.title}
              className="project-card pointer-events-auto absolute top-1/2 left-1/2 h-[34vh] w-[min(26vw,250px)] overflow-hidden bg-[#ddd8d0]"
              style={{ pointerEvents: phase === 'ready' ? undefined : 'none' }}
              onClick={() => {
                if (phase !== 'ready' || morph.current) return
                const centered = layoutTarget.current > 0.5 || Math.abs(index - focus.current) < 0.42
                if (!centered) {
                  glideTo(index)
                  return
                }
                const slide = slideRefs.current[index]
                if (slide) slide.style.opacity = '0'
                setOrigin(slide?.getBoundingClientRect() ?? null)
                setOpenId(piece.id)
              }}
            >
              <img src={piece.image} alt="" className="size-full object-cover" draggable={false} />
              <span
                ref={(node) => {
                  wipeRefs.current[index] = node
                }}
                className="pointer-events-none absolute inset-0 origin-right bg-[#f7f5f2]"
                style={{ transform: 'scaleX(0)' }}
              />
              {phase === 'ready' && mode === 'slider' && index === active ? (
                <span className="project-diamond absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white" />
              ) : null}
            </button>
          ))}
          {pieces.map((piece, index) => (
            <span
              key={`${piece.id}-label`}
              ref={(node) => {
                labelRefs.current[index] = node
              }}
              className="pointer-events-none absolute top-1/2 left-1/2 text-sm text-[#1a1a1a] opacity-0"
              style={{ fontFamily: serif }}
            >
              {piece.index} {piece.title}
            </span>
          ))}
        </div>
        <div
          ref={metaRef}
          className="pointer-events-none absolute inset-x-0 top-28 bottom-8 z-20 grid grid-cols-[1fr_minmax(180px,280px)_1fr] items-center px-6 sm:px-10"
          style={{ visibility: openId ? 'hidden' : 'visible' }}
        >
          <div className="overflow-hidden pr-4">
            <div ref={counterSlideRef} className="flex items-center gap-4">
              <div ref={counterWindowRef} className="overflow-hidden">
                <div ref={counterRef}>
                  {pieces.map((piece) => (
                    <p key={piece.id} className="text-4xl italic sm:text-5xl" style={{ fontFamily: serif, lineHeight: 1, padding: '0.14em 0' }}>
                      {piece.index}
                    </p>
                  ))}
                </div>
              </div>
              <span className="text-2xl text-black/35 sm:text-3xl" style={{ fontFamily: serif }}>
                / {pieces[pieces.length - 1].index}
              </span>
              <span ref={lineLeftRef} className="hidden h-px min-w-8 flex-1 origin-left bg-black/25 sm:block" />
            </div>
          </div>
          <div />
          <div className="overflow-hidden pl-4">
            <div ref={aboutSlideRef} className="flex items-center gap-4">
              <span ref={lineRightRef} className="hidden h-px min-w-8 flex-1 origin-right bg-black/25 sm:block" />
              <div ref={aboutRef} className="pointer-events-none">
                <Link
                  to="/about"
                  className="text-xs tracking-[0.22em]"
                  onClick={(event) => {
                    event.preventDefault()
                    if (aboutExit.current || morph.current) return
                    aboutExit.current = performance.now()
                  }}
                >
                  关于
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={phase === 'ready' && !openId ? undefined : 'pointer-events-none'} style={{ visibility: openId ? 'hidden' : 'visible' }}>
          <ProjectChrome
            current={current}
            mode={mode}
            categoryRef={chromeRef}
            categorySlideRef={categorySlideRef}
            onMode={chooseMode}
            onPick={(index) => {
              if (morph.current) return
              if (layoutTarget.current > 0.5) {
                focus.current = index
                beginMorph(0)
                return
              }
              glideTo(index)
            }}
          />
        </div>
        <div className="absolute bottom-6 left-8 overflow-hidden" style={{ visibility: openId ? 'hidden' : 'visible' }}>
          <p ref={titleRef} className="text-[11px] tracking-[0.18em] text-black/55" style={{ fontFamily: serif }}>
            {current.title}
          </p>
        </div>
        {opened ? (
          <PieceDetail
            key={opened.id}
            piece={opened}
            origin={origin}
            onClose={() => {
              setOpenId(null)
              setOrigin(null)
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

function ProjectChrome({
  current,
  mode,
  categoryRef,
  categorySlideRef,
  onMode,
  onPick,
}: {
  current: Piece
  mode: 'slider' | 'grid'
  categoryRef: RefObject<HTMLDivElement | null>
  categorySlideRef: RefObject<HTMLDivElement | null>
  onMode: (mode: 'slider' | 'grid') => void
  onPick: (index: number) => void
}) {
  return (
    <>
      <div ref={categoryRef} className="absolute top-28 right-6 z-30 hidden overflow-hidden text-right sm:block">
        <div ref={categorySlideRef} style={{ fontFamily: serif }}>
        <p className="text-sm tracking-[0.14em] underline decoration-black/70 underline-offset-4">项目</p>
        <ul className="mt-3 space-y-1 text-xs text-black/55">
          {pieces.map((piece, index) => (
            <li key={piece.id}>
              <button
                type="button"
                className={piece.id === current.id ? 'text-black' : ''}
                onClick={() => onPick(index)}
              >
                {piece.title}
              </button>
            </li>
          ))}
        </ul>
        </div>
      </div>
      <div className="absolute right-6 bottom-6 z-30 text-right" style={{ fontFamily: serif }}>
        <p className="text-sm tracking-[0.14em] underline decoration-black/70 underline-offset-4">展示</p>
        <p className="mt-2 text-xs">
          <button type="button" className={mode === 'slider' ? 'text-black' : 'text-black/40'} onClick={() => onMode('slider')}>
            滑动
          </button>
          <span className="px-1 text-black/30">/</span>
          <button type="button" className={mode === 'grid' ? 'text-black' : 'text-black/40'} onClick={() => onMode('grid')}>
            网格
          </button>
        </p>
      </div>
    </>
  )
}

type ProjectRecord = {
  name: string
  tag: string
  line: string
  status: '公开案例' | '可运行原型' | '产品设计阶段' | '增长项目' | '概念验证'
  scene: string[]
  judgment: string[]
  mechanism: string[]
  evidence: { kind: string; title: string; lines: string[]; source: string }[]
  state: string[]
  takeaway: string
}

const records: Record<string, ProjectRecord> = {
  meijian: {
    name: '梅见品牌证据决策系统',
    tag: 'BRAND DECISION SYSTEM / TOP 40',
    line: '为品牌研究与方向选择设计一套“证据—候选方向—反例攻击—人工决策—验证反馈”的可审计工作流。',
    status: '公开案例',
    scene: ['品牌策略讨论容易停留在主观判断。研究材料很多，但证据从哪里来、候选方向如何被比较、为什么淘汰某个方向，往往无法追溯。'],
    judgment: ['AI 不应该直接替代品牌决策。', '更重要的是让它帮助整理证据、生成候选、提出反例；关键选择、修改和责任仍由人完成。'],
    mechanism: ['汇集研究材料并结构化整理。', '生成品牌方向候选。', '通过竞争替代、证据充分性、产品承接等压力测试。', '使用 Gold、Challenge、Holdout 区分校准、压力测试与盲测。', '人工确认方向，记录修订、补证或退出理由。'],
    evidence: [
      { kind: '流程图', title: '决策工作流与 Agent 分工', lines: ['1 个编排器 + 4 类职责 Agent。', '43 项任务拆解，把证据整理、候选生成和人工确认分开。'], source: '设计产物' },
      { kind: '规则 / Brief', title: 'Gold / Challenge / Holdout', lines: ['用三套集合区分校准、压力测试与盲测。', '证据状态、版本快照和审计规则一起保留。'], source: '设计产物' },
      { kind: '测试或复盘', title: '问卷与续答', lines: ['56 份有效问卷。', '51 人续答。'], source: '用户反馈' },
      { kind: '原型', title: '公开 Demo 与验收', lines: ['23 个验收用例。', '公开 Demo 为冻结回放；本地链路才支持实时推理。'], source: '本地测试' },
    ],
    state: ['已有公开展示与原型证据。', '它证明的是问题拆解、证据治理、评估与人机协同能力，不代表品牌策略已被企业规模化采用。'],
    takeaway: '我把品牌选择收成可回溯的记录：证据来源、候选比较、淘汰理由和人工确认留在同一条工作流里。',
  },
  anker: {
    name: '安克智能售后服务 Agent',
    tag: 'AFTER-SALES AGENT / RUNNABLE PROTOTYPE',
    line: '将售后对话拆成事实确认、风险门禁、步骤依赖、人工升级与局部回退，而不是只生成一段客服回复。',
    status: '可运行原型',
    scene: ['售后咨询会涉及设备状态、订单事实、风险判断和下一步操作。单纯的语言模型回复难以稳定处理状态冲突、依赖关系和高风险情况。'],
    judgment: ['AI 适合处理用户表达、意图和语言事实；', '业务规则需要明确控制安全、状态、步骤依赖与人工接管。'],
    mechanism: ['识别用户意图与已知事实。', '根据事实版本和设备状态判断可执行步骤。', '对冲突、高风险或信息不足情况进入 ASK / HANDOFF。', '发生变更时仅回退受影响步骤，避免全流程重来。', '记录决策路径，支持复盘。'],
    evidence: [
      { kind: '流程图', title: '状态机与步骤依赖', lines: ['事实版本决定哪些步骤可以执行。', '变更时只回退受影响步骤。'], source: '设计产物' },
      { kind: '原型', title: '模拟工单环境', lines: ['可运行的模拟工单 Demo。', 'Streamlit 原型与公开代码仓库。'], source: '设计产物' },
      { kind: '测试或复盘', title: '本地自动化测试', lines: ['86 项本地自动化测试通过。'], source: '本地测试' },
      { kind: '测试或复盘', title: '异常路径', lines: ['覆盖 ASK、人工接管和回退。', '状态流转留有架构图，供复盘对照。'], source: '本地测试' },
    ],
    state: ['原型与测试环境已完成验证。', '它不是安克官方生产系统，也不应展示为真实企业客服上线成果。'],
    takeaway: '我把售后处理拆成事实版本、风险门禁、步骤依赖和局部回退，高风险情况进入追问或人工接管。',
  },
  loreal: {
    name: '数据共情智能服务系统',
    tag: 'DATA EMPATHY SERVICE SYSTEM',
    line: '把聊天、订单、售后和历史承诺收成同一条服务轨迹，让客服知道该回复、补问还是升级。',
    status: '产品设计阶段',
    scene: ['护肤困扰往往描述模糊，且会涉及安全风险、重复推荐和复杂售后。用户需要的不只是产品答案，而是被理解、被引导和被正确分流。'],
    judgment: ['产品第一步不应急着给推荐。', '先判断信息是否足够、是否需要追问、是否存在风险，再决定自动回答、辅助人工或直接升级。'],
    mechanism: ['识别用户需求与已知信息。', '对信息不足的情况发起最少必要追问。', '将问题分为自动回复、Agent 辅助、人工处理。', '用状态机处理排查、结果反馈、继续排查与转人工。', '为每次输出保留证据、限制和安全边界。'],
    evidence: [
      { kind: '规则 / Brief', title: '范围与字段合同', lines: ['PRD 写明 P0 / P1 / P2。', '5 项最小标注字段，5 类 AI 输出。'], source: '设计产物' },
      { kind: '流程图', title: '排查到升级', lines: ['用状态机串起排查、结果反馈、继续排查和转人工。', '搓泥排查是其中一条典型服务流程。'], source: '设计产物' },
      { kind: '规则 / Brief', title: '三种服务模式', lines: ['AUTO_REPLY / AGENT_ASSIST / HUMAN_REQUIRED。', '信息不足时先做最少必要追问。'], source: '设计产物' },
      { kind: '原型', title: '服务流程原型', lines: ['页面保留机制和服务边界。'], source: '设计产物' },
    ],
    state: ['属于产品设计与原型阶段。', '页面应展示机制与服务边界，不写成已接入欧莱雅正式系统。'],
    takeaway: '我把服务的第一步放在分流：先核对信息够不够、要不要追问、有没有风险，再决定自动回答、辅助或升级。',
  },
  hr: {
    name: '岗证匹配',
    tag: 'TASK-DRIVEN RECRUITMENT EVIDENCE REVIEW',
    line: '把企业业务任务收成经用人经理确认的招聘标准，再从简历原文找回值得 HR 再看一眼的人。',
    status: '可运行原型',
    scene: ['招聘筛选容易被简历表述、模型幻觉或模糊评分影响。若没有统一证据标准，AI 推荐结果无法解释，也无法被招聘者复核。'],
    judgment: ['先定义岗位能力证据和人工 Gold 标准，再讨论模型效果。', '模型输出需要与证据绑定；材料不足时必须允许“不确定”，不能强行给结论。'],
    mechanism: ['将候选人材料拆成可核对证据。', '使用 BARS Rubric 标注能力表现。', '对信息不足样本输出 INSUFFICIENT。', '分离校准集、Challenge 集与 Holdout 集。', '比较基础模型、明确 Rubric 模型与完整机制的差异。'],
    evidence: [
      { kind: '规则 / Brief', title: 'P0 与 BARS Rubric', lines: ['先写招聘筛选 P0 和能力证据字段。', '表现按 BARS Rubric 标注，方便人工复核。'], source: '设计产物' },
      { kind: '规则 / Brief', title: '评估集合', lines: ['校准集、Challenge 集和 Holdout 集分开。', '信息不足时输出 INSUFFICIENT。'], source: '设计产物' },
      { kind: '规则 / Brief', title: '人工复核', lines: ['推荐结果绑定证据。', '人工复核保留原因码。'], source: '设计产物' },
      { kind: '原型', title: '合成样本上的原型', lines: ['用可运行原型和合成测试样本核对机制。', '样本不是真实候选人，页面不写招聘准确率。'], source: '设计产物' },
    ],
    state: ['当前以合成测试材料验证产品机制。', '不能展示为真实招聘准确率，也不能展示为企业级招聘筛选结果。'],
    takeaway: '我把筛选收成证据标注：能力表现对照 Rubric，材料不足就标 INSUFFICIENT，结论要能被招聘者核对。',
  },
  sofa: {
    name: '压缩沙发海外 TikTok 内容增长',
    tag: 'COMPRESSED SOFA / TIKTOK B2B GROWTH',
    line: '把装柜、运费、回弹、试单和工厂能力，写成可拍摄、可承接询盘的 ToB 内容。',
    status: '增长项目',
    scene: ['海外压缩沙发的购买者关心的不只是产品外观，还会判断运输成本、目标市场、压缩方式、采购量和转售可能性。'],
    judgment: ['内容不能按照消费者“选家具”的逻辑写。', '需要站在进口商、批发商、跨境卖家和连锁采购方的决策角度，先解决他们对选品与利润的疑问。'],
    mechanism: ['提炼海外买家的典型顾虑。', '用前几秒钩子建立场景和价值解释。', '在脚本中嵌入产品卖点与询盘引导。', '根据播放、评论与询盘反馈迭代模板。', '沉淀可复用的 ToB 脚本结构。'],
    evidence: [
      { kind: '规则 / Brief', title: '脚本与模板', lines: ['50+ 条海外短视频脚本。', '10+ 套可复用脚本模板。'], source: '设计产物' },
      { kind: '规则 / Brief', title: '卖点与询盘引导', lines: ['脚本里写入空间、物流、压缩方式和采购量。', '评论区引导话术跟在卖点后面。'], source: '设计产物' },
      { kind: '测试或复盘', title: '内容复盘规则', lines: ['按播放、评论和询盘反馈回到钩子、卖点和模板。'], source: '项目复盘' },
      { kind: '测试或复盘', title: '播放与客资', lines: ['后续平均播放量提升 35%。', '2,000+ 潜在线索，500+ 高意向客资。', '统计口径与个人贡献范围尚未写入，这些数字不作为个人独立业绩。'], source: '待补证' },
    ],
    state: ['此项目属于知君竹阶段的增长案例。', '展示时需标明数据统计口径与个人贡献范围。'],
    takeaway: '我按进口商和批发商的物流、压缩方式、采购量和转售疑问来组织脚本，再把询盘引导放进同一条内容结构。',
  },
  muse: {
    name: 'Muse Select AI 穿搭内容实验',
    tag: 'MUSESELECT / AI FASHION CONTENT LAB',
    line: '把“今天穿什么”拆成可以点击、保存和讨论的 AI 穿搭图文。',
    status: '增长项目',
    scene: ['许多人已经在用 AI 做时尚相关创作，但他们分散在不同能力层级和创作方式中，缺少一个低门槛、能展示实际作品的参与入口。'],
    judgment: ['不把社区定义成“只招设计师”的圈层。', '重点是找到真正把 AI 用进时尚表达的人，让不同经验的人都能以作品和方法加入。'],
    mechanism: ['定义创作者参与范围：穿搭、视觉生成、衣橱、趋势、选品。', '设计低门槛招募入口与作品提交方式。', '用内容模板降低表达成本。', '将创作案例沉淀为可浏览的主题内容。', '根据互动反馈调整招募语言和展示方式。'],
    evidence: [
      { kind: '规则 / Brief', title: '定位与招募', lines: ['社区面向把 AI 用进穿搭、视觉、衣橱、趋势和选品的人。', '招募文案对应作品提交，不设设计师门槛。'], source: '设计产物' },
      { kind: '规则 / Brief', title: '内容主题结构', lines: ['案例按主题浏览。', '内容模板用来降低表达成本。'], source: '设计产物' },
      { kind: '原型', title: '视觉方向', lines: ['AI 时尚视觉作为表达样例。', '这里只展示视觉方向。'], source: '设计产物' },
      { kind: '规则 / Brief', title: '参与规则', lines: ['不同经验的人用作品和方法加入。', '互动反馈用来调整招募语言和展示方式。'], source: '设计产物' },
    ],
    state: ['这是一个社区与内容产品概念。', '展示定位、机制与视觉原型即可，不虚构用户规模或运营成果。'],
    takeaway: '我把参与入口放在作品和方法上：穿搭、视觉生成、衣橱、趋势和选品都能提交，招募不收成设计师圈层。',
  },
  planflow: {
    name: 'PlanFlow',
    tag: 'AI PROJECT ORCHESTRATION',
    line: '面向 5 人左右小型项目团队，把目标、AI 排期、任务和日报收进同一条时间线。',
    status: '可运行原型',
    scene: ['多人协作时，任务状态、依赖关系和责任边界容易分散在聊天记录与不同表格里，导致等待、遗漏和返工难以追踪。'],
    judgment: ['排期工具的价值不只是“列任务”。', '关键在于每个任务是否有负责人、前置依赖、验收条件和明确状态。'],
    mechanism: ['为任务定义负责人、优先级、截止时间和状态。', '识别任务之间的前后依赖。', '在状态变化时提示受影响任务。', '用看板呈现整体推进与阻塞位置。', '将协作过程沉淀为可复用的项目模板。'],
    evidence: [
      { kind: '原型', title: '任务看板', lines: ['团队排期和任务看板可以运行。', '公开代码仓库保留实现。'], source: '设计产物' },
      { kind: '流程图', title: '依赖与阻塞', lines: ['任务之间有前后依赖。', '状态变化时提示受影响的任务。'], source: '设计产物' },
      { kind: '规则 / Brief', title: '协作规则', lines: ['每个任务同时写负责人、优先级、截止时间、验收条件和状态。'], source: '设计产物' },
      { kind: '原型', title: '可复用模板', lines: ['协作过程可以收成项目模板。', '还没有长期采用数据，这里只保留模板本身。'], source: '设计产物' },
    ],
    state: ['已有可运行产品与公开代码证据。', '尚无真实团队长期采用数据，因此不展示为已验证的效率提升。'],
    takeaway: '我把排期收成同一条任务记录：负责人、前置依赖、验收条件和当前状态必须同时在场，阻塞才能被指出来。',
  },
}

function PieceDetail({ piece, origin, onClose }: { piece: Piece; origin: DOMRect | null; onClose: () => void }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const closing = useRef(false)
  const [veil, setVeil] = useState(1)
  const record = records[piece.id]

  useLayoutEffect(() => {
    const img = imgRef.current
    if (!img || !origin) return
    const next = img.getBoundingClientRect()
    if (next.width < 2) return
    const scale = origin.width / next.width
    img.style.transition = 'none'
    img.style.transformOrigin = 'top left'
    img.style.transform = `translate(${origin.left - next.left}px, ${origin.top - next.top}px) scale(${scale})`
    const id = requestAnimationFrame(() => {
      img.style.transition = 'transform 0.72s cubic-bezier(0.77, 0, 0.175, 1)'
      img.style.transform = 'translate(0px, 0px) scale(1)'
    })
    return () => cancelAnimationFrame(id)
  }, [origin, piece.id])

  const requestClose = () => {
    const img = imgRef.current
    if (!img || !origin || closing.current) {
      onClose()
      return
    }
    closing.current = true
    setVeil(0)
    const next = img.getBoundingClientRect()
    if (next.width < 2) {
      onClose()
      return
    }
    const scale = origin.width / next.width
    img.style.transition = 'transform 0.52s cubic-bezier(0.77, 0, 0.175, 1)'
    img.style.transformOrigin = 'top left'
    img.style.transform = `translate(${origin.left - next.left}px, ${origin.top - next.top}px) scale(${scale})`
    window.setTimeout(onClose, 500)
  }

  const openingLinks = piece.id === 'meijian' ? meijianLinks : piece.id === 'anker' ? ankerLinks : piece.id === 'hr' ? hrLinks : piece.id === 'planflow' ? planflowLinks : undefined

  return (
    <div data-project-sheet className="fixed inset-0 z-[80] overflow-x-hidden overflow-y-auto bg-[#f7f5f2]">
      <div className="relative mx-auto max-w-6xl px-5 py-16" style={{ opacity: veil, transition: 'opacity 0.45s ease' }}>
        <div className="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <img ref={imgRef} src={piece.image} alt="" className="relative w-full object-cover" />
          {record ? (
            <CTASection
              badge={{ text: `项目状态 · ${record.status}` }}
              title={record.name}
              description={record.line}
              action={{ text: '返回', href: '/projects', onClick: requestClose }}
              flow={flows[piece.id]}
              links={openingLinks}
              className="[&>div]:px-0 [&>div]:py-8 md:[&>div]:py-10 [&_h2]:!text-4xl [&_h2]:!leading-tight [&_h2]:!font-medium [&_h2]:break-keep"
            />
          ) : (
            <div>
              <p className="text-xs tracking-[0.22em] text-black/45">{piece.index}</p>
              <h2 className="mt-3 text-5xl" style={{ fontFamily: serif }}>
                {piece.title}
              </h2>
              <button type="button" onClick={requestClose} className="mt-8 text-sm tracking-[0.18em] underline underline-offset-4">
                返回
              </button>
            </div>
          )}
        </div>
        {piece.id === 'meijian' ? <MeijianCase embedded /> : piece.id === 'anker' ? <AnkerCase embedded /> : piece.id === 'loreal' ? <LorealCase embedded /> : piece.id === 'hr' ? <HrCase embedded /> : piece.id === 'planflow' ? <PlanFlowCase embedded /> : piece.id === 'sofa' ? <SofaCase embedded /> : piece.id === 'muse' ? <MuseCase embedded /> : record ? <ProjectRecord record={record} /> : null}
      </div>
    </div>
  )
}

function ProjectRecord({ record }: { record: ProjectRecord }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const scroller = root.closest('[data-project-sheet]')
      if (!(scroller instanceof HTMLElement) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const ease = 'type-in'
      gsap.utils.toArray<HTMLElement>('[data-reveal-block]', root).forEach((block) => {
        const title = block.querySelector('[data-title]')
        const lines = block.querySelectorAll('[data-rise]')
        const frames = block.querySelectorAll('[data-frame]')
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            scroller,
            start: 'top 82%',
            once: true,
          },
        })
        if (title) timeline.from(title, { yPercent: 110, duration: 0.85, ease }, 0.1)
        if (lines.length) timeline.from(lines, { y: 20, autoAlpha: 0, duration: 0.75, stagger: 0.16, ease }, 0.18)
        if (frames.length) timeline.from(frames, { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease }, 0.4)
      })
      ScrollTrigger.refresh()
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="mt-4 break-keep" style={{ fontFamily: song, fontWeight: 500 }}>
      <section data-reveal-block className="border-t border-black/15 pt-10">
        <p data-rise className="m-0 text-[12px] tracking-[0.16em] text-black/45">
          {record.tag}
        </p>
      </section>

      <section data-reveal-block className="pt-10">
        <p data-rise className="m-0 text-[12px] tracking-[0.18em] text-black/45">问题场景</p>
        <div className="mt-3 overflow-hidden">
          {record.scene.map((paragraph) => (
            <p key={paragraph} data-title className="m-0 max-w-[42rem] text-[18px] leading-[1.85]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section data-reveal-block className="pt-10">
        <p data-rise className="m-0 text-[12px] tracking-[0.18em] text-black/45">我的判断</p>
        <div className="mt-4 max-w-[42rem] overflow-hidden">
          <div data-title className="text-[18px] leading-[1.85]">
            {record.judgment.map((paragraph) => (
              <p key={paragraph} className="m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal-block className="pt-10">
        <p data-rise className="m-0 text-[12px] tracking-[0.18em] text-black/45">产品机制</p>
        <ol className="mt-4 max-w-[42rem] list-none space-y-3 p-0">
          {record.mechanism.map((step, index) => (
            <li key={step} data-rise className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 text-[15px] leading-[1.7]">
              <span className="text-black/40">{String(index + 1).padStart(2, '0')}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section data-reveal-block className="pt-10">
        <p data-rise className="m-0 text-[12px] tracking-[0.18em] text-black/45">交付与证据</p>
        <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2">
          {record.evidence.map((card) => (
            <li key={card.title} data-frame className="border border-black/15 bg-white/45 px-5 py-5">
              <div className="flex items-start justify-between gap-3">
                <p className="m-0 text-[12px] tracking-[0.12em] text-black/40">{card.kind}</p>
                <p className="m-0 shrink-0 text-[12px]">{card.source}</p>
              </div>
              <h3 className="mt-3 mb-2 text-[16px] leading-[1.45] font-medium">{card.title}</h3>
              <div className="space-y-1">
                {card.lines.map((line) => (
                  <p key={line} className="m-0 text-[14px] leading-[1.7] text-black/60">
                    {line}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section data-reveal-block className="pt-10">
        <p data-rise className="m-0 text-[12px] tracking-[0.18em] text-black/45">当前状态</p>
        <div className="mt-3 max-w-[42rem] overflow-hidden">
          <div data-title className="text-[18px] leading-[1.85]">
            {record.state.map((paragraph) => (
              <p key={paragraph} className="m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal-block className="mt-10 border-t border-black pt-5 pb-16">
        <p data-rise className="m-0 text-[12px] tracking-[0.16em] text-black/45">我从这个项目带走了什么</p>
        <div className="mt-3 overflow-hidden">
          <p data-title className="mb-0 max-w-[42rem] text-[20px] leading-9">
            {record.takeaway}
          </p>
        </div>
      </section>
    </div>
  )
}

function ProjectReading() {
  const [openId, setOpenId] = useState<string | null>(null)
  const opened = pieces.find((piece) => piece.id === openId) ?? null

  return (
    <div className="min-h-dvh bg-[#f7f5f2] text-[#1a1a1a]">
      <SiteHeader />
      <main className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 py-16 md:grid-cols-3">
        {pieces.map((piece) => (
          <article key={piece.id}>
            <button type="button" className="block w-full text-left" onClick={() => setOpenId(piece.id)}>
              <img src={piece.image} alt="" className="aspect-[4/5] w-full object-cover" />
              <h2 className="mt-3 text-2xl" style={{ fontFamily: serif }}>
                {piece.index} {piece.title}
              </h2>
            </button>
          </article>
        ))}
      </main>
      {opened ? <PieceDetail key={opened.id} piece={opened} origin={null} onClose={() => setOpenId(null)} /> : null}
    </div>
  )
}
