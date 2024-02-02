import { readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path';
import { SidebarConfig, SidebarGroup, SidebarGroupCollapsible, SidebarItem } from 'vuepress';

const contentDir = 'docs'
const basePath = join(__dirname, '..')

export const getSidebar = (): SidebarConfig => {
  const sidebar: SidebarConfig = searchForMarkdownFiles(contentDir)

  return sidebar
}

const searchForMarkdownFiles = (directory: string): (string | SidebarGroup)[] => {
  const entries = readdirSync(join(basePath, directory))
    // Filter out hidden directories and files
    .filter(entry => !entry.startsWith('.'))

  const result: (string | SidebarGroup)[] = []

  for (const entry of entries) {
    const isDirectory = statSync(join(basePath, directory, entry)).isDirectory()

    if (isDirectory) {
      const children = searchForMarkdownFiles(join(directory, entry))

      // ignore directories without .md files
      if (children.length <= 0) {
        continue
      }

      result.push({
        text: entry,
        link: join('/', directory, entry),
        children
      })

      continue
    }
    
    if (extname(entry) !== '.md') {
      // ignore all files except .md
      continue
    }

    result.push(join('/', directory, entry))
  }

  return result
}
