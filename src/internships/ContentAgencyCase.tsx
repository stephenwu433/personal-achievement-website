import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import CountUp from './CountUp'
import { useInternshipMotion } from './reveal'

const results = [
  { project: '服饰品牌', value: '已脱敏', title: '服饰品牌项目 ROI', note: '三个周期内的项目整体变化' },
  { project: '服饰品牌', value: '已脱敏', title: '团队内容产出效率', note: '统一 Brief、达人筛选与内容审核规范' },
  { project: '压缩沙发', value: '已脱敏', title: '海外账号累计播放', note: '压缩沙发项目阶段累计' },
  { project: '压缩沙发', value: '已脱敏', title: '海外潜在客户线索', note: '相关内容带来的咨询与询盘' },
]

const stages = [
  {
    when: '前期',
    title: '确定内容要说给谁',
    body: '结合用户需求、竞品表达和产品特点，拆出不同人群的购买关注点，形成选题方向和内容 Brief。',
  },
  {
    when: '执行中',
    title: '把方向变成可以交付的内容',
    body: '制定达人筛选标准、拍摄与文案要求，设计中英文脚本结构，并用 AI 辅助生成和整理，人工校对产品事实与表达。',
  },
  {
    when: '发布后',
    title: '判断下一轮应该改什么',
    body: '结合点击、转化、播放和询盘反馈，区分人群不匹配、内容吸引力不足与承接不顺畅等问题，再调整 Brief、内容和投放建议。',
  },
]

const briefPoints = [
  '这篇内容主要面向谁。',
  '要回应哪一个穿着问题。',
  '用什么画面证明产品价值。',
  '标题、正文和互动引导围绕哪个重点展开。',
]

const personaExamples = [
  '身材线条方向需要展示上身效果和版型差异。',
  '通勤方向更关注搭配与跨场景使用。',
  '轻运动方向则需要真实动作和穿着体验。',
]

const sofaShots = [
  {
    src: '/projects/sofa.webp',
    title: '内容场景示意',
    caption: '原账号截图含身份与业务数据，公开版仅展示场景示意。',
  },
]

const sofaStats = [
  { value: '已脱敏', label: '支持生产的短视频脚本' },
  { value: '已脱敏', label: '沉淀的可复用模板' },
  { value: '已脱敏', label: '复盘后平均播放量' },
  { value: '已脱敏', label: '高意向客资' },
]

function Points({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map((item) => (
        <li key={item} data-rise className="grid grid-cols-[1rem_minmax(0,1fr)] gap-2 text-[16px] leading-[1.75]">
          <span className="text-black/35">·</span>
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Deliverable({ text }: { text: string }) {
  return (
    <p data-rise className="mt-5 text-[15px] leading-[1.7]">
      <span className="mr-2 text-[12px] tracking-[0.16em] text-black/40">交付内容</span>
      {text}
    </p>
  )
}

function RoiBars() {
  const marks = [
    { label: '优化前', value: '已脱敏', ratio: 1.2 / 3 },
    { label: '优化后', value: '已脱敏', ratio: 1 },
  ]
  return (
    <div data-frame className="mt-6 max-w-[26rem] border border-black/15 bg-white/45 px-5 py-5" role="img" aria-label="服饰品牌项目 ROI，优化前 1.2，优化后 3.0">
      <p className="text-[12px] tracking-[0.18em] text-black/40">服饰品牌 · 项目整体 ROI</p>
      <p className="mt-2 text-[14px] leading-[1.65] text-black/60">三个周期。两根柱使用同一尺度。</p>
      <div className="mt-6 flex items-end gap-8">
        {marks.map((mark) => (
          <div key={mark.label} className="w-24">
            <p data-count className="mb-2 text-center text-[20px] leading-none"><CountUp value={mark.value} /></p>
            <div className="flex h-40 items-end bg-black/[0.06]">
              <div className="intern-bar w-full bg-[#1c1c1c]" style={{ height: `${mark.ratio * 100}%` }} />
            </div>
            <p className="mt-2 text-center text-[13px] text-black/55">{mark.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecordPair() {
  const records = [
    { kicker: '内容交付', value: '已脱敏', label: '内容生产与达人分发' },
    { kicker: '投放记录', value: '已脱敏', label: '有效投放记录' },
  ]
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {records.map((record) => (
        <div key={record.kicker} data-frame className="min-w-0 border border-black/15 bg-white/45 px-5 py-5">
          <p className="text-[12px] tracking-[0.16em] text-black/40">{record.kicker}</p>
          <p data-count className="mt-3 text-[clamp(28px,3vw,36px)] leading-none"><CountUp value={record.value} /></p>
          <p className="mt-3 text-[14px] leading-[1.55]">{record.label}</p>
          <p className="mt-1 text-[12px] text-black/45">首轮项目记录</p>
        </div>
      ))}
    </div>
  )
}

function MaterialCard({ title, summary, children }: { title: string; summary: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div data-frame className="min-w-0 border border-black/15 bg-white/45">
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="block w-full px-5 py-5 text-left">
        <p className="text-[18px] leading-[1.4]">{title}</p>
        <p className="mt-2 text-[14px] leading-[1.7] text-black/60">{summary}</p>
        <p className="mt-4 text-[12px] tracking-[0.16em] text-black/45">{open ? '收起' : '查看'}</p>
      </button>
      {open ? <div className="border-t border-black/10 px-5 py-5">{children}</div> : null}
    </div>
  )
}

function AccountShots({ onOpen }: { onOpen: (index: number) => void }) {
  return (
    <ol className="grid grid-cols-2 gap-3">
      {sofaShots.map((shot, index) => (
        <li key={shot.src} className="min-w-0">
          <button type="button" onClick={() => onOpen(index)} className="block w-full border border-black/15 bg-white/70 p-3 text-left">
            <p className="text-[12px] tracking-[0.12em] text-black/45">
              0{index + 1} / {shot.title}
            </p>
            <img src={shot.src} alt={shot.title} className="mt-3 max-h-52 w-full bg-black/[0.04] object-contain" />
            <p className="mt-2 text-[13px] leading-[1.55] text-black/60">{shot.caption}</p>
          </button>
        </li>
      ))}
    </ol>
  )
}

function ShotLightbox({ index, onClose, onChange }: { index: number; onClose: () => void; onChange: (next: number) => void }) {
  const shot = sofaShots[index]
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onChange((index + 1) % sofaShots.length)
      if (event.key === 'ArrowLeft') onChange((index + sofaShots.length - 1) % sofaShots.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, onClose, onChange])

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={shot.title}>
      <div className="flex max-h-full w-full max-w-5xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
        <p className="mb-3 text-[12px] tracking-[0.16em] text-white">
          {shot.title} · {index + 1} / {sofaShots.length}
        </p>
        <img src={shot.src} alt={shot.title} className="max-h-[78vh] max-w-full object-contain" />
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[14px] text-white">
          <button type="button" className="px-3 py-2" onClick={() => onChange((index + sofaShots.length - 1) % sofaShots.length)}>
            上一张
          </button>
          <button type="button" className="border border-white/50 px-4 py-2" onClick={onClose}>
            关闭
          </button>
          <button type="button" className="px-3 py-2" onClick={() => onChange((index + 1) % sofaShots.length)}>
            下一张
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ContentAgencyCase() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [preview, setPreview] = useState<number | null>(null)
  const closePreview = useCallback(() => setPreview(null), [])
  const changePreview = useCallback((next: number) => setPreview(next), [])
  const locked = preview !== null
  useInternshipMotion(rootRef)

  useEffect(() => {
    if (!locked) return
    const sheet = document.querySelector('[data-internship-sheet]')
    if (!(sheet instanceof HTMLElement)) return
    const previous = sheet.style.overflow
    sheet.style.overflow = 'hidden'
    return () => {
      sheet.style.overflow = previous
    }
  }, [locked])

  return (
    <div ref={rootRef} id="contentagency-case" className="relative">
      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 pt-16 pb-4 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">服饰品牌品牌增长与海外 TikTok 获客</p>
        <div className="mt-4 max-w-[42rem] overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            <span className="block">围绕服饰品牌服饰品牌与海外压缩沙发业务，负责用户研究、内容策略、Brief 与脚本设计，并结合投放表现和询盘反馈持续调整内容。</span>
            <span className="block">将有效的人群方向、表达方式与审核要求整理成可复用的生产规范，支持团队持续交付。</span>
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.map((item) => (
            <li key={item.title} data-frame className="flex min-w-0 flex-col border border-black/15 bg-white/45 px-5 py-6">
              <p className="text-[12px] tracking-[0.16em] text-black/40">{item.project}</p>
              <p data-count className="mt-4 text-[clamp(28px,3.2vw,40px)] leading-none break-words"><CountUp value={item.value} /></p>
              <p className="mt-4 text-[16px] leading-[1.4]">{item.title}</p>
              <p className="mt-2 text-[13px] leading-[1.55] text-black/55">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 py-14 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">工作范围</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(28px,3vw,40px)] leading-[1.3] font-normal">
            从确定内容方向，到跟进实际表现
          </h3>
        </div>
        <p data-rise className="mt-4 text-[16px] leading-[1.75]">我的工作主要覆盖三个环节：</p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {stages.map((stage) => (
            <div key={stage.when} data-frame className="min-w-0 border-t border-black/15 pt-4">
              <p className="text-[12px] tracking-[0.18em] text-black/40">{stage.when}</p>
              <p className="mt-2 text-[18px] leading-[1.45]">{stage.title}</p>
              <p className="mt-3 text-[15px] leading-[1.75] text-black/70">{stage.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="kelifu" data-reveal-block className="mx-auto w-full max-w-[1080px] scroll-mt-20 px-5 pt-6 pb-4 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">重点项目 · 服饰品牌</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(28px,3vw,42px)] leading-[1.3] font-normal">
            把服装卖点转成用户愿意点击、搜索和购买的理由
          </h3>
        </div>
        <div className="mt-5 max-w-[44rem] text-[16px] leading-[1.8]">
          <p data-rise>服饰品牌需要在小红书建立品牌认知，并通过内容种草与投放获得转化。服饰内容不能只重复“好看、显瘦、性价比高”：不同用户为什么需要这件衣服、达人如何展示、用户点击后看到什么，都影响最终表现。</p>
          <p data-rise className="mt-3">我负责把用户研究转成内容方案，并围绕实际投放反馈持续调整。</p>
        </div>
      </section>

      <article data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 py-10 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.22em] text-black/40">01</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(26px,2.6vw,36px)] leading-[1.3] font-normal">
            梳理 7 类人群，让每份 Brief 有明确对象
          </h3>
        </div>
        <div className="mt-5 max-w-[44rem] text-[16px] leading-[1.8]">
          <p data-rise>结合用户需求与竞品内容，梳理 7 类目标用户画像，把人群对应到穿着场景、具体顾虑和产品卖点。</p>
          <p data-rise className="mt-3">例如，身材线条方向需要展示上身效果和版型差异；通勤方向更关注搭配与跨场景使用；轻运动方向则需要真实动作和穿着体验。它们不能共用一套只介绍产品参数的文案。</p>
          <p data-rise className="mt-3">据此形成差异化 Brief，明确：</p>
          <Points items={briefPoints} />
        </div>
        <Deliverable text="用户分层、需求与卖点对应表、选题方向、差异化 Brief。" />
      </article>

      <article data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 py-10 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.22em] text-black/40">02</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(26px,2.6vw,36px)] leading-[1.3] font-normal">
            统一达人筛选与审核要求，减少反复沟通
          </h3>
        </div>
        <div className="mt-5 max-w-[44rem] text-[16px] leading-[1.8]">
          <p data-rise>建立 KOC／KOL 筛选标准，从粉丝画像匹配度、历史互动表现、内容质量和合作成本几个维度判断合作适配性。</p>
          <p data-rise className="mt-3">选定达人后，将核心卖点、必备画面、表达重点和审核要求提前写入 Brief。内容产出后，再检查人群是否明确、产品表达是否准确、图文是否围绕同一个主题。</p>
          <p data-rise className="mt-3">这套标准让策划、达人与审核人员依据同一份要求推进，支持团队内容产出效率提升 50%。</p>
        </div>
        <Deliverable text="达人筛选标准、合作 Brief、内容审核清单。" />
      </article>

      <article data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 py-10 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.22em] text-black/40">03</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(26px,2.6vw,36px)] leading-[1.3] font-normal">
            把内容表现和投放表现放在一起复盘
          </h3>
        </div>
        <div className="mt-5 max-w-[44rem] text-[16px] leading-[1.8]">
          <p data-rise>围绕达人种草、信息流投放和搜索承接安排内容，并结合 CTR、CVR 与 ROI 判断问题发生在哪一环。</p>
          <p data-rise className="mt-3">点击不足时，回看标题、封面和人群相关性；点击后转化不足时，继续检查内容吸引来的人是否合适，以及商品承接是否回应了内容中的购买理由。</p>
          <p data-rise className="mt-3">复盘结果回到具体动作：调整 Brief、优化卖点表达、梳理搜索词，并与投放执行方协同调整素材和人群配置。三个周期内，项目整体 ROI 从 1.2 提升至 3.0。</p>
        </div>
        <RoiBars />
        <Deliverable text="阶段投放方案、素材反馈分析、搜索词分层建议、迭代清单。" />
      </article>

      <article data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 py-10 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.22em] text-black/40">04</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(26px,2.6vw,36px)] leading-[1.3] font-normal">
            一份真实复盘：追查内容有没有得到有效测试
          </h3>
        </div>
        <div className="mt-5 max-w-[44rem] text-[16px] leading-[1.8]">
          <p data-rise>首轮项目复盘记录了：</p>
          <RecordPair />
          <p data-rise className="mt-5">两组记录对照后，发现部分已发布内容没有进入广告测试。仅用已投放素材判断全部内容效果，会遗漏尚未被测试的内容。</p>
          <p data-rise className="mt-3">围绕这一问题，复盘提出共享投放排期与状态确认机制，让品牌、内容团队和投放执行方对齐发布、测试与反馈情况，并建议对优质未投放内容安排补充测试。</p>
        </div>
      </article>

      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 pt-16 pb-4 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">第二个项目 · 海外压缩沙发</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(28px,3vw,42px)] leading-[1.3] font-normal">
            围绕采购顾虑组织内容，把观看引向咨询
          </h3>
        </div>
        <div className="mt-5 max-w-[44rem] text-[16px] leading-[1.8]">
          <p data-rise>海外家具采购商关注的不只是沙发外观，还包括运输与仓储、压缩后的恢复表现、产品组合，以及工厂品质和交付情况。</p>
          <p data-rise className="mt-3">内容需要在有限时长里讲清采购价值，并给出进一步了解产品的入口。我负责将这些问题拆成选题和中英文脚本，再依据播放与询盘反馈迭代。</p>
        </div>
      </section>

      <article data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 py-10 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.22em] text-black/40">01</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(26px,2.6vw,36px)] leading-[1.3] font-normal">
            围绕产品与工厂两类内容，建立脚本结构
          </h3>
        </div>
        <div className="mt-5 max-w-[44rem]">
          <div className="grid gap-3 sm:grid-cols-2">
            <div data-frame className="min-w-0 border border-black/15 bg-white/45 px-5 py-5">
              <p className="text-[12px] tracking-[0.16em] text-black/40">产品介绍</p>
              <p className="mt-3 text-[15px] leading-[1.75]">围绕不同沙发与休闲椅款式，说明产品特点、适合的经营场景和采购关注点。</p>
            </div>
            <div data-frame className="min-w-0 border border-black/15 bg-white/45 px-5 py-5">
              <p className="text-[12px] tracking-[0.16em] text-black/40">工厂介绍</p>
              <p className="mt-3 text-[15px] leading-[1.75]">围绕生产、品质检查、试单与看厂等主题，回应买家对供应商的疑问。</p>
            </div>
          </div>
          <p data-rise className="mt-5 text-[16px] leading-[1.8]">统一采用「钩子吸引 → 场景与价值解释 → 询盘引导」的脚本结构，再根据选题补充工厂身份、产品展示和中英文表达，沉淀可复用模板。</p>
        </div>
        <Deliverable text="选题库、中英文脚本、产品／工厂分类、脚本模板。" />
      </article>

      <article data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 py-10 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.22em] text-black/40">02</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(26px,2.6vw,36px)] leading-[1.3] font-normal">
            用实际反馈修改开头、卖点和咨询入口
          </h3>
        </div>
        <p data-rise className="mt-5 max-w-[44rem] text-[16px] leading-[1.8]">
          发布后结合播放表现与询盘反馈，检查哪些内容能够吸引目标买家、哪些表达仍没有回答采购疑问，再调整脚本钩子、产品卖点与咨询引导。
        </p>
        <div className="mt-5 grid max-w-[44rem] gap-3 sm:grid-cols-2">
          <div data-frame className="min-w-0 border border-black/15 bg-white/45 px-5 py-5">
            <p className="text-[12px] tracking-[0.16em] text-black/40">播放表现</p>
            <p className="mt-3 text-[15px] leading-[1.75]">复盘后继续调整视频开头、产品卖点和询盘入口。具体播放数据已脱敏。</p>
          </div>
          <div data-frame className="min-w-0 border border-black/15 bg-white/45 px-5 py-5">
            <p className="text-[12px] tracking-[0.16em] text-black/40">客户线索</p>
            <p className="mt-3 text-[15px] leading-[1.75]">依据咨询与询盘反馈识别潜在客户，具体线索数据已脱敏。</p>
          </div>
        </div>
        <ul className="mt-4 grid max-w-[44rem] grid-cols-2 gap-3 lg:grid-cols-4">
          {sofaStats.map((item) => (
            <li key={item.label} data-frame className="min-w-0 border border-black/15 px-4 py-4">
              <p data-count className="text-[clamp(22px,2.4vw,28px)] leading-none"><CountUp value={item.value} /></p>
              <p className="mt-3 text-[13px] leading-[1.5]">{item.label}</p>
            </li>
          ))}
        </ul>
      </article>

      <article data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 py-10 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.22em] text-black/40">03</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(26px,2.6vw,36px)] leading-[1.3] font-normal">
            将脚本生产整理为可重复使用的工作流
          </h3>
        </div>
        <div className="mt-5 max-w-[44rem] text-[16px] leading-[1.8]">
          <p data-rise>把产品信息、目标买家、采购顾虑和内容目标作为结构化输入，规定脚本段落、语言要求和咨询引导方式。</p>
          <p data-rise className="mt-3">AI 辅助完成草稿生成，人工检查产品事实、中英文表达与承诺是否准确。根据后续表现更新模板和生成要求，使下一批内容能够沿用已有经验。</p>
        </div>
        <Deliverable text="脚本生成规则、人工检查项、可复用 Skill 与迭代记录。" />
      </article>

      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 pt-16 pb-6 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">可查看的交付</p>
        <div className="mt-8 grid items-start gap-4 md:grid-cols-2">
          <MaterialCard title="人群与内容 Brief" summary="将用户需求对应到卖点、画面与表达要求。">
            <p className="text-[14px] leading-[1.7]">梳理 7 类目标用户画像。例如：</p>
            <Points items={personaExamples} />
            <p className="mt-4 text-[14px] leading-[1.7]">差异化 Brief 写明：</p>
            <Points items={briefPoints} />
            <p className="mt-4 text-[13px] leading-[1.7] text-black/55">交付包括用户分层、需求与卖点对应表、选题方向和差异化 Brief。</p>
          </MaterialCard>
          <MaterialCard title="投放复盘与优化" summary="对照素材表现与投放记录，明确下一轮调整动作。">
            <RecordPair />
            <div className="mt-4 space-y-2 text-[14px] leading-[1.7]">
              <p>部分已发布内容没有进入广告测试。仅用已投放素材判断全部内容效果，会遗漏尚未被测试的内容。</p>
              <p>点击不足时，回看标题、封面和人群相关性。点击后转化不足时，检查内容吸引来的人是否合适，以及商品承接是否回应了内容中的购买理由。</p>
              <p>三个周期内，项目整体 ROI 从 1.2 提升至 3.0。复盘建议对优质未投放内容安排补充测试。</p>
            </div>
          </MaterialCard>
          <MaterialCard title="海外账号表现" summary="查看产品、工厂内容及账号播放记录。">
            <AccountShots onOpen={setPreview} />
          </MaterialCard>
          <MaterialCard title="中英文脚本与规范" summary="查看产品介绍、工厂介绍与询盘引导的具体写法。">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="min-w-0 border border-black/10 px-4 py-4">
                <p className="text-[12px] tracking-[0.14em] text-black/40">产品介绍</p>
                <p className="mt-2 text-[14px] leading-[1.7]">说明产品特点、适合的经营场景和采购关注点。</p>
              </div>
              <div className="min-w-0 border border-black/10 px-4 py-4">
                <p className="text-[12px] tracking-[0.14em] text-black/40">工厂介绍</p>
                <p className="mt-2 text-[14px] leading-[1.7]">围绕生产、品质检查、试单与看厂，回应买家对供应商的疑问。</p>
              </div>
            </div>
            <p className="mt-4 text-[14px] leading-[1.75]">脚本结构：钩子吸引 → 场景与价值解释 → 询盘引导。</p>
            <p className="mt-3 text-[14px] leading-[1.75]">人工检查产品事实、中英文表达与承诺是否准确。输入包括产品信息、目标买家、采购顾虑和内容目标。</p>
          </MaterialCard>
        </div>
        <div className="mt-10 max-w-[42rem] overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            <span className="block">这段实习留下的不只有已发布内容，也包括下一轮可以继续使用的 Brief、脚本模板和复盘规则。</span>
            <span className="block">每次调整都回到实际人群、内容表现和业务反馈，再决定继续投入什么。</span>
          </p>
        </div>
      </section>

      {preview !== null ? <ShotLightbox index={preview} onClose={closePreview} onChange={changePreview} /> : null}
    </div>
  )
}
