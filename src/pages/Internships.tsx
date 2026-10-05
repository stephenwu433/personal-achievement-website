import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CustomEase } from 'gsap/CustomEase'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { profile, sections } from '@/src/content'
import DongpengCase from '@/src/internships/DongpengCase'

gsap.registerPlugin(useGSAP, Observer, CustomEase, ScrollTrigger)

function energyEase() {
  try {
    if (!CustomEase.get('energy')) CustomEase.create('energy', 'M0,0 C0.32,0.72 0,1 1,1')
    return 'energy'
  } catch {
    return 'power2.out'
  }
}

type Place = {
  id: string
  name: string
  image: string
  role: string
  period: string
  work: string
}

const places: Place[] = [
  {
    id: 'dongpeng',
    name: '东鹏控股股份有限公司',
    image: '/internships/dongpeng.png',
    role: '海外市场实习生',
    period: '2026.05–2026.09',
    work: '负责海外展会内容策划与多平台交付；拆解传播需求，统筹从选题、制作到发布的内容协同流程。',
  },
  {
    id: 'zhijunzhu',
    name: '知君竹科技传媒公司',
    image: '/internships/zhijunzhu.png',
    role: 'AI 与市场推广负责人',
    period: '2025.06–2026.04',
    work: '主导品牌增长项目，统筹用户洞察、内容策略与投放验证，并将有效经验沉淀为可复用的增长机制。',
  },
  {
    id: 'huigu',
    name: '佛山慧谷科技股份有限公司',
    image: '/internships/huigu.png',
    role: '海外市场实习生',
    period: '2025.06–2025.09',
    work: '负责海外展会沟通、信息统筹及产品资料本地化；将海外客户需求转化为清晰的产品展示方案。',
  },
  {
    id: 'gaodun',
    name: '高顿教育',
    image: '/internships/gaodun.png',
    role: '市场营销实习生',
    period: '2024.11–2025.02',
    work: '负责校园市场触达、活动传播与咨询转化；从用户反馈中提炼需求，设计标准化答疑与转化流程。',
  },
]

const serif = '"LXGW WenKai", "Iowan Old Style", Palatino, "Songti SC", serif'
const paper = '#f3f1ec'

type DiscRig = {
  group: THREE.Group
  mesh: THREE.Mesh
  spin: number
}

type Intro = {
  rise: number
  fan: number
  spin: number
  count: number
}

type Flight = {
  others: number
  active: number
  spin: number
  fade: number
  hold: number
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function discPose(delta: number, active: boolean) {
  const angle = delta * 0.35
  const x = Math.sin(angle) * 2.3 * 2.4
  const z = -Math.cos(angle) * 2.4 + 2.4
  const y = active ? 0.06 : 0
  const scale = active ? 1 : Math.max(0.8, 1 - Math.abs(delta) * 0.2)
  return { x, y, z, scale, angle }
}

type Scribble = {
  line: THREE.Line
  loop: number
  angles: Float32Array
  echo: boolean
  material: THREE.LineBasicMaterial
}

function makeScribble(loop: number, echo: boolean) {
  const count = 120
  const stop = echo || loop === 0 ? count : Math.round(count * 0.7)
  const angles = new Float32Array(stop + 1)
  for (let point = 0; point <= stop; point += 1) angles[point] = (point / count) * Math.PI * 2 - 0.45 + loop * 0.55
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array((stop + 1) * 3), 3))
  const material = new THREE.LineBasicMaterial({ color: 0x161616, transparent: true, opacity: 0 })
  const line = new THREE.Line(geometry, material)
  line.frustumCulled = false
  return { line, loop, angles, echo, material }
}

function writeScribble(scribble: Scribble, time: number) {
  const position = scribble.line.geometry.getAttribute('position') as THREE.BufferAttribute
  const { loop, angles, echo } = scribble
  const cycle = 2.4
  const phase = ((time + (echo ? (loop - 2) * cycle * 0.5 : 0)) % cycle) / cycle
  const orbit = time * 2.6
  for (let index = 0; index < angles.length; index += 1) {
    const angle = angles[index]
    const hand = Math.sin(angle * 2 + loop * 1.3) * 0.022 + Math.sin(angle * 5.2 + loop) * 0.007
    const crest = Math.sin(angle * 2 - orbit + loop * 0.85)
    const fine = Math.sin(angle * 6 - orbit * 1.7) * 0.01
    const radius = echo
      ? 1.08 + phase * 0.09 + hand * 0.4 + crest * 0.02
      : 1.05 + loop * 0.042 + hand + crest * 0.05 + fine
    position.setXYZ(index, Math.cos(angle) * radius, Math.sin(angle) * radius, 0.05)
  }
  position.needsUpdate = true
  if (!echo) {
    scribble.material.opacity = 0.92
    return
  }
  const fade = phase < 0.18 ? phase / 0.18 : 1 - (phase - 0.18) / 0.82
  scribble.material.opacity = Math.max(0, fade) * 0.55
}

export default function Internships() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const quoteRefs = useRef<Array<HTMLDivElement | null>>([])
  const introRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const flightRef = useRef<Flight>({ others: 1, active: 1, spin: 0, fade: 1, hold: 0 })
  const layoutRef = useRef<() => void>(() => {})
  const [prints, setPrints] = useState<HTMLCanvasElement[]>([])
  const [active, setActive] = useState(0)
  const [chrome, setChrome] = useState(false)
  const [open, setOpen] = useState(false)
  const [reduced] = useState(prefersReducedMotion)
  const openRef = useRef(false)
  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    let cancel = false
    Promise.all(places.map((place) => makePrint(place.image, place.name))).then((canvases) => {
      if (!cancel) setPrints(canvases)
    })
    return () => {
      cancel = true
    }
  }, [])

  useGSAP(
    () => {
      const canvas = canvasRef.current
      if (!canvas || prints.length !== places.length) return

      let renderer: THREE.WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      } catch {
        return
      }
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
      camera.position.set(0, 0, 4.4)
      camera.lookAt(0, 0, 0)
      const gallery = new THREE.Group()
      gallery.rotation.x = THREE.MathUtils.degToRad(-30)
      gallery.rotation.y = THREE.MathUtils.degToRad(-30)
      gallery.scale.setScalar(1.02)
      scene.add(gallery)

      const hole = holeTexture()
      const discs: DiscRig[] = prints.map((print) => {
        const group = new THREE.Group()
        const texture = new THREE.CanvasTexture(print)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = 8
        const rim = new THREE.Mesh(
          new THREE.RingGeometry(0.993, 1.012, 80),
          new THREE.MeshBasicMaterial({ color: 0x6e6e6e, side: THREE.DoubleSide }),
        )
        rim.position.z = -0.008
        const mesh = new THREE.Mesh(
          new THREE.CircleGeometry(1, 80),
          new THREE.MeshBasicMaterial({ map: texture, alphaMap: hole, alphaTest: 0.4, side: THREE.DoubleSide }),
        )
        const lip = new THREE.Mesh(
          new THREE.RingGeometry(0.128, 0.15, 64),
          new THREE.MeshBasicMaterial({ color: 0x8d8d8d, side: THREE.DoubleSide }),
        )
        lip.position.z = 0.018
        const hub = new THREE.Mesh(
          new THREE.RingGeometry(0.15, 0.205, 64),
          new THREE.MeshBasicMaterial({ color: 0xf2f2f2, side: THREE.DoubleSide }),
        )
        hub.position.z = 0.024
        group.add(rim, mesh, lip, hub)
        gallery.add(group)
        return { group, mesh, spin: 0 }
      })

      const rings = [makeScribble(0, false), makeScribble(1, false), makeScribble(2, true), makeScribble(3, true)]
      rings.forEach((ring) => gallery.add(ring.line))

      const intro: Intro = reduced
        ? { rise: 1, fan: 1, spin: 0, count: 100 }
        : { rise: 0, fan: 0, spin: 1, count: 0 }
      const play = { index: 0 }
      const tilt = { x: 0, y: 0 }
      let target = 0
      let lastStep = 0
      let shown = 0
      let viewW = 0
      let viewH = 0
      let alive = true
      const pointer = {
        down: false,
        moved: false,
        x: 0,
        y: 0,
        index: 0,
        vx: 0,
        lastIndex: 0,
        lastTime: 0,
      }
      const raycaster = new THREE.Raycaster()
      const ndc = new THREE.Vector2()
      const center = new THREE.Vector3()
      const edge = new THREE.Vector3()

      const resize = () => {
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        if (width < 2 || height < 2 || (width === viewW && height === viewH)) return
        viewW = width
        viewH = height
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height, false)
      }

      const project = (vector: THREE.Vector3) => {
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        const point = vector.clone().project(camera)
        return {
          x: (point.x * 0.5 + 0.5) * width,
          y: (-point.y * 0.5 + 0.5) * height,
        }
      }

      const layout = () => {
        resize()
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        const focus = Math.round(play.index)
        const flight = flightRef.current
        discs.forEach((disc, index) => {
          const raw = index - play.index
          const delta = raw * intro.fan
          const settled = Math.abs(raw) < 0.45 && intro.fan > 0.92
          const pose = discPose(delta, settled && index === focus)
          disc.group.position.set(pose.x, pose.y - (1 - intro.rise) * 3.2, pose.z + (1 - intro.fan) * index * 0.05)
          disc.group.rotation.set(
            index === focus ? tilt.x : 0,
            -pose.angle + intro.spin * Math.PI * 0.5 + (index === focus ? flight.spin : 0),
            disc.spin + (index === focus ? tilt.y : 0),
          )
          const grown = 0.62 + 0.38 * intro.rise
          const flightScale = index === focus ? flight.active : flight.others
          disc.group.scale.setScalar(pose.scale * grown * flightScale)
          disc.group.visible = Math.abs(raw) < 3.4
        })

        const host = discs[focus]
        const showRing = intro.fan > 0.98 && Boolean(host) && flight.active > 0.9 && flight.spin < 0.04
        const rippleTime = reduced ? 0 : gsap.ticker.time
        rings.forEach((ring) => {
          writeScribble(ring, showRing ? rippleTime : 0)
          ring.line.visible = showRing
          if (!showRing) ring.material.opacity = 0
          if (!host) return
          if (ring.line.parent !== host.group) host.group.add(ring.line)
          ring.line.position.set(0, 0, 0.045)
          ring.line.rotation.set(0, 0, 0)
          ring.line.scale.set(1, 1, 1)
        })

        if (countRef.current) countRef.current.textContent = String(Math.round(intro.count))
        if (introRef.current) introRef.current.style.opacity = String(Math.max(0, 1 - intro.fan) * Math.min(1, intro.rise * 2))

        const spots: { x: number; top: number }[] = []
        const quoteFor = focus > 0 ? [focus - 1, focus] : [focus, focus + 1]
        quoteFor.forEach((index) => {
          const disc = discs[index]
          if (!disc || intro.fan < 0.98) return
          disc.group.getWorldPosition(center)
          const origin = project(center)
          let lower = origin.y
          for (let step = 0; step < 8; step += 1) {
            const angle = (step / 8) * Math.PI * 2
            lower = Math.max(lower, project(disc.group.localToWorld(edge.set(Math.cos(angle), Math.sin(angle), 0))).y)
          }
          if (origin.x < width * 0.16 || origin.x > width * 0.8) return
          const top = lower + 36
          if (top > height - 64) return
          spots.push({ x: origin.x, top })
        })
        const settling = flight.hold > 0 || flight.fade < 0.999 || flight.others < 0.999 || flight.active < 0.999 || flight.spin > 0.001
        quoteRefs.current.forEach((quote, index) => {
          if (!quote) return
          if (settling) {
            quote.style.opacity = String(Math.min(Number(quote.style.opacity || '0'), flight.fade))
            return
          }
          const spot = spots[index]
          quote.style.opacity = spot ? '1' : '0'
          if (!spot) return
          quote.style.left = `${spot.x}px`
          quote.style.top = `${spot.top}px`
        })

        const rounded = Math.round(play.index)
        if (rounded !== shown) {
          shown = rounded
          setActive(rounded)
        }
        if (flight.fade < 0.999) {
          if (panelRef.current) {
            panelRef.current.style.transition = 'none'
            panelRef.current.style.opacity = String(flight.fade)
          }
          if (headerRef.current) headerRef.current.style.opacity = String(flight.fade)
        }
        renderer.render(scene, camera)
      }
      layoutRef.current = layout

      const glide = gsap.quickTo(play, 'index', {
        duration: 0.5,
        ease: 'power3.out',
        onUpdate: layout,
      })

      const glideTo = (next: number) => {
        target = gsap.utils.clamp(0, places.length - 1, next)
        if (reduced) {
          play.index = target
          layout()
          return
        }
        glide(target)
      }

      const step = (direction: number, gap = 70) => {
        if (openRef.current || intro.fan < 0.98 || pointer.down) return
        const now = performance.now()
        if (now - lastStep < gap) return
        lastStep = now
        glideTo(Math.round(target) + direction)
      }

      const hit = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect()
        ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
        raycaster.setFromCamera(ndc, camera)
        const hits = raycaster.intersectObjects(discs.map((disc) => disc.mesh))
        if (!hits.length) return -1
        return discs.findIndex((disc) => disc.mesh === hits[0].object)
      }

      const onPointerDown = (event: PointerEvent) => {
        if (openRef.current || intro.fan < 0.98 || event.button !== 0) return
        pointer.down = true
        pointer.moved = false
        pointer.x = event.clientX
        pointer.y = event.clientY
        pointer.index = play.index
        pointer.lastIndex = play.index
        pointer.vx = 0
        pointer.lastTime = performance.now()
        glide.tween.pause()
        canvas.setPointerCapture?.(event.pointerId)
      }

      const onPointerMove = (event: PointerEvent) => {
        if (!pointer.down) {
          if (intro.fan < 0.98) return
          const picked = hit(event)
          const focus = Math.round(play.index)
          if (picked === focus) {
            const rect = canvas.getBoundingClientRect()
            tilt.y = ((event.clientX - rect.left) / rect.width - 0.5) * 0.12
            tilt.x = ((event.clientY - rect.top) / rect.height - 0.5) * -0.08
          } else if (tilt.x !== 0 || tilt.y !== 0) {
            tilt.x = 0
            tilt.y = 0
          } else {
            return
          }
          layout()
          return
        }
        const dx = event.clientX - pointer.x
        const dy = event.clientY - pointer.y
        if (Math.hypot(dx, dy) > 5) pointer.moved = true
        const width = canvas.clientWidth || 1
        const next = gsap.utils.clamp(0, places.length - 1, pointer.index - (dx / width) * 1.8)
        const now = performance.now()
        const dt = Math.max(16, now - pointer.lastTime)
        pointer.vx = (next - pointer.lastIndex) / dt
        pointer.lastIndex = next
        pointer.lastTime = now
        play.index = next
        target = next
        const focus = Math.round(play.index)
        discs.forEach((disc, index) => {
          disc.spin = index === focus ? gsap.utils.clamp(-0.18, 0.18, -pointer.vx * 28) : disc.spin * 0.85
        })
        layout()
      }

      const onPointerUp = (event: PointerEvent) => {
        if (!pointer.down) return
        const moved = pointer.moved
        pointer.down = false
        const picked = hit(event)
        discs.forEach((disc) => {
          gsap.to(disc, { spin: 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto', onUpdate: layout })
        })
        if (!moved && picked >= 0) {
          if (picked === Math.round(play.index)) openPlace()
          else glideTo(picked)
          return
        }
        const flicked = gsap.utils.clamp(-1, 1, pointer.vx * 420)
        glideTo(Math.round(play.index + flicked))
      }

      const openPlace = () => {
        if (openRef.current || intro.fan < 0.98) return
        openRef.current = true
        glide.tween.pause()
        const flight = flightRef.current
        flight.hold = 1
        if (reduced) {
          setOpen(true)
          return
        }
        gsap.timeline({
          onComplete: () => {
            if (alive) setOpen(true)
          },
        })
          .to(flight, { fade: 0, duration: 0.24, ease: 'power2.out', onUpdate: layout }, 0)
          .to(flight, { active: 0.94, duration: 0.12, ease: 'power2.out', onUpdate: layout }, 0)
          .to(flight, { active: 1.015, duration: 0.16, ease: 'power2.out', onUpdate: layout }, 0.12)
          .to(flight, { others: 0, duration: 0.55, ease: 'none', onUpdate: layout }, 0.12)
          .to(flight, { active: 0.001, spin: Math.PI / 2, duration: 0.8, ease: 'power2.in', onUpdate: layout }, 0.67)
      }

      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'ArrowRight') step(1, 220)
        if (event.key === 'ArrowLeft') step(-1, 220)
      }

      const observer = Observer.create({
        target: window,
        type: 'wheel',
        tolerance: 8,
        preventDefault: true,
        ignoreCheck: () => openRef.current,
        onDown: () => step(1),
        onUp: () => step(-1),
      })

      canvas.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('keydown', onKey)
      const resizeObserver = new ResizeObserver(() => layout())
      resizeObserver.observe(canvas)

      const onTick = () => layout()
      let introTween: gsap.core.Timeline | null = null
      if (reduced) {
        setChrome(true)
        setActive(0)
      } else {
        gsap.ticker.add(onTick)
        introTween = gsap.timeline()
        introTween.to(intro, { rise: 1, spin: 0, count: 100, duration: 1.45, ease: 'power2.inOut' }, 0.35)
        introTween.to(intro, { fan: 1, duration: 1.15, ease: 'power3.inOut' }, 1.45)
        introTween.call(() => {
          if (alive) setChrome(true)
        })
      }
      layout()

      return () => {
        alive = false
        if (!reduced) gsap.ticker.remove(onTick)
        observer.kill()
        introTween?.kill()
        glide.tween.kill()
        resizeObserver.disconnect()
        canvas.removeEventListener('pointerdown', onPointerDown)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
        window.removeEventListener('keydown', onKey)
        scene.traverse((node) => {
          const mesh = node as THREE.Mesh
          mesh.geometry?.dispose?.()
          const material = mesh.material as THREE.Material | THREE.Material[] | undefined
          if (Array.isArray(material)) material.forEach((item) => item.dispose())
          else material?.dispose?.()
        })
        hole.dispose()
        renderer.dispose()
      }
    },
    { scope: rootRef, dependencies: [prints, reduced] },
  )

  const closeSheet = () => {
    const flight = flightRef.current
    flight.others = 1
    flight.active = 1
    flight.spin = 0
    flight.fade = 1
    flight.hold = 0
    if (panelRef.current) {
      panelRef.current.style.transition = ''
      panelRef.current.style.opacity = ''
    }
    if (headerRef.current) headerRef.current.style.opacity = ''
    openRef.current = false
    layoutRef.current()
    setOpen(false)
  }

  const current = places[active]

  return (
    <div ref={rootRef} className="relative h-dvh overflow-hidden text-[#1c1c1c]" style={{ background: paper, fontFamily: serif }}>
      <header
        ref={headerRef}
        className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-[4vw] pt-4 text-[13px] tracking-[0.08em]"
        style={{ opacity: open ? 0 : 1 }}
      >
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

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ touchAction: 'none' }} />

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
        ref={panelRef}
        className="pointer-events-none absolute top-[6.5vh] left-[4.2vw] z-30"
        style={{ opacity: open ? 0 : chrome ? 1 : 0, transition: open ? 'none' : 'opacity 0.45s ease' }}
      >
        {chrome ? (
          <>
            <div className="overflow-hidden">
              <h1
                key={current.id}
                className="whitespace-nowrap text-[clamp(22px,1.85vw,30px)] leading-none font-normal"
                style={{ animation: 'projects-line-in 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both' }}
              >
                {current.name}
              </h1>
            </div>
            <div className="mt-4 w-[min(30vw,380px)]">
              <Credit label="岗位" value={current.role} delay={0} />
              <Credit label="时间" value={current.period} delay={0.08} />
              <Credit label="内容" value={current.work} delay={0.16} paragraph />
            </div>
          </>
        ) : null}
      </div>

      {[0, 1].map((slot) => (
        <div
          key={slot}
          ref={(node) => {
            quoteRefs.current[slot] = node
          }}
          className="pointer-events-none absolute z-30 w-[320px] -translate-x-1/2 text-center"
          style={{ opacity: 0 }}
        >
          <Quote place={places[active > 0 ? active - 1 + slot : active + slot]} />
        </div>
      ))}

      {open ? <InternshipDetail place={current} onClose={closeSheet} /> : null}
    </div>
  )
}

function Credit({
  label,
  value,
  delay,
  paragraph = false,
  masked = false,
}: {
  label: string
  value: string
  delay: number
  paragraph?: boolean
  masked?: boolean
}) {
  const line = (text: string, className: string) =>
    masked ? (
      <div className="overflow-hidden">
        <p data-reveal="line" className={className}>
          {text}
        </p>
      </div>
    ) : (
      <p className={className}>{text}</p>
    )

  return (
    <div className={paragraph ? 'relative py-[0.62rem]' : 'relative grid grid-cols-[3.25rem_1fr] items-start gap-4 py-[0.62rem]'}>
      <span
        data-reveal={masked ? 'rule' : undefined}
        className="absolute inset-x-0 top-0 h-px origin-left bg-black/30"
        style={masked ? undefined : { animation: `intern-rule 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s both` }}
      />
      {paragraph ? (
        <>
          {line(label, 'text-[11px] tracking-[0.22em] text-black/50')}
          {line(value, 'mt-1.5 text-left text-[14px] leading-[1.6] font-normal whitespace-pre-line')}
        </>
      ) : (
        <>
          {line(label, 'pt-[3px] text-[11px] tracking-[0.22em] text-black/50')}
          {line(value, 'text-right text-[14px] leading-[1.45] font-normal')}
        </>
      )}
      <span className="absolute inset-x-0 bottom-0 h-px bg-black/20" />
    </div>
  )
}

function Quote({ place }: { place: Place }) {
  return (
    <div className="text-center">
      <p className="text-[12px] tracking-[0.18em]">★★★★</p>
      <p className="mt-2 text-[10px] tracking-[0.18em] text-black/55">{place.role}</p>
      <p className="mt-2 text-[13px] leading-[1.5] whitespace-pre-line">{place.work}</p>
    </div>
  )
}

function InternshipDetail({ place, onClose }: { place: Place; onClose: () => void }) {
  return (
    <InternshipSheet place={place} onClose={onClose}>
      {place.id === 'dongpeng' ? <DongpengCase /> : null}
    </InternshipSheet>
  )
}

function InternshipSheet({ place, onClose, children }: { place: Place; onClose: () => void; children?: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      if (prefersReducedMotion()) {
        gsap.set(root, { autoAlpha: 1 })
        return
      }
      const ease = energyEase()
      const title = root.querySelector('[data-reveal="title"]')
      const rules = root.querySelectorAll('[data-reveal="rule"]')
      const lines = root.querySelectorAll('[data-reveal="line"]')
      const art = root.querySelector('[data-reveal="art"]')
      const back = root.querySelector('[data-reveal="back"]')
      gsap.set(root, { autoAlpha: 0 })
      if (title) gsap.set(title, { yPercent: 120 })
      if (lines.length) gsap.set(lines, { yPercent: 120 })
      if (back) gsap.set(back, { yPercent: 120 })
      if (rules.length) gsap.set(rules, { scaleX: 0, transformOrigin: '0% 50%' })
      if (art) gsap.set(art, { yPercent: 72, autoAlpha: 0 })
      const reveal = gsap.timeline()
      reveal.to(root, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 0)
      if (title) reveal.to(title, { yPercent: 0, duration: 0.7, ease }, 0.35)
      if (rules.length) reveal.to(rules, { scaleX: 1, duration: 0.9, stagger: 0.06, ease }, 0.43)
      if (lines.length) reveal.to(lines, { yPercent: 0, duration: 0.7, stagger: 0.05, ease }, 0.47)
      if (back) reveal.to(back, { yPercent: 0, duration: 0.7, ease }, 0.73)
      if (art) reveal.to(art, { yPercent: 0, autoAlpha: 1, duration: 1.05, ease: 'power3.out' }, 0.35)
      const portrait = art?.querySelector('img')
      const hero = root.querySelector('[data-hero]')
      if (portrait && hero && root.scrollHeight > root.clientHeight + 8) {
        gsap.fromTo(
          portrait,
          { y: 0 },
          {
            y: -120,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              scroller: root,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          },
        )
      }
    },
    { scope: rootRef },
  )

  return (
    <div
      ref={rootRef}
      data-internship-sheet={place.id}
      className={`fixed inset-0 z-[80] overscroll-contain text-[#1c1c1c] ${children ? 'overflow-y-auto' : 'overflow-hidden'}`}
      style={{ background: paper, fontFamily: serif }}
    >
      <div className="fixed top-6 left-6 z-[90] overflow-hidden">
        <button data-reveal="back" type="button" onClick={onClose} className="text-sm tracking-[0.16em] underline underline-offset-4">
          返回
        </button>
      </div>
      <div data-hero className="relative min-h-dvh">
        <div className="relative z-10 mx-auto max-w-3xl px-6 pt-[10vh] text-center">
          <div className="overflow-hidden">
            <h2 data-reveal="title" className="whitespace-nowrap text-[clamp(26px,2.6vw,42px)] leading-none font-normal">
              {place.name}
            </h2>
          </div>
          <div className="mx-auto mt-8 max-w-xl text-left">
            <Credit label="岗位" value={place.role} delay={0} masked />
            <Credit label="时间" value={place.period} delay={0.06} masked />
            <Credit label="内容" value={place.work} delay={0.12} paragraph masked />
          </div>
        </div>
        <div data-reveal="art" className="absolute inset-x-0 bottom-[-4vh] flex justify-center">
          <img src={place.image} alt="" className="size-[min(46vh,520px)] rounded-full object-cover" />
        </div>
      </div>
      {children}
    </div>
  )
}

function holeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, 512, 512)
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(256, 256, 33, 0, Math.PI * 2)
  ctx.fill()
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(src))
    image.src = src
  })
}

async function makePrint(src: string, name: string) {
  const image = await loadImage(src)
  await document.fonts.load('64px "LXGW WenKai"').catch(() => undefined)
  return drawPrint(image, name)
}

function drawPrint(image: HTMLImageElement, name: string) {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

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

  ctx.fillStyle = '#f7f3ea'
  ctx.textAlign = 'center'
  const maxWidth = size * 0.72
  let fontSize = 68
  ctx.font = `${fontSize}px "LXGW WenKai", serif`
  while (fontSize > 28 && ctx.measureText(name).width > maxWidth) {
    fontSize -= 2
    ctx.font = `${fontSize}px "LXGW WenKai", serif`
  }
  ctx.fillText(name, size / 2, size * 0.27)

  return canvas
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
