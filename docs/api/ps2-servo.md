# PS2 遙控與伺服馬達

想要讓小車變成一台靈活的遙控車嗎？MBC-jBot 底層已內建完整的 SPI 無線通訊協定，支援標準的 PS2 無線遙控器手把！同時也具備控制伺服馬達（機械手臂、雲台）的能力。

## PS2 無線遙控器

我們的底層程式庫內建了智慧的「輪詢頻率限制 (Rate-limiting)」，確保每 16 毫秒最多只會跟無線接收器通訊一次，防止通訊阻塞或當機。

> [!TIP]
> **智慧連線指示燈 (4 號燈)**
> 小車硬體內建了極為直覺的連線狀態燈號！當您在程式中嘗試讀取 PS2 搖桿時，小車上的 **4 號燈**會自動反映接收器的狀態：
> *   🟨 **黃燈閃爍**：警告！PS2 接收器未插上，或搖桿未開機。
> *   🟩 **綠燈常亮**：接收器已插上且連線成功，等待操作中。
> *   🟦 **藍燈亮起**：偵測到搖桿按鈕正在被按下。
> 
> 這個設計讓您在撰寫遙控程式時，不需緊盯電腦螢幕，看車上的燈號就知道連線有沒有問題！

### 1. 檢查搖桿是否連線 (`isPS2Connected`)

在讀取任何按鍵之前，您應該先確認搖桿是否有開機且成功連線。

```cpp
if (Bot.isPS2Connected()) {
  // 搖桿已連線，可以開始讀取指令
} else {
  // 搖桿未連線，小車應該停下來等待
  Bot.setMotors(0, 0);
}
```

### 2. 讀取實體按鍵 (`isPS2ButtonPressed`)

判斷某個特定按鈕是否被「按住不放」。
您需要傳入預先定義好的常數（Mask）來指定要檢查哪顆按鈕，例如 `PSB_CROSS` (叉叉)、`PSB_SQUARE` (方塊)、`PSB_PAD_UP` (十字鍵上) 等等。

```cpp
// 語法：bool Bot.isPS2ButtonPressed(按鈕常數);

if (Bot.isPS2ButtonPressed(PSB_PAD_UP)) {
  Bot.setMotors(50, 50); // 按住上鍵時前進
} 
else if (Bot.isPS2ButtonPressed(PSB_PAD_DOWN)) {
  Bot.setMotors(-50, -50); // 按住下鍵時後退
}
```

### 3. 讀取類比搖桿 (`getPS2Stick`)

讀取香菇頭搖桿的推動幅度。
參數 `stick` 必須傳入常數：
*   `PSS_LX`: 左搖桿 X 軸 (左右)
*   `PSS_LY`: 左搖桿 Y 軸 (上下)
*   `PSS_RX`: 右搖桿 X 軸
*   `PSS_RY`: 右搖桿 Y 軸

回傳的數值介於 **0 到 255** 之間。
**注意：** 底層程式庫已經貼心地幫您做過 Y 軸反轉。當您把搖桿「往上推」時，數值會變大（接近 255）；「置中」時約為 128；「往下推」時數值變小（接近 0）。

```cpp
// 語法：uint8_t Bot.getPS2Stick(搖桿常數);

uint8_t speedY = Bot.getPS2Stick(PSS_LY); // 讀取左搖桿上下推動量

// 將 0~255 的搖桿值，轉換為 -100~100 的馬達速度
int8_t motorSpeed = map(speedY, 0, 255, -100, 100);

// 加上一個死區(Deadzone)防止搖桿置中誤差
if (abs(motorSpeed) < 10) motorSpeed = 0; 

Bot.setMotors(motorSpeed, motorSpeed);
```

---

## 伺服馬達 (Servo) 控制

小車主機板上預留了兩組伺服馬達插座 (`SERVO_1` 與 `SERVO_2`)，可用來控制超音波雲台或是小巧的機械夾爪。

### 設定馬達角度 (`setServo`)

與一般使用 `Servo.h` 會佔用中斷資源不同，MBC-jBot 自己撰寫了一套極致輕量化的 **Timer2** 狀態機來產生 PWM 訊號，完全不會干擾到編碼器或主程式運作！

參數說明：
*   `index`: 填寫常數 `SERVO_1` 或 `SERVO_2`。
*   `angle`: 想要轉動的角度 (範圍：`0` 到 `180`)。

```cpp
// 語法：Bot.setServo(伺服馬達編號, 角度);

Bot.setServo(SERVO_1, 90);  // 轉到正中央 90 度
delay(500);
Bot.setServo(SERVO_1, 180); // 轉到最右邊 180 度
```
