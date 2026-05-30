#include <JBC_Bot.h>

void setup() {
  // 初始化 JBC Bot 硬體與感測器
  Bot.begin();

  // 等待 1 秒鐘，讓小車放置平穩
  delay(1000);
}

void loop() {
  // 雙輪以 50% 速度前進 1 秒
  Bot.setMotors(50, 50);
  delay(1000);

  // 煞車停止 0.5 秒
  Bot.setMotors(BRAKE, BRAKE);
  delay(500);

  // 原地右轉 1 秒
  Bot.setMotors(50, -50);
  delay(1000);

  // 煞車停止 0.5 秒
  Bot.setMotors(BRAKE, BRAKE);
  delay(500);
}
