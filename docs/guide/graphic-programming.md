# 圖形化編程入門

這是專為初學者設計的教學，您不需要撰寫任何複雜的程式碼，只要透過拖拉積木，就能輕鬆控制智能小車！

## 第一步：下載與安裝軟體
在開始控制小車之前，我們需要先準備好寫程式的工具。
1. **下載主程式**：請下載符合您作業系統的安裝檔。
   * **Windows 使用者**：請安裝 `OpenBlock-Desktop_v2.6.3_win_x64.exe`
   * **Mac 使用者**：請安裝 `OpenBlock-Desktop_v2.6.3_mac_x64.7z`
2. **安裝擴充包**：您可以使用「一鍵快速安裝」，或是將擴充指令包的資料夾手動複製到主程式根目錄下（例如：`C:\OpenBlockDesktop\external-resources\extensions`）。

![擴充包安裝目錄](/images/tutorial/extension_dir.png)

> 📥 **軟體下載連結**：
> [點此下載主程式與擴充包](https://drive.google.com/drive/folders/1jJvmSl1R0mK_UXuw2hAYiLdEStOk1EM2?usp=drive_link)
> *(內含主程式安裝檔與專屬擴充包)*

## 第二步：安裝驅動與連線
1. 請拿出盒內的 **Type-C 傳輸線**。
2. 將一端插入小車的 Type-C 孔，另一端插入電腦的 USB 插孔。
3. **安裝驅動程式**：首次開啟程式，請點擊主程式右上方的「⚙️ 齒輪」圖案，選擇「安裝驅動程式」，確保 CH340 晶片能正確被電腦識別。

![安裝驅動](/images/tutorial/driver_install.png)

> 如果點擊後仍無法識別，您也可以手動下載 [👉 CH340 驅動程式](https://drive.google.com/drive/folders/1IQjFcSHTmrgY4PyfSliELT39hWaP1skf?usp=sharing) 進行安裝。

## 第三步：選擇主控板與擴充指令
為了讓軟體認識我們的小車，請依照以下步驟設定：

1. **調整為編程模式**：確保主程式處於「上傳模式」（如下圖箭頭處）。
![切換模式](/images/tutorial/mode_switch.png)

2. **選擇主控板**：點選左下角的「選擇設備」，在清單中找到並點擊 **「Arduino UNO」**。
![選擇設備](/images/tutorial/select_device.png)
![選擇 UNO](/images/tutorial/select_uno.png)

3. **添加擴充指令**：點選左下角的「添加擴展」，在選單中點擊 **「JBC_BOT」** 擴充積木。
![添加擴充](/images/tutorial/add_extension.png)
![添加 JBC_BOT](/images/tutorial/add_jbc.png)

設定完成後，您的畫面左側就會出現滿滿的綠色 JBC_BOT 專屬積木囉！
![正常畫面](/images/tutorial/normal_screen.png)

## 第四步：連接小車並讓它前進！
現在我們已經準備好軟體環境了。請點擊上方工具列的「連線」，選擇對應的 COM 序列埠完成連線！

連線成功後，試著將「前進」積木拖曳到畫面中央的「當 Arduino 啟動」方塊下方。接著，在「前進」積木旁邊，設定數值為 `2` 秒。

![第一支程式](/images/blocks/first_program.webp)

::: tip 🚀 程式執行提醒
程式下載（上傳）完成後，請記得**打開小車電源開關**，並按下車頂的**「啟動按鈕」**，小車才會開始執行您的程式喔！
:::


設定完成後，按下執行，看看小車是不是往前開了呢！
