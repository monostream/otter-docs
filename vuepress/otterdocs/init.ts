import { pathToRegexp } from 'path-to-regexp';
import { Router } from 'vue-router';
import { Config } from './plugin';

declare var __VUEPRESS_SSR__: boolean;

enum OtterDocsEvents {
  Ready = '/otter-docs/ready',
  Navigate = '/otter-docs/navigate',
}

type OtterDocsEvent = ReadyEvent | NavigateEvent;

interface ReadyEvent {
  type: OtterDocsEvents.Ready
}

interface NavigateEvent {
  type: OtterDocsEvents.Navigate
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

  sendMessage({ type: OtterDocsEvents.Ready })

  window.addEventListener('message', listener(router));
})

const sendMessage = (event: OtterDocsEvent) => {
  window.top.postMessage(event, '*')
}

const listener = (router) => {
  return (event: MessageEvent<OtterDocsEvent>) => {
    if (event.source === window) {
      // ignore our own events

      return
    }

    console.debug('listener revieved event: ', event)
  
    switch (event.data?.type) {
      case OtterDocsEvents.Navigate:
        handleNavigation(event.data, router)
        
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
  if (!config.bindings) {
    console.warn('no binding defined in config')

    return
  }

  for (const hostPath of Object.keys(config.bindings)) {
    const key = pathToRegexp(hostPath)
    const value = config.bindings[hostPath]

    bindings.set(key, value)
  }
}

const handleNavigation = async (event: NavigateEvent, router: Router) => {
  const hostPath = event.path

  console.debug('got host path: ', hostPath)
  
  for (const [regexp, docsPath] of bindings.entries()) {
    console.debug('check if host path matches with: ', regexp)

    const match = regexp.exec(hostPath)

    if (!match || match?.length < 1) {
      console.debug('no match for: ', hostPath);
      
      continue;
    }

    console.debug('match: ', match);
    console.debug('docs path: ', docsPath);

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
