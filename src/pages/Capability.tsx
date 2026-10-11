import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import SiteHeader from '@/src/components/SiteHeader'
import {
  capabilities,
  capabilityById,
  rememberCapabilityReturn,
  takeCapabilityReturn,
  type Capability as CapabilityItem,
  type CapabilityProject,
} from '@/src/pages/capability.data'
import SkillsIntro from '@/src/pages/SkillsIntro'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText)

const serif = '"Noto Serif SC", "Songti SC", serif'

let jumpCache: { id: string; item: number } | null = null

function readJump(id: string) {
  if (jumpCache?.id === id) return jumpCache.item
  const returned = takeCapabilityReturn(id)
  const raw = new URLSearchParams(window.location.search).get('item')
  const queryIndex = raw === null ? Number.NaN : Number(raw)
  const itemIndex = returned ? returned.item : Number.isInteger(queryIndex) ? queryIndex : -1
  if (itemIndex >= 0) {
    jumpCache = { id, item: itemIndex }
    window.setTimeout(() => {
      if (jumpCache?.id === id && jumpCache.item === itemIndex) jumpCache = null
    }, 1200)
  }
  return itemIndex
}

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [query])
  return matches
}

function headerHeight() {
  return document.querySelector('.site-chrome')?.getBoundingClientRect().height ?? 96
}

function watchHeader() {
  const header = document.querySelector('.site-chrome')
  if (!header) return () => {}
  const apply = () => {
    document.documentElement.style.setProperty('--cap-header', `${header.getBoundingClientRect().height}px`)
  }
  apply()
  const observer = new ResizeObserver(apply)
  observer.observe(header)
  window.addEventListener('resize', apply)
  return () => {
    observer.disconnect()
    window.removeEventListener('resize', apply)
  }
}

function shade(hex: string, amount: number) {
  const value = Number.parseInt(hex.replace('#', ''), 16)
  const channel = (shift: number) => Math.max(0, Math.min(255, ((value >> shift) & 255) + amount))
  return `#${[channel(16), channel(8), channel(0)].map((part) => part.toString(16).padStart(2, '0')).join('')}`
}

export default function Capability() {
  const { id } = useParams()
  const item = capabilityById(id)
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  if (!item) return <Navigate to="/skills" replace />
  return reduced ? <CapabilityStill item={item} /> : <CapabilityMotion item={item} />
}

function Frame({ item, children }: { item: CapabilityItem; children: ReactNode }) {
  useLayoutEffect(() => watchHeader(), [])
  return (
    <main
      className="cap-page min-h-screen"
      style={{ background: item.paper, color: item.ink, ['--cap-ink' as string]: item.ink, ['--cap-paper' as string]: item.paper, ['--cap-text' as string]: item.text } as CSSProperties}
    >
      <SiteHeader />
      <SkillsIntro src={item.image} />
      {children}
    </main>
  )
}

function ViewButton({ item, project, index }: { item: CapabilityItem; project: CapabilityProject; index: number }) {
  const navigate = useNavigate()
  if (!project.pieceId) return null
  return (
    <button
      type="button"
      className="cap-view"
      onClick={() => {
        rememberCapabilityReturn(item.id, index, window.scrollY)
        const go = () => navigate(`/projects?work=${project.pieceId}`)
        if ('startViewTransition' in document) document.startViewTransition(go)
        else go()
      }}
    >
      查看项目
    </button>
  )
}

function CapabilityMotion({ item }: { item: CapabilityItem }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const storyTween = useRef<gsap.core.Timeline | null>(null)
  const location = useLocation()
  const locationRef = useRef(location)
  const others = capabilities.filter((entry) => entry.id !== item.id)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const top = headerHeight()
      document.documentElement.style.setProperty('--cap-header', `${top}px`)
      const bag = root.querySelector<HTMLElement>('[data-story] .cap-bag')
      const giant = root.querySelector<HTMLElement>('[data-story] .cap-giant')
      const captions = gsap.utils.toArray<HTMLElement>('[data-caption]', root)
      const story = root.querySelector<HTMLElement>('[data-story]')
      const progress = root.querySelector<HTMLElement>('[data-progress]')
      const title = root.querySelector('.cap-open-title')

      if (title) {
        const split = SplitText.create(title, { type: 'chars' })
        gsap.from(split.chars, { yPercent: 120, autoAlpha: 0, stagger: 0.035, duration: 0.7, ease: 'back.out(1.7)' })
      }

      const heroSlot = root.querySelector('.cap-open-hero-slot')
      gsap.to('.cap-open-hero', { y: -14, duration: 2.7, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      const xTo = heroSlot ? gsap.quickTo(heroSlot, 'x', { duration: 0.7, ease: 'power3' }) : null
      const onMove = (event: PointerEvent) => {
        const open = root.querySelector('.cap-open')
        if (!open || !xTo) return
        const rect = open.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) return
        xTo(((event.clientX - rect.left) / rect.width - 0.5) * 18)
      }
      window.addEventListener('pointermove', onMove)

      const mark = (current: number) => {
        root.querySelectorAll<HTMLButtonElement>('[data-chip]').forEach((chip, index) => {
          const on = index === current
          chip.classList.toggle('is-on', on)
          chip.setAttribute('aria-selected', on ? 'true' : 'false')
        })
      }

      let shown = 0
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: story,
          start: () => `top top+=${headerHeight()}px`,
          end: () => `+=${Math.round(window.innerHeight * (0.85 + item.projects.length * 0.8))}`,
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const tween = self.animation as gsap.core.Timeline | undefined
            if (!tween) return
            const time = tween.duration() * self.progress
            let next = 0
            item.projects.forEach((_, index) => {
              const label = tween.labels[`hold-${index}`]
              if (typeof label === 'number' && time >= label - 0.02) next = index
            })
            if (next !== shown) {
              shown = next
              mark(next)
            }
            if (progress) gsap.set(progress, { scaleX: self.progress, transformOrigin: 'left center' })
          },
        },
      })
      storyTween.current = timeline
      gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })
      if (bag && giant) {
        gsap.set(captions, { autoAlpha: 0, y: 16, x: 0 })
        gsap.set(giant, { autoAlpha: 1, y: 0 })
        timeline.fromTo(bag, { yPercent: -72, autoAlpha: 0, rotation: -7 }, { yPercent: 0, autoAlpha: 1, rotation: 0, duration: 0.58, ease: 'power3.out' }, 0)
        if (captions[0]) timeline.fromTo(captions[0], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.36)
        timeline.addLabel('hold-0', 0.72)
        timeline.to({}, { duration: 0.48 })

        item.projects.forEach((_, index) => {
          if (index === 0) return
          const leave = `leave-${index - 1}`
          const side = index % 2 === 1 ? -8 : 8
          timeline.addLabel(leave)
          if (captions[index - 1]) timeline.to(captions[index - 1], { autoAlpha: 0, x: -32, y: -6, duration: 0.18 }, leave)
          timeline.to(bag, { xPercent: side, rotation: side * 0.35, duration: 0.22, ease: 'power1.inOut' }, leave)
          timeline.to(bag, { xPercent: 0, rotation: 0, duration: 0.3, ease: 'power2.out' })
          if (story) timeline.to(story, { backgroundColor: index % 2 === 1 ? shade(item.ink, 36) : item.ink, duration: 0.32 }, '<')
          if (captions[index]) timeline.fromTo(captions[index], { autoAlpha: 0, x: 40, y: 10 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.28 }, '<')
          timeline.addLabel(`hold-${index}`)
          timeline.to({}, { duration: 0.5 })
        })
      }

      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', root)
      gsap.set(panels, { autoAlpha: 0, y: 24 })
      if (panels[0]) gsap.set(panels[0], { autoAlpha: 1, y: 0 })
      const split = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: '[data-split]',
          start: () => `top top+=${headerHeight()}px`,
          end: () => `+=${Math.max(panels.length, 1) * window.innerHeight * 0.7}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      split.to({}, { duration: 0.3 })
      panels.forEach((panel, index) => {
        if (index === 0) return
        split.to(panels[index - 1], { autoAlpha: 0, y: -16, duration: 0.22 })
        split.fromTo(panel, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.28 })
        split.to({}, { duration: 0.35 })
      })

      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', root)
      gsap.set(cards, {
        y: (index) => Number(index) * 18,
        rotation: (index) => (Number(index) - (cards.length - 1) / 2) * 3.2,
        zIndex: (index) => cards.length - Number(index),
      })
      const stack = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-stack]',
          start: () => `top top+=${headerHeight()}px`,
          end: () => `+=${Math.max(cards.length - 1, 1) * window.innerHeight * 0.55}`,
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      cards.forEach((card, index) => {
        if (index === cards.length - 1) return
        stack.to(card, { yPercent: -125, rotation: -7, duration: 0.45, ease: 'power2.inOut' })
      })

      const params = new URLSearchParams(window.location.search)
      const state = locationRef.current.state as { restoreScroll?: number } | null
      let restoreIndex = readJump(item.id)
      if (restoreIndex >= item.projects.length) restoreIndex = item.projects.length - 1
      ScrollTrigger.refresh()
      if (restoreIndex >= 0 && timeline.scrollTrigger) {
        window.scrollTo(0, timeline.scrollTrigger.labelToScroll(`hold-${restoreIndex}`))
      } else if (typeof state?.restoreScroll === 'number') {
        window.scrollTo(0, state.restoreScroll)
      }
      if (params.has('item')) window.history.replaceState(null, '', `/skills/${item.id}`)

      return () => window.removeEventListener('pointermove', onMove)
    },
    { scope: rootRef, dependencies: [item.id] },
  )

  const pick = (index: number) => {
    const trigger = storyTween.current?.scrollTrigger
    if (!trigger) return
    gsap.to(window, { scrollTo: trigger.labelToScroll(`hold-${index}`), duration: 0.8, ease: 'power2.inOut', overwrite: 'auto' })
  }

  return (
    <Frame item={item}>
      <div ref={rootRef}>
        <section className="cap-open" aria-label={item.label}>
          <div className="cap-open-copy">
            <h1 className="cap-open-title" style={{ fontFamily: serif }}>
              {item.label}
            </h1>
            <p className="cap-open-intro">{item.intro}</p>
          </div>
          <div className="cap-open-world">
            <div className="cap-open-hero-slot">
              <img className="cap-open-hero" src={item.image} alt="" style={{ objectPosition: item.focus }} />
            </div>
          </div>
          <p className="cap-open-cue">向下滚动</p>
        </section>

        <section className="cap-story" data-story aria-label="项目切换" style={{ background: item.ink, color: item.text }}>
          <h2 className="cap-giant" style={{ fontFamily: serif }}>
            {item.label}
          </h2>
          <div className="cap-hero-row">
            <div className="cap-bag-slot">
              <img className="cap-bag" src={item.image} alt="" style={{ objectPosition: item.focus }} />
            </div>
          </div>
          <div className="cap-caption-stack">
            {item.projects.map((project, index) => (
              <div key={`${project.name}-${project.figure}`} className="cap-caption" data-caption>
                <p className="cap-kicker">{project.name}</p>
                <p className="cap-line">{project.text}</p>
                <div className="cap-meta">
                  <p className="cap-num">{project.figure}</p>
                  <ViewButton item={item} project={project} index={index} />
                </div>
              </div>
            ))}
          </div>
          <div className="cap-chips" role="tablist" aria-label="项目">
            {item.projects.map((project, index) => (
              <button key={`${project.name}-${project.figure}`} type="button" className={index === 0 ? 'cap-chip is-on' : 'cap-chip'} data-chip role="tab" aria-selected={index === 0} onClick={() => pick(index)}>
                {project.name}
              </button>
            ))}
          </div>
          <div className="cap-progress" data-progress />
        </section>

        <section className="cap-split" data-split>
          <div>
            <p className="text-xs tracking-[0.16em]">这一项能力</p>
            <h2 className="mt-3 text-4xl leading-tight md:text-6xl" style={{ fontFamily: serif }}>
              {item.label}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7">{item.intro}</p>
          </div>
          <img className="cap-split-photo" src={item.image} alt="" style={{ objectPosition: item.focus }} />
          <div className="cap-switch" aria-live="polite">
            {item.projects.map((project) => (
              <article key={`${project.name}-${project.figure}`} className="cap-switch-panel" data-panel>
                <p className="text-xs tracking-[0.16em]">项目证据</p>
                <h3 className="mt-3 text-2xl leading-snug" style={{ fontFamily: serif }}>
                  {project.name}
                </h3>
                <p className="mt-3 text-sm leading-7">{project.text}</p>
                <p className="mt-4 text-sm tracking-[0.14em]">{project.figure}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cap-stack" data-stack aria-label="其他能力">
          <h2 className="cap-stack-title" style={{ fontFamily: serif }}>
            其他能力
          </h2>
          <div className="cap-pile">
            {others.map((entry) => (
              <Link key={entry.id} to={`/skills/${entry.id}`} className="cap-card" data-card style={{ background: entry.ink, color: entry.text }}>
                <img src={entry.image} alt="" style={{ objectPosition: entry.focus }} />
                <span>
                  <strong style={{ fontFamily: serif }}>{entry.label}</strong>
                  <small>{entry.intro}</small>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="cap-more" aria-label="继续看其他能力">
          <h2 className="text-3xl" style={{ fontFamily: serif }}>
            继续看其他能力
          </h2>
          <div className="cap-more-grid">
            {others.map((entry) => (
              <Link key={entry.id} to={`/skills/${entry.id}`} className="cap-more-card">
                <img src={entry.image} alt="" style={{ objectPosition: entry.focus }} />
                <span>{entry.label}</span>
              </Link>
            ))}
          </div>
          <Link to="/skills" className="mt-8 inline-block text-sm underline">
            返回个人能力
          </Link>
        </section>
      </div>
    </Frame>
  )
}

function CapabilityStill({ item }: { item: CapabilityItem }) {
  const others = capabilities.filter((entry) => entry.id !== item.id)
  return (
    <Frame item={item}>
      <section className="cap-still-open" style={{ background: item.paper, color: item.ink }}>
        <h1 className="text-5xl" style={{ fontFamily: serif }}>
          {item.label}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7">{item.intro}</p>
        <img src={item.image} alt="" style={{ objectPosition: item.focus }} />
      </section>
      {item.projects.map((project, index) => (
        <article key={`${project.name}-${project.figure}`} className="cap-still-beat" style={{ background: item.ink, color: item.text }}>
          <div>
            <h2 className="text-3xl" style={{ fontFamily: serif }}>
              {project.name}
            </h2>
            <p className="mt-3 text-sm leading-7">{project.text}</p>
            <p className="mt-3 text-sm tracking-[0.12em]">{project.figure}</p>
            <ViewButton item={item} project={project} index={index} />
          </div>
        </article>
      ))}
      <section className="cap-more">
        <h2 className="text-3xl" style={{ fontFamily: serif }}>
          其他能力
        </h2>
        <div className="cap-more-grid">
          {others.map((entry) => (
            <Link key={entry.id} to={`/skills/${entry.id}`} className="cap-more-card">
              <img src={entry.image} alt="" style={{ objectPosition: entry.focus }} />
              <span>{entry.label}</span>
            </Link>
          ))}
        </div>
        <Link to="/skills" className="mt-8 inline-block text-sm underline">
          返回个人能力
        </Link>
      </section>
    </Frame>
  )
}
