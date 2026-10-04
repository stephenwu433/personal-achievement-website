import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CustomEase } from 'gsap/CustomEase'
import { Observer } from 'gsap/Observer'
import * as THREE from 'three'
import { profile, sections } from '@/src/content'

gsap.registerPlugin(useGSAP, Observer, CustomEase)
CustomEase.create('discGlide', '0.32, 0.72, 0, 1')

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

function scribblePoints(loop: number) {
  const points: THREE.Vector3[] = []
  const count = 72
  const stop = loop === 0 ? count : Math.round(count * 0.7)
  for (let point = 0; point <= stop; point += 1) {
    const angle = (point / count) * Math.PI * 2 - 0.45 + loop * 0.55
    const wobble = Math.sin(angle * 2 + loop * 1.3) * 0.028 + Math.sin(angle * 5.2) * 0.012
    const radius = 1.07 + loop * 0.04 + wobble
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.05))
  }
  return points
}

export default function Internships() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const quoteRefs = useRef<Array<HTMLDivElement | null>>([])
  const introRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
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
    Promise.all(places.map((place) => makePrint(place.image, place.lines))).then((canvases) => {
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
          new THREE.RingGeometry(0.985, 1.035, 80),
          new THREE.MeshBasicMaterial({ color: 0x2c2c2c, side: THREE.DoubleSide }),
        )
        rim.position.z = -0.012
        const mesh = new THREE.Mesh(
          new THREE.CircleGeometry(1, 80),
          new THREE.MeshBasicMaterial({ map: texture, alphaMap: hole, alphaTest: 0.5, side: THREE.DoubleSide }),
        )
        const hub = new THREE.Mesh(
          new THREE.RingGeometry(0.16, 0.27, 64),
          new THREE.MeshBasicMaterial({ color: 0xf4f4f4, side: THREE.DoubleSide }),
        )
        hub.position.z = 0.02
        group.add(rim, mesh, hub)
        gallery.add(group)
        return { group, mesh, spin: 0 }
      })

      const ringMaterial = new THREE.LineBasicMaterial({ color: 0x161616, transparent: true, opacity: 0 })
      const rings = [0, 1].map((loop) => {
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(scribblePoints(loop)), ringMaterial)
        line.frustumCulled = false
        gallery.add(line)
        return line
      })

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
        discs.forEach((disc, index) => {
          const raw = index - play.index
          const delta = raw * intro.fan
          const settled = Math.abs(raw) < 0.45 && intro.fan > 0.92
          const pose = discPose(delta, settled && index === focus)
          disc.group.position.set(pose.x, pose.y - (1 - intro.rise) * 3.2, pose.z + (1 - intro.fan) * index * 0.05)
          disc.group.rotation.set(index === focus ? tilt.x : 0, -pose.angle + intro.spin * Math.PI * 0.5, disc.spin + (index === focus ? tilt.y : 0))
          const grown = 0.62 + 0.38 * intro.rise
          disc.group.scale.setScalar(pose.scale * grown)
          disc.group.visible = Math.abs(raw) < 3.4
        })

        const focusPose = discPose(0, true)
        const showRing = intro.fan > 0.98
        rings.forEach((ring) => {
          if (ring.parent !== gallery) gallery.add(ring)
          ring.visible = showRing
          ringMaterial.opacity = showRing ? 1 : 0
          ring.position.set(focusPose.x, focusPose.y - (1 - intro.rise) * 3.2, focusPose.z + 0.08)
          ring.rotation.set(tilt.x, intro.spin * Math.PI * 0.5, tilt.y)
          ring.scale.setScalar(0.62 + 0.38 * intro.rise)
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
          const lower = Math.max(project(disc.group.localToWorld(edge.set(0, 1, 0))).y, project(disc.group.localToWorld(edge.set(0, -1, 0))).y)
          if (origin.x < width * 0.18 || origin.x > width * 0.78) return
          const top = lower + 18
          if (top > height - 64) return
          spots.push({ x: origin.x, top })
        })
        quoteRefs.current.forEach((quote, index) => {
          if (!quote) return
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
        renderer.render(scene, camera)
      }

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
          if (picked === Math.round(play.index)) setOpen(true)
          else glideTo(picked)
          return
        }
        const flicked = gsap.utils.clamp(-1, 1, pointer.vx * 420)
        glideTo(Math.round(play.index + flicked))
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
        onDown: () => step(1),
        onUp: () => step(-1),
      })

      canvas.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('keydown', onKey)
      const resizeObserver = new ResizeObserver(() => layout())
      resizeObserver.observe(canvas)

      let introTween: gsap.core.Timeline | null = null
      if (reduced) {
        setChrome(true)
        setActive(0)
      } else {
        introTween = gsap.timeline({ onUpdate: layout })
        introTween.to(intro, { rise: 1, spin: 0, count: 100, duration: 1.45, ease: 'power2.inOut' }, 0.35)
        introTween.to(intro, { fan: 1, duration: 1.15, ease: 'power3.inOut' }, 1.45)
        introTween.call(() => {
          if (alive) setChrome(true)
        })
      }
      layout()

      return () => {
        alive = false
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
  ctx.arc(256, 256, 40, 0, Math.PI * 2)
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

async function makePrint(src: string, lines: string[]) {
  const image = await loadImage(src)
  await document.fonts.load('64px "LXGW WenKai"').catch(() => undefined)
  return drawPrint(image, lines)
}

function drawPrint(image: HTMLImageElement, lines: string[]) {
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
  ctx.font = '64px "LXGW WenKai", serif'
  lines.forEach((line, index) => {
    ctx.fillText(line, size / 2, size * 0.24 + index * 72)
  })

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
