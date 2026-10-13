import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SiteHeader from '@/src/components/SiteHeader'
import { capabilities, capabilityById, rememberCapabilityReturn, takeCapabilityReturn } from '@/src/pages/capability.data'
import {
  growthAudienceCount,
  growthChannels,
  growthClose,
  growthCriteria,
  growthHero,
  growthMusePosts,
  growthScenes,
  growthSofaReturns,
  growthSofaShots,
  type GrowthScene,
} from '@/src/pages/growth.data'
import SkillsIntro from '@/src/pages/SkillsIntro'

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase)
if (!CustomEase.get('growthGlide')) CustomEase.create('growthGlide', 'M0,0 C0.22,0.06 0.18,1 1,1')

const serif = '"Noto Serif SC", "Songti SC", serif'
const growth = capabilityById('growth')!
const audiences = Array.from({ length: growthAudienceCount }, (_, index) => String(index + 1).padStart(2, '0'))

let jumpCache: { item: number; scroll: number } | null = null

function readJump() {
  if (jumpCache) return jumpCache
  const returned = takeCapabilityReturn('growth')
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
      className="cap-page insight-page growth-page min-h-screen"
      style={
        {
          background: growth.paper,
          color: '#3C1712',
          ['--cap-ink' as string]: growth.ink,
          ['--cap-paper' as string]: growth.paper,
          ['--cap-text' as string]: '#3C1712',
        } as CSSProperties
      }
    >
      <SiteHeader slim />
      <SkillsIntro src={growth.image} />
      {children}
    </main>
  )
}

function KelifuVisual() {
  return (
    <figure className="insight-panel growth-kelifu" data-kelifu data-step="panel">
      <div className="growth-layer" data-beat="crowds">
        <p className="growth-kicker">目标人群 · 场景与表达</p>
        <ol className="growth-crowds">
          {audiences.map((id) => (
            <li key={id} data-crowd>
              <b>人群 {id}</b>
              <span>场景</span>
              <span>表达</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="growth-layer" data-beat="test">
        <p className="growth-kicker">内容测试</p>
        <div className="growth-test-box" data-test-box>
          <ol className="growth-kept">
            {audiences.map((id) => (
              <li key={id} data-kept>
                {id}
              </li>
            ))}
          </ol>
          <span data-keep>留下值得放大的方向</span>
        </div>
        <div className="growth-talent" data-talent>
          <p>达人筛选</p>
          {growthCriteria.map((item) => (
            <span key={item} data-criterion>
              {item}
            </span>
          ))}
          <small data-fans>不按粉丝量排序</small>
        </div>
      </div>
      <div className="growth-layer" data-beat="path">
        <p className="growth-kicker">连续路径</p>
        <div className="growth-path" data-path>
          {growthChannels.map((channel, index) => (
            <span key={channel} className="growth-channel">
              {index > 0 ? <i data-arrow>→</i> : null}
              <b data-channel>{channel}</b>
            </span>
          ))}
        </div>
      </div>
      <div className="growth-layer" data-beat="result">
        <div className="growth-metrics">
          <p data-roi>
            <span>项目投放 ROI</span>
            <b>
              <strong>前期</strong>
              <i>→</i>
              <strong>优化后</strong>
            </b>
          </p>
          <p data-efficiency>
            <span>团队内容产出效率</span>
            <strong>持续改善</strong>
          </p>
        </div>
      </div>
    </figure>
  )
}

function SofaVisual() {
  return (
    <figure className="insight-panel growth-sofa" data-sofa data-step="panel">
      <div className="growth-wall" data-wall>
        {growthSofaShots.map((shot) => (
          <img key={shot.src} src={shot.src} alt={shot.alt} data-shot={shot.peak ? 'peak' : 'rest'} className={shot.peak ? 'is-peak' : undefined} />
        ))}
      </div>
      <p className="growth-play" data-play>
        <span>单条最高播放</span>
        <strong>已脱敏</strong>
      </p>
      <p className="growth-return-label" data-return-label>
        <span>买家问题</span>
        <span>脚本片段</span>
      </p>
      <ul className="growth-return">
        {growthSofaReturns.map((item) => (
          <li key={item.question} data-pair>
            <b>{item.question}</b>
            <span>{item.script}</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}

function MuseVisual() {
  return (
    <figure className="insight-panel growth-muse" data-muse data-step="panel">
      <div className="growth-archive" data-archive>
        <i data-back />
        <i data-back />
        <i data-back />
        {growthMusePosts.map((post) => (
          <span key={post.src} className="growth-cover" data-cover>
            <img src={post.src} alt={post.alt} />
          </span>
        ))}
      </div>
      <ul className="growth-freeze">
        <li data-stat>
          <strong>多篇</strong>
          <span>篇图文</span>
        </li>
        <li data-stat>
          <strong>已脱敏</strong>
          <span>浏览</span>
        </li>
        <li data-stat>
          <strong>已脱敏</strong>
          <span>单篇最高点赞</span>
        </li>
      </ul>
      <figcaption data-note>素材档案展示了内容方向。浏览和点赞还不足以证明留存或转化。</figcaption>
    </figure>
  )
}

function SceneVisual({ scene }: { scene: GrowthScene }) {
  if (scene.visual === 'kelifu') return <KelifuVisual />
  if (scene.visual === 'sofa') return <SofaVisual />
  return <MuseVisual />
}

function SceneBlock({ scene, index, onOpen }: { scene: GrowthScene; index: number; onOpen: () => void }) {
  return (
    <article id={`growth-scene-${index}`} className="insight-scene insight-sheet" data-growth="scene" data-sheet={scene.id} data-scene={scene.id} style={{ zIndex: index + 2 }}>
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
            <h3 data-step="approach-label">我的切入点</h3>
            <p data-step="approach">{scene.approach}</p>
            {scene.result ? (
              <>
                <h3 data-step="result-label">这套做法留下了什么</h3>
                <p data-step="result">{scene.result}</p>
              </>
            ) : null}
          </div>
          <div className="insight-scene-side">
            <SceneVisual scene={scene} />
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

function playKelifu(tl: gsap.core.Timeline, scene: HTMLElement, step: number) {
  const ease = 'growthGlide'
  const layer = (name: string) => scene.querySelector(`[data-beat="${name}"]`)
  const crowds = layer('crowds')
  const test = layer('test')
  const path = layer('path')
  const result = layer('result')
  const cards = scene.querySelectorAll('[data-crowd]')
  const kept = scene.querySelectorAll('[data-kept]')
  const keep = scene.querySelector('[data-keep]')
  const criteria = scene.querySelectorAll('[data-criterion]')
  const fans = scene.querySelector('[data-fans]')
  const channels = scene.querySelectorAll('[data-channel]')
  const arrows = scene.querySelectorAll('[data-arrow]')
  const roi = scene.querySelector('[data-roi]')
  const efficiency = scene.querySelector('[data-efficiency]')

  const layers = [crowds, test, path, result].filter((item): item is Element => item instanceof Element)
  gsap.set(layers, { autoAlpha: 0 })
  if (crowds) tl.set(crowds, { autoAlpha: 0 }, 0)
  if (test) tl.set(test, { autoAlpha: 0 }, 0)
  if (path) tl.set(path, { autoAlpha: 0 }, 0)
  if (result) tl.set(result, { autoAlpha: 0 }, 0)

  if (crowds) tl.to(crowds, { autoAlpha: 1, duration: 0.24, ease }, step)
  if (cards.length) tl.from(cards, { autoAlpha: 0, y: 14, stagger: 0.14, duration: 0.28, ease, immediateRender: true }, step + 0.04)

  const testAt = step + 1.9
  if (crowds) tl.to(crowds, { autoAlpha: 0.2, duration: 0.36, ease }, testAt)
  if (test) tl.to(test, { autoAlpha: 1, duration: 0.3, ease }, testAt + 0.08)
  if (kept.length) tl.from(kept, { autoAlpha: 0, y: 8, stagger: 0.05, duration: 0.2, ease, immediateRender: true }, testAt + 0.14)
  if (kept.length) tl.to(kept, { autoAlpha: 0, duration: 0.22, ease }, testAt + 0.86)
  if (keep) tl.from(keep, { autoAlpha: 0, duration: 0.28, ease, immediateRender: true }, testAt + 0.96)
  if (criteria.length) tl.from(criteria, { autoAlpha: 0, y: 6, stagger: 0.12, duration: 0.24, ease, immediateRender: true }, testAt + 1.18)
  if (fans) tl.from(fans, { autoAlpha: 0, duration: 0.24, ease, immediateRender: true }, testAt + 1.46)

  const pathAt = testAt + 2.15
  if (test) tl.to(test, { autoAlpha: 0, duration: 0.3, ease }, pathAt)
  if (path) tl.to(path, { autoAlpha: 1, duration: 0.28, ease }, pathAt + 0.1)
  if (channels.length) tl.from(channels, { autoAlpha: 0, y: 8, stagger: 0.16, duration: 0.28, ease, immediateRender: true }, pathAt + 0.14)
  if (arrows.length) tl.from(arrows, { autoAlpha: 0, duration: 0.2, ease, immediateRender: true }, pathAt + 0.24)

  const roiAt = pathAt + 1.4
  if (path) tl.to(path, { autoAlpha: 0, duration: 0.3, ease }, roiAt)
  if (crowds) tl.to(crowds, { autoAlpha: 0.34, scale: 0.72, transformOrigin: 'center top', duration: 0.4, ease }, roiAt)
  if (result) tl.to(result, { autoAlpha: 1, duration: 0.28, ease }, roiAt + 0.1)
  if (roi) tl.from(roi, { autoAlpha: 0, y: 10, duration: 0.32, ease, immediateRender: true }, roiAt + 0.14)
  if (efficiency) tl.from(efficiency, { autoAlpha: 0, y: 10, duration: 0.32, ease, immediateRender: true }, roiAt + 0.3)

  return roiAt - step
}

function playSofa(tl: gsap.core.Timeline, scene: HTMLElement, step: number) {
  const ease = 'growthGlide'
  const shots = scene.querySelectorAll('[data-shot]')
  const rest = scene.querySelectorAll('[data-shot="rest"]')
  const peak = scene.querySelector('[data-shot="peak"]')
  const play = scene.querySelector('[data-play]')
  const label = scene.querySelector('[data-return-label]')
  const pairs = scene.querySelectorAll('[data-pair]')
  if (shots.length) tl.from(shots, { autoAlpha: 0, y: 12, stagger: 0.08, duration: 0.28, ease, immediateRender: true }, step)
  if (rest.length) tl.to(rest, { autoAlpha: 0.48, duration: 0.28, ease }, step + 0.52)
  if (peak) tl.fromTo(peak, { scale: 1 }, { scale: 1.05, duration: 0.32, ease }, step + 0.48)
  if (play) tl.from(play, { autoAlpha: 0, y: 8, duration: 0.28, ease, immediateRender: true }, step + 0.6)
  if (label) tl.from(label, { autoAlpha: 0, duration: 0.22, ease, immediateRender: true }, step + 0.98)
  if (pairs.length) tl.from(pairs, { autoAlpha: 0, y: 8, stagger: 0.1, duration: 0.24, ease, immediateRender: true }, step + 1.08)
  return 1.72
}

function playMuse(tl: gsap.core.Timeline, scene: HTMLElement, step: number) {
  const ease = 'growthGlide'
  const backs = scene.querySelectorAll('[data-back]')
  const covers = [...scene.querySelectorAll('[data-cover]')]
  const stats = scene.querySelectorAll('[data-stat]')
  const note = scene.querySelector('[data-note]')
  const fans = [-8, 1, 8]
  if (backs.length) tl.from(backs, { autoAlpha: 0, duration: 0.24, ease, immediateRender: true }, step)
  covers.forEach((cover, index) => {
    tl.fromTo(
      cover,
      { autoAlpha: 0, y: 28, rotation: fans[index] - 12 },
      { autoAlpha: 1, y: 0, rotation: fans[index], duration: 0.4, ease, immediateRender: true },
      step + 0.1 + index * 0.16,
    )
  })
  if (stats.length) tl.from(stats, { autoAlpha: 0, y: 8, stagger: 0.08, duration: 0.26, ease, immediateRender: true }, step + 0.82)
  if (note) tl.from(note, { autoAlpha: 0, duration: 0.24, ease, immediateRender: true }, step + 1.12)
  return 1.5
}

export default function GrowthPage({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const locationRef = useRef(location)
  const others = capabilities.filter((entry) => entry.id !== 'growth')

  const open = (scene: GrowthScene, index: number) => {
    rememberCapabilityReturn('growth', index, window.scrollY)
    const go = () => navigate(scene.href)
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
        const story = ScrollTrigger.getById('growth-story')
        if (jump.scroll > 0) window.scrollTo(0, jump.scroll)
        else if (jump.item >= 0 && story?.animation) {
          const scene = document.getElementById(`growth-scene-${Math.min(jump.item, growthScenes.length - 1)}`)
          const time = Number(scene?.getAttribute('data-arrival') ?? 0)
          const duration = story.animation.duration() || 1
          const progress = Math.min(Math.max(time / duration, 0), 1)
          window.scrollTo(0, story.start + (story.end - story.start) * progress)
        } else if (jump.item >= 0) document.getElementById(`growth-scene-${Math.min(jump.item, growthScenes.length - 1)}`)?.scrollIntoView()
        else if (typeof state?.restoreScroll === 'number') window.scrollTo(0, state.restoreScroll)
        if (new URLSearchParams(window.location.search).has('item')) window.history.replaceState(null, '', '/skills/growth')
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
          const copy = frame.closest('[data-growth="scene"]')?.querySelector('.insight-scene-copy')
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
        const scenes = [...root.querySelectorAll<HTMLElement>('[data-growth="scene"]')]
        const deck = root.querySelector<HTMLElement>('[data-deck]')

        const placeBlock = (timeline: gsap.core.Timeline, el: Element | null, at: number, slot: number) => {
          if (!el) return at + slot
          timeline.from(el, { y: 18, autoAlpha: 0, duration: slot, ease: 'growthGlide', immediateRender: true }, at)
          return at + slot
        }

        if (desktop && deck) {
          const EXCHANGE = 0.86
          const tl = gsap.timeline({ paused: true })
          const sheets = [...deck.querySelectorAll<HTMLElement>('[data-sheet]')]
          gsap.set(sheets.slice(1), { yPercent: 100 })

          tl.to('.insight-cue', { autoAlpha: 0, duration: 0.46, ease: 'none' }, 0)
          tl.fromTo('.insight-person', { y: 0 }, { y: -26, duration: 0.46, ease: 'none' }, 0)

          let cursor = 0.46
          let outgoing = sheets[0]
          scenes.forEach((scene) => {
            const at = cursor
            const long = scene.dataset.scene === 'kelifu'
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
            step = placeBlock(tl, scene.querySelector('[data-step="body"]'), step, 0.4)
            const panel = scene.querySelector('[data-step="panel"]')
            const project = scene.querySelector('[data-step="project"]')
            const frame = scene.querySelector('[data-frame]')
            const visualAt = step
            if (panel) tl.from(panel, { autoAlpha: 0, y: 20, duration: 0.32, ease: 'growthGlide', immediateRender: true }, visualAt)
            if (project) tl.from(project, { autoAlpha: 0, y: 16, duration: 0.36, ease: 'growthGlide', immediateRender: true }, visualAt + 0.08)
            if (frame) tl.from(frame, { clipPath: 'inset(38% 5% 38% 5%)', duration: 0.46, ease: 'growthGlide', immediateRender: true }, visualAt + 0.08)
            if (long) {
              placeBlock(tl, scene.querySelector('[data-step="approach-label"]'), visualAt, 0.3)
              placeBlock(tl, scene.querySelector('[data-step="approach"]'), visualAt + 0.06, 0.4)
              const roiAt = visualAt + playKelifu(tl, scene, visualAt)
              placeBlock(tl, scene.querySelector('[data-step="result-label"]'), roiAt, 0.3)
              placeBlock(tl, scene.querySelector('[data-step="result"]'), roiAt + 0.06, 0.36)
              step = roiAt + 0.64
            } else {
              const used = scene.dataset.scene === 'sofa' ? playSofa(tl, scene, visualAt) : playMuse(tl, scene, visualAt)
              const approachAt = visualAt + used
              placeBlock(tl, scene.querySelector('[data-step="approach-label"]'), approachAt, 0.3)
              placeBlock(tl, scene.querySelector('[data-step="approach"]'), approachAt + 0.06, 0.36)
              step = approachAt + 0.46
            }
            scene.setAttribute('data-arrival', String(step))
            tl.addLabel(`hold-${scene.dataset.scene}`, step)
            step += long ? 0.9 : 0.28
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
            id: 'growth-story',
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
                ease: 'growthGlide',
                scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 70%', scrub: true },
              })
            })
          })
          gsap.from('.insight-close h2, .insight-close p', {
            y: 32,
            autoAlpha: 0,
            stagger: 0.2,
            ease: 'growthGlide',
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
          <section className="insight-open insight-sheet" data-growth="entrance" data-sheet="hero" aria-label={growthHero.title} style={{ zIndex: 1 }}>
            <div className="insight-dim" data-dim aria-hidden="true" />
            <div className="insight-open-stage insight-sheet-body" data-stage data-sheet-body>
              <div className="insight-open-copy">
                <h1 style={{ fontFamily: serif }}>{growthHero.title}</h1>
                <p className="insight-lead">{growthHero.lead}</p>
                <p>{growthHero.body}</p>
              </div>
              <img className="insight-person" src={growth.image} alt="" />
              <p className="insight-cue">向下滚动</p>
            </div>
          </section>

          {growthScenes.map((scene, index) => (
            <SceneBlock key={scene.id} scene={scene} index={index} onOpen={() => open(scene, index)} />
          ))}

          <section className="insight-close insight-sheet" data-growth="close" data-sheet="close" style={{ zIndex: 6 }}>
            <div className="insight-dim" data-dim aria-hidden="true" />
            <div className="insight-sheet-body" data-sheet-body>
              <h2 style={{ fontFamily: serif }}>
                {growthClose.title.split('\n').map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p>{growthClose.body}</p>
              <p>{growthClose.next}</p>
            </div>
          </section>
        </div>

        {reduced ? (
          <section className="insight-others" data-growth="others" aria-label="其他能力">
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
          <section className="cap-stack" data-growth="others" data-stack aria-label="其他能力">
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
