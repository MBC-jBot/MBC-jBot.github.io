# 💻 C++ 開發手冊總覽 (API Cheat Sheet)

歡迎來到 MBC-jBot 的底層控制殿堂！在這裡，我們捨棄了圖形積木，直接透過 C++ 程式碼解鎖小車 100% 的潛力。

為了讓您在開發時能快速查找指令，我們整理了以下的 API 速查表。如需詳細的範例與說明，請點擊左側導覽列對應的章節。

---

## 🚀 系統與初始化
| 函式名稱 | 用途說明 | 參數說明 |
| :--- | :--- | :--- |
| `Bot.begin()` | **必須呼叫**。初始化所有硬體腳位與感測器。 | 無 |
| `Bot.getBatteryVoltage()` | 讀取目前電池電壓數值，可用於電壓顯示。 | 回傳 `uint16_t` (0~1023 對應 0~5V) |

## 🏎️ 馬達與編碼器
| 函式名稱 | 用途說明 | 參數說明 |
| :--- | :--- | :--- |
| `Bot.setMotor(index, speed)` | 控制單邊馬達的轉速。 | `index`: `MOTOR_L`, `MOTOR_R`<br>`speed`: `-100` ~ `100`, 或 `BRAKE` |
| `Bot.setMotors(speedL, speedR)` | 同時控制左右兩顆馬達。 | 同上 |
| `Bot.getEncoder(index)` | 取得編碼器累積步數，用於精確計算移動距離。 | `index`: `ENC_L`, `ENC_R`, `ENC_AVG` |
| `Bot.resetEncoders(index)` | 將指定的編碼器步數歸零。 | `index`: `ENC_L`, `ENC_R`, `ENC_ALL` |

## 👁️ 感測器
| 函式名稱 | 用途說明 | 參數說明 |
| :--- | :--- | :--- |
| `Bot.readLineSensor(index)` | 讀取底部循線感測器的數值 (黑白反射率)。 | `index`: `SENSOR_L`, `SENSOR_R`<br>回傳值越大代表顏色越深 |
| `Bot.getDistance()` | 讀取前方雷射測距感測器 (VL53L0X) 的距離。 | 回傳 `uint16_t` (單位：公釐 mm) |

## 🌈 聲光與互動
| 函式名稱 | 用途說明 | 參數說明 |
| :--- | :--- | :--- |
| `Bot.setLED(index, r, g, b)` | 設定指定位置的 RGB LED 顏色。 | `index`: `0` (左), `1` (右), `2` (按鈕), `3` (後方)<br>`r, g, b`: `0` ~ `255` |
| `Bot.clearLEDs()` | 關閉所有手動設定的燈光。 | 無 |
| `Bot.isButtonPressed()` | 檢查車體上方的實體按鈕是否被按著。 | 回傳 `bool` (`true` 代表按下) |

## 🎮 PS2 遙控與伺服馬達
| 函式名稱 | 用途說明 | 參數說明 |
| :--- | :--- | :--- |
| `Bot.isPS2Connected()` | 檢查 PS2 接收器是否連接成功。 | 回傳 `bool` (`true` 代表已連接) |
| `Bot.isPS2ButtonPressed(mask)` | 檢查遙控器特定按鍵是否被按下。 | `mask`: 如 `PSB_CROSS`, `PSB_PAD_UP` 等 |
| `Bot.getPS2Stick(stick)` | 讀取遙控器搖桿的類比推動量 (0~255)。 | `stick`: `PSS_LX`, `PSS_LY`, `PSS_RX`, `PSS_RY` |
| `Bot.setServo(index, angle)` | 控制外接的伺服馬達轉動至指定角度。 | `index`: `SERVO_1`, `SERVO_2`<br>`angle`: `0` ~ `180` |
