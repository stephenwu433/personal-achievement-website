import { flushSync } from 'react-dom'
import type { NavigateFunction } from 'react-router-dom'

export function openCapability(navigate: NavigateFunction, to: string) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || typeof document.startViewTransition !== 'function') {
    navigate(to)
    return
  }
  document.startViewTransition(() => {
    flushSync(() => {
      navigate(to)
    })
  })
}
