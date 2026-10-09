import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import SiteHeader from '@/src/components/SiteHeader'
import { capabilities, capabilityById, splitFigure, type Capability as CapabilityItem } from '@/src/pages/capability.data'
import { openCapability } from '@/src/pages/openCapability'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const serif = '"Noto Serif SC", "Songti SC", serif'

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [query])
  return matches
}

function CapabilityCopy({
  item,
  step,
  showAll,
  band,
}: {
  item: CapabilityItem
  step: number
  showAll: boolean
  band: boolean
}) {
  return (
    <>
      <h1
        className={`leading-none font-medium ${band ? 'text-[30px]' : 'text-[clamp(32px,3vw,44px)]'}`}
        style={{ fontFamily: serif }}
      >
        {item.label}
      </h1>
      <p className={`${band ? 'mt-1 text-[13px] leading-5' : 'mt-2 text-[14px] leading-6'} ${step === 0 || showAll ? 'opacity-100' : 'opacity-80'}`}>
        {item.intro}
      </p>
      <ul className={band ? 'mt-2 grid list-none grid-cols-3 gap-3 p-0' : 'mt-3 flex list-none flex-col gap-2.5 p-0'}>
        {item.evidence.map((row, index) => {
          const lit = showAll || step === index + 1
          const figure = splitFigure(row.figure)
          const figureNode = (
            <p className="leading-none" style={{ fontFamily: serif }}>
              <span className={band ? 'text-[20px]' : 'text-[26px]'}>{figure.value}</span>
              {figure.unit ? <span className="ml-1 text-[11px] tracking-[0.06em]">{figure.unit}</span> : null}
            </p>
          )
          return (
            <li
              key={`${row.project}-${row.figure}`}
              className={`transition-opacity duration-500 ${band ? '' : 'border-t pt-2'}`}
              style={{ borderColor: band ? undefined : `${item.paper}99`, opacity: lit ? 1 : 0.62 }}
            >
              {band ? (
                figureNode
              ) : (
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[12px] tracking-[0.08em]">{row.project}</p>
                  {figureNode}
                </div>
              )}
              {band ? <p className="mt-1 text-[12px] tracking-[0.06em]">{row.project}</p> : null}
              <p className={`mt-1 ${band ? 'text-[12px] leading-5' : 'text-[13px] leading-5'}`}>{row.text}</p>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default function Capability() {
  const { id } = useParams()
  const item = capabilityById(id)
  const navigate = useNavigate()
  const pinRef = useRef<HTMLElement>(null)
  const stepRef = useRef(0)
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const wide = useMedia('(min-width: 1024px)')
  const [step, setStep] = useState(0)
  const pinned = wide && !reduced

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
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    stepRef.current = 0
    setStep(0)
  }, [id])

  useGSAP(() => {
    if (!item || !pinned) return
    const count = item.evidence.length + 1
    ScrollTrigger.create({
      trigger: pinRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate(self) {
        pinRef.current?.style.setProperty('--cap-p', self.progress.toFixed(4))
        const next = Math.min(count - 1, Math.floor(self.progress * count))
        if (next !== stepRef.current) {
          stepRef.current = next
          setStep(next)
        }
      },
    })
  }, { dependencies: [item?.id, pinned], scope: pinRef })

  if (!item) return <Navigate to="/skills" replace />

  const others = capabilities.filter((entry) => entry.id !== item.id)
  const showAll = !pinned

  return (
    <div className="bg-background text-foreground">
      <SiteHeader />
      <main>
        {wide ? (
          <section
            ref={pinRef}
            style={{ height: pinned ? `${(item.evidence.length + 1) * 100}vh` : 'auto', background: item.ink }}
          >
            <div className={pinned ? 'cap-stage sticky top-[var(--cap-header,6.75rem)] h-[calc(100dvh-var(--cap-header,6.75rem))] overflow-hidden' : 'relative h-[calc(100dvh-var(--cap-header,6.75rem))] overflow-hidden'}>
              <img
                src={item.image}
                alt={item.label}
                className="cap-photo absolute inset-0 size-full object-cover"
                style={{ objectPosition: item.focus }}
              />
              <div
                data-cap-copy
                className={`absolute ${item.place} ${item.band ? 'p-3' : 'p-4'}`}
                style={{ background: item.ink, color: item.text }}
              >
                <CapabilityCopy item={item} step={step} showAll={showAll} band={Boolean(item.band)} />
              </div>
            </div>
          </section>
        ) : (
          <section style={{ background: item.ink, color: item.text }}>
            <img
              src={item.image}
              alt={item.label}
              className="aspect-[16/10] w-full object-cover"
              style={{ objectPosition: item.focus }}
            />
            <div className="px-5 py-6">
              <CapabilityCopy item={item} step={0} showAll band={false} />
            </div>
          </section>
        )}
        <section className="grid min-h-[70vh] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => openCapability(navigate, `/skills/${entry.id}`)}
              className="relative min-h-[42vh] overflow-hidden text-left"
              style={{ background: entry.ink }}
            >
              <img src={entry.image} alt="" className="absolute inset-0 size-full object-cover" style={{ objectPosition: entry.focus }} />
              <span className="absolute inset-x-0 bottom-0 h-28" style={{ background: `linear-gradient(transparent, ${entry.ink})` }} />
              <span
                className="absolute bottom-5 left-5 text-[clamp(26px,3vw,40px)] leading-none"
                style={{ color: entry.text, fontFamily: serif }}
              >
                {entry.label}
              </span>
            </button>
          ))}
        </section>
      </main>
    </div>
  )
}
