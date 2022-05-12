import { App, PageData, PluginConfig, PluginOptions } from 'vuepress-vite'
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

export const otterDocs = (options?: Options): PluginConfig<PluginOptions> => {
  const sanatizedOptions = sanatizeOptions(options)

  const config = loadConfig(sanatizedOptions);

  return (app: App) => {
    return {
      name: 'vuepress-plugin-otter-docs',
      extendsPageData: extendsPageData(config),
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

const extendsPageData = (config: Config) => {
  return (page: PageData) => {
    const data: Partial<PageData> = {
      frontmatter: page.frontmatter
    }

    if (page.frontmatter.home) {
      data.frontmatter.heroText = config.name
      data.frontmatter.tagline = config.tagline

      if (config.getStartedLink) {
        data.frontmatter.actions = [{
          text: 'Get Started',
          link: '/docs/diagrams/',
          type: 'primary'
        }];
      }
    }

    return data
  }
}