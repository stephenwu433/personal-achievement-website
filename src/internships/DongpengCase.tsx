import type { ReactNode } from 'react'

type Slot = {
  title: string
  hint: string
}

type Module = {
  index: string
  title: string
  body: string
  output: string[]
  slots: Slot[]
  notes?: { title: string; body: string }[]
}

const modules: Module[] = [
  {
    index: '01',
    title: '从市场信息中识别客户触达路径',
    body: '围绕马来西亚 B2B 建材市场，梳理户外广告、LinkedIn、WhatsApp 等客户触达渠道，分析不同渠道的使用场景与内容形式，为海外市场传播和客户沟通提供资料支持。',
    output: ['马来西亚市场渠道研究', 'B2B 客户触达路径', '海外内容方向建议'],
    slots: [
      { title: '马来西亚市场渠道分析', hint: '待放入截图' },
      { title: 'LinkedIn / WhatsApp 客户沟通路径', hint: '待放入截图' },
      { title: '内容方向或传播建议', hint: '待放入截图' },
    ],
  },
  {
    index: '02',
    title: '将展会资源转化为可执行的传播计划',
    body: '围绕 ARCHIDEX 2026 展会，梳理展位、官网、媒体、商务配对和观众邀约等传播资源，整理领取渠道、时间节点和行动事项，形成展会传播清单与执行计划。',
    output: ['展会资源清单', '展前行动计划', '媒体与观众邀约信息', '展会英文邀请物料'],
    slots: [
      { title: '文档封面', hint: '待放入截图' },
      { title: '展会资源分类', hint: '待放入截图' },
      { title: 'Action Checklist 行动清单', hint: '待放入截图' },
    ],
  },
  {
    index: '03',
    title: '将产品与业务信息转化为海外传播内容',
    body: '根据不同海外市场和传播节点，参与英文主题提炼、视觉设计和图文物料制作，将企业、产品和展会信息转化为适合海外受众理解和传播的内容。',
    output: ['海外主题海报', 'ARCHIDEX 2026 邀请海报', '英文品牌与产品内容', '海外市场视觉物料'],
    slots: [
      { title: '香港澳门主题海报', hint: '待放入海报' },
      { title: 'ARCHIDEX 2026 邀请海报', hint: '待放入海报' },
      { title: '东鹏陶瓷万能品牌片头方案', hint: '待放入关键页' },
    ],
    notes: [
      {
        title: '海报 1 · 香港澳门主题内容',
        body: '围绕香港与澳门的建筑、城市和商业场景，提炼区域传播主题，将城市语境与东鹏海外业务结合，形成英文视觉内容。参与策划与制作。',
      },
      {
        title: '海报 2 · ARCHIDEX 2026 展会邀请',
        body: '围绕海外客户邀约与展会传播需求，将展会时间、地点、展位和品牌信息转化为英文视觉物料。参与策划与制作。',
      },
    ],
  },
]

const method = ['市场信息整理', '客户与渠道分析', '展会任务拆解', '英文内容与视觉设计', '传播物料交付']

export default function DongpengCase() {
  return (
    <div id="dongpeng-case" className="relative z-10 mx-auto max-w-3xl px-6 pt-6 pb-24">
        <Section index="一" title="项目概述">
          <p className="text-[16px] leading-[1.8]">
            围绕海外市场拓展，负责市场资料整理、展会资源梳理、英文内容策划与视觉物料交付，支持产品和品牌信息在海外市场中的传播与沟通。
          </p>
        </Section>

        <Section index="二" title="工作模块">
          <div className="space-y-14">
            {modules.map((item) => (
              <article key={item.index}>
                <p className="text-[12px] tracking-[0.22em] text-black/45">{item.index}</p>
                <h3 className="mt-2 text-[clamp(22px,2vw,28px)] leading-[1.35] font-normal">{item.title}</h3>
                <p className="mt-4 text-[16px] leading-[1.8]">{item.body}</p>
                <p className="mt-6 text-[12px] tracking-[0.18em] text-black/45">输出</p>
                <ul className="mt-2 space-y-1 text-[15px] leading-[1.7]">
                  {item.output.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {item.slots.map((slot) => (
                    <figure key={slot.title}>
                      <div className="flex aspect-[4/3] items-center justify-center border border-dashed border-black/25 px-3 text-center text-[13px] text-black/40">
                        {slot.hint}
                      </div>
                      <figcaption className="mt-2 text-[13px] leading-[1.45]">{slot.title}</figcaption>
                    </figure>
                  ))}
                </div>
                {item.notes ? (
                  <div className="mt-6 space-y-4">
                    {item.notes.map((note) => (
                      <p key={note.title} className="text-[14px] leading-[1.75] text-black/75">
                        <span className="text-[#1c1c1c]">{note.title}</span>
                        {' '}
                        {note.body}
                      </p>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </Section>

        <Section index="三" title="我的工作方式">
          <p className="text-[16px] leading-[1.8]">先梳理市场与客户信息，再拆解展会和传播任务，最后通过英文文案、视觉物料和资料整理完成内容交付。</p>
          <ol className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px]">
            {method.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span>{step}</span>
                {index < method.length - 1 ? <span className="text-black/35">→</span> : null}
              </li>
            ))}
          </ol>
        </Section>

        <Section index="四" title="这段经历证明了什么">
          <p className="text-[16px] leading-[1.8]">
            具备将海外市场信息、产品资料和展会需求转化为传播方案与内容资产的能力，能够参与完成从信息整理、任务拆解到视觉交付的完整工作链路。
          </p>
          <p className="mt-6 text-[14px] leading-[1.75] text-black/70">
            个人贡献边界：市场研究与展会资源清单为个人工作成果；企业介绍、产品资料和认证文件仅作为项目背景与内容依据使用。
          </p>
        </Section>
    </div>
  )
}

function Section({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-14 border-t border-black/15 pt-6">
      <p className="text-[12px] tracking-[0.22em] text-black/45">
        {index}、{title}
      </p>
      <div className="mt-4">{children}</div>
    </section>
  )
}
