import { defineUserConfig } from '@vuepress/cli'
import { getNavbar, getSidebar } from './sidebar'

export default defineUserConfig({
  head: [
    ['link', { rel: 'icon', href: '/images/favicon.png' }]
  ],
  title: '2pack',
  dest: './dist',
  themeConfig: {
    contributors: false,
    logo: '/images/logo.png',
    navbar: getNavbar(),
    sidebar: getSidebar(),
  },
  plugins: [
    'vuepress-plugin-mermaidjs'
  ]
})