import PageShell from '@/src/components/PageShell'
import { profile, sections } from '@/src/content'

const section = sections[0]

const needed = [
  '一句能放在名字下面的自我介绍',
  '更完整的一段话：学校或所在城市、正在做的事',
  '想公开的联系方式，例如邮箱',
  '如果要换首页和这里的照片，发清晰的原图',
]

export default function About() {
  return (
    <PageShell title={section.label} english={section.english} lede={section.summary}>
      <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end">
        <img
          src={profile.portrait}
          alt={profile.name}
          className="h-56 w-56 rounded-2xl object-cover"
        />
        <div>
          <h2 className="text-3xl font-semibold">{profile.name}</h2>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            github.com/{profile.githubHandle}
          </a>
        </div>
      </div>
      <section className="mt-10 rounded-2xl border border-dashed border-border p-5">
        <h2 className="text-lg font-medium">这段介绍还空着</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          公开资料里目前只有名字和 GitHub。下面这些补上之后，这里会换成你的介绍。
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-6">
          {needed.map((item) => (
            <li key={item} className="border-t border-border pt-2">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}
