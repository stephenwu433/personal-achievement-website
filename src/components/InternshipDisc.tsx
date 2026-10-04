import type { Internship } from '@/src/content'

const hole = '#e6e3dc'

export default function InternshipDisc({ item }: { item: Internship }) {
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
        <img
          src={item.image}
          alt=""
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: item.imagePosition }}
        />
        <p
          className="absolute inset-x-[8%] top-[14%] text-center text-white"
          style={{ fontSize: '7.5cqi', textShadow: '0 1px 6px rgba(0,0,0,0.45)' }}
        >
          {item.title}
        </p>
      </div>
      <div
        className="absolute top-1/2 left-1/2 size-[31%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'conic-gradient(from 80deg, #f4f4f4, #c8c8c8, #fafafa, #9d9d9d, #e7e7e7, #b0b0b0, #f4f4f4)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 size-[15.5%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: hole, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }}
      />
    </div>
  )
}
