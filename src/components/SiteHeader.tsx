import { Briefcase, FolderKanban, Layers, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { profile, sections, type SiteSection } from '@/src/content'

const icons: Record<SiteSection['id'], typeof User> = {
  about: User,
  internships: Briefcase,
  projects: FolderKanban,
  skills: Layers,
}

type SiteHeaderProps = {
  overlay?: boolean
  onPhoto?: boolean
}

export default function SiteHeader({ overlay = false, onPhoto = false }: SiteHeaderProps) {
  const { pathname } = useLocation()
  const bare = false

  return (
    <header
      className={
        onPhoto
          ? 'relative z-20 px-4 pt-4 pb-1 sm:px-6 sm:pt-5'
          : overlay
            ? 'absolute inset-x-0 top-0 z-20 px-4 pt-4 sm:px-6 sm:pt-5'
            : bare
              ? 'sticky top-0 z-30 bg-transparent px-4 py-3 sm:px-6'
              : 'sticky top-0 z-30 border-b border-border bg-background px-4 py-3 sm:px-6'
      }
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3">
        <div className="flex items-center justify-between">
          <Link to="/" className={`text-lg tracking-tight ${onPhoto ? 'text-white' : bare ? 'text-[#3a2a1a]' : ''}`}>
            Stephen<span className={onPhoto ? 'text-white/70' : bare ? 'text-[#3a2a1a]/70' : 'text-muted-foreground'}>舞</span>
          </Link>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className={`text-sm hover:text-foreground ${onPhoto ? 'text-white/80 hover:text-white' : bare ? 'text-[#3a2a1a]/80 hover:text-[#3a2a1a]' : 'text-muted-foreground'}`}
          >
            GitHub
          </a>
        </div>
        {onPhoto ? null : (
          <nav aria-label="页面" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {sections.map((section) => {
              const Icon = icons[section.id]
              const active = pathname === section.href
              return (
                <Link
                  key={section.href}
                  to={section.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? 'border-foreground/30 bg-foreground text-background'
                      : 'border-border bg-card/75 text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span>{section.label}</span>
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </header>
  )
}
