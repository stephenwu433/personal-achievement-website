import { useRef, useState } from 'react'
import SiteHeader from '@/src/components/SiteHeader'

type Node = {
  id: string
  label: string
  x: number
  y: number
}

const initialNodes: Node[] = [
  { id: 'language', label: '语言和工程', x: 32, y: 36 },
  { id: 'tools', label: '工具', x: 68, y: 30 },
  { id: 'direction', label: '方向', x: 48, y: 58 },
]

export default function Skills() {
  const [nodes, setNodes] = useState(initialNodes)
  const drag = useRef<{ id: string } | null>(null)
  const field = useRef<HTMLDivElement>(null)

  const move = (id: string, clientX: number, clientY: number) => {
    const bounds = field.current?.getBoundingClientRect()
    if (!bounds) return
    const x = ((clientX - bounds.left) / bounds.width) * 100
    const y = ((clientY - bounds.top) / bounds.height) * 100
    setNodes((current) =>
      current.map((node) =>
        node.id === id
          ? {
              ...node,
              x: Math.min(82, Math.max(18, x)),
              y: Math.min(78, Math.max(22, y)),
            }
          : node,
      ),
    )
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#241826] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#5a3d55,transparent_42%)]" />
      <SiteHeader overlay />
      <main className="relative z-10 flex min-h-dvh flex-col px-5 pt-36 pb-8">
        <div className="text-center">
          <p className="text-xs tracking-[0.22em] text-white/65 uppercase">个人能力</p>
          <h2 className="mt-2 text-3xl font-semibold">拖动这些点</h2>
          <p className="mt-2 text-sm text-white/65">具体能力之后放进对应的点里。</p>
        </div>
        <div ref={field} className="relative mt-4 min-h-[460px] flex-1">
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            {nodes.slice(1).map((node) => (
              <line
                key={node.id}
                x1={`${nodes[0].x}%`}
                y1={`${nodes[0].y}%`}
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke="rgba(255,255,255,0.28)"
              />
            ))}
          </svg>
          {nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className="absolute grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/10 text-sm backdrop-blur-md"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onPointerDown={(event) => {
                drag.current = { id: node.id }
                event.currentTarget.setPointerCapture(event.pointerId)
              }}
              onPointerMove={(event) => {
                if (drag.current?.id !== node.id) return
                move(node.id, event.clientX, event.clientY)
              }}
              onPointerUp={() => {
                drag.current = null
              }}
            >
              {node.label}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
