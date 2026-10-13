export const COUNT_MS = 1600

export type ParsedCount = {
  prefix: string
  target: number
  suffix: string
  decimals: number
  commas: boolean
}

export function prefersReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function decimalPlaces(digits: string) {
  const plain = digits.replace(/,/g, '')
  const index = plain.indexOf('.')
  return index === -1 ? 0 : plain.length - index - 1
}

export function parseCount(raw: string): ParsedCount | null {
  const text = raw.trim()
  let match = /^(\d+(?:\.\d+)?)(\s*→\s*)(\d+(?:\.\d+)?)$/.exec(text)
  if (match) {
    return {
      prefix: `${match[1]}${match[2]}`,
      target: Number(match[3]),
      suffix: '',
      decimals: decimalPlaces(match[3]),
      commas: false,
    }
  }
  match = /^(↑\s*)(\d+(?:\.\d+)?)(%)$/.exec(text)
  if (match) {
    return { prefix: match[1], target: Number(match[2]), suffix: '%', decimals: decimalPlaces(match[2]), commas: false }
  }
  match = /^(提升\s*)(\d+(?:\.\d+)?)(%)$/.exec(text)
  if (match) {
    return { prefix: match[1], target: Number(match[2]), suffix: '%', decimals: decimalPlaces(match[2]), commas: false }
  }
  match = /^(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)(.*)$/.exec(text)
  if (!match) return null
  const digits = match[1]
  return {
    prefix: '',
    target: Number(digits.replace(/,/g, '')),
    suffix: match[2],
    decimals: decimalPlaces(digits),
    commas: digits.includes(','),
  }
}

export function formatCount(parsed: ParsedCount, current: number) {
  const digits = parsed.commas
    ? Math.round(current).toLocaleString('en-US')
    : parsed.decimals
      ? current.toFixed(parsed.decimals)
      : String(Math.round(current))
  return `${parsed.prefix}${digits}${parsed.suffix}`
}

/** Center of the node sits in the band a person is actually reading. */
export function inReadingZone(node: HTMLElement) {
  const scroller = node.closest('[data-internship-sheet]')
  if (!(scroller instanceof HTMLElement)) return true
  const view = scroller.getBoundingClientRect()
  const rect = node.getBoundingClientRect()
  if (rect.width <= 0 && rect.height <= 0) return false
  const mid = (rect.top + rect.bottom) / 2
  return mid > view.top + view.height * 0.08 && mid < view.bottom - view.height * 0.18
}

/** The card has faded in enough that a count or bar is visible while it moves. */
export function frameIsVisible(node: HTMLElement) {
  const frame = node.closest('[data-frame]')
  if (!(frame instanceof HTMLElement)) return true
  return Number(getComputedStyle(frame).opacity) >= 0.84
}
