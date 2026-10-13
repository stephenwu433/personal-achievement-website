import { useEffect, useRef, useState } from 'react'
import Briefcase from 'lucide-react/dist/esm/icons/briefcase.mjs'
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.mjs'
import FolderKanban from 'lucide-react/dist/esm/icons/folder-kanban.mjs'
import Layers from 'lucide-react/dist/esm/icons/layers.mjs'
import User from 'lucide-react/dist/esm/icons/user.mjs'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { profile, sections, type SiteSection } from '@/src/content'
import { capabilities } from '@/src/pages/capability.data'
import { openCapability } from '@/src/pages/openCapability'
import { preloadRoute } from '@/src/routeLoaders'

const icons: Record<SiteSection['id'], typeof User> = {
  about: User,
  internships: Briefcase,
  projects: FolderKanban,
  skills: Layers,
}

type SiteHeaderProps = {
  overlay?: boolean
  onPhoto?: boolean
  slim?: boolean
}

function CapabilityLinks({ current, onPick }: { current: string; onPick: () => void }) {
  const navigate = useNavigate()
  return (
    <div className="rounded-xl border border-border bg-background p-2 text-foreground shadow-lg" role="menu" aria-label="五项能力">
      {capabilities.map((entry) => {
        const href = `/skills/${entry.id}`
        const active = current === href
        return (
          <Link
            key={entry.id}
            to={href}
            role="menuitem"
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${active ? 'bg-foreground text-background' : 'hover:bg-accent'}`}
            onPointerEnter={() => { void preloadRoute(href) }}
            onFocus={() => { void preloadRoute(href) }}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
              event.preventDefault()
              onPick()
              openCapability(navigate, href)
            }}
          >
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: entry.ink }} aria-hidden="true" />
            {entry.label}
          </Link>
        )
      })}
    </div>
  )
}

export default function SiteHeader({ overlay = false, onPhoto = false, slim = false }: SiteHeaderProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const bare = pathname === '/skills'
  const [menu, setMenu] = useState(false)
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 639px)').matches)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const header = document.querySelector('.site-chrome')
    if (!header) return
    const apply = () => {
      document.documentElement.style.setProperty('--cap-header', `${header.getBoundingClientRect().height}px`)
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(header)
    return () => observer.disconnect()
  }, [pathname, menu])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)')
    const sync = () => setNarrow(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    setMenu(false)
  }, [pathname])

  useEffect(() => {
    if (!menu) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menu])

  useEffect(() => {
    if (!menu || !narrow) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previous
    }
  }, [menu, narrow])

  return (
    <header
      className={`site-chrome ${
        onPhoto
          ? 'relative z-20 px-4 pt-4 pb-1 sm:px-6 sm:pt-5'
          : overlay
            ? 'absolute inset-x-0 top-0 z-20 px-4 pt-4 sm:px-6 sm:pt-5'
            : slim
              ? 'site-chrome-slim sticky top-0 z-30 border-b border-border bg-background px-4 py-1.5 sm:px-6'
              : bare
                ? 'sticky top-0 z-30 bg-transparent px-4 py-3 sm:px-6'
                : 'sticky top-0 z-30 border-b border-border bg-background px-4 py-3 sm:px-6'
      }`}
    >
      <div className={`mx-auto flex w-full max-w-6xl ${slim ? 'flex-col gap-1.5 min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-3' : 'flex-col gap-3'}`}>
        <div className={`flex items-center justify-between ${slim ? 'min-[900px]:contents' : ''}`}>
          <Link to="/" className={`${slim ? 'shrink-0 text-base' : 'text-lg'} tracking-tight ${onPhoto ? 'text-white' : bare ? 'text-[#3a2a1a]' : ''}`}>
            作品集<span className={onPhoto ? 'text-white/70' : bare ? 'text-[#3a2a1a]/70' : 'text-muted-foreground'}>档案</span>
          </Link>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className={`text-sm hover:text-foreground ${onPhoto ? 'text-white/80 hover:text-white' : bare ? 'text-[#3a2a1a]/80 hover:text-[#3a2a1a]' : 'text-muted-foreground'} ${slim ? 'min-[900px]:hidden' : ''}`}
          >
            GitHub
          </a>
        </div>
        {onPhoto ? null : (
          <nav aria-label="页面" className={slim ? 'grid grid-cols-2 gap-1.5 sm:grid-cols-4 min-[900px]:flex min-[900px]:min-w-0 min-[900px]:flex-1 min-[900px]:items-center min-[900px]:justify-end min-[900px]:gap-1.5' : 'grid grid-cols-2 gap-2 sm:grid-cols-4'}>
            {sections.map((section) => {
              const Icon = icons[section.id]
              const active = section.href === '/skills' ? pathname.startsWith('/skills') : pathname === section.href
              const tone = active
                ? 'border-foreground/30 bg-foreground text-background'
                : 'border-border bg-card/75 text-foreground hover:bg-accent'
              if (section.id !== 'skills') {
                return (
                  <Link
                    key={section.href}
                    to={section.href}
                    aria-current={active ? 'page' : undefined}
                    onPointerEnter={() => { void preloadRoute(section.href) }}
                    onFocus={() => { void preloadRoute(section.href) }}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
                      if (pathname === section.href) return
                      if (!pathname.startsWith('/skills')) return
                      event.preventDefault()
                      openCapability(navigate, section.href)
                    }}
                    className={`flex items-center border transition-colors ${slim ? 'gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] leading-none' : 'gap-2 rounded-xl px-3 py-2.5 text-sm'} ${tone}`}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span>{section.label}</span>
                  </Link>
                )
              }
              return (
                <div
                  key={section.href}
                  className="relative"
                  onMouseEnter={() => {
                    if (!narrow) setMenu(true)
                  }}
                  onMouseLeave={() => {
                    if (!narrow) setMenu(false)
                  }}
                  onFocus={() => {
                    if (!narrow) setMenu(true)
                  }}
                  onBlur={(event) => {
                    if (narrow) return
                    const next = event.relatedTarget
                    if (next instanceof Node && event.currentTarget.contains(next)) return
                    setMenu(false)
                  }}
                >
                  <div className="flex">
                    <Link
                      to={section.href}
                      aria-current={active ? 'page' : undefined}
                      aria-expanded={menu}
                      aria-controls="capability-menu"
                      onPointerEnter={() => { void preloadRoute(section.href) }}
                      onFocus={() => { void preloadRoute(section.href) }}
                      onClick={(event) => {
                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
                        if (pathname === section.href) return
                        if (!pathname.startsWith('/skills')) return
                        event.preventDefault()
                        openCapability(navigate, section.href)
                      }}
                      className={`flex min-w-0 flex-1 items-center border transition-colors ${slim ? 'gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] leading-none' : 'gap-2 rounded-xl px-3 py-2.5 text-sm'} ${tone} ${narrow ? (slim ? 'rounded-l-lg' : 'rounded-l-xl') : ''}`}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span>{section.label}</span>
                    </Link>
                    <button
                      type="button"
                      className={`border border-l-0 px-2 sm:hidden ${tone} rounded-r-xl`}
                      aria-expanded={menu}
                      aria-controls="capability-menu"
                      aria-label={menu ? '关闭能力菜单' : '展开能力菜单'}
                      onClick={() => setMenu((open) => !open)}
                    >
                      <ChevronDown className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  {menu && !narrow ? (
                    <div id="capability-menu" className="absolute right-0 top-full z-50 w-52 pt-2">
                      <CapabilityLinks current={pathname} onPick={() => setMenu(false)} />
                    </div>
                  ) : null}
                </div>
              )
            })}
          </nav>
        )}
        {slim && !onPhoto ? (
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="hidden shrink-0 text-sm text-muted-foreground hover:text-foreground min-[900px]:inline"
          >
            GitHub
          </a>
        ) : null}
      </div>
      {menu && narrow && !onPhoto ? (
        <>
          <button type="button" className="fixed inset-0 z-40 bg-black/45" aria-label="关闭菜单" onClick={() => setMenu(false)} />
          <div id="capability-menu" role="dialog" aria-label="个人能力" className="fixed inset-x-3 z-50" style={{ top: 'calc(var(--cap-header, 10rem) + 0.75rem)' }}>
            <div className="mb-2 flex justify-end">
              <button
                ref={closeRef}
                type="button"
                onClick={() => setMenu(false)}
                className="rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground"
              >
                关闭
              </button>
            </div>
            <CapabilityLinks current={pathname} onPick={() => setMenu(false)} />
          </div>
        </>
      ) : null}
    </header>
  )
}
