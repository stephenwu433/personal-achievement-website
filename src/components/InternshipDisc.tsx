import type { Internship } from '@/src/content'

const hole = '#e6e3dc'

type InternshipDiscProps = {
  item: Internship
}

export default function InternshipDisc({ item }: InternshipDiscProps) {
  const { from, to, ink, motif } = item.disc

  return (
    <div className="relative size-full rounded-full">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 18deg, #f8f8f8 0deg, #8e8e8e 48deg, #f3f3f3 96deg, #767676 150deg, #ececec 210deg, #9a9a9a 270deg, #ffffff 320deg, #b5b5b5 360deg)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.65), 0 16px 28px rgba(0,0,0,0.16)',
        }}
      />
      <div className="absolute inset-[5.2%] overflow-hidden rounded-full">
        <div className="absolute inset-0" style={{ background: `linear-gradient(155deg, ${from}, ${to})` }} />
        <Motif motif={motif} ink={ink} />
        <p
          className="absolute inset-x-[14%] top-[16%] text-center tracking-[0.22em]"
          style={{ color: ink, fontSize: '6.5cqi', opacity: 0.85 }}
        >
          {item.organization}
        </p>
        <div className="absolute inset-x-[8%] bottom-[14%] text-center">
          <p
            className="leading-none font-medium"
            style={{
              color: ink,
              fontFamily: '"Noto Serif SC", "Noto Sans SC", serif',
              fontSize: '13cqi',
            }}
          >
            {item.title}
          </p>
          <p className="mt-[0.35em] tracking-[0.28em]" style={{ color: ink, fontSize: '5.2cqi' }}>
            {item.role}
          </p>
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(118deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.05) 28%, transparent 46%, transparent 62%, rgba(0,0,0,0.2) 100%)',
          }}
        />
      </div>
      <div
        className="absolute top-1/2 left-1/2 size-[31%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'conic-gradient(from 80deg, #f4f4f4, #c8c8c8, #fafafa, #9d9d9d, #e7e7e7, #b0b0b0, #f4f4f4)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 size-[15.5%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: hole, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }}
      />
    </div>
  )
}

function Motif({ motif, ink }: { motif: Internship['disc']['motif']; ink: string }) {
  if (motif === 'lines') {
    return (
      <div className="absolute inset-x-[10%] top-[42%] flex flex-col gap-[1.6cqi]">
        <span className="h-[0.7cqi] w-full" style={{ background: ink, opacity: 0.35 }} />
        <span className="h-[0.7cqi] w-[70%]" style={{ background: ink, opacity: 0.28 }} />
        <span className="h-[0.7cqi] w-[42%]" style={{ background: ink, opacity: 0.2 }} />
      </div>
    )
  }
  if (motif === 'block') {
    return <div className="absolute inset-x-[16%] bottom-[12%] h-[38%] rounded-sm" style={{ background: ink, opacity: 0.08 }} />
  }
  if (motif === 'warm') {
    return (
      <div className="absolute top-[36%] left-1/2 flex -translate-x-1/2 gap-[3cqi]" style={{ color: ink }}>
        <Star />
        <Star />
        <Star />
      </div>
    )
  }
  return (
    <div
      className="absolute top-[38%] -left-[8%] size-[62%] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.28), rgba(0,0,0,0) 70%)' }}
    />
  )
}

function Star() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="w-[4.5cqi]">
      <path d="M6 0.6 7.1 4.4H11L7.9 6.7 8.9 10.6 6 8.3 3.1 10.6 4.1 6.7 1 4.4h3.9Z" fill="currentColor" />
    </svg>
  )
}
