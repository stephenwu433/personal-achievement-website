import { museCovers, visualTopics } from './museCase.data'

export type MuseAsset = {
  topicId: string
  src: string
  alt: string
  n: number
  file: string
}

const modules = import.meta.glob('/public/projects/muse-select/visual-archive/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function topicIdFromPath(path: string) {
  const rel = path.split('/visual-archive/')[1]
  if (!rel) return null
  const folder = decodeURIComponent(rel.split('/')[0] ?? '')
  return visualTopics.find((topic) => topic.path === folder)?.id ?? null
}

export function loadMuseAssets(): MuseAsset[] {
  const grouped = new Map<string, { src: string; file: string }[]>()
  for (const [path, src] of Object.entries(modules)) {
    const topicId = topicIdFromPath(path)
    const rel = path.split('/visual-archive/')[1]
    if (!topicId || !rel) continue
    const file = decodeURIComponent(rel.split('/').slice(1).join('/'))
    if (!file) continue
    const list = grouped.get(topicId) ?? []
    list.push({ src, file })
    grouped.set(topicId, list)
  }

  const assets: MuseAsset[] = []
  for (const topic of visualTopics) {
    const files = (grouped.get(topic.id) ?? []).sort((a, b) => a.file.localeCompare(b.file, 'zh', { numeric: true }))
    files.forEach((file, index) => {
      assets.push({
        topicId: topic.id,
        src: file.src,
        file: file.file,
        n: index + 1,
        alt: `Muse Select ${topic.label} 第 ${index + 1} 张视觉素材`,
      })
    })
  }
  return assets
}

export function coverSources(assets: MuseAsset[]) {
  return museCovers.map((cover) => {
    const found = assets.find((asset) => asset.topicId === cover.topicId && asset.file === cover.file)
    return {
      ...cover,
      src: found?.src ?? encodeURI(`/projects/muse-select/visual-archive/${cover.path}`),
      alt: found?.alt ?? `Muse Select ${visualTopics.find((topic) => topic.id === cover.topicId)?.label ?? ''} 第 1 张视觉素材`,
    }
  })
}
