/**
   JBC_Bot.h - V50.14 (Bug fixes & LED toggle)
*/

#ifndef JBC_BOT_H
#define JBC_BOT_H

#include <Arduino.h>
#include <avr/io.h>
#include <avr/interrupt.h>
#include <util/atomic.h>

#ifndef TW_START
#define TW_START     0x08
#define TW_REP_START 0x10
#define TW_MT_SLA_ACK 0x18
#define TW_MR_SLA_ACK 0x40
#define TW_MT_DATA_ACK 0x28
#endif

// --- 硬體腳位定義 ---
#define PIN_UART_RX     0
#define PIN_UART_TX     1
#define PIN_ENC_L_A     2       
#define PIN_ENC_L_B     4       
#define PIN_ENC_R_A     3       
#define PIN_ENC_R_B     7       
#define PIN_MOTOR_L_PWM1 10     
#define PIN_MOTOR_L_PWM2 9      
#define PIN_LED_RGB     8       
#define PIN_MOTOR_R_PWM1 5      
#define PIN_MOTOR_R_PWM2 6     

#define PIN_SPI_MOSI    11 
#define PIN_SPI_MISO    12 
#define PIN_SPI_SCK     13 
#define PIN_PS2_SS      A0 

#define PIN_SERVO_1     A1
#define PIN_SERVO_2     A2
#define PIN_BAT_BTN     A3 
#define PIN_I2C_SDA     A4
#define PIN_I2C_SCL     A5
#define PIN_SENSOR_L    A7 
#define PIN_SENSOR_R    A6 

// --- 常數定義 ---
#define MOTOR_L 0
#define MOTOR_R 1
#define ENC_L 0
#define ENC_R 1
#define ENC_AVG 2 
#define ENC_ALL 3 
#define BRAKE 127
#define SENSOR_L 0
#define SENSOR_R 1
#define SERVO_1 0
#define SERVO_2 1

#define PSB_SELECT      0x0001
#define PSB_L3          0x0002
#define PSB_R3          0x0004
#define PSB_START       0x0008
#define PSB_PAD_UP      0x0010
#define PSB_PAD_RIGHT   0x0020
#define PSB_PAD_DOWN    0x0040
#define PSB_PAD_LEFT    0x0080
#define PSB_L2          0x0100
#define PSB_R2          0x0200
#define PSB_L1          0x0400
#define PSB_R1          0x0800
#define PSB_TRIANGLE    0x1000
#define PSB_CIRCLE      0x2000
#define PSB_CROSS       0x4000
#define PSB_SQUARE      0x8000
#define PSS_RX 0
#define PSS_RY 1
#define PSS_LX 2
#define PSS_LY 3

class JBC_Bot {
  public:
    JBC_Bot();
    void begin();                                       
    void setMotor(uint8_t index, int8_t speed);         
    void setMotors(int8_t speedL, int8_t speedR);       
    void resetEncoders(uint8_t index);                  
    void setLED(uint8_t index, uint8_t r, uint8_t g, uint8_t b);    
    void clearLEDs();                                   
    uint16_t readLineSensor(uint8_t index);             

    bool isPS2Connected();                              
    bool isPS2ButtonPressed(uint16_t mask);             
    uint8_t getPS2Stick(uint8_t stick);                 
    bool readPS2();

    uint8_t PS2data[9];
    uint16_t getDistance(); 

    inline int32_t getEncoder(uint8_t index) {          
      int32_t val;
      if (index == ENC_AVG) { 
        int32_t l, r;
        ATOMIC_BLOCK(ATOMIC_RESTORESTATE) {
          l = _encCount[0];
          r = _encCount[1];
        }
        val = (l + r) >> 1; 
      } else {
        ATOMIC_BLOCK(ATOMIC_RESTORESTATE) {
          val = _encCount[index & 1];
        }
      }
      return val;
    }

    inline void setServo(uint8_t index, uint8_t angle) {
      if (angle > 180) angle = 180;
      _servo_ticks[index & 1] = 31 + ((angle * 177) >> 8);
    }

    uint16_t _readADC(uint8_t channel);
    inline uint16_t getBatteryVoltage() {
      uint32_t val = _readADC(3);
      return (uint16_t)((val << 3) + (val << 1));
    }
    bool isButtonPressed();                              

    volatile int32_t _encCount[2];
    volatile uint8_t _lastPortD;
    volatile uint8_t _servo_ticks[2];

  private:
    uint8_t _ledBuffer[12];
    uint8_t _userLED0Color[3];
    uint8_t _userLED1Color[3];
    uint8_t _userLED2Color[3];
    uint8_t _userLED3Color[3];
    uint8_t _savedLED3[3];
    uint8_t _sensorLEDBrightness[2];
    uint8_t _laser_stop_variable;
    uint16_t _last_valid_dist;

    struct {
      bool lowBat : 1;
      bool ps2Connected : 1;
      bool ps2Active : 1;
      bool ledFlashState : 1;
      bool manualStatusLED : 1;
      bool ps2Configured : 1;
      bool lineSensorActive : 1;
      bool ps2Attempted : 1;
      bool laserInitialized : 1;
      bool buttonPressed : 1;
      bool i2cError : 1;
      bool manualLED0 : 1;
      bool manualLED1 : 1;
      bool manualLED2 : 1;
      bool led0Toggle : 1;
      bool led1Toggle : 1;
      bool led2Toggle : 1;
      bool led3Toggle : 1;
    } _status;

    unsigned long _lastFlashTime;
    unsigned long _lastPS2PollTime;

    void _updateLEDs();
    void _checkBattery();
    void _setMotorRaw(uint8_t index, int8_t speed);
    void _showLED_ASM();

    void _i2c_init();
    uint8_t _i2c_start(uint8_t address);
    void _i2c_stop();
    uint8_t _i2c_write(uint8_t data);
    uint8_t _i2c_read(uint8_t ack);
    void _i2c_writeReg(uint8_t reg, uint8_t val);
    void _i2c_writeReg16(uint8_t reg, uint16_t val);
    uint8_t _i2c_readReg(uint8_t reg);
    uint16_t _i2c_readReg16(uint8_t reg);
    void _initLaser();

    uint8_t _spiTransfer(uint8_t data);
    void _ps2_config();
    void _autoUpdatePS2();
    void _pollPS2Hardware();
};

extern JBC_Bot Bot;
#endif
