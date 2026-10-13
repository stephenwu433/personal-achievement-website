import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SiteHeader from '@/src/components/SiteHeader'
import { aiAgents, aiAxes, aiClose, aiHero, aiMaterials, aiPath, aiScenes, aiZones, type AiPieceId, type AiScene } from '@/src/pages/ai.data'
import { capabilities, capabilityById, rememberCapabilityReturn, takeCapabilityReturn } from '@/src/pages/capability.data'
import SkillsIntro from '@/src/pages/SkillsIntro'

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, CustomEase)
CustomEase.create('aiGlide', 'M0,0 C0.22,0.06 0.18,1 1,1')

const serif = '"Noto Serif SC", "Songti SC", serif'
const ai = capabilityById('ai')!

let jumpCache: { item: number; scroll: number } | null = null

function readJump() {
  if (jumpCache) return jumpCache
  const returned = takeCapabilityReturn('ai')
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
      className="cap-page insight-page ai-page min-h-screen"
      style={
        {
          background: ai.paper,
          color: ai.ink,
          ['--cap-ink' as string]: ai.ink,
          ['--cap-paper' as string]: ai.paper,
          ['--cap-text' as string]: ai.text,
        } as CSSProperties
      }
    >
      <SiteHeader slim />
      <SkillsIntro src={ai.image} />
      {children}
    </main>
  )
}

function AgentsVisual({ scene }: { scene: AiScene }) {
  return (
    <figure className="insight-panel ai-agents" data-agents data-step="panel" aria-label={`多个分工 Agent。${scene.caption}`}>
      <div className="ai-fan" aria-hidden="true">
        <div className="ai-fan-names">
          {aiAgents.map((label) => (
            <span key={label} data-lane>{label}</span>
          ))}
        </div>
        <div className="ai-fan-board">
          <svg className="ai-fan-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path data-lane-line d="M 0 12 C 48 12, 62 50, 98 50" />
            <path data-lane-line d="M 0 37 C 48 37, 62 50, 98 50" />
            <path data-lane-line d="M 0 63 C 48 63, 62 50, 98 50" />
            <path data-lane-line d="M 0 88 C 48 88, 62 50, 98 50" />
          </svg>
          <p className="ai-fan-count">
            <span data-count>
              <strong style={{ fontFamily: serif }}>{aiAgents.length}</strong>
              <span>个分工 Agent</span>
            </span>
          </p>
        </div>
        <b data-human>人工确认</b>
      </div>
      <figcaption>{scene.caption}</figcaption>
    </figure>
  )
}

function EvidenceVisual({ scene }: { scene: AiScene }) {
  return (
    <figure className="insight-panel ai-evidence" data-evidence data-step="panel" aria-label={`${aiMaterials} 份分层材料。${scene.caption}`}>
      <div className="ai-lock" aria-hidden="true">
        <span data-task>业务任务</span>
        <i data-lock-line />
        <b data-standard>冻结标准</b>
      </div>
      <div className="ai-resumes" aria-hidden="true">
        <div className="ai-resume" data-resume>
          <span>写法一</span>
          <i className="ai-link" data-link />
          <b data-review>复核卡</b>
          <em data-bench>HR 工作台</em>
        </div>
        <div className="ai-resume" data-resume>
          <span>写法二</span>
          <span className="ai-track">
            <i className="ai-link is-try" data-link-try />
            <span className="ai-link is-broken" data-break>
              <i />
              <em>×</em>
              <i />
            </span>
          </span>
          <b data-wait>待补区</b>
        </div>
      </div>
      <p className="ai-materials" aria-hidden="true">
        <strong style={{ fontFamily: serif }} data-total>{aiMaterials}</strong>
        <span>份分层材料</span>
      </p>
      <ol className="ai-zones" aria-hidden="true">
        {aiZones.map((zone) => (
          <li key={zone} data-zone>{zone}</li>
        ))}
      </ol>
      <figcaption>{scene.caption}</figcaption>
    </figure>
  )
}

function ServiceVisual({ scene }: { scene: AiScene }) {
  return (
    <figure className="insight-panel ai-service" data-service data-step="panel" aria-label={`${aiAxes.length} 个验收维度：${aiAxes.join('、')}。${scene.caption}`}>
      <ol className="ai-path" aria-hidden="true">
        {aiPath.map((step) => (
          <li key={step} data-node>{step}</li>
        ))}
      </ol>
      <p className="ai-event" data-correct aria-hidden="true">C1 改为 C2</p>
      <p className="ai-event is-back" data-rollback aria-hidden="true">依赖 C1 的分支退回</p>
      <p className="ai-event is-stop" data-heat aria-hidden="true">异常发热 · 排障停止</p>
      <p className="ai-event is-hand" data-handoff aria-hidden="true">交接包 → 人工</p>
      <p className="ai-axis-label" aria-hidden="true">
        <strong style={{ fontFamily: serif }}>{aiAxes.length}</strong>
        <span>个验收维度</span>
      </p>
      <ol className="ai-axes" aria-hidden="true">
        {aiAxes.map((axis) => (
          <li key={axis} data-axis>{axis}</li>
        ))}
      </ol>
      <figcaption>{scene.caption}</figcaption>
    </figure>
  )
}

function DataVisual({ scene }: { scene: AiScene }) {
  if (scene.visual === 'agents') return <AgentsVisual scene={scene} />
  if (scene.visual === 'evidence') return <EvidenceVisual scene={scene} />
  return <ServiceVisual scene={scene} />
}

function SceneBlock({ scene, index, onOpen }: { scene: AiScene; index: number; onOpen: () => void }) {
  return (
    <article
      id={`ai-scene-${index}`}
      className="insight-scene insight-sheet"
      data-ai="scene"
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
            <h3 data-step="judge-label">关键设计</h3>
            <p data-step="judge">{scene.design}</p>
            <h3 data-step="turn-label">这一设计改变了什么</h3>
            <p data-step="turn">{scene.change}</p>
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

function playMechanism(tl: gsap.core.Timeline, scene: HTMLElement, step: number) {
  const ease = 'aiGlide'
  const laneLines = scene.querySelectorAll('[data-lane-line]')
  if (laneLines.length) tl.from(laneLines, { drawSVG: 0, stagger: 0.18, duration: 0.42, ease, immediateRender: true }, step + 0.08)
  const lanes = scene.querySelectorAll('[data-lane]')
  if (lanes.length) tl.from(lanes, { autoAlpha: 0, x: -12, stagger: 0.16, duration: 0.28, ease, immediateRender: true }, step + 0.04)
  const count = scene.querySelector('[data-count]')
  if (count) tl.from(count, { autoAlpha: 0, duration: 0.28, ease, immediateRender: true }, step + 0.86)
  const human = scene.querySelector('[data-human]')
  if (human) tl.from(human, { autoAlpha: 0, duration: 0.3, ease, immediateRender: true }, step + 1.05)

  const task = scene.querySelector('[data-task]')
  if (task) tl.from(task, { autoAlpha: 0, duration: 0.24, ease, immediateRender: true }, step + 0.04)
  const lockLine = scene.querySelector('[data-lock-line]')
  if (lockLine) tl.fromTo(lockLine, { scaleX: 0 }, { scaleX: 1, duration: 0.28, ease, immediateRender: true }, step + 0.18)
  const standard = scene.querySelector('[data-standard]')
  if (standard) tl.from(standard, { autoAlpha: 0, duration: 0.28, ease, immediateRender: true }, step + 0.4)
  const resumes = scene.querySelectorAll('[data-resume]')
  if (resumes.length) tl.from(resumes, { x: 36, autoAlpha: 0, stagger: 0.14, duration: 0.34, ease, immediateRender: true }, step + 0.52)
  const link = scene.querySelector('[data-link]')
  if (link) tl.fromTo(link, { scaleX: 0 }, { scaleX: 1, duration: 0.32, ease, immediateRender: true }, step + 0.78)
  const review = scene.querySelector('[data-review]')
  if (review) tl.from(review, { autoAlpha: 0, x: 10, duration: 0.26, ease, immediateRender: true }, step + 1)
  const bench = scene.querySelector('[data-bench]')
  if (bench) tl.from(bench, { autoAlpha: 0, duration: 0.26, ease, immediateRender: true }, step + 1.16)
  const linkTry = scene.querySelector('[data-link-try]')
  if (linkTry) {
    tl.fromTo(linkTry, { scaleX: 0 }, { scaleX: 1, duration: 0.28, ease, immediateRender: true }, step + 0.9)
    tl.to(linkTry, { autoAlpha: 0, duration: 0.2, ease }, step + 1.2)
  }
  const broken = scene.querySelector('[data-break]')
  if (broken) tl.from(broken, { autoAlpha: 0, duration: 0.24, ease, immediateRender: true }, step + 1.28)
  const wait = scene.querySelector('[data-wait]')
  if (wait) tl.from(wait, { autoAlpha: 0, duration: 0.24, ease, immediateRender: true }, step + 1.36)
  const total = scene.querySelector('[data-total]')
  if (total) tl.from(total, { autoAlpha: 0, duration: 0.24, ease, immediateRender: true }, step + 1.5)
  const zones = scene.querySelectorAll('[data-zone]')
  if (zones.length) tl.from(zones, { autoAlpha: 0, y: 8, stagger: 0.06, duration: 0.24, ease, immediateRender: true }, step + 1.58)

  const nodes = scene.querySelectorAll('[data-node]')
  if (nodes.length) tl.from(nodes, { autoAlpha: 0, y: 8, stagger: 0.12, duration: 0.26, ease, immediateRender: true }, step + 0.06)
  const correct = scene.querySelector('[data-correct]')
  if (correct) tl.from(correct, { autoAlpha: 0, duration: 0.26, ease, immediateRender: true }, step + 0.62)
  const rollback = scene.querySelector('[data-rollback]')
  if (rollback) tl.from(rollback, { autoAlpha: 0, x: 8, duration: 0.28, ease, immediateRender: true }, step + 0.84)
  const heat = scene.querySelector('[data-heat]')
  if (heat) tl.from(heat, { autoAlpha: 0, duration: 0.26, ease, immediateRender: true }, step + 1.12)
  const handoff = scene.querySelector('[data-handoff]')
  if (handoff) tl.from(handoff, { autoAlpha: 0, duration: 0.28, ease, immediateRender: true }, step + 1.34)
  const axes = scene.querySelectorAll('[data-axis]')
  if (axes.length) tl.from(axes, { autoAlpha: 0, y: 8, stagger: 0.06, duration: 0.24, ease, immediateRender: true }, step + 1.58)
  const axisLabel = scene.querySelector('.ai-axis-label')
  if (axisLabel) tl.from(axisLabel, { autoAlpha: 0, duration: 0.24, ease, immediateRender: true }, step + 1.52)

  if (laneLines.length || nodes.length || task) return 1.9
  return 0.7
}

export default function AiPage({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const locationRef = useRef(location)
  const others = capabilities.filter((entry) => entry.id !== 'ai')

  const open = (pieceId: AiPieceId, index: number) => {
    rememberCapabilityReturn('ai', index, window.scrollY)
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
        const story = ScrollTrigger.getById('ai-story')
        if (jump.scroll > 0) window.scrollTo(0, jump.scroll)
        else if (jump.item >= 0 && story?.animation) {
          const scene = document.getElementById(`ai-scene-${Math.min(jump.item, aiScenes.length - 1)}`)
          const time = Number(scene?.getAttribute('data-arrival') ?? 0)
          const duration = story.animation.duration() || 1
          const progress = Math.min(Math.max(time / duration, 0), 1)
          window.scrollTo(0, story.start + (story.end - story.start) * progress)
        } else if (jump.item >= 0) document.getElementById(`ai-scene-${Math.min(jump.item, aiScenes.length - 1)}`)?.scrollIntoView()
        else if (typeof state?.restoreScroll === 'number') window.scrollTo(0, state.restoreScroll)
        if (new URLSearchParams(window.location.search).has('item')) window.history.replaceState(null, '', '/skills/ai')
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
          const copy = frame.closest('[data-ai="scene"]')?.querySelector('.insight-scene-copy')
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
        const scenes = [...root.querySelectorAll<HTMLElement>('[data-ai="scene"]')]
        const deck = root.querySelector<HTMLElement>('[data-deck]')

        const placeBlock = (tl: gsap.core.Timeline, el: Element | null, at: number, slot: number) => {
          if (!el) return at + slot
          tl.from(el, { y: 18, autoAlpha: 0, duration: slot, ease: 'aiGlide', immediateRender: true }, at)
          return at + slot
        }

        if (desktop && deck) {
          const EXCHANGE = 0.86
          const HOLD = 0.36
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
            if (panel) tl.from(panel, { autoAlpha: 0, y: 24, duration: 0.36, ease: 'aiGlide', immediateRender: true }, step)
            const mechanism = playMechanism(tl, scene, step)
            step += mechanism
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
            if (project) tl.from(project, { autoAlpha: 0, y: 16, duration: 0.36, ease: 'aiGlide', immediateRender: true }, step)
            if (frame) tl.from(frame, { clipPath: 'inset(38% 5% 38% 5%)', duration: 0.46, ease: 'aiGlide', immediateRender: true }, step)
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
            id: 'ai-story',
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
                ease: 'aiGlide',
                scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 70%', scrub: true },
              })
            })
          })
          gsap.from('.insight-close h2, .insight-close p', {
            y: 32,
            autoAlpha: 0,
            stagger: 0.2,
            ease: 'aiGlide',
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
          <section className="insight-open insight-sheet" data-ai="entrance" data-sheet="hero" aria-label={aiHero.title} style={{ zIndex: 1 }}>
            <div className="insight-dim" data-dim aria-hidden="true" />
            <div className="insight-open-stage insight-sheet-body" data-stage data-sheet-body>
              <div className="insight-open-copy">
                <h1 style={{ fontFamily: serif }}>{aiHero.title}</h1>
                <p className="insight-lead">
                  {aiHero.lead.slice(0, aiHero.lead.indexOf('下一步'))}
                  <br />
                  {aiHero.lead.slice(aiHero.lead.indexOf('下一步'))}
                </p>
                <p>{aiHero.body}</p>
              </div>
              <img className="insight-person" src={ai.image} alt="" />
              <p className="insight-cue">向下滚动</p>
            </div>
          </section>

          {aiScenes.map((scene, index) => (
            <SceneBlock key={scene.pieceId} scene={scene} index={index} onOpen={() => open(scene.pieceId, index)} />
          ))}

          <section className="insight-close insight-sheet" data-ai="close" data-sheet="close" style={{ zIndex: 6 }}>
            <div className="insight-dim" data-dim aria-hidden="true" />
            <div className="insight-sheet-body" data-sheet-body>
              <h2 style={{ fontFamily: serif }}>{aiClose.title}</h2>
              <p>{aiClose.body}</p>
              <p>{aiClose.next}</p>
            </div>
          </section>
        </div>

        {reduced ? (
          <section className="insight-others" data-ai="others" aria-label="其他能力">
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
          <section className="cap-stack" data-ai="others" data-stack aria-label="其他能力">
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
