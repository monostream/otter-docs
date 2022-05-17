import { resolve } from "path";
import { App, PluginFunction } from "vuepress";

const { registerComponentsPlugin } = require('@vuepress/plugin-register-components')

export const registerMermaidPlugin = (): PluginFunction[] => {
  const mermaid = (app: App) => {
    return {
      name: 'vuepress-plugin-mermaid',
      multiple: false,
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