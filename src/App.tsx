import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CircularGalleryDemo from '@/src/demo'
import About from '@/src/pages/About'
import Home from '@/src/pages/Home'
import Internships from '@/src/pages/Internships'
import Projects from '@/src/pages/Projects'
import Capability from '@/src/pages/Capability'
import Skills from '@/src/pages/Skills'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/skills/:id" element={<Capability />} />
        <Route path="/demo" element={<CircularGalleryDemo />} />
      </Routes>
    </BrowserRouter>
  )
}
