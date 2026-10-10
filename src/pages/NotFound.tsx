import { Link } from 'react-router-dom'
import SiteHeader from '@/src/components/SiteHeader'

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-24">
        <h1 className="text-4xl font-medium" style={{ fontFamily: '"Noto Serif SC", serif' }}>
          这一页不存在
        </h1>
        <Link to="/skills" className="w-fit text-sm underline underline-offset-4">
          返回能力总览
        </Link>
      </main>
    </div>
  )
}
