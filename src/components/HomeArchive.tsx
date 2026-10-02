import GalleryVideoBackground from '@/src/components/GalleryVideoBackground'

function FeaturedStat({
  value,
  label,
  emphasized = false,
}: {
  value: string
  label: string
  emphasized?: boolean
}) {
  return (
    <div
      className={`flex h-full items-center justify-between gap-3 rounded-[28px] px-5 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-md ${
        emphasized
          ? 'border border-[#e6b15c]/80 bg-white/18'
          : 'border border-white/28 bg-white/10'
      }`}
    >
      <p className={`font-semibold tracking-tight text-white ${value.length > 2 ? 'text-4xl' : 'text-5xl'}`}>{value}</p>
      <p className="max-w-[7rem] text-right text-sm leading-5 text-white/80">{label}</p>
    </div>
  )
}

function LineStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-2 py-3 text-center">
      <p className="text-3xl font-medium tracking-tight text-white">{value}</p>
      <span className="mx-auto mt-3 block h-px w-10 bg-white/70" />
      <p className="mt-3 text-xs tracking-[0.14em] text-white/75">{label}</p>
    </div>
  )
}

export default function HomeArchive() {
  return (
    <section className="relative h-dvh overflow-hidden text-white">
      <GalleryVideoBackground />
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.42)_100%)]" />
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col px-5 py-6 sm:px-8">
        <p className="text-center text-[11px] tracking-[0.42em] text-white/80">STEPHEN WU · ARCHIVE</p>
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <img
            src="/photos/archive-hero.png"
            alt="Stephen舞"
            className="h-44 w-36 rounded-[28px] object-cover object-[center_18%] shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/40 sm:h-52 sm:w-44"
          />
          <div className="grid w-full gap-3 sm:grid-cols-3">
            <FeaturedStat value="7" label="项目实践" />
            <FeaturedStat value="4" label="实习经历" emphasized />
            <FeaturedStat value="100K+" label="内容累计浏览" />
          </div>
          <div className="grid w-full grid-cols-3">
            <LineStat value="5" label="黑客松 / 竞赛" />
            <LineStat value="4" label="AI 产品系统" />
            <LineStat value="6" label="业务场景" />
          </div>
        </div>
        <a href="#gallery" className="pb-1 text-center text-xs tracking-[0.22em] text-white/80">
          向下进入项目画廊 ↓
        </a>
      </div>
    </section>
  )
}
