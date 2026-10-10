import { flushSync } from 'react-dom'
import type { NavigateFunction } from 'react-router-dom'

export function openCapability(navigate: NavigateFunction, to: string, state?: unknown) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || typeof document.startViewTransition !== 'function') {
    navigate(to, { state })
    return
  }
  document.startViewTransition(() => {
    flushSync(() => {
      navigate(to, { state })
    })
  })
}
