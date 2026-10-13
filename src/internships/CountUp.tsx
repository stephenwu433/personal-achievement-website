import { useEffect, useRef, useState } from 'react'
import { COUNT_MS, formatCount, frameIsVisible, inReadingZone, parseCount, prefersReduced } from './count'

function staggerMs(node: HTMLElement) {
  const host = node.closest('[data-count]')
  if (!(host instanceof HTMLElement)) return 0
  const group = host.parentElement?.parentElement
  if (!group) return 0
  const peers = [...group.children].flatMap((child) => {
    if (!(child instanceof HTMLElement)) return []
    if (child.matches('[data-count]')) return [child]
    const inner = child.querySelector('[data-count]')
    return inner instanceof HTMLElement ? [inner] : []
  })
  const index = peers.indexOf(host)
  return index < 0 ? 0 : Math.min(index, 6) * 110
}

function RollDigit({ char }: { char: string }) {
  const shown = useRef(char)
  const last = useRef(0)
  const [pair, setPair] = useState<{ from: string; to: string } | null>(null)

  useEffect(() => {
    if (char === shown.current) return
    const from = shown.current
    const now = performance.now()
    const gap = now - last.current
    shown.current = char
    last.current = now
    if (gap < 90 || !/\d/.test(from) || !/\d/.test(char)) {
      setPair(null)
      return
    }
    setPair({ from, to: char })
    const id = window.setTimeout(() => setPair(null), 230)
    return () => window.clearTimeout(id)
  }, [char])

  if (!pair) {
    return (
      <span className="intern-roll">
        <span className="intern-roll-s">{char}</span>
      </span>
    )
  }
  return (
    <span className="intern-roll">
      <span className="intern-roll-pair">
        <span className="intern-roll-s">{pair.from}</span>
        <span className="intern-roll-s">{pair.to}</span>
      </span>
    </span>
  )
}

function CountText({ text }: { text: string }) {
  const pieces: { kind: 'd' | 't'; value: string }[] = []
  for (const char of text) {
    const kind = /\d/.test(char) ? 'd' : 't'
    const prev = pieces[pieces.length - 1]
    if (prev?.kind === kind) prev.value += char
    else pieces.push({ kind, value: char })
  }
  return pieces.map((piece, index) =>
    piece.kind === 'd' ? <RollDigit key={`d${index}`} char={piece.value} /> : <span key={`t${index}`}>{piece.value}</span>,
  )
}

export default function CountUp({ value }: { value: string }) {
  const parsed = parseCount(value)
  const reduced = prefersReduced()
  const [text, setText] = useState(() => (parsed && !reduced ? formatCount(parsed, 0) : value))
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    const parsedNow = parseCount(value)
    if (!node || !parsedNow || prefersReduced()) return
    let cancelled = false
    let started = false
    let raf = 0
    let timer = 0
    let countRaf = 0
    let waitFrom = 0
    const scroller = node.closest('[data-internship-sheet]')
    const host: HTMLElement | Window = scroller instanceof HTMLElement ? scroller : window

    const begin = () => {
      timer = window.setTimeout(() => {
        if (cancelled) return
        const startedAt = performance.now()
        const step = (now: number) => {
          if (cancelled) return
          const progress = Math.min(1, (now - startedAt) / COUNT_MS)
          if (progress >= 1) {
            setText(value)
            return
          }
          setText(formatCount(parsedNow, parsedNow.target * progress))
          countRaf = requestAnimationFrame(step)
        }
        countRaf = requestAnimationFrame(step)
      }, 50 + staggerMs(node))
    }

    const check = () => {
      raf = 0
      if (cancelled || started) return
      const zone = node.closest('[data-count]')
      const target = zone instanceof HTMLElement ? zone : node
      if (!inReadingZone(target)) {
        waitFrom = 0
        return
      }
      if (!frameIsVisible(target)) {
        if (!waitFrom) waitFrom = performance.now()
        if (performance.now() - waitFrom < 1100) {
          raf = requestAnimationFrame(check)
          return
        }
      }
      started = true
      host.removeEventListener('scroll', onScroll)
      begin()
    }
    const onScroll = () => {
      if (!raf && !started) raf = requestAnimationFrame(check)
    }
    host.addEventListener('scroll', onScroll, { passive: true })
    check()
    return () => {
      cancelled = true
      host.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(countRaf)
      window.clearTimeout(timer)
    }
  }, [value])

  if (!parsed || reduced) return <>{value}</>
  return (
    <span ref={ref} className="intern-count" aria-label={value}>
      <CountText text={text} />
    </span>
  )
}
