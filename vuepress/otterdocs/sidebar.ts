import { readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path';
import { SidebarConfig, SidebarGroupCollapsible, SidebarItem } from 'vuepress';

const contentDir = 'docs'
const basePath = join(__dirname, '..')

export const getSidebar = () => {
  const sidebar: SidebarConfig = {}

  readdirSync(join(basePath, contentDir))
    // Filter out hidden directories and files
    .filter(entry => !entry.startsWith('.'))
    // Filter out top-level readme.md
    .filter(entry => entry.toLowerCase() !== 'readme.md')
    // Generate sidebar for each top-level directory
    .forEach(entry => {
      sidebar[join('/', contentDir, basename(entry, extname(entry)))] = [getSidebarItems(join(contentDir, entry))]
    })

  return sidebar
}

export const getSidebarItems = (path: string): (SidebarItem | SidebarGroupCollapsible | string) => {
  if (extname(path) === '.md') {
    if (basename(path).toLowerCase() === 'readme.md') {
      // The readme.md is represented by it's parent directory in the sidebar, so we don't return an item
      return undefined
    }

    return join('/', path)
  }

  if (!statSync(join(basePath, path)).isDirectory()) {
    return undefined
  }

  const children = readdirSync(join(basePath, path))
    .map(entry => getSidebarItems(join(path, entry)))
    // Filter out undefined items
    .filter(entry => !!entry)
    // Sort in ascending ASCII order
    .sort()

  return {
      text: basename(path),
      link: join('/', path, '/'),
      children
    }
}

const isString = (data: any): data is string =>  {
  return typeof data === 'string'
}
