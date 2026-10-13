import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import Home from '@/src/pages/Home'
import { loadAbout, loadInternships, loadProjects, loadSkills, loadCapability } from '@/src/routeLoaders'

const About = lazy(loadAbout)
const Internships = lazy(loadInternships)
const Projects = lazy(loadProjects)
const Skills = lazy(loadSkills)
const Capability = lazy(loadCapability)
const NotFound = lazy(() => import('@/src/pages/NotFound'))
const CircularGalleryDemo = lazy(() => import('@/src/demo'))

function RouteFallback() {
  return <div className="min-h-dvh bg-[#f3f1ec]" />
}

function AppRouter({ children }: { children: ReactNode }) {
  if (import.meta.env.VITE_HASH_ROUTER === 'true') return <HashRouter>{children}</HashRouter>
  const raw = import.meta.env.BASE_URL || '/'
  const basename = raw === '/' || raw === './' ? undefined : raw.replace(/\/$/, '')
  return <BrowserRouter basename={basename}>{children}</BrowserRouter>
}

export default function App() {
  return (
    <AppRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/skills/:id" element={<Capability />} />
          <Route path="/demo" element={<CircularGalleryDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppRouter>
  )
}
