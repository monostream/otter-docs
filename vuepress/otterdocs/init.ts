import { pathToRegexp } from 'path-to-regexp';
import { Router } from 'vue-router';
import { Config } from './plugin';

declare var __VUEPRESS_SSR__: boolean;

interface OtterDocsEvent {
  event: string;
}

interface NavigateEvent extends OtterDocsEvent {
  path: string;
}

const bindings: Map<RegExp, string> = new Map()

export const initClient = (async ({ app, router, siteData }) => {
  if (__VUEPRESS_SSR__) {
    // skip for server service rendering
    return
  }

  const config = await loadConfig()
  
  parseBindings(config);
  setColors(config);

  ready();

  window.addEventListener('message', listener(router));
})

const ready = () => {
  window.top.postMessage('/otter-docs/ready', '*')
}

const listener = (router) => {
  return (event: MessageEvent<NavigateEvent>) => {
    if (event.source === window) {
      // our own event
      return
    }
    
    console.log('got event: ', event)
  
    switch (event.data?.event) {
      case '/otter-docs/navigate':
        handleNavigation(event, router)
        
        break;
    
      default:
        break;
    }
  }
} 

const loadConfig = async (): Promise<Config> => {
  let config: Config = {}

  try {
    config = await fetch('/config.json').then((res) => res.json());
  } catch (error) {
    console.warn('failed to fetch bindings.json: ', error)
  }

  return config
}

const parseBindings = (config: Config) => {
  if (config.bindings) {
    for (const hostPath of Object.keys(config.bindings)) {
      const regexp = pathToRegexp(hostPath)

      bindings.set(regexp, bindings[hostPath])
    }
  }
}

const handleNavigation = async (event: MessageEvent<NavigateEvent>, router: Router) => {
  const hostPath = event.data.path

  for (const regexp of bindings.keys()) {
    const match = regexp.exec(hostPath)

    if (match.length < 1) {
      console.log('no match for: ', hostPath)

      return
    }

    const docsPath = bindings.get(regexp)

    await router.push(docsPath)

    break;
  }
}

const setColors = (config: Config) => {
  if (!config.colors) {
    return
  }

  const light = document.querySelector<HTMLElement>(':root')

  if (config.colors.brand) {
    light.style.setProperty('--c-brand', config.colors.brand)
  }

  if (config.colors.brandLight) {
    light.style.setProperty('--c-brand-light', config.colors.brandLight)
  }
}
