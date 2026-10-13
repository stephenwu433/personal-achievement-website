import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const vite = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))
const prefix = fileURLToPath(new URL('./prefix-public.mjs', import.meta.url))

const build = spawnSync(process.execPath, [vite, 'build', '--base', './'], {
  env: { ...process.env, VITE_HASH_ROUTER: 'true' },
  stdio: 'inherit',
})
if (build.error) throw build.error
if (build.status !== 0) process.exit(build.status || 1)

const rewrite = spawnSync(process.execPath, [prefix, 'relative'], { stdio: 'inherit' })
if (rewrite.error) throw rewrite.error
process.exit(rewrite.status || 0)
