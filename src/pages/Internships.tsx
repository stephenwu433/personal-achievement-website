import PageShell from '@/src/components/PageShell'
import { sections } from '@/src/content'

const section = sections[1]

const fields = ['机构或团队', '岗位', '开始和结束时间', '几条具体做了什么']

export default function Internships() {
  return (
    <PageShell title={section.label} english={section.english} lede={section.summary}>
      <section className="mt-10 rounded-2xl border border-dashed border-border p-5">
        <h2 className="text-lg font-medium">还没有实习条目</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          每有一段实习，就按这个结构发我一条。有多段就按时间顺序发。
        </p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field} className="rounded-xl bg-muted/60 px-4 py-3">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">{field}</dt>
              <dd className="mt-1 text-sm">待补充</dd>
            </div>
          ))}
        </dl>
      </section>
    </PageShell>
  )
}
