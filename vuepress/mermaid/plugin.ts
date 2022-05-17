import { resolve } from "path";
import { App, PluginFunction } from "vuepress";
import { markdownItPlugin } from "./markdown-it";

const { registerComponentsPlugin } = require('@vuepress/plugin-register-components')

export const registerMermaidPlugin = (): PluginFunction[] => {
  const mermaid: PluginFunction = (app: App) => {
    return {
      name: 'vuepress-plugin-mermaid',
      multiple: false,
      extendsMarkdown: markdownItPlugin
    }
  }

  return [
    mermaid,
    registerComponentsPlugin({
      components: {
        Mermaid: resolve(__dirname, './components/Mermaid.vue'),
      },
    }),
  ]
}