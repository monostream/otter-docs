<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import Docs from './Docs.vue';

const open = ref(false)

const minSidebarWidth = 500;
const sidebarWidth = ref(minSidebarWidth);
const isMouseDown = ref(false);

const onMouseDown = () => {
  isMouseDown.value = true;
};

const onMouseUp = () => {
  isMouseDown.value = false;
};

let throttle = false;
const onMouseMove = (e: MouseEvent) => {
  if (!isMouseDown.value) {
    return;
  }

  if (throttle) {
    return;
  }

  throttle = true;

  setTimeout(() => throttle = false, 100);

  const newWidth = window.innerWidth - e.clientX;

  if (window.innerWidth - 100 <= newWidth || newWidth < minSidebarWidth) {
    return;
  }

  sidebarWidth.value = newWidth;
};

document.addEventListener('mouseup', onMouseUp);
document.addEventListener('mousemove', onMouseMove);

onUnmounted(() => {
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('mousemove', onMouseMove);
});

</script>

<template>
  <div
    class="absolute h-screen right-0 top-0 flex items-center transition-all"
    :style="{ width: (open ? sidebarWidth : 0) + 'px'}"
  >
    <div
      class="flex items-center justify-center transform rotate-180 h-36 top-1/2 absolute left-0 -ml-10 bg-indigo-500 px-2 rounded-r-lg cursor-pointer text-indigo-50 transition-all shadow-lg hover:bg-indigo-400"
      style="writing-mode: vertical-lr; text-orientation: sideways;"
      @click="open = !open"
    >
      {{ open ? 'Close' : 'Open' }} Otter Docs
    </div>
    <div
      class="h-full w-1 bg-gray-900 hover:bg-indigo-700 transition-all"
      style="cursor: ew-resize"
      :class="{ 'block': open, 'hidden': !open, 'bg-indigo-700': isMouseDown }"
      @mousedown="onMouseDown"
    />

    <Docs :class="{ 'pointer-events-none': isMouseDown, 'block': open, 'hidden': !open }" />
  </div>
</template>