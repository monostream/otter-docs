import { readdirSync, statSync } from "fs"
import { join } from "path"
import { NavbarConfig } from "vuepress"

const contentDir = 'docs'
const contentPath = join(__dirname, '..', contentDir)

const basePath = join('/', contentDir)

export const getNavigation = () => {
  const entries = readdirSync(contentPath)
  const result: NavbarConfig = []

  for (const entry of entries) {
    const stat = statSync(join(contentPath, entry))

    if (stat.isDirectory()) {
      if (entry.startsWith('.')) {
        continue
      }

      result.push({
        text: entry,
        link: join('/', contentDir, entry, '/')
      })
    }
  }

  // Sort in ascending ASCII order
  result.sort()

  return result
}