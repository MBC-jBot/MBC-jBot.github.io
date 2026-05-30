import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "🤖 MBC-jBot",
  description: "超好玩的智能小車教學",
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: '🎈 圖形化編程', link: '/guide/graphic-programming' },
      { text: '💻 C++ 開發手冊', link: '/api/' }
    ],
    socialLinks: [
      { icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="color: #00B900;"><path fill="currentColor" d="M24 10.304c0-5.369-5.383-9.738-12-9.738S0 4.935 0 10.304c0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.771.039 1.085l-.171 1.027c-.053.31-.242 1.192 1.045.652 1.288-.54 6.96-4.096 10.02-7.397C23.595 14.2 24 12.253 24 10.304zM10.231 13.06H7.369V7.545h.923v4.593h1.939v.922zm1.657 0h-.924V7.545h.924v5.515zm4.996-3.791l-2.127 3.791h-.923V7.545h.924v3.666l2.127-3.666h.924v5.515h-.925v-3.791zM18.823 8.467h-1.939v1.378h1.939v.923h-1.939v1.37h1.939v.922h-2.863V7.545h2.863v.922z"/></svg>' }, link: 'https://line.me/R/ti/p/@692vcvuk' },
      { icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>' }, link: 'https://mail.google.com/mail/?view=cm&fs=1&to=mbc.robot89@gmail.com' }
    ],

    sidebar: [
      {
        text: '🤖 認識 MBC-jBot',
        items: [
          { text: '硬體功能總覽', link: '/api/' }
        ]
      },
      {
        text: '🎈 基礎入門',
        items: [
          { text: '環境準備與連線', link: '/guide/graphic-programming' },
          { text: '1. 馬達與精確移動', link: '/guide/blocks/motor' },
          { text: '2. 聲光與螢幕顯示', link: '/guide/blocks/display' },
          { text: '3. 感測器與按鈕', link: '/guide/blocks/sensor' },
          { text: '4. PS2 遙控與伺服馬達', link: '/guide/blocks/remote' },
          { text: '5. 進階：序列埠與編碼器', link: '/guide/blocks/advanced' },
          { text: '6. 下載第一個程式試試看吧', link: '/guide/blocks/first-program' }
        ]
      },
      {
        text: '💻 C++ 開發手冊',
        items: [
          { text: '環境安裝與初始化', link: '/api/setup' },
          { text: '馬達與編碼器', link: '/api/motor' },
          { text: '感測器應用', link: '/api/sensor' },
          { text: '聲光與互動', link: '/api/led-button' },
          { text: 'PS2 遙控與伺服馬達', link: '/api/ps2-servo' }
        ]
      },
      {
        text: '📺 學習示範影片',
        items: [
          { text: '示範影片總覽', link: '/guide/videos' }
        ]
      },
      {
        text: '🛒 加購專區',
        items: [
          { text: '配件加購與升級', link: '/guide/store' }
        ]
      }
    ]
  }
})
