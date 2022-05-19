import { readdirSync, statSync } from "fs"
import { basename, extname, join } from "path"
import { NavbarConfig } from "vuepress"

const contentDir = 'docs'
const contentPath = join(__dirname, '..', contentDir)

export const getNavigation = () => {
  const entries: NavbarConfig = readdirSync(contentPath)
    // Get navigation item for each directory entry
    .map(entry => getNavItem(join('/', contentDir, entry)))
    // Filter out undefined items
    .filter(entry => !!entry)
    // Sort in ascending ASCII order
    .sort()

  return entries
}

export const getNavItem = (link: string) => {
  const extension = extname(link)
  const name = basename(link, extension).toLowerCase()

  // Markdown file
  if (extension === '.md') {
    if (name === 'readme') {
      return undefined
    }

    return link
  }

  // Directory
  if (statSync(join(__dirname, '..', link)).isDirectory()) {
    if (name.startsWith('.')) {
      return undefined
    }

    return {
      text: basename(link),
      link: join(link, '/'),
    }
  }

  return undefined
}