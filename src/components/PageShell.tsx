import { useEffect, type ReactNode } from 'react'
import SiteHeader from '@/src/components/SiteHeader'

type PageShellProps = {
  title: string
  english: string
  lede: string
  children: ReactNode
}

export default function PageShell({ title, english, lede, children }: PageShellProps) {
  useEffect(() => {
    document.title = `${title} — Stephen舞`
  }, [title])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">{english}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{lede}</p>
        {children}
      </main>
    </div>
  )
}
