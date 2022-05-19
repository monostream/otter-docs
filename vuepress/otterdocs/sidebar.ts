import { readdirSync, statSync } from 'fs'
import { join, extname } from 'path';

const contentDir = 'docs'
const contentPath = join(__dirname, '..', contentDir)

const basePath = join('/', contentDir)

export const getSidebar = () => {
  const entries = readdirSync(contentPath)
  const result: Record<string, string[]> = {}

  for (const entry of entries) {
    const stat = statSync(join(contentPath, entry))

    if (!stat.isDirectory() || entry.startsWith('.')) {
      continue
    }

    const key = join(basePath, entry, '/')

    result[key] = []

    const subEntries = readdirSync(join(contentPath, entry))

    for (const subEntry of subEntries) {
      if (extname(subEntry).toLowerCase() === '.md') {
        result[key].push(join(basePath, entry, subEntry))
      }
    }

    // Sort in ascending ASCII order
    result[key].sort()
    const readmeIndex = result[key].findIndex(e => e.toLowerCase().endsWith('readme.md'))

    if (readmeIndex != undefined) {
      const readme = result[key].splice(readmeIndex, 1)
      result[key].unshift(readme[0])
    }
  }

  return result
}
