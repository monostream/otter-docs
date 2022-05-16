import { Router } from "vue-router";

enum OtterDocsEvents {
  Ready = '/otter-docs/ready',
  Navigate = '/otter-docs/navigate',
  Inject = '/otter-docs/inject',
}

type OtterDocsEvent = ReadyEvent | NavigateEvent | InjectEvent;

interface ReadyEvent {
  type: OtterDocsEvents.Ready;
}

interface NavigateEvent {
  type: OtterDocsEvents.Navigate;
  path: string;
}

interface InjectEvent {
  type: OtterDocsEvents.Inject;
  variables: Record<string, any>;
}

let iframeWindow: (Window | undefined) = undefined

export const initHost = (contentWindow: Window, router: Router) => {
  iframeWindow = contentWindow

  const isReady = new Promise<boolean>((resolve, reject) => {
    window.addEventListener('message', listener(contentWindow, router, resolve));
  
    subscribeToNavigationEvents(contentWindow, router);
  });


  return isReady
}

const listener = (contentWindow: Window, router: Router, onReady: (ready: boolean) => void) => {
  return (event: MessageEvent<OtterDocsEvent>) => {
    if (event.source === window) {
      // ignore our own events
  
      return
    }
  
    console.debug('listener revieved event: ', event)
  
    switch (event.data?.type) {
      case OtterDocsEvents.Ready:
        handleReady(event.data, contentWindow, router.currentRoute.value.fullPath, onReady)
        
        break;
    
      default:
        break;
    }
  }
}

const sendMessage = (contentWindow: (Window | undefined), event: OtterDocsEvent) => {
  if (!contentWindow) {
    console.debug('host application is not yet ready to send event: ', event)

    return
  }

  contentWindow.postMessage(event, '*')
}

const handleReady = (event: ReadyEvent, contentWindow: Window, currentPath: string, onReady: (ready: boolean) => void) => {
  console.debug('host application is ready')

  onReady(true);

  const data: NavigateEvent = {
    type: OtterDocsEvents.Navigate, 
    path: currentPath
  };

  sendMessage(contentWindow, data);
}

const subscribeToNavigationEvents = (contentWindow: Window, router: Router) => {
  router.afterEach((to) => {
    const event: NavigateEvent = { 
      type: OtterDocsEvents.Navigate, 
      path: to.fullPath
    };

    sendMessage(contentWindow, event)
  });
}

export const injectVariables = (variables: Record<string, any>) => {
  const event: InjectEvent = {
    type: OtterDocsEvents.Inject,
    variables
  };

  sendMessage(iframeWindow, event);
}