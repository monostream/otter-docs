<script setup lang="ts">
import { htmlUnescape } from '@vuepress/shared';
import { computed, ref } from 'vue';
import mermaid from 'mermaid/dist/mermaid.esm.min.mjs';

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  }
})

const svg = ref('')

if (document) {
  // skip for server service rendering
  mermaid.initialize({ startOnLoad:true })

  mermaid.render(props.id, htmlUnescape(props.code), (rendered) => {
    svg.value = rendered
  })
}

</script>
<template>
<div v-if="!svg">Loading diagram…</div>

<div v-html="svg"></div>
</template>