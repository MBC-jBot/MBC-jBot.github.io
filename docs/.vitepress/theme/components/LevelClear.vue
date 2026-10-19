<script setup>
// 課程頁最下方：「我過關了！」→ 記在這台電腦，首頁地圖會亮星星；接著帶到下一關
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { LEVELS, levelOf, loadCleared, saveCleared } from '../levels.js'

const route = useRoute()
const level = computed(() => levelOf(route.path))
const next = computed(() => level.value && LEVELS.find((l) => l.n === level.value.n + 1))
const cleared = ref(false)
const party = ref(false)

function sync() { cleared.value = !!level.value && loadCleared().has(level.value.n) }
onMounted(sync)
watch(() => route.path, () => { party.value = false; sync() })

function toggle() {
  const set = loadCleared()
  if (cleared.value) set.delete(level.value.n); else set.add(level.value.n)
  saveCleared(set)
  cleared.value = !cleared.value
  party.value = cleared.value
}
</script>

<template>
  <section v-if="level" class="jb-clear" :class="{ done: cleared }" aria-live="polite">
    <div v-if="party" class="jb-confetti" aria-hidden="true"><i v-for="i in 18" :key="i" /></div>
    <p class="jb-clear-title">{{ cleared ? '🏆 過關成功！' : '🚩 任務完成了嗎？' }}</p>
    <p class="jb-clear-text">
      {{ cleared ? '太厲害了！首頁的冒險地圖已經幫你亮起這一關。' : '小車照著你的程式動起來了，就按下面的按鈕蓋章過關！' }}
    </p>
    <div class="jb-clear-actions">
      <button type="button" class="jb-btn" :class="cleared ? 'ghost' : 'primary'" @click="toggle">
        {{ cleared ? '取消過關紀錄' : '我過關了！' }}
      </button>
      <a v-if="next" class="jb-btn" :class="cleared ? 'primary' : 'ghost'" :href="withBase(next.path)">
        下一關：{{ next.title }} →
      </a>
      <a v-else class="jb-btn" :class="cleared ? 'primary' : 'ghost'" :href="withBase('/#map')">回冒險地圖 →</a>
    </div>
    <p class="jb-clear-note">過關紀錄只存在這台電腦的瀏覽器裡。</p>
  </section>
</template>
