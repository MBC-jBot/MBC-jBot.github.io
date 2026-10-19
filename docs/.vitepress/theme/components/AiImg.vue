<script setup>
// AI 插圖：先用 512 寬小圖、大螢幕用 1024；圖還沒生出來時改顯示小車實物照，不會破圖
// （預先渲染的頁面在 Vue 接手前圖片就可能已經載入失敗，所以掛載時要再檢查一次）
import { ref, onMounted } from 'vue'
import { imgSrc } from '../levels.js'
defineProps({ name: String, alt: String, eager: Boolean })
const missing = ref(false)
const el = ref(null)
onMounted(() => { const i = el.value; if (i && i.complete && !i.naturalWidth) missing.value = true })
</script>

<template>
  <img v-if="!missing" ref="el" class="ai-img" :src="imgSrc(name, true)"
    :srcset="`${imgSrc(name, true)} 512w, ${imgSrc(name)} 1024w`" sizes="(max-width: 640px) 100vw, 720px"
    width="1024" height="576" :alt="alt" :loading="eager ? 'eager' : 'lazy'" decoding="async" @error="missing = true" />
  <img v-else class="ai-img is-fallback" src="/images/cover.webp" width="1024" height="576" :alt="alt" loading="lazy" />
</template>
