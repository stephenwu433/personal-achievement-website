import PageShell from '@/src/components/PageShell'
import { sections } from '@/src/content'

const section = sections[3]

const groups = [
  { title: '语言和工程', hint: '例如你日常在写的语言、框架' },
  { title: '工具', hint: '例如设计、协作或部署时会用到的工具' },
  { title: '方向', hint: '例如你想被看到的能力方向' },
]

export default function Skills() {
  return (
    <PageShell title={section.label} english={section.english} lede={section.summary}>
      <div className="mt-10 space-y-4">
        {groups.map((group) => (
          <section key={group.title} className="rounded-2xl border border-dashed border-border p-5">
            <h2 className="text-lg font-medium">{group.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{group.hint}</p>
            <p className="mt-4 text-sm">待补充</p>
          </section>
        ))}
      </div>
    </PageShell>
  )
}
