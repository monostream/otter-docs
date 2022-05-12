<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const docsUrl = "https://docs.indigo.tribbles.cloud/"

const router = useRouter();
const route = useRoute();
let isReady = false;
const iframe = ref<HTMLIFrameElement | null>(null);

router.afterEach((to) => {
  if (!isReady) {
    return
  }

  const msg = { event: '/otter-docs/navigate', path: to.fullPath};

  iframe.value?.contentWindow?.postMessage(msg, docsUrl);
});

onMounted(() => {
  if (!iframe.value) {
    console.warn('iframe ref is undefined');
    return;
  }

  if (!iframe.value.contentWindow) {
    console.warn('iframe contentWindow is undefined');
    return;
  }

  window.addEventListener('message', (event) => {
    console.log({ event })

    if (event.data === '/otter-docs/ready') {
      if (!iframe.value?.contentWindow) {
        return;
      }

      isReady = true;

      const data = { event: '/otter-docs/navigate', path: route.meta?.docsPath };

      iframe.value?.contentWindow?.postMessage(data, docsUrl);
    }
  });
});
</script>

<template>
  <iframe
    ref="iframe"
    title="Documentation"
    :src="docsUrl"
    class="h-screen w-full"
  />

</template>