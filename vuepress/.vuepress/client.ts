import { defineClientConfig, resolvers } from '@vuepress/client'
import { initClient } from '../otterdocs/init';

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    initClient(app, router, siteData)
  }
})
