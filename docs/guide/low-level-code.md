# 底層代碼控制指南

如果您熟悉 C++ 或 Python，您可以直接透過底層代碼解鎖智能小車的全部潛力。

## 開發環境設置
請確保您的電腦已經安裝了對應的驅動程式與開發工具（例如 Arduino IDE 或 VSCode）。

## 基礎前進控制範例

以下是透過底層代碼讓小車前進的基本範例：

```cpp
#include <JBC_Bot.h>

void setup() {
  Bot.begin();
}

void loop() {
  Bot.setMotors(100, 100); // 100為最高速度值，讓小車前進
  delay(2000);             // 持續兩秒
  Bot.setMotors(BRAKE, BRAKE); // 緊急煞車
  delay(1000);
}
```

這段程式碼會讓小車以最高速度前進兩秒，然後停止一秒，接著不斷重複這個動作。
