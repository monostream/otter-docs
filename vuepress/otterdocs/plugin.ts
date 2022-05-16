import { App, Page, PageData, PluginFunction } from 'vuepress'
import { readFileSync } from 'fs'
import { join } from 'path'

export interface Config {
  name?: string;
  tagline?: string;
  getStartedLink?: string;
  bindings?: Record<string, string>
  colors?: {
    brand: string;
    brandLight: string;
  }
}

export interface Options {
  configPath?: string;
}

export interface SanatizedOptions {
  configPath: string;
}

export const otterDocs = (options?: Options): PluginFunction => {
  const sanatizedOptions = sanatizeOptions(options)

  const config = loadConfig(sanatizedOptions);

  return (app: App) => {
    return {
      name: 'vuepress-plugin-otter-docs',
      extendsPage: extendsPage(config),
      multiple: false,
    }
  }
}

const sanatizeOptions = (options?: Options): SanatizedOptions => {
  // set default values
  const sanatized: SanatizedOptions = {
    configPath: join('..', '.vuepress', 'public', 'config.json'),
  }

  if (options?.configPath) {
    sanatized.configPath = options.configPath;
  }

  return sanatized;
}

const loadConfig = (options: SanatizedOptions): Config => {
  const data = readFileSync(join(__dirname, options.configPath));

  const config: Config = JSON.parse(data.toString());
  
  return config
}

const extendsPage = (config: Config) => {
  return (page: Page, app: App) =>  {
    app.siteData.title = config.name

    if (page.frontmatter.home) {
      page.frontmatter.heroText = config.name
      page.frontmatter.tagline = config.tagline

      if (config.getStartedLink) {
        page.frontmatter.actions = [{
          text: 'Get Started',
          link: '/docs/diagrams/',
          type: 'primary'
        }];
      }
    }
  }
}