const archiveStats = [
  { value: '7', label: '项目实践' },
  { value: '4', label: '实习经历' },
  { value: '100K+', label: '内容累计浏览' },
  { value: '5', label: '黑客松 / 竞赛' },
  { value: '4', label: 'AI 产品系统' },
  { value: '6', label: '业务场景' },
]

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-[28px] border border-white/35 bg-white/14 px-4 py-5 text-center shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-md">
      <p className={`font-extrabold tracking-tight text-white ${value.length > 2 ? 'text-4xl' : 'text-5xl'}`}>{value}</p>
      <p
        className="mt-2 text-sm tracking-[0.12em] text-white/90"
        style={{ fontFamily: '"Noto Serif SC Archive", "Songti SC", serif', fontWeight: 600 }}
      >
        {label}
      </p>
    </div>
  )
}

export default function HomeArchive() {
  return (
    <section className="relative h-full overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.42)_100%)]" />
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col px-5 py-6 sm:px-8">
        <p className="text-center text-[11px] tracking-[0.42em] text-white/80">STEPHEN WU · ARCHIVE</p>
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <img
            src="/photos/archive-hero.png"
            alt="Stephen舞"
            className="h-40 w-32 rounded-[28px] object-cover object-[center_18%] shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/40 sm:h-48 sm:w-40"
          />
          <div className="grid w-full grid-cols-3 gap-3">
            {archiveStats.slice(0, 3).map((item) => (
              <Stat key={item.label} value={item.value} label={item.label} />
            ))}
          </div>
          <div className="grid w-full grid-cols-3 gap-3">
            {archiveStats.slice(3).map((item) => (
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
