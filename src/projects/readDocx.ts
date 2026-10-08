/** 从 docx 里取出正文，供页面内阅读，不触发下载。 */

export async function readDocxText(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error('missing')
  const xml = await unzipEntry(new Uint8Array(await response.arrayBuffer()), 'word/document.xml')
  return new TextDecoder()
    .decode(xml)
    .replace(/<w:p\b[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function unzipEntry(data: Uint8Array, name: string) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  let eocd = -1
  for (let index = data.length - 22; index >= Math.max(0, data.length - 22 - 65536); index -= 1) {
    if (view.getUint32(index, true) === 0x06054b50) {
      eocd = index
      break
    }
  }
  if (eocd < 0) throw new Error('zip')
  const count = view.getUint16(eocd + 10, true)
  let pointer = view.getUint32(eocd + 16, true)
  for (let index = 0; index < count; index += 1) {
    if (view.getUint32(pointer, true) !== 0x02014b50) throw new Error('directory')
    const method = view.getUint16(pointer + 10, true)
    const size = view.getUint32(pointer + 20, true)
    const nameLength = view.getUint16(pointer + 28, true)
    const extraLength = view.getUint16(pointer + 30, true)
    const commentLength = view.getUint16(pointer + 32, true)
    const localOffset = view.getUint32(pointer + 42, true)
    const entryName = new TextDecoder().decode(data.subarray(pointer + 46, pointer + 46 + nameLength))
    pointer += 46 + nameLength + extraLength + commentLength
    if (entryName !== name) continue
    const localNameLength = view.getUint16(localOffset + 26, true)
    const localExtraLength = view.getUint16(localOffset + 28, true)
    const start = localOffset + 30 + localNameLength + localExtraLength
    const compressed = data.subarray(start, start + size)
    if (method === 0) return compressed
    if (method !== 8) throw new Error('method')
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
    return new Uint8Array(await new Response(stream).arrayBuffer())
  }
  throw new Error('entry')
}
