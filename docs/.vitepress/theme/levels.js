// 闖關冒險：關卡資料（首頁地圖、課程頁任務卡、過關按鈕共用）
// 插圖在 /images/ai/<img>.webp（1024 寬）與 <img>-sm.webp（512 寬），原檔與提示詞在 07_照片\AI插圖原檔
export const LEVELS = [
  {
    n: 0, path: '/guide/web-start', img: 'mode_web', stars: 1, time: '10 分鐘',
    title: '出發準備', sub: '打開網頁版、接上小車',
    goal: '打開網頁版，把第一支程式上傳到小車',
    need: ['MBC-jBot 小車', 'Type-C 傳輸線', '電腦＋Chrome／Edge'],
  },
  {
    n: 1, path: '/guide/blocks/motor', img: 'L1_motor', stars: 1, time: '20 分鐘',
    title: '走走停停碰碰車', sub: '馬達與精確移動',
    goal: '讓小車往前衝 1 秒，再緊急煞車停住',
    need: ['MBC-jBot 小車', 'Type-C 傳輸線'],
  },
  {
    n: 2, path: '/guide/blocks/display', img: 'L2_display', stars: 1, time: '20 分鐘',
    title: '專屬電子名牌', sub: '聲光與螢幕顯示',
    goal: '點亮紅燈，在螢幕上秀出 Hello 打招呼',
    need: ['MBC-jBot 小車', 'OLED 螢幕模組（選購）'],
  },
  {
    n: 3, path: '/guide/blocks/sensor', img: 'L3_sensor', stars: 2, time: '30 分鐘',
    title: '智慧防撞車', sub: '感測器與按鈕',
    goal: '前方 10 公分內有東西就自動煞車',
    need: ['MBC-jBot 小車', '雷射測距模組（選購）', '一面牆或紙箱'],
  },
  {
    n: 4, path: '/guide/blocks/remote', img: 'L4_remote', stars: 2, time: '30 分鐘',
    title: '無敵遙控機械臂', sub: 'PS2 遙控與伺服馬達',
    goal: '按下手把叉號鍵，讓伺服馬達轉到 90 度',
    need: ['MBC-jBot 小車', 'PS2 無線手把', '伺服馬達（選購）'],
  },
  {
    n: 5, path: '/guide/blocks/advanced', img: 'L5_encoder', stars: 3, time: '30 分鐘',
    title: '精準走地磚', sub: '序列埠與編碼器',
    goal: '不靠計時，用編碼器精準前進 600 步再停',
    need: ['MBC-jBot 小車', 'Type-C 傳輸線'],
  },
  {
    n: 6, path: '/guide/blocks/first-program', img: 'L6_final', stars: 3, time: '40 分鐘',
    title: '終極挑戰：遙控賽車', sub: '綜合所有技巧',
    goal: '用 PS2 手把全方位操控小車，跑完一圈賽道',
    need: ['MBC-jBot 小車', 'PS2 無線手把', '用膠帶貼一圈賽道'],
  },
];

// 一般頁面的頁首插圖（沒有就不顯示）
export const BANNERS = {
  '/guide/graphic-programming': { img: 'mode_install', alt: '在電腦安裝 MBC 圖控編程並匯入 jBot 積木包' },
  '/guide/faq': { img: 'faq', alt: '老師幫學生解決小車問題' },
  '/guide/low-level-code': { img: 'api_index', alt: '大朋友用 C++ 程式控制小車' },
  '/guide/videos': { img: 'videos', alt: '小車示範影片' },
  '/guide/store': { img: 'store', alt: 'jBot 配件與升級套件' },
  '/api/': { img: 'api_index', alt: '大朋友用 C++ 程式控制小車' },
  '/api/setup': { img: 'api_setup', alt: '小車接上電腦與充電' },
  '/api/motor': { img: 'api_motor', alt: '車輪、馬達與編碼器' },
  '/api/sensor': { img: 'api_sensor', alt: '小車的循線與測距感測器' },
  '/api/led-button': { img: 'api_led', alt: '彩燈、蜂鳴器與按鈕' },
  '/api/ps2-servo': { img: 'api_ps2', alt: 'PS2 手把與伺服馬達' },
};

export const norm = (p) => p.replace(/\.html$/, '').replace(/\/index$/, '/');
export const levelOf = (p) => LEVELS.find((l) => l.path === norm(p));
export const imgSrc = (name, small) => `/images/ai/${name}${small ? '-sm' : ''}.webp`;

// 過關紀錄只存在這台電腦的瀏覽器（localStorage），讀寫失敗就當作沒紀錄
const KEY = 'jbot-cleared';
export function loadCleared() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); }
}
export function saveCleared(set) {
  try { localStorage.setItem(KEY, JSON.stringify([...set])); } catch { /* 無痕視窗等情況，不記錄 */ }
}
