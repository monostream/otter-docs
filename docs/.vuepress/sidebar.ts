import { readdirSync, statSync } from 'fs'
import { join, extname } from 'path';

const BASE_PATH = join(__dirname, '..', 'guide')

export const getNavbar = () => {
  const entries = readdirSync(BASE_PATH)
  const result = []

  for (const entry of entries) {
    const stat = statSync(join(BASE_PATH, entry))

    if (stat.isDirectory() || extname(entry).toLowerCase() === '.md') {
      if (entry === '.git') {
        continue
      }

      result.push(join('/guide', entry, '/'))
    }
  }

  return result
}

export const getSidebar = () => {
  const entries = readdirSync(BASE_PATH)
  const result: Record<string, string[]> = {}

  for (const entry of entries) {
    const stat = statSync(join(BASE_PATH, entry))

    if (!stat.isDirectory()) {
      continue
    }

    const key = join('/guide', entry, '/')

    result[key] = []

    const subEntries = readdirSync(join(BASE_PATH, entry))

    for (const subEntry of subEntries) {
      if (extname(subEntry).toLowerCase() === '.md') {
        result[key].push(join('/guide', entry, subEntry))
      }
    }
  }

  return result
}
