import { defineUserConfig } from '@vuepress/cli'
import { otterDocs } from '../otterdocs/plugin'
import { getNavbar, getSidebar } from '../otterdocs/sidebar'

export default defineUserConfig({
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  title: '2pack',
  dest: './dist',
  themeConfig: {
    contributors: false,
    logo: '/logo.png',
    navbar: getNavbar(),
    sidebar: getSidebar(),
  },
  plugins: [
    [
      "@renovamen/vuepress-plugin-mermaid", {
        theme: "default",
        darkTheme: "dark",
        darkSelector: "html",
        darkClass: "dark"
      }
    ],
    otterDocs()
  ]
})