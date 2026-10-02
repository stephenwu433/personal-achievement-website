const stats = [
  { value: '7', label: '项目实践' },
  { value: '100K+', label: '内容累计浏览' },
  { value: '4', label: '实习经历' },
  { value: '5', label: '黑客松 / 竞赛' },
  { value: '4', label: 'AI 产品系统' },
  { value: '6', label: '业务场景' },
]

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center border border-[#1c1c1c] bg-[#f3f1eb] px-4 py-5 text-center">
      <p className="text-4xl font-light tracking-wide text-[#1c1c1c]">{value}</p>
      <p className="mt-2 text-sm tracking-wide text-[#1c1c1c]">{label}</p>
    </div>
  )
}

export default function HomeArchive() {
  return (
    <section className="bg-[#f3f1eb] text-[#1c1c1c]">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-6 py-8 sm:px-10">
        <div className="flex min-h-0 flex-1 flex-col border-x border-dashed border-[#1c1c1c]/70 px-4 py-6 sm:px-8">
          <p className="text-center text-sm tracking-[0.28em]">STEPHEN WU • ARCHIVE</p>
          <div className="mx-auto mt-8 grid w-full max-w-4xl flex-1 content-center gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)_minmax(0,0.85fr)] md:items-center md:gap-x-8 md:gap-y-7">
            <Stat value={stats[0].value} label={stats[0].label} />
            <div className="border border-[#1c1c1c] bg-[#f3f1eb] md:min-h-56">
              <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:h-56">
                <img
                  src="/photos/archive-hero.png"
                  alt="Stephen舞"
                  className="size-full object-cover object-[center_18%]"
                />
                <div className="absolute inset-y-4 left-[18%] w-px bg-white/75" />
                <div className="absolute inset-y-4 right-[18%] w-px bg-white/75" />
                <p className="absolute inset-x-0 bottom-3 text-center text-white">
                  <span className="block text-sm tracking-wide">人物主视觉</span>
                  <span className="mt-0.5 block text-[10px] tracking-[0.18em]">PERSONAL HERO</span>
                </p>
              </div>
            </div>
            <Stat value={stats[1].value} label={stats[1].label} />
            <div className="md:col-start-2">
              <Stat value={stats[2].value} label={stats[2].label} />
            </div>
            <div className="grid gap-6 md:col-span-3 md:grid-cols-3">
              <Stat value={stats[3].value} label={stats[3].label} />
              <Stat value={stats[4].value} label={stats[4].label} />
              <Stat value={stats[5].value} label={stats[5].label} />
            </div>
          </div>
          <a href="#gallery" className="mt-8 text-center text-sm tracking-[0.18em] text-[#1c1c1c]">
            向下进入项目画廊 ↓
          </a>
        </div>
      </div>
    </section>
  )
}
