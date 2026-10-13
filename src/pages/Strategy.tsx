import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SiteHeader from '@/src/components/SiteHeader'
import { capabilities, capabilityById, rememberCapabilityReturn, takeCapabilityReturn } from '@/src/pages/capability.data'
import {
  strategyClose,
  strategyCompare,
  strategyHero,
  strategyHolds,
  strategyLayers,
  strategyLoop,
  strategyScenes,
  type StrategyPieceId,
  type StrategyScene,
} from '@/src/pages/strategy.data'
import SkillsIntro from '@/src/pages/SkillsIntro'

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, CustomEase)
CustomEase.create('strategyGlide', 'M0,0 C0.22,0.06 0.18,1 1,1')

const serif = '"Noto Serif SC", "Songti SC", serif'
const strategy = capabilityById('strategy')!
const found = strategyCompare.full - strategyCompare.generic

let jumpCache: { item: number; scroll: number } | null = null

function readJump() {
  if (jumpCache) return jumpCache
  const returned = takeCapabilityReturn('strategy')
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
      className="cap-page insight-page strategy-page min-h-screen"
      style={
        {
          background: strategy.paper,
          color: '#4A2616',
          ['--cap-ink' as string]: strategy.ink,
          ['--cap-paper' as string]: strategy.paper,
          ['--cap-text' as string]: strategy.text,
        } as CSSProperties
      }
    >
      <SiteHeader slim />
      <SkillsIntro src={strategy.image} />
      {children}
    </main>
  )
}

function Kind({ scene }: { scene: StrategyScene }) {
  return <span className="insight-kind">{scene.kind}</span>
}

function LayersVisual({ scene }: { scene: StrategyScene }) {
  const p0 = Array.from({ length: strategyLayers.p0 }, (_, index) => index)
  const p1 = Array.from({ length: strategyLayers.p1 }, (_, index) => index)
  return (
    <figure className="insight-panel strategy-layers" data-layers data-step="panel" aria-label={`${scene.caption}。${strategyLayers.p0} 项 P0，${strategyLayers.p1} 项 P1。${scene.detail}`}>
      <div className="strategy-layer" data-beat="dots">
        <p className="insight-figure">
          <Kind scene={scene} />
        </p>
        <div className="strategy-bands" aria-hidden="true">
          <div className="strategy-band">
            <span className="strategy-band-name">P0</span>
            <span className="strategy-dots">
              {p0.map((index) => (
                <i key={`p0-${index}`} className="strategy-dot" data-mark />
              ))}
            </span>
            <b>{strategyLayers.p0}</b>
          </div>
          <div className="strategy-band is-p1">
            <span className="strategy-band-name">P1</span>
            <span className="strategy-dots">
              {p1.map((index) => (
                <i key={`p1-${index}`} className="strategy-dot" data-mark />
              ))}
            </span>
            <b>{strategyLayers.p1}</b>
          </div>
        </div>
        <figcaption>{scene.caption}</figcaption>
        <p>{scene.detail}</p>
      </div>
      <div className="strategy-layer" data-beat="holds">
        <p className="insight-figure">
          <Kind scene={scene} />
        </p>
        <p className="strategy-service">底妆搓泥，且已有失败尝试</p>
        <ul className="strategy-holds">
          {strategyHolds.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="strategy-later">
          <span>
            <b>{strategyLayers.p0}</b> 项 P0
          </span>
          <span>
            <b>{strategyLayers.p1}</b> 项 P1，可以稍后
          </span>
        </p>
        <figcaption>{scene.caption}</figcaption>
        <p>{scene.detail}</p>
      </div>
    </figure>
  )
}

function CompareVisual({ scene }: { scene: StrategyScene }) {
  const slots = Array.from({ length: found }, (_, index) => index)
  return (
    <figure
      className="insight-panel strategy-compare"
      data-compare
      data-step="panel"
      aria-label={`多找回 ${found} 人。${strategyCompare.scope}。${scene.caption}`}
    >
      <p className="insight-figure">
        <Kind scene={scene} />
        <strong style={{ fontFamily: serif }}>多找回 {found} 人</strong>
      </p>
      <div className="strategy-bars" aria-hidden="true">
        <div className="strategy-bar">
          <span className="strategy-bar-label">{strategyCompare.genericLabel}</span>
          <b>{strategyCompare.generic}</b>
          <span className="strategy-track">
            <i className="strategy-fill" data-compare-fill style={{ width: `${(strategyCompare.generic / strategyCompare.baseline) * 100}%` }} />
          </span>
        </div>
        <div className="strategy-bar is-full">
          <span className="strategy-bar-label">{strategyCompare.fullLabel}</span>
          <b>{strategyCompare.full}</b>
          <span className="strategy-track">
            <i className="strategy-fill" data-compare-fill style={{ width: `${(strategyCompare.generic / strategyCompare.baseline) * 100}%` }} />
            <i className="strategy-extra" data-extra style={{ left: `${(strategyCompare.generic / strategyCompare.baseline) * 100}%`, width: `${(found / strategyCompare.baseline) * 100}%` }} />
            <span className="strategy-delta" style={{ left: `${(strategyCompare.generic / strategyCompare.baseline) * 100}%`, width: `${(found / strategyCompare.baseline) * 100}%` }}>
              {slots.map((index) => (
                <i key={index} data-returned />
              ))}
            </span>
          </span>
        </div>
      </div>
      <p className="strategy-scope">{strategyCompare.scope}</p>
      <figcaption>{scene.caption}</figcaption>
    </figure>
  )
}

function LoopVisual({ scene }: { scene: StrategyScene }) {
  const width = 640
  const height = 132
  const row = 26
  const xs = strategyLoop.map((_, index) => ((index + 0.5) / strategyLoop.length) * width)
  const schedule = xs[strategyLoop.indexOf('排期')]
  const report = xs[strategyLoop.indexOf('日报')]
  return (
    <figure className="insight-panel strategy-loop" data-loop data-step="panel" aria-label={`${strategyLoop.length} 个核心协作动作。${scene.caption}`}>
      <p className="insight-figure">
        <Kind scene={scene} />
      </p>
      <div className="strategy-chain" aria-hidden="true">
        <p className="strategy-chain-core">
          <strong style={{ fontFamily: serif }}>{strategyLoop.length}</strong>
          <span>个核心协作动作</span>
        </p>
        <div className="strategy-chain-stage">
          <svg className="strategy-chain-svg" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <marker id="strategy-return-arrow" markerUnits="userSpaceOnUse" markerWidth="16" markerHeight="16" refX="12" refY="8" orient="auto">
                <path d="M1 1.5 L13 8 L1 14.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
              </marker>
            </defs>
            <path className="is-forward" data-draw d={`M ${xs[0]} ${row} H ${report}`} />
            <path className="is-return" data-return d={`M ${report} ${row + 18} C ${report} 112, ${schedule} 112, ${schedule} ${row + 20}`} markerEnd="url(#strategy-return-arrow)" />
          </svg>
          {strategyLoop.map((label, index) => (
            <span key={label} className={`strategy-node${label === '排期' ? ' is-back' : ''}`} style={{ left: `${(xs[index] / width) * 100}%`, top: `${(row / height) * 100}%` }}>
              <span data-node>{label}</span>
            </span>
          ))}
        </div>
      </div>
      <figcaption>{scene.caption}</figcaption>
    </figure>
  )
}

function DataVisual({ scene }: { scene: StrategyScene }) {
  if (scene.visual === 'layers') return <LayersVisual scene={scene} />
  if (scene.visual === 'compare') return <CompareVisual scene={scene} />
  return <LoopVisual scene={scene} />
}

function SceneBlock({ scene, index, onOpen }: { scene: StrategyScene; index: number; onOpen: () => void }) {
  return (
    <article
      id={`strategy-scene-${index}`}
      className="insight-scene insight-sheet"
      data-strategy="scene"
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
            <h2 data-step="title" style={{ fontFamily: serif }}>
              {scene.title}
            </h2>
            <p data-step="body">{scene.body}</p>
            <h3 data-step="judge-label">我的取舍</h3>
            <p data-step="judge">{scene.choice}</p>
            <h3 data-step="turn-label">这一选择带来的转向</h3>
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

export default function StrategyPage({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const locationRef = useRef(location)
  const others = capabilities.filter((entry) => entry.id !== 'strategy')

  const open = (pieceId: StrategyPieceId, index: number) => {
    rememberCapabilityReturn('strategy', index, window.scrollY)
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
        const story = ScrollTrigger.getById('strategy-story')
        if (jump.scroll > 0) window.scrollTo(0, jump.scroll)
        else if (jump.item >= 0 && story?.animation) {
          const scene = document.getElementById(`strategy-scene-${Math.min(jump.item, strategyScenes.length - 1)}`)
          const time = Number(scene?.getAttribute('data-arrival') ?? 0)
          const duration = story.animation.duration() || 1
          const progress = Math.min(Math.max(time / duration, 0), 1)
          window.scrollTo(0, story.start + (story.end - story.start) * progress)
        } else if (jump.item >= 0) document.getElementById(`strategy-scene-${Math.min(jump.item, strategyScenes.length - 1)}`)?.scrollIntoView()
        else if (typeof state?.restoreScroll === 'number') window.scrollTo(0, state.restoreScroll)
        if (new URLSearchParams(window.location.search).has('item')) window.history.replaceState(null, '', '/skills/strategy')
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
          const copy = frame.closest('[data-strategy="scene"]')?.querySelector('.insight-scene-copy')
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
        const scenes = [...root.querySelectorAll<HTMLElement>('[data-strategy="scene"]')]
        const deck = root.querySelector<HTMLElement>('[data-deck]')

        const placeBlock = (tl: gsap.core.Timeline, el: Element | null, at: number, slot: number) => {
          if (!el) return at + slot
          tl.from(el, { y: 18, autoAlpha: 0, duration: slot, ease: 'strategyGlide', immediateRender: true }, at)
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
            if (panel) tl.from(panel, { autoAlpha: 0, y: 24, duration: 0.36, ease: 'strategyGlide', immediateRender: true }, step)

            const marks = scene.querySelectorAll('[data-mark]')
            const dotsLayer = scene.querySelector('[data-beat="dots"]')
            const holdsLayer = scene.querySelector('[data-beat="holds"]')
            if (marks.length) {
              const scatterX = [-48, 34, -22, 56, -10, 26, -62, 16, 44, -30, 10, -52, 38, -14, 60, 6, -36, 28]
              const scatterY = [-30, 20, -42, 10, 34, -18, 24, -38, 14, 42, -10, 28, -24, 18, -46, 8, 22, -16]
              gsap.set(marks, {
                x: (index) => scatterX[Number(index)] ?? 0,
                y: (index) => scatterY[Number(index)] ?? 0,
              })
              tl.to(marks, { x: 0, y: 0, duration: 0.62, stagger: 0.03, ease: 'strategyGlide' }, step + 0.04)
            }
            let afterVisual = 0.7
            if (marks.length && dotsLayer && holdsLayer) {
              const sortEnd = step + 0.04 + 0.62 + Math.max(marks.length - 1, 0) * 0.03
              const swapAt = sortEnd + 0.48
              gsap.set(holdsLayer, { autoAlpha: 0 })
              tl.set(holdsLayer, { autoAlpha: 0 }, 0)
              tl.to(dotsLayer, { autoAlpha: 0, duration: 0.28, ease: 'strategyGlide' }, swapAt)
              tl.to(holdsLayer, { autoAlpha: 1, duration: 0.34, ease: 'strategyGlide' }, swapAt + 0.08)
              afterVisual = swapAt - step + 0.95
            }
            const fills = scene.querySelectorAll('[data-compare-fill]')
            if (fills.length) tl.fromTo(fills, { scaleX: 0 }, { scaleX: 1, duration: 0.48, ease: 'strategyGlide', immediateRender: true }, step + 0.06)
            const extra = scene.querySelector('[data-extra]')
            if (extra) tl.fromTo(extra, { scaleX: 0 }, { scaleX: 1, duration: 0.36, ease: 'strategyGlide', immediateRender: true }, step + 0.28)
            const returned = scene.querySelectorAll('[data-returned]')
            if (returned.length) tl.from(returned, { autoAlpha: 0, y: 6, stagger: 0.05, duration: 0.24, ease: 'strategyGlide', immediateRender: true }, step + 0.46)
            const draws = scene.querySelectorAll('[data-draw]')
            if (draws.length) tl.from(draws, { drawSVG: 0, duration: 0.62, ease: 'strategyGlide', immediateRender: true }, step + 0.04)
            const loopBack = scene.querySelectorAll('[data-return]')
            if (loopBack.length) tl.from(loopBack, { drawSVG: 0, duration: 0.42, ease: 'strategyGlide', immediateRender: true }, step + 0.5)
            const nodes = scene.querySelectorAll('[data-node]')
            if (nodes.length) tl.from(nodes, { autoAlpha: 0, y: 8, stagger: 0.07, duration: 0.26, ease: 'strategyGlide', immediateRender: true }, step + 0.08)

            step += afterVisual
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
            if (project) tl.from(project, { autoAlpha: 0, y: 16, duration: 0.36, ease: 'strategyGlide', immediateRender: true }, step)
            if (frame) tl.from(frame, { clipPath: 'inset(38% 5% 38% 5%)', duration: 0.46, ease: 'strategyGlide', immediateRender: true }, step)
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
            id: 'strategy-story',
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
                ease: 'strategyGlide',
                scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 70%', scrub: true },
              })
            })
          })
          gsap.from('.insight-close h2, .insight-close p', {
            y: 32,
            autoAlpha: 0,
            stagger: 0.2,
            ease: 'strategyGlide',
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
          <section className="insight-open insight-sheet" data-strategy="entrance" data-sheet="hero" aria-label={strategyHero.title} style={{ zIndex: 1 }}>
            <div className="insight-dim" data-dim aria-hidden="true" />
            <div className="insight-open-stage insight-sheet-body" data-stage data-sheet-body>
              <div className="insight-open-copy">
                <h1 style={{ fontFamily: serif }}>{strategyHero.title}</h1>
                <p className="insight-lead">{strategyHero.lead}</p>
                <p>{strategyHero.body}</p>
              </div>
              <img className="insight-person" src={strategy.image} alt="" />
              <p className="insight-cue">向下滚动</p>
            </div>
          </section>

          {strategyScenes.map((scene, index) => (
            <SceneBlock key={scene.pieceId} scene={scene} index={index} onOpen={() => open(scene.pieceId, index)} />
          ))}

          <section className="insight-close insight-sheet" data-strategy="close" data-sheet="close" style={{ zIndex: 6 }}>
            <div className="insight-dim" data-dim aria-hidden="true" />
            <div className="insight-sheet-body" data-sheet-body>
              <h2 style={{ fontFamily: serif }}>{strategyClose.title}</h2>
              <p>{strategyClose.body}</p>
              <p>{strategyClose.next}</p>
            </div>
          </section>
        </div>

        {reduced ? (
          <section className="insight-others" data-strategy="others" aria-label="其他能力">
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
          <section className="cap-stack" data-strategy="others" data-stack aria-label="其他能力">
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
