import { useEffect, useRef } from 'react'

const PERSON = { x: 1340, y: 500 }
const HAND = { x: 1180, y: 430 }

type Cloud = {
  x: number
  y: number
  r: number
  speed: number
  alpha: number
  aspect: number
}

type Blade = {
  x: number
  h: number
  width: number
  phase: number
  lean: number
  shade: number
}

type Layout = {
  vw: number
  vh: number
  scale: number
  dw: number
  dh: number
  left: number
  top: number
}

type KiteLayer = {
  erase: HTMLCanvasElement
  sprite: HTMLCanvasElement
  originX: number
  originY: number
  pinX: number
  pinY: number
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function skyBlue(r: number, g: number, b: number) {
  return b > 175 && r < 160 && b > r + 55 && g > 70
}

function isKitePixel(r: number, g: number, b: number) {
  if (skyBlue(r, g, b)) return false
  if (r > 210 && g > 210 && b > 210) return false
  return Math.max(r, g, b) - Math.min(r, g, b) > 28
}

function fallbackPinX(vw: number) {
  return Math.min(vw * 0.2, 88)
}

function coverLayout(vw: number, vh: number, iw: number, ih: number): Layout {
  const scale = Math.max(vw / iw, vh / ih)
  const dw = iw * scale
  const dh = ih * scale
  const focusX = vw < 720 ? 0.84 : 0.72
  let left = vw * focusX - PERSON.x * scale
  const top = Math.min(0, Math.max(vh - dh, vh * 0.48 - PERSON.y * scale))
  const kiteX = 370 * scale
  if (left + kiteX < vw * 0.04) {
    const pulled = vw * 0.12 - kiteX
    const personScreenX = pulled + PERSON.x * scale
    if (personScreenX < vw * 0.94 && personScreenX > vw * 0.55) left = pulled
  }
  left = Math.min(0, Math.max(vw - dw, left))
  return { vw, vh, scale, dw, dh, left, top }
}

function buildKiteLayer(img: HTMLImageElement): KiteLayer | null {
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  const source = document.createElement('canvas')
  source.width = iw
  source.height = ih
  const sourceCtx = source.getContext('2d', { willReadFrequently: true })
  if (!sourceCtx) return null
  sourceCtx.drawImage(img, 0, 0)
  const frame = sourceCtx.getImageData(0, 0, iw, ih)
  const data = frame.data

  const box = {
    x0: Math.floor(iw * 0.09),
    y0: Math.floor(ih * 0.02),
    x1: Math.floor(iw * 0.29),
    y1: Math.floor(ih * 0.25),
  }

  let seedX = 0
  let seedY = 0
  let best = -Infinity
  for (let y = box.y0; y < box.y1; y += 1) {
    for (let x = box.x0; x < box.x1; x += 1) {
      const i = (y * iw + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const score = r - (g + b) * 0.5
      if (r > 200 && g < 90 && b < 90 && score > best) {
        best = score
        seedX = x
        seedY = y
      }
    }
  }
  if (best === -Infinity) return null

  const seen = new Uint8Array(iw * ih)
  const queue: number[] = [seedY * iw + seedX]
  seen[seedY * iw + seedX] = 1
  let minX = seedX
  let minY = seedY
  let maxX = seedX
  let maxY = seedY
  let head = 0
  while (head < queue.length) {
    const index = queue[head]
    head += 1
    const x = index % iw
    const y = (index / iw) | 0
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const nx = x + dx
        const ny = y + dy
        if (nx < box.x0 || ny < box.y0 || nx >= box.x1 || ny >= box.y1) continue
        const next = ny * iw + nx
        if (seen[next]) continue
        const p = next * 4
        if (!isKitePixel(data[p], data[p + 1], data[p + 2])) continue
        seen[next] = 1
        queue.push(next)
        if (nx < minX) minX = nx
        if (ny < minY) minY = ny
        if (nx > maxX) maxX = nx
        if (ny > maxY) maxY = ny
      }
    }
  }
  if (queue.length < 80) return null

  const dilated = new Uint8Array(iw * ih)
  const radius = 3
  for (let n = 0; n < queue.length; n += 1) {
    const index = queue[n]
    const x = index % iw
    const y = (index / iw) | 0
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= iw || ny >= ih) continue
        dilated[ny * iw + nx] = 1
      }
    }
  }

  const erase = document.createElement('canvas')
  erase.width = iw
  erase.height = ih
  const eraseCtx = erase.getContext('2d')
  if (!eraseCtx) return null
  const eraseData = eraseCtx.createImageData(iw, ih)
  const out = eraseData.data
  const fallback = [52, 145, 239]
  for (let y = 0; y < ih; y += 1) {
    for (let x = 0; x < iw; x += 1) {
      if (!dilated[y * iw + x]) continue
      let sr = fallback[0]
      let sg = fallback[1]
      let sb = fallback[2]
      let found = false
      for (let rad = 8; rad <= 36 && !found; rad += 8) {
        for (let k = 0; k < 12; k += 1) {
          const angle = (k / 12) * Math.PI * 2
          const nx = Math.round(x + Math.cos(angle) * rad)
          const ny = Math.round(y + Math.sin(angle) * rad)
          if (nx < 0 || ny < 0 || nx >= iw || ny >= ih) continue
          if (seen[ny * iw + nx]) continue
          const p = (ny * iw + nx) * 4
          if (!skyBlue(data[p], data[p + 1], data[p + 2])) continue
          sr = data[p]
          sg = data[p + 1]
          sb = data[p + 2]
          found = true
          break
        }
      }
      const p = (y * iw + x) * 4
      out[p] = sr
      out[p + 1] = sg
      out[p + 2] = sb
      out[p + 3] = 255
    }
  }

  let pinX = seedX
  let pinY = seedY
  const midX = (minX + maxX) / 2
  for (let n = 0; n < queue.length; n += 1) {
    const index = queue[n]
    const x = index % iw
    const y = (index / iw) | 0
    if (x >= midX && y > pinY) {
      pinX = x
      pinY = y
    }
  }

  eraseCtx.putImageData(eraseData, 0, 0)

  const steps = 80
  for (let s = 0; s <= steps; s += 1) {
    const t = s / steps
    const sag = Math.sin(t * Math.PI) * 18
    const x = Math.round((1 - t) * pinX + t * HAND.x)
    const y = Math.round((1 - t) * pinY + t * HAND.y + sag)
    const dx = HAND.x - pinX
    const dy = HAND.y - pinY
    const len = Math.hypot(dx, dy) || 1
    const px = -dy / len
    const py = dx / len
    const sx = Math.round(x + px * 8)
    const sy = Math.round(y + py * 8)
    if (sx < 0 || sy < 0 || sx >= iw || sy >= ih) continue
    const sample = (sy * iw + sx) * 4
    eraseCtx.fillStyle = `rgba(${data[sample]}, ${data[sample + 1]}, ${data[sample + 2]}, 0.96)`
    eraseCtx.beginPath()
    eraseCtx.arc(x, y, 5, 0, Math.PI * 2)
    eraseCtx.fill()
  }

  const pad = 2
  const originX = Math.max(0, minX - pad)
  const originY = Math.max(0, minY - pad)
  const sw = Math.min(iw - originX, maxX - originX + pad + 1)
  const sh = Math.min(ih - originY, maxY - originY + pad + 1)
  const sprite = document.createElement('canvas')
  sprite.width = sw
  sprite.height = sh
  const spriteCtx = sprite.getContext('2d')
  if (!spriteCtx) return null
  const spriteData = spriteCtx.createImageData(sw, sh)
  const sd = spriteData.data
  for (let y = 0; y < sh; y += 1) {
    for (let x = 0; x < sw; x += 1) {
      const src = (originY + y) * iw + (originX + x)
      if (!seen[src]) continue
      const from = src * 4
      const to = (y * sw + x) * 4
      sd[to] = data[from]
      sd[to + 1] = data[from + 1]
      sd[to + 2] = data[from + 2]
      sd[to + 3] = 255
    }
  }
  spriteCtx.putImageData(spriteData, 0, 0)

  return { erase, sprite, originX, originY, pinX, pinY }
}

export default function MeadowBackground() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!root || !canvas || !image) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const random = mulberry32(20260328)
    const clouds: Cloud[] = Array.from({ length: 8 }, () => ({
      x: random(),
      y: 0.02 + random() * 0.3,
      r: 80 + random() * 140,
      speed: 6 + random() * 10,
      alpha: 0.1 + random() * 0.14,
      aspect: 0.42 + random() * 0.18,
    }))
    const blades: Blade[] = Array.from({ length: 96 }, () => ({
      x: random(),
      h: 0.07 + random() * 0.08,
      width: 1.1 + random() * 1.5,
      phase: random() * Math.PI * 2,
      lean: random() * 2 - 1,
      shade: random(),
    }))

    let layout: Layout = { vw: 1, vh: 1, scale: 1, dw: 1, dh: 1, left: 0, top: 0 }
    let kite: KiteLayer | null = null
    let prepared = false
    const wind = { x: 0.15, y: 0 }
    const desired = { x: 0.15, y: 0 }
    let lastPointer = 0
    let pointerActive = false
    let running = true
    let frame = 0

    const placeImage = () => {
      const vw = root.clientWidth
      const vh = root.clientHeight
      if (!vw || !vh || !image.naturalWidth) return
      layout = coverLayout(vw, vh, image.naturalWidth, image.naturalHeight)
      image.style.left = `${layout.left}px`
      image.style.top = `${layout.top}px`
      image.style.width = `${layout.dw}px`
      image.style.height = `${layout.dh}px`
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(vw * dpr))
      canvas.height = Math.max(1, Math.floor(vh * dpr))
    }

    const prepare = () => {
      if (prepared || !image.naturalWidth) return
      prepared = true
      placeImage()
      const build = () => {
        if (!running) return
        kite = buildKiteLayer(image)
      }
      window.requestIdleCallback(build, { timeout: 500 })
    }

    const onPointer = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      pointerActive = true
      lastPointer = performance.now()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      desired.x = Math.max(-1, Math.min(1, (x - 0.5) * 1.7))
      desired.y = Math.max(-1, Math.min(1, (y - 0.42) * 0.85))
    }

    const drawCloud = (cloud: Cloud) => {
      const cx = cloud.x * layout.vw
      const cy = cloud.y * layout.vh
      ctx.save()
      ctx.globalAlpha = cloud.alpha
      const gradient = ctx.createRadialGradient(cx, cy, cloud.r * 0.2, cx, cy, cloud.r)
      gradient.addColorStop(0, 'rgba(255,255,255,0.95)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.ellipse(cx, cy, cloud.r, cloud.r * cloud.aspect, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(cx - cloud.r * 0.42, cy + 6, cloud.r * 0.58, cloud.r * 0.32, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(cx + cloud.r * 0.4, cy + 4, cloud.r * 0.5, cloud.r * 0.28, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const draw = (now: number) => {
      const { vw, vh, scale, left, top } = layout
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, vw, vh)

      const photoPinX = kite ? left + kite.pinX * scale : -1
      const photoPinY = kite ? top + kite.pinY * scale : -1
      const handX = left + HAND.x * scale
      const handY = top + HAND.y * scale
      const kiteOnPhoto = photoPinX > 24 && photoPinX < vw * 0.62 && photoPinY > 12 && photoPinY < vh * 0.62
      const offsetX = reduced ? 0 : wind.x * 86
      const offsetY = reduced ? 0 : wind.y * 40 - Math.abs(wind.x) * 16

      if (kite) ctx.drawImage(kite.erase, left, top, layout.dw, layout.dh)

      if (!reduced) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, vw, vh * 0.46)
        ctx.clip()
        for (const cloud of clouds) drawCloud(cloud)
        ctx.restore()
      }

      const parkedWidth = kite ? Math.min(150, vw * 0.34) : 0
      const parkedHeight = kite?.sprite.width ? parkedWidth * (kite.sprite.height / kite.sprite.width) : parkedWidth
      const pinRy = kite?.sprite.height ? (kite.pinY - kite.originY) / kite.sprite.height : 0.4
      const kiteX = kiteOnPhoto ? photoPinX + offsetX : fallbackPinX(vw) + offsetX
      const kiteY = kiteOnPhoto ? photoPinY + offsetY : vh * 0.2 + pinRy * parkedHeight + offsetY
      if (kite) {
      const sway = reduced ? 0 : Math.sin(now * 0.0016) * (12 + Math.abs(wind.x) * 32)
      const midX = (kiteX + handX) / 2 + sway
      const midY = (kiteY + handY) / 2 + (reduced ? 10 : Math.sin(now * 0.001 + 0.6) * 8)
      ctx.strokeStyle = 'rgba(255,255,255,0.78)'
      ctx.lineWidth = 1.35
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(kiteX, kiteY)
      ctx.quadraticCurveTo(midX, midY, handX, handY)
      ctx.stroke()

      if (kiteOnPhoto) {
        ctx.drawImage(
          kite.sprite,
          left + kite.originX * scale + offsetX,
          top + kite.originY * scale + offsetY,
          kite.sprite.width * scale,
          kite.sprite.height * scale,
        )
      } else {
        const pinRx = kite.sprite.width ? (kite.pinX - kite.originX) / kite.sprite.width : 0.5
        ctx.drawImage(
          kite.sprite,
          kiteX - pinRx * parkedWidth,
          kiteY - pinRy * parkedHeight,
          parkedWidth,
          parkedHeight,
        )
      }
      }

      if (!reduced) {
        const personX = left + PERSON.x * scale
        for (const blade of blades) {
          const x = blade.x * vw
          const height = blade.h * vh
          const gust = Math.sin(now * 0.0022 + blade.phase) * (16 + wind.x * 42) + wind.x * 26
          const distance = Math.abs(x - personX) / vw
          ctx.globalAlpha = distance < 0.14 ? 0.1 : Math.min(0.62, 0.18 + distance)
          ctx.strokeStyle = blade.shade > 0.55 ? 'rgb(92, 158, 58)' : 'rgb(46, 112, 42)'
          ctx.lineWidth = blade.width
          ctx.beginPath()
          ctx.moveTo(x, vh + 2)
          ctx.quadraticCurveTo(x + gust * 0.4, vh - height * 0.55, x + gust + blade.lean * 8, vh - height)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      }
    }

    let last = performance.now()
    const loop = (now: number) => {
      if (!running) return
      frame = requestAnimationFrame(loop)
      if (document.hidden) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      prepare()
      if (!image.naturalWidth) return

      const idle = reduced || !pointerActive || now - lastPointer > 1200
      const naturalX = Math.sin(now * 0.00022) * 0.26 + Math.sin(now * 0.00007) * 0.1
      const naturalY = Math.sin(now * 0.00018 + 0.7) * 0.08
      const targetX = idle ? naturalX : desired.x
      const targetY = idle ? naturalY : desired.y
      const ease = idle ? 1.05 : 2.8
      wind.x += (targetX - wind.x) * Math.min(1, dt * ease)
      wind.y += (targetY - wind.y) * Math.min(1, dt * ease)

      if (!reduced) {
        for (const cloud of clouds) {
          cloud.x += ((cloud.speed + wind.x * 34) * dt) / Math.max(layout.vw, 1)
          if (cloud.x > 1.35) cloud.x = -0.35
          if (cloud.x < -0.45) cloud.x = 1.25
        }
      }
      draw(now)
    }

    const onResize = () => placeImage()
    const observer = new ResizeObserver(onResize)
    observer.observe(root)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerdown', onPointer, { passive: true })
    if (image.complete) prepare()
    else image.addEventListener('load', prepare, { once: true })
    frame = requestAnimationFrame(loop)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [])

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        ref={imageRef}
        src="/backgrounds/meadow.jpg"
        alt=""
        draggable={false}
        fetchPriority="high"
        decoding="async"
        onLoad={() => {
          document.documentElement.style.backgroundImage = 'none'
        }}
        className="absolute max-w-none select-none"
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
