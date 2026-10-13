import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SiteHeader from '@/src/components/SiteHeader'
import { capabilities, capabilityById, rememberCapabilityReturn, takeCapabilityReturn } from '@/src/pages/capability.data'
import { insightClose, insightHero, insightOutcomes, insightScenes, insightThumbs, type InsightPieceId, type InsightScene } from '@/src/pages/insight.data'
import SkillsIntro from '@/src/pages/SkillsIntro'

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, CustomEase, Flip)
CustomEase.create('insightGlide', 'M0,0 C0.22,0.06 0.18,1 1,1')

const serif = '"Noto Serif SC", "Songti SC", serif'
const insight = capabilityById('insight')!

let jumpCache: { item: number; scroll: number } | null = null

function readJump() {
  if (jumpCache) return jumpCache
  const returned = takeCapabilityReturn('insight')
  const raw = new URLSearchParams(window.location.search).get('item')
  const queryIndex = raw === null ? Number.NaN : Number(raw)
  const item = returned ? returned.item : Number.isInteger(queryIndex) ? queryIndex : -1
  const scroll = returned?.scroll ?? -1
  if (item >= 0 || scroll > 0) {
    jumpCache = { item, scroll }
    window.setTimeout(() => {
      jumpCache = null
    }, 1200)
  }
  return { item, scroll }
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

function Frame({ children }: { children: ReactNode }) {
  useLayoutEffect(() => watchHeader(), [])
  return (
    <main
      className="cap-page insight-page min-h-screen"
      style={{ background: insight.paper, color: insight.ink, ['--cap-ink' as string]: insight.ink, ['--cap-paper' as string]: insight.paper, ['--cap-text' as string]: insight.text } as CSSProperties}
    >
      <SiteHeader slim />
      <SkillsIntro src={insight.image} />
      {children}
    </main>
  )
}

function Figure({ scene }: { scene: InsightScene }) {
  return (
    <p className="insight-figure">
      <span className="insight-kind">{scene.kind}</span>
      <strong style={{ fontFamily: serif }}>{scene.figure}</strong>
      {scene.unit ? <em>{scene.unit}</em> : null}
    </p>
  )
}

function DataVisual({ scene }: { scene: InsightScene }) {
  if (scene.pieceId === 'beverage') {
    return (
      <figure className="insight-panel" data-meter data-step="panel">
        <Figure scene={scene} />
        <div className="insight-track" aria-hidden="true">
          <span className="insight-fill" data-fill />
        </div>
        <figcaption>{scene.caption}</figcaption>
        <p>{scene.limit}</p>
      </figure>
    )
  }
  if (scene.pieceId === 'sofa') {
    return (
      <figure className="insight-panel insight-reach" data-reach data-step="panel">
        <div className="insight-thumbs" aria-hidden="true">
          {insightThumbs.map((src) => (
            <img key={src} src={src} alt="" data-thumb />
          ))}
        </div>
        <Figure scene={scene} />
        <p>{scene.limit}</p>
      </figure>
    )
  }
  return (
    <figure className="insight-panel" data-path data-step="panel">
      <Figure scene={scene} />
      <div className="insight-flow">
        <div className="insight-flow-row">
          <span>充不进电</span>
          <svg className="insight-stem" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="1" x2="100" y2="1" data-draw />
          </svg>
          <span>事实更正</span>
        </div>
        <ul>
          {insightOutcomes.map((outcome) => (
            <li key={outcome} data-branch>
              {outcome}
            </li>
          ))}
        </ul>
      </div>
      <figcaption>{scene.caption}</figcaption>
    </figure>
  )
}

function SceneBlock({ scene, index, onOpen }: { scene: InsightScene; index: number; onOpen: () => void }) {
  return (
    <article
      id={`insight-scene-${index}`}
      className="insight-scene insight-sheet"
      data-insight="scene"
      data-sheet={scene.pieceId}
      data-scene={scene.pieceId}
      style={{ zIndex: index + 2 }}
    >
      <div className="insight-dim" data-dim aria-hidden="true" />
      <div className="insight-stage insight-sheet-body" data-stage data-sheet-body>
        <div className="insight-scene-main">
          <div className="insight-scene-copy">
            <p className="insight-index" data-step="index">
              {scene.index}｜{scene.name}
            </p>
            <h2 data-step="title" style={{ fontFamily: serif }}>{scene.title}</h2>
            <p data-step="body">{scene.body}</p>
            <h3 data-step="judge-label">我的判断</h3>
            <p data-step="judge">{scene.judgment}</p>
            <h3 data-step="turn-label">这一判断带来的转向</h3>
            <p data-step="turn">{scene.turn}</p>
          </div>
          <div className="insight-scene-side">
            <DataVisual scene={scene} />
          </div>
        </div>
        <button type="button" className="insight-project" data-step="project" onClick={onOpen}>
          <span className="insight-project-frame" data-frame>
            <img src={scene.photo} alt="" data-photo style={{ objectPosition: scene.photoFocus }} />
          </span>
          <span className="insight-project-copy">
            <span className="insight-jump">
              {scene.action}
              <i aria-hidden="true">→</i>
            </span>
            <span className="insight-aside">{scene.aside}</span>
          </span>
        </button>
      </div>
    </article>
  )
}

export default function InsightPage({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const locationRef = useRef(location)
  const others = capabilities.filter((entry) => entry.id !== 'insight')

  const open = (pieceId: InsightPieceId, index: number) => {
    rememberCapabilityReturn('insight', index, window.scrollY)
    const go = () => navigate(`/projects?work=${pieceId}`)
    if ('startViewTransition' in document) document.startViewTransition(go)
    else go()
  }

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const jump = readJump()
      const state = locationRef.current.state as { restoreScroll?: number } | null
      const restore = () => {
        const story = ScrollTrigger.getById('insight-story')
        if (jump.scroll > 0) window.scrollTo(0, jump.scroll)
        else if (jump.item >= 0 && story?.animation) {
          const scene = document.getElementById(`insight-scene-${Math.min(jump.item, insightScenes.length - 1)}`)
          const time = Number(scene?.getAttribute('data-arrival') ?? 0)
          const duration = story.animation.duration() || 1
          const progress = Math.min(Math.max(time / duration, 0), 1)
          window.scrollTo(0, story.start + (story.end - story.start) * progress)
        } else if (jump.item >= 0) document.getElementById(`insight-scene-${Math.min(jump.item, insightScenes.length - 1)}`)?.scrollIntoView()
        else if (typeof state?.restoreScroll === 'number') window.scrollTo(0, state.restoreScroll)
        if (new URLSearchParams(window.location.search).has('item')) window.history.replaceState(null, '', '/skills/insight')
      }
      if (reduced) {
        restore()
        return
      }

      let alive = true
      const headerHeight = () => document.querySelector('.site-chrome')?.getBoundingClientRect().height ?? 56
      const liftPhotos = () => {
        if (!window.matchMedia('(min-width: 900px)').matches) return
        root.querySelectorAll<HTMLElement>('[data-frame]').forEach((frame) => {
          const copy = frame.closest('[data-insight="scene"]')?.querySelector('.insight-scene-copy')
          if (!(copy instanceof HTMLElement)) return
          frame.style.marginTop = '0px'
          frame.style.height = '100%'
          const gap = frame.getBoundingClientRect().top - copy.getBoundingClientRect().bottom
          const lift = Math.max(0, Math.min(gap - 40, 64))
          frame.style.marginTop = lift > 0 ? `-${Math.round(lift)}px` : '0px'
          frame.style.height = lift > 0 ? `calc(100% + ${Math.round(lift)}px)` : '100%'
        })
      }
      window.addEventListener('resize', liftPhotos)
      const setup = () => {
        if (!alive || !rootRef.current) return
        const desktop = window.matchMedia('(min-width: 900px)').matches
        const scenes = [...root.querySelectorAll<HTMLElement>('[data-insight="scene"]')]
        const deck = root.querySelector<HTMLElement>('[data-deck]')

        const placeBlock = (tl: gsap.core.Timeline, el: Element | null, at: number, slot: number) => {
          if (!el) return at + slot
          tl.from(el, { y: 18, autoAlpha: 0, duration: slot, ease: 'insightGlide', immediateRender: true }, at)
          return at + slot
        }

        if (desktop && deck) {
          const EXCHANGE = 0.86
          const HOLD = 0.28
          const tl = gsap.timeline({ paused: true })
          const sheets = [...deck.querySelectorAll<HTMLElement>('[data-sheet]')]
          gsap.set(sheets.slice(1), { yPercent: 100 })

          tl.to('.insight-cue', { autoAlpha: 0, duration: 0.46, ease: 'none' }, 0)
          tl.fromTo('.insight-person', { y: 0 }, { y: -26, duration: 0.46, ease: 'none' }, 0)

          let cursor = 0.46
          let outgoing = sheets[0]
          scenes.forEach((scene) => {
            const at = cursor
            tl.addLabel(`exchange-${scene.dataset.scene}`, at)
            tl.set(scene, { yPercent: 100 }, 0)
            tl.fromTo(scene, { yPercent: 100 }, { yPercent: 0, duration: EXCHANGE, ease: 'none', immediateRender: false }, at)
            const body = outgoing?.querySelector('[data-sheet-body]')
            const dim = outgoing?.querySelector('[data-dim]')
            if (body) tl.to(body, { scale: 0.94, y: -32, duration: EXCHANGE, ease: 'none', transformOrigin: 'center top' }, at)
            if (dim) tl.to(dim, { autoAlpha: 1, duration: EXCHANGE, ease: 'none' }, at)
            placeBlock(tl, scene.querySelector('[data-step="index"]'), at + EXCHANGE * 0.22, 0.28)
            placeBlock(tl, scene.querySelector('[data-step="title"]'), at + EXCHANGE * 0.5, 0.4)
            let step = at + EXCHANGE + 0.06
            tl.addLabel(`read-${scene.dataset.scene}`, step)
            step = placeBlock(tl, scene.querySelector('[data-step="body"]'), step, 0.42)
            const panel = scene.querySelector('[data-step="panel"]')
            if (panel) tl.from(panel, { autoAlpha: 0, y: 24, duration: 0.36, ease: 'insightGlide', immediateRender: true }, step)
            const fill = scene.querySelector('[data-fill]')
            if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'insightGlide', immediateRender: true }, step + 0.06)
            const thumbs = scene.querySelectorAll<HTMLElement>('[data-thumb]')
            if (thumbs.length) {
              gsap.set(thumbs, {
                x: (thumbIndex) => (1.5 - Number(thumbIndex)) * 34,
                scale: 0.46,
                y: 18,
                transformOrigin: 'center bottom',
              })
              const compressed = Flip.getState(thumbs)
              gsap.set(thumbs, { x: 0, y: 0, scale: 1 })
              tl.add(Flip.from(compressed, {
                duration: 0.48,
                ease: 'insightGlide',
                absolute: false,
                simple: true,
                stagger: 0.035,
                immediateRender: true,
              }), step + 0.04)
            }
            const draws = scene.querySelectorAll('[data-draw]')
            if (draws.length) tl.from(draws, { drawSVG: 0, duration: 0.36, ease: 'insightGlide', immediateRender: true }, step + 0.06)
            const branches = scene.querySelectorAll('[data-branch]')
            if (branches.length) tl.from(branches, { autoAlpha: 0, x: -12, stagger: 0.04, duration: 0.28, ease: 'insightGlide', immediateRender: true }, step + 0.12)
            step += 0.46
            const judgeAt = step
            placeBlock(tl, scene.querySelector('[data-step="judge-label"]'), judgeAt, 0.36)
            placeBlock(tl, scene.querySelector('[data-step="judge"]'), judgeAt + 0.08, 0.4)
            step = judgeAt + 0.46
            const turnAt = step
            placeBlock(tl, scene.querySelector('[data-step="turn-label"]'), turnAt, 0.34)
            placeBlock(tl, scene.querySelector('[data-step="turn"]'), turnAt + 0.08, 0.38)
            step = turnAt + 0.44
            const project = scene.querySelector('[data-step="project"]')
            const frame = scene.querySelector('[data-frame]')
            if (project) tl.from(project, { autoAlpha: 0, y: 16, duration: 0.36, ease: 'insightGlide', immediateRender: true }, step)
            if (frame) tl.from(frame, { clipPath: 'inset(38% 5% 38% 5%)', duration: 0.46, ease: 'insightGlide', immediateRender: true }, step)
            step += 0.36
            scene.setAttribute('data-arrival', String(step))
            tl.addLabel(`hold-${scene.dataset.scene}`, step)
            step += HOLD
            tl.set({}, {}, step)
            cursor = step
            outgoing = scene
          })

          const close = deck.querySelector<HTMLElement>('[data-sheet="close"]')
          if (close) {
            const at = cursor
            tl.addLabel('exchange-close', at)
            tl.set(close, { yPercent: 100 }, 0)
            tl.fromTo(close, { yPercent: 100 }, { yPercent: 0, duration: EXCHANGE, ease: 'none', immediateRender: false }, at)
            const body = outgoing?.querySelector('[data-sheet-body]')
            const dim = outgoing?.querySelector('[data-dim]')
            if (body) tl.to(body, { scale: 0.94, y: -32, duration: EXCHANGE, ease: 'none', transformOrigin: 'center top' }, at)
            if (dim) tl.to(dim, { autoAlpha: 1, duration: EXCHANGE, ease: 'none' }, at)
            const paragraphs = [...deck.querySelectorAll('.insight-close h2, .insight-close p')]
            if (paragraphs[0]) placeBlock(tl, paragraphs[0], at + EXCHANGE * 0.42, 0.42)
            let step = at + EXCHANGE + 0.08
            tl.addLabel('read-close', step)
            paragraphs.slice(1).forEach((el) => {
              step = placeBlock(tl, el, step, 0.38)
            })
            step += 0.22
            tl.set({}, {}, step)
          }

          deck.dataset.ready = '1'
          deck.dataset.duration = String(tl.duration())

          ScrollTrigger.create({
            id: 'insight-story',
            animation: tl,
            trigger: deck,
            start: 'top top',
            end: () => `+=${Math.round(window.innerHeight * tl.duration())}`,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          })
          liftPhotos()
        } else {
          gsap.from('.insight-open-copy > *', { y: 28, autoAlpha: 0, stagger: 0.16, duration: 0.7, ease: 'power2.out' })
          scenes.forEach((scene) => {
            gsap.from(scene, {
              y: 72,
              ease: 'none',
              scrollTrigger: { trigger: scene, start: 'top bottom', end: 'top 58%', scrub: true },
            })
            scene.querySelectorAll('[data-step]').forEach((el) => {
              gsap.from(el, {
                y: 36,
                autoAlpha: 0,
                immediateRender: true,
                ease: 'insightGlide',
                scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 70%', scrub: true },
              })
            })
          })
          gsap.from('.insight-close h2, .insight-close p', {
            y: 32,
            autoAlpha: 0,
            stagger: 0.2,
            ease: 'insightGlide',
            immediateRender: true,
            scrollTrigger: { trigger: '.insight-close', start: 'top 92%', end: 'top 28%', scrub: true },
          })
        }

        const cards = gsap.utils.toArray<HTMLElement>('[data-card]', root)
        gsap.set(cards, {
          y: (index) => Number(index) * 18,
          rotation: (index) => (Number(index) - (cards.length - 1) / 2) * 3.2,
          zIndex: (index) => cards.length - Number(index),
        })
        const stack = gsap.timeline({
          scrollTrigger: {
            trigger: '[data-stack]',
            start: () => `top top+=${headerHeight()}`,
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

        ScrollTrigger.refresh()
        liftPhotos()
        restore()
        ScrollTrigger.update()
      }

      const ctx = gsap.context(() => {}, root)
      const boot = () => {
        if (alive) ctx.add(setup)
      }
      if (document.fonts?.status === 'loaded') boot()
      else void document.fonts?.ready.then(boot)
      return () => {
        alive = false
        window.removeEventListener('resize', liftPhotos)
        ctx.revert()
      }
    },
    { scope: rootRef, dependencies: [reduced] },
  )

  return (
    <Frame>
      <div ref={rootRef}>
        <div className="insight-deck" data-deck>
          <section className="insight-open insight-sheet" data-insight="entrance" data-sheet="hero" aria-label={insightHero.title} style={{ zIndex: 1 }}>
            <div className="insight-dim" data-dim aria-hidden="true" />
            <div className="insight-open-stage insight-sheet-body" data-stage data-sheet-body>
              <div className="insight-open-copy">
                <h1 style={{ fontFamily: serif }}>{insightHero.title}</h1>
                <p className="insight-lead">{insightHero.lead}</p>
                <p>{insightHero.body}</p>
              </div>
              <img className="insight-person" src={insight.image} alt="" />
              <p className="insight-cue">向下滚动</p>
            </div>
          </section>

          {insightScenes.map((scene, index) => (
            <SceneBlock key={scene.pieceId} scene={scene} index={index} onOpen={() => open(scene.pieceId, index)} />
          ))}

          <section className="insight-close insight-sheet" data-insight="close" data-sheet="close" style={{ zIndex: 6 }}>
            <div className="insight-dim" data-dim aria-hidden="true" />
            <div className="insight-sheet-body" data-sheet-body>
              <h2 style={{ fontFamily: serif }}>{insightClose.title}</h2>
              <p>{insightClose.body}</p>
              <p>{insightClose.next}</p>
            </div>
          </section>
        </div>

        {reduced ? (
          <section className="insight-others" data-insight="others" aria-label="其他能力">
            <h2 style={{ fontFamily: serif }}>其他能力</h2>
            <div className="insight-others-list">
              {others.map((entry) => (
                <Link key={entry.id} to={`/skills/${entry.id}`}>
                  <img src={entry.image} alt="" style={{ objectPosition: entry.focus }} />
                  <span>{entry.label}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="cap-stack" data-insight="others" data-stack aria-label="其他能力">
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
        )}
      </div>
    </Frame>
  )
}
