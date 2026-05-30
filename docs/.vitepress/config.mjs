import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "MBC-jBot",
  description: "超好玩的智能小車教學",
  themeConfig: {
    logo: '/images/company_logo.webp',
    search: {
      provider: 'local'
    },
    nav: [
      { text: '🎈 圖形化編程', link: '/guide/graphic-programming' },
      { text: '💻 C++ 開發手冊', link: '/api/' }
    ],
    socialLinks: [
      { icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="color: #00B900;"><path fill="currentColor" d="M24 10.304c0-5.369-5.383-9.738-12-9.738S0 4.935 0 10.304c0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.771.039 1.085l-.171 1.027c-.053.31-.242 1.192 1.045.652 1.288-.54 6.96-4.096 10.02-7.397C23.595 14.2 24 12.253 24 10.304zM10.231 13.06H7.369V7.545h.923v4.593h1.939v.922zm1.657 0h-.924V7.545h.924v5.515zm4.996-3.791l-2.127 3.791h-.923V7.545h.924v3.666l2.127-3.666h.924v5.515h-.925v-3.791zM18.823 8.467h-1.939v1.378h1.939v.923h-1.939v1.37h1.939v.922h-2.863V7.545h2.863v.922z"/></svg>' }, link: 'https://line.me/R/ti/p/@692vcvuk' },
      { icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>' }, link: 'https://mail.google.com/mail/?view=cm&fs=1&to=%E5%B0%91%E4%BC%AF%E5%89%B5%E6%84%8F%E6%A9%9F%E5%99%A8%E4%BA%BA%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%20%3Ccontactmbcrobot%40gmail.com%3E&su=%E3%80%90MBC-jBot%20%E8%A9%A2%E5%95%8F%E3%80%91&body=%E5%B0%91%E4%BC%AF%E5%89%B5%E6%84%8F%E6%A9%9F%E5%99%A8%E4%BA%BA%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%E6%82%A8%E5%A5%BD%EF%BC%9A%0A%0A%E6%88%91%E6%83%B3%E8%A9%A2%E5%95%8F%E9%97%9C%E6%96%BC%20MBC-jBot%20%E6%99%BA%E8%83%BD%E5%B0%8F%E8%BB%8A%E7%9A%84%E7%9B%B8%E9%97%9C%E4%BA%8B%E5%AE%9C%EF%BC%8C%E4%BB%A5%E4%B8%8B%E6%98%AF%E6%88%91%E7%9A%84%E9%9C%80%E6%B1%82%EF%BC%9A%0A%0A1.%20%5B%20%5D%20%E7%94%A2%E5%93%81%E6%8E%A1%E8%B3%BC%20%2F%20%E5%A4%A7%E9%87%8F%E8%A8%82%E8%B3%BC%E8%A9%A2%E5%95%8F%0A2.%20%5B%20%5D%20%E8%AA%B2%E7%A8%8B%E5%90%88%E4%BD%9C%20%2F%20%E8%AC%9B%E5%B8%AB%E5%9F%B9%E8%A8%93%0A3.%20%5B%20%5D%20%E6%8A%80%E8%A1%93%E6%94%AF%E6%8F%B4%20%2F%20%E7%94%A2%E5%93%81%E5%A0%B1%E4%BF%AE%0A4.%20%5B%20%5D%20%E7%B6%93%E9%8A%B7%E5%90%88%E4%BD%9C%E6%8F%90%E6%A1%88%0A5.%20%E5%85%B6%E4%BB%96%E5%8D%94%E5%8A%A9%EF%BC%9A%0A%0A%E5%A7%93%E5%90%8D%EF%BC%9A%0A%E8%81%AF%E7%B5%A1%E9%9B%BB%E8%A9%B1%EF%BC%9A%0A%0A%EF%BC%88%E8%AB%8B%E5%9C%A8%E4%B8%8A%E6%96%B9%E5%A1%AB%E5%AF%AB%E6%82%A8%E7%9A%84%E9%9C%80%E6%B1%82%EF%BC%8C%E6%88%91%E5%80%91%E6%9C%83%E7%9B%A1%E5%BF%AB%E5%9B%9E%E8%A6%86%E6%82%A8%EF%BC%81%EF%BC%89' },
      { icon: { svg: '<svg viewBox="0 0 130 24" width="130" height="24"><text x="0" y="16" font-size="12" fill="currentColor">少伯創意機器人有限公司</text></svg>' }, link: '#' }
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
