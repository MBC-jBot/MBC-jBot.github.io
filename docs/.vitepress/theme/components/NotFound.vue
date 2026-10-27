<script setup>
// 404 頁：分兩種情況
// 1. 網址真的不存在 → 「找不到這一頁」＋關卡清單
// 2. 頁面存在但內容抓不到（離線、網路中斷）→ 請使用者連上網路後重新整理；預設 404 會讓人以為網頁壞了
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { LEVELS } from '../levels.js'

const route = useRoute()
const loadFail = ref(false)

// 網址 → VitePress 頁面清單的鍵（/guide/blocks/remote.html → guide_blocks_remote.md）
function pageKey(path) {
  let p = decodeURI(path).replace(/^\//, '').replace(/\.html$/, '')
  if (p === '' || p.endsWith('/')) p += 'index'
  return p.replace(/\//g, '_') + '.md'
}

function reload() { location.reload() }

onMounted(() => {
  const map = window.__VP_HASH_MAP__ || {}
  loadFail.value = !navigator.onLine || pageKey(route.path) in map
  if (loadFail.value) window.addEventListener('online', reload)
})
onBeforeUnmount(() => window.removeEventListener('online', reload))
</script>

<template>
  <div class="jb-nf">
    <template v-if="loadFail">
      <p class="jb-nf-icon" aria-hidden="true">📡</p>
      <h1 class="jb-nf-title">這一頁沒有載入成功</h1>
      <p class="jb-nf-text">
        目前好像沒有連上網路，所以抓不到這一頁的內容（網頁本身沒有壞）。<br>
        請確認網路連線後，按下面的按鈕或鍵盤的 <kbd>F5</kbd> 重新整理。
      </p>
      <div class="jb-nf-actions">
        <button type="button" class="jb-btn primary" @click="reload">重新整理</button>
      </div>
      <p class="jb-nf-note">網路恢復時，這一頁會自動重新整理。</p>
    </template>

    <template v-else>
      <p class="jb-nf-icon" aria-hidden="true">🗺️</p>
      <h1 class="jb-nf-title">找不到這一頁</h1>
      <p class="jb-nf-text">網址可能打錯了，或這一頁已經搬家。從下面選一關繼續冒險吧！</p>
      <ol class="jb-nf-levels">
        <li v-for="l in LEVELS" :key="l.n">
          <a :href="withBase(l.path + '.html')">
            <span class="jb-nf-n">{{ l.n === 0 ? '出發' : '第 ' + l.n + ' 關' }}</span>{{ l.sub }}
          </a>
        </li>
      </ol>
      <div class="jb-nf-actions">
        <a class="jb-btn primary" :href="withBase('/')">回首頁</a>
        <a class="jb-btn ghost" href="https://jbot-block-ide.mbcrobot.workers.dev" target="_blank" rel="noopener">開啟網頁版編程 ↗</a>
      </div>
    </template>
  </div>
</template>

<style scoped>
.jb-nf { max-width: 560px; margin: 0 auto; padding: 56px 24px 96px; text-align: center; }
.jb-nf-icon { font-size: 56px; line-height: 1; }
.jb-nf-title { margin-top: 16px; font-size: 26px; font-weight: 900; line-height: 1.3; }
.jb-nf-text { margin-top: 12px; color: var(--vp-c-text-2); line-height: 1.8; }
.jb-nf-text kbd { padding: 0 6px; border: 1px solid var(--vp-c-divider); border-radius: 4px; font-family: inherit; }
.jb-nf-levels { margin: 24px 0 0; padding: 0; list-style: none; text-align: left; }
.jb-nf-levels li + li { margin-top: 8px; }
.jb-nf-levels a { display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 8px 16px; border: 2px solid var(--vp-c-divider);
  border-radius: 12px; color: var(--vp-c-text-1); text-decoration: none; font-weight: 700; }
.jb-nf-levels a:hover { border-color: var(--vp-c-brand-1); }
.jb-nf-n { flex: none; min-width: 4.5em; color: var(--vp-c-brand-1); }
.jb-nf-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 24px; }
.jb-nf-note { margin-top: 16px; font-size: 14px; color: var(--vp-c-text-3); }
</style>
