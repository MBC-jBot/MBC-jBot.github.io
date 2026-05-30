const body = `少伯創意機器人有限公司您好：

我想詢問關於 MBC-jBot 智能小車的相關事宜，以下是我的需求：

1. [ ] 產品採購 / 大量訂購詢問
2. [ ] 課程合作 / 講師培訓
3. [ ] 技術支援 / 產品報修
4. [ ] 經銷合作提案
5. 其他協助：

姓名：
聯絡電話：

（請在上方填寫您的需求，我們會盡快回覆您！）`;

const to = '少伯創意機器人有限公司 <contactmbcrobot@gmail.com>';

console.log('https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) + '&su=' + encodeURIComponent('【MBC-jBot 詢問】') + '&body=' + encodeURIComponent(body));
