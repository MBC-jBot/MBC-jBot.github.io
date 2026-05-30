// [Board] Arduino Uno / Nano (ATmega328P 核心)
// [Core]  Arduino AVR Boards
// [IDE]   Arduino IDE 1.8.19
// [Version] V50.14 (Bug fixes & LED toggle)

#include "JBC_Bot.h"

JBC_Bot Bot;

ISR(PCINT2_vect) {
  uint8_t currentPIND = PIND;
  uint8_t lastPIND = Bot._lastPortD;
  uint8_t changed = currentPIND ^ lastPIND;

  if (changed & 0x0C) {
    int8_t dir = ((lastPIND >> 2) & 1) ^ ((currentPIND >> 3) & 1);
    int8_t other = ((currentPIND >> 2) & 1) ^ ((lastPIND >> 3) & 1);
    Bot._encCount[MOTOR_L] += (dir - other);
  }

  if (changed & 0x90) {
    int8_t dir = ((lastPIND >> 4) & 1) ^ ((currentPIND >> 7) & 1);
    int8_t other = ((currentPIND >> 4) & 1) ^ ((lastPIND >> 7) & 1);
    Bot._encCount[MOTOR_R] -= (dir - other);
  }

  Bot._lastPortD = currentPIND;
}

volatile uint8_t servo_state = 0;
volatile uint8_t servo_rest_counter = 0;

ISR(TIMER2_COMPA_vect) {
  switch (servo_state) {
  case 0:
    PORTC &= ~(1 << 1);
    PORTC |= (1 << 2);
    OCR2A = Bot._servo_ticks[1];
    TCNT2 = 0;
    servo_state = 1;
    break;
  case 1:
    PORTC &= ~(1 << 2);
    OCR2A = 250;
    TCNT2 = 0;
    servo_state = 2;
    servo_rest_counter = 0;
    break;
  default:
    servo_rest_counter++;
    if (servo_rest_counter > 3) {
      PORTC |= (1 << 1);
      OCR2A = Bot._servo_ticks[0];
      TCNT2 = 0;
      servo_state = 0;
    }
    break;
  }
}

JBC_Bot::JBC_Bot() {
  _encCount[0] = 0;
  _encCount[1] = 0;
  _servo_ticks[0] = 94;
  _servo_ticks[1] = 94;
  _lastFlashTime = 0;
  _status.lowBat = 0;
  _status.ps2Connected = 0;
  _status.ps2Active = 0;
  _status.laserInitialized = 0;
  _status.manualStatusLED = 0;
  _status.ps2Configured = 0;
  _status.lineSensorActive = 0;
  _status.ps2Attempted = 0;
  _status.buttonPressed = 0;
  _status.i2cError = 0;
  _status.manualLED0 = 0;
  _status.manualLED1 = 0;
  _status.manualLED2 = 0;
  _status.led0Toggle = 0;
  _status.led1Toggle = 0;
  _status.led2Toggle = 0;
  _status.led3Toggle = 0;

  _laser_stop_variable = 0;
  _last_valid_dist = 8190;

  _userLED0Color[0] = 0;
  _userLED0Color[1] = 0;
  _userLED0Color[2] = 0;
  _userLED1Color[0] = 0;
  _userLED1Color[1] = 0;
  _userLED1Color[2] = 0;
  _userLED2Color[0] = 0;
  _userLED2Color[1] = 0;
  _userLED2Color[2] = 0;
  _userLED3Color[0] = 0;
  _userLED3Color[1] = 0;
  _userLED3Color[2] = 0;
  _sensorLEDBrightness[0] = 0;
  _sensorLEDBrightness[1] = 0;
  _lastPS2PollTime = 0;

  PS2data[3] = 0xFF;
  PS2data[4] = 0xFF;
  PS2data[5] = 128;
  PS2data[6] = 128;
  PS2data[7] = 128;
  PS2data[8] = 128;

  _savedLED3[0] = 0;
  _savedLED3[1] = 0;
  _savedLED3[2] = 0;
}

void JBC_Bot::begin() {
  DDRD |= (1 << 5) | (1 << 6);
  DDRB |= (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3) | (1 << 5);
  DDRB &= ~(1 << 4);
  PORTB |= (1 << 4);
  PORTB |= (1 << 5);

  DDRC |= (1 << 0) | (1 << 1) | (1 << 2);
  PORTC |= (1 << 0);

  PORTD |= (1 << 2) | (1 << 3) | (1 << 4) | (1 << 7);

  TCCR0A = 0xA3;
  TCCR0B = 0x03;
  TCCR1A = 0xA1;
  TCCR1B = 0x09;
  ADCSRA = 0x86;

  PCICR |= (1 << PCIE2);
  PCMSK2 |= (1 << 2) | (1 << 3) | (1 << 4) | (1 << 7);
  _lastPortD = PIND;

  TCCR2A = 0;
  TCCR2B = 0x06;
  TIMSK2 |= (1 << OCIE2A);
  OCR2A = 100;

  SPCR = (1 << SPE) | (1 << DORD) | (1 << MSTR) | (1 << CPOL) | (1 << CPHA) |
         (1 << SPR1);
  SPSR = 0;

  _i2c_init();

  sei();
  clearLEDs();

  while (!isButtonPressed()) {
    if ((millis() >> 9) & 1) {
      _ledBuffer[6] = 10;
      _ledBuffer[7] = 10;
      _ledBuffer[8] = 0;
    } else {
      _ledBuffer[6] = 0;
      _ledBuffer[7] = 0;
      _ledBuffer[8] = 0;
    }
    _showLED_ASM();
    delay(10);
  }

  while (isButtonPressed()) {
    _ledBuffer[6] = 20;
    _ledBuffer[7] = 0;
    _ledBuffer[8] = 0;
    _showLED_ASM();
    delay(10);
  }

  clearLEDs();
  _status.buttonPressed = 0;
}

void JBC_Bot::_i2c_init() {
  TWBR = 72;
  TWSR = 0;
}

// 【V50.13 修改】將 NACK 狀態同樣視為錯誤並立起 i2cError 旗標
uint8_t JBC_Bot::_i2c_start(uint8_t address) {
  TWCR = (1 << TWINT) | (1 << TWSTA) | (1 << TWEN);
  uint32_t timeout = 0;
  while (!(TWCR & (1 << TWINT))) {
    if (++timeout > 50000) {
      _status.i2cError = 1;
      return 1;
    }
  }
  if ((TWSR & 0xF8) != TW_START && (TWSR & 0xF8) != TW_REP_START) {
    _status.i2cError = 1;
    return 1;
  }

  TWDR = address;
  TWCR = (1 << TWINT) | (1 << TWEN);
  timeout = 0;
  while (!(TWCR & (1 << TWINT))) {
    if (++timeout > 50000) {
      _status.i2cError = 1;
      return 1;
    }
  }
  // 檢查是否收到 ACK，若收到 NACK 則標記錯誤
  if ((TWSR & 0xF8) != TW_MT_SLA_ACK && (TWSR & 0xF8) != TW_MR_SLA_ACK) {
    _status.i2cError = 1;
    return 1;
  }
  return 0;
}

void JBC_Bot::_i2c_stop() {
  TWCR = (1 << TWINT) | (1 << TWSTO) | (1 << TWEN);
  for (volatile uint8_t i = 0; i < 100; i++)
    ;
}

uint8_t JBC_Bot::_i2c_write(uint8_t data) {
  TWDR = data;
  TWCR = (1 << TWINT) | (1 << TWEN);
  uint32_t timeout = 0;
  while (!(TWCR & (1 << TWINT))) {
    if (++timeout > 50000) {
      _status.i2cError = 1;
      return 1;
    }
  }
  uint8_t error = ((TWSR & 0xF8) != TW_MT_DATA_ACK);
  if (error) {
    _status.i2cError = 1;
  }
  return error;
}

uint8_t JBC_Bot::_i2c_read(uint8_t ack) {
  TWCR = (1 << TWINT) | (1 << TWEN) | (ack ? (1 << TWEA) : 0);
  uint32_t timeout = 0;
  while (!(TWCR & (1 << TWINT))) {
    if (++timeout > 50000) {
      _status.i2cError = 1;
      return 0;
    }
  }
  return TWDR;
}

void JBC_Bot::_i2c_writeReg(uint8_t reg, uint8_t val) {
  if (_i2c_start(0x52) == 0) {
    if (_i2c_write(reg) == 0) {
      _i2c_write(val);
    }
    _i2c_stop();
  } else {
    _i2c_stop();
  }
}

uint8_t JBC_Bot::_i2c_readReg(uint8_t reg) {
  uint8_t val = 0;
  if (_i2c_start(0x52) == 0) {
    if (_i2c_write(reg) == 0) {
      if (_i2c_start(0x53) == 0) {
        val = _i2c_read(0);
      }
    }
    _i2c_stop();
  }
  return val;
}

uint16_t JBC_Bot::_i2c_readReg16(uint8_t reg) {
  uint16_t val = 0;
  if (_i2c_start(0x52) == 0) {
    if (_i2c_write(reg) == 0) {
      if (_i2c_start(0x53) == 0) {
        val = (uint16_t)_i2c_read(1) << 8;
        val |= _i2c_read(0);
      }
    }
    _i2c_stop();
  }
  return val;
}

void JBC_Bot::_initLaser() {
  if (_status.laserInitialized)
    return;
  _status.i2cError = 0;
  _i2c_init();

  if (_i2c_readReg(0xC0) != 0xEE || _status.i2cError) {
    return;
  }
  _i2c_writeReg(0x88, 0x00);
  _i2c_writeReg(0x80, 0x01);
  _i2c_writeReg(0xFF, 0x01);
  _i2c_writeReg(0x00, 0x00);
  _laser_stop_variable = _i2c_readReg(0x91);
  _i2c_writeReg(0x00, 0x01);
  _i2c_writeReg(0xFF, 0x00);
  _i2c_writeReg(0x80, 0x00);
  _i2c_writeReg(0x0A, 0x04);
  _i2c_writeReg(0x84, 0x00);
  _i2c_writeReg(0x0B, 0x01);
  _i2c_writeReg(0x01, 0x01);
  _i2c_writeReg(0x00, 0x41);
  while (!(_i2c_readReg(0x13) & 0x07) && !_status.i2cError)
    ;
  _i2c_writeReg(0x0B, 0x01);
  _i2c_writeReg(0x01, 0x02);
  _i2c_writeReg(0x00, 0x01);
  while (!(_i2c_readReg(0x13) & 0x07) && !_status.i2cError)
    ;
  _i2c_writeReg(0x0B, 0x01);
  _i2c_writeReg(0x01, 0xE8);
  _i2c_writeReg(0x80, 0x01);
  _i2c_writeReg(0xFF, 0x01);
  _i2c_writeReg(0x00, 0x00);
  _i2c_writeReg(0x91, _laser_stop_variable);
  _i2c_writeReg(0x00, 0x01);
  _i2c_writeReg(0xFF, 0x00);
  _i2c_writeReg(0x80, 0x00);
  _i2c_writeReg(0x00, 0x02);

  if (!_status.i2cError)
    _status.laserInitialized = 1;
}

uint16_t JBC_Bot::getDistance() {
  if (!_status.laserInitialized)
    _initLaser();
  if (!_status.laserInitialized)
    return 65535;

  _status.i2cError = 0; // 每次讀取前重置錯誤旗標

  uint8_t status = _i2c_readReg(0x13);

  // 若發生 NACK 斷線或 Timeout，底層已經把 i2cError 設為 1，這裡直接攔截
  if (_status.i2cError) {
    _status.laserInitialized = 0;
    return 65535;
  }

  if (!(status & 0x07))
    return _last_valid_dist;

  uint16_t dist = _i2c_readReg16(0x1E);
  if (_status.i2cError) {
    _status.laserInitialized = 0;
    return 65535;
  }

  _i2c_writeReg(0x0B, 0x01);
  if (dist == 0 || dist > 8000)
    return _last_valid_dist;

  _last_valid_dist = dist;
  return dist;
}

uint16_t JBC_Bot::_readADC(uint8_t ch) {
  ADMUX = (1 << REFS0) | (ch & 0x07);
  ADCSRA |= (1 << ADSC);
  while (ADCSRA & (1 << ADSC))
    ;
  return ADC;
}

// 50->0.49V, 328->3.2V, 480->4.68V
void JBC_Bot::_checkBattery() {
  uint16_t adc = _readADC(3);
  if (adc < 50 || adc > 480)
    _status.lowBat = false;
  else if (adc < 328)
    _status.lowBat = true;
  else
    _status.lowBat = false;
}

void JBC_Bot::_setMotorRaw(uint8_t index, int8_t speed) {
  uint8_t pwm_val = 0;
  bool is_brake = (speed == BRAKE);

  if (!is_brake && speed != 0) {
    int16_t s = speed;
    if (s < 0)
      s = -s;
    if (s > 100)
      s = 100;

    pwm_val = (s << 1) + (s >> 1); // 2.5 * s
  }

  if (index == MOTOR_L) {
    if (is_brake) {
      OCR1A = 255;
      OCR1B = 255;
    } else if (speed > 0) {
      OCR1A = pwm_val;
      OCR1B = 0;
    } else if (speed < 0) {
      OCR1A = 0;
      OCR1B = pwm_val;
    } else {
      OCR1A = 0;
      OCR1B = 0;
    }
  }

  if (index == MOTOR_R) {
    if (is_brake) {
      OCR0B = 255;
      OCR0A = 255;
    } else if (speed > 0) {
      OCR0B = pwm_val;
      OCR0A = 0;
    } else if (speed < 0) {
      OCR0B = 0;
      OCR0A = pwm_val;
    } else {
      OCR0B = 0;
      OCR0A = 0;
    }
  }
}

void JBC_Bot::setMotor(uint8_t index, int8_t speed) {
  _checkBattery();
  _setMotorRaw(index, speed);
  _updateLEDs();
}

void JBC_Bot::setMotors(int8_t speedL, int8_t speedR) {
  _checkBattery();
  _setMotorRaw(MOTOR_L, speedL);
  _setMotorRaw(MOTOR_R, speedR);
  _updateLEDs();
}

void JBC_Bot::resetEncoders(uint8_t index) {
  ATOMIC_BLOCK(ATOMIC_RESTORESTATE) {
    if (index == ENC_L || index == ENC_ALL)
      _encCount[0] = 0;
    if (index == ENC_R || index == ENC_ALL)
      _encCount[1] = 0;
  }
}

uint16_t JBC_Bot::readLineSensor(uint8_t index) {
  uint8_t i = index & 1;
  uint16_t val = _readADC(i == 0 ? 7 : 6);
  int16_t temp = val - 100;
  if (temp < 0)
    temp = 0;

  int8_t br = temp >> 5;
  if (br > 20)
    br = 20;

  _status.lineSensorActive = 1;
  _sensorLEDBrightness[i] = br;

  // 感應器 0(左) → LED 0, 感應器 1(右) → LED 1
  uint8_t offset = (i << 1) + i;
  _ledBuffer[offset] = 0;
  _ledBuffer[offset + 1] = br;
  _ledBuffer[offset + 2] = 0;
  _updateLEDs();
  return val;
}

void JBC_Bot::setLED(uint8_t index, uint8_t r, uint8_t g, uint8_t b) {
  if (index > 3)
    return;

  uint8_t os = (index << 1) + index;
  _ledBuffer[os] = g;
  _ledBuffer[os + 1] = r;
  _ledBuffer[os + 2] = b;

  if (index == 0) {
    _userLED0Color[0] = r;
    _userLED0Color[1] = g;
    _userLED0Color[2] = b;
    _status.manualLED0 = 1;
  } else if (index == 1) {
    _userLED1Color[0] = r;
    _userLED1Color[1] = g;
    _userLED1Color[2] = b;
    _status.manualLED1 = 1;
  } else if (index == 2) {
    _userLED2Color[0] = r;
    _userLED2Color[1] = g;
    _userLED2Color[2] = b;
    _status.manualLED2 = 1;
  } else if (index == 3) {
    _userLED3Color[0] = r;
    _userLED3Color[1] = g;
    _userLED3Color[2] = b;
    _status.manualStatusLED = 1;
  }
  _updateLEDs();
}

void JBC_Bot::clearLEDs() {
  for (int i = 0; i < 12; i++)
    _ledBuffer[i] = 0;
  _status.lineSensorActive = 0;
  _status.manualLED0 = 0;
  _status.manualLED1 = 0;
  _status.manualLED2 = 0;
  _status.manualStatusLED = 0;
  _showLED_ASM();
}

bool JBC_Bot::isButtonPressed() {
  bool pressed = (_readADC(3) < 50);

  if (pressed != _status.buttonPressed) {
    _status.buttonPressed = pressed;
    _updateLEDs();
  }

  return pressed;
}

void JBC_Bot::_updateLEDs() {
  uint8_t *p = _ledBuffer;

  if (_status.lowBat) {
    uint8_t val = ((millis() >> 9) & 1) ? 50 : 0;
    p[0] = 0;
    p[1] = val;
    p[2] = 0;
    p[3] = 0;
    p[4] = val;
    p[5] = 0;
    p[6] = 0;
    p[7] = val;
    p[8] = 0;
    p[9] = 0;
    p[10] = val;
    p[11] = 0;
    _showLED_ASM();
    return;
  }

  // --- LED 0 切換邏輯 (對應左感應器 sensorLEDBrightness[0]) ---
  if (_status.lineSensorActive && _status.manualLED0) {
    _status.led0Toggle = !_status.led0Toggle;
    if (_status.led0Toggle) {
      _ledBuffer[0] = _userLED0Color[1];
      _ledBuffer[1] = _userLED0Color[0];
      _ledBuffer[2] = _userLED0Color[2];
    } else {
      _ledBuffer[0] = 0;
      _ledBuffer[1] = _sensorLEDBrightness[0];
      _ledBuffer[2] = 0;
    }
  }

  // --- LED 1 切換邏輯 (對應右感應器 sensorLEDBrightness[1]) ---
  if (_status.lineSensorActive && _status.manualLED1) {
    _status.led1Toggle = !_status.led1Toggle;
    if (_status.led1Toggle) {
      _ledBuffer[3] = _userLED1Color[1];
      _ledBuffer[4] = _userLED1Color[0];
      _ledBuffer[5] = _userLED1Color[2];
    } else {
      _ledBuffer[3] = 0;
      _ledBuffer[4] = _sensorLEDBrightness[1];
      _ledBuffer[5] = 0;
    }
  }

  // --- LED 2 (Button) 切換邏輯 ---
  if (_status.buttonPressed && !_status.manualLED2) {
    _ledBuffer[6] = 20;
    _ledBuffer[7] = 20;
    _ledBuffer[8] = 0;
  } else if (_status.buttonPressed && _status.manualLED2) {
    _status.led2Toggle = !_status.led2Toggle;
    if (_status.led2Toggle) {
      _ledBuffer[6] = _userLED2Color[1];
      _ledBuffer[7] = _userLED2Color[0];
      _ledBuffer[8] = _userLED2Color[2];
    } else {
      _ledBuffer[6] = 20;
      _ledBuffer[7] = 20;
      _ledBuffer[8] = 0;
    }
  } else if (!_status.buttonPressed && _status.manualLED2) {
    _ledBuffer[6] = _userLED2Color[1];
    _ledBuffer[7] = _userLED2Color[0];
    _ledBuffer[8] = _userLED2Color[2];
  } else {
    _ledBuffer[6] = 0;
    _ledBuffer[7] = 0;
    _ledBuffer[8] = 0;
  }

  // --- LED 3 切換邏輯 ---
  if (_status.ps2Attempted && !_status.manualStatusLED) {
    // PS2 已介入，使用者從未 setLED(3,...) → 純 PS2 控制
    if (_status.ps2Connected) {
      if (_status.ps2Active) {
        _ledBuffer[9] = 0;
        _ledBuffer[10] = 0;
        _ledBuffer[11] = 50;
      } else {
        _ledBuffer[9] = 20;
        _ledBuffer[10] = 0;
        _ledBuffer[11] = 0;
      }
    } else {
      if ((millis() >> 9) & 1) {
        _ledBuffer[9] = 20;
        _ledBuffer[10] = 20;
        _ledBuffer[11] = 0;
      } else {
        _ledBuffer[9] = 0;
        _ledBuffer[10] = 0;
        _ledBuffer[11] = 0;
      }
    }
  } else if (_status.ps2Attempted && _status.manualStatusLED) {
    // 使用者與 PS2 同時活躍 → 交替切換
    _status.led3Toggle = !_status.led3Toggle;
    if (_status.led3Toggle) {
      _ledBuffer[9] = _userLED3Color[1];
      _ledBuffer[10] = _userLED3Color[0];
      _ledBuffer[11] = _userLED3Color[2];
    } else {
      if (_status.ps2Connected) {
        if (_status.ps2Active) {
          _ledBuffer[9] = 0;
          _ledBuffer[10] = 0;
          _ledBuffer[11] = 50;
        } else {
          _ledBuffer[9] = 20;
          _ledBuffer[10] = 0;
          _ledBuffer[11] = 0;
        }
      } else {
        if ((millis() >> 9) & 1) {
          _ledBuffer[9] = 20;
          _ledBuffer[10] = 20;
          _ledBuffer[11] = 0;
        } else {
          _ledBuffer[9] = 0;
          _ledBuffer[10] = 0;
          _ledBuffer[11] = 0;
        }
      }
    }
  }

  _showLED_ASM();
}

void JBC_Bot::_showLED_ASM() {
  uint8_t *ptr = _ledBuffer;
  uint16_t n = 12;
  volatile uint8_t *port = &PORTB;
  uint8_t pinMask = 1;
  uint8_t hi = PORTB | pinMask;
  uint8_t lo = PORTB & ~pinMask;

  ATOMIC_BLOCK(ATOMIC_RESTORESTATE) {
    asm volatile("head20:\n\t"
                 "ld __tmp_reg__, %a0+\n\t"
                 "ldi r24, 8\n\t"
                 "nextbit20:\n\t"
                 "st %a1, %2\n\t"
                 "sbrs __tmp_reg__, 7\n\t"
                 "rjmp wait20\n\t"
                 "nop\n\t"
                 "nop\n\t"
                 "nop\n\t"
                 "nop\n\t"
                 "nop\n\t"
                 "st %a1, %2\n\t"
                 "rjmp bit1_end20\n\t"
                 "wait20:\n\t"
                 "st %a1, %3\n\t"
                 "nop\n\t"
                 "nop\n\t"
                 "bit1_end20:\n\t"
                 "nop\n\t"
                 "st %a1, %3\n\t"
                 "nop\n\t"
                 "nop\n\t"
                 "lsl __tmp_reg__\n\t"
                 "dec r24\n\t"
                 "brne nextbit20\n\t"
                 "dec %4\n\t"
                 "brne head20\n\t"
                 : "+z"(ptr)
                 : "e"(port), "r"(hi), "r"(lo), "r"(n)
                 : "r24");
  }
  _delay_us(80);
}

uint8_t JBC_Bot::_spiTransfer(uint8_t data) {
  SPDR = data;
  while (!(SPSR & (1 << SPIF)))
    ;
  return SPDR;
}

void JBC_Bot::_ps2_config() {
  PORTC &= ~(1 << 0);
  delayMicroseconds(20);
  _spiTransfer(0x01);
  _spiTransfer(0x43);
  _spiTransfer(0x00);
  _spiTransfer(0x01);
  _spiTransfer(0x00);
  PORTC |= (1 << 0);
  delay(10);

  PORTC &= ~(1 << 0);
  delayMicroseconds(20);
  _spiTransfer(0x01);
  _spiTransfer(0x44);
  _spiTransfer(0x00);
  _spiTransfer(0x01);
  _spiTransfer(0x03);
  _spiTransfer(0x00);
  _spiTransfer(0x00);
  _spiTransfer(0x00);
  _spiTransfer(0x00);
  PORTC |= (1 << 0);
  delay(10);

  PORTC &= ~(1 << 0);
  delayMicroseconds(20);
  _spiTransfer(0x01);
  _spiTransfer(0x43);
  _spiTransfer(0x00);
  _spiTransfer(0x00);
  _spiTransfer(0x5A);
  _spiTransfer(0x5A);
  _spiTransfer(0x5A);
  _spiTransfer(0x5A);
  _spiTransfer(0x5A);
  PORTC |= (1 << 0);
  delay(10);
}

void JBC_Bot::_autoUpdatePS2() {
  _status.ps2Attempted = 1;
  if (millis() - _lastPS2PollTime >= 16) {
    _pollPS2Hardware();
    _lastPS2PollTime = millis();
  }
}

void JBC_Bot::_pollPS2Hardware() {
  _status.ps2Attempted = 1;

  PORTC &= ~(1 << 0);
  delayMicroseconds(50);

  _spiTransfer(0x01);
  delayMicroseconds(10);
  uint8_t mode = _spiTransfer(0x42);
  delayMicroseconds(10);
  _spiTransfer(0x00);
  delayMicroseconds(10);

  PS2data[3] = _spiTransfer(0x00);
  delayMicroseconds(10);
  PS2data[4] = _spiTransfer(0x00);
  delayMicroseconds(10);
  PS2data[5] = _spiTransfer(0x00);
  delayMicroseconds(10);
  PS2data[6] = _spiTransfer(0x00);
  delayMicroseconds(10);
  PS2data[7] = _spiTransfer(0x00);
  delayMicroseconds(10);
  PS2data[8] = _spiTransfer(0x00);

  PORTC |= (1 << 0);

  if (mode == 0xFF || mode == 0x00) {
    _status.ps2Connected = false;
    _status.ps2Configured = false;
  } else {
    _status.ps2Connected = true;
    if (mode != 0x73 && !_status.ps2Configured) {
      _ps2_config();
      _status.ps2Configured = true;
    }
  }

  bool active = false;
  if (PS2data[3] != 0xFF || PS2data[4] != 0xFF)
    active = true;

  if (mode == 0x73) {
    if (abs(PS2data[5] - 128) > 20 || abs(PS2data[6] - 128) > 20 ||
        abs(PS2data[7] - 128) > 20 || abs(PS2data[8] - 128) > 20)
      active = true;
  }

  _status.ps2Active = active;
  _updateLEDs();
}

bool JBC_Bot::isPS2Connected() {
  _autoUpdatePS2();
  return _status.ps2Connected;
}

bool JBC_Bot::isPS2ButtonPressed(uint16_t mask) {
  _autoUpdatePS2();
  if (!_status.ps2Connected)
    return false;
  uint16_t buttons = (PS2data[4] << 8) | PS2data[3];
  return (~buttons & mask);
}

uint8_t JBC_Bot::getPS2Stick(uint8_t stick) {
  _autoUpdatePS2();
  if (!_status.ps2Connected)
    return 128;
  if (stick > 3)
    return 128;

  uint8_t raw_val = PS2data[5 + stick];

  if (stick == PSS_RY || stick == PSS_LY) {
    return 255 - raw_val;
  }

  return raw_val;
}

bool JBC_Bot::readPS2() {
  _pollPS2Hardware();
  return _status.ps2Connected;
}
