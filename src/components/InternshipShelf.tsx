import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Raycaster,
  RingGeometry,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import type { Internship } from '@/src/content'

const pageBg = '#e6e3dc'
const ink = '#1a1a1a'
const serif = '"Noto Serif SC", "Noto Sans SC", serif'

export type InternshipShelfHandle = {
  pick: (clientX: number, clientY: number) => number | null
}

type Anchor = {
  slug: string
  x: number
  bottom: number
}

let introPlayed = false

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function smooth(value: number) {
  const t = clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

function poseAt(index: number, progress: number) {
  const delta = index - progress
  const angle = delta * 0.35
  const depth = 1
  const distance = Math.abs(delta)
  return {
    x: Math.sin(angle) * 2.3 * 2.4,
    y: 0.06 * Math.max(0, 1 - distance),
    z: -Math.cos(angle) * depth * 2.4 + depth * 2.4,
    scale: distance < 0.5 ? 1 : Math.max(0.8, 1 - distance * 0.12),
  }
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource & { width: number; height: number },
  size: number,
  position: string,
) {
  const [rawX, rawY] = position.split(' ')
  const px = clamp(Number.parseFloat(rawX) / 100 || 0.5, 0, 1)
  const py = clamp(Number.parseFloat(rawY) / 100 || 0.5, 0, 1)
  const ratio = image.width / image.height
  const coverWidth = ratio > 1 ? size * ratio : size
  const coverHeight = ratio > 1 ? size : size / ratio
  ctx.drawImage(image, (size - coverWidth) * px, (size - coverHeight) * py, coverWidth, coverHeight)
}

function paintFace(
  canvas: HTMLCanvasElement,
  item: Internship,
  image?: CanvasImageSource & { width: number; height: number },
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const size = canvas.width
  ctx.clearRect(0, 0, size, size)
  ctx.save()
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2)
  ctx.clip()
  if (image) drawCover(ctx, image, size, item.imagePosition)
  else {
    ctx.fillStyle = '#b7b2a8'
    ctx.fillRect(0, 0, size, size)
  }
  const shade = ctx.createLinearGradient(0, 0, size, size)
  shade.addColorStop(0, 'rgba(255,255,255,0.22)')
  shade.addColorStop(0.42, 'rgba(255,255,255,0)')
  shade.addColorStop(1, 'rgba(0,0,0,0.2)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `500 ${Math.round(size * 0.072)}px ${serif}`
  ctx.shadowColor = 'rgba(0,0,0,0.45)'
  ctx.shadowBlur = 8
  const title = item.title
  const maxWidth = size * 0.72
  const lines = title.length > 6 ? [title.slice(0, Math.ceil(title.length / 2)), title.slice(Math.ceil(title.length / 2))] : [title]
  lines.forEach((line, lineIndex) => {
    ctx.font = `500 ${Math.round(size * (lines.length > 1 ? 0.058 : 0.072))}px ${serif}`
    const y = size * (0.2 + lineIndex * 0.075)
    ctx.fillText(line, size / 2, y, maxWidth)
  })
  ctx.restore()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size * 0.054, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'
}

function writeScribble(geometry: BufferGeometry, sweep: number) {
  const points = 56
  const position = geometry.getAttribute('position') as BufferAttribute
  const radii = [1.08, 1.12]
  const phases = [0.4, 2.2]
  radii.forEach((radius, loop) => {
    const turn = sweep * (loop === 0 ? 1 : 0.9)
    for (let step = 0; step <= points; step += 1) {
      const along = step / points
      const angle = phases[loop] + along * Math.PI * 2 * turn
      const wobble = 1 + Math.sin(angle * 3 + loop) * 0.02 + Math.cos(angle * 5) * 0.012
      const inner = radius * wobble - 0.012
      const outer = radius * wobble + 0.012
      const vertex = (loop * (points + 1) + step) * 2
      position.setXYZ(vertex, Math.cos(angle) * inner, Math.sin(angle) * inner, 0.04)
      position.setXYZ(vertex + 1, Math.cos(angle) * outer, Math.sin(angle) * outer, 0.04)
    }
  })
  position.needsUpdate = true
}

const InternshipShelf = forwardRef<
  InternshipShelfHandle,
  {
    items: Internship[]
    progress: number
    reduced: boolean
    narrow: boolean
    showCopy: boolean
    onReady: () => void
  }
>(function InternshipShelf({ items, progress, reduced, narrow, showCopy, onReady }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(progress)
  const showCopyRef = useRef(showCopy)
  const drawRef = useRef<() => void>(() => {})
  const pickRef = useRef<(clientX: number, clientY: number) => number | null>(() => null)
  const onReadyRef = useRef(onReady)
  const [anchors, setAnchors] = useState<Anchor[]>([])

  useEffect(() => {
    onReadyRef.current = onReady
  })

  useImperativeHandle(ref, () => ({
    pick: (clientX, clientY) => pickRef.current(clientX, clientY),
  }))

  useEffect(() => {
    progressRef.current = progress
    showCopyRef.current = showCopy
    drawRef.current()
  }, [progress, showCopy])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let alive = true
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = SRGBColorSpace
    const scene = new Scene()
    const camera = new PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(0, narrow ? 0.15 : 0.05, narrow ? 7.3 : 5.05)
    camera.lookAt(0, narrow ? -0.35 : -0.05, 0)
    const gallery = new Group()
    gallery.rotation.set(-Math.PI / 6, -Math.PI / 6, 0)
    gallery.scale.setScalar(narrow ? 0.84 : 1.02)
    gallery.position.set(narrow ? 0 : 0.02, narrow ? -0.2 : 0.22, 0)
    scene.add(gallery)
    scene.add(new AmbientLight(0xffffff, 0.72))
    scene.add(new HemisphereLight(0xfffaf2, 0xc9c4ba, 0.55))
    const key = new DirectionalLight(0xfff9e8, 1.15)
    key.position.set(3.5, 2.4, 6)
    scene.add(key)
    const rim = new DirectionalLight(0xd7e6f5, 0.55)
    rim.position.set(-4, 3, -3)
    scene.add(rim)

    const faceGeometry = new CircleGeometry(1, 72)
    const backGeometry = new CircleGeometry(1, 48)
    const edgeGeometry = new CylinderGeometry(1, 1, 0.045, 64, 1, true)
    edgeGeometry.rotateX(Math.PI / 2)
    const hubGeometry = new RingGeometry(0.125, 0.2, 64)
    const lipGeometry = new RingGeometry(0.1, 0.132, 48)
    const backMaterial = new MeshStandardMaterial({ color: '#1c1e24', roughness: 0.35, metalness: 0.85 })
    const edgeMaterial = new MeshStandardMaterial({ color: '#f2f2f2', roughness: 0.16, metalness: 0.78 })
    const hubMaterial = new MeshBasicMaterial({ color: '#d8d8dc' })
    const lipMaterial = new MeshBasicMaterial({ color: '#4a4a4a' })
    const pickMaterial = new MeshBasicMaterial({ visible: false })
    const discs: { group: Group; spin: Group; index: number; faceCanvas: HTMLCanvasElement; faceTexture: CanvasTexture }[] = []
    const photos: Array<(CanvasImageSource & { width: number; height: number }) | undefined> = []
    const pickMeshes: Mesh[] = []

    items.forEach((item, index) => {
      const group = new Group()
      const spin = new Group()
      const faceCanvas = document.createElement('canvas')
      faceCanvas.width = 1024
      faceCanvas.height = 1024
      paintFace(faceCanvas, item)
      const faceTexture = new CanvasTexture(faceCanvas)
      faceTexture.colorSpace = SRGBColorSpace
      const faceMaterial = new MeshStandardMaterial({
        map: faceTexture,
        roughness: 0.46,
        metalness: 0.12,
        emissive: '#ffffff',
        emissiveMap: faceTexture,
        emissiveIntensity: 0.42,
        alphaTest: 0.2,
      })
      const face = new Mesh(faceGeometry, faceMaterial)
      face.position.z = 0.024
      const back = new Mesh(backGeometry, backMaterial)
      back.position.z = -0.024
      back.rotation.y = Math.PI
      const edge = new Mesh(edgeGeometry, edgeMaterial)
      const hub = new Mesh(hubGeometry, hubMaterial)
      hub.position.z = 0.03
      const lip = new Mesh(lipGeometry, lipMaterial)
      lip.position.z = 0.038
      const hole = new Mesh(new CircleGeometry(0.1, 32), new MeshBasicMaterial({ color: pageBg }))
      hole.position.z = 0.044
      const pick = new Mesh(new CircleGeometry(1, 24), pickMaterial)
      pick.userData.index = index
      spin.add(face, back, edge, hub, lip, hole, pick)
      group.add(spin)
      gallery.add(group)
      discs.push({ group, spin, index, faceCanvas, faceTexture })
      pickMeshes.push(pick)
      const loader = new Image()
      loader.onload = () => {
        if (!alive) return
        photos[index] = loader
        paintFace(faceCanvas, item, loader)
        faceTexture.needsUpdate = true
        drawRef.current()
      }
      loader.src = item.image
    })

    const scribbleGeometry = new BufferGeometry()
    const scribblePoints = 56
    const scribblePosition = new Float32Array((scribblePoints + 1) * 4 * 3)
    scribbleGeometry.setAttribute('position', new BufferAttribute(scribblePosition, 3))
    const indices: number[] = []
    for (let loop = 0; loop < 2; loop += 1) {
      const offset = loop * (scribblePoints + 1) * 2
      for (let step = 0; step < scribblePoints; step += 1) {
        const base = offset + step * 2
        indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2)
      }
    }
    scribbleGeometry.setIndex(indices)
    writeScribble(scribbleGeometry, 1)
    const scribble = new Mesh(
      scribbleGeometry,
      new MeshBasicMaterial({ color: ink, side: DoubleSide, depthTest: false, transparent: true }),
    )
    scribble.renderOrder = 20
    gallery.add(scribble)

    const raycaster = new Raycaster()
    const pointer = new Vector2()
    pickRef.current = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return null
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(pickMeshes, false)[0]
      return typeof hit?.object.userData.index === 'number' ? hit.object.userData.index : null
    }

    const worldOffset = new Vector3()
    const projected = new Vector3()
    let frame = 0
    let anchorFrame = 0
    let settled = introPlayed || reduced
    const introStart = performance.now()

    const resize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (!width || !height) return
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const introAt = (now: number) => {
      if (settled) return { rise: 1, turn: 1, others: 1, sweep: 1 }
      const t = (now - introStart) / 2700
      if (t >= 1) return { rise: 1, turn: 1, others: 1, sweep: 1 }
      return {
        rise: smooth(t / 0.46),
        turn: smooth(clamp((t - 0.04) / 0.5, 0, 1)),
        others: smooth(clamp((t - 0.36) / 0.46, 0, 1)),
        sweep: smooth(clamp((t - 0.58) / 0.36, 0, 1)),
      }
    }

    const projectAnchor = (index: number, radius = 1) => {
      const pose = poseAt(index, progressRef.current)
      let bottom = -Infinity
      let centerX = 0
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      for (let step = 0; step < 12; step += 1) {
        const angle = (step / 12) * Math.PI * 2
        projected
          .set(
            pose.x + Math.cos(angle) * pose.scale * radius,
            pose.y + Math.sin(angle) * pose.scale * radius,
            pose.z,
          )
          .applyMatrix4(gallery.matrixWorld)
          .project(camera)
        const x = (projected.x * 0.5 + 0.5) * width
        const y = (-projected.y * 0.5 + 0.5) * height
        if (step === 0) centerX = x
        bottom = Math.max(bottom, y)
      }
      projected.set(pose.x, pose.y, pose.z).applyMatrix4(gallery.matrixWorld).project(camera)
      centerX = (projected.x * 0.5 + 0.5) * width
      if (centerX < width * 0.18 || centerX > width * 0.82 || bottom > height - 8) return null
      return { slug: items[index].slug, x: centerX, bottom }
    }

    const draw = () => {
      const now = performance.now()
      const intro = introAt(now)
      const finished = settled || (intro.rise === 1 && intro.turn === 1 && intro.others === 1 && intro.sweep === 1)
      gallery.updateMatrixWorld(true)
      worldOffset.set(0, -3 * (1 - intro.rise), -0.7 * (1 - intro.rise))
      worldOffset.applyQuaternion(gallery.quaternion.clone().invert())
      worldOffset.divideScalar(gallery.scale.x || 1)
      const progressNow = progressRef.current
      const lead = clamp(Math.round(progressNow), 0, items.length - 1)
      discs.forEach((disc) => {
        const pose = poseAt(disc.index, progressNow)
        const leading = disc.index === lead
        const scale = pose.scale * (leading ? 0.08 + 0.92 * Math.max(intro.rise, intro.turn) : intro.others)
        disc.group.position.set(
          pose.x + (leading ? worldOffset.x : 0),
          pose.y + (leading ? worldOffset.y : 0),
          pose.z + (leading ? worldOffset.z : 0) - (leading ? 0 : (1 - intro.others) * 2.2),
        )
        disc.group.scale.setScalar(Math.max(0.001, scale))
        disc.spin.rotation.y = leading && !finished ? (-Math.PI / 2) * (1 - intro.turn) : 0
        disc.spin.rotation.z = leading && !finished ? 1.1 * (1 - intro.turn) ** 2 : 0
        disc.group.visible = scale > 0.02
      })
      const base = clamp(Math.floor(progressNow), 0, Math.max(0, items.length - 1))
      const next = clamp(base + 1, 0, Math.max(0, items.length - 1))
      const fraction = progressNow - Math.floor(progressNow)
      const handoff = fraction < 0.32 ? 0 : fraction > 0.68 ? 1 : (fraction - 0.32) / 0.36
      const blend = handoff * handoff * (3 - 2 * handoff)
      const from = poseAt(base, progressNow)
      const to = poseAt(next, progressNow)
      scribble.position.set(
        from.x + (to.x - from.x) * blend,
        from.y + (to.y - from.y) * blend,
        from.z + (to.z - from.z) * blend + 0.05,
      )
      scribble.scale.setScalar(from.scale + (to.scale - from.scale) * blend)
      scribble.visible = intro.sweep > 0.02
      const material = scribble.material
      if (material instanceof MeshBasicMaterial) material.opacity = intro.sweep
      writeScribble(scribbleGeometry, Math.max(intro.sweep, 0.001))
      renderer.render(scene, camera)
      if (finished && !settled) {
        settled = true
        introPlayed = true
        onReadyRef.current()
      }
      const nextAnchors = showCopyRef.current
        ? items.flatMap((_, index) => {
            const anchor = projectAnchor(index, 1.2)
            return anchor ? [anchor] : []
          })
        : []
      if (anchorFrame) cancelAnimationFrame(anchorFrame)
      anchorFrame = requestAnimationFrame(() => {
        anchorFrame = 0
        setAnchors((current) => {
          if (
            current.length === nextAnchors.length &&
            current.every(
              (anchor, index) =>
                anchor.slug === nextAnchors[index].slug &&
                Math.abs(anchor.x - nextAnchors[index].x) < 0.5 &&
                Math.abs(anchor.bottom - nextAnchors[index].bottom) < 0.5,
            )
          ) {
            return current
          }
          return nextAnchors
        })
      })
      const moving = Math.abs(progressNow - Math.round(progressNow)) > 0.001
      if ((!finished || moving) && !frame) frame = requestAnimationFrame(tick)
    }

    const tick = () => {
      frame = 0
      draw()
    }

    drawRef.current = draw
    void document.fonts?.load(`500 64px ${serif}`).then(() => {
      if (!alive) return
      discs.forEach((disc) => {
        paintFace(disc.faceCanvas, items[disc.index], photos[disc.index])
        disc.faceTexture.needsUpdate = true
      })
      draw()
    })
    draw()

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      cancelAnimationFrame(anchorFrame)
      observer.disconnect()
      drawRef.current = () => {}
      pickRef.current = () => null
      const materials = new Set<Mesh['material']>()
      gallery.traverse((object) => {
        if (!(object instanceof Mesh)) return
        if (
          object.geometry &&
          object.geometry !== faceGeometry &&
          object.geometry !== backGeometry &&
          object.geometry !== edgeGeometry &&
          object.geometry !== hubGeometry &&
          object.geometry !== lipGeometry
        ) {
          object.geometry.dispose()
        }
        const list = Array.isArray(object.material) ? object.material : [object.material]
        list.forEach((material) => materials.add(material))
      })
      materials.forEach((material) => {
        const single = Array.isArray(material) ? null : material
        if (single instanceof MeshStandardMaterial && single.map && single.map !== single.emissiveMap) single.map.dispose()
        if (single instanceof MeshStandardMaterial) single.map?.dispose()
        if (!Array.isArray(material)) material.dispose()
      })
      faceGeometry.dispose()
      backGeometry.dispose()
      edgeGeometry.dispose()
      hubGeometry.dispose()
      lipGeometry.dispose()
      scribbleGeometry.dispose()
      renderer.dispose()
    }
  }, [items, narrow, reduced])

  return (
    <div className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {anchors.map((anchor) => {
        const item = items.find((entry) => entry.slug === anchor.slug)
        if (!item) return null
        return (
          <figure
            key={item.slug}
            className="absolute text-center"
            style={{
              left: anchor.x,
              top: anchor.bottom + (narrow ? 22 : 34),
              width: narrow ? 220 : 210,
              transform: 'translateX(-50%)',
            }}
          >
            <p className="tracking-[0.35em]">★★★★</p>
            <figcaption className="mt-2 text-[10px] tracking-[0.2em]">{item.note.source}</figcaption>
            <blockquote className="mt-2 text-lg leading-snug" style={{ fontFamily: serif }}>
              “{item.note.quote}”
            </blockquote>
          </figure>
        )
      })}
    </div>
  )
})

export default InternshipShelf
