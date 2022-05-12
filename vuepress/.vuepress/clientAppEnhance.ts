import { defineClientAppEnhance } from '@vuepress/client'
import { initClient } from '../otterdocs/init';

export default defineClientAppEnhance(async (context) => {
  initClient(context)
})
