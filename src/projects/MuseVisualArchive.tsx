import { museArchive } from './museCase.data'

export default function MuseVisualArchive() {
  return (
    <section className="mt-16 grid items-center gap-8 border-t border-black/10 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
      <div>
        <p className="text-[11px] tracking-[0.22em] text-[#AAA59E]">{museArchive.kicker}</p>
        <h2 className="mt-4 text-[clamp(22px,3.6vw,46px)] leading-[1.22]" style={{ fontFamily: 'Songti SC, Noto Serif SC, serif' }}>{museArchive.title}</h2>
        <p className="mt-5 max-w-xl text-[15px] leading-7">{museArchive.lead}</p>
        <p className="mt-3 max-w-xl text-[14px] leading-7 text-black/60">原始图文含项目名称和业务数字，公开版仅保留内容策划方法与场景示意。</p>
      </div>
      <img src="/projects/styling.webp" alt="AI 穿搭内容场景示意" className="w-full max-h-[32rem] rounded-[2rem] object-cover" loading="lazy" />
    </section>
  )
}
