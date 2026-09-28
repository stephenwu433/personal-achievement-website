import { ArrowUpRight } from 'lucide-react'
import PageShell from '@/src/components/PageShell'
import { projects, sections } from '@/src/content'

const section = sections[2]

export default function Projects() {
  return (
    <PageShell title={section.label} english={section.english} lede={section.summary}>
      <div className="mt-10 space-y-4">
        {projects.map((project) => (
          <article key={project.href} className="rounded-2xl border border-border p-5">
            <h2 className="text-2xl font-semibold tracking-tight">{project.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.summary}</p>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm hover:underline"
            >
              查看仓库
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm leading-6 text-muted-foreground">
        还有项目的话，发我名称、一句说明、你的角色、链接，以及一张封面图。
      </p>
    </PageShell>
  )
}
