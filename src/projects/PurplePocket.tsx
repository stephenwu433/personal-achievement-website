import { useState } from 'react'

type PocketCard = {
  src?: string
  alt: string
  tint: string
}

export default function PurplePocket({
  cards,
  caption,
  ariaLabel,
  hover,
  opening,
  reduced,
  onClick,
}: {
  cards: PocketCard[]
  caption: string
  ariaLabel: string
  hover: boolean
  opening: boolean
  reduced: boolean
  onClick: () => void
}) {
  const shown = cards.slice(0, 5)
  const [broken, setBroken] = useState<Record<number, boolean>>({})
  const mid = (shown.length - 1) / 2

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="relative mx-auto block w-full max-w-[480px] border-0 bg-transparent p-0 text-left"
      style={{
        transform: hover && !reduced ? 'translateY(-6px)' : undefined,
        transition: reduced ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <span className="relative block h-[320px]">
        <Sparkle className="top-1 left-8 text-[#F2C14B]" mark="★" />
        <Sparkle className="top-4 right-10 text-[#F7A8C4]" mark="✦" />
        <Sparkle className="top-14 left-1 text-[#E7C96A]" mark="☾" />
        <Sparkle className="right-2 bottom-24 text-[#C9A6F5]" mark="✦" />
        {shown.map((card, index) => {
          const offset = index - mid
          const lift = reduced ? 0 : opening ? 36 + index * 6 : hover ? 10 + index * 2 : 0
          return (
            <span
              key={`${card.alt}-${index}`}
              className="absolute overflow-hidden rounded-[18px] border-[5px] shadow-[0_10px_18px_rgba(90,50,140,0.16)]"
              style={{
                left: `${46 + offset * (shown.length > 4 ? 17 : 19) - 14}%`,
                top: `${8 + Math.abs(offset) * 5}%`,
                width: shown.length > 4 ? '27%' : '30%',
                height: '46%',
                zIndex: 2 + index,
                background: card.tint,
                borderColor: '#F7F3FF',
                transform: `translateY(${-lift}px) rotate(${offset * 8}deg)`,
                transition: reduced ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {card.src && !broken[index] ? (
                <img
                  src={card.src}
                  alt={card.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  onError={() => setBroken((current) => ({ ...current, [index]: true }))}
                />
              ) : null}
            </span>
          )
        })}
        <span className="absolute inset-x-1 bottom-0 z-10 h-[176px] rounded-[40px] bg-gradient-to-b from-[#E4C6FF] via-[#C78BF4] to-[#A45AEE] shadow-[0_18px_28px_rgba(120,70,190,0.28)]">
          <span className="absolute -top-2 left-10 h-4 w-20 rounded-t-xl bg-[#C9A4EE]" />
          <Horn className="absolute -top-4 left-2 -rotate-[18deg]" />
          <Horn className="absolute -top-4 right-2 rotate-[18deg] -scale-x-100" />
          <span className="absolute top-11 left-1/2 flex -translate-x-1/2 gap-7">
            <span className="size-3 rounded-full bg-[#2A2340]" />
            <span className="size-3 rounded-full bg-[#2A2340]" />
          </span>
          <span className="absolute top-[3.4rem] left-[31%] size-5 rounded-full bg-[#F4A6C8]/75" />
          <span className="absolute top-[3.4rem] right-[31%] size-5 rounded-full bg-[#F4A6C8]/75" />
          <svg viewBox="0 0 28 14" className="absolute top-[4.35rem] left-1/2 h-3.5 w-7 -translate-x-1/2" aria-hidden="true">
            <path d="M3 3.5Q14 12 25 3.5" fill="none" stroke="#2A2340" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </span>
      </span>
      <span className="mt-3 block text-center text-[11px] tracking-[0.16em] text-[#77746E]">{caption}</span>
    </button>
  )
}

function Sparkle({ className, mark }: { className: string; mark: string }) {
  return <span className={`pointer-events-none absolute text-[15px] leading-none ${className}`}>{mark}</span>
}

function Horn({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 36 48" className={`h-9 w-7 ${className}`} aria-hidden="true">
      <path d="M18 46C8 34 6 22 14 8c2 10 4 18 10 38 2-12 4-22 8-32-2 14-4 26-14 32Z" fill="#5C3D8C" />
    </svg>
  )
}
