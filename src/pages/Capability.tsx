import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import SiteHeader from '@/src/components/SiteHeader'
import { projectPieces } from '@/src/content'
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

function projectImage(pieceId: string | null, fallback: string) {
  return projectPieces.find((piece) => piece.id === pieceId)?.image ?? fallback
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
      const beats = gsap.utils.toArray<HTMLElement>('[data-beat]', root)
      const bags = beats.map((beat) => beat.querySelector<HTMLElement>('.cap-bag'))
      const giants = beats.map((beat) => beat.querySelector<HTMLElement>('.cap-giant'))
      const copies = beats.map((beat) => beat.querySelectorAll<HTMLElement>('.cap-copy'))
      const buttons = beats.map((beat) => beat.querySelector<HTMLElement>('.cap-view'))
      const story = root.querySelector<HTMLElement>('[data-story]')
      const progress = root.querySelector<HTMLElement>('[data-progress]')
      const title = root.querySelector('.cap-open-title')

      if (title) {
        const split = SplitText.create(title, { type: 'chars' })
        gsap.from(split.chars, { yPercent: 120, autoAlpha: 0, stagger: 0.035, duration: 0.7, ease: 'back.out(1.7)' })
      }

      gsap.to('.cap-open-hero-slot', { y: -16, duration: 2.7, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.utils.toArray<HTMLElement>('.cap-floater', root).forEach((floater, index) => {
        gsap.to(floater, {
          x: index % 2 === 0 ? 22 : -18,
          y: index % 2 === 0 ? -18 : 16,
          rotation: index % 2 === 0 ? 12 : -10,
          duration: 2.4 + index * 0.45,
          delay: index * 0.15,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      })

      const world = root.querySelector('.cap-open-world')
      const xTo = world ? gsap.quickTo(world, 'x', { duration: 0.7, ease: 'power3' }) : null
      const yTo = world ? gsap.quickTo(world, 'y', { duration: 0.7, ease: 'power3' }) : null
      const onMove = (event: PointerEvent) => {
        const open = root.querySelector('.cap-open')
        if (!open || !xTo || !yTo) return
        const rect = open.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) return
        xTo(((event.clientX - rect.left) / rect.width - 0.5) * 22)
        yTo(((event.clientY - rect.top) / rect.height - 0.5) * 14)
      }
      window.addEventListener('pointermove', onMove)

      gsap.to('.cap-open-hero', {
        scale: 1.06,
        ease: 'none',
        scrollTrigger: { trigger: '.cap-open', start: 'top top', end: 'bottom top', scrub: true },
      })

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
          end: () => `+=${Math.round(window.innerHeight * (item.projects.length * 1.85 + 0.8))}`,
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
      gsap.set(beats, { autoAlpha: 0 })
      if (beats[0]) gsap.set(beats[0], { autoAlpha: 1 })
      bags.forEach((bag) => bag && gsap.set(bag, { autoAlpha: 0 }))
      giants.forEach((giant) => giant && gsap.set(giant, { autoAlpha: 0 }))
      copies.forEach((nodes) => gsap.set(nodes, { autoAlpha: 0 }))
      buttons.forEach((button) => button && gsap.set(button, { autoAlpha: 0 }))
      gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })

      item.projects.forEach((_, index) => {
        const beat = beats[index]
        const bag = bags[index]
        const giant = giants[index]
        const copy = copies[index]
        const button = buttons[index]
        const last = index === item.projects.length - 1
        if (!beat || !bag || !giant) return
        const enter = `enter-${index}`
        timeline.addLabel(enter, index === 0 ? 0 : `leave-${index - 1}+=0.22`)

        if (index % 2 === 1) {
          timeline.fromTo(beat, { xPercent: 70, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, enter)
          timeline.fromTo(bag, { autoAlpha: 0, rotation: 8 }, { autoAlpha: 1, rotation: 0, duration: 0.4 }, enter)
          if (story) timeline.to(story, { backgroundColor: shade(item.ink, 26), duration: 0.4 }, enter)
        } else {
          timeline.set(beat, { autoAlpha: 1 }, enter)
          timeline.fromTo(bag, { yPercent: -120, autoAlpha: 0, rotation: -8 }, { yPercent: 0, autoAlpha: 1, rotation: 0, duration: 0.62, ease: 'power3.out' }, enter)
          if (story && index > 0) timeline.to(story, { backgroundColor: item.ink, duration: 0.4 }, enter)
        }
        timeline.fromTo(giant, { autoAlpha: 0, yPercent: 14 }, { autoAlpha: 1, yPercent: 0, duration: 0.36 }, `${enter}+=0.1`)
        timeline.fromTo(copy, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.04 }, `${enter}+=0.24`)
        if (button) timeline.fromTo(button, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: 'back.out(1.6)' }, `${enter}+=0.28`)
        timeline.addLabel(`hold-${index}`, `${enter}+=0.5`)
        timeline.to(bag, { rotation: index % 2 === 0 ? 8 : -7, yPercent: 6, duration: 0.26, ease: 'power1.inOut' }, `hold-${index}+=0.18`)
        timeline.to(bag, { rotation: 0, yPercent: 0, duration: 0.22, ease: 'power1.inOut' })

        if (!last) {
          const leave = `leave-${index}`
          timeline.addLabel(leave)
          if (index % 2 === 0) {
            timeline.to(bag, { yPercent: 120, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, leave)
            if (button) timeline.to(button, { autoAlpha: 0, duration: 0.16 }, leave)
            timeline.to(giant, { xPercent: -24, autoAlpha: 0, duration: 0.32 }, `${leave}+=0.2`)
            timeline.to(copy, { autoAlpha: 0, y: 12, duration: 0.2 }, `${leave}+=0.2`)
          } else {
            timeline.to(beat, { xPercent: -75, autoAlpha: 0, duration: 0.45, ease: 'power2.inOut' }, leave)
          }
          timeline.set(beat, { autoAlpha: 0 })
        } else {
          timeline.addLabel('spin')
          timeline.to(bag, { rotation: 16, duration: 0.45, ease: 'power1.inOut' }, 'spin')
          timeline.to(giant, { yPercent: -58, rotation: -6, duration: 0.45, ease: 'power2.in' }, 'spin')
          timeline.to(copy, { y: -20, autoAlpha: 0, duration: 0.28 }, 'spin+=0.08')
          if (button) timeline.to(button, { autoAlpha: 0, duration: 0.2 }, 'spin')
        }
      })

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
            {item.projects.slice(0, 3).map((project, index) => (
              <img
                key={`${project.name}-${project.figure}`}
                className="cap-floater"
                src={projectImage(project.pieceId, item.image)}
                alt=""
                style={{ left: ['12%', '74%', '20%'][index], top: ['56%', '40%', '28%'][index], zIndex: index === 1 ? 3 : 1 }}
              />
            ))}
            <div className="cap-open-hero-slot">
              <img className="cap-open-hero" src={item.image} alt="" style={{ objectPosition: item.focus }} />
            </div>
          </div>
          <p className="cap-open-cue">向下滚动</p>
        </section>

        <section className="cap-story" data-story aria-label="项目切换" style={{ background: item.ink, color: item.text }}>
          {item.projects.map((project, index) => (
            <article key={`${project.name}-${project.figure}`} className="cap-beat" data-beat>
              <h2 className="cap-giant" style={{ fontFamily: serif }}>
                {project.name}
              </h2>
              <div className="cap-bag-slot">
                <img className="cap-bag" src={projectImage(project.pieceId, item.image)} alt="" />
              </div>
              <div className="cap-view-slot">
                <ViewButton item={item} project={project} index={index} />
              </div>
              <div className="cap-caption">
                <p className="cap-kicker cap-copy">{project.name}</p>
                <p className="cap-line cap-copy">{project.text}</p>
                <p className="cap-num cap-copy">{project.figure}</p>
              </div>
            </article>
          ))}
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
          <img src={projectImage(project.pieceId, item.image)} alt="" />
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
