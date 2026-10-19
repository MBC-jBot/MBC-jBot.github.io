<script setup>
// 內頁最上方：課程頁顯示「任務卡」，其他頁有設定插圖就顯示頁首插圖
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { levelOf, BANNERS, norm } from '../levels.js'
import AiImg from './AiImg.vue'
import Stars from './Stars.vue'

const route = useRoute()
const level = computed(() => levelOf(route.path))
const banner = computed(() => BANNERS[norm(route.path)])
</script>

<template>
  <section v-if="level" class="jb-mission" :aria-label="`第 ${level.n} 關任務卡`">
    <div class="jb-mission-art">
      <AiImg :name="level.img" :alt="`第 ${level.n} 關：${level.title}`" eager />
      <span class="jb-level-tag">{{ level.n === 0 ? '起點' : `第 ${level.n} 關` }}</span>
    </div>
    <div class="jb-mission-body">
      <p class="jb-mission-kicker">任務：{{ level.title }}</p>
      <ul class="jb-mission-facts">
        <li><span class="k">🎯 目標</span><span>{{ level.goal }}</span></li>
        <li><span class="k">🧰 準備</span><span class="chips"><span v-for="x in level.need" :key="x" class="chip">{{ x }}</span></span></li>
        <li><span class="k">⏱️ 時間</span><span>{{ level.time }}</span></li>
        <li><span class="k">⭐ 難度</span><Stars :n="level.stars" /></li>
      </ul>
    </div>
  </section>
  <figure v-else-if="banner" class="jb-banner">
    <AiImg :name="banner.img" :alt="banner.alt" eager />
  </figure>
</template>
