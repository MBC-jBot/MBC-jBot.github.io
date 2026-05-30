# 感測器應用

MBC-jBot 搭載了先進的環境感知設備，讓它能看清前方的障礙物與地面的標線。

## 1. 雷射測距感測器 (Laser Distance)

> [!IMPORTANT]
> **配件購買提醒：** VL53L0X 雷射測距模組為選購配件，基礎款套件中並未附贈。若您需要使用此功能，請務必確認您已加購並安裝好該模組。

小車前方配備了一顆高階的 **VL53L0X** 雷射飛行時間 (ToF) 感測器。它不像傳統超音波感測器容易受到聲音干擾，能提供非常精準且穩定的距離數據。

### 取得前方障礙物距離 (`getDistance`)

呼叫這個函式會回傳前方障礙物的距離，**單位為毫米 (mm)**。

```cpp
// 語法：uint16_t Bot.getDistance();

uint16_t dist_mm = Bot.getDistance();

Serial.print("前方障礙物距離：");
Serial.print(dist_mm);
Serial.println(" mm");
```

> [!TIP]
> **防當機看門狗 (Watchdog)**
> 傳統的 Arduino I2C 程式一旦遇到感測器線路鬆脫，整個程式就會永遠卡死。但 MBC-jBot 的底層實作了嚴格的 `Timeout` 機制。如果雷射感測器發生異常，它會自動回傳 `65535` (錯誤碼) 或上一次的有效距離，絕不讓您的小車當機！

---

## 2. 雙通道循線感測器 (Line Sensor)

小車底部搭載了左右兩組類比紅外線感測器，專門用來分辨地面的深淺顏色（例如黑線與白底）。

### 讀取循線數值 (`readLineSensor`)

參數 `index` 必須填寫 `SENSOR_L` (左側) 或 `SENSOR_R` (右側)。
回傳的數值是類比訊號轉換結果（ADC 值）。數值越大代表顏色越深（例如黑線），數值越小代表顏色越淺（例如白底或懸空）。

```cpp
// 語法：uint16_t Bot.readLineSensor(感測器編號);

uint16_t leftVal = Bot.readLineSensor(SENSOR_L);
uint16_t rightVal = Bot.readLineSensor(SENSOR_R);

if (leftVal > 500) {
  // 左邊壓到黑線了！
}
```

> [!NOTE]
> **自動連動底盤燈光 (1號與2號燈)**
> 有趣的是，當您在程式中呼叫 `readLineSensor` 時，MBC-jBot 會自動把讀取到的地面深淺數值，**同步轉換成小車前方的「第1顆」與「第2顆」RGB 燈的亮度**！讀取到的數值越大（例如壓到黑線），對應的燈就越亮，讓您可以直接用肉眼「看見」感測器的狀態，這在除錯時非常方便！
