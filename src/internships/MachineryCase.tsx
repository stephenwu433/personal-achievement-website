import { useRef } from 'react'
import CountUp from './CountUp'
import { useInternshipMotion } from './reveal'

/**
 * 英文邀约、英文产品资料、客户反馈与潜在需求；数量不在公开版披露。
 * 公开版仅描述工作类型，不披露其他简历版本中的企业名称或数量。
 * 邀约、资料与反馈均不等同于到场、独立开发或成交客户。
 */
const results = [
  { value: '已脱敏', title: '英文客户邀约', note: '支持展前客户联系与参展推广' },
  { value: '已脱敏', title: '英文产品资料', note: '整理产品信息、技术参数与介绍材料' },
  { value: '已脱敏', title: '客户反馈与需求', note: '汇总展会相关客户意见和潜在需求' },
]

type Work = {
  id?: string
  index: string
  section: string
  title: string
  paragraphs: string[]
  deliverables: string[]
  result: string
}

const works: Work[] = [
  {
    index: '01',
    section: '展会与设备运输协调',
    title: '确认展位和运输安排，让筹备有明确依据',
    paragraphs: [
      '通过英文邮件与海外合作基地沟通，协助确认展会规模、参展细节与宣传摊位安排，完成宣传摊位预订。',
      '围绕参展设备与物资，核对清单、协调运输车辆数量，并明确展前与展后的设备运输位置及合作基地的时间节点。',
      '设备运输不能只确认“是否安排了车辆”，还需要把运输对象、地点和时间对应起来。这些确认信息为国内团队安排后续准备提供了依据。',
    ],
    deliverables: ['海外合作基地英文沟通记录。', '宣传摊位预订与参展事项确认。', '设备及物资清单核对。', '展前、展后运输地点与时间节点确认。'],
    result: '将展位、设备与运输事项落实为明确安排，支持展会基础筹备有序推进。',
  },
  {
    index: '02',
    section: '参展人员行程与出行材料',
    title: '把人员时间与展会安排对齐',
    paragraphs: [
      '核对参展人员名单及可参与时间，据此完成机票预订与展会周边 Airbnb 住宿安排。',
      '同时，将参展注意事项整理成 PPT，供团队查看和使用。人员安排与展会日程同步准备，让参展成员能够提前了解出行和现场需要注意的事项。',
    ],
    deliverables: ['参展人员名单与时间核对。', '机票预订和住宿安排。', '参展注意事项 PPT。'],
    result: '完成团队出行准备，并将参展注意事项集中呈现，供成员统一查阅。',
  },
  {
    id: 'machinery-english',
    index: '03',
    section: '英文产品资料与现场介绍',
    title: '将内部产品信息整理为海外客户可使用的介绍材料',
    paragraphs: [
      '整理并翻译石材切割机宣传手册、产品优势和客户分布信息，协助准备英文技术参数及产品介绍资料。',
      '在表达上，将设备名称、技术信息和产品优势对应清楚，使现场人员介绍产品时有资料可参考，客户也能通过英文材料了解企业与设备。',
      '完成的公司介绍材料打印后用于展会现场，支持产品展示和国际客户沟通。',
    ],
    deliverables: ['英文产品介绍资料。', '石材切割机宣传手册翻译。', '产品优势与客户分布英文介绍。', '展会现场使用的公司介绍材料。'],
    result: '将中文产品信息转成可对外使用的英文资料，并用于展会现场介绍。',
  },
  {
    index: '04',
    section: '客户邀约与反馈整理',
    title: '在展前建立联系，在展会沟通后留下需求信息',
    paragraphs: [
      '协助撰写英文客户邀约邮件，支持展前客户联系与参展推广。',
      '围绕展会客户沟通，收集和整理客户反馈与潜在需求，为团队了解客户关注点及后续跟进提供信息参考。',
    ],
    deliverables: ['英文邀约邮件。', '客户反馈与潜在需求记录。'],
    result: '支持展前客户触达，并将客户沟通中出现的需求保留下来，供后续产品介绍和业务跟进参考。',
  },
]

export default function MachineryCase() {
  const rootRef = useRef<HTMLDivElement>(null)
  useInternshipMotion(rootRef)

  return (
    <div ref={rootRef} id="machinery-case" className="relative">
      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 pt-16 pb-4 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">海外石材展会 国际石材展筹备与海外产品沟通</p>
        <div className="mt-4 max-w-[42rem] overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            <span className="block">参与意大利 海外石材展会 展会筹备，协助对接海外合作基地，落实设备运输、参展人员行程和现场材料准备。</span>
            <span className="block">整理石材机械产品信息并完成英文转译，为客户邀约和展会现场介绍提供支持。</span>
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {results.map((item) => (
            <li key={item.title} data-frame className="flex min-w-0 flex-col border border-black/15 bg-white/45 px-5 py-6">
              <p data-count className="text-[clamp(28px,3.2vw,40px)] leading-none"><CountUp value={item.value} /></p>
              <p className="mt-4 text-[16px] leading-[1.4]">{item.title}</p>
              <p className="mt-2 text-[13px] leading-[1.55] text-black/55">{item.note}</p>
            </li>
          ))}
        </ul>
        <p data-rise className="mt-5 max-w-[42rem] text-[15px] leading-[1.75]">
          完成宣传摊位预订、参展行程安排与注意事项 PPT；英文介绍材料打印后用于展会现场。
        </p>
      </section>

      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 py-14 sm:px-8">
        <p data-rise className="text-[12px] tracking-[0.28em] text-black/45">工作背景</p>
        <div className="mt-3 overflow-hidden">
          <h3 data-title className="text-[clamp(28px,3vw,40px)] leading-[1.3] font-normal">
            海外参展，需要把设备、人员和资料准备到同一个时间点
          </h3>
        </div>
        <div className="mt-5 max-w-[44rem] text-[16px] leading-[1.8]">
          <p data-rise>工业设备企业 C面向海外市场展示石材机械设备。参展准备涉及国内团队、海外合作基地和运输安排，不同环节的信息需要提前确认：设备送到哪里、什么时候运输、哪些人员参加、现场使用什么资料。</p>
          <p data-rise className="mt-3">我主要承担展会信息对接、出行安排和英文材料准备，将分散的筹备事项落实到具体安排，支持团队开展现场展示与客户沟通。</p>
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
          <div className="mt-5 max-w-[44rem]">
            <p data-rise className="text-[12px] tracking-[0.16em] text-black/40">实际交付</p>
            <ul className="mt-2 space-y-1.5">
              {work.deliverables.map((item) => (
                <li key={item} data-rise className="grid grid-cols-[1rem_minmax(0,1fr)] gap-2 text-[15px] leading-[1.7]">
                  <span className="text-black/35">·</span>
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
            <p data-rise className="mt-4 text-[15px] leading-[1.75]">
              <span className="mr-2 text-[12px] tracking-[0.16em] text-black/40">结果</span>
              {work.result}
            </p>
          </div>
        </article>
      ))}

      <section data-reveal-block className="mx-auto w-full max-w-[1080px] px-5 pt-8 pb-6 sm:px-8">
        <div className="max-w-[42rem] overflow-hidden">
          <p data-title className="text-[18px] leading-[1.85]">
            这段实习的交付落实在参展准备和客户沟通的具体环节：确认设备运输安排，准备人员行程，完成英文资料，并整理客户反馈，让团队能够带着明确的信息开展海外展示。
          </p>
        </div>
      </section>
    </div>
  )
}
