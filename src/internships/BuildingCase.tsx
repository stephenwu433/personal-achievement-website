import { useRef } from 'react'
import CountUp from './CountUp'
import { useInternshipMotion } from './reveal'

type Slot = {
  title: string
  hint: string
  image?: string
}

type Evidence = {
  kicker: string
  title: string[]
  lines: string[]
  steps?: string[]
}

type Module = {
  index: string
  title: string
  lines: string[]
  output?: string[]
  slots?: Slot[]
  cards?: Evidence[]
  notes?: { title: string; lines: string[] }[]
  list?: boolean
}

const results = [
  { value: '已脱敏', unit: '条/周', label: '发布频率' },
  { value: '已脱敏', unit: '条', label: '海外推广视频' },
  { value: '已脱敏', unit: '篇', label: '英文推文' },
  { value: '已脱敏', unit: '张', label: '视觉海报' },
  { value: '已脱敏', unit: '', label: '内容触达' },
  { value: '已脱敏', unit: '套', label: '内容模板' },
]

const resourceUses = ['展位', '官网', '媒体', '商务配对', '观众邀约']

const resourceActions = [
  { when: '立即', name: '商务配对报名', channel: '参展商入口', status: '可办理', pending: false },
  { when: '本周', name: '待确认事项', channel: '主办方沟通', status: '待确认', pending: true },
  { when: '展前', name: '英文稿', channel: '展前安排', status: '可准备素材', pending: false },
  { when: '展前', name: '产品图', channel: '展前安排', status: '可准备素材', pending: false },
  { when: '展前', name: '邀请物料', channel: '展前安排', status: '可准备素材', pending: false },
]

const modules: Module[] = [
  {
    index: '01',
    title: '市场与渠道研究',
    lines: ['围绕马来西亚 B2B 建材市场，梳理户外广告、LinkedIn 等触达渠道，', '区分使用场景和传播形式，并把客户沟通整理成一条可以继续跟进的路径。'],
    output: ['市场渠道分析', '客户沟通路径', '海外内容方向'],
    cards: [
      {
        kicker: '研究范围',
        title: ['马来西亚 B2B 建材市场'],
        lines: ['梳理户外广告、LinkedIn', '等海外客户触达渠道，', '明确不同渠道的使用场景', '与传播形式。'],
      },
      {
        kicker: '关键判断',
        title: ['LinkedIn 建立认知'],
        lines: ['海外客户触达被拆成一条可执行的路径。'],
        steps: ['专业内容建立信任', '站内沟通', '样品 / 验厂跟进'],
      },
      {
        kicker: '工作产出',
        title: ['形成市场策略资料包'],
        lines: ['输出市场渠道分析、客户沟通路径', '和海外内容方向，', '为后续展会传播、产品介绍', '和客户沟通提供统一参考。'],
      },
    ],
  },
  {
    index: '02',
    title: '展会筹备',
    lines: ['围绕 海外行业展会，把展位、官网、媒体、商务配对和观众邀约按用途整理，', '写明领取渠道和时间节点。不能直接确认的事项单独列出，再按立即、本周、展前安排优先级。'],
    output: ['展会资源清单', '待确认事项', '展前行动计划', '展会英文邀请物料'],
    list: true,
  },
  {
    index: '03',
    title: '海外内容交付',
    lines: ['参与英文推文、推广视频和邀请海报的策划与交付，', '把企业、产品和展会信息写成适合海外受众阅读的内容，支持展前宣传和海外客户触达。'],
    output: ['英文推文', '推广视频', '海外主题海报', '海外行业展会 邀请海报'],
    slots: [
      { title: '香港澳门主题海报', hint: '原海报含企业标识，公开版仅展示说明' },
      { title: '海外行业展会邀请海报', hint: '原海报含企业标识，公开版仅展示说明' },
    ],
    notes: [
      {
        title: '海报 1 · 香港澳门主题内容',
        lines: ['围绕香港与澳门的建筑、城市和商业场景，', '提炼区域传播主题，将城市语境与建材企业 A海外业务结合，', '形成英文视觉内容。参与策划与制作。'],
      },
      {
        title: '海报 2 · 海外行业展会 展会邀请',
        lines: ['围绕海外客户邀约与展会传播需求，', '将展会时间、地点、展位和品牌信息转化为英文视觉物料。', '参与策划与制作。'],
      },
    ],
  },
]

const method = ['市场信息整理', '客户与渠道分析', '展会任务拆解', '英文内容与视觉设计', '传播物料交付']

function ExhibitionList() {
  return (
    <div data-frame className="mt-4 border border-black/15 bg-white/45">
      <div className="border-b border-black/10 px-5 py-5">
        <p className="text-[12px] tracking-[0.18em] text-black/40">海外行业展会</p>
        <p className="mt-2 text-[22px] leading-[1.35]">参展商资源清单</p>
        <p className="mt-3 max-w-[40rem] text-[14px] leading-[1.75] text-black/70">
          31 项资源条目，13 项需继续向主办方确认。这两组数字记录清单范围。
        </p>
      </div>
      <div className="border-b border-black/10 px-5 py-5">
        <p className="text-[12px] tracking-[0.18em] text-black/40">按用途</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {resourceUses.map((name) => (
            <li key={name} className="border border-black/15 px-3 py-1 text-[14px]">
              {name}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-5 py-5">
        <p className="text-[12px] tracking-[0.18em] text-black/40">行动清单</p>
        <p className="mt-2 max-w-[42rem] text-[13px] leading-[1.7] text-black/55">
          按立即、本周、展前排列。下表列出已写明领取渠道和时间要求的行动类型。
        </p>
        <div className="mt-4 hidden border-t border-black/10 pt-3 text-[12px] tracking-[0.08em] text-black/40 sm:grid sm:grid-cols-[4.5rem_minmax(0,1.4fr)_minmax(0,1fr)_6.5rem]">
          <span>时间</span>
          <span>事项</span>
          <span>领取渠道</span>
          <span>确认状态</span>
        </div>
        <ul>
          {resourceActions.map((item) => (
            <li key={item.name} className="grid gap-1 border-t border-black/10 py-3 sm:grid-cols-[4.5rem_minmax(0,1.4fr)_minmax(0,1fr)_6.5rem] sm:items-center">
              <span className="text-[13px] text-black/45">{item.when}</span>
              <span className="text-[15px]">{item.name}</span>
              <span className="text-[13px] text-black/55">{item.channel}</span>
              <span className={item.pending ? 'w-fit border border-black/50 px-2 py-0.5 text-[13px]' : 'text-[13px] text-black/55'}>{item.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function BuildingCase() {
  const rootRef = useRef<HTMLDivElement>(null)
  useInternshipMotion(rootRef)

  return (
    <div ref={rootRef} id="building-case" className="relative">
      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-8 pt-20 pb-4">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">可量化成果</p>
        <p data-rise className="mt-4 max-w-[40rem] text-[16px] leading-[1.75]">
          <span className="block">内容发布频率提升，并完成视频、推文、海报与可复用模板。</span>
          <span className="block">数字来自简历中已写明的交付记录。</span>
        </p>
        <ul className="mt-8 grid grid-cols-2 border border-black/15 sm:grid-cols-3 lg:grid-cols-6">
          {results.map((item) => (
            <li key={item.label} data-frame className="min-w-0 px-4 py-5 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-black/10">
              <p data-count className="text-[clamp(22px,1.8vw,28px)] leading-none"><CountUp value={item.value} /></p>
              <p className="mt-2 h-4 text-[12px] tracking-[0.04em] text-black/45">{item.unit}</p>
              <p className="mt-2 text-[13px] leading-[1.45] text-black/55">{item.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section data-reveal-block className="mx-auto w-full max-w-[860px] px-8 pt-12 pb-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">一、项目概述</p>
        <div className="mt-4 overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            <span className="block">在建材企业 A海外市场团队实习期间，参与马来西亚市场渠道研究、海外行业展会 展会传播准备及海外内容制作。</span>
            <span className="block">梳理展会资源、领取方式和关键时间节点，形成执行清单；参与英文推文、推广视频和邀请海报的策划与交付，支持展前宣传和海外客户触达。</span>
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1080px] px-8 pt-16">
        <p className="text-[12px] tracking-[0.28em] text-black/45">二、工作模块</p>
      </section>

      {modules.map((item) => (
        <article id={item.index === '02' ? 'industry-exhibition' : undefined} key={item.index} data-reveal-block className="mx-auto w-full max-w-[1080px] px-8 py-12">
          <p data-rise className="text-[12px] tracking-[0.22em] text-black/40">{item.index}</p>
          <div className="mt-3 overflow-hidden">
            <h3 data-title className="text-[clamp(32px,2.8vw,44px)] leading-[1.25] font-normal">
              {item.title}
            </h3>
          </div>
          <div className="mt-5">
            <p data-rise className="text-[12px] tracking-[0.18em] text-black/40">任务</p>
            {item.lines.map((line) => (
              <p key={line} data-rise className="text-[16px] leading-[1.75]">
                {line}
              </p>
            ))}
            {item.output ? (
              <>
                <p data-rise className="mt-4 text-[12px] tracking-[0.18em] text-black/40">产出</p>
                <p data-rise className="mt-1 text-[15px] leading-[1.7]">{item.output.join(' · ')}</p>
              </>
            ) : null}
          </div>
          {item.cards || item.list || item.slots ? (
            <p data-rise className="mt-8 text-[12px] tracking-[0.18em] text-black/40">资料</p>
          ) : null}
          {item.cards ? (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {item.cards.map((card) => (
                <div key={card.kicker} data-frame className="border border-black/15 bg-white/45 px-5 py-6">
                  <p className="text-[12px] tracking-[0.18em] text-black/40">{card.kicker}</p>
                  <p className="mt-3 text-[18px] leading-[1.45]">
                    {card.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                  {card.lines.map((line) => (
                    <p key={line} className="mt-3 text-[14px] leading-[1.7] text-black/65">
                      {line}
                    </p>
                  ))}
                  {card.steps ? (
                    <ol className="mt-4 space-y-2">
                      {card.steps.map((step, index) => (
                        <li key={step} className="text-[14px] leading-[1.55]">
                          <span className="mr-2 text-black/35">0{index + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {item.list ? <ExhibitionList /> : null}
          {item.slots?.some((slot) => slot.image) ? (
            <div className="mt-4 grid max-w-[760px] grid-cols-2 gap-5">
              {item.slots.filter((slot) => slot.image).map((slot) => (
                <figure key={slot.title} data-frame className="min-w-0">
                  <div className="flex aspect-[3/4] items-center justify-center overflow-hidden border border-black/15 bg-white/45">
                    <img src={slot.image} alt={slot.title} className="h-full w-full object-contain" />
                  </div>
                  <figcaption className="mt-3 text-[15px] leading-[1.4]">{slot.title}</figcaption>
                </figure>
              ))}
            </div>
          ) : null}
          {item.notes ? (
            <div className="mt-6 grid gap-x-12 gap-y-4 md:grid-cols-2">
              {item.notes.map((note) => (
                <p key={note.title} data-rise className="text-[13px] leading-[1.7] text-black/60">
                  <span className="block text-[#1c1c1c]">{note.title}</span>
                  {note.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          ) : null}
        </article>
      ))}

      <section data-reveal-block className="mx-auto w-full max-w-[860px] px-8 pt-20 pb-6">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">三、我的工作方式</p>
        <div className="mt-4 overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            <span className="block">先梳理市场与客户信息，再拆解展会和传播任务，</span>
            <span className="block">最后通过英文文案、视觉物料和资料整理完成内容交付。</span>
          </p>
        </div>
        <ol className="mt-8 space-y-3">
          {method.map((step, index) => (
            <li key={step} data-rise className="grid grid-cols-[2.5rem_1fr] gap-3 text-[15px] leading-[1.7]">
              <span className="text-black/40">0{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

    </div>
  )
}
