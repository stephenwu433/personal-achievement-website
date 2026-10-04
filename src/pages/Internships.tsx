import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { profile, sections } from '@/src/content'

gsap.registerPlugin(useGSAP)

type Place = {
  id: string
  name: string
  lines: string[]
  image: string
}

const places: Place[] = [
  { id: 'dongpeng', name: '东鹏控股股份有限公司', lines: ['东鹏控股', '股份有限公司'], image: '/internships/dongpeng.png' },
  { id: 'zhijunzhu', name: '知君竹科技传媒', lines: ['知君竹科技传媒'], image: '/internships/zhijunzhu.png' },
  { id: 'huigu', name: '慧谷科技', lines: ['慧谷科技'], image: '/internships/huigu.png' },
  { id: 'gaodun', name: '高顿', lines: ['高顿'], image: '/internships/gaodun.png' },
]

const serif = '"LXGW WenKai", "Iowan Old Style", Palatino, "Songti SC", serif'
const paper = '#f3f1ec'

type Motion = {
  index: number
  open: number
  settle: number
  count: number
  spin: number
  tiltX: number
  tiltY: number
  lean: number
}

type DiscNodes = {
  slot: HTMLButtonElement | null
  tilt: HTMLDivElement | null
  spin: HTMLDivElement | null
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount
}

function smooth(value: number) {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}

function discScale(delta: number) {
  if (delta >= 0) return Math.min(1 + delta * 0.9, 2.35)
  return Math.max(1 + delta * 0.23, 0.5)
}

function rowPose(delta: number, width: number, height: number, narrow: boolean) {
  const unit = narrow ? Math.min(height * 0.4, width * 0.6) : Math.min(height * 0.46, width * 0.3)
  const size = unit * discScale(delta)
  const anchor = width * (narrow ? 0.5 : 0.56)
  const step = unit * (delta >= 0 ? 1.02 : 0.55)
  const x = anchor + delta * step
  const y = height * (narrow ? 0.76 : 0.74) - size * 0.5
  let opacity = 1
  if (delta < -2.35) opacity = clamp((delta + 3.2) / 0.85)
  if (delta > 2.15) opacity = clamp((3.05 - delta) / 0.9)
  return { size, x, y, z: 0, rx: 0, ry: 0, rz: 0, opacity }
}

export default function Internships() {
  const rootRef = useRef<HTMLDivElement>(null)
  const discRefs = useRef<DiscNodes[]>(places.map(() => ({ slot: null, tilt: null, spin: null })))
  const shadowRefs = useRef<Array<HTMLDivElement | null>>([])
  const ringRef = useRef<SVGSVGElement>(null)
  const quoteRefs = useRef<Array<HTMLDivElement | null>>([])
  const introRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const motion = useRef<Motion>({ index: 0, open: 0, settle: 0, count: 0, spin: 0, tiltX: 0, tiltY: 0, lean: 0 })
  const glideTarget = useRef(0)
  const snapTimer = useRef<number | null>(null)
  const drag = useRef<{ x: number; y: number; spin: number; tiltX: number; moved: boolean; lastX: number; vx: number } | null>(null)
  const settle = useRef<gsap.core.Tween | null>(null)
  const [prints, setPrints] = useState<string[]>(() => places.map(() => ''))
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(0)
  const [chrome, setChrome] = useState(false)
  const [open, setOpen] = useState(false)
  const [ring, setRing] = useState(0)
  const [reduced] = useState(prefersReducedMotion)
  const openRef = useRef(false)
  const chromeRef = useRef(false)
  openRef.current = open

  const paint = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const state = motion.current
    const narrow = width < 800
    const openT = smooth(state.open)
    const landT = smooth(state.settle)
    const ringBoxes: { x: number; y: number; size: number; z: number }[] = []
    const laid: { x: number; y: number; size: number; opacity: number }[] = []
    const quoteSpots: ({ x: number; top: number } | undefined)[] = []
    const focusIndex = Math.round(state.index)

    discRefs.current.forEach((node, index) => {
      if (!node.slot || !node.tilt || !node.spin) return
      const delta = index - state.index
      const distance = Math.abs(delta)
      const focus = distance < 0.35
      const pose = rowPose(delta, width, height, narrow)
      const swingY = openT < 0.68 ? lerp(88, 8, smooth(openT / 0.68)) : lerp(8, pose.ry, smooth((openT - 0.68) / 0.32))
      let x = pose.x + (delta > 0.15 ? (1 - landT) * width * 0.28 : 0)
      let y = pose.y
      let size = pose.size
      let rx = pose.rx
      let ry = pose.ry
      let rz = pose.rz + (focus ? state.lean : state.lean * 0.25)
      if (focus && landT < 0.999) {
        const projX = width * (narrow ? 0.58 : 0.6)
        const projY = height * 0.52
        x = lerp(projX, pose.x, landT)
        y = lerp(projY, pose.y, landT)
        size = lerp(pose.size * 1.05, pose.size, landT)
        rx = lerp(lerp(4, 12, openT), pose.rx, landT)
        ry = lerp(swingY, pose.ry, landT)
        rz = lerp(lerp(0, -6, openT), pose.rz, landT)
      }
      rx += focus ? state.tiltX : 0
      ry += focus ? state.tiltY * 0.35 : 0
      let opacity = pose.opacity
      if (Math.abs(delta) > 0.2) opacity *= landT

      node.slot.style.left = `${x}px`
      node.slot.style.top = `${y}px`
      node.slot.style.width = `${size}px`
      node.slot.style.height = `${size}px`
      node.slot.style.zIndex = String(40 + Math.round(delta * 10))
      node.slot.style.transform = `translate(-50%, -50%) translateZ(${pose.z}px)`
      node.slot.style.visibility = opacity < 0.03 ? 'hidden' : 'visible'
      node.slot.style.pointerEvents = opacity < 0.45 ? 'none' : 'auto'
      node.slot.style.setProperty('--disc-opacity', String(opacity))
      node.tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`
      node.spin.style.transform = `rotateZ(${distance < 0.45 ? state.spin * (1 - distance) : 0}deg)`

      const shadow = shadowRefs.current[index]
      if (shadow) {
        shadow.style.left = `${x}px`
        shadow.style.top = `${y + size * 0.47}px`
        shadow.style.width = `${size * 0.72}px`
        shadow.style.height = `${size * 0.12}px`
        shadow.style.opacity = String(0.22 * opacity * Math.max(openT, landT))
      }

      laid[index] = { x, y, size, opacity }
      if (focusIndex === index) ringBoxes.push({ x, y, size, z: pose.z })
    })

    const quoteFor: number[] = []
    if (focusIndex > 0) quoteFor.push(focusIndex - 1)
    quoteFor.push(focusIndex)
    if (quoteFor.length < 2 && focusIndex + 1 < places.length) quoteFor.push(focusIndex + 1)
    quoteFor.forEach((index, slot) => {
      const pose = laid[index]
      if (!pose || pose.opacity < 0.4) return
      if (pose.x < width * 0.16 || pose.x > width * 0.8) return
      const top = pose.y + pose.size * 0.74 + 8
      if (top > height - 72) return
      quoteSpots[slot] = { x: pose.x, top }
    })

    if (countRef.current) countRef.current.textContent = String(Math.round(state.count))
    if (introRef.current) {
      const appear = smooth(state.open / 0.18)
      const leave = 1 - smooth(clamp((state.settle - 0.05) / 0.62))
      introRef.current.style.opacity = String(appear * leave)
    }

    const ringNode = ringRef.current
    const ringBox = ringBoxes[0]
    if (ringNode && ringBox) {
      ringNode.style.left = `${ringBox.x}px`
      ringNode.style.top = `${ringBox.y}px`
      ringNode.style.width = `${ringBox.size * 1.26}px`
      ringNode.style.height = `${ringBox.size * 1.26}px`
      ringNode.style.transform = `translate(-50%, -50%) translateZ(${ringBox.z + 36}px)`
      ringNode.style.opacity = String(clamp(state.settle))
      ringNode.style.zIndex = '80'
    }
    quoteRefs.current.forEach((quote, index) => {
      if (!quote) return
      const spot = quoteSpots[index]
      quote.style.opacity = spot ? String(clamp(state.settle)) : '0'
      if (!spot) return
      quote.style.left = `${spot.x}px`
      quote.style.top = `${spot.top}px`
    })
  }

  useEffect(() => {
    let cancel = false
    Promise.all(places.map((place) => makePrint(place.image))).then((urls) => {
      if (cancel) return
      setPrints(urls)
      setReady(true)
    })
    return () => {
      cancel = true
    }
  }, [])

  useLayoutEffect(() => {
    if (reduced) {
      motion.current.open = 1
      motion.current.settle = 1
      motion.current.count = 100
      chromeRef.current = true
      setChrome(true)
    }
    paint()
  }, [ready, reduced])

  useGSAP(
    () => {
      paint()
      if (reduced || !ready) return
      const state = motion.current
      const intro = gsap.timeline({
        onUpdate: () => {
          paint()
          if (!chromeRef.current && state.settle > 0.42) {
            chromeRef.current = true
            setChrome(true)
          }
        },
      })
      intro.to(state, { open: 1, duration: 1.7, delay: 0.45, ease: 'power2.inOut' })
      intro.to(state, { count: 100, duration: 1.7, ease: 'power1.in' }, '<')
      intro.to(state, { settle: 1, duration: 1.2, ease: 'power3.inOut' }, '+=0.35')

      const follow = () => {
        if (drag.current || state.settle < 0.98) return
        const gap = glideTarget.current - state.index
        if (Math.abs(gap) < 0.001) return
        state.index += gap * 0.065
        state.lean = gap * 10
        paint()
        syncActive(state.index)
      }
      gsap.ticker.add(follow)

      const onWheel = (event: WheelEvent) => {
        if (openRef.current || state.settle < 0.98) return
        event.preventDefault()
        const pixels = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY
        glideTarget.current = Math.min(places.length - 1, Math.max(0, glideTarget.current + pixels * 0.0015))
        if (snapTimer.current) window.clearTimeout(snapTimer.current)
        snapTimer.current = window.setTimeout(() => {
          glideTarget.current = Math.round(glideTarget.current)
        }, 170)
      }
      const onResize = () => paint()
      window.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('resize', onResize)
      return () => {
        intro.kill()
        gsap.ticker.remove(follow)
        if (snapTimer.current) window.clearTimeout(snapTimer.current)
        window.removeEventListener('wheel', onWheel)
        window.removeEventListener('resize', onResize)
      }
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  )

  const syncActive = (index: number) => {
    const next = Math.min(places.length - 1, Math.max(0, Math.round(index)))
    setActive((current) => (current === next ? current : next))
  }

  const glideTo = (index: number) => {
    glideTarget.current = Math.min(places.length - 1, Math.max(0, index))
    if (snapTimer.current) window.clearTimeout(snapTimer.current)
    setRing(0)
  }

  const releaseDrag = () => {
    const current = drag.current
    drag.current = null
    if (!current?.moved) return
    const state = motion.current
    state.spin += current.vx * 0.55
    settle.current?.kill()
    settle.current = gsap.to(state, {
      spin: 0,
      tiltX: 0,
      tiltY: 0,
      duration: 1.15,
      ease: 'power3.out',
      onUpdate: paint,
    })
  }

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const current = places[active]

  return (
    <div ref={rootRef} className="relative h-dvh overflow-hidden text-[#1c1c1c]" style={{ background: paper, fontFamily: serif }}>
      <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-[4vw] pt-4 text-[13px] tracking-[0.08em]">
        <Link to="/" className="text-[#1c1c1c]">
          {profile.name}
        </Link>
        <nav className="flex gap-5">
          {sections.map((section) => (
            <Link
              key={section.href}
              to={section.href}
              className={section.href === '/internships' ? 'text-[#1c1c1c]' : 'text-black/45 hover:text-[#1c1c1c]'}
            >
              {section.label}
            </Link>
          ))}
        </nav>
      </header>

      <div ref={introRef} className="pointer-events-none absolute inset-0 z-20" style={{ opacity: 0 }}>
        <p className="absolute top-1/2 left-[4vw] -translate-y-1/2 text-[12px] tracking-[0.28em] text-black/55">实习目录</p>
        <p
          className="absolute top-1/2 left-[18vw] -translate-y-1/2 text-[clamp(84px,10vw,148px)] leading-none font-normal"
          style={{ fontFamily: '"Iowan Old Style", Palatino, "Noto Serif SC", serif' }}
        >
          <span ref={countRef}>0</span>
        </p>
        <p className="absolute top-1/2 right-[4vw] -translate-y-1/2 text-[13px] tracking-[0.22em] text-black/55">01</p>
      </div>

      <div
        className="pointer-events-none absolute top-[6.5vh] left-[4.2vw] z-30 w-[min(22vw,270px)]"
        style={{ opacity: chrome ? 1 : 0, transition: 'opacity 0.45s ease' }}
      >
        {chrome ? (
          <>
            <div className="overflow-hidden">
              <h1
                key={current.id}
                className="text-[clamp(26px,2.5vw,38px)] leading-[1.2] font-normal"
                style={{ animation: 'projects-line-in 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both' }}
              >
                {current.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </div>
            <div className="mt-4 max-w-[340px]">
              <Credit label="岗位" delay={0} />
              <Credit label="时间" delay={0.08} />
              <Credit label="内容" delay={0.16} />
            </div>
          </>
        ) : null}
      </div>

      <div className="absolute inset-0">
        <div className="absolute inset-0">
        {places.map((place, index) => (
          <button
            key={place.id}
            type="button"
            aria-label={place.name}
            ref={(node) => {
              discRefs.current[index].slot = node
            }}
            className="absolute top-0 left-0 cursor-grab border-0 bg-transparent p-0 [transform-style:preserve-3d] active:cursor-grabbing"
            style={{ touchAction: 'none' }}
            onPointerEnter={() => {
              if (Math.round(motion.current.index) !== index || motion.current.settle < 0.98) return
              setRing((value) => value + 1)
            }}
            onPointerLeave={() => {
              if (drag.current) return
              setRing(0)
              settle.current?.kill()
              settle.current = gsap.to(motion.current, { tiltX: 0, tiltY: 0, duration: 0.6, ease: 'power3.out', onUpdate: paint })
            }}
            onPointerDown={(event) => {
              if (reduced || open || motion.current.settle < 0.98) return
              if (Math.abs(index - motion.current.index) > 0.45) return
              settle.current?.kill()
              drag.current = {
                x: event.clientX,
                y: event.clientY,
                spin: motion.current.spin,
                tiltX: motion.current.tiltX,
                moved: false,
                lastX: event.clientX,
                vx: 0,
              }
              try {
                event.currentTarget.setPointerCapture(event.pointerId)
              } catch {
                /* The pointer is only capturable for a real press. */
              }
            }}
            onPointerMove={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect()
              const localX = (event.clientX - bounds.left) / bounds.width - 0.5
              const localY = (event.clientY - bounds.top) / bounds.height - 0.5
              if (drag.current && Math.round(motion.current.index) === index) {
                const dx = event.clientX - drag.current.x
                const dy = event.clientY - drag.current.y
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) drag.current.moved = true
                drag.current.vx = event.clientX - drag.current.lastX
                drag.current.lastX = event.clientX
                motion.current.spin = drag.current.spin + dx * 0.45
                motion.current.tiltX = drag.current.tiltX + dy * -0.06
                motion.current.tiltY = localX * 10
                setRing((value) => (value === 0 ? 1 : value))
              } else if (Math.round(motion.current.index) === index && motion.current.settle > 0.98 && !drag.current) {
                motion.current.tiltX = localY * -8
                motion.current.tiltY = localX * 12
              } else {
                return
              }
              paint()
            }}
            onPointerUp={(event) => {
              const moved = drag.current?.moved
              const delta = index - motion.current.index
              releaseDrag()
              if (moved || motion.current.settle < 0.98) return
              if (Math.abs(delta) > 0.45) {
                glideTo(index)
                return
              }
              if (event.button !== 0) return
              setOpen(true)
            }}
            onPointerCancel={releaseDrag}
          >
            <span
              ref={(node) => {
                discRefs.current[index].tilt = node
              }}
              className="absolute inset-0 [transform-style:preserve-3d]"
            >
              <span
                ref={(node) => {
                  discRefs.current[index].spin = node
                }}
                className="absolute inset-0 [transform-style:preserve-3d]"
              >
                <DiscBody print={prints[index]} />
                <span
                  className="pointer-events-none absolute inset-x-[14%] top-[13%] text-center text-[clamp(16px,1.5vw,22px)] leading-[1.35] font-normal text-[#f7f3ea]"
                  style={{ transform: 'translateZ(8px)', textShadow: '0 1px 6px rgba(0,0,0,0.45)', fontFamily: serif }}
                >
                  {place.name}
                </span>
              </span>
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    'linear-gradient(118deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 18%, transparent 36%, transparent 62%, rgba(255,255,255,0.16) 100%)',
                  mixBlendMode: 'soft-light',
                  transform: 'translateZ(10px)',
                  WebkitMask: 'radial-gradient(circle closest-side at 50% 50%, transparent 0 17.5%, #000 18.3% 100%)',
                  mask: 'radial-gradient(circle closest-side at 50% 50%, transparent 0 17.5%, #000 18.3% 100%)',
                  opacity: 'var(--disc-opacity, 1)',
                }}
              />
            </span>
          </button>
        ))}
        {places.map((place, index) => (
          <div
            key={`${place.id}-shadow`}
            ref={(node) => {
              shadowRefs.current[index] = node
            }}
            className="pointer-events-none absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-black/70 blur-2xl"
          />
        ))}
        <svg
          ref={ringRef}
          className="pointer-events-none absolute top-0 left-0 z-[80] overflow-visible"
          viewBox="0 0 100 100"
          style={{ opacity: 0 }}
        >
          {chrome ? <InkRing play={active + ring} /> : null}
        </svg>
        </div>
      </div>

      {[0, 1].map((slot) => (
        <div
          key={slot}
          ref={(node) => {
            quoteRefs.current[slot] = node
          }}
          className="pointer-events-none absolute z-30 w-[220px] -translate-x-1/2 text-center"
          style={{ opacity: 0 }}
        >
          <Quote />
        </div>
      ))}

      {open ? <InternshipDetail place={current} onClose={() => setOpen(false)} /> : null}
    </div>
  )
}

function Credit({ label, delay }: { label: string; delay: number }) {
  return (
    <div className="relative grid grid-cols-[4.5rem_1fr] items-baseline gap-6 py-[0.62rem]">
      <span
        className="absolute inset-x-0 top-0 h-px origin-left bg-black/30"
        style={{ animation: `intern-rule 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s both` }}
      />
      <p className="text-[11px] tracking-[0.22em] text-black/50">{label}</p>
      <p className="text-right text-[15px] font-normal">待填</p>
      <span className="absolute inset-x-0 bottom-0 h-px bg-black/20" />
    </div>
  )
}

function Quote() {
  return (
    <div className="text-center">
      <p className="text-[12px] tracking-[0.18em]">★★★★</p>
      <p className="mt-2 text-[10px] tracking-[0.24em] text-black/55">待填</p>
      <p className="mt-2 text-[clamp(18px,1.7vw,26px)] leading-[1.25]">“待填”</p>
    </div>
  )
}

function InternshipDetail({ place, onClose }: { place: Place; onClose: () => void }) {
  const imageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!imageRef.current) return
    gsap.fromTo(imageRef.current, { yPercent: 72, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.05, ease: 'power3.out' })
  })

  return (
    <div className="fixed inset-0 z-[80] overflow-hidden text-[#1c1c1c]" style={{ background: paper, fontFamily: serif }}>
      <button type="button" onClick={onClose} className="absolute top-6 left-6 z-10 text-sm tracking-[0.16em] underline underline-offset-4">
        返回
      </button>
      <div className="mx-auto max-w-3xl px-6 pt-[14vh] text-center">
        <h2 className="text-[clamp(28px,3vw,44px)] leading-[1.45] font-normal">
          {place.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <div className="mx-auto mt-8 max-w-xl text-left">
          <Credit label="岗位" delay={0} />
          <Credit label="时间" delay={0.06} />
          <Credit label="内容" delay={0.12} />
        </div>
      </div>
      <div ref={imageRef} className="absolute inset-x-0 bottom-[-8vh] flex justify-center">
        <img src={place.image} alt="" className="size-[min(62vh,680px)] rounded-full object-cover" />
      </div>
    </div>
  )
}

function DiscBody({ print }: { print: string }) {
  const mask = 'radial-gradient(circle closest-side at 50% 50%, transparent 0 17.5%, #000 18.3%)'
  return (
    <span className="absolute inset-0 [transform-style:preserve-3d]">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((layer) => (
        <span
          key={layer}
          className="absolute inset-0 rounded-full"
          style={{
            transform: `translateZ(${-1.2 - layer * 2}px)`,
            background:
              'linear-gradient(90deg, #6f6f6f 0%, #f7f7f7 14%, #c5c5c5 32%, #ffffff 48%, #b0b0b0 63%, #f3f3f3 78%, #7a7a7a 100%)',
            WebkitMask: mask,
            mask,
            opacity: 'var(--disc-opacity, 1)',
          }}
        />
      ))}
      <span
        className="absolute inset-0 rounded-full bg-cover bg-center"
        style={{
          backgroundImage: print ? `url(${print})` : undefined,
          backgroundColor: '#cfc6b8',
          transform: 'translateZ(0px)',
          WebkitMask: mask,
          mask,
          boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.5)',
          opacity: 'var(--disc-opacity, 1)',
        }}
      />
      <span
        className="absolute top-1/2 left-1/2 size-[26%] rounded-full"
        style={{
          transform: 'translate(-50%, -50%) translateZ(7px)',
          background: 'linear-gradient(145deg, #ffffff 0%, #cfcfcf 32%, #f8f8f8 50%, #8a8a8a 78%, #dedede 100%)',
          WebkitMask: 'radial-gradient(circle closest-side at 50% 50%, transparent 0 64%, #000 70%)',
          mask: 'radial-gradient(circle closest-side at 50% 50%, transparent 0 64%, #000 70%)',
          opacity: 'var(--disc-opacity, 1)',
        }}
      />
    </span>
  )
}

function InkRing({ play }: { play: number }) {
  const pathRef = useRef<SVGPathElement>(null)
  const path = inkPath()

  useGSAP(() => {
    const line = pathRef.current
    if (!line) return
    const length = line.getTotalLength()
    line.style.strokeDasharray = `${length}`
    gsap.fromTo(line, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.85, ease: 'none' })
  }, { dependencies: [play] })

  return (
    <path ref={pathRef} d={path} fill="none" stroke="#161616" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
  )
}

function inkPath() {
  let description = ''
  for (let loop = 0; loop < 2; loop += 1) {
    const points = 96
    const stop = loop === 0 ? points : Math.round(points * 0.9)
    for (let point = 0; point <= stop; point += 1) {
      const angle = (point / points) * Math.PI * 2 - 0.5 + loop * 0.35
      const wobble = Math.sin(angle * 2 + loop * 1.4) * 1.15 + Math.sin(angle * 5 + 0.6) * 0.45
      const radiusX = 44 + loop * 2.4 + wobble
      const radiusY = 45.2 + loop * 1.2 + wobble * 0.55
      const x = 50 + Math.cos(angle) * radiusX
      const y = 51 + Math.sin(angle) * radiusY + loop * 1.8
      description += `${point === 0 ? (description ? ' M ' : 'M ') : ' L '}${x.toFixed(2)} ${y.toFixed(2)}`
    }
  }
  return description
}

function makePrint(src: string) {
  return new Promise<string>((resolve) => {
    const image = new Image()
    image.onload = () => resolve(drawPrint(image))
    image.onerror = () => resolve('')
    image.src = src
  })
}

function drawPrint(image: HTMLImageElement) {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const [red, green, blue] = fieldColor(image)
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.clip()
  ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
  ctx.fillRect(0, 0, size, size)

  const drawSize = size * 1.02
  const dx = (size - drawSize) / 2
  const dy = size * 0.58 - drawSize * 0.46
  ctx.drawImage(image, dx, dy, drawSize, drawSize)

  const fade = ctx.createLinearGradient(0, size * 0.16, 0, size * 0.4)
  fade.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 0.92)`)
  fade.addColorStop(0.45, `rgba(${red}, ${green}, ${blue}, 0.55)`)
  fade.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`)
  ctx.fillStyle = fade
  ctx.fillRect(0, 0, size, size * 0.42)

  const vignette = ctx.createRadialGradient(size / 2, size / 2, size * 0.28, size / 2, size / 2, size * 0.5)
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, 'rgba(0,0,0,0.3)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, size, size)

  ctx.save()
  ctx.globalCompositeOperation = 'soft-light'
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 1
  for (let radius = size * 0.2; radius < size * 0.49; radius += 7) {
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()

  return canvas.toDataURL('image/jpeg', 0.86)
}

function fieldColor(image: HTMLImageElement) {
  const sample = document.createElement('canvas')
  sample.width = 16
  sample.height = 16
  const ctx = sample.getContext('2d')
  if (!ctx) return [112, 104, 90]
  ctx.drawImage(image, 0, 0, 16, 16)
  const data = ctx.getImageData(0, 0, 16, 16).data
  let red = 0
  let green = 0
  let blue = 0
  let count = 0
  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] < 180) continue
    red += data[index]
    green += data[index + 1]
    blue += data[index + 2]
    count += 1
  }
  if (!count) return [112, 104, 90]
  const mix = 0.5
  const tone = (channel: number, target: number) => Math.round((channel / count) * (1 - mix) + target * mix)
  return [tone(red, 96), tone(green, 90), tone(blue, 74)].map((channel) => Math.round(channel * 0.78))
}
