import SiteHeader from '@/src/components/SiteHeader'

export default function Projects() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#12151c] text-white">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-16">
        <p className="text-xs tracking-[0.22em] text-white/45">项目列表</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">项目和图片还没放上</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
          这一页先空着。项目名称、一句说明和图片到了之后，再做交互。
        </p>
      </main>
    </div>
  )
}
