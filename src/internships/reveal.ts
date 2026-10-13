import { useLayoutEffect, useRef, type RefObject } from 'react'
import { frameIsVisible, inReadingZone, prefersReduced } from './count'

const STAGGER_MS = 140
const MAX_STAGGER = 7

const shown = new WeakSet<HTMLElement>()
const litBars = new WeakSet<HTMLElement>()
const watching = new WeakMap<HTMLElement, IntersectionObserver>()
const hosts = new WeakMap<Element, HTMLElement>()

type Play = {
  kick: () => void
  stop: () => void
}

type Session = {
  observer: IntersectionObserver
  mutations: MutationObserver
  play: Play
}

function byDocumentOrder(a: HTMLElement, b: HTMLElement) {
  if (a === b) return 0
  const position = a.compareDocumentPosition(b)
  if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
  if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
  return 0
}

function revealElement(element: HTMLElement, batchIndex: number, instant: boolean) {
  if (shown.has(element)) return
  shown.add(element)
  const delay = instant ? 0 : Math.min(batchIndex, MAX_STAGGER) * STAGGER_MS
  element.dataset.internDelay = String(delay)
  element.style.transitionDelay = `${delay}ms`
  element.classList.add('is-in')
}

function restore(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-rise], [data-title], [data-frame]').forEach((element) => {
    if (!shown.has(element)) return
    element.classList.add('is-in')
    const delay = element.dataset.internDelay
    if (delay) element.style.transitionDelay = `${delay}ms`
  })
  root.querySelectorAll<HTMLElement>('.intern-bar').forEach((bar) => {
    if (!litBars.has(bar)) return
    bar.classList.add('is-in')
  })
}

function observedNode(element: HTMLElement) {
  if (!element.hasAttribute('data-title')) return element
  const parent = element.parentElement
  if (!(parent instanceof HTMLElement)) return element
  const overflow = getComputedStyle(parent).overflowY
  if (overflow === 'visible') return element
  return parent
}

function scan(root: HTMLElement, observer: IntersectionObserver) {
  const fresh: HTMLElement[] = []
  root.querySelectorAll<HTMLElement>('[data-rise], [data-title], [data-frame]').forEach((element) => {
    if (shown.has(element) || watching.get(element) === observer) return
    watching.set(element, observer)
    fresh.push(element)
  })
  if (!fresh.length) return
  if (prefersReduced()) {
    fresh.forEach((element) => revealElement(element, 0, true))
    return
  }
  fresh.forEach((element) => {
    const node = observedNode(element)
    hosts.set(node, element)
    observer.observe(node)
  })
}

function createPlay(root: HTMLElement): Play {
  const scroller = root.closest('[data-internship-sheet]')
  const host: HTMLElement | Window = scroller instanceof HTMLElement ? scroller : window
  const timers = new Set<number>()
  let raf = 0
  let stopped = false

  const check = () => {
    raf = 0
    if (stopped) return
    let fadeWait = false
    root.querySelectorAll<HTMLElement>('.intern-bar').forEach((bar) => {
      if (litBars.has(bar) || bar.dataset.barArmed === '1') return
      if (prefersReduced()) {
        litBars.add(bar)
        bar.classList.add('is-in')
        return
      }
      const track = bar.parentElement
      const zone = track instanceof HTMLElement && track.clientHeight > 24 ? track : bar
      if (!inReadingZone(zone)) {
        delete bar.dataset.barWait
        return
      }
      if (!frameIsVisible(bar)) {
        const since = Number(bar.dataset.barWait || 0) || performance.now()
        bar.dataset.barWait = String(since)
        if (performance.now() - since < 1100) fadeWait = true
        else bar.dataset.barArmed = '1'
        if (bar.dataset.barArmed !== '1') return
      }
      bar.dataset.barArmed = '1'
      const row = bar.parentElement?.parentElement?.parentElement
      const peers = row ? [...row.querySelectorAll<HTMLElement>('.intern-bar')] : [bar]
      const index = Math.max(0, peers.indexOf(bar))
      const timer = window.setTimeout(() => {
        timers.delete(timer)
        if (stopped) return
        litBars.add(bar)
        bar.classList.add('is-in')
      }, 90 + Math.min(index, 4) * 200)
      timers.add(timer)
    })
    if (fadeWait) raf = requestAnimationFrame(check)
  }

  const kick = () => {
    if (stopped || raf) return
    raf = requestAnimationFrame(check)
  }
  const onScroll = () => kick()
  host.addEventListener('scroll', onScroll, { passive: true })
  kick()

  return {
    kick,
    stop() {
      stopped = true
      host.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
    },
  }
}

function createSession(root: HTMLElement): Session {
  const scroller = root.closest('[data-internship-sheet]')
  const observer = new IntersectionObserver(
    (entries) => {
      const hit: HTMLElement[] = []
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        const element = hosts.get(entry.target)
        if (element) hit.push(element)
      })
      hit.sort(byDocumentOrder)
      hit.forEach((element, index) => revealElement(element, index, false))
    },
    {
      root: scroller instanceof HTMLElement ? scroller : null,
      threshold: 0.2,
      rootMargin: '0px 0px -6% 0px',
    },
  )
  const mutations = new MutationObserver((records) => {
    const structural = records.some((record) => {
      if (record.type !== 'childList') return false
      const node = record.target instanceof Element ? record.target : record.target.parentElement
      return !node?.closest('[data-count]')
    })
    if (!structural) return
    scan(root, observer)
  })
  mutations.observe(root, { childList: true, subtree: true })
  const play = createPlay(root)
  return { observer, mutations, play }
}

export function useInternshipMotion(rootRef: RefObject<HTMLElement | null>) {
  const sessionRef = useRef<Session | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const session = createSession(root)
    sessionRef.current = session
    restore(root)
    scan(root, session.observer)
    session.play.kick()
    return () => {
      session.observer.disconnect()
      session.mutations.disconnect()
      session.play.stop()
      if (sessionRef.current === session) sessionRef.current = null
    }
  }, [rootRef])

  useLayoutEffect(() => {
    const root = rootRef.current
    const session = sessionRef.current
    if (!root || !session) return
    restore(root)
    scan(root, session.observer)
    session.play.kick()
  })
}
