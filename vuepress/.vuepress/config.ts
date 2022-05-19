import { defaultTheme, defineUserConfig } from 'vuepress'
import { registerMermaidPlugin } from '../mermaid/plugin'

import { registerOtterDocsPlugin } from '../otterdocs/plugin'
import { getSidebar } from '../otterdocs/sidebar'
import { getNavigation } from '../otterdocs/navigation'


export default defineUserConfig({
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  title: '2pack',
  dest: './dist',
  theme: defaultTheme({
    contributors: false,
    logo: '/logo.png',
    navbar: getNavigation(),
    sidebar: getSidebar(),
  }),
  plugins: [
    registerOtterDocsPlugin(),
    registerMermaidPlugin()
  ]
})