/* eslint-disable func-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
function registerGenerators (Blockly) {
//=======================button=====================
    Blockly.Arduino.button_press = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        return [`Bot.isButtonPressed()`, Blockly.Arduino.ORDER_ATOMIC];
    };
//=======================Color Sensor=====================
    Blockly.Arduino.line_single = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const index = block.getFieldValue('INDEX');
        return [`Bot.readLineSensor(${index})`, Blockly.Arduino.ORDER_ATOMIC];
    };
//=======================motor=====================
    Blockly.Arduino.motor_run = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const type = this.getFieldValue('TYPE');
        const speed = Blockly.Arduino.valueToCode(block, 'SPEED', Blockly.Arduino.ORDER_ATOMIC) || '0';
        return `Bot.setMotor(${type}, ${speed});\n`;
    };

    Blockly.Arduino.motor_run2 = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const speed_l = Blockly.Arduino.valueToCode(block, 'SPEED_L', Blockly.Arduino.ORDER_ATOMIC) || '0';
        const speed_r = Blockly.Arduino.valueToCode(block, 'SPEED_R', Blockly.Arduino.ORDER_ATOMIC) || '0';
        return `Bot.setMotors(${speed_l}, ${speed_r});\n`;
    };

    Blockly.Arduino.motor_stop = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const type = this.getFieldValue('TYPE');
        const mode = this.getFieldValue('MODE');
        return `Bot.setMotor(${type}, ${mode});\n`;
    };

    Blockly.Arduino.motor_deg = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const type = this.getFieldValue('TYPE');
        return [`Bot.getEncoder(${type})`, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.motor_reset_deg = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const type = this.getFieldValue('TYPE');
        return `Bot.resetEncoders(${type});\n`;
    };

    Blockly.Arduino.speed_number = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const num = block.getFieldValue('NUM');
        return [`${num}`, Blockly.Arduino.ORDER_ATOMIC];
    };

//=======================RGB=====================
    Blockly.Arduino.LED_SetColor = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const index = Blockly.Arduino.valueToCode(block, 'INDEX', Blockly.Arduino.ORDER_ATOMIC) || '1';
        let colour = Blockly.Arduino.valueToCode(block, 'COLOR', Blockly.Arduino.ORDER_ATOMIC) || '0x000000';
        colour = colour.replace(/'/g, "").replace('#', '0x');
        const r = `(${colour} >> 16) & 0xFF`;
        const g = `(${colour} >> 8) & 0xFF`;
        const b = `${colour} & 0xFF`;
        return `Bot.setLED(${index} - 1, ${r}, ${g}, ${b});\n`;
    };

    Blockly.Arduino.LED_clear = function () {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        return `Bot.clearLEDs();\n`;
    };

    Blockly.Arduino.light = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const num = block.getFieldValue('NUM');
        return [`${num}`, Blockly.Arduino.ORDER_ATOMIC];
    };
//=======================SERVO=====================

    Blockly.Arduino.servo_deg = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const type = this.getFieldValue('TYPE');
        const deg = Blockly.Arduino.valueToCode(block, 'DEG', Blockly.Arduino.ORDER_ATOMIC) || '90';
        return `Bot.setServo(${type}, ${deg});\n`;
    };
    Blockly.Arduino.deg_number = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const num = block.getFieldValue('NUM');
        return [`${num}`, Blockly.Arduino.ORDER_ATOMIC];
    };
//=======================voltage=====================
    Blockly.Arduino.voltage_read = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        return [`Bot.getBatteryVoltage()`, Blockly.Arduino.ORDER_ATOMIC];
    };
//=========================PS2========================
    Blockly.Arduino.ps2_isConnected = function () {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        return [`Bot.isPS2Connected()`, Blockly.Arduino.ORDER_ATOMIC];
    };
    Blockly.Arduino.ps2_getButton = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const button = block.getFieldValue('BUTTON');
        return [`Bot.isPS2ButtonPressed(${button})`, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.ps2_GetJoystick = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const joystick = block.getFieldValue('JOYSTICK');
        return [`Bot.getPS2Stick(${joystick})`, Blockly.Arduino.ORDER_ATOMIC];
    };

//=======================VL53L0X5=====================
    Blockly.Arduino.VL53L0_readData = function () {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        return [`Bot.getDistance()`, Blockly.Arduino.ORDER_ATOMIC];
    };
//=======================OLED=====================

    Blockly.Arduino.oled_clear = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        Blockly.Arduino.setups_.oled_init = 'Bot.oled_begin();';
        return `Bot.oled_clear();\n`;
    };

    Blockly.Arduino.oled_print = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        Blockly.Arduino.setups_.oled_init = 'Bot.oled_begin();';
        const x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_ATOMIC) || '0';
        const y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_ATOMIC) || '0';
        const text = Blockly.Arduino.valueToCode(block, 'TEXT', Blockly.Arduino.ORDER_ATOMIC) || '""';
        return `Bot.oled_setCursor(${x},${y});\nBot.oled_print(${text});\n`;
    };

    Blockly.Arduino.oled_print_num = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        Blockly.Arduino.setups_.oled_init = 'Bot.oled_begin();';
        const x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_ATOMIC) || '0';
        const y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_ATOMIC) || '0';
        const num = Blockly.Arduino.valueToCode(block, 'NUM', Blockly.Arduino.ORDER_ATOMIC) || '0';
        return `Bot.oled_setCursor(${x},${y});\nBot.oled_print(${num});\n`; // 使用 int32_t 多載版本
    };
    Blockly.Arduino.axis_x = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const num = block.getFieldValue('NUM');
        return [`${num}`, Blockly.Arduino.ORDER_ATOMIC];
    };
    Blockly.Arduino.axis_y = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        const num = block.getFieldValue('NUM');
        return [`${num}`, Blockly.Arduino.ORDER_ATOMIC];
    };
//=======================SERIAL=====================
    Blockly.Arduino.Serial_Print = function (block) {
        Blockly.Arduino.includes_.jbc_bot = '#include "JBC_Bot.h"';
        Blockly.Arduino.setups_.jbc_bot = 'Bot.begin();';
        Blockly.Arduino.setups_.serial = 'Serial.begin(9600);';
        const ln = this.getFieldValue('ln');
        const TEXT = Blockly.Arduino.valueToCode(block, 'TEXT', Blockly.Arduino.ORDER_ATOMIC);
        return `Serial.print${ln}(${TEXT});\n`;
        
    };
    return Blockly;
}

exports = registerGenerators;