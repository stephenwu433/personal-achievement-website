import { useRef } from 'react'
import CountUp from './CountUp'
import { useInternshipMotion } from './reveal'

/**
 * 公开版不披露咨询、报名、反馈、渠道和候选人的具体数量。
 * 沿用简历记录，未重新核验后台统计。
 * 报名不是付费课程订单，筛选候选人也不等于完成培训。
 */
const groups = [
  {
    label: '业务结果',
    items: [
      { value: '已脱敏', title: '有效咨询', note: '配合校园内容分发与咨询承接获得' },
      { value: '已脱敏', title: '报名', note: '活动与课程相关报名' },
    ],
  },
  {
    label: '工作产出',
    items: [
      { value: '已脱敏', title: '咨询与活动反馈', note: '用于归纳学生需求' },
      { value: '已脱敏', title: '高频问题', note: '整理为 FAQ、话术与培训内容' },
    ],
  },
]

const methodSteps = ['咨询反馈', '高频问题', 'FAQ／话术／培训材料']

const kept = ['渠道联系资料', '学生问题分类', 'FAQ', '咨询话术', '校园大使工作手册', '培训材料']

type Work = {
  id?: string
  index: string
  section: string
  title: string
  paragraphs: string[]
  deliverables: string[]
  purpose?: string
  method?: boolean
}

const works: Work[] = [
  {
    index: '01',
    section: '校园推广',
    title: '根据校园场景组织推广，让信息找到相关学生',
    paragraphs: [
      '结合合作院校特点，参与设计宣传活动与参与奖励机制，通过学生组织对接、校园社群和线下活动开展推广。',
      '针对讲座、比赛、招聘宣讲和课程推广等不同内容，配合团队完成校园渠道联系与信息分发。渠道工作的落点是让学生接触到与当前需求相关的信息，并能进一步发起咨询。',
    ],
    deliverables: ['对接校园学生组织，整理渠道联系信息。', '在校园社群开展内容分发。', '参与校园活动宣传、学生答疑与现场执行。'],
  },
  {
    id: 'education-service',
    index: '02',
    section: '反馈与答疑标准化',
    title: '从重复出现的问题里，找到需要补充的说明',
    paragraphs: [
      '整理咨询与活动反馈，通过 AI 辅助分类、人工校准，归纳高频问题。',
      '这些反馈用于判断学生在哪些地方仍然不理解、哪些信息需要进一步说明。结合学生的学习与未来规划需求，调整课程介绍和咨询表达，帮助对方判断相关课程是否适合自己。',
      '将归纳结果转为 FAQ、咨询话术和培训材料，使常见问题有可查阅的回答，也让一线经验能够被其他成员使用。',
    ],
    deliverables: ['咨询与活动反馈整理。', '高频问题分类。', 'FAQ、咨询话术与培训材料。'],
    purpose: '将分散在个人沟通中的经验整理出来，为后续答疑提供共同依据，避免团队成员每次都从零组织说明。',
    method: true,
  },
  {
    index: '03',
    section: '校园大使与团队执行',
    title: '把答疑方法交给推广团队，支持多校执行',
    paragraphs: [
      '参与校园大使招募与培训，筛选候选人，整理校园大使工作手册与推广话术模板，支持校园推广工作。',
      '当推广由多名成员共同执行时，仅分发宣传材料还不够。成员还需要理解内容适合哪些学生、常见问题如何回答，以及如何说明后续参与方式。',
      '因此，将整理出的 FAQ 与话术用于团队培训，让学生通过不同成员接触到的信息尽量一致。',
    ],
    deliverables: ['校园大使候选人筛选。', '工作手册与推广话术模板。', '面向团队的培训支持。'],
  },
]

function MethodSketch() {
  return (
    <div data-frame className="mt-6 max-w-[44rem] border border-black/15 bg-white/45 px-5 py-5">
      <p className="text-[12px] tracking-[0.16em] text-black/40">工作方法示意</p>
      <ol className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        {methodSteps.map((step, index) => (
          <li key={step} className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-stretch">
            <div className="flex min-w-0 flex-1 items-center border border-black/10 px-4 py-4">
              <p data-count className="text-[16px] leading-[1.45]"><CountUp value={step} /></p>
            </div>
            {index < methodSteps.length - 1 ? (
              <span className="self-center text-[16px] text-black/35" aria-hidden="true">
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function EducationCase() {
  const rootRef = useRef<HTMLDivElement>(null)
  useInternshipMotion(rootRef)

  return (
    <div ref={rootRef} id="education-case" className="relative">
      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 pt-16 pb-4 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">校园市场推广与学生咨询服务</p>
        <div className="mt-4 max-w-[42rem] overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            <span className="block">围绕 ACCA、CPA、雅思课程及校园活动，参与渠道拓展、内容分发与学生咨询。</span>
            <span className="block">将一线反馈整理成 FAQ、咨询话术和培训材料，让推广团队在触达学生后，能够继续回答实际问题并承接报名。</span>
          </p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {groups.map((group) => (
            <div key={group.label} className="min-w-0">
              <p data-rise className="text-[12px] tracking-[0.18em] text-black/40">{group.label}</p>
              <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item.title} data-frame className="min-w-0 border border-black/15 bg-white/45 px-5 py-6">
                    <p data-count className="text-[clamp(28px,3.2vw,40px)] leading-none"><CountUp value={item.value} /></p>
                    <p className="mt-4 text-[16px] leading-[1.4]">{item.title}</p>
                    <p className="mt-2 text-[13px] leading-[1.55] text-black/55">{item.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 py-14 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">工作背景</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(28px,3vw,40px)] leading-[1.3] font-normal">
            学生看到课程信息后，还需要判断它是否适合自己
          </h3>
        </div>
        <div className="mt-5 max-w-[44rem] text-[16px] leading-[1.8]">
          <p data-rise>校园推广面向的学生并不处于同一个决策阶段：有人刚开始了解证书和课程，有人已经有学习或求职目标，还有人在比较投入与实际用途。</p>
          <p data-rise className="mt-3">因此，推广需要同时解决两个问题：让相关学生看到信息，以及在他们产生兴趣后，回答清楚“这与我的规划有什么关系”。</p>
          <p data-rise className="mt-3">我的工作围绕这两个环节展开，把渠道分发、学生答疑与报名承接连接起来。</p>
        </div>
      </section>

      {works.map((work) => (
        <article id={work.id} key={work.index} data-reveal-block className="mx-auto w-full max-w-[1080px] scroll-mt-20 px-5 py-10 sm:px-8">
          <p data-rise className="text-[12px] tracking-[0.22em] text-black/40">
            {work.index} · {work.section}
          </p>
          <div className="mt-3 overflow-hidden">
            <h3 data-title className="text-[clamp(26px,2.6vw,36px)] leading-[1.3] font-normal">
              {work.title}
            </h3>
          </div>
          <div className="mt-5 max-w-[44rem] text-[16px] leading-[1.8]">
            {work.paragraphs.map((paragraph) => (
              <p key={paragraph} data-rise className="mt-3 first:mt-0">
                {paragraph}
              </p>
            ))}
          </div>
          {work.method ? <MethodSketch /> : null}
          <div className="mt-5 max-w-[44rem]">
            <p data-rise className="text-[12px] tracking-[0.16em] text-black/40">实际工作与交付</p>
            <ul className="mt-2 space-y-1.5">
              {work.deliverables.map((item) => (
                <li key={item} data-rise className="grid grid-cols-[1rem_minmax(0,1fr)] gap-2 text-[15px] leading-[1.7]">
                  <span className="text-black/35">·</span>
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
            {work.purpose ? (
              <p data-rise className="mt-4 text-[15px] leading-[1.75]">
                <span className="mr-2 text-[12px] tracking-[0.16em] text-black/40">作用</span>
                {work.purpose}
              </p>
            ) : null}
          </div>
        </article>
      ))}

      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 pt-10 pb-6 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">结果与交付</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(28px,3vw,40px)] leading-[1.3] font-normal">触达之后，继续承接咨询与报名</h3>
        </div>
        <div className="mt-5 max-w-[44rem] text-[16px] leading-[1.8]">
          <p data-rise>配合团队的校园分发、活动执行与咨询服务，承接学生咨询与活动报名。具体业务数字已脱敏。</p>
          <p data-rise className="mt-3">渠道拓展让信息进入校园；学生反馈帮助调整说明；FAQ 与培训材料让这些调整能够被团队重复使用。几项工作共同服务于从了解信息到参与活动或报名的过程。</p>
        </div>
        <div className="mt-8 max-w-[44rem]">
          <p data-rise className="text-[12px] tracking-[0.16em] text-black/40">留下的交付</p>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {kept.map((item) => (
              <li key={item} data-rise className="min-w-0 border border-black/15 bg-white/45 px-4 py-3 text-[15px] leading-[1.5]">
                {item}
              </li>
            ))}
          </ul>
          <p data-rise className="mt-4 text-[15px] leading-[1.75]">
            这些材料让后续推广能够沿用已有渠道和答疑经验，也为继续收集反馈、修改说明提供了基础。
          </p>
        </div>
      </section>
    </div>
  )
}
