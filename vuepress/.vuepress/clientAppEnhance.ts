import { defineClientAppEnhance } from '@vuepress/client'

declare var __VUEPRESS_SSR__: boolean;

export interface Config {
  portalUrl: string;
}

export default defineClientAppEnhance(async ({ app, router, siteData }) => {
  if (__VUEPRESS_SSR__) {
    // skip for server service rendering
    return
  }

  const config: Config = await fetch('/environment.json').then((res) => res.json());

  window.top.postMessage('/2pack/ready', config.portalUrl)

  window.addEventListener('message', ({data}) => {
    if (data?.event == '/2pack/navigate') {
      console.log(data.path)
      router.push(data.path)
    }

    // example event
    // if (data?.event == '/2pack/docker/variables') {
    //   app.provide('docker/registry', data.registry)
    // }
  });
})