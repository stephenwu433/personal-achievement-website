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
}

export function CTASection({
  badge,
  title,
  description,
  action,
  withGlow = true,
  className,
}: CTAProps) {
  return (
    <section className={cn("overflow-hidden pt-0 md:pt-0", className)}>
      <div className="relative mx-auto flex max-w-container flex-col items-center gap-6 px-8 py-12 text-center sm:gap-8 md:py-24">
        {badge && (
          <Badge
            variant="outline"
            className="opacity-0 animate-fade-in-up delay-100"
          >
            <span className="text-muted-foreground">{badge.text}</span>
          </Badge>
        )}

        <h2 className="text-3xl font-semibold opacity-0 animate-fade-in-up delay-200 sm:text-5xl">
          {title}
        </h2>

        {description && (
          <p className="text-muted-foreground opacity-0 animate-fade-in-up delay-300">
            {description}
          </p>
        )}

        <Button
          variant={action.variant || "default"}
          size="lg"
          className="opacity-0 animate-fade-in-up delay-500"
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

        {withGlow && (
          <div className="fade-top-lg pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-glow animate-scale-in delay-700" />
        )}
      </div>
    </section>
  )
}
