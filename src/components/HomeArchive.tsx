import GalleryVideoBackground from '@/src/components/GalleryVideoBackground'

const sideStats = [
  { value: '7', label: '项目实践' },
  { value: '100K+', label: '内容累计浏览' },
]

const lowerStats = [
  { value: '5', label: '黑客松 / 竞赛' },
  { value: '4', label: 'AI 产品系统' },
  { value: '6', label: '业务场景' },
]

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/30 bg-white/10 px-5 py-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-md">
      <p className="text-4xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs tracking-[0.16em] text-white/75">{label}</p>
    </div>
  )
}

export default function HomeArchive() {
  return (
    <section className="relative h-dvh overflow-hidden text-white">
      <GalleryVideoBackground />
      <div className="pointer-events-none absolute inset-0 bg-black/25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.45)_100%)]" />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <p className="text-center text-[11px] tracking-[0.42em] text-white/80">STEPHEN WU · ARCHIVE</p>
        <div className="mx-auto grid w-full max-w-5xl flex-1 content-center gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(16rem,1.15fr)_minmax(0,0.9fr)] md:items-center md:gap-x-6 md:gap-y-5">
          <Stat value={sideStats[0].value} label={sideStats[0].label} />
          <figure className="overflow-hidden rounded-[28px] border border-white/35 bg-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <img
              src="/photos/archive-hero.png"
              alt="Stephen舞"
              className="aspect-[4/5] w-full object-cover object-[center_16%] md:aspect-[5/4] md:h-64"
            />
            <figcaption className="px-4 py-3 text-center">
              <span className="block text-sm tracking-wide">人物主视觉</span>
              <span className="mt-1 block text-[10px] tracking-[0.22em] text-white/70">PERSONAL HERO</span>
            </figcaption>
          </figure>
          <Stat value={sideStats[1].value} label={sideStats[1].label} />
          <div className="md:col-start-2">
            <Stat value="4" label="实习经历" />
          </div>
          <div className="grid gap-4 md:col-span-3 md:grid-cols-3">
            {lowerStats.map((item) => (
              <Stat key={item.label} value={item.value} label={item.label} />
            ))}
          </div>
        </div>
        <a href="#gallery" className="pb-1 text-center text-xs tracking-[0.22em] text-white/80">
          向下进入项目画廊 ↓
        </a>
      </div>
    </section>
  )
}
