import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const mode = process.argv[2]
const dist = path.resolve('dist')
const filePattern = '(?<!\\.)/(?:photos|fonts|backgrounds|projects|internships|skills|city|assets)/[^"\'`\\s)]+?\\.(?:webp|jpe?g|png|svg|woff2|ttf|mp4|webm|gif)'

if (mode !== 'relative' && mode !== 'pages') {
  console.error('usage: node scripts/prefix-public.mjs <relative|pages>')
  process.exit(1)
}

async function filesIn(dir) {
  const found = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) found.push(...(await filesIn(full)))
    else if (/\.(html|css|js|svg)$/.test(entry.name)) found.push(full)
  }
  return found
}

function rewrite(text, file) {
  const css = file.endsWith('.css')
  const pages = '/personal-achievement-website'
  return text.replace(new RegExp(filePattern, 'g'), (match) => {
    if (mode === 'pages') return `${pages}${match}`
    return `${css ? '..' : '.'}${match}`
  })
}

const files = await filesIn(dist)
let changed = 0
for (const file of files) {
  const before = await readFile(file, 'utf8')
  const after = rewrite(before, file)
  if (after !== before) {
    await writeFile(file, after)
    changed += 1
  }
}

if (mode === 'pages') await copyFile(path.join(dist, 'index.html'), path.join(dist, '404.html'))
console.log(`rewrote ${changed} files in dist (${mode})`)
