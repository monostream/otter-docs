import { defineClientAppEnhance } from '@vuepress/client'

declare var __VUEPRESS_SSR__: boolean;

interface OtterDocsEvent {
  event: string;
}

interface NavigateEvent extends OtterDocsEvent {
  path: string;
}

export default defineClientAppEnhance(async ({ app, router, siteData }) => {
  if (__VUEPRESS_SSR__) {
    // skip for server service rendering
    return
  }

  const bindings: Record<string, string> = await fetch('/__bindings.json').then((res) => res.json());

  window.top.postMessage('/otter-docs/ready', '*')

  window.addEventListener('message', (event: MessageEvent<NavigateEvent>) => {
    console.log({ event })

    if (event.data?.event == '/otter-docs/navigate') {
      const docsPath = bindings[event.data.path]

      if (docsPath) {
        router.push(docsPath)
      }
      
      console.log(event.data.path)
    }
  });
})