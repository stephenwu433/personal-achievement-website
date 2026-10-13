import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SiteHeader from '@/src/components/SiteHeader'
import { capabilities, capabilityById, rememberCapabilityReturn, takeCapabilityReturn } from '@/src/pages/capability.data'
import {
  deliveryClose,
  deliveryEnglishLines,
  deliveryHandoff,
  deliveryHero,
  deliveryMembers,
  deliveryOpenLines,
  deliveryPosters,
  deliveryQuestions,
  deliveryScenes,
  deliverySourceLines,
  deliverySources,
  deliveryTasks,
  deliveryWhen,
  type DeliveryScene,
  type DeliveryTask,
} from '@/src/pages/delivery.data'
import SkillsIntro from '@/src/pages/SkillsIntro'

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase)
if (!CustomEase.get('deliveryGlide')) CustomEase.create('deliveryGlide', 'M0,0 C0.22,0.06 0.18,1 1,1')

const serif = '"Noto Serif SC", "Songti SC", serif'
const delivery = capabilityById('delivery')!

let jumpCache: { item: number; scroll: number } | null = null

function readJump() {
  if (jumpCache) return jumpCache
  const returned = takeCapabilityReturn('delivery')
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
      className="cap-page insight-page delivery-page min-h-screen"
      style={
        {
          background: delivery.paper,
          color: '#193E35',
          ['--cap-ink' as string]: delivery.ink,
          ['--cap-paper' as string]: delivery.paper,
          ['--cap-text' as string]: '#EEE3CC',
        } as CSSProperties
      }
    >
      <SiteHeader slim />
      <SkillsIntro src={delivery.image} />
      {children}
    </main>
  )
}

function BuildingVisual() {
  const [active, setActive] = useState(deliveryTasks[0].id)
  const task = deliveryTasks.find((item) => item.id === active) ?? deliveryTasks[0]
  return (
    <figure className="insight-panel delivery-board" data-step="panel">
      <div className="delivery-layer" data-beat="scatter">
        <p className="delivery-kicker">散开的展会资料</p>
        <ul className="delivery-scatter">
          {deliverySources.map((item) => (
            <li key={item} data-slip>
              {item}
            </li>
          ))}
          {deliveryTasks.map((item) => (
            <li key={item.id} data-slip>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="delivery-layer" data-beat="list">
        <p className="delivery-kicker">行动清单</p>
        <div className="delivery-columns">
          {deliveryWhen.map((when) => (
            <section key={when}>
              <h4>{when}</h4>
              {deliveryTasks
                .filter((item) => item.when === when)
                .map((item) => (
                  <TaskButton key={item.id} item={item} pressed={item.id === task.id} onPick={() => setActive(item.id)} />
                ))}
            </section>
          ))}
        </div>
        <TaskDetail task={task} />
      </div>
      <div className="delivery-layer" data-beat="posters">
        <p className="delivery-kicker">展会邀请海报与英文物料</p>
        <div className="delivery-posters">
          {deliveryPosters.map((poster) => (
            <img key={poster.src} src={poster.src} alt={poster.alt} data-poster />
          ))}
        </div>
      </div>
    </figure>
  )
}

function TaskButton({ item, pressed, onPick }: { item: DeliveryTask; pressed: boolean; onPick: () => void }) {
  return (
    <button type="button" data-task={item.id} data-pending={item.pending ? '' : undefined} aria-pressed={pressed} onClick={onPick}>
      <span>{item.name}</span>
      {item.pending ? <em>待确认</em> : null}
    </button>
  )
}

function TaskDetail({ task }: { task: DeliveryTask }) {
  return (
    <dl className="delivery-detail" data-detail aria-live="polite">
      <div>
        <dt>资源用途</dt>
        <dd>{task.use}</dd>
      </div>
      <div>
        <dt>领取渠道</dt>
        <dd>{task.channel}</dd>
      </div>
      <div>
        <dt>时间节点</dt>
        <dd>{task.time}</dd>
      </div>
      <div className={task.pending ? 'is-pending' : undefined}>
        <dt>确认状态</dt>
        <dd>{task.status}</dd>
      </div>
    </dl>
  )
}

function EducationVisual() {
  return (
    <figure className="insight-panel delivery-education" data-step="panel">
      <div className="delivery-layer" data-beat="ask">
        <p className="delivery-kicker">咨询</p>
        <p className="delivery-question" data-question>
          {deliveryQuestions.join('、')}
        </p>
        <small>高频问题。没有可公开的聊天记录。</small>
      </div>
      <div className="delivery-layer" data-beat="faq">
        <p className="delivery-kicker">FAQ</p>
        <p className="delivery-answer" data-answer>
          同一条标准答复
        </p>
        <small>课程、活动安排、报名方式都回到这一份材料。</small>
      </div>
      <div className="delivery-layer" data-beat="members">
        <p className="delivery-kicker">分发给校园成员</p>
        <ul className="delivery-members">
          {deliveryMembers.map((id) => (
            <li key={id} data-member>
              <b>推广成员 {id}</b>
              <span>同一条标准答复</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="delivery-layer" data-beat="path">
        <p className="delivery-kicker">交接路径</p>
        <ol className="delivery-path">
          {deliveryHandoff.map((step, index) => (
            <li key={step}>
              {index > 0 ? <i data-arrow>→</i> : null}
              <span data-channel>{step}</span>
            </li>
          ))}
        </ol>
        <ul className="delivery-scope">
          <li data-scope>
            <span>执行范围</span>
            <b>志愿者筛选与培训</b>
            <b>校园渠道协作</b>
          </li>
          <li data-scope>
            <span>咨询与报名记录</span>
            <b>咨询记录已脱敏</b>
            <b>报名记录已脱敏</b>
          </li>
        </ul>
        <figcaption>报名数字不是 FAQ 单独带来的结果。</figcaption>
      </div>
    </figure>
  )
}

function MachineryVisual() {
  return (
    <figure className="insight-panel delivery-machinery" data-step="panel">
      <div className="delivery-layer" data-beat="sides">
        <div data-source>
          <p className="delivery-kicker">原始资料</p>
          <ul>
            {deliverySourceLines.map((line) => (
              <li key={line} data-line>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div data-questions>
          <p className="delivery-kicker">展会问题</p>
          <ul>
            {deliveryOpenLines.map((line) => (
              <li key={line} data-line data-open="">
                {line}
                <em>待确认</em>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="delivery-layer" data-beat="english">
        <p className="delivery-kicker">英文展示</p>
        <ul className="delivery-english">
          {deliveryEnglishLines.map((line) => (
            <li key={line} data-ready>
              <b>{line}</b>
              <span>已确认，可写入英文展示</span>
            </li>
          ))}
        </ul>
        <ul className="delivery-held">
          {deliveryOpenLines.map((line) => (
            <li key={line} data-held>
              <b>{line}</b>
              <em>未确认，不写入最终版本</em>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}

function SceneVisual({ scene }: { scene: DeliveryScene }) {
  if (scene.id === 'building') return <BuildingVisual />
  if (scene.id === 'education') return <EducationVisual />
  return <MachineryVisual />
}

function SceneBlock({ scene, index, onOpen }: { scene: DeliveryScene; index: number; onOpen: () => void }) {
  return (
    <article id={`delivery-scene-${index}`} className="insight-scene insight-sheet" data-delivery="scene" data-sheet={scene.id} data-scene={scene.id} style={{ zIndex: index + 2 }}>
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
            <h3 data-step="approach-label">推进中的关键工作</h3>
            <p data-step="approach">{scene.approach}</p>
            <h3 data-step="result-label">这让下一环节得到了什么</h3>
            <p data-step="result">{scene.result}</p>
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

function playBuilding(tl: gsap.core.Timeline, scene: HTMLElement, step: number) {
  const ease = 'deliveryGlide'
  const scatter = scene.querySelector('[data-beat="scatter"]')
  const list = scene.querySelector('[data-beat="list"]')
  const posters = scene.querySelector('[data-beat="posters"]')
  const slips = scene.querySelectorAll('[data-slip]')
  const tasks = scene.querySelectorAll('[data-task]')
  const detail = scene.querySelector('[data-detail]')
  const shots = scene.querySelectorAll('[data-poster]')
  gsap.set([scatter, list, posters], { autoAlpha: 0 })
  if (scatter) tl.set(scatter, { autoAlpha: 0 }, 0)
  if (list) tl.set(list, { autoAlpha: 0 }, 0)
  if (posters) tl.set(posters, { autoAlpha: 0 }, 0)
  if (scatter) tl.to(scatter, { autoAlpha: 1, duration: 0.28, ease }, step)
  if (slips.length) tl.from(slips, { autoAlpha: 0, y: 16, rotation: -8, stagger: 0.06, duration: 0.28, ease, immediateRender: true }, step + 0.08)
  const listAt = step + 1.35
  if (scatter) tl.to(scatter, { autoAlpha: 0, duration: 0.28, ease }, listAt)
  if (list) tl.to(list, { autoAlpha: 1, duration: 0.28, ease }, listAt + 0.08)
  if (tasks.length) tl.from(tasks, { autoAlpha: 0, y: 10, stagger: 0.08, duration: 0.26, ease, immediateRender: true }, listAt + 0.16)
  if (detail) tl.from(detail, { autoAlpha: 0, y: 8, duration: 0.28, ease, immediateRender: true }, listAt + 0.7)
  const posterAt = listAt + 1.85
  if (list) tl.to(list, { autoAlpha: 0, duration: 0.28, ease }, posterAt)
  if (posters) tl.to(posters, { autoAlpha: 1, duration: 0.3, ease }, posterAt + 0.1)
  if (shots.length) tl.from(shots, { autoAlpha: 0, y: 12, stagger: 0.1, duration: 0.32, ease, immediateRender: true }, posterAt + 0.16)
  return posterAt + 0.55 - step
}

function playEducation(tl: gsap.core.Timeline, scene: HTMLElement, step: number) {
  const ease = 'deliveryGlide'
  const ask = scene.querySelector('[data-beat="ask"]')
  const faq = scene.querySelector('[data-beat="faq"]')
  const members = scene.querySelector('[data-beat="members"]')
  const path = scene.querySelector('[data-beat="path"]')
  const question = scene.querySelector('[data-question]')
  const answer = scene.querySelector('[data-answer]')
  const cards = scene.querySelectorAll('[data-member]')
  const channels = scene.querySelectorAll('[data-channel]')
  const scopes = scene.querySelectorAll('[data-beat="path"] [data-scope]')
  const layers = [ask, faq, members, path]
  gsap.set(layers, { autoAlpha: 0 })
  layers.forEach((layer) => {
    if (layer) tl.set(layer, { autoAlpha: 0 }, 0)
  })
  if (ask) tl.to(ask, { autoAlpha: 1, duration: 0.26, ease }, step)
  if (question) tl.from(question, { autoAlpha: 0, y: 12, duration: 0.3, ease, immediateRender: true }, step + 0.08)
  const faqAt = step + 1.15
  if (ask) tl.to(ask, { autoAlpha: 0, duration: 0.24, ease }, faqAt)
  if (faq) tl.to(faq, { autoAlpha: 1, duration: 0.26, ease }, faqAt + 0.08)
  if (answer) tl.from(answer, { autoAlpha: 0, y: 10, duration: 0.28, ease, immediateRender: true }, faqAt + 0.14)
  const memberAt = faqAt + 1.15
  if (faq) tl.to(faq, { autoAlpha: 0, duration: 0.24, ease }, memberAt)
  if (members) tl.to(members, { autoAlpha: 1, duration: 0.26, ease }, memberAt + 0.08)
  if (cards.length) tl.from(cards, { autoAlpha: 0, y: 10, stagger: 0.16, duration: 0.28, ease, immediateRender: true }, memberAt + 0.14)
  const pathAt = memberAt + 1.2
  if (members) tl.to(members, { autoAlpha: 0, duration: 0.24, ease }, pathAt)
  if (path) tl.to(path, { autoAlpha: 1, duration: 0.26, ease }, pathAt + 0.08)
  if (channels.length) tl.from(channels, { autoAlpha: 0, y: 8, stagger: 0.1, duration: 0.24, ease, immediateRender: true }, pathAt + 0.14)
  if (scopes.length) tl.from(scopes, { autoAlpha: 0, y: 8, stagger: 0.08, duration: 0.24, ease, immediateRender: true }, pathAt + 0.5)
  return pathAt + 0.55 - step
}

function playMachinery(tl: gsap.core.Timeline, scene: HTMLElement, step: number) {
  const ease = 'deliveryGlide'
  const sides = scene.querySelector('[data-beat="sides"]')
  const english = scene.querySelector('[data-beat="english"]')
  const source = scene.querySelector('[data-source]')
  const questions = scene.querySelector('[data-questions]')
  const ready = scene.querySelectorAll('[data-ready]')
  const held = scene.querySelectorAll('[data-held]')
  gsap.set([sides, english], { autoAlpha: 0 })
  if (sides) tl.set(sides, { autoAlpha: 0 }, 0)
  if (english) tl.set(english, { autoAlpha: 0 }, 0)
  if (sides) tl.to(sides, { autoAlpha: 1, duration: 0.26, ease }, step)
  if (source) tl.from(source, { autoAlpha: 0, x: -18, duration: 0.36, ease, immediateRender: true }, step + 0.08)
  if (questions) tl.from(questions, { autoAlpha: 0, x: 18, duration: 0.36, ease, immediateRender: true }, step + 0.16)
  const pageAt = step + 1.45
  if (sides) tl.to(sides, { autoAlpha: 0, duration: 0.26, ease }, pageAt)
  if (english) tl.to(english, { autoAlpha: 1, duration: 0.28, ease }, pageAt + 0.1)
  if (ready.length) tl.from(ready, { autoAlpha: 0, y: 10, stagger: 0.12, duration: 0.28, ease, immediateRender: true }, pageAt + 0.18)
  if (held.length) tl.from(held, { autoAlpha: 0, y: 8, stagger: 0.1, duration: 0.26, ease, immediateRender: true }, pageAt + 0.48)
  return pageAt + 0.7 - step
}

export default function DeliveryPage({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const locationRef = useRef(location)
  const others = capabilities.filter((entry) => entry.id !== 'delivery')

  const open = (scene: DeliveryScene, index: number) => {
    rememberCapabilityReturn('delivery', index, window.scrollY)
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
        const story = ScrollTrigger.getById('delivery-story')
        if (jump.scroll > 0) window.scrollTo(0, jump.scroll)
        else if (jump.item >= 0 && story?.animation) {
          const scene = document.getElementById(`delivery-scene-${Math.min(jump.item, deliveryScenes.length - 1)}`)
          const time = Number(scene?.getAttribute('data-arrival') ?? 0)
          const duration = story.animation.duration() || 1
          const progress = Math.min(Math.max(time / duration, 0), 1)
          window.scrollTo(0, story.start + (story.end - story.start) * progress)
        } else if (jump.item >= 0) document.getElementById(`delivery-scene-${Math.min(jump.item, deliveryScenes.length - 1)}`)?.scrollIntoView()
        else if (typeof state?.restoreScroll === 'number') window.scrollTo(0, state.restoreScroll)
        if (new URLSearchParams(window.location.search).has('item')) window.history.replaceState(null, '', '/skills/delivery')
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
          const copy = frame.closest('[data-delivery="scene"]')?.querySelector('.insight-scene-copy')
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
        const scenes = [...root.querySelectorAll<HTMLElement>('[data-delivery="scene"]')]
        const deck = root.querySelector<HTMLElement>('[data-deck]')

        const placeBlock = (timeline: gsap.core.Timeline, el: Element | null, at: number, slot: number) => {
          if (!el) return at + slot
          timeline.from(el, { y: 18, autoAlpha: 0, duration: slot, ease: 'deliveryGlide', immediateRender: true }, at)
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
            if (panel) tl.from(panel, { autoAlpha: 0, y: 20, duration: 0.32, ease: 'deliveryGlide', immediateRender: true }, visualAt)
            if (project) tl.from(project, { autoAlpha: 0, y: 16, duration: 0.36, ease: 'deliveryGlide', immediateRender: true }, visualAt + 0.08)
            if (frame) tl.from(frame, { clipPath: 'inset(38% 5% 38% 5%)', duration: 0.46, ease: 'deliveryGlide', immediateRender: true }, visualAt + 0.08)
            placeBlock(tl, scene.querySelector('[data-step="approach-label"]'), visualAt, 0.3)
            placeBlock(tl, scene.querySelector('[data-step="approach"]'), visualAt + 0.06, 0.4)
            const used = scene.dataset.scene === 'building' ? playBuilding(tl, scene, visualAt) : scene.dataset.scene === 'education' ? playEducation(tl, scene, visualAt) : playMachinery(tl, scene, visualAt)
            const resultAt = visualAt + used
            placeBlock(tl, scene.querySelector('[data-step="result-label"]'), resultAt, 0.3)
            placeBlock(tl, scene.querySelector('[data-step="result"]'), resultAt + 0.06, 0.4)
            step = resultAt + 0.55
            scene.setAttribute('data-arrival', String(step))
            tl.addLabel(`hold-${scene.dataset.scene}`, step)
            step += 0.55
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
            id: 'delivery-story',
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
                ease: 'deliveryGlide',
                scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 70%', scrub: true },
              })
            })
          })
          gsap.from('.insight-close h2, .insight-close p', {
            y: 32,
            autoAlpha: 0,
            stagger: 0.2,
            ease: 'deliveryGlide',
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
          <section className="insight-open insight-sheet" data-delivery="entrance" data-sheet="hero" aria-label={deliveryHero.title} style={{ zIndex: 1 }}>
            <div className="insight-dim" data-dim aria-hidden="true" />
            <div className="insight-open-stage insight-sheet-body" data-stage data-sheet-body>
              <div className="insight-open-copy">
                <h1 style={{ fontFamily: serif }}>{deliveryHero.title}</h1>
                <p className="insight-lead">{deliveryHero.lead}</p>
                <p>{deliveryHero.body}</p>
              </div>
              <img className="insight-person" src={delivery.image} alt="" />
              <p className="insight-cue">向下滚动</p>
            </div>
          </section>

          {deliveryScenes.map((scene, index) => (
            <SceneBlock key={scene.id} scene={scene} index={index} onOpen={() => open(scene, index)} />
          ))}

          <section className="insight-close insight-sheet" data-delivery="close" data-sheet="close" style={{ zIndex: 6 }}>
            <div className="insight-dim" data-dim aria-hidden="true" />
            <div className="insight-sheet-body" data-sheet-body>
              <h2 style={{ fontFamily: serif }}>
                {deliveryClose.title.split('\n').map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p>
                {deliveryClose.body.split('\n').map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <p>{deliveryClose.next}</p>
            </div>
          </section>
        </div>

        {reduced ? (
          <section className="insight-others" data-delivery="others" aria-label="其他能力">
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
          <section className="cap-stack" data-delivery="others" data-stack aria-label="其他能力">
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
