<script setup>
defineProps({ n: Number })
</script>

<template>
  <span class="jb-stars" :aria-label="`難度 ${n} 顆星（滿分 3 顆）`" role="img">
    <svg v-for="i in 3" :key="i" viewBox="0 0 24 24" width="18" height="18" :class="{ on: i <= n }" aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
    </svg>
  </span>
</template>
