import { defineClientConfig, resolvers } from '@vuepress/client'
import { initClient } from '../otterdocs/init';

export default defineClientConfig({
  enhance(context) {
    initClient(context)
  }
})
