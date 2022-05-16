import { defaultTheme, defineUserConfig } from 'vuepress'
import mermaidPlugin from '@renovamen/vuepress-plugin-mermaid'

import { otterDocs } from '../otterdocs/plugin'
import { getNavbar, getSidebar } from '../otterdocs/sidebar'

export default defineUserConfig({
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  title: '2pack',
  dest: './dist',
  theme: defaultTheme({
    contributors: false,
    logo: '/logo.png',
    navbar: getNavbar(),
    sidebar: getSidebar(),
  }),
  plugins: [
    // TODO: Mermaid plugin in not compatible with current vuepress v2 version
    // mermaidPlugin({
    //   theme: "default",
    //   darkTheme: "dark",
    //   darkSelector: "html",
    //   darkClass: "dark"
    // }),
    otterDocs()
  ]
})