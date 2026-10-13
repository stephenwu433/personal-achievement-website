export const loadAbout = () => import('@/src/pages/About')
export const loadInternships = () => import('@/src/pages/Internships')
export const loadProjects = () => import('@/src/pages/Projects')
export const loadSkills = () => import('@/src/pages/Skills')
export const loadCapability = () => import('@/src/pages/Capability')

export function preloadRoute(path: string) {
  if (path === '/about') return loadAbout()
  if (path === '/internships') return loadInternships()
  if (path === '/projects') return loadProjects()
  if (path === '/skills') return loadSkills()
  if (path.startsWith('/skills/')) return loadCapability()
  return Promise.resolve()
}
