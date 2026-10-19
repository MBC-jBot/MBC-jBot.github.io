<script setup>
// 首頁：出發方式三張卡＋冒險地圖（7 關，過關的亮星章）
import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { LEVELS, loadCleared } from '../levels.js'
import AiImg from './AiImg.vue'
import Stars from './Stars.vue'

const cleared = ref(new Set())
onMounted(() => { cleared.value = loadCleared() })

const MODES = [
  { img: 'mode_web', tag: '推薦', title: '網頁版（免安裝）', text: '打開 Chrome／Edge 就能拖積木、一鍵上傳到小車。', link: '/guide/web-start', cta: '從起點出發' },
  { img: 'mode_install', tag: '教室不能上網', title: '安裝版（MBC 圖控編程）', text: '安裝主程式後匯入 jBot 積木包，離線也能上課。', link: '/guide/graphic-programming', cta: '安裝與匯入' },
  { img: 'api_index', tag: '大朋友', title: 'Arduino C++ 進階', text: '國高中、大專生直接寫 C++，挑戰演算法與 PID。', link: '/api/', cta: '打開開發手冊' },
]
</script>

<template>
  <div class="jb-home">
    <section class="jb-section" aria-labelledby="jb-modes">
      <h2 id="jb-modes" class="jb-h2">選一種方式出發吧！</h2>
      <div class="jb-modes">
        <a v-for="m in MODES" :key="m.link" class="jb-mode" :href="withBase(m.link)">
          <AiImg :name="m.img" :alt="m.title" />
          <span class="jb-mode-body">
            <span class="jb-tag">{{ m.tag }}</span>
            <span class="jb-mode-title">{{ m.title }}</span>
            <span class="jb-mode-text">{{ m.text }}</span>
            <span class="jb-mode-cta">{{ m.cta }} →</span>
          </span>
        </a>
      </div>
    </section>

    <section id="map" class="jb-section" aria-labelledby="jb-map">
      <h2 id="jb-map" class="jb-h2">🗺️ jBot 冒險地圖</h2>
      <p class="jb-lead">從起點出發，一關一關解任務！每完成一關就按「我過關了」，這裡會幫你蓋上星章。
        <strong class="jb-progress">已過關 {{ cleared.size }} / {{ LEVELS.length }}</strong>
      </p>
      <ol class="jb-map">
        <li v-for="l in LEVELS" :key="l.n" class="jb-stop" :class="{ done: cleared.has(l.n) }">
          <span class="jb-node" aria-hidden="true">{{ cleared.has(l.n) ? '★' : (l.n === 0 ? '🚩' : l.n) }}</span>
          <a class="jb-stop-card" :href="withBase(l.path)">
            <AiImg :name="l.img" :alt="l.title" />
            <span class="jb-stop-body">
              <span class="jb-stop-n">{{ l.n === 0 ? '起點' : `第 ${l.n} 關` }}<span v-if="cleared.has(l.n)" class="jb-stamp">已過關</span></span>
              <span class="jb-stop-title">{{ l.title }}</span>
              <span class="jb-stop-sub">{{ l.sub }}</span>
              <Stars :n="l.stars" />
            </span>
          </a>
        </li>
      </ol>
    </section>
  </div>
</template>
