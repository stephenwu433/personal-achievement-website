import type { CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CTAProps {
  badge?: {
    text: string
  }
  title: string
  description?: string
  action: {
    text: string
    href: string
    variant?: "default" | "glow"
    onClick?: () => void
  }
  withGlow?: boolean
  className?: string
  flow?: {
    a: string
    b: string
    c: string
  }
  links?: readonly {
    label: string
    href: string
    note: string
  }[]
}

export function CTASection({
  badge,
  title,
  description,
  action,
  withGlow = true,
  className,
  flow = { a: "#9eb6d8", b: "#2f5f9a", c: "#d5dde6" },
  links,
}: CTAProps) {
  const flowStyle = {
    "--flow-a": flow.a,
    "--flow-b": flow.b,
    "--flow-c": flow.c,
  } as CSSProperties

  return (
    <section className={cn("overflow-hidden pt-0 md:pt-0", className)}>
      <div
        className="relative mx-auto flex max-w-container flex-col items-center gap-6 px-8 py-12 text-center sm:gap-8 md:py-24"
        style={{ fontFamily: '"Noto Serif SC", "Source Han Serif SC", "STZhongsong", "华文中宋", "Songti SC", "SimSun", serif', fontWeight: 500 }}
      >
        {withGlow && (
          <div className="project-flow pointer-events-none absolute inset-0 z-0 opacity-0 animate-scale-in delay-700" style={flowStyle}>
            <span />
            <span />
            <span />
          </div>
        )}
        {badge && (
          <Badge
            variant="outline"
            className="relative z-10 bg-white/40 opacity-0 animate-fade-in-up delay-100"
          >
            <span className="text-muted-foreground">{badge.text}</span>
          </Badge>
        )}

        <h2 className="relative z-10 text-3xl font-medium text-[#1c1915] opacity-0 animate-fade-in-up delay-200 sm:text-5xl">
          {title}
        </h2>

        {description && (
          <p className="relative z-10 text-[#3f3a34] opacity-0 animate-fade-in-up delay-300">
            {description}
          </p>
        )}

        {links?.length ? (
          <div className="relative z-10 flex w-full max-w-md flex-col gap-3 opacity-0 animate-fade-in-up delay-500">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md border border-black/15 bg-white/80 px-4 py-3 text-left text-[#1c1915] hover:bg-white"
              >
                <span className="block text-[12px] tracking-[0.16em] text-[#6B1F2A]">{link.label}</span>
                <span className="mt-1 block text-[14px] leading-6 font-normal" style={{ fontFamily: '"Noto Sans SC", "Geist Variable", sans-serif', fontWeight: 400 }}>
                  {link.note}
                </span>
                <span className="mt-2 block break-all text-[12px] leading-5 underline underline-offset-4">{link.href}</span>
              </a>
            ))}
          </div>
        ) : null}

        <Button
          variant={action.variant || "default"}
          size="lg"
          className="relative z-10 border border-black/25 bg-white/70 font-medium text-[#1c1915] shadow-none opacity-0 animate-fade-in-up delay-500 hover:bg-white"
          asChild
        >
          <a
            href={action.href}
            onClick={(event) => {
              if (!action.onClick) return
              event.preventDefault()
              action.onClick()
            }}
          >
            {action.text}
          </a>
        </Button>
      </div>
    </section>
  )
}
