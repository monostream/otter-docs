import { readdirSync, statSync } from 'fs'
import { join, extname } from 'path';

const contentDir = 'docs'
const contentPath = join(__dirname, '..', contentDir)

const basePath = join('/', contentDir)

export const getNavbar = () => {
  const entries = readdirSync(contentPath)
  const result = []

  for (const entry of entries) {
    const stat = statSync(join(contentPath, entry))

    if (stat.isDirectory()) {
      if (entry.startsWith('.')) {
        continue
      }

      result.push(join(basePath, entry, '/'))
    }
  }

  return result
}

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
  }

  return result
}
