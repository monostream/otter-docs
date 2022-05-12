<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { initHost } from './otterdocs';

// const docsUrl = "https://docs.indigo.tribbles.cloud/"
const docsUrl = "http://localhost:8080"

const iframe = ref<HTMLIFrameElement | null>(null);
const isConnected = ref(false);

const emits = defineEmits(['connected'])

onMounted(async () => {
  if (!iframe.value) {
    console.warn('iframe ref is undefined');
    return;
  }

  if (!iframe.value.contentWindow) {
    console.warn('iframe contentWindow is undefined');
    return;
  }

  isConnected.value = await initHost(iframe.value.contentWindow, useRouter())

  emits('connected', isConnected.value)
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