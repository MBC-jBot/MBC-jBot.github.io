import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import AdventureHome from './components/AdventureHome.vue'
import DocTop from './components/DocTop.vue'
import LevelClear from './components/LevelClear.vue'
import './style.css'

// 闖關冒險風：首頁加出發方式＋冒險地圖，內頁上方任務卡／插圖、下方過關按鈕
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-after': () => h(AdventureHome),
      'doc-before': () => h(DocTop),
      'doc-footer-before': () => h(LevelClear),
    })
  },
}
